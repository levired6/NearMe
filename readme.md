# 🧭 NearMe — High-Performance Local Discovery Platform

![React 18](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript 5.2](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)
![Vite 5.1](https://img.shields.io/badge/Vite-5.1-purple?style=for-the-badge&logo=vite)
![Tailwind CSS 3.4](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PWA Installable](https://img.shields.io/badge/PWA-Installable-success?style=for-the-badge&logo=pwa)

**NearMe** is a production-grade, high-performance local discovery web application designed to eliminate fragmented searching across multiple apps. By aggregating rich spatial data, live transit schedules, event ticketing, and delivery platform handoffs into a single map-first interface, NearMe provides a unified dashboard for urban and rural exploration.

---

## 💡 Project Motivation & Vision

Modern local exploration is often fragmented across multiple platforms: Google Maps for addresses, Yelp for reviews, Ticketmaster for events, Transit apps for schedules, and DoorDash/Uber for handoffs.

**NearMe** was engineered to solve this by consolidating diverse spatial endpoints into one seamless, high-density map interface. The goal was to build a mobile-first, zero-friction discovery tool that offers both casual users and "Pro" members maximum utility without context switching.

---

## 🔌 API Integrations & Data Sources

NearMe synthesizes real-time data from multiple industry-standard APIs to construct its unified map and drawer feeds:

| Service / API | Integration Purpose & Capabilities |
| :--- | :--- |
| **Google Places (New) API** | Powers spatial search across categories (dining, nightlife, local services, farm stands, stays, and parks). Provides editorial summaries, ratings, weekday opening hours, user reviews, and precise lat/lng coordinates. |
| **Ticketmaster Discovery API** | Fetches live concerts, theatrical shows, and sports events. Enables in-app ticket availability previews, seating section tiers, and price estimations. |
| **OpenStreetMap / Nominatim** | Provides global geocoding support to convert ZIP codes and city names into exact latitude and longitude coordinates. |
| **Browser Web Speech API** | Drives the interactive "Ask AI" voice assistant overlay for hands-free natural language filtering. |

---

## ⚙️ Technical Design & Engineering Methods

* **Concurrent Multi-Batch Queries**: To ensure high density in both dense urban areas and sparse rural settings (such as roadside farm stands), the data service executes parallel API queries across expanded geographic radii.
* **Smart Local Filtering**: Client-side state managed in React provides instant keyword filtering across places, venues, and categories without requiring additional network requests.
* **Tiered Architecture & UX**: Features a modular modal layout supporting OAuth authentication, custom list collections (*"Weekend Ideas"*), and friend tagging (`@handle`).
* **PWA Standalone Deployment**: Built with `vite-plugin-pwa` to register service workers and enable a native-like desktop and mobile app installation experience.

---

## 🌐 Try the Live App

You can interact with the fully deployed app live on Vercel without installing any dependencies:

👉 **[https://near-me-tau.vercel.app](https://near-me-tau.vercel.app)**

---

## 📱 How to Save / Install NearMe to Your Device

NearMe is built as a Progressive Web App (PWA) and can be saved directly to your home screen or desktop for a native app experience:

### 🍏 iPhone / iPad (iOS Safari)
1. Open [https://near-me-tau.vercel.app](https://near-me-tau.vercel.app) in **Safari**.
2. Tap the **Share** button (the square icon with an arrow pointing up at the bottom bar).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top-right corner.

### 🤖 Android (Google Chrome)
1. Open [https://near-me-tau.vercel.app](https://near-me-tau.vercel.app) in **Chrome**.
2. Tap the **three vertical dots (⋮)** in the top right corner.
3. Select **Install app** (or **Add to Home screen**).
4. Tap **Install** to confirm.

### 💻 Desktop (Chrome, Edge, or Brave)
1. Open [https://near-me-tau.vercel.app](https://near-me-tau.vercel.app) on your browser.
2. Look at the right side of the URL address bar at the top.
3. Click the **Install App icon** (looks like a monitor with a down arrow, or a `+` symbol).
4. Click **Install**.

---

## 🛠️ Tech Stack Overview

* **Frontend**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS, Lucide React Icons
* **Mapping Engine**: MapLibre GL, OpenStreetMap
* **Deployment & CI/CD**: Vercel

---

## 👤 Author

* **Levi Redinger**
* GitHub: [@levired6](https://github.com/levired6)