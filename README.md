# POS SO Frontend 🎨

A modern, high-performance web interface for the POS SO ecosystem. Built with React and optimized for both staff operations and customer experience.

## ✨ Features

- **Customer Menu**: Interactive ordering with live category filtering.
- **Staff Portal**: Order fulfillment, real-time status updates, and receipt printing.
- **Owner Dashboard**: Detailed sales reports, user management, and menu configuration.
- **Premium UI**: Dark-mode animated backgrounds, glassmorphism, and responsive design.

## 🛠 Tech Stack

- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather/FontAwesome)
- **Forms**: React Hook Form
- **API Client**: Axios

## 📂 Project Structure

- `/src/pages`: Main application views (Home, Login, Dashboard, etc.)
- `/src/components`: Reusable UI elements (Auth guards, QR scanners, etc.)
- `/src/services`: API abstraction layer.
- `/src/config`: Dynamic branding and global constants.
- `/src/assets`: SVGs and static brand assets.

## ⚙️ Environment Variables (.env)

```env
VITE_APP_NAME=POS SO
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

---
Crafted with precision for **POS SO**.
