fetch("https://giacomo-ciro.github.io/Resources/data.json")
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data['projects'].forEach(project => {
      const { title, tags, description, code, webapp } = project;
      console.log(project)
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

      console.log(projectHTML)
      document.getElementById('project-list').innerHTML += projectHTML;
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });