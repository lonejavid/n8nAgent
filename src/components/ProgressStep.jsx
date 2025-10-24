import './ProgressStep.css'

function ProgressStep({ icon, title, description, status }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <span className="checkmark">✓</span>
      case 'error':
        return <span className="error-icon">✕</span>
      case 'active':
        return <div className="loader"></div>
      default:
        return icon
    }
  }

  return (
    <div className={`progress-step ${status}`}>
      <div className="step-icon">
        {getStatusIcon()}
      </div>
      <div className="step-content">
        <div className="step-title">{title}</div>
        <div className="step-description">{description}</div>
      </div>
    </div>
  )
}

export default ProgressStep

