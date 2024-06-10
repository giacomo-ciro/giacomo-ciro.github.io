// UPDATE PROJECTS FROM JSON
function updateProjects(){
  fetch("https://giacomo-ciro.github.io/Resources/data.json")
    .then(response => response.json())
    .then(data => {
      data['projects'].forEach(project => {
        const { title, tags, description, code, webapp } = project;
        // console.log(project)
        if (webapp.length === 0) {
          var projectHTML = `
              <section class="project">
                  <h2 class="project-title">${title}</h2>
                  <p class="project-tags">${tags}</p>
                  <p class="project-description">${description}</p>
                  <div class="project-links">
                      <a href="${code}" target="_blank">Code</a>
                  </div>
              </section>
          `;
        } else {
          var projectHTML = `
          <section class="project">
              <h2 class="project-title">${title}</h2>
              <p class="project-tags">${tags}</p>
              <p class="project-description">${description}</p>
              <div class="project-links">
                  <a href="${code}" target="_blank">Code</a>
                  <a href="${webapp}" target="_blank">Webapp</a>
              </div>
          </section>
          `;
        }

        // console.log(projectHTML)
        document.getElementById('project-list').innerHTML += projectHTML;
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
    console.log('Project list updated from https://giacomo-ciro.github.io/Resources/data.json')
  }

// UPDATE ALL FOOTER BASED ON FIRST PAGE
function includeFooter() {
  fetch("https://giacomo-ciro.github.io/footer.html")
      .then(response => response.text())
      .then(data => {
        console.log(data)
        console.log(document.getElementById('footer').outerHTML)
          document.getElementById('footer').innerHTML = data;
          console.log(document.getElementById('footer').innerHTML)
          console.log('Footer updated from https://giacomo-ciro.github.io/footer.html')
      });
}
// Call the functions
window.onload = function() {
  // if on the project page, update projects
  var path = window.location.pathname;
  if (path.includes('projects.html')) {
      updateProjects();
  };
  // always update footer
  includeFooter();
};