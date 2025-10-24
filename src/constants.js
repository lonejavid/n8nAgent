export const WEBHOOK_URL = 'https://lonejavid.app.n8n.cloud/webhook/generate-video'

export const STEPS = [
  {
    id: 'step1',
    icon: '🔗',
    title: 'Processing URL',
    description: 'Analyzing the webpage...'
  },
  {
    id: 'step2',
    icon: '🔍',
    title: 'Scraping Images',
    description: 'Extracting product images from the page...'
  },
  {
    id: 'step3',
    icon: '🖼️',
    title: 'Processing Images',
    description: 'Preparing images for video generation...'
  },
  {
    id: 'step4',
    icon: '🎬',
    title: 'Generating AI Video',
    description: 'Creating your video with AI (this may take 5-10 minutes)...'
  },
  {
    id: 'step5',
    icon: '☁️',
    title: 'Uploading to Drive',
    description: 'Saving your video to Google Drive...'
  }
]

export const FEATURES = [
  'Automatically extracts images from webpage',
  'Generates AI-powered product videos',
  'Saves directly to Google Drive'
]

