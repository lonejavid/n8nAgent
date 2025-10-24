import ProgressStep from './ProgressStep'
import './ProgressSection.css'

function ProgressSection({ steps, stepStatuses, progressPercentage }) {
  return (
    <div className="progress-section active">
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="progress-steps">
        {steps.map((step, index) => (
          <ProgressStep
            key={step.id}
            icon={step.icon}
            title={step.title}
            description={step.description}
            status={stepStatuses[index]}
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressSection

