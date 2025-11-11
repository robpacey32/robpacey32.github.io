---
layout: post_theme
title: "Standings Editor - v2"
date: 2025-11-11
permalink: /hockey/:year/:month/:day/:title/
categories: hockey
subtitle: NHL Standings Editor
#cover-img: /assets/img/path.jpg
thumbnail-img: /hockey/assets/P32Logo.png
share-img: /hockey/assets/P32Logo.jpg
author: Pacey32
full-width: true
---

With such a tight playoff race in the 2023-24 season, it got me wondering what would have happened if the NHL worked on the IIHF system of 3 points for a win, 2 for an OT win, 1 for an OT/SO loss and 0 for a regulation loss.  The Bruins and the NY Islanders both had a lot of OT losses (15 and 16 respectfully), whereas Edmonton and Dallas both had 8 OT wins, but the Red Wings had a staggering 11.

So, to answer this, I decided to build my own version of the NHL Standings, but this one you can edit the points awarded for all types of results.  Whilst doing this, I also realised that the NHL Standings don't do a great job of showing the tiebreakers they use.  The first tiebreaker of fewest games played is usually less relevant than the next - the greater number of Regulation Wins.
<br>
<br>
<div style="font-weight: bold; text-decoration: underline;">NHL Standings Simulator:</div>

<!-- Responsive iframe container -->
<div style="
  position: relative;
  width: 100%;
  padding-bottom: 75%;  /* 4:3 aspect ratio; adjust for height */
  height: 0;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  margin-top: 10px;
">
  <iframe 
    src="https://nhl-standings-app.onrender.com" 
    style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    "
    scrolling="yes"
    allowfullscreen>
  </iframe>
</div>


#32