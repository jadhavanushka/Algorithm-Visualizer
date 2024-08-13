import React, { useState, useEffect, useRef } from 'react';
import './sidepanelso.css'; // Make sure to define your styles in this CSS file
import { CloseRounded } from '@mui/icons-material';
import { gsap } from 'gsap';
import { PlayArrow, PauseSharp, SkipPrevious, SkipNext } from '@mui/icons-material';

const SidePanel = ({ algorithmSteps1, algorithmSteps2, algorithmName1, algorithmName2, isOpen, onClose, isDouble }) => {
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
            {algorithmName1 && <p class="steps-title">{algorithmName1 + ":"}</p>}
            <div className={`panel-section ${isDouble ? 'half-height' : ''}`}>
              {algorithmSteps1.map((step, index) => (
                <p key={index} className="step">
                  {step.code}
                </p>
              ))}
            </div>
            {isDouble && (
              <div>
                <hr />
                {algorithmName2 && <p class="steps-title">{algorithmName2 + ":"}</p>}
                <div className="panel-section half-height">
                  {algorithmSteps2.map((step, index) => (
                    <p key={index} className="step">
                      {step.code}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SidePanel;
