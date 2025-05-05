document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const canvas = document.getElementById('annotation-canvas');
    const ctx = canvas.getContext('2d');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const imageCounter = document.getElementById('image-counter');
    // const brushColor = document.getElementById('brush-color');
    const brushSize = document.getElementById('brush-size');
    const sizeValue = document.getElementById('size-value');
    const clearBtn = document.getElementById('clear-btn');
    const submitBtn = document.getElementById('submit-btn');
    const statusMessage = document.getElementById('status-message');

    // State variables
    let currentImageIndex = 0;
    let images = [];
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentImage = new Image();
    let points = []; // Store points for smooth interpolation
    let animationFrameId = null;
    
    // Create a separate canvas for storing annotations
    const annotationLayer = document.createElement('canvas');
    const annotationCtx = annotationLayer.getContext('2d');

    // Initialize brush settings
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Function to fetch list of images
    async function fetchImageList() {
        try {
            // In a real GitHub Pages environment, you would need to hardcode the image list
            // or use a JSON file since direct directory listing isn't available
            // For demonstration purposes, we'll simulate a list of images
            
            // Example list - in production replace this with your actual images
            images = [
                'img/sample1.jpeg',
                'img/sample2.jpeg'
            ];
            
            imageCounter.textContent = `Image: ${currentImageIndex + 1} of ${images.length}`;
            loadImage(images[currentImageIndex]);
        } catch (error) {
            console.error('Error fetching image list:', error);
            statusMessage.textContent = 'Error loading images. Please try again.';
            statusMessage.className = 'error';
        }
    }

    // Function to load an image onto the canvas
    function loadImage(src) {
        currentImage = new Image();
        currentImage.onload = function() {
            // Resize canvas to fit the image while maintaining aspect ratio
            const containerWidth = canvas.parentElement.clientWidth;
            const containerHeight = canvas.parentElement.clientHeight;
            
            let canvasWidth = currentImage.width;
            let canvasHeight = currentImage.height;
            
            // Scale down if needed to fit container
            const ratio = Math.min(
                containerWidth / canvasWidth,
                containerHeight / canvasHeight
            );
            
            if (ratio < 1) {
                canvasWidth *= ratio;
                canvasHeight *= ratio;
            }
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Set up the annotation layer with the same dimensions
            annotationLayer.width = canvasWidth;
            annotationLayer.height = canvasHeight;
            
            // Draw the image on the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(currentImage, 0, 0, canvasWidth, canvasHeight);
            
            // Clear the annotation layer
            annotationCtx.clearRect(0, 0, annotationLayer.width, annotationLayer.height);
            
            // Update navigation buttons
            prevBtn.disabled = currentImageIndex === 0;
            nextBtn.disabled = currentImageIndex === images.length - 1;
        };
        currentImage.src = src;
    }

    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        const [x, y] = getMousePos(canvas, e);
        points = [{ x, y }]; // Start with first point
        lastX = x;
        lastY = y;
        
        // Start animation frame for smooth drawing
        if (animationFrameId === null) {
            animationFrameId = requestAnimationFrame(renderPoints);
        }
    }

    // Calculate points between two coordinates using Bezier curve
    function getPointsBetween(p1, p2) {
        const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const numPoints = Math.max(Math.floor(distance / 2), 1); // Adjust for desired smoothness
        const points = [];
        
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            points.push({
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            });
        }
        return points;
    }

    // Smooth bezier curve through points
    function drawSmoothLine(ctx, points) {
        if (points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        // For points that are close enough, draw direct lines
        if (points.length === 2) {
            ctx.lineTo(points[1].x, points[1].y);
        } else {
            // For multiple points, use quadratic curves for smoothing
            for (let i = 1; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i+1].x) / 2;
                const yc = (points[i].y + points[i+1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            
            // Connect to the last point
            const lastPoint = points[points.length - 1];
            ctx.lineTo(lastPoint.x, lastPoint.y);
        }
        
        ctx.stroke();
    }

    // Render points using requestAnimationFrame for smooth animation
    function renderPoints() {
        if (points.length > 0) {
            // Draw on the annotation layer
            annotationCtx.globalAlpha = 0.5;  // 50% opacity
            annotationCtx.strokeStyle = "#ff0000";  // Red color
            annotationCtx.lineWidth = brushSize.value;
            annotationCtx.lineCap = 'round';
            annotationCtx.lineJoin = 'round';
            
            // Draw smooth line with all collected points
            drawSmoothLine(annotationCtx, points);
            
            // Reset opacity
            annotationCtx.globalAlpha = 1.0;
            
            // Redraw everything to the main canvas
            redrawCanvas();
            
            // Clear points after drawing
            if (!isDrawing) {
                points = [];
                animationFrameId = null;
            } else {
                animationFrameId = requestAnimationFrame(renderPoints);
            }
        } else if (isDrawing) {
            // If drawing but no new points yet, continue animation
            animationFrameId = requestAnimationFrame(renderPoints);
        } else {
            // Stop animation if not drawing and no points
            animationFrameId = null;
        }
    }

    // Throttle function to limit how often an event fires
    function throttle(callback, delay) {
        let previousCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - previousCall >= delay) {
                previousCall = now;
                callback.apply(this, args);
            }
        };
    }

    // Throttled draw function for mouse/touch move events
    const throttledDraw = throttle(function(e) {
        if (!isDrawing) return;
        
        const [x, y] = getMousePos(canvas, e);
        
        // Add new point
        const newPoint = { x, y };
        
        // Add intermediate points for smoother lines
        if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            // Only add intermediate points if the distance is significant
            const distance = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2));
            
            if (distance > 5) { // Minimum distance threshold
                const intermediatePoints = getPointsBetween(lastPoint, newPoint);
                points = points.concat(intermediatePoints.slice(1)); // Skip first point as it's a duplicate
            } else {
                points.push(newPoint);
            }
        } else {
            points.push(newPoint);
        }
        
        lastX = x;
        lastY = y;
    }, 5); // 5ms throttle for smoother performance

    // Function to redraw the canvas (base image + annotations + cursor)
    function redrawCanvas() {
        // Clear main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw base image
        ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
        
        // Draw annotations on top
        ctx.drawImage(annotationLayer, 0, 0);
        
        // If mouse is over canvas and not drawing, draw cursor
        if (!isDrawing && lastX >= 0 && lastY >= 0 && 
            lastX <= canvas.width && lastY <= canvas.height) {
            drawCursor(lastX, lastY);
        }
    }

    // Function to draw the circular cursor
    function drawCursor(x, y) {
        // Save current drawing state
        ctx.save();
        
        // Draw filled circle with red at 30% opacity
        ctx.beginPath();
        ctx.arc(x, y, brushSize.value, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 0, 1.0)';
        ctx.fill();
        
        // Restore drawing state
        ctx.restore();
    }

    // Track mouse position for cursor with throttling
    const throttledMouseMove = throttle((e) => {
        const [x, y] = getMousePos(canvas, e);
        lastX = x;
        lastY = y;
        
        if (!isDrawing) {
            redrawCanvas();
        }
    }, 16); // ~60fps (1000ms/60 ≈ 16ms)

    // Make sure the cursor disappears when leaving the canvas
    canvas.addEventListener('mouseout', () => {
        if (!isDrawing) {
            // Set cursor position to invalid so it won't be drawn
            lastX = -1;
            lastY = -1;
            redrawCanvas();
        }
    });

    function stopDrawing() {
        isDrawing = false;
        // Ensure all points are rendered before stopping
        if (animationFrameId !== null) {
            requestAnimationFrame(renderPoints);
        }
    }

    // Helper function to get mouse position relative to canvas
    function getMousePos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        return [
            (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        ];
    }

    function clearAnnotation() {
        // Clear the annotation layer
        annotationCtx.clearRect(0, 0, annotationLayer.width, annotationLayer.height);
        
        // Redraw the canvas
        redrawCanvas();
    }

    // Add this script tag to your HTML file, just before the closing </body> tag
    // <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>

    // Modify the saveAnnotation function to send an email with the image as attachment
    function saveAnnotation() {
        try {
            // Get the current image name without path and extension
            const fullImageName = images[currentImageIndex];
            const imageName = fullImageName.split('/').pop().split('.')[0];
            
            // Create timestamp for the filename
            const now = new Date();
            const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
            const fileName = `${imageName}_annotated_${timestamp}.png`;
            
            // Create a temporary canvas for the binary mask
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Get the image data from our annotation layer
            const imageData = annotationCtx.getImageData(0, 0, annotationLayer.width, annotationLayer.height);
            const data = imageData.data;
            
            // Create a new imageData for the binary mask
            const binaryImageData = tempCtx.createImageData(canvas.width, canvas.height);
            const binaryData = binaryImageData.data;
            
            // For each pixel, check if it has annotation (red with some opacity)
            // If it does, set it to white (1), otherwise set to black (0)
            for (let i = 0; i < data.length; i += 4) {
                // Check if pixel has red component with some opacity
                if (data[i] > 0 && data[i+3] > 0) {
                    // White pixel (1)
                    binaryData[i] = 255;     // R
                    binaryData[i+1] = 255;   // G
                    binaryData[i+2] = 255;   // B
                    binaryData[i+3] = 255;   // A
                } else {
                    // Black pixel (0)
                    binaryData[i] = 0;       // R
                    binaryData[i+1] = 0;     // G
                    binaryData[i+2] = 0;     // B
                    binaryData[i+3] = 255;   // A
                }
            }
        
            // Put the binary data onto the temporary canvas
            tempCtx.putImageData(binaryImageData, 0, 0);
            
            // Get the binary mask as data URL
            const dataURL = tempCanvas.toDataURL('image/png');
            
            // Create a temporary link to download the image (keep the original functionality)
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show status message for local download
            statusMessage.textContent = 'Binary annotation mask saved locally. Please, send it to giacomociro@gmail.com :)';
            statusMessage.className = 'info';
            
        } catch (error) {
            console.error('Error saving annotation:', error);
            statusMessage.textContent = 'Error saving annotation.';
            statusMessage.className = 'error';
        }
    }

    // Add this to your document's DOMContentLoaded event handler to load the EmailJS library
    document.addEventListener('DOMContentLoaded', () => {
        // ... existing code ...
        
        // Load the EmailJS library
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.type = 'text/javascript';
        document.body.appendChild(script);
    });

    // Helper function to convert dataURL to Blob (for server upload)
    function dataURLToBlob(dataURL) {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        
        return new Blob([uInt8Array], { type: contentType });
    }

    // Navigation functions
    function goToPrevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            imageCounter.textContent = `Image: ${currentImageIndex + 1} of ${images.length}`;
            loadImage(images[currentImageIndex]);
        }
    }

    function goToNextImage() {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            imageCounter.textContent = `Image: ${currentImageIndex + 1} of ${images.length}`;
            loadImage(images[currentImageIndex]);
        }
    }

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', throttledDraw); // Use throttled draw
    canvas.addEventListener('mousemove', throttledMouseMove); // Use throttled mouse move
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support for mobile devices
    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        startDrawing(e.touches[0]);
    });
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        throttledDraw(e.touches[0]);
    });
    canvas.addEventListener('touchend', stopDrawing);
    
    prevBtn.addEventListener('click', goToPrevImage);
    nextBtn.addEventListener('click', goToNextImage);
    clearBtn.addEventListener('click', clearAnnotation);
    submitBtn.addEventListener('click', saveAnnotation);
    
    // // Update brush settings
    // brushColor.addEventListener('change', () => {
    //     ctx.strokeStyle = "#ff0000";
    // });
    
    brushSize.addEventListener('input', () => {
        ctx.lineWidth = brushSize.value;
        sizeValue.textContent = `${brushSize.value}px`;
        
        // Redraw to update cursor size
        if (!isDrawing) {
            redrawCanvas();
        }
    });

    // Set the canvas CSS to use no cursor
    canvas.style.cursor = 'none';

    // Initial setup
    fetchImageList();
});