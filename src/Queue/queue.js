import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Components/navbar";
import DiscreteSlider from "../Components/slider";
import ComplexityAnalysis from "../Components/ComplexityAnalysis";
import SidePanel from '../Components/sidepanel';
import "./queue.css";
import { gsap } from 'gsap';
import { ArrowUpwardRounded, ArrowDownwardRounded, ListRounded } from "@mui/icons-material";

const QueueVisualizer = () => {
  const [queue, setQueue] = useState([]);
  const [maxSize, setSize] = useState(5);
  const [dequeuedElement, setDequeuedElement] = useState(null);
  const [resultText, setResultText] = useState(null);
  const [currVal, setCurrVal] = useState(null);
  const [frontIndex, setFrontIndex] = useState(-1); // State variable for the index of the front pointer
  const [rearIndex, setRearIndex] = useState(-1); // State variable for the index of the rear pointer
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState([]);
  const [algorithmName, setAlgorithmName] = useState("Working of Queue");
  const [timeComplexity, setTimeComplexity] = useState("O(1)");
  const [spaceComplexity, setSpaceComplexity] = useState("O(1)");
  const [realTimeComplexity, setRealTimeComplexity] = useState(null);
  const [realSpaceComplexity, setRealSpaceComplexity] = useState(null);
  const stepsRef = useRef([
    { code: `- two pointers FRONT and REAR` },
    { code: `- FRONT track the first element of the queue` },
    { code: `- REAR track the last element of the queue` },
    { code: `- initially, set value of FRONT and REAR to -1` },
  ]);

  useEffect(() => {
    setAlgorithmSteps(stepsRef.current);
  }, []);

  const setSteps = (operation, newValue = null, dequeuedValue = null) => {
    switch (operation) {
      case 'Enqueue':
        setAlgorithmSteps([
          { code: '1. Check if the queue is full.' },
          { code: '2. If the queue is full, Overflow error.' },
          { code: '3. If the queue is not full, increment the rear pointer to point to the next available empty space.' },
          { code: '4. Add the data element to the queue location where the rear is pointing.' },
          { code: `5. Here, you have successfully added ${newValue}.` },
        ]);
        break;
      case 'Dequeue':
        setAlgorithmSteps([
          { code: '1. Check if the queue is empty.' },
          { code: '2. If the queue is empty, Underflow error.' },
          { code: '3. If the queue is not empty, access the data where the front pointer is pointing.' },
          { code: '4. Increment front pointer to point to the next available data element.' },
          { code: `5. Here, you have removed ${dequeuedValue} from the queue data structure.` },
        ]);
        break;
      case 'Peek':
        setAlgorithmSteps([
          { code: '1. Check if the queue is empty.' },
          { code: '2. If the queue is empty, return “Queue is Empty.”' },
          { code: '3. If the queue is not empty, access the data where the front pointer is pointing.' },
          { code: '4. Return data.' },
        ]);
        break;
      case 'IsEmpty':
        setAlgorithmSteps([
          { code: '1. Check if queue is empty.' },
          { code: '2. If the queue is empty, return “Queue is Empty.”' },
          { code: '3. If the queue is not empty, return “Queue is not empty.”' },
        ]);
        break;
      case 'IsFull':
        setAlgorithmSteps([
          { code: '1. Check if rear == MAXSIZE - 1.' },
          { code: '2. If they are equal, return “Queue is Full.”' },
          { code: '3. If they are not equal, return “Queue is not Full.”' },
        ]);
        break;
      case 'Size':
        setAlgorithmSteps([
          { code: "1. Return rear" }
        ]);
        break;
      default:
        break;
    }
  };

  const calculateSpaceComplexity = (queueLength) => {
    const bytesPerElement = 4; // Assuming each element takes 4 bytes
    return `${queueLength * bytesPerElement} bytes`;
  };

  const enqueue = () => {
    // Enqueue operation logic
    const start = performance.now();
    // Enqueue operation implementation
    if (queue.length < maxSize) {
      const newValue = Math.floor(Math.random() * 10) + 1;
      setQueue((prevQueue) => [...prevQueue, newValue]);
      setFrontIndex(0);
      setRearIndex(queue.length); // Update rear pointer index
      setResultText("Enqueued: ");
      setCurrVal(newValue);
      setSteps('Enqueue', newValue);
      setAlgorithmName('Enqueue');
    } else {
      setResultText("");
      setCurrVal("Queue is full");
    }
    const end = performance.now();
    const executionTime = end - start;
    setRealTimeComplexity(`${executionTime.toFixed(2)} ms`);
    setRealSpaceComplexity(calculateSpaceComplexity(queue.length + 1)); // Update space complexity
  };

  const dequeue = () => {
    // Dequeue operation logic
    const start = performance.now();
    // Dequeue operation implementation
    if (queue.length > 0) {
      const dequeuedValue = queue[0];
      setResultText("Dequeued: ");
      setCurrVal(dequeuedValue);
      setDequeuedElement(dequeuedValue);
      setRearIndex(queue.length - 2); // Update rear pointer index
      if (queue.length === 1) {
        setFrontIndex(-1);
        setRearIndex(-1); // Update rear pointer index
      }
      setQueue((prevQueue) => prevQueue.slice(1));
      setSteps('Dequeue', null, dequeuedValue);
      setAlgorithmName('Dequeue');
    } else {
      setResultText("");
      setCurrVal("Queue is empty");
    }
    const end = performance.now();
    const executionTime = end - start;
    setRealTimeComplexity(`${executionTime.toFixed(2)} ms`);
    setRealSpaceComplexity(calculateSpaceComplexity(queue.length - 1)); // Update space complexity
  };

  const peek = () => {
    // Peek operation logic
    const start = performance.now();
    // Peek operation implementation
    if (queue.length > 0) {
      setResultText("Front: ");
      setCurrVal(queue[0]);
      const timeline = gsap.timeline();
      timeline.to(".top", { background: "#1640D6", translateY: "-8px", duration: 0.5 });
      timeline.to(".top", { background: "#DA0C81", translateY: "0", duration: 0.5, delay: 1 });
      setSteps('Peek');
      setAlgorithmName('Peek');
    } else {
      setResultText("");
      setCurrVal("Queue is empty");
    }
    const end = performance.now();
    const executionTime = end - start;
    setRealTimeComplexity(`${executionTime.toFixed(2)} ms`);
    setRealSpaceComplexity(calculateSpaceComplexity(queue.length)); // Update space complexity
  };

  const isEmpty = () => {
    // IsEmpty operation logic
    setSteps('isEmpty');
    setAlgorithmName('isEmpty');

    const start = performance.now();
    // IsEmpty operation implementation
    setResultText("Is empty: ");
    setCurrVal(queue.length === 0 ? "True" : "False");
    const end = performance.now();
    const executionTime = end - start;
    setRealTimeComplexity(`${executionTime.toFixed(2)} ms`);
    setRealSpaceComplexity(calculateSpaceComplexity(queue.length)); // Update space complexity
  };

  const isFull = () => {
    setSteps('isFull');
    setAlgorithmName('isFull');

    // IsFull operation logic
    const start = performance.now();
    // IsFull operation implementation
    setResultText("Is full: ");
    setCurrVal(queue.length === maxSize ? "True" : "False");
    const end = performance.now();
    const executionTime = end - start;
    setRealTimeComplexity(`${executionTime.toFixed(2)} ms`);
    setRealSpaceComplexity(calculateSpaceComplexity(queue.length)); // Update space complexity
  };

  const size = () => {
    setSteps('Size');
    setAlgorithmName('Size');

    // Size operation logic
    const start = performance.now();
    // Size operation implementation
    setResultText("Size: ");
    setCurrVal(queue.length);
    const end = performance.now();
    const executionTime = end - start;
    setRealTimeComplexity(`${executionTime.toFixed(2)} ms`);
    setRealSpaceComplexity(calculateSpaceComplexity(queue.length)); // Update space complexity
  };

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
  };

  return (
    <>
      <Navbar currentPage="Queue"
        info="queue/info" />
      <button className="side-panel-toggle" onClick={toggleSidePanel}>
        <ListRounded className='sidepanel-icon' />
        View steps
      </button>
      <SidePanel algorithmSteps={algorithmSteps} algorithmName={algorithmName} isOpen={sidePanelOpen} onClose={toggleSidePanel} />
      <div className="queue-visualizer">
        <div>
          <div className="menu">
            <DiscreteSlider
              title='Queue size'
              default={maxSize}
              onCountChange={setSize}
              step={1}
              min={1}
              max={10} />
            <button className='visualize-btn' onClick={enqueue}>Enqueue</button>
            <button className='reset-btn' onClick={dequeue}>Dequeue</button>
            <button onClick={peek}>Peek</button>
            <button onClick={isEmpty}>IsEmpty</button>
            <button onClick={isFull}>IsFull</button>
            <button onClick={size}>Size</button>
          </div>
          {(resultText || currVal) &&
            <div className="result">{resultText} <strong>{currVal}</strong></div>}
          <ComplexityAnalysis
            timeComplexity={timeComplexity}
            realTimeComplexity={realTimeComplexity}
            spaceComplexity={spaceComplexity}
            realSpaceComplexity={realSpaceComplexity}
          />
        </div>

        <div className="queue">

          {frontIndex >= 0 &&
            <div className="pointer front">
              ({frontIndex})
              <span>Front</span>
              <ArrowDownwardRounded />
            </div>
          }
          {dequeuedElement && (
            <div
              className="element dequeued"
              onAnimationEnd={() => setDequeuedElement(null)}
            >
              {dequeuedElement}
            </div>
          )}
          {queue.map((value, index) => (
            <div key={index} className={`element ${index === 0 ? "top" : ""}`}>
              {value}
            </div>
          ))}
          {rearIndex >= 0 && <div className="pointer rear">
            <ArrowUpwardRounded />
            <span>Rear</span>
            ({rearIndex})
          </div>
          }</div>


      </div>
    </>
  );
};

export default QueueVisualizer;

