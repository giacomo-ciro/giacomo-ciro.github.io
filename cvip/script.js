document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const canvas = document.getElementById('annotation-canvas');
    const ctx = canvas.getContext('2d');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const imageCounter = document.getElementById('image-counter');
    const brushColor = document.getElementById('brush-color');
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

    // Initialize brush settings
    ctx.strokeStyle = brushColor.value;
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
                'img/sample2.jpg',
                'img/sample3.jpg',
                'img/sample4.jpg',
                'img/sample5.jpg'
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
            
            // Draw the image on the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(currentImage, 0, 0, canvasWidth, canvasHeight);
            
            // Update navigation buttons
            prevBtn.disabled = currentImageIndex === 0;
            nextBtn.disabled = currentImageIndex === images.length - 1;
        };
        currentImage.src = src;
    }

    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getMousePos(canvas, e);
    }

    function draw(e) {
        if (!isDrawing) return;
        const [x, y] = getMousePos(canvas, e);
        
        // Set the highlighter effect with opacity
        ctx.globalAlpha = 0.5;  // 50% opacity
        ctx.strokeStyle = "#ff0000";  // Red color
        ctx.lineWidth = brushSize.value;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Reset opacity for other canvas operations
        ctx.globalAlpha = 1.0;
        
        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Helper function to get mouse position relative to canvas
    function getMousePos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        return [
            (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        ];
    }

    // Function to clear the annotation
    function clearAnnotation() {
        // Redraw the original image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    }

    // Function to save the annotated image as a binary mask
    function saveAnnotation() {
        try {
            // Get the current image name without path and extension
            const fullImageName = images[currentImageIndex];
            const imageName = fullImageName.split('/').pop().split('.')[0];
            
            // Create timestamp for the filename
            const now = new Date();
            const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
            
            // Create a temporary canvas for the binary mask
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Get the image data from our annotation canvas
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Create a new imageData for the binary mask
            const binaryImageData = tempCtx.createImageData(canvas.width, canvas.height);
            const binaryData = binaryImageData.data;
            
            // For each pixel, check if it has annotation (red with some opacity)
            // If it does, set it to white (1), otherwise set to black (0)
            for (let i = 0; i < data.length; i += 4) {
                // Check if pixel has red component and is not part of the original image
                // This assumes annotation is done in red with some opacity
                if (data[i] > 200 && data[i+1] < 100 && data[i+2] < 100) {
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
            
            // Create a temporary link to download the image
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `${imageName}_annotated_${timestamp}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            statusMessage.textContent = 'Binary annotation mask saved successfully!';
            statusMessage.className = 'success';
            
        } catch (error) {
            console.error('Error saving annotation:', error);
            statusMessage.textContent = 'Error saving annotation.';
            statusMessage.className = 'error';
        }
    }
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
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support for mobile devices
    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        startDrawing(e.touches[0]);
    });
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        draw(e.touches[0]);
    });
    canvas.addEventListener('touchend', stopDrawing);
    
    prevBtn.addEventListener('click', goToPrevImage);
    nextBtn.addEventListener('click', goToNextImage);
    clearBtn.addEventListener('click', clearAnnotation);
    submitBtn.addEventListener('click', saveAnnotation);
    
    // Update brush settings
    brushColor.addEventListener('change', () => {
        ctx.strokeStyle = brushColor.value;
    });
    
    brushSize.addEventListener('input', () => {
        ctx.lineWidth = brushSize.value;
        sizeValue.textContent = `${brushSize.value}px`;
    });

    // Initial setup
    fetchImageList();
});