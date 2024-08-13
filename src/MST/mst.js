/* eslint-disable no-undef */
import React, { Component } from 'react';
import Navbar from "../Components/navbar";
import DiscreteSlider from '../Components/slider';
import ComplexityAnalysis from "../Components/ComplexityAnalysis";
import SidePanel from '../Components/sidepanel';
import { ListRounded } from '@mui/icons-material';
import Canvas from './canvas'; // Assuming you have a Canvas component for drawing
import kruskal from './kruskal';
import prim from './prim';
import { gsap } from 'gsap';

class MST extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vertices: [],
			edges: [],
			visitedEdges: [],
			mstEdges: [],
			maxWidth: 700,
			maxHeight: 500,
			algorithm: '', // Default algorithm
			maxVertices: 5,
			animationSpeed: 50,
			isAnimating: false, // Flag to track animation state
			sidePanelOpen: false,
			algorithmSteps: [],
			algorithmName: "",
			timeComplexity: "",
			spaceComplexity: "",
			realTimeComplexity: "",
			realSpaceComplexity: "",
			startTime: 0,
			endTime: 0,
		};
		this.animationTimeline = gsap.timeline({ paused: true }); // Initialize GSAP timeline
	}

	componentDidMount() {
		// Initialize your graph data, generate vertices, etc.
		this.generateVertices();

	}

	handleAlgorithmChange = (event) => {
		const algorithm = event.target.value;
		this.setState({ algorithm, visitedEdges: [], mstEdges: [], realTimeComplexity: "", realSpaceComplexity: "" }); // Clear vertices and MST edges
		this.setAlgoSteps(algorithm);
	}

	// Define the method to set the animation speed
	setAnimationSpeed = (value) => {
		this.setState({ animationSpeed: value });
	}


	// Define the method to set the maximum number of vertices
	setMaxVertices = (value) => {
		this.setState({ maxVertices: value });
		this.generateVertices();
	}


	generateVertices() {
		this.setState({ vertices: [], edges: [], visitedEdges: [], mstEdges: [] }); // Clear vertices and MST edges
		const numVertices = this.state.maxVertices; // Change this to adjust the number of vertices
		const { maxHeight, maxWidth } = this.state; // Change this to adjust the maximum coordinate value

		const vertices = [];
		for (let i = 0; i < numVertices; i++) {
			// Generate random x and y coordinates
			const x = Math.floor(Math.random() * (maxWidth));
			const y = Math.floor(Math.random() * (maxHeight));
			// Add the vertex to the vertices array
			vertices.push({ id: i, x, y });
		}

		const edges = findConnectingEdges(vertices);

		// Update the component's state with the generated vertices
		this.setState({ vertices, edges });
	}

	calculateMST() {
		const { vertices, edges, algorithm } = this.state;
		let mstEdges = [];
		let visitedEdges = []; // List to store visited edges

		const startTime = performance.now(); // Start measuring time

		if (algorithm === 'kruskal') {
			({ mstEdges, visitedEdges } = kruskal(vertices, edges));
		} else if (algorithm === 'prim') {
			({ mstEdges, visitedEdges } = prim(vertices, edges));
		}

		const endTime = performance.now(); // Stop measuring time

		const executionTime = (endTime - startTime).toFixed(2); // Calculate execution time in milliseconds
		const realTimeComplexity = `${executionTime} ms`; // Display execution time

		// Calculate and set the space complexity
		const realSpaceComplexity = this.calculateSpaceComplexity(algorithm);

		this.setState({ mstEdges, visitedEdges, realTimeComplexity, realSpaceComplexity }); // Set execution time and space complexity
	}

	setAlgoSteps = (algorithm) => {
		let algorithmSteps = [];
		let algorithmName = "";
		let timeComplexity = "";
		let spaceComplexity = "";
		if (algorithm === "kruskal") {
			algorithmSteps = [
				{ code: "1. Sort all the edges by weight (non-decreasing)." },
				{ code: "2. Pick the edge with the smallest weight." },
				{ code: "3. Check if adding that edge to the MST forms a cycle. If it doesn't, add it." },
				{ code: "4. Repeat steps 2 and 3 until the MST has a length of (number of vertices - 1)." }
			];
			algorithmName = "Kruskal's algorithm";
			timeComplexity = "O(E log E)";
			spaceComplexity = "O(E + V)";
		} else if (algorithm === "prim") {
			algorithmSteps = [
				{ code: "1. Initialize the start node and the open set." },
				{ code: "2. Loop until the open set is empty." },
				{ code: "3. Select the node with the lowest f score from the open set." },
				{ code: "4. If the selected node is the finish node, reconstruct the path." },
				{ code: "5. Generate the neighbors of the selected node." },
				{ code: "6. For each neighbor, calculate tentative g score and add it to the open set." },
				{ code: "7. Repeat the loop." }
			];
			algorithmName = "Prim's algorithm";
			timeComplexity = "O(E log V)";
			spaceComplexity = "O(E + V)";
		}
		this.setState({ algorithmSteps, algorithmName, timeComplexity, spaceComplexity });
	}

	// Function to calculate space complexity based on the selected algorithm
	calculateSpaceComplexity(algorithm) {
		let spaceComplexity = "";
		switch (algorithm) {
			case "prim":
				// Assuming each vertex occupies 4 bytes for ID and 8 bytes for x and y coordinates
				const vertexSize = 4 + 8 + 8; // ID (4 bytes) + x (8 bytes) + y (8 bytes)
				const edgeSize = 4 + 4 + 4 + 4; // fromID (4 bytes) + toID (4 bytes) + weight (4 bytes) + id (4 bytes)
				const numVertices = this.state.vertices.length;
				const numEdges = this.state.edges.length;
				// Space complexity estimation
				spaceComplexity = (numVertices * vertexSize + numEdges * edgeSize) + " bytes";
				break;
			case "kruskal":
				// Assuming each vertex occupies 4 bytes for ID and 8 bytes for x and y coordinates
				const vertexSizeKruskal = 4 + 8 + 8; // ID (4 bytes) + x (8 bytes) + y (8 bytes)
				const edgeSizeKruskal = 4 + 4 + 4 + 4; // fromID (4 bytes) + toID (4 bytes) + weight (4 bytes) + id (4 bytes)
				const numVerticesKruskal = this.state.vertices.length;
				const numEdgesKruskal = this.state.edges.length;
				// Space complexity estimation
				spaceComplexity = (numVerticesKruskal * vertexSizeKruskal + numEdgesKruskal * edgeSizeKruskal) + " bytes";
				break;
			default:
				spaceComplexity = "";
		}
		return spaceComplexity;
	}

	toggleSidePanel = () => {
		this.setState((prevState) => ({ sidePanelOpen: !prevState.sidePanelOpen }));
	};

	render() {
		const { vertices, edges, visitedEdges, mstEdges, maxHeight, maxWidth, algorithm, animationSpeed, startTime, endTime, timeComplexity, spaceComplexity, realTimeComplexity, realSpaceComplexity } = this.state;
		const { sidePanelOpen, algorithmSteps, algorithmName } = this.state;

		return (
			<div>
				<Navbar currentPage="Minimum Spanning Tree"
					info="MinimumSpanningTree/info" />
				<div className='menu'>
					<select value={algorithm} onChange={this.handleAlgorithmChange}>
						<option disabled value="">Select Algorithm</option>
						<option value="kruskal">Kruskal's Algorithm</option>
						<option value="prim">Prim's Algorithm</option>
					</select>
					<DiscreteSlider
						title='No. of vertices'
						default={this.state.maxVertices}
						onCountChange={this.setMaxVertices}
						step={1}
						min={3}
						max={10} />
					<DiscreteSlider
						title='Speed'
						default={this.state.animationSpeed}
						onCountChange={this.setAnimationSpeed}
						step={5}
						min={10}
						max={100}
					/>

					<div>
						<button className='visualize-btn' onClick={() => this.calculateMST()}>Get MST</button>
						<button className='reset-btn' onClick={() => this.generateVertices()}>Reset</button>
					</div>
				</div>

				<button className="side-panel-toggle" onClick={this.toggleSidePanel}>
					<ListRounded className='sidepanel-icon' />
					View steps
				</button>

				<SidePanel algorithmSteps={algorithmSteps} algorithmName={algorithmName} isOpen={sidePanelOpen} onClose={this.toggleSidePanel} />

				{/* Render any UI elements here */}
				<Canvas vertices={vertices} mstEdges={mstEdges} connectingEdges={edges} visitedEdges={visitedEdges}
					width={maxWidth} height={maxHeight} speed={animationSpeed} />

				<ComplexityAnalysis
					timeComplexity={timeComplexity}
					realTimeComplexity={realTimeComplexity}
					spaceComplexity={spaceComplexity}
					realSpaceComplexity={realSpaceComplexity}
				/>
			</div>
		);
	}
}

export default MST;


function findConnectingEdges(vertices) {
	const connectingEdges = [];

	// Iterate over all possible edges between vertices
	for (let i = 0; i < vertices.length; i++) {
		for (let j = i + 1; j < vertices.length; j++) {
			const vertex1 = vertices[i];
			const vertex2 = vertices[j];
			const weight = calculateDistance(vertices[i], vertices[j]);
			const newEdge = {
				from: vertex1,
				to: vertex2,
				weight,
				id: vertex1.id + "-" + vertex2.id
			};
			connectingEdges.push(newEdge);
		}
	}

	return connectingEdges;
}


function calculateDistance(vertex1, vertex2) {
	const dx = vertex1.x - vertex2.x;
	const dy = vertex1.y - vertex2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

