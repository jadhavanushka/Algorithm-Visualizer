import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';

import './PathFindingVisualizer.css';

// const START_NODE_ROW = 10;
// const START_NODE_COL = 15;
// const FINISH_NODE_ROW = 10;
// const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            algorithm: "",
            mouseIsPressed: false,
            mouseClicked: false,
            mainClicked: "",
            startNodeRow: null,
            startNodeCol: null,
            finishNodeRow: null,
            finishNodeCol: null,
        }
        this.animating = false;

    }

    getInitialGrid = () => {
        if (this.animating) return;
        let row_size = Math.floor((window.innerHeight - 60) / 27);
        let col_size = Math.floor((window.innerWidth) / 27);

        let grid = [];
        for (let row = 0; row < row_size; row++) {
            const currentRow = [];
            for (let col = 0; col < col_size; col++) {
                const newNode = createNode(col, row)
                currentRow.push(newNode);
                try {
                    document.getElementById(`node-${row}-${col}`).className = 'node';
                } catch {
                }
            }

            grid.push(currentRow);
        }
        // Co-ordinates for start node
        let x1 = Math.floor(Math.random() * row_size);
        let y1 = Math.floor(Math.random() * col_size);

        // Co-ordinates for finish node
        let x2 = Math.floor(Math.random() * row_size);
        let y2 = Math.floor(Math.random() * col_size);

        grid[x1][y1].isStart = true;
        grid[x2][y2].isFinish = true;

        this.setState({
            grid: grid,
            startNodeRow: x1,
            startNodeCol: y1,
            finishNodeRow: x2,
            finishNodeCol: y2,

        })
    };


    componentDidMount() {
        this.getInitialGrid();
        window.addEventListener("resize", (e) => {
            this.getInitialGrid();
        })
    }

    handleMouseDown = (row, col) => {
        if (this.animating) return;
        const grid = this.state.grid;
        const clickedNode = grid[row][col];

        if (clickedNode.isStart) {
            this.setState({
                mainClicked: "start"
            });
        } else if (clickedNode.isFinish) {
            this.setState({
                mainClicked: "finish"
            });
        }
        else
            this.toggleWall(grid, row, col);

        this.setState({
            grid: grid,
            mouseClicked: true
        });
    };

    handleMouseEnter = (row, col) => {
        if (this.animating) return;
        if (this.state.mouseClicked) {
            const { grid, mainClicked } = this.state;
            const enteredNode = grid[row][col];

            if (mainClicked === "start" || mainClicked === "finish") {
                const newGrid = this.updateStartEndNode(grid, row, col, mainClicked);
                this.setState({
                    grid: newGrid
                });
            } else if (!enteredNode.isWall && !enteredNode.isStart && !enteredNode.isFinish) {
                const newGrid = this.toggleWall(grid, row, col);
                this.setState({
                    grid: newGrid,
                    mouseClicked: true
                });
            } else if (enteredNode.isWall) {
                const newGrid = this.toggleWall(grid, row, col);
                this.setState({
                    grid: newGrid
                });
            }
        }
    };

    handleMouseLeave = (row, col) => {
        if (this.animating) return;
        const { grid, mainClicked } = this.state;

        if (mainClicked !== "") {
            const newGrid = this.resetStartEndNode(grid, row, col, mainClicked);
            this.setState({
                grid: newGrid
            });
        }
    };

    handleMouseUp = () => {
        if (this.animating) return;
        this.setState({
            mouseClicked: false,
            mainClicked: ""
        });
    };

    toggleWall = (grid, row, col) => {
        const newGrid = [...grid];
        newGrid[row][col] = {
            ...grid[row][col],
            isWall: !grid[row][col].isWall
        };
        return newGrid;
    };

    updateStartEndNode = (grid, row, col, nodeType) => {
        const newGrid = [...grid];
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
                if (nodeType === "start" && newGrid[i][j].isStart && !newGrid[i][j].isFinish) {
                    newGrid[i][j] = {
                        ...newGrid[i][j],
                        isStart: false
                    };
                } else if (nodeType === "finish" && newGrid[i][j].isFinish && !newGrid[i][j].isStart) {
                    newGrid[i][j] = {
                        ...newGrid[i][j],
                        isFinish: false
                    };
                }
            }
        }
        newGrid[row][col] = {
            ...newGrid[row][col],
            [nodeType === "start" ? "isStart" : "isFinish"]: true
        };

        // Update state variables
        this.setState({
            startNodeRow: nodeType === "start" ? row : this.state.startNodeRow,
            startNodeCol: nodeType === "start" ? col : this.state.startNodeCol,
            finishNodeRow: nodeType === "finish" ? row : this.state.finishNodeRow,
            finishNodeCol: nodeType === "finish" ? col : this.state.finishNodeCol,
        });


        return newGrid;
    };

    resetStartEndNode = (grid, row, col, mainClicked) => {
        const newGrid = [...grid];
        const resetNode = newGrid[row][col];
        if (mainClicked !== "") {
            newGrid[row][col] = {
                ...resetNode,
                [mainClicked === "start" ? "isStart" : "isFinish"]: false
            };
        }

        // Update state variables
        this.setState({
            startNodeRow: mainClicked === "start" ? null : this.state.startNodeRow,
            startNodeCol: mainClicked === "start" ? null : this.state.startNodeCol,
            finishNodeRow: mainClicked === "finish" ? null : this.state.finishNodeRow,
            finishNodeCol: mainClicked === "finish" ? null : this.state.finishNodeCol,
        });

        return newGrid;
    };


    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                this.animating = false;
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (!node.isFinish && !node.isStart)
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if (!node.isFinish && !node.isStart)
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-shortest-path';
            }, 50 * i);
        }
    }


    visualizeDijkstra() {
        if (this.animating) return;

        const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
        const startNode = grid[startNodeRow][startNodeCol];
        const finishNode = grid[finishNodeRow][finishNodeCol];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

        this.animating = true;
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    visualize() {
        // e.preventDefault();

        if (this.state.algorithm === "") {
            this.visualizeDijkstra()
            console.log("{this.state.algorithm}");

        }
        else {
            if (this.state.algorithm === "Dijkstra's Algorithm") {
                this.setState({ algorithm: "Dijkstra's Algorithm" });
                this.visualizeDijkstra();
                console.log("dijkstra");

            }
            else if (this.state.algorithm === "A* Search")
                console.log("astar");

            else if (this.state.algorithm === "Breath First Search")
                console.log("bfs");
        }
    }


    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            <>
                <div className='menu'>
                    <select onChange={(e) => this.setState({ algorithm: e.target.value })}>
                        <option defaultValue disabled>
                            Select algorithm
                        </option>
                        <option value="Dijkstra's Algorithm">Dijkstra's Algorithm</option>
                        <option value="A* Search">A* Search</option>
                        <option value="Breath First Search">Breath First Search</option>
                    </select>

                    <button className="visualize-btn" onClick={() => this.visualize()}>
                        Visualize
                    </button>
                    <button className="reset-btn" onClick={() => this.getInitialGrid()}>Reset</button>

                </div>


                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const { row, col, isFinish, isStart, isWall } = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseLeave={(row, col) => this.handleMouseLeave(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                            row={row}>
                                        </Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

const createNode = (col, row) => {
    return {
        col,
        row,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};
