# ren.dev — Personal Website

a minimal-braincells, maximal-polish portfolio built with react + tailwind.  
sleek glass ui, simple sections, and a guestbook with feral easter eggs.

---

## ✨ features
- **hero section** with name, tagline, resume + contact buttons  
- **projects grid** with tech tags, links, and screenshots  
- **experience timeline** recruiter-friendly, compact  
- **about me** with “currently” bullets + skills cloud  
- **guestbook** with reply threads + hidden nyan responses  
- **contact block** with email, socials, and resume pdf  
- **fun extras** toggle for gremlin button + guestbook preview  
- dark / light themes, and a secret mousey mode 🐭💖

---

## 🛠 tech stack
- [React 18](https://react.dev)  
- [Tailwind CSS](https://tailwindcss.com)  
- localStorage for guestbook state (no backend required)  
- deployed via GitHub Pages (works with Vite or CDN-ESM)

---

## 🚀 getting started

### option A — quick & dirty (no build)
1. clone repo
2. edit `site-impl.jsx` (main component)  
3. open `index.html` in browser or push to GitHub Pages root

### option B — proper build (vite + tailwind)
```bash
npm install
npm run dev      # local dev
npm run build    # build to dist/
