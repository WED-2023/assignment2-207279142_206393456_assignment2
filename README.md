# Bubble Invaders 

A game built with **HTML5, CSS3 and Vanilla JavaScript** as part of the WED course final assignment.

##  Game Summary

Bubble Invaders is a fast-paced game where the player controls a character at the bottom of the screen and must destroy waves of invading bubbles. The game features bubble attacks, configurable controls, scoring system, lives, sound effects, and a personal high-score system per session.
---
##  Authors

- **Maor Nezer** — 206393456  
- **Ron Shukrun** — 207279142

🎓 Submitted as part of [WED 2023 @ BGU](https://github.com/WED-2023)

---

##  Play Online

You can try the game directly in your browser without downloading anything:

 [Click here to play Bubble Invaders](https://wed-2023.github.io/assignment2-207279142_206393456_assignment2/)

---

##  Features

-  **Authentication**:
  - Register with username, password, email and date of birth.
  - Login with validation and preloaded user `p / testuser`.

-  **Gameplay**:
  - Move spaceship within bottom 40% of screen using arrow keys.
  - Shoot using a customizable key (letter or space).
  - Enemies arranged in a 4x5 grid move horizontally and shoot randomly downward.
  - Player has 3 lives. Game ends when lives run out or time ends.
  
-  **Configuration**:
  - Choose shooting key.
  - Choose background.
  - Set game duration (min. 2 minutes).

-  **Scoring**:
  - Row 4 = 5 pts, Row 3 = 10 pts, Row 2 = 15 pts, Row 1 = 20 pts.
  - High scores saved per session and shown at end of game.

-  **Audio & Visuals**:
  - Custom visuals for enemies and player.
  - Unique background music during gameplay.
  - Sound effects for shooting and hit/death.
    
---

##  How To Use

1. Clone or open the project:
2. Open `index.html` in **Google Chrome** (min resolution 1366×768).

3. Register or use default login:
- **Username:** `p`
- **Password:** `testuser`

4. Configure your game and start playing!
   
---

##  Development Notes

- Fully custom design - no templates or UI libraries.
- All user data is stored in-session only (per reload).

---

##  Challenges Faced

- Syncing canvas animation with logic and collisions.
- Modular screen transitions with session control.
- Implementing dynamic difficulty and bullet behavior.
- Creating a clear and responsive UI for all resolutions.
  
---

##  Contact

- 📧 maorme@bgu.ac.il
- 📧 ronsh@bgu.ac.il
