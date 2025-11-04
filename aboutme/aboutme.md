---
layout: page
title: About Me
permalink: /aboutme/
---

<style>
/* --- Image layout at the top --- */
.aboutme-images {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap; /* allows stacking on small screens */
}

.aboutme-images img {
  width: 48%;
  aspect-ratio: 1 / 1;            /* 🔹 forces square ratio */
  object-fit: cover;  /* 🔹 crops to fill square */
/*  max-width: 500px; */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

/* --- Quote & text styling --- */
.aboutme-quote {
  font-style: italic;
  color: #666;
  border-left: 3px solid #ccc;
  padding-left: 1em;
  margin: 2em 0;
}

.aboutme-text {
  color: #333;
  line-height: 1.6;
  font-size: 1.05rem;
  max-width: 750px;
  margin: 0 auto;
}
</style>

<!-- 🖼️ Two side-by-side photos -->
<div class="aboutme-images">
  <img src="{{ 'aboutme/assets/Pacey32_Hockey.jpg' | relative_url }}" alt="Pacey32 Hockey">
  <img src="{{ 'aboutme/assets/Pacey32_Horses.jpg' | relative_url }}" alt="Pacey32 Horse Racing">
</div>

<div class="aboutme-text">
Hi, I’m Rob — the person behind Pacey32.

I’ve always been curious about how things work, and over time that curiosity turned into a love for data, analytics, and storytelling.

By day I work in analytics for a global company. By night, I work on personal projects that bring together the things I enjoy most: sport, technology, and data.

Pacey32 is where everything is getting documented. It’s a space for exploring hockey stats, horse racing form, and Pokémon cards — but also for experimenting, learning, and sharing along the way.  
Some projects are polished, others are in progress, but they all come from the same place: curiosity, creativity, and a desire to keep building.  

Thanks for visitng — I hope something here sparks your own curiosity too.
</div>

<br>
<br>

<div style="text-align:right;">
  <h4 style="display:inline-block; margin-bottom: 0;">#32</h4><br>
  <br>
  <span style="font-size: small; color: #777;">Last Updated: 2025-11-04</span>
</div>