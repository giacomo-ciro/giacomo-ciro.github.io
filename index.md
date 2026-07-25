---
layout: default
title: MSc in Artificial Intelligence
class: index-page
permalink: /
---
<section id="hero" class="hero page-col">
    <div class="img-container">
      <img src="{{ '/assets/img/profile-pic.png' | relative_url }}" class="img-fluid" width="409" height="409" data-aos="fade-right">
    </div>
    <div class="hero-text">
      <div class="hero-name" data-aos="fade-left">Giacomo Cirò</div>
      <ul>
        <li data-aos="fade-left" data-aos-delay="250">CS Student</li>
        <li data-aos="fade-left" data-aos-delay="500">ML Researcher</li>
        <li data-aos="fade-left" data-aos-delay="750">BSML Co-founder</li>
        <li data-aos="fade-left" data-aos-delay="1000">Data Nerd</li>
        <li data-aos="fade-left" data-aos-delay="1250">TH 16</li>
      </ul>
    </div>
</section>
<section class="d-flex flex-column justify-content-center page-col" data-aos="fade-up">
{{ "
# About me
I am pursuing a [MSc in Artificial Intelligence](https://www.unibocconi.it/en/programs/master-science/artificial-intelligence) at [Bocconi University](https://www.unibocconi.it/en) in Milan, Italy after having graduated cum laude with a [BSc in Economics and Computer Science](https://www.unibocconi.it/en/programs/bachelor-science/economics-management-and-computer-science).

I am currently doing my MSc Thesis at the [Computer Vision and Geometry Group (CVG)](https://cvg.ethz.ch/) at [ETH Zurich](https://ethz.ch/en.html), under the supervision of [Dr. Zuria Bauer](https://zuriabauer.com/), [Prof. Marc Pollefeys](https://people.inf.ethz.ch/marc.pollefeys/) and [Prof. Chiara Plizzari](https://chiaraplizz.github.io/).

Previously, I spent two years as a Machine Learning Researcher at the [Bocconi Institute for Data Science and Analytics](https://bidsa.unibocconi.eu/?_gl=1*vwq429*_up*MQ..*_ga*NTg0NTkzNzg4LjE3MzI0ODA4MDc.*_ga_FMVFTTB8Q4*MTczMjQ4MDgwNS4xLjEuMTczMjQ4MDg3MS4wLjAuMA..) and the [AIRC Institute for Molecular Biology](https://www.ifom.eu/it/), under the supervision of [Prof. Francesca Buffa](https://cs.unibocconi.eu/people/francesca-buffa). My work focused on exploring the scaling laws of deep learning models in transcriptomics and developing novel architectures for gene expression modeling.

To connect minds, not only layers, I co-founded [Bocconi Students for Machine Learning (BSML)](https://www.bsmachinelearning.com/), the first machine learning project-incubator at Bocconi University.
" | markdownify }}
</section>

<section class="d-flex flex-column justify-content-center page-col" id="timeline-preview-section" data-aos="fade-up">
  <h1>Timeline</h1>
  <div id="timeline-preview" class="d-flex flex-column">
    {% assign strong_timeline = site.data.timeline | where: "strong", true %}
    {% assign preview_timeline = strong_timeline | slice: 0, 3 %}
    {% for event in preview_timeline %}
      <div class="timeline-event strong d-flex flex-row align-items-center">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-date">{{ event.date }}</div>
          <div class="timeline-title">{{ event.description | markdownify }}</div>
        </div>
      </div>
    {% endfor %}
  </div>
  <div class="view-more-wrap">
    <a class="view-more-btn" href="{{ '/timeline/' | relative_url }}">View full timeline <span class="arrow">&rarr;</span></a>
  </div>
</section>

<section class="d-flex flex-column justify-content-center page-col" id="projects-preview-section" data-aos="fade-up">
  <h1>Projects</h1>
  <div id="project-preview-row" class="project-list">
    {% assign delay = 0 %}
    {% assign shown = 0 %}
    {% for project in site.data.projects %}
      {% unless site.data.projects_to_exclude contains project.id %}
        {% if shown < 3 %}
        <div class="project-row" data-aos="fade-in" data-aos-delay="{{ delay }}">
          <div class="project-thumb">
            <img src="{{ 'assets/img/thumbnails/' | append: project.thumbnail | relative_url }}"
                 alt="Thumbnail for {{ project.title }}"
                 class="thumbnail-img"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                 onload="this.style.display='block'; this.nextElementSibling.style.display='none';">
            <div class="thumbnail-placeholder" style="display: none;">
              <span>{{ project.thumbnail }}</span>
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
        {% assign shown = shown | plus: 1 %}
        {% endif %}
      {% endunless %}
    {% endfor %}
  </div>
  <div class="view-more-wrap">
    <a class="view-more-btn" href="{{ '/projects/' | relative_url }}">View all projects <span class="arrow">&rarr;</span></a>
  </div>
</section>
