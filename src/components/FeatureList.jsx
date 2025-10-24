import { FEATURES } from '../constants'
import './FeatureList.css'

function FeatureList() {
  return (
    <div className="feature-list">
      {FEATURES.map((feature, index) => (
        <div key={index} className="feature-item">
          <div className="feature-icon">✓</div>
          <span>{feature}</span>
        </div>
      ))}
    </div>
  )
}

export default FeatureList

