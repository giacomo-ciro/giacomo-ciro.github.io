---
layout: default
title: Projects
permalink: /projects/
---
<section id="projects-page" class="d-flex flex-column justify-content-center page-col">
  <div class="d-flex justify-content-center quotes-disclaimer">
    <p>
      Projects I've worked on, ranging from research code to side experiments.
    </p>
  </div>
  <div id="project-container" class="project-list">
    {% assign delay = 0 %}
    {% for project in site.data.projects %}
      {% unless site.data.projects_to_exclude contains project.id %}
      <div class="project-row" data-aos="fade-in" data-aos-delay="{{ delay }}">
        <div class="project-thumb">
          <img src="{{ 'assets/img/thumbnails/' | append: project.thumbnail | relative_url }}" 
               alt="Thumbnail for {{ project.title }}" 
               class="thumbnail-img"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
               onload="this.style.display='block'; this.nextElementSibling.style.display='none';">
          <div class="thumbnail-placeholder" style="display: none;">
            <span>{{project.thumbnail}}</span>
          </div>
        </div>
        <div class="project-body">
          <div class="project-heading">
            <h1 class="project-title">{{ project.title }}</h1>
            <span class="project-date">{{ project.date }}</span>
          </div>
          <h2 class="project-tags">{{ project.tags }}</h2>
          <p class="project-description">{{ project.description }}</p>
          {% if project.links %}
            <div class="project-links d-flex flex-row">
              {% for link in project.links %}
                <a href="{{ link[1] }}" target="_blank" class="project-link">{{ link[0] }}</a>
              {% endfor %}
            </div>
          {% endif %}
        </div>
      </div>
      {% assign delay = delay | plus: 25 %}
      {% endunless %}
    {% endfor %}
  </div>
</section>
