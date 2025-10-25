import { useState } from 'react'
import VideoForm from './components/VideoForm'
import ProgressSection from './components/ProgressSection'
import ResultsSection from './components/ResultsSection'
import FeatureList from './components/FeatureList'
import { WEBHOOK_URL, CHECK_STATUS_URL, STEPS } from './constants'
import './App.css'

function App() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepStatuses, setStepStatuses] = useState(
    STEPS.map(() => 'pending')
  )
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progressPercentage, setProgressPercentage] = useState(0)

  const updateStepStatus = (stepIndex, status) => {
    setStepStatuses(prev => {
      const newStatuses = [...prev]
      newStatuses[stepIndex] = status
      return newStatuses
    })
    
    // Update progress bar
    const progress = ((stepIndex + 1) / STEPS.length) * 100
    setProgressPercentage(progress)
  }

  const simulateProgress = () => {
    // Step 1: Processing URL (immediate)
    setTimeout(() => {
      updateStepStatus(0, 'active')
      setCurrentStep(0)
    }, 500)
    
    setTimeout(() => {
      updateStepStatus(0, 'completed')
      updateStepStatus(1, 'active')
      setCurrentStep(1)
    }, 2000)

    // Step 2: Scraping Images
    setTimeout(() => {
      updateStepStatus(1, 'completed')
      updateStepStatus(2, 'active')
      setCurrentStep(2)
    }, 5000)

    // Step 3: Processing Images
    setTimeout(() => {
      updateStepStatus(2, 'completed')
      updateStepStatus(3, 'active')
      setCurrentStep(3)
    }, 8000)
  }

  const pollVideoStatus = async (requestId) => {
    const maxAttempts = 40 // 40 attempts × 15 seconds = 10 minutes max
    let attempts = 0

    const checkStatus = async () => {
      attempts++
      console.log(`Checking status... attempt ${attempts}/${maxAttempts}`)
      
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
          console.log('Status check response:', statusData)

          // Check MongoDB status
          if (statusData.status === 'completed' && statusData.videoUrl) {
            // Video is ready!
            updateStepStatus(3, 'completed')
            updateStepStatus(4, 'completed')
            setProgressPercentage(100)
            setResult({
              videoUrl: statusData.videoUrl,
              success: true,
              message: 'Video created successfully!'
            })
            setShowResults(true)
            setIsProcessing(false)
          } else if (statusData.status === 'failed') {
            // Video generation failed
            throw new Error('Video generation failed')
          } else if (statusData.status === 'processing') {
            // Still processing
            if (attempts < maxAttempts) {
              console.log('Still processing... checking again in 15 seconds')
              setTimeout(checkStatus, 15000)
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
        console.error('Polling error:', err)
        updateStepStatus(3, 'error')
        setError(`Failed to check video status: ${err.message}`)
        setShowResults(true)
        setIsProcessing(false)
      }
    }

    // Start checking
    checkStatus()
  }

  const handleSubmit = async (pageUrl) => {
    setIsProcessing(true)
    setShowProgress(true)
    setShowResults(false)
    setError(null)
    setProgressPercentage(0)
    setStepStatuses(STEPS.map(() => 'pending'))

    // Start progress simulation
    simulateProgress()

    try {
      // Send request to start video generation (should respond immediately with requestId)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout for initial request
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: pageUrl  // Send the URL the user entered
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Initial response:', data)
      
      // Check if we got a requestId
      if (data.requestId) {
        console.log('Got requestId:', data.requestId)
        console.log('Starting to poll for status...')
        
        // Start polling for status
        pollVideoStatus(data.requestId)
      } else {
        throw new Error('No requestId received from server')
      }
    } catch (err) {
      console.error('Error:', err)
      updateStepStatus(0, 'error')
      
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your internet connection and try again.')
      } else {
        setError(`Failed to start video generation: ${err.message}`)
      }
      
      setShowResults(true)
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setIsProcessing(false)
    setShowProgress(false)
    setShowResults(false)
    setCurrentStep(0)
    setStepStatuses(STEPS.map(() => 'pending'))
    setResult(null)
    setError(null)
    setProgressPercentage(0)
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🎬 AI Video Generator</h1>
        <p className="subtitle">Transform your product images into engaging videos with AI</p>

        <VideoForm 
          onSubmit={handleSubmit} 
          disabled={isProcessing}
        />

        {showProgress && (
          <ProgressSection 
            steps={STEPS}
            stepStatuses={stepStatuses}
            progressPercentage={progressPercentage}
          />
        )}

        {showResults && (
          <ResultsSection 
            result={result}
            error={error}
            onReset={handleReset}
          />
        )}

        {!showProgress && (
          <FeatureList />
        )}
      </div>
    </div>
  )
}

export default App

