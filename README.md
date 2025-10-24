# 🎬 AI Video Generator

Transform your product images into engaging videos with AI. This React application extracts images from webpages and generates AI-powered videos, automatically saving them to Google Drive.

## ✨ Features

- 🔍 **Automatic Image Extraction**: Scrapes product images from any webpage
- 🎥 **AI Video Generation**: Creates professional videos using advanced AI
- ☁️ **Google Drive Integration**: Automatically saves videos to your Drive
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📊 **Real-time Progress**: Track each step of the video generation process

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd ai_video
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   The app will automatically open at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
ai_video/
├── src/
│   ├── components/
│   │   ├── VideoForm.jsx          # URL input form
│   │   ├── VideoForm.css
│   │   ├── ProgressSection.jsx    # Progress tracking container
│   │   ├── ProgressSection.css
│   │   ├── ProgressStep.jsx       # Individual progress step
│   │   ├── ProgressStep.css
│   │   ├── ResultsSection.jsx     # Results display
│   │   ├── ResultsSection.css
│   │   ├── FeatureList.jsx        # Feature highlights
│   │   └── FeatureList.css
│   ├── App.jsx                    # Main application component
│   ├── App.css
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Global styles
│   └── constants.js               # Configuration constants
├── index.html                     # HTML template
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Configuration

The webhook URL and other settings can be modified in `src/constants.js`:

```javascript
export const WEBHOOK_URL = 'https://your-webhook-url.com/generate-video'
```

## 🎯 How It Works

1. **Enter URL**: Paste a webpage URL containing product images
2. **Processing**: The app sends the URL to the backend webhook
3. **Scraping**: Images are extracted from the webpage
4. **AI Generation**: Videos are created using AI (5-10 minutes)
5. **Upload**: Videos are automatically saved to Google Drive
6. **Download**: Access your videos via the provided links

## 🎨 Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations
- **Fetch API** - HTTP requests

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🔒 Security

- All requests use HTTPS
- CORS headers are properly configured
- No sensitive data is stored locally

## 🐛 Troubleshooting

### Development server won't start
- Ensure Node.js is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available

### Build errors
- Clear cache: `rm -rf node_modules/.vite`
- Update dependencies: `npm update`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For questions or issues, please open an issue in the repository.

---

Made with ❤️ using React and Vite

