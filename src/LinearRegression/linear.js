import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import { gsap } from 'gsap';
import Navbar from '../Components/navbar';
import './LinearRegression.css';

const LinearRegression = () => {
  const [points, setPoints] = useState([]);
  const [slope, setSlope] = useState(0);
  const [intercept, setIntercept] = useState(0);
  const [error, setError] = useState(0);
  const [steps, setSteps] = useState([]);
  const [inputX, setInputX] = useState('');
  const [predictedY, setPredictedY] = useState(null);
  const svgRef = useRef();

  useEffect(() => {
    if (points.length > 1) {
      calculateLinearRegression();
    }
  }, [points]);

  const addPoint = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaledX = ((x - 50) / 500) * 100; // Map X to range [0, 100]
    const scaledY = 100 - ((y - 50) / 400) * 100; // Map Y to range [0, 100]
    setPoints([...points, { x: scaledX, y: scaledY }]);
  };

  const calculateLinearRegression = () => {
    const n = points.length;
    const sumX = points.reduce((acc, point) => acc + point.x, 0);
    const sumY = points.reduce((acc, point) => acc + point.y, 0);
    const sumXY = points.reduce((acc, point) => acc + point.x * point.y, 0);
    const sumXX = points.reduce((acc, point) => acc + point.x * point.x, 0);

    const calculatedSlope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const calculatedIntercept = (sumY - calculatedSlope * sumX) / n;

    setSlope(calculatedSlope);
    setIntercept(calculatedIntercept);
    drawLine(calculatedSlope, calculatedIntercept);
    calculateError(calculatedSlope, calculatedIntercept);
    setSteps([
      `n = ${n}`,
      `sumX = ${sumX.toFixed(2)}`,
      `sumY = ${sumY.toFixed(2)}`,
      `sumXY = ${sumXY.toFixed(2)}`,
      `sumXX = ${sumXX.toFixed(2)}`,
      `Slope (m) = ${calculatedSlope.toFixed(2)}`,
      `Intercept (b) = ${calculatedIntercept.toFixed(2)}`,
    ]);
  };

  const calculateError = (slope, intercept) => {
    const error = points.reduce((acc, point) => {
      const predictedY = slope * point.x + intercept;
      return acc + Math.pow(point.y - predictedY, 2);
    }, 0) / points.length;
    setError(error);
  };

  const drawLine = (slope, intercept) => {
    const svg = svgRef.current;
    const line = svg.querySelector('line#bestFitLine');
    const scaledInterceptY = 450 - (intercept / 100) * 400;
    const scaledY2 = 450 - ((slope * 100 + intercept) / 100) * 400;

    gsap.to(line, {
      attr: {
        x1: 50,
        y1: scaledInterceptY,
        x2: 550,
        y2: scaledY2,
      },
      duration: 1,
    });
  };

  const handlePredict = () => {
    if (!isNaN(inputX)) {
      const x = parseFloat(inputX);
      const y = slope * x + intercept;
      setPredictedY(y.toFixed(2));
    }
  };

  const resetPoints = () => {
    setPoints([]);
    setSlope(0);
    setIntercept(0);
    setError(0);
    setSteps([]);
    setPredictedY(null);
    drawLine(0, 0);
  };

  return (
    <div>
      <Navbar currentPage="Linear Regression"
        info="linear-regression/info" />
      <div className='menu'>
        <input
          placeholder="Enter x value"
          value={inputX}
          onChange={(e) => setInputX(e.target.value)}
        />
        <button className='visualize-btn' onClick={handlePredict}>Predict y</button>
        <button className='reset-btn' onClick={resetPoints}>Reset</button>
      </div>
      {predictedY !== null && (
        <Typography variant="body1" align="center" gutterBottom>
          {predictedY && <div className="result">Predicted y = <strong>{predictedY}</strong></div>}
        </Typography>
      )}
      <div className='regression'>
        <div className="graph-container">
          <svg
            ref={svgRef}
            onClick={addPoint}
            className="graph"
          >
            {/* Axes */}
            <line x1="50" y1="450" x2="550" y2="450" stroke="black" strokeWidth="1" />
            <line x1="50" y1="50" x2="50" y2="450" stroke="black" strokeWidth="1" />

            {/* Axes labels */}
            <text x="555" y="440" fontSize="12">X</text>
            <text x="40" y="40" fontSize="12">Y</text>

            {/* Scale markers */}
            {[...Array(11)].map((_, i) => (
              <React.Fragment key={i}>
                <line x1={50 + 50 * i} y1="445" x2={50 + 50 * i} y2="455" stroke="black" strokeWidth="1" />
                <text x={50 * i + 40} y="470" fontSize="10">{10 * i}</text>
                <line x1="50" y1={450 - 40 * i} x2="55" y2={450 - 40 * i} stroke="black" strokeWidth="1" />
                <text x="20" y={450 - 40 * i + 5} fontSize="10">{10 * i}</text>
              </React.Fragment>
            ))}

            <line id="bestFitLine" x1="50" y1="450" x2="550" y2="450" stroke="red" strokeWidth="2" />
            {points.map((point, index) => (
              <circle key={index} cx={50 + (point.x / 100) * 500} cy={450 - (point.y / 100) * 400} r="5" fill="blue" />
            ))}
          </svg>

          <Typography variant="body2" align="center" marginTop={"10px"} color={"gray"}>
            Click inside the box to add points.
            <br />The red line represents the best-fit line calculated using linear regression.
          </Typography>
        </div>

        <div className='calculations'>
          <p>
            Line Equation: y = {slope.toFixed(2)}x + {intercept.toFixed(2)}
          </p>
          <p>
            Mean Squared Error: {error.toFixed(2)}
          </p>
          {steps.length > 0 &&
            <>
              <h4>Step-by-Step Calculation</h4>
              <ul className="steps-list">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default LinearRegression;
