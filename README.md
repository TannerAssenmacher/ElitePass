# PyPass Elite Chrome Extension

A high-end, AI-powered password generator with a premium Dashlane-inspired interface. This extension not only generates secure passwords but also provides a real-time security analysis using Google's Gemini AI and exports the generation logic as a standalone Python script.

## 🚀 Features

- **AI Security Architect**: Real-time password strength analysis and "Time-to-Crack" estimates powered by `gemini-3-pro-preview`.
- **Memorable Mode**: Generates secure yet easy-to-type word-based patterns.
- **Python Implementation**: Live export of the generation algorithm as Python code for developers.
- **Chrome Extension V3**: Built with the latest manifest standards.
- **Premium UI**: Glassmorphism design with Tailwind CSS and Inter/JetBrains Mono typography.

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pypass-elite.git
   cd pypass-elite
   ```
2. **Setup**:
   - Ensure you have your Google Gemini API Key ready.
3. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (top right toggle).
   - Click **Load unpacked** and select this project folder.

## 📖 How to Push to GitHub

If you've just created this project locally, follow these steps to push it to your own repository:

1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize your local directory and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PyPass Elite Extension"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

## 🏗️ Tech Stack

- **Framework**: React 19
- **Styling**: Tailwind CSS
- **AI Integration**: Google Generative AI (Gemini SDK)
- **Runtime**: Chrome Extension Manifest V3
- **Icons**: Font Awesome 6
