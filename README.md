# WoganPredicts

Expert football predictions backed by data, Wogan's specialized algorithms, and 10+ years of match analysis.

## How to run this project locally

This project is built using **React**, **Vite**, and **Tailwind CSS**. To run it on your local machine, you need to have **Node.js** installed.

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

## How to deploy to GitHub Pages

Since this is a Vite project, you cannot just open the `index.html` file in your browser. You need to build the project and host the static files.

### Option 1: Using GitHub Actions (Recommended)

This repository includes a GitHub Action to automatically deploy your site to GitHub Pages whenever you push to the `main` branch.

1. Go to your repository settings on GitHub.
2. Click on **Pages** in the left sidebar.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The site will automatically build and deploy on your next push.

### Option 2: Manual Build

If you want to build the project manually:
1. Run `npm run build`.
2. The static files will be generated in the `dist` folder.
3. You can host the contents of the `dist` folder on any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

## AI Predictions

The app uses the Gemini API for dynamic predictions. To enable this features locally:
1. Create a `.env` file in the root directory.
2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
If no key is provided, the app will use high-quality fallback predictions.

---
© 2026 WoganPredicts. All rights, maintenance and operations to this website are owned by Komurubuga wogan.
