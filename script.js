function updateProjects(){
    fetch("https://giacomo-ciro.github.io/Resources/projects.json")
      .then(response => response.json())
      .then(data => {
        data['projects'].forEach(project => {
          const { title, tags, description, links } = project;
          
          // Initialize projectHTML with the common elements
          var projectHTML = `
            <section class="project">
                <h2 class="project-title">${title}</h2>
                <p class="project-tags">${tags}</p>
                <p class="project-description">${description}</p>
                <div class="project-links">
          `;
          
          // Loop through the links dictionary and add the corresponding tags with links
          for (const [key, value] of Object.entries(links)) {
            if (value) {
              projectHTML += `<a href="${value}" target="_blank">${key.charAt(0).toUpperCase() + key.slice(1)}</a>`;
            }
          }
  
          // Close the projectHTML structure
          projectHTML += `
                </div>
            </section>
          `;
  
          // Append the projectHTML to the project list
          document.getElementById('project-list').innerHTML += projectHTML;
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  console.log('Project list updated from https://giacomo-ciro.github.io/Resources/projects.json')
  };

//-----------------FOOTER
function includeFooter() {
  fetch("https://giacomo-ciro.github.io/footer.html")
      .then(response => response.text())
      .then(data => {
          document.getElementById('footer').innerHTML = data;
          console.log('Footer updated from https://giacomo-ciro.github.io/footer.html')
      });
};

//------------------TIMELINE
function updateTimeline(){
  fetch("https://giacomo-ciro.github.io/Resources/timeline.json")
    .then(response => response.json())
    .then(data => {
      const chronologicalEvents = data['timeline'].reverse()
      chronologicalEvents.forEach(project => {
        const { date, event } = project;
        
        // Initialize projectHTML with the common elements
        var projectHTML = `
                  <div class="timeline-event">
                      <div class="timeline-dot"></div>
                      <div class="timeline-content">
                          <div class="timeline-date">${date}</div>
                          <div class="timeline-title">${event}</div>
                      </div>
                  </div>
        `;
        // Append the projectHTML to the project list
        document.getElementById('timeline').innerHTML += projectHTML;
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
console.log('Timeline updated from https://giacomo-ciro.github.io/Resources/timeline.json')
};

// ---------- ABOUT
// function updateAbout(){
//   fetch('https://giacomo-ciro.github.io/Resources/about.txt')
//             .then(response => response.text()) // Convert the response to text
//             .then(data => {
//                 // Update the content of the tag with the text file content
//                 document.getElementById('text-content').textContent = data;
//             })
//             .catch(error => {
//                 // Handle errors
//                 console.error('Error fetching data:', error);
//             });
// console.log('Timeline updated from https://giacomo-ciro.github.io/Resources/about.txt')
// };
//------------------------------------------- call everything
window.onload = function() {
  // if on the project page, update projects
  var path = window.location.pathname;
  if (path.includes('projects.html')) {
      updateProjects();
  } else if (path.includes('timeline.html')){
      updateTimeline();
  } else if (path.includes('index.html')){
      updateAbout();
  };
  // always update footer
  includeFooter();
};