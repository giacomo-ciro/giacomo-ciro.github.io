// All variables
document.querySelector('head').getElementsByTagName('title')[0].innerHTML = 'Giacomo Cirò | MSc in Artificial Intelligence'

// Retrieve names
function jumpingName(){
  var list = document.getElementsByClassName('jumping-word')
  console.log(list)
  for (elem of list) {
    var temp = ''
    for (letter of elem.innerHTML) {
      temp += `<p class="jumping-letter">${letter}</p>`
    }
    console.log(temp)
    elem.innerHTML = temp
  }
}

function updateProjects(){
    fetch("https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/main/assets/projects.json")
      .then(response => response.json())
      .then(data => {
        delay = 0
        data['projects'].forEach(project => {
          console.log(project)
          const { title, date, tags, description, links } = project;
          // Initialize projectHTML with the common elements
          var projectHTML = `
            <div class="project col-md-9 col-sm-6 col-12" data-aos="fade-in" data-aos-delay="${delay}">
              <div class="d-flex flex-row align-item-center justify-content-between">
                <h1>${title}</h1>
                <h3>${date}</h3>
              </div>
                <h2>${tags}</h2>
                <p>${description}</p>
                <div class="d-flex flex-row justify-content-center align-items-center">
          `;
          delay += 25
          // Loop through the links dictionary and add the corresponding tags with links
          for (const [key, value] of Object.entries(links)) {
            if (value) {
              projectHTML += `<a href="${value}" target="_blank">${key.charAt(0).toUpperCase() + key.slice(1)}</a>`;
            }
          }
  
          // Close the projectHTML structure
          projectHTML += `
                </div>
            </div>
          `;
  
          // Append the projectHTML to the project list
          document.getElementById('project-container-row').innerHTML += projectHTML;
        });
        console.log('Project list updated')
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

//-----------------FOOTER
function includeFooter() {
  fetch("https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/main/footer.html")
      .then(response => response.text())
      .then(data => {
          document.getElementById('footer').innerHTML = data;
          console.log('Footer updated')
      });
};

//------------------TIMELINE
function updateTimeline(){
  delay = 0
  fetch("https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/main/assets/timeline.json")
    .then(response => response.json())
    .then(data => {
      const chronologicalEvents = data['timeline'];
      chronologicalEvents.forEach(project => {
        const { date, event } = project;
        
        // Initialize projectHTML with the common elements
        var projectHTML = `
                  <div class="timeline-event d-flex flex-row align-items-center" data-aos="fade-in" data-aos-delay="${delay}">
                      <div class="timeline-dot"></div>
                      <div class="timeline-content">
                          <div class="timeline-date">${date}</div>
                          <div class="timeline-title">${event}</div>
                      </div>
                  </div>
        `;
        // Append the projectHTML to the project list
        document.getElementById('timeline-container').innerHTML += projectHTML;

        delay += 50
      });
      console.log('Timeline updated')
      })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

};

//------------------------------------------- call everything
window.onload = function() {
  // if on the project page, update projects
  var path = window.location.pathname;
  if (path.includes('projects.html')) {
      updateProjects();
  } else if (path.includes('timeline.html')){
      updateTimeline();
  };
  // always update footer
  includeFooter();
  jumpingName();
  aosInit()
};

function toggleScrolled() {
  const selectBody = document.querySelector('body');
  const selectHeader = document.querySelector('#header');
  if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
  window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
}

document.addEventListener('scroll', toggleScrolled);
window.addEventListener('load', toggleScrolled);

function aosInit() {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
}
