---
layout: default
title: Quotes
permalink: /quotes/
---
<section id="quotes" class="quotes page-col">
  <div class="d-flex justify-content-center quotes-disclaimer">
    <p>
      Quotes on this page are based on my personal collection. Attributions are made to the best of my knowledge—often to the first person I heard say them. If you spot an error or know the correct author, please email me.
    </p>
  </div>
  <div id="quotes-container" class="d-flex flex-column align-items-center">
    <div id="quotes-container-row" class="quote-grid">
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
        div.className = 'quote-card scatter-init';

        // Random scatter origin/rotation/delay so cards settle in
        // independently instead of animating as a single block.
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 100;
        div.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
        div.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
        div.style.setProperty('--drot', `${-12 + Math.random() * 24}deg`);
        div.style.setProperty('--delay', `${Math.random() * 500}ms`);

        div.innerHTML = `
          <p class="quote-content">${quote.text}</p>
          <p class="quote-author">${quote.author || 'Unknown'}</p>
          ${(quote.source || quote.year) ? `<p class='quote-source'>${quote.source || ''}${quote.source && quote.year ? ', ' : ''}${quote.year || ''}</p>` : ''}
        `;
        container.appendChild(div);
      });

      // Scatter cards in as they enter the viewport
      const scatterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('scatter-init');
            entry.target.classList.add('scatter-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      container.querySelectorAll('.quote-card').forEach(card => scatterObserver.observe(card));
    });
  </script>
</section>
