import { useState } from 'react'
import VideoForm from './components/VideoForm'
import ProgressSection from './components/ProgressSection'
import ResultsSection from './components/ResultsSection'
import FeatureList from './components/FeatureList'
import { WEBHOOK_URL, STEPS } from './constants'
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
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageUrl: pageUrl
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Complete AI generation step
        updateStepStatus(3, 'completed')
        updateStepStatus(4, 'active')
        setCurrentStep(4)

        // Complete upload step after a delay
        setTimeout(() => {
          updateStepStatus(4, 'completed')
          setProgressPercentage(100)
          setResult(data)
          setShowResults(true)
          setIsProcessing(false)
        }, 1500)
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || 'Failed to process request. Please check the URL and try again.'
        updateStepStatus(3, 'error')
        setError(errorMessage)
        setShowResults(true)
        setIsProcessing(false)
      }
    } catch (err) {
      console.error('Error:', err)
      updateStepStatus(3, 'error')
      setError('Network error occurred. Please check your connection and try again.')
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

