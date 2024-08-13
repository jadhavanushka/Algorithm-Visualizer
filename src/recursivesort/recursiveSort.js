import React, { Component } from "react";
import Rects from "../Sorting/rects";
import Navbar from '../Components/navbar';
import Menu from "./menu";
import heapSort from "./heapSort";
import { quickSortRecursive } from "./quickSortRecursive";
import mergeSort from "./mergeSort";
import SidePanel from "../Components/sidepanel";
import { ListRounded } from '@mui/icons-material';
import { quickSort } from "../Sorting/algorithms/quickSort";
import { mergeSortSteps } from "./mergeSort"; // Import mergeSortSteps 
import { heapSortSteps } from "./heapSort"
import { quickSortSteps } from "./quickSortRecursive"
import ComplexityAnalysis from "../Components/ComplexityAnalysis";

class RecursiveSort extends Component {
    state = {
        count: 20,
        rects: [],
        speed: 50,
        isRunning: false,
        algo: 0,
        sidePanelOpen: false, // State variable for side panel visibility
        algorithmSteps: [],
        algorithmName:"",
        timeComplexity: '',
        spaceComplexity: '',
        realTimeComplexity: '',
        realSpaceComplexity: '',
        comparisons: 0,
        swaps: 0,
        memoryUsage: 0,
        complexityInterval: null,
    }

    componentDidMount() {
        var rects = getInitialRects(this.state.count);
        this.setState({ rects });
        this.setAlgorithmSteps(0);
    }

    setAlgorithmSteps = (selectedAlgo) => {
        // Define your algorithm steps here
        let steps = [];
        let algorithmName="";
        let timeComplexity = '';
        let spaceComplexity = '';
        switch (parseInt(selectedAlgo)) {
            case 0:
                steps = mergeSortSteps;
                algorithmName = "Merge sort";
                timeComplexity = 'O(n log n)';
                spaceComplexity = 'O(n)';
                break;

            case 1:
                steps = heapSortSteps;
                algorithmName = "Heap sort";
                timeComplexity = 'O(n log n)';
                spaceComplexity = 'O(1)';
                break;
            case 2:
                steps = quickSortSteps;
                algorithmName = "Quick sort";
                timeComplexity = 'O(n log n)';
                spaceComplexity = 'O(log n)';
                break;
            default:
                break
        }
        this.setState({ algorithmSteps: steps, algorithmName, timeComplexity, spaceComplexity });
    }

    toggleSidePanel = () => {
        this.setState(prevState => ({ sidePanelOpen: !prevState.sidePanelOpen }));
    };

    render() {
        const { timeComplexity, spaceComplexity, realTimeComplexity, realSpaceComplexity, algorithmName } = this.state;
        return (
            <React.Fragment>
                <Navbar currentPage="Recursive Sort" 
                info="Recursivesort/info"/>
                <Menu className="menu"
                    isDisabled={this.state.isRunning}
                    onVisualize={this.handleSort}
                    onRandomize={this.handleRandomize}
                    onRefresh={this.handleRefresh}
                    onCountChange={this.handleCountChange}
                    onAlgoChanged={this.handleAlgoChanged}
                    onSpeedChange={this.handleSpeedChanged}
                />

                {/* Toggle button for the side panel */}

                <button className="side-panel-toggle " onClick={this.toggleSidePanel}>
                    <ListRounded className='sidepanel-icon' />
                    View steps
                </button>

                {/* Side Panel */}
                <SidePanel
                    algorithmSteps={this.state.algorithmSteps}
                    isOpen={this.state.sidePanelOpen}
                    onClose={this.toggleSidePanel}
                    algorithmName={algorithmName}
                />

                <div className='justify-content-center'>
                    <Rects
                        rects={this.state.rects}
                        speed={this.state.speed}
                    />
                </div>

                {/* Time and Space Complexity */}
                <ComplexityAnalysis
                    timeComplexity={timeComplexity}
                    realTimeComplexity={realTimeComplexity}
                    spaceComplexity={spaceComplexity}
                    realSpaceComplexity={realSpaceComplexity}
                />

            </React.Fragment>
        )
    }

    handleRandomize = () => {
        const rect = getInitialRects(this.state.count);
        this.setState({ rects: rect });
    }

    handleRefresh = () => {
        const rects = this.state.rects.map(rect => ({ ...rect, isSorted: false, isSorting: false }));
        this.setState({ rects });
    }

    handleCountChange = (val) => {
        this.setState({ count: val });
        this.handleRandomize();
    }

    handleAlgoChanged = (pos, val) => {
        if (pos === 0) {
            this.setState({ algo: val });
            this.setAlgorithmSteps(val);
        }
    }

    handleSpeedChanged = (val) => {
        const speed = (760 - val * 7.5);
        this.setState({ speed });
    };


    handleSort = async () => {
        this.setState({ isRunning: true });

        let steps;
        let rects2;
        let startTime, endTime;
        let comparisons = 0;
        let swaps = 0;
        let memoryUsage = 0;

        switch (parseInt(this.state.algo)) {
            case 0:
                startTime = performance.now();
                steps = mergeSort(this.state.rects);
                endTime = performance.now();
                comparisons = steps.reduce((acc, step) => acc + step.comparisons, 0);
                swaps = steps.reduce((acc, step) => acc + step.swaps, 0);
                memoryUsage = this.state.rects.length * 4; // Assuming each rect object takes 4 bytes
                break;
            case 1:
                startTime = performance.now();
                rects2 = this.state.rects.slice();
                steps = heapSort(rects2);
                endTime = performance.now();
                comparisons = steps.reduce((acc, step) => acc + step.comparisons, 0);
                swaps = steps.reduce((acc, step) => acc + step.swaps, 0);
                memoryUsage = this.state.rects.length * 4; // Assuming each rect object takes 4 bytes
                break;
            case 2:
                startTime = performance.now();
                rects2 = this.state.rects.slice();
                steps = quickSortRecursive(rects2);
                endTime = performance.now();
                comparisons = steps.reduce((acc, step) => acc + step.comparisons, 0);
                swaps = steps.reduce((acc, step) => acc + step.swaps, 0);
                memoryUsage = this.state.rects.length * 4; // Assuming each rect object takes 4 bytes
                break;
            default:
                break;
        }

        // Calculate real-time and space complexity
        const executionTime = endTime - startTime;
        const timeComplexity = `${executionTime.toFixed(2)} ms`;
        const spaceComplexity = `${memoryUsage} bytes`;

        // Update state with complexities and stop running
        this.setState({
            isRunning: false,
            realTimeComplexity: timeComplexity,
            realSpaceComplexity: spaceComplexity,
            comparisons,
            swaps,
            memoryUsage
        });

        // Visualize the sorting process after sorting completes
        switch (parseInt(this.state.algo)) {
            case 0:
                await this.handleMerge(steps);
                break;
            case 1:
                await this.handleHeap(steps);
                break;
            case 2:
                await this.handleQuick(steps);
                break;
            default:
                break;
        }
    }



    // monitorComplexities = () => {
    //     let complexityInterval = setInterval(() => {
    //         // Calculate time complexity based on number of comparisons or swaps
    //         let comparisons = this.state.comparisons || 0;
    //         let swaps = this.state.swaps || 0;
    //         let timeComplexity = `O(${comparisons + swaps})`;

    //         // Calculate space complexity based on memory usage
    //         let memoryUsage = this.state.memoryUsage || 0;
    //         let spaceComplexity = `O(${memoryUsage}) bytes`;

    //         // Update the state with new complexities
    //         this.setState({ timeComplexity, spaceComplexity });
    //     }, 1000); // Update every second

    //     // Store the interval ID in the state
    //     this.setState({ complexityInterval });
    // }

    handleQuick = async (steps) => {
        this.setState({ isRunning: true, comparisons: 0, swaps: 0, memoryUsage: 0 });
        let prevRect = this.state.rects;

        for (let j = 0; j < this.state.count; j++) {
            prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isRange: false, isSorted: false };
        }
        this.setState({ rects: prevRect });
        let hasChanged = -1;
        let changed;
        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];
            if (hasChanged !== -1) {
                let { left, right } = changed;
                prevRect[left] = { ...prevRect[left], isLeft: false, isSorting: false, isRight: false, isRange: false };
                prevRect[right] = { ...prevRect[right], isLeft: false, isSorting: false, isRight: false, isRange: false };
            }
            if (step.changedRange) {
                await sleep(this.state.speed);
                let { left, right } = step;
                for (let j = 0; j < this.state.count; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isRange: false };
                }
                for (let j = left; j <= right; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: true, isRange: true };
                }
                this.setState({ rects: prevRect });
                await sleep(this.state.speed);
                for (let j = 0; j < this.state.count; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false };
                }
            } else if (step.swap) {
                let { left, right } = step;
                prevRect[left] = { ...prevRect[left], isLeft: false, isSorting: true, isRight: false, isRange: false };
                prevRect[right] = { ...prevRect[right], isLeft: true, isSorting: false, isRight: false, isRange: false };
                let temp = prevRect[left];
                prevRect[left] = prevRect[right];
                prevRect[right] = temp;
                hasChanged = 1;
                changed = step;

                // Update swaps
                this.setState(prevState => ({ swaps: prevState.swaps + 1 }));
            }
            this.setState({ rects: prevRect });
            await sleep(this.state.speed);
            if (i === steps.length - 1) {
                for (let j = 0; j < this.state.count; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isSorted: false, isRange: false };
                }
                this.setState({ rects: prevRect });
                for (let j = 0; j < this.state.count; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isSorted: true, isRange: false };
                    this.setState({ rects: prevRect });
                    await sleep(10);
                }
                this.setState({ isRunning: false, rects: prevRect });
            }
        }
    }

    handleHeap = async (steps) => {
        this.setState({ isRunning: true, comparisons: 0, swaps: 0, memoryUsage: 0 });
        let prevRect = this.state.rects;
        for (let j = 0; j < this.state.count; j++) {
            prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isRange: false, isSorted: false };
        }
        this.setState({ rects: prevRect });

        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];
            for (let i = 0; i < this.state.count; i++) {
                prevRect[i] = { ...prevRect[i], isLeft: false, isSorting: false, isRight: false };
            }
            let { left, right, sorted } = step;
            prevRect[left] = { ...prevRect[left], isLeft: true };
            prevRect[right] = { ...prevRect[right], isRight: true };
            this.setState({ rects: prevRect });
            await sleep(this.state.speed);
            let temp = prevRect[left];
            prevRect[left] = prevRect[right];
            prevRect[right] = temp;
            this.setState({ rects: prevRect });
            if (sorted) prevRect[left] = { ...prevRect[left], isSorted: true };
            await sleep(this.state.speed);
            if (i === steps.length - 1) {

                for (let i = 0; i < this.state.count; i++) {
                    prevRect[i] = { ...prevRect[i], isLeft: false, isSorting: false, isRight: false, isSorted: true };
                    this.setState({ rects: prevRect });
                    await sleep(this.state.speed);
                }
                this.setState({ isRunning: false, rects: prevRect });
            }
        }
    }

    handleMerge = async (steps) => {
        this.setState({ isRunning1: true });
        let prevRect = this.state.rects;
        for (let j = 0; j < this.state.count; j++) {
            prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isRange: false, isSorted: false };
        }
        this.setState({ rects: prevRect });
        await sleep(this.state.speed);

        for (let ii = 0; ii < steps.length; ii++) {
            let step = steps[ii];
            for (let i = 0; i < this.state.count; i++) {
                prevRect[i] = { ...prevRect[i], isLeft: false, isSorting: false, isRight: false };
            }

            for (let i = step.left; i <= step.mid; i++) {
                prevRect[i] = { ...prevRect[i], isLeft: true, isSorting: false };
            }
            for (let i = step.mid + 1; i <= step.right; i++) {
                prevRect[i] = { ...prevRect[i], isRight: true, isLeft: false, isSorting: false };
            }
            this.setState({ rects: prevRect });
            await sleep(this.state.speed);

            for (let i = step.left; i <= step.right; i++) {
                prevRect[i] = { ...prevRect[i], width: step.val[i - step.left].width, isSorting: true };
                this.setState({ rects: prevRect });
                await sleep(this.state.speed);
            }

            if (ii === steps.length - 1) {

                for (let i = 0; i < this.state.count; i++) {
                    prevRect[i] = { ...prevRect[i], isLeft: false, isSorting: false, isRight: false, isSorted: true };
                    this.setState({ rects: prevRect });
                    await sleep(this.state.speed);
                }
                this.setState({ isRunning: false });
            }

            this.setState({ rects: prevRect });
            await sleep(this.state.speed);
            prevRect = this.state.rects;
            this.setState({ rects: prevRect });
        }
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getInitialRects = (tot) => {
    const rects = [];
    for (let i = 0; i < tot; i++) {
        rects.push(getRect());
    }
    return rects;
}
const getRect = () => {
    return {
        width: Math.floor(Math.random() * 200) + 50,
        isSorted: false,
        isSorting: false,
        isLeft: false,
        isRight: false
    }
}

export default RecursiveSort;
