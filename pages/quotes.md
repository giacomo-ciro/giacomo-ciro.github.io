---
layout: default
title: Quotes
class: quotes-page
permalink: /quotes/
---
<section id="quotes" class="quotes">
  <div class="d-flex justify-content-center quotes-disclaimer">
    <p>
      Quotes on this page are based on my personal collection. Attributions are made to the best of my knowledge—often to the first person I heard say them. If you spot an error or know the correct author, please email me.
    </p>
  </div>
  <div id="quotes-container" class="container-fluid d-flex flex-column align-items-center">
    <div id="quotes-container-row" class="row justify-content-center">
      <!-- Quotes will be rendered here by JavaScript (jekyll is static, must use JS for shuffling on reload) -->
    </div>
    <script id="quotes-data" type="application/json">
      {{ site.data.quotes | jsonify }}
    </script>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const quotesData = JSON.parse(document.getElementById('quotes-data').textContent);
      // Fisher-Yates shuffle
      for (let i = quotesData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotesData[i], quotesData[j]] = [quotesData[j], quotesData[i]];
      }
      const container = document.getElementById('quotes-container-row');
      quotesData.forEach(quote => {
        const div = document.createElement('div');
        div.className = 'quote-card col-md-3 col-sm-5 col-12';
        div.setAttribute('data-aos', 'fade-up');
        div.innerHTML = `
          <p class="quote-content">${quote.text}</p>
          <p class="quote-author">${quote.author || 'Unknown'}</p>
          ${(quote.source || quote.year) ? `<p class='quote-source'>${quote.source || ''}${quote.source && quote.year ? ', ' : ''}${quote.year || ''}</p>` : ''}
        `;
        container.appendChild(div);
      });
    });
  </script>
</section>
