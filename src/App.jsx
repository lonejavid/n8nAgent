import { useState } from 'react'
import VideoForm from './components/VideoForm'
import ProgressSection from './components/ProgressSection'
import ResultsSection from './components/ResultsSection'
import FeatureList from './components/FeatureList'
import { WEBHOOK_URL_KLING, WEBHOOK_URL_GOOGLE_VEO, CHECK_STATUS_URL, STEPS } from './constants'
import './App.css'

function App() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  // Separate state for Google Veo
  const [veoCurrentStep, setVeoCurrentStep] = useState(0)
  const [veoStepStatuses, setVeoStepStatuses] = useState(STEPS.map(() => 'pending'))
  const [veoResult, setVeoResult] = useState(null)
  const [veoError, setVeoError] = useState(null)
  const [veoProgressPercentage, setVeoProgressPercentage] = useState(0)
  
  // Separate state for Kling
  const [klingCurrentStep, setKlingCurrentStep] = useState(0)
  const [klingStepStatuses, setKlingStepStatuses] = useState(STEPS.map(() => 'pending'))
  const [klingResult, setKlingResult] = useState(null)
  const [klingError, setKlingError] = useState(null)
  const [klingProgressPercentage, setKlingProgressPercentage] = useState(0)

  // Update step status for Google Veo
  const updateVeoStepStatus = (stepIndex, status) => {
    setVeoStepStatuses(prev => {
      const newStatuses = [...prev]
      newStatuses[stepIndex] = status
      return newStatuses
    })
    const progress = ((stepIndex + 1) / STEPS.length) * 100
    setVeoProgressPercentage(progress)
  }

  // Update step status for Kling
  const updateKlingStepStatus = (stepIndex, status) => {
    setKlingStepStatuses(prev => {
      const newStatuses = [...prev]
      newStatuses[stepIndex] = status
      return newStatuses
    })
    const progress = ((stepIndex + 1) / STEPS.length) * 100
    setKlingProgressPercentage(progress)
  }

  // Simulate progress for Google Veo
  const simulateVeoProgress = () => {
    setTimeout(() => {
      updateVeoStepStatus(0, 'active')
      setVeoCurrentStep(0)
    }, 500)
    
    setTimeout(() => {
      updateVeoStepStatus(0, 'completed')
      updateVeoStepStatus(1, 'active')
      setVeoCurrentStep(1)
    }, 2000)

    setTimeout(() => {
      updateVeoStepStatus(1, 'completed')
      updateVeoStepStatus(2, 'active')
      setVeoCurrentStep(2)
    }, 5000)

    setTimeout(() => {
      updateVeoStepStatus(2, 'completed')
      updateVeoStepStatus(3, 'active')
      setVeoCurrentStep(3)
    }, 8000)
  }

  // Simulate progress for Kling
  const simulateKlingProgress = () => {
    setTimeout(() => {
      updateKlingStepStatus(0, 'active')
      setKlingCurrentStep(0)
    }, 500)
    
    setTimeout(() => {
      updateKlingStepStatus(0, 'completed')
      updateKlingStepStatus(1, 'active')
      setKlingCurrentStep(1)
    }, 2000)

    setTimeout(() => {
      updateKlingStepStatus(1, 'completed')
      updateKlingStepStatus(2, 'active')
      setKlingCurrentStep(2)
    }, 5000)

    setTimeout(() => {
      updateKlingStepStatus(2, 'completed')
      updateKlingStepStatus(3, 'active')
      setKlingCurrentStep(3)
    }, 8000)
  }

  // Poll Google Veo video status (5 seconds interval)
  const pollVeoVideoStatus = async (requestId) => {
    const maxAttempts = 120 // 120 attempts × 5 seconds = 10 minutes max
    let attempts = 0

    const checkStatus = async () => {
      attempts++
      
      try {
        const response = await fetch(CHECK_STATUS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestId })
        })

        if (response.ok) {
          const statusData = await response.json()

          if (statusData.status === 'completed' && statusData.videoUrl) {
            // Video is ready!
            updateVeoStepStatus(3, 'completed')
            setVeoProgressPercentage(100)
            setVeoResult({
              videoUrl: statusData.videoUrl,
              success: true,
              message: 'Video created successfully!'
            })
            setShowResults(true)
          } else if (statusData.status === 'failed') {
            throw new Error('Video generation failed')
          } else if (statusData.status === 'processing') {
            if (attempts < maxAttempts) {
              setTimeout(checkStatus, 5000)
            } else {
              throw new Error('Video generation timed out after 10 minutes')
            }
          } else {
            throw new Error('Unknown status: ' + statusData.status)
          }
        } else {
          throw new Error(`Status check failed with status: ${response.status}`)
        }
      } catch (err) {
        updateVeoStepStatus(3, 'error')
        setVeoError(`Failed to check video status: ${err.message}`)
        setShowResults(true)
      }
    }

    checkStatus()
  }

  // Poll Kling video status (7 seconds interval)
  const pollKlingVideoStatus = async (requestId) => {
    const maxAttempts = 86 // 86 attempts × 7 seconds ≈ 10 minutes max
    let attempts = 0

    const checkStatus = async () => {
      attempts++
      
      try {
        const response = await fetch(CHECK_STATUS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestId })
        })

        if (response.ok) {
          const statusData = await response.json()

          if (statusData.status === 'completed' && statusData.videoUrl) {
            // Video is ready!
            updateKlingStepStatus(3, 'completed')
            setKlingProgressPercentage(100)
            setKlingResult({
              videoUrl: statusData.videoUrl,
              success: true,
              message: 'Video created successfully!'
            })
            setShowResults(true)
          } else if (statusData.status === 'failed') {
            throw new Error('Video generation failed')
          } else if (statusData.status === 'processing') {
            if (attempts < maxAttempts) {
              setTimeout(checkStatus, 7000)
            } else {
              throw new Error('Video generation timed out after 10 minutes')
            }
          } else {
            throw new Error('Unknown status: ' + statusData.status)
          }
        } else {
          throw new Error(`Status check failed with status: ${response.status}`)
        }
      } catch (err) {
        updateKlingStepStatus(3, 'error')
        setKlingError(`Failed to check video status: ${err.message}`)
        setShowResults(true)
      }
    }

    checkStatus()
  }

  const handleSubmit = async (pageUrl) => {
    setIsProcessing(true)
    setShowProgress(true)
    setShowResults(false)
    
    // Reset all state for both videos
    setVeoError(null)
    setKlingError(null)
    setVeoProgressPercentage(0)
    setKlingProgressPercentage(0)
    setVeoStepStatuses(STEPS.map(() => 'pending'))
    setKlingStepStatuses(STEPS.map(() => 'pending'))
    setVeoResult(null)
    setKlingResult(null)

    // Start progress simulation for both
    simulateVeoProgress()
    simulateKlingProgress()

    const requestBody = {
      url: pageUrl  // Send the URL the user entered
    }

    // Call Google Veo webhook
    const callGoogleVeo = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)
        
        const response = await fetch(WEBHOOK_URL_GOOGLE_VEO, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseText = await response.text()
        
        let data
        try {
          data = JSON.parse(responseText)
        } catch (jsonError) {
          throw new Error('Invalid JSON response from server')
        }
        
        if (data.requestId) {
          pollVeoVideoStatus(data.requestId)
        } else {
          throw new Error('No requestId received from server')
        }
      } catch (err) {
        updateVeoStepStatus(0, 'error')
        
        if (err.name === 'AbortError') {
          setVeoError('Request timed out. Please check your internet connection and try again.')
        } else {
          setVeoError(`Failed to start video generation: ${err.message}`)
        }
        setShowResults(true)
      }
    }

    // Call Kling webhook
    const callKling = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)
        
        const response = await fetch(WEBHOOK_URL_KLING, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseText = await response.text()
        
        let data
        try {
          data = JSON.parse(responseText)
        } catch (jsonError) {
          throw new Error('Invalid JSON response from server')
        }
        
        if (data.requestId) {
          pollKlingVideoStatus(data.requestId)
        } else {
          throw new Error('No requestId received from server')
        }
      } catch (err) {
        updateKlingStepStatus(0, 'error')
        
        if (err.name === 'AbortError') {
          setKlingError('Request timed out. Please check your internet connection and try again.')
        } else {
          setKlingError(`Failed to start video generation: ${err.message}`)
        }
        setShowResults(true)
      }
    }

    // Call both webhooks simultaneously
    await Promise.all([callGoogleVeo(), callKling()])
  }

  const handleReset = () => {
    setIsProcessing(false)
    setShowProgress(false)
    setShowResults(false)
    
    // Reset Google Veo state
    setVeoCurrentStep(0)
    setVeoStepStatuses(STEPS.map(() => 'pending'))
    setVeoResult(null)
    setVeoError(null)
    setVeoProgressPercentage(0)
    
    // Reset Kling state
    setKlingCurrentStep(0)
    setKlingStepStatuses(STEPS.map(() => 'pending'))
    setKlingResult(null)
    setKlingError(null)
    setKlingProgressPercentage(0)
  }

  const isVideoReady = showResults && (veoResult?.videoUrl || klingResult?.videoUrl)

  return (
    <div className="app">
      <div className="container">
        {/* Show header and form ONLY when video is NOT playing */}
        {!isVideoReady && (
          <>
            <h1>🎬 AI Video Generator</h1>
            <p className="subtitle">Transform your product images into engaging videos with AI</p>

            <VideoForm 
              onSubmit={handleSubmit} 
              disabled={isProcessing}
            />
          </>
        )}

        {/* Show progress ONLY while processing and NOT when video is ready */}
        {showProgress && !isVideoReady && (
          <ProgressSection 
            steps={STEPS}
            veoStepStatuses={veoStepStatuses}
            veoProgressPercentage={veoProgressPercentage}
            klingStepStatuses={klingStepStatuses}
            klingProgressPercentage={klingProgressPercentage}
          />
        )}

        {/* Show results (with back button when video is ready) */}
        {showResults && (
          <>
            {isVideoReady && (
              <button className="back-to-home-btn" onClick={handleReset}>
                <span className="back-icon">←</span>
                <span>Back to Home</span>
              </button>
            )}
            <ResultsSection 
              veoResult={veoResult}
              veoError={veoError}
              klingResult={klingResult}
              klingError={klingError}
              onReset={handleReset}
            />
          </>
        )}

        {!showProgress && !showResults && (
          <FeatureList />
        )}
      </div>
    </div>
  )
}

export default App

