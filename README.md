# Eventora – Responsive Event Management Website

A modern, responsive event platform built with **HTML5, CSS3 and vanilla JavaScript** (K Explore – Web Designing task).

## Features
- Hero section + featured/upcoming event cards (name, date, venue, image, description)
- Live **search** and **category filters**
- Event detail modal with **registration form** (name, email, phone, selected event)
- JavaScript **validation** (real-time, inline errors; 10-digit Indian mobile, email format, duplicate check)
- Confirmation message on success
- **Bonus:** dark/light mode (persisted), live countdown timers, animations/transitions, registrations stored in **Local Storage**
- Fully responsive: mobile, tablet, desktop (CSS Grid/Flexbox, hamburger menu)

## Project Structure
```
index.html   # structure
style.css    # styling, theming, responsive layout
script.js    # data, rendering, filtering, validation, localStorage
```

## Run Locally
Open `index.html` in a browser (no build step).

## Deploy
- **GitHub Pages:** Repo → Settings → Pages → Branch `main` / root
- **Netlify/Vercel:** import the repo; no build command, publish directory `/`

## Git Workflow
```
git init
git add .
git commit -m "Initial commit: Eventora event website"
git branch -M main
git remote add origin https://github.com/<username>/eventora.git
git push -u origin main
```

## Customising
Edit the `events` array in `script.js` to add or change events.
