import { useState, useEffect } from 'react'
import './VideoPlayer.css'

function VideoPlayer({ videoUrl }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  
  // Check if it's a Google Drive link
  const isGoogleDrive = videoUrl.includes('drive.google.com')

  // Auto-retry Google Drive iframe every 30 seconds
  useEffect(() => {
    if (isGoogleDrive && retryCount < 10) { // Max 10 retries = 5 minutes
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 30000) // 30 seconds
      
      return () => clearTimeout(timer)
    }
  }, [isGoogleDrive, retryCount])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = 'ai-generated-video.mp4'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInDrive = () => {
    window.open(videoUrl, '_blank')
  }

  return (
    <div className="video-player-container">
      <div className="video-frame">
        {isGoogleDrive ? (
          <div className="google-drive-preview">
            <iframe
              key={retryCount} // Force reload on retry
              src={`https://drive.google.com/file/d/${videoUrl.match(/\/file\/d\/([^\/]+)/)?.[1]}/preview`}
              className="video-element"
              allow="autoplay"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <video 
            controls 
            className="video-element"
            onLoadedData={() => setIsLoaded(true)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      
      {isGoogleDrive ? (
        <button className="access-btn" onClick={handleOpenInDrive}>
          <span className="access-icon">🔗</span>
          <span>You can access the video here as well</span>
        </button>
      ) : (
        <button className="download-btn" onClick={handleDownload}>
          <span className="download-icon">⬇️</span>
          <span>Download Video</span>
        </button>
      )}
    </div>
  )
}

export default VideoPlayer

