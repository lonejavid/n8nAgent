import { useState } from 'react'
import './VideoForm.css'

function VideoForm({ onSubmit, disabled }) {
  const [pageUrl, setPageUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pageUrl.trim()) {
      onSubmit(pageUrl)
    }
  }

  return (
    <form className="video-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="pageUrl">Enter webpage URL with product images:</label>
        <input 
          type="url" 
          id="pageUrl" 
          name="pageUrl" 
          placeholder="https://example.com/products" 
          value={pageUrl}
          onChange={(e) => setPageUrl(e.target.value)}
          required
          disabled={disabled}
        />
      </div>

      <button type="submit" className="btn" disabled={disabled}>
        {disabled ? 'Processing...' : 'Generate Videos'}
      </button>
    </form>
  )
}

export default VideoForm

