---
layout: default
title: Timeline
class: timeline-page
permalink: /timeline/
---
<main class="d-flex flex-column align-items-center justify-content-center">
  <div id="timeline-container" class="col-md-5 col-9 d-flex flex-column">
    {% for event in site.data.timeline %}
      {% if event.strong %}
        {% assign eventClass = "strong" %}
      {% else %}
        {% assign eventClass = "weak" %}
      {% endif %}
      <div class="timeline-event {{ eventClass }} d-flex flex-row align-items-center" data-aos="fade-in">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-date">{{ event.date }}</div>
          <div class="timeline-title">{{ event.description | markdownify }}</div>
        </div>
      </div>
    {% endfor %}
  </div>
</main>