import ProgressStep from './ProgressStep'
import './ProgressSection.css'

function ProgressSection({ steps, veoStepStatuses, veoProgressPercentage, klingStepStatuses, klingProgressPercentage }) {
  return (
    <div className="progress-section active">
      <div className="dual-progress-container">
        {/* Google Veo Progress */}
        <div className="single-progress">
          <h3 className="progress-title">Google Veo</h3>
          <div className="progress-bar-container">
            <div 
              className="progress-bar veo-progress" 
              style={{ width: `${veoProgressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            {steps.map((step, index) => (
              <ProgressStep
                key={`veo-${step.id}`}
                icon={step.icon}
                title={step.title}
                description={step.description}
                status={veoStepStatuses[index]}
              />
            ))}
          </div>
        </div>

        {/* Kling Progress */}
        <div className="single-progress">
          <h3 className="progress-title">Kling AI</h3>
          <div className="progress-bar-container">
            <div 
              className="progress-bar kling-progress" 
              style={{ width: `${klingProgressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            {steps.map((step, index) => (
              <ProgressStep
                key={`kling-${step.id}`}
                icon={step.icon}
                title={step.title}
                description={step.description}
                status={klingStepStatuses[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressSection

