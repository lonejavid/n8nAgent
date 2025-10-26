//export const WEBHOOK_URL = 'https://lonejavid.app.n8n.cloud/webhook/generate-video'
export const WEBHOOK_URL_KLING='https://oneorb.app.n8n.cloud/webhook/generate-video'
export const WEBHOOK_URL_GOOGLE_VEO='https://oneorb.app.n8n.cloud/webhook/generate-video-google-veo'
// export const CHECK_STATUS_URL = 'https://lonejavid.app.n8n.cloud/webhook/check-status'
//export const CHECK_STATUS_URL = 'https://oneorb.app.n8n.cloud/webhook-test/check-status'
export const CHECK_STATUS_URL ='https://oneorb.app.n8n.cloud/webhook/check-status'
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
  }
]

export const FEATURES = [
  'Automatically extracts images from webpage',
  'Generates AI-powered product videos',
  'Watch your video instantly in the browser'
]

