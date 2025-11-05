---
layout: default
title: Home
class: index-page
permalink: /
---
<section id="hero" class="hero">
  <div class="col-md-7 col-12 container d-flex flex-row justify-content-center">
    <div class="img-container d-flex justify-content-center align-items-center">
      <img src="{{ '/assets/img/profile-pic.png' | relative_url }}" class="img-fluid" data-aos="fade-right">
    </div>
    <ul>
      <li data-aos="fade-left">CS Student</li>
      <li data-aos="fade-left" data-aos-delay="250">ML Researcher</li>
      <li data-aos="fade-left" data-aos-delay="500">BSML Co-founder</li>
      <li data-aos="fade-left" data-aos-delay="750">Data Nerd</li>
      <li data-aos="fade-left" data-aos-delay="1000">TH 16</li>
    </ul>
  </div>
</section>
<section id="about" class="about">
  <div class="container-fluid d-flex flex-column align-items-center">
    <h1 class="col-md-7 col-12" data-aos="fade-up">About Me</h1>
      <div id="about-me-content" data-aos="fade-up" class="d-flex flex-column col-md-7 col-sm-12">
{{ "
I am currently pursuing a [MSc in Computer Science (AI)](https://www.unibocconi.it/en/programs/master-science/artificial-intelligence) at [Bocconi University](https://www.unibocconi.it/en) in Milan, Italy after having graduated cum laude with a [BSc in Economics and Computer Science](https://www.unibocconi.it/en/programs/bachelor-science/economics-management-and-computer-science).

My passion lies in Mathematics and Computer Science, and I aim at a career as Quantitative Researcher in Finance.

To refine my quantitative and research skills, I am currently working as a Machine Learning Researcher at the [Bocconi Institute for Data Science and Analytics](https://bidsa.unibocconi.eu/?_gl=1*vwq429*_up*MQ..*_ga*NTg0NTkzNzg4LjE3MzI0ODA4MDc.*_ga_FMVFTTB8Q4*MTczMjQ4MDgwNS4xLjEuMTczMjQ4MDg3MS4wLjAuMA..) and the [AIRC Institute for Molecular Biology](https://www.ifom.eu/it/), under the supervision of Professor [Francesca Buffa](https://cs.unibocconi.eu/people/francesca-buffa). My work centers on exploring the scaling laws of deep learning models in transcriptomics and developing novel architectures for gene expression modeling.

I also want to connect minds, not only layers. For this reason, I co-founded [Bocconi Students for Machine Learning (BSML)](https://www.bsmachinelearning.com/), the first machine learning project-incubator at Bocconi University.
" | markdownify }}
    </div>
  </div>
</section>
