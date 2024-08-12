import React from 'react';
import './sidepanel.css';
import { CloseRounded } from '@material-ui/icons';

const SidePanel = ({ algorithmName, algorithmSteps, isOpen, onClose }) => {
  return (
    <div className={`side-panel ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <>
          <div className="side-panel-header">
            <span>Algorithm Steps</span>
            <button className="close-btn" onClick={onClose}>
              <CloseRounded />
            </button>
          </div>
          <div className="panel-content">
            {algorithmName && <p class="steps-title">{algorithmName + ":"}</p>
            }
            {algorithmSteps.map((step, index) => (
              <p key={index} className="step">
                {step.code}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SidePanel;
