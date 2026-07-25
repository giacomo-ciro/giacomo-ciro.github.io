---
layout: default
title: Timeline
permalink: /timeline/
---
<section id="timeline-page" class="d-flex flex-column justify-content-center page-col">
  <div class="d-flex justify-content-center quotes-disclaimer">
    <p>
      This timeline collects milestones and events I find worth remembering. It's a personal and evolving list, not necessarily exhaustive or objective.
    </p>
  </div>
  <div id="timeline" class="d-flex flex-column">
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
</section>