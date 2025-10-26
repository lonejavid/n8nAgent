import './ResultsSection.css'

function ResultsSection({ result, error, onReset }) {
  if (error) {
    return (
      <div className="results-section active">
        <div className="result-card error">
          <div className="result-title">❌ Error Occurred</div>
          <div className="result-message">{error}</div>
          <button className="retry-btn" onClick={onReset}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!result) return null

  const getVideoLinks = () => {
    if (result.videos && Array.isArray(result.videos)) {
      return result.videos.map((video, index) => {
        const url = video.webViewLink || video.videoUrl || video.url
        return (
          <a 
            key={index}
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="video-link"
          >
            <div className="video-link-text">
              <span className="video-link-icon">📹</span>
              <span>Video {index + 1}</span>
            </div>
            <span>➜</span>
          </a>
        )
      })
    } else if (result.videoUrl || result.webViewLink) {
      const videoUrl = result.videoUrl || result.webViewLink
      return (
        <a 
          href={videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="video-link"
        >
          <div className="video-link-text">
            <span className="video-link-icon">🎬</span>
            <span>Watch Your Video Here</span>
          </div>
          <span>➜</span>
        </a>
      )
    } else if (result.driveFolder) {
      return (
        <a 
          href={result.driveFolder} 
          target="_blank" 
          rel="noopener noreferrer"
          className="video-link"
        >
          <div className="video-link-text">
            <span className="video-link-icon">📁</span>
            <span>Open Google Drive Folder</span>
          </div>
          <span>➜</span>
        </a>
      )
    }
    return null
  }

  const videoLinks = getVideoLinks()
  const isMultipleVideos = result.videos && result.videos.length > 1

  return (
    <div className="results-section active">
      <div className="result-card">
        <div className="result-title">🎉 Success!</div>
        <div className="result-message">
          Your AI video is ready! Click below to watch it.
        </div>
        {videoLinks && (
          <div className="video-links">
            {videoLinks}
          </div>
        )}
        <button className="retry-btn" onClick={onReset}>
          Generate Another Video
        </button>
      </div>
    </div>
  )
}

export default ResultsSection

