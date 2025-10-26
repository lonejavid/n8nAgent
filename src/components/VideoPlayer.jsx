import { useState } from 'react'
import './VideoPlayer.css'

function VideoPlayer({ videoUrl }) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = 'ai-generated-video.mp4'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="video-player-container">
      <div className="video-frame">
        <video 
          autoPlay 
          muted 
          controls 
          className="video-element"
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <button className="download-btn" onClick={handleDownload}>
        <span className="download-icon">⬇️</span>
        <span>Download Video</span>
      </button>
    </div>
  )
}

export default VideoPlayer

