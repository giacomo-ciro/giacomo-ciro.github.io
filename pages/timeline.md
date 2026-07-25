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
  {%- comment -%}
    Dates are "Month Year" and the data is already in reverse-chronological
    order, so events are grouped by splitting on the label itself: consecutive
    entries sharing a year go in one .year-group, and within it consecutive
    entries sharing a month go in one .month-group. Each label is therefore
    rendered once, on the left rail, instead of repeating on every row.
  {%- endcomment -%}
  <div id="timeline">
    {% assign year_groups = site.data.timeline | group_by_exp: "event", "event.date | split: ' ' | last" %}
    {% for year_group in year_groups %}
      <div class="year-group">
        <div class="year-label">{{ year_group.name }}</div>
        {% assign month_groups = year_group.items | group_by_exp: "event", "event.date" %}
        {% for month_group in month_groups %}
          <div class="month-group">
            {% assign month_name = month_group.name | split: " " | first %}
            <div class="month-label">{{ month_name | slice: 0, 3 }}</div>
            <div class="month-body">
              {% for event in month_group.items %}
                <div class="timeline-event {% if event.strong %}strong{% else %}weak{% endif %} d-flex flex-row align-items-center" data-aos="fade-in">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">{{ event.description | markdownify }}</div>
                  </div>
                </div>
              {% endfor %}
            </div>
          </div>
        {% endfor %}
      </div>
    {% endfor %}
  </div>
</section>