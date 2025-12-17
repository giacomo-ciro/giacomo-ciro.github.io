---
layout: default
title: Projects
permalink: /projects/
---
<div id="project-container" class="container-fluid d-flex flex-column align-items-center">
  <div id="project-container-row" class="row justify-content-center w-100">
    {% assign delay = 0 %}
    {% for project in site.data.projects %}
      {% unless site.data.projects_to_exclude contains project.id %}
      <div class="project col-xl-5 col-12 d-flex justify-content-center" data-aos="fade-in" data-aos-delay="{{ delay }}">
        <div class="project-card d-flex">
          <div class="project-content d-flex flex-column justify-content-start">
            <div class="d-flex flex-row align-items-top justify-content-between mb-2">
              <h1 class="project-title">{{ project.title }}</h1>
              <h2 class="project-date">{{ project.date }}</h2>
            </div>
            <h2 class="project-tags">{{ project.tags }}</h2>
            <p class="project-description">{{ project.description }}</p>
            {% if project.links %}
              <div class="project-links d-flex flex-row justify-content-center align-items-center">
                {% for link in project.links %}
                  <a href="{{ link[1] }}" target="_blank" class="project-link">{{ link[0] }}</a>
                {% endfor %}
              </div>
            {% endif %}
          </div>
          <div class="project-thumbnail">
            <img src="{{ 'assets/img/thumbnails/' | append: project.thumbnail | relative_url }}" 
                 alt="Thumbnail for {{ project.title }}" 
                 class="thumbnail-img"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                 onload="this.style.display='block'; this.nextElementSibling.style.display='none';">
            <div class="thumbnail-placeholder" style="display: none;">
              <span>{{project.thumbnail}}</span>
            </div>
          </div>
        </div>
      </div>
      {% assign delay = delay | plus: 25 %}
      {% endunless %}
    {% endfor %}
  </div>
</div>
