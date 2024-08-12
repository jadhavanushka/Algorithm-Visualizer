import React, { Component } from 'react';
import Navbar from '../Components/navbar';
import Menu from "./menu";
import Rects from './rects';
import ComplexityAnalysis from "../Components/ComplexityAnalysis";
import SidePanel from './sidepanelso';
import { ListRounded } from '@material-ui/icons';
import { bubbleSort, selectionSort, insertionSort } from "./algorithms/sortingalgorithms";
import { bubbleSortSteps, selectionSortSteps, insertionSortSteps } from "./algorithms/sortingalgorithms";
import { quickSort, quickSortSteps } from './algorithms/quickSort';

class Sort extends Component {
    state = {
        count: 20,
        rects: [],
        rects2: [],
        doubles: false,
        speed: 50,
        isRunning: false,
        algo1: 0,
        algo2: 0,
        animateToggle: false,
        sidePanelOpen: false,
        algorithmSteps1: [],
        algorithmSteps2: [],
        timeComplexity: 'O(n^2)', // Default time complexity
        spaceComplexity: 'O(1)', // Default space complexity
        realTimeComplexity: '', // Real time complexity
        realSpaceComplexity: '', // Real space complexity
    };

    componentDidMount() {
        this.handleRandomize();
    }

    triggerToggleAnimation = () => {
        this.setState({ animateToggle: true });
        setTimeout(() => {
            this.setState({ animateToggle: false });
        }, 3000);
    };

    toggleSidePanel = () => {
        this.setState((prevState) => ({ sidePanelOpen: !prevState.sidePanelOpen }));
    };

    render() {
        return (
            <React.Fragment>
                <Navbar currentPage="Sorting Algorithms" 
                info="sort/info"/>
                <button className={`side-panel-toggle ${this.state.animateToggle ? 'animate' : ''}`} onClick={this.toggleSidePanel}>
                    <ListRounded className='sidepanel-icon' />
                    View steps
                </button>
                <SidePanel
                    isOpen={this.state.sidePanelOpen}
                    onClose={this.toggleSidePanel}
                    algorithmSteps1={this.state.algorithmSteps1}
                    algorithmSteps2={this.state.algorithmSteps2}
                    isDouble={this.state.doubles}
                />
                <Menu
                    isDisabled={this.state.isRunning}
                    isDouble={this.state.doubles}
                    onDoubleChange={this.handleDouble}
                    onVisualize={this.handleSort}
                    onRandomize={this.handleRandomize}
                    onRefresh={this.handleRefresh}
                    onCountChange={this.handleCountChange}
                    onAlgoChanged={this.handleAlgoChanged}
                    onSpeedChange={this.handleSpeedChanged}
                />
                <div className='justify-content-center'>
                    <Rects
                        speed={this.state.speed}
                        rects={this.state.rects}
                    />
                    {this.state.doubles && <hr style={{ width: "90%" }} />}
                    {this.state.doubles &&
                        <Rects
                            rects={this.state.rects2}
                        />}
                </div>
                {/* Display real-time and space complexities */}
                <ComplexityAnalysis
                    timeComplexity={this.state.timeComplexity}
                    realTimeComplexity={this.state.realTimeComplexity}
                    spaceComplexity={this.state.spaceComplexity}
                    realSpaceComplexity={this.state.realSpaceComplexity}
                />

            </React.Fragment>
        );
    }

    handleRandomize = () => {
        const rect = this.getInitialRects(this.state.count);
        const rect2 = rect.slice();
        this.setState({ rects: rect, rects2: rect2, isRunning: false, algorithmSteps1: [], algorithmSteps2: [] });
    };

    handleRefresh = () => {
        const rects = this.state.rects.map(rect => ({ ...rect, isSorted: false, isSorting: false }));
        const rects2 = rects.slice();
        this.setState({ rects, rects2, isRunning: false, algorithmSteps1: [], algorithmSteps2: [] });
    };

    handleDouble = (val) => {
        this.setState({ doubles: val });
    };

    handleCountChange = (val) => {
        this.setState({ count: val });
        this.handleRandomize();
    };

    handleAlgoChanged = (pos, val) => {
        // Reset algorithmSteps when a new algorithm is selected
        this.setState({ algorithmSteps1: [], algorithmSteps2: [], sidePanelOpen: false });
        if (pos === 0) {
            this.setState({ algo1: val });
        } else {
            this.setState({ algo2: val });
        }
        // Also reset the visualization
        this.handleRefresh();
    };

    handleSpeedChanged = (val) => {
        const speed = (760 - val * 7.5);
        this.setState({ speed });
    };

    handleSort = async () => {
        this.setState({ isRunning: true, algorithmSteps1: [], algorithmSteps2: [] });
        let steps1, steps2;
        let algorithmSteps1, algorithmSteps2;
        let startTime1, endTime1, startTime2, endTime2;
        let timeComplexity1 = '', timeComplexity2 = '';
        let spaceComplexity1 = '', spaceComplexity2 = '';
        let spaceUsage1 = 0, spaceUsage2 = 0;

        switch (parseInt(this.state.algo1)) {
            case 0:
                startTime1 = performance.now();
                steps1 = bubbleSort(this.state.rects); // Call bubbleSort to get steps
                endTime1 = performance.now();
                algorithmSteps1 = bubbleSortSteps; // Set algorithmSteps to bubbleSortSteps
                timeComplexity1 = `${(endTime1 - startTime1).toFixed(2)} ms`; // Update time complexity
                spaceUsage1 = this.state.rects.length * 4; // Assuming each rect object takes 4 bytes
                spaceComplexity1 = `${spaceUsage1} bytes`; // Update space complexity
                break;
            case 1:
                startTime1 = performance.now();
                steps1 = selectionSort(this.state.rects); // Call selectionSort to get steps
                endTime1 = performance.now();
                algorithmSteps1 = selectionSortSteps; // Set algorithmSteps to selectionSortSteps
                timeComplexity1 = `${(endTime1 - startTime1).toFixed(2)} ms`; // Update time complexity
                spaceUsage1 = this.state.rects.length * 4; // Assuming each rect object takes 4 bytes
                spaceComplexity1 = `${spaceUsage1} bytes`; // Update space complexity
                break;
            case 2:
                startTime1 = performance.now();
                steps1 = insertionSort(this.state.rects); // Call insertionSort to get steps
                endTime1 = performance.now();
                algorithmSteps1 = insertionSortSteps; // Set algorithmSteps to insertionSortSteps
                timeComplexity1 = `${(endTime1 - startTime1).toFixed(2)} ms`; // Update time complexity
                spaceUsage1 = this.state.rects.length * 4; // Assuming each rect object takes 4 bytes
                spaceComplexity1 = `${spaceUsage1} bytes`; // Update space complexity
                break;
            case 3:
                startTime1 = performance.now();
                steps1 = quickSort(this.state.rects); // Call insertionSort to get steps
                endTime1 = performance.now();
                algorithmSteps1 = quickSortSteps; // Set algorithmSteps to quickSortSteps
                timeComplexity1 = `${(endTime1 - startTime1).toFixed(2)} ms`; // Update time complexity
                spaceUsage1 = this.state.rects.length * 4; // Assuming each rect object takes 4 bytes
                spaceComplexity1 = `${spaceUsage1} bytes`; // Update space complexity
                break;
            default:
                console.error("Invalid algorithm selected or steps not defined for the algorithm.");
                break;
        }

        // Update state with real-time and space complexity
        this.setState({
            algorithmSteps1,
            realTimeComplexity: timeComplexity1,
            realSpaceComplexity: spaceComplexity1,
        });

        if (this.state.doubles) {
            switch (parseInt(this.state.algo2)) {
                case 0:
                    startTime2 = performance.now();
                    steps2 = bubbleSort(this.state.rects2); // Call bubbleSort to get steps
                    endTime2 = performance.now();
                    algorithmSteps2 = bubbleSortSteps; // Set algorithmSteps to bubbleSortSteps
                    timeComplexity2 = `${(endTime2 - startTime2).toFixed(2)} ms`; // Update time complexity
                    spaceUsage2 = this.state.rects2.length * 4; // Assuming each rect object takes 4 bytes
                    spaceComplexity2 = `${spaceUsage2} bytes`; // Update space complexity
                    break;
                case 1:
                    startTime2 = performance.now();
                    steps2 = selectionSort(this.state.rects2); // Call selectionSort to get steps
                    endTime2 = performance.now();
                    algorithmSteps2 = selectionSortSteps; // Set algorithmSteps to selectionSortSteps
                    timeComplexity2 = `${(endTime2 - startTime2).toFixed(2)} ms`; // Update time complexity
                    spaceUsage2 = this.state.rects2.length * 4; // Assuming each rect object takes 4 bytes
                    spaceComplexity2 = `${spaceUsage2} bytes`; // Update space complexity
                    break;
                case 2:
                    startTime2 = performance.now();
                    steps2 = insertionSort(this.state.rects2); // Call insertionSort to get steps
                    endTime2 = performance.now();
                    algorithmSteps2 = insertionSortSteps; // Set algorithmSteps to insertionSortSteps
                    timeComplexity2 = `${(endTime2 - startTime2).toFixed(2)} ms`; // Update time complexity
                    spaceUsage2 = this.state.rects2.length * 4; // Assuming each rect object takes 4 bytes
                    spaceComplexity2 = `${spaceUsage2} bytes`; // Update space complexity
                    break;
                case 3:
                    startTime2 = performance.now();
                    steps2 = quickSort(this.state.rects2); // Call quickSort to get steps
                    endTime2 = performance.now();
                    algorithmSteps2 = quickSortSteps; // Set algorithmSteps to quickSortSteps
                    timeComplexity2 = `${(endTime2 - startTime2).toFixed(2)} ms`; // Update time complexity
                    spaceUsage2 = this.state.rects2.length * 4; // Assuming each rect object takes 4 bytes
                    spaceComplexity2 = `${spaceUsage2} bytes`; // Update space complexity
                    break;
                default:
                    console.error("Invalid algorithm selected or steps not defined for the algorithm.");
                    break;
            }

            this.setState({
                algorithmSteps2,
                realTimeComplexity: `${timeComplexity1} / ${timeComplexity2}`,
                realSpaceComplexity: `${spaceComplexity1} / ${spaceComplexity2}`,
            });
        }

        this.handleFirst(steps1);
        if (this.state.doubles) this.handleSecond(steps2);

        this.setState({
            isRunning: false
        });
    };

    handleFirst = async (steps) => {
        this.setState({ isRunning1: true });
        const prevRect = this.state.rects;
        for (let i = 0; i < steps.length; i++) {
            if (i !== 0) {
                prevRect[steps[i - 1].xx] = { ...prevRect[steps[i - 1].xx], isSorting: false };
                prevRect[steps[i - 1].yy] = { ...prevRect[steps[i - 1].yy], isSorting: false };
            }
            if (steps[i].xx === steps[i].yy) {
                prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorted: true, isSorting: false };
            } else if (steps[i].changed) {
                const recti = { ...prevRect[steps[i].xx], isSorting: true };
                const rectj = { ...prevRect[steps[i].yy], isSorting: true };
                prevRect[steps[i].yy] = recti;
                prevRect[steps[i].xx] = rectj;
            } else {
                prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorting: true };
                prevRect[steps[i].yy] = { ...prevRect[steps[i].yy], isSorting: true };
            }
            if (i === steps.length - 1) {
                this.setState({ isRunning1: false });
                if (this.state.isRunning2 === false) {
                    this.setState({ isRunning: false });
                }
            }
            this.setState({ rects: prevRect });
            await this.sleep();
        }
    };

    handleSecond = async (steps) => {
        this.setState({ isRunning2: true });
        const prevRect = this.state.rects2;
        for (let i = 0; i < steps.length; i++) {
            if (i !== 0) {
                prevRect[steps[i - 1].xx] = { ...prevRect[steps[i - 1].xx], isSorting: false };
                prevRect[steps[i - 1].yy] = { ...prevRect[steps[i - 1].yy], isSorting: false };
            }
            if (steps[i].xx === steps[i].yy) {
                prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorted: true, isSorting: false };
            } else if (steps[i].changed) {
                const recti = { ...prevRect[steps[i].xx], isSorting: true };
                const rectj = { ...prevRect[steps[i].yy], isSorting: true };
                prevRect[steps[i].yy] = recti;
                prevRect[steps[i].xx] = rectj;
            } else {
                prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorting: true };
                prevRect[steps[i].yy] = { ...prevRect[steps[i].yy], isSorting: true };
            }
            if (i === steps.length - 1) {
                this.setState({ isRunning2: false });
                if (this.state.isRunning1 === false) {
                    this.setState({ isRunning: false });
                }
            }

            this.setState({ rects2: prevRect });
            await this.sleep();
        }
    };

    sleep() {
        return new Promise(resolve => setTimeout(resolve, this.state.speed));
    }

    getInitialRects = (tot) => {
        const rects = [];
        for (let i = 0; i < tot; i++) {
            rects.push(this.getRect(i));
        }
        return rects;
    };

    getRect = (kk) => {
        return {
            width: Math.floor(Math.random() * 200) + 50,
            isSorted: false,
            isSorting: false,
            kk: kk
        };
    };
}

export default Sort;
