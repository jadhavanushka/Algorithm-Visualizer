// BinarySearch.js
import React, { Component } from 'react';
import Navbar from '../Components/navbar';
import Menu from "./menu";
import Rects from './rects';
import SidePanel from '../Components/sidepanel'; // Import the SidePanel component
import { ListRounded } from '@material-ui/icons';
import ComplexityAnalysis from "../Components/ComplexityAnalysis";

class BinarySearch extends Component {
  state = {
    count: 10,
    target: null,
    rects: [],
    isRunning: false,
    resultText: '',
    currentStep: null,
    sidePanelOpen: false, // State to manage side panel visibility
    algorithmName: "Binary search",
    algorithmSteps: [
      { code: "1. Initialize low and high pointers for the array." },
      { code: "2. Repeat until low pointer is less than or equal to high pointer.", },
      { code: "3. Calculate mid pointer as the average of low and high pointers.", },
      { code: "4. If the value at mid pointer equals the target, return the index of mid.", },
      { code: "5. If the value at mid pointer is less than the target, move the low pointer to mid + 1.", },
      { code: "6. If the value at mid pointer is greater than the target, move the high pointer to mid - 1.", },
      { code: "7. If the target is not found in the array, return -1.", },
    ],
    timeComplexity: "O(log N)", // Default time complexity
    spaceComplexity: "O(1)", // Default space complexity
    realTimeComplexity: null, // State to store real-time complexity
    realSpaceComplexity: null, // State to store real-space complexity
  };

  componentDidMount() {
    this.handleRandomize();
  }

  // Function to calculate time complexity of binary search
  calculateTimeComplexity(count) {
    // Binary search has O(log n) time complexity
    return `O(log ${count})`;
  }

  // Function to calculate space complexity of binary search
  calculateSpaceComplexity(count) {
    // The space complexity of an array of n elements is roughly n * size_of_element_in_bytes
    // Here, each element in rects array is an object with a few properties, so we estimate the size of each element as the size of an empty object.
    // The size of an empty object is platform-dependent, but we can estimate it to be around 8 bytes.
    const elementSizeInBytes = 8; // Estimated size of an empty object in bytes
    const spaceComplexityInBytes = count * elementSizeInBytes;
    return `${spaceComplexityInBytes} bytes`;
  }

  render() {
    const { sidePanelOpen, algorithmSteps, algorithmName, timeComplexity, spaceComplexity, realTimeComplexity, realSpaceComplexity, isRunning, resultText } = this.state;
    // Calculate default time and space complexities
    const defaultTimeComplexity = this.calculateTimeComplexity(this.state.count);
    const defaultSpaceComplexity = this.calculateSpaceComplexity(this.state.count);

    return (
      <React.Fragment>
        <Navbar currentPage="Binary Search"
          info="BinarySearch/info" />
        <Menu
          disable={this.state.isRunning}
          onVisualize={this.handleSearch}
          onRandomize={this.handleRandomize}
          onReset={this.handleReset}
          onCountChange={this.handleCountChange}
          onTargetChange={this.handleTargetChange}
        />
        {resultText && <div className="result">{resultText}</div>}

        {/* Side panel toggle button */}
        <button className="side-panel-toggle" onClick={this.toggleSidePanel}>
          <ListRounded className='sidepanel-icon' />
          View steps
        </button>

        {/* Render the side panel component */}
        <SidePanel isOpen={sidePanelOpen} onClose={this.toggleSidePanel} algorithmSteps={algorithmSteps} algorithmName={algorithmName} />

        <div className='justify-content-center'>
          <Rects
            rects={this.state.rects}
            target={this.state.target}
          />
        </div>
        <div>
          {/* Display time and space complexity */}
          <ComplexityAnalysis
            timeComplexity={timeComplexity}
            realTimeComplexity={realTimeComplexity}
            spaceComplexity={spaceComplexity}
            realSpaceComplexity={realSpaceComplexity}
          />
        </div>
      </React.Fragment>
    );
  }

  // Function to handle randomization of array
  handleRandomize = () => {
    let randomArray = Array.from({ length: this.state.count }, () => Math.floor(Math.random() * 100)); // Generate random numbers between 0 and 100

    // Sort the array in ascending order
    randomArray.sort((a, b) => a - b);

    const rects = randomArray.map((value, index) => ({
      value: value,
      isTarget: false,
      isHighlight: false,
    }));

    this.setState({ rects, resultText: "" });
  }

  // Function to handle reset
  handleReset = () => {
    this.setState({
      isRunning: false,
      currentStep: null,
    });
    this.handleRandomize();
  }

  // Function to handle count change
  handleCountChange = (val) => {
    this.setState({ count: val }, this.handleRandomize);
  }

  // Function to handle target change
  handleTargetChange = (val) => {
    this.setState({ target: val });
  }

  // Function to handle binary search
  handleSearch = (searchValue) => {
    this.setState({ isRunning: true, target: searchValue }, () => {
      const { target, rects } = this.state;
      let low = 0;
      let high = rects.length - 1;
      let steps = [];
      let resultText = ""
      let found = false;
      const startTime = performance.now(); // Start measuring time
      while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        steps.push({ low, high, mid });
        if (rects[mid].value === target) {
          steps.push({ found: true, index: mid });
          found = true;
          resultText = 'Found ' + searchValue;
          break;
        } else if (rects[mid].value < target) {
          steps.push({ mid, direction: 'right' });
          low = mid + 1;
        } else {
          steps.push({ mid, direction: 'left' });
          high = mid - 1;
        }
      }
      if (!found)
        resultText = searchValue + " not found!";

      const endTime = performance.now(); // Stop measuring time
      const executionTime = (endTime - startTime).toFixed(2); // Calculate execution time in milliseconds
      const realTimeComplexity = `${executionTime} ms`; // Display execution time

      // Calculate space complexity
      const realSpaceComplexity = this.calculateSpaceComplexity(rects.length);

      this.animateSearch(steps);

      // Update time and space complexity
      this.setState({ realTimeComplexity, realSpaceComplexity, resultText });
    });
  }

  // Function to animate the search
  animateSearch = (steps) => {
    const animateStep = (index) => {
      if (index === steps.length) {
        this.setState({ isRunning: false });
        return;
      }
      const step = steps[index];
      const { low, high, mid, found, index: targetIndex } = step;
      const updatedRects = this.state.rects.map((rect, i) => {
        if (found && i === targetIndex) {
          return { ...rect, isTarget: true, isHighlight: false, isMid: false };
        } else if (i === low || i === high) {
          return { ...rect, isHighlight: true, isMid: false, isTarget: false };
        } else if (i === mid) {
          return { ...rect, isMid: true, isTarget: false };
        } else {
          return { ...rect, isHighlight: false, isMid: false, isTarget: false };
        }
      });
      this.setState({ rects: updatedRects, currentStep: step });
      setTimeout(() => {
        animateStep(index + 1);
      }, 1000);
    };
    animateStep(0);
  }

  // Function to toggle side panel
  toggleSidePanel = () => {
    this.setState(prevState => ({
      sidePanelOpen: !prevState.sidePanelOpen,
    }));
  };
}

export default BinarySearch;
