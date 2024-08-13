import React, { useState } from 'react';
import Navbar from '../Components/navbar';
import ComplexityAnalysis from "../Components/ComplexityAnalysis";
import SidePanel from '../Components/sidepanel'; // Import the SidePanel component
import { ListRounded } from '@material-ui/icons';
import './linkedlist.css';
import SinglyLinkedList from './SinglyLinkedList'; // Import SinglyLinkedList
import DoublyLinkedList from './DoublyLinkedList'; // Import DoublyLinkedList
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { gsap } from 'gsap';

const LinkedListVisualizer = () => {
    const [linkedlist, setLinkedList] = useState(null); // State to hold the linked list instance
    const [resultText, setResultText] = useState('');
    const [currVal, setCurrVal] = useState('');
    const [listType, setListType] = useState('');
    const [insertPosition, setInsertPosition] = useState('Beginning'); // State to hold the selected position for insertion
    const [deletePosition, setDeletePosition] = useState('Beginning'); // State to hold the selected position for deletion
    const [newValue, setNewValue] = useState('');
    const [nodeValue, setNodeValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [sidePanelOpen, setSidePanelOpen] = useState(false); // State to manage side panel visibility
    const [algorithmSteps, setAlgorithmSteps] = useState([]);
    const [algorithmName, setAlgorithmName] = useState("");
    const [timeComplexity, setTimeComplexity] = useState("");
    const [spaceComplexity, setSpaceComplexity] = useState('O(n)');
    const [realTimeComplexity, setRealTimeComplexity] = useState('');
    const [realSpaceComplexity, setRealSpaceComplexity] = useState('');


    const handleListTypeChange = (event) => {
        const type = event.target.value.toLowerCase();
        setListType(type);
        resetLinkedList();
        switch (type) {
            case 'singly':
                setLinkedList(new SinglyLinkedList());
                break;
            case 'doubly':
                setLinkedList(new DoublyLinkedList());
                break;
            default:
                break;
        }
    };

    const handleInsertPositionChange = (event) => {
        setInsertPosition(event.target.value);
    };

    const handleDeletePositionChange = (event) => {
        setDeletePosition(event.target.value);
    };

    const handleInputChange = (event) => {
        setNewValue(event.target.value);
    };

    const handleNodeValueChange = (event) => {
        setNodeValue(event.target.value);
    };

    const handleSearchInputChange = (event) => {
        setSearchValue(event.target.value);
    };


    const insertNode = () => {
        if (linkedlist) {
            let newData = newValue.trim();
            if (!newData) {
                newData = Math.floor(Math.random() * 100) + 1; // Generate random data if no value is specified
            }
            if (insertPosition === 'Beginning') {
                const steps = linkedlist.steps("insertAtBeginning");
                setAlgorithmSteps(steps);
                setAlgorithmName("Insert at beginning");

                const startTime = performance.now();
                linkedlist.insertAtBeginning(newData);
                const endTime = performance.now();
                setResultText('Inserted at beginning:');
                setCurrVal(newData);
                setTimeComplexity(`O(1)`);
                setRealTimeComplexity(`${(endTime - startTime).toFixed(2)} ms`);
                const spaceComplexityBytes = calculateSpaceComplexity(linkedlist);
                setRealSpaceComplexity(`${spaceComplexityBytes} bytes`);
            } else if (insertPosition === 'After Node') {
                const prevNodeData = parseInt(nodeValue.trim());
                if (prevNodeData) {
                    const steps = linkedlist.steps("insertAfterNode");
                    setAlgorithmSteps(steps);
                    setAlgorithmName("Insert after node");

                    const foundNode = linkedlist.search(prevNodeData);
                    if (foundNode) {
                        const startTime = performance.now();
                        linkedlist.insertAfterNode(prevNodeData, newData);
                        const endTime = performance.now();
                        setResultText('Inserted after ' + prevNodeData + ': ');
                        setCurrVal(newData);
                        setTimeComplexity(`O(n)`);
                        setRealTimeComplexity(`${(endTime - startTime).toFixed(2)} ms`);
                        const spaceComplexityBytes = calculateSpaceComplexity(linkedlist);
                        setRealSpaceComplexity(`${spaceComplexityBytes} bytes`);
                    } else {
                        animateSearch(prevNodeData);
                        setResultText('Node not found');
                        setCurrVal('');
                    }
                }
                else {
                    setResultText('Select prev node');
                    setCurrVal('');
                }

            } else if (insertPosition === 'Before Node') {
                const nextNodeData = parseInt(nodeValue.trim());

                if (nextNodeData) {
                    const steps = linkedlist.steps("insertBeforeNode");
                    setAlgorithmSteps(steps);
                    setAlgorithmName("Insert before node");

                    const foundNode = linkedlist.search(nextNodeData);
                    if (foundNode) {
                        const startTime = performance.now();
                        linkedlist.insertBeforeNode(nextNodeData, newData);
                        const endTime = performance.now();
                        setResultText('Inserted before ' + nextNodeData + ': ');
                        setCurrVal(newData);
                        setTimeComplexity(`O(n)`);
                        setRealTimeComplexity(`${(endTime - startTime).toFixed(2)} ms`);
                        const spaceComplexityBytes = calculateSpaceComplexity(linkedlist);
                        setRealSpaceComplexity(`${spaceComplexityBytes} bytes`);
                    } else {
                        animateSearch(nextNodeData);
                        setResultText('Node not found');
                        setCurrVal('');
                    }
                }
                else {
                    setResultText('Select next node');
                    setCurrVal('');
                }
            } else if (insertPosition === 'End') {
                const steps = linkedlist.steps("insertAtEnd");
                setAlgorithmSteps(steps);
                setAlgorithmName("Insert at end");

                const startTime = performance.now();
                linkedlist.insertAtEnd(newData);
                const endTime = performance.now();
                setResultText('Inserted at end:');
                setCurrVal(newData);
                setTimeComplexity(`O(n)`);
                setRealTimeComplexity(`${(endTime - startTime).toFixed(2)} ms`);
                const spaceComplexityBytes = calculateSpaceComplexity(linkedlist);
                setRealSpaceComplexity(`${spaceComplexityBytes} bytes`);
            }

            // Call animateInsertion after performing the insertion
            animateInsertion(insertPosition, newData);
        }
        else {
            setResultText('Select a linked list type first!');
            setCurrVal('');
        }
    };

    const deleteNode = async () => {
        if (linkedlist) {
            const animationPromise = new Promise(resolve => {
                // Call animateDeletion with the appropriate parameters
                animateDeletion(deletePosition, parseInt(nodeValue.trim()), resolve);
            });

            // Wait for the completion of the deletion animation
            await animationPromise;

            if (deletePosition === 'Beginning') {
                const startTime = performance.now();
                const removedData = linkedlist.deleteAtBeginning();
                const endTime = performance.now();
                if (removedData !== null) {
                    setResultText('Deleted from beginning:');
                    setCurrVal(removedData);
                    setTimeComplexity(`O(1)`);
                    setRealTimeComplexity(`${(endTime - startTime).toFixed(2)} ms`);
                    const spaceComplexityBytes = calculateSpaceComplexity(linkedlist);
                    setRealSpaceComplexity(`${spaceComplexityBytes} bytes`);

                } else {
                    setResultText('List is empty');
                    setCurrVal('');
                }
            } else if (deletePosition === 'Middle') {
                const dataToDelete = parseInt(nodeValue.trim());
                if (dataToDelete) {
                    const foundNode = linkedlist.search(dataToDelete);
                    if (foundNode) {
                        const startTime = performance.now();
                        linkedlist.deleteFromMiddle(dataToDelete);
                        const endTime = performance.now();
                        setResultText('Deleted node:');
                        setCurrVal(dataToDelete);
                        setTimeComplexity(`O(n)`);
                        setRealTimeComplexity(`${(endTime - startTime).toFixed(2)} ms`);
                        const spaceComplexityBytes = calculateSpaceComplexity(linkedlist);
                        setRealSpaceComplexity(`${spaceComplexityBytes} bytes`);

                    } else {
                        animateSearch(dataToDelete);
                        setResultText('Node not found');
                        setCurrVal('');
                    }
                } else {
                    setResultText('Select node to delete');
                    setCurrVal('');
                }
            }
            else if (deletePosition === 'End') {
                const startTime = performance.now();
                const removedData = linkedlist.deleteFromEnd();
                const endTime = performance.now();
                if (removedData !== null) {
                    setResultText('Deleted from end:');
                    setCurrVal(removedData);
                    setTimeComplexity(`O(n)`);
                    setRealTimeComplexity(`${(endTime - startTime).toFixed(2)} ms`);
                    const spaceComplexityBytes = calculateSpaceComplexity(linkedlist);
                    setRealSpaceComplexity(`${spaceComplexityBytes} bytes`);

                } else {
                    setResultText('List is empty');
                    setCurrVal('');
                }
            }
        }
        else {
            setResultText('Select a linked list type first!');
            setCurrVal('');
        }
    };

    const searchNode = () => {
        if (linkedlist) {
            const valueToSearch = parseInt(searchValue.trim());

            if (valueToSearch) {
                const steps = linkedlist.steps("search");
                setAlgorithmSteps(steps);
                setAlgorithmName("Search node");


                const startTime = performance.now();
                const foundNode = linkedlist.search(valueToSearch);
                const endTime = performance.now();
                if (foundNode) {
                    setResultText('Node found:');
                    setCurrVal(valueToSearch);
                    setTimeComplexity(`O(n)`);
                    setRealTimeComplexity(`${(endTime - startTime).toFixed(2)} ms`);
                    const spaceComplexityBytes = calculateSpaceComplexity(linkedlist);
                    setRealSpaceComplexity(`${spaceComplexityBytes} bytes`);
                } else {
                    setResultText('Node not found');
                    setCurrVal('');
                }
                animateSearch(valueToSearch);
            } else {
                setResultText('Enter value to search');
                setCurrVal('');
            }
        }
        else {
            setResultText('Select a linked list type first!');
            setCurrVal('');
        }
    };

    const calculateSpaceComplexity = (list) => {
        // Calculate space complexity based on the number of nodes and their properties
        // For simplicity, we can estimate the space complexity as the number of nodes * size_of_node_in_bytes
        let numNodes = 0;
        let currentNode = list.head; // Assuming head is the reference to the first node
        while (currentNode !== null) {
            numNodes++;
            currentNode = currentNode.next; // Assuming the next pointer is named 'next'
        }
        const sizeOfNodeInBytes = 16; // Assuming each node occupies 16 bytes on average
        const spaceComplexityBytes = numNodes * sizeOfNodeInBytes;
        return spaceComplexityBytes;
    };


    const traverseList = () => {
        if (linkedlist) {
            const traversalResult = linkedlist.traverse();
            // console.log(traversalResult); // Output the traversal result to console
            return traversalResult;
        }
    };

    const animateHead = (timeline) => {
        // Highlight head-null node and next arrow
        timeline.to("#head-null-node .head-node", { color: "#D800A6", duration: 1 })
            .to("#head-null-node .head-node", { color: "#1363DF", duration: 0.5 })
            .to("#head-arrow", { fill: "#D800A6", duration: .5 }, "-=1")
            .to("#head-arrow", { scale: 1.2, duration: .5 }, "+=.5")
            .to("#head-arrow", { fill: "#000", scale: 1, duration: .5 });
    }

    const animateNull = (timeline) => {
        // Highlight null node
        timeline.to("#null-node", { color: "#D800A6", duration: 1 }, "-=1")
            .to("#null-node", { color: "#1363DF", duration: 1 });
    }

    const animateNode = (listNode, timeline) => {
        // If stopPosition is reached, break the loop
        const currentNode = `#list-node-${listNode.data} `;
        const currentNodeBox = currentNode + " .box";
        const nextBox = currentNode + " .next";
        const nextArrowElement = currentNode + " .nextArrow";

        // timeline
        // Highlight current node box
        timeline.to(currentNodeBox, { backgroundColor: "#FAE7F3", color: "#D800A6", borderColor: "#D800A6", duration: 1.5 }, "-=1")
            .to(currentNodeBox, { backgroundColor: "#FFF7FC", color: "#1363DF", borderColor: "#1363DF", duration: 1 },);

        // Highlight next node box
        timeline.to(nextBox, { backgroundColor: "#5999cd", duration: 0.5 }, "-=2")
            .to(nextBox, { backgroundColor: "#D800A6", duration: 1 }, "-=1")
            .to(nextBox, { backgroundColor: "#5999cd", duration: 0.5 });

        // Highlight next arrow
        timeline.to(nextArrowElement, { fill: "#D800A6", duration: .5 }, "-=2")
            .to(nextArrowElement, { scale: 1.2, duration: .5 },)
            .to(nextArrowElement, { fill: "#000", scale: 1, duration: .5 });
    }

    const animateNodes = (list, timeline) => {
        list.forEach((listNode, index) => {
            animateNode(listNode, timeline)
        });
    }

    const animateTraversal = async () => {
        const list = traverseList();
        if (list.length === 0) return;

        const steps = linkedlist.steps("traverse");
        setAlgorithmSteps(steps);
        setAlgorithmName("Traverse list");

        const timeline = gsap.timeline();

        // Highlight head-null node and next arrow
        animateHead(timeline);
        // Highlight each list node box and next arrow
        animateNodes(list, timeline);
        // Highlight null node
        animateNull(timeline);

        // show travsersal result
        const traversalResult = linkedlist.displayList();
        setResultText("Linked list: ");
        setCurrVal(traversalResult);
    };

    const animateInsertion = async (insertPosition, newData) => {
        await new Promise(resolve => setTimeout(resolve, 5)); // Wait for insertion to complete

        const list = traverseList();
        const index = list.findIndex(node => node.data === newData);
        let nodesBefore = [];
        let nodesAfter = [];
        if (index !== -1) {
            nodesBefore = list.slice(0, index); // Exclude the node with the data
            nodesAfter = list.slice(index + 1); // Exclude the node with the data
        } else {
            // If the target data is not found, the whole array is considered as nodes before the target
            nodesBefore = list;
        }

        const newNode = document.querySelector(`#list-node-${newData} .box`);
        if (newNode) {
            gsap.set(newNode, { opacity: 0, y: -75 });
        } else return;


        const nextBox = `#list-node-${newData} .next`;
        const nextArrowElement = `#list-node-${newData} .nextArrow`;
        let prevBox;
        let nextPrevArrowElement;
        if (listType === 'doubly') {
            prevBox = `#list-node-${newData} .prev`;
            nextPrevArrowElement = `#list-node-${newData} .prevArrow`;
        }

        let prevNode;
        let PrevArrowElement;
        if (nodesBefore.length > 0 && listType === 'doubly') {
            prevNode = nodesBefore[nodesBefore.length - 1];
            PrevArrowElement = `#list-node-${prevNode.data} .prevArrow`;
        }

        let nextNode;
        let nextPrev;
        if (nodesAfter.length > 0 && listType === 'doubly') {
            nextNode = nodesAfter[0];
            nextPrev = `#list-node-${nextNode.data} .prev`;
        }

        const timeline = gsap.timeline();

        // start animation
        // display node
        timeline.set(newNode, { opacity: 1, y: -75, backgroundColor: "#EDE4FF", color: "#940B92", borderColor: "#940B92" },)
            .set(nextBox, { backgroundColor: "#713ABE" }, "<");
        if (prevBox) timeline.set(prevBox, { backgroundColor: "#713ABE", duration: 1 }, "<");

        gsap.set(nextArrowElement, { opacity: 0, fill: "#D800A6" });
        nextPrevArrowElement && gsap.set(nextPrevArrowElement, { opacity: 0, fill: "#D800A6" });
        PrevArrowElement && gsap.set(PrevArrowElement, { fill: "#D800A6", opacity: 0, });

        // hide pointer to null
        if (insertPosition === 'Beginning' && listType === 'doubly') {
            gsap.to("#head-null-node .prev-null-node", { opacity: 0, duration: 0.5 });
            gsap.to("#head-null-node .prevArrow", { fill: "#D800A6", opacity: 0, duration: 0.5 });
        }

        // animate head
        animateHead(timeline);

        // animate nodes before the new node
        if (insertPosition !== "Beginning") {
            animateNodes(nodesBefore, timeline);
        }

        if (insertPosition === "Before Node") {
            const nextNodeBox = `#list-node-${nextNode.data} .box`;
            timeline.to(nextNodeBox, { backgroundColor: "#FAE7F3", color: "#D800A6", borderColor: "#D800A6", duration: 1.5 }, "-=1")
                .to(nextNodeBox, { backgroundColor: "#FFF7FC", color: "#1363DF", borderColor: "#1363DF", duration: 1 },);

            // Highlight next node box
            timeline.to(nextPrev, { backgroundColor: "#5999cd", duration: 0.5 }, "-=2")
                .to(nextPrev, { backgroundColor: "#D800A6", duration: 1 }, "-=1")
                .to(nextPrev, { backgroundColor: "#5999cd", duration: 0.5 });

            timeline.set(nextPrevArrowElement, { opacity: 1 })
            timeline.to(nextPrevArrowElement, { x: "+=10", scale: 1.2, duration: 0.5 },)
                .to(nextPrevArrowElement, { x: 0, fill: "#000", scale: 1, duration: 1, });
        }

        const slideDelay = insertPosition === "Before Node" ? (nodesBefore.length + 1) * 4 : (nodesBefore.length + 1) * 3;

        // slide nodes after new node to right
        nodesAfter.forEach((listNode, index) => {
            const currentNode = `#list-node-${listNode.data} `;
            gsap.set(currentNode, { x: `${listType === 'doubly' ? -206 : -146}` }); // Delay the start of each node's animation
        });
        nodesAfter.forEach((listNode, index) => {
            const currentNode = `#list-node-${listNode.data} `;
            gsap.to(currentNode, { x: 0, duration: 1, delay: slideDelay }); // Delay the start of each node's animation
        });

        // hide null node if no nodes after
        if (nodesAfter.length === 0) {
            gsap.set("#null-node", { opacity: 0 })
        }
        else {
            //  else slide to right
            gsap.set("#null-node", { x: `${listType === 'doubly' ? -206 : -146}` });
            gsap.to("#null-node", { x: 0, duration: 1, delay: slideDelay });
        }

        // place new node
        timeline.to(newNode, { opacity: 1, y: 0, duration: 1 }, "+=.5");

        // Highlight next node box
        timeline.to(nextBox, { backgroundColor: "#713ABE", duration: 0.5 }, "-=2")
            .to(nextBox, { backgroundColor: "#D800A6", duration: 1 }, "+=1")
            .to(nextBox, { backgroundColor: "#713ABE", duration: 0.5 });

        // point arrow to next node
        timeline
            .to(nextArrowElement, { opacity: 1, x: -10, scale: 1.2, duration: 1 }, "-=.5")
            .to(nextArrowElement, { x: 0, fill: "#000", scale: 1, duration: .5 });

        // if next pointer is null, animate it
        timeline.to("#null-node", { opacity: 1 })
        if (nodesAfter.length === 0)
            animateNull(timeline);

        // Highlight prev node box
        if (prevBox) {
            timeline.to(prevBox, { backgroundColor: "#713ABE", duration: 0.5 }, "-=2")
                .to(prevBox, { backgroundColor: "#D800A6", duration: 1 }, "+=1")
                .to(prevBox, { backgroundColor: "#713ABE", duration: 0.5 });
        }

        // point arrow to prev node 
        if (PrevArrowElement) {
            timeline.to(PrevArrowElement, { opacity: 1, x: 10, scale: 1.2, duration: 0.5 },)
                .to(PrevArrowElement, { x: 0, fill: "#000", scale: 1, duration: 1 },);
        }

        // if prev node is null, animate it 
        if (nodesBefore.length === 0 && listType === 'doubly') {
            timeline.to("#head-null-node .prevArrow", { opacity: 1, x: 10, scale: 1.2, duration: 0.5 },)
                .to("#head-null-node .prevArrow", { x: 0, fill: "#000", scale: 1, duration: 1 },)
                .to("#head-null-node .prev-null-node", { opacity: 1, color: "#D800A6", duration: 1 })
                .to("#head-null-node .prev-null-node", { color: "#1363DF", duration: 0.5 });
        }

        // highlight the prev pointer of next node
        if (nextPrev && insertPosition !== "Before Node") {
            timeline.to(nextPrev, { backgroundColor: "#5999cd", duration: 0.5 }, "-=2")
                .to(nextPrev, { backgroundColor: "#D800A6", duration: 1 }, "+=1")
                .to(nextPrev, { backgroundColor: "#5999cd", duration: 0.5 });
        }

        // point arrow to prev node
        if (nextPrevArrowElement && insertPosition !== "Before Node") {
            timeline.set(nextPrevArrowElement, { opacity: 1 })
            timeline.to(nextPrevArrowElement, { x: "+=10", scale: 1.2, duration: 0.5 },)
                .to(nextPrevArrowElement, { x: 0, fill: "#000", scale: 1, duration: 1, });
        }

        // reset style
        timeline.to(newNode, { backgroundColor: "#FFF7FC", color: "#1363DF", borderColor: "#1363DF", duration: 1 }, "+=2")
            .to(nextBox, { backgroundColor: "#5999cd", duration: 0.5 }, "<");
        if (prevBox)
            timeline.to(prevBox, { backgroundColor: "#5999cd", duration: 0.5 }, "<");

    };

    const animateDeletion = (deletePosition, deletedData, onComplete) => {
        const list = traverseList();

        let index;
        if (list.length > 0) {
            if (deletePosition === "Middle" && deletedData) {
                index = list.findIndex(node => node.data === deletedData);

                const steps = linkedlist.steps("deleteFromMiddle");
                setAlgorithmSteps(steps);
                setAlgorithmName("Delete from middle");

            }
            else if (deletePosition === "Beginning") {
                index = 0;
                deletedData = list[index].data;

                const steps = linkedlist.steps("deleteAtBeginning");
                setAlgorithmName("Delete at beginning");
                setAlgorithmSteps(steps);
            }
            else if (deletePosition === "End") {
                index = list.length - 1;
                deletedData = list[index].data;

                const steps = linkedlist.steps("deleteFromEnd");
                setAlgorithmName("Delete from end");
                setAlgorithmSteps(steps);
            }
        }
        else {
            onComplete();
            return
        };

        let nodesBefore = [];
        let nodesAfter = [];
        if (index !== -1) {
            nodesBefore = list.slice(0, index); // Exclude the node with the data
            nodesAfter = list.slice(index + 1); // Exclude the node with the data
        } else {
            // If the target data is not found, the whole array is considered as nodes before the target
            nodesBefore = list;
        }

        const deletedNode = document.querySelector(`#list-node-${deletedData} .box`);
        if (!deletedNode) {
            onComplete();
            return
        };

        const nextBox = `#list-node-${deletedData} .next`;
        const nextArrowElement = `#list-node-${deletedData} .nextArrow`;

        let prevNextArrowElement, prevNextBox;
        if (nodesBefore.length > 0) {
            const prevNode = nodesBefore[nodesBefore.length - 1];
            prevNextBox = `#list-node-${prevNode.data} .next`;
            prevNextArrowElement = `#list-node-${prevNode.data} .nextArrow`;
        }

        let prevBox, nextPrevArrowElement;
        if (listType === 'doubly') {
            prevBox = `#list-node-${deletedData} .prev`;
            nextPrevArrowElement = `#list-node-${deletedData} .prevArrow`;
        }

        let prevNode;
        let PrevArrowElement;
        if (nodesBefore.length > 0 && listType === 'doubly') {
            prevNode = nodesBefore[nodesBefore.length - 1];
            PrevArrowElement = `#list-node-${prevNode.data} .prevArrow`;
        }

        let nextPrev;
        if (nodesAfter.length > 0 && listType === 'doubly') {
            const nextNode = nodesAfter[0];
            nextPrev = `#list-node-${nextNode.data} .prev`;
        }

        const timeline = gsap.timeline();

        // start animation
        // animate head
        animateHead(timeline);

        // animate nodes before the new node
        if (deletePosition !== "Beginning") {
            animateNodes(nodesBefore, timeline);
        }

        // find the node
        timeline.to(deletedNode, { backgroundColor: "#FAE7F3", color: "#D800A6", borderColor: "#D800A6", duration: 1.5 },)
            .to(deletedNode, { backgroundColor: "#FFF7FC", color: "#1363DF", borderColor: "#1363DF", duration: 1 },);

        // Highlight the node found
        timeline.to(deletedNode, { backgroundColor: "#f9efef", color: "#990000", borderColor: "#990000", duration: 1 })
            .to(nextBox, { backgroundColor: "#990000", duration: 1 }, "<");
        if (prevBox) timeline.to(prevBox, { backgroundColor: "#990000", duration: 1 }, "<");

        // hide pointers
        timeline.to(nextArrowElement, { opacity: 0, x: -10, duration: 1 });
        // if next pointer is null, hide it
        if (nodesAfter.length === 0)
            timeline.to("#null-node", { opacity: 0, duration: 1 }, "<");

        // hide prev pointer to null
        if (index === 0 && listType === 'doubly') {
            timeline.to("#head-null-node .prev-null-node", { opacity: 0, duration: 0.5 }, "<");
            timeline.to("#head-null-node .prevArrow", { fill: "#D800A6", opacity: 0, duration: 0.5 }, "<");
        }
        nextPrevArrowElement && timeline.to(nextPrevArrowElement, { opacity: 0, fill: "#D800A6" }, "<");
        prevNextArrowElement && timeline.to(prevNextArrowElement, { fill: "#D800A6", opacity: 0, }, "<");
        PrevArrowElement && timeline.to(PrevArrowElement, { fill: "#D800A6", opacity: 0, }, "<");

        // Animate deletion
        timeline.to(deletedNode, { y: -75, duration: 1 }, "=+1")
            .to(deletedNode, { opacity: 0, duration: 1 });

        // Slide nodes after the deleted node to the left
        nodesAfter.forEach((listNode, index) => {
            const currentNode = `#list-node-${listNode.data} `;
            timeline.to(currentNode, { x: `${listType === 'doubly' ? -206 : -146}`, duration: 1, }, "<"); // Delay the start of each node's animation
        });
        timeline.to("#null-node", { x: `${listType === 'doubly' ? -206 : -146}`, duration: 1 }, "<");

        // point the head to next node
        if (deletePosition === "Beginning") {
            animateHead(timeline);
        }

        // Highlight next node box of prev node
        timeline.to(prevNextBox, { backgroundColor: "#5999cd", duration: 0.5 }, "-=2")
            .to(prevNextBox, { backgroundColor: "#D800A6", duration: 1 }, "+=1")
            .to(prevNextBox, { backgroundColor: "#5999cd", duration: 0.5 });

        // point arrow to next node
        timeline
            .to(prevNextArrowElement, { opacity: 1, x: -10, scale: 1.2, duration: 1 }, "-=.5")
            .to(prevNextArrowElement, { x: 0, fill: "#000", scale: 1, duration: .5 });

        // if next pointer is null, animate it
        timeline.to("#null-node", { opacity: 1 })
        if (nodesAfter.length === 0)
            animateNull(timeline);

        // Highlight prev node box
        if (nextPrev) {
            timeline.to(nextPrev, { backgroundColor: "#5999cd", duration: 0.5 }, "-=2")
                .to(nextPrev, { backgroundColor: "#D800A6", duration: 1 }, "+=1")
                .to(nextPrev, { backgroundColor: "#5999cd", duration: 0.5 });
        }

        // point arrow to prev node 
        if (PrevArrowElement && nodesAfter.length > 0) {
            timeline.to(PrevArrowElement, { opacity: 1, x: 10, scale: 1.2, duration: 0.5 },)
                .to(PrevArrowElement, { x: 0, fill: "#000", scale: 1, duration: 1 },);
        }

        // if prev node is null, animate it 
        if (nodesBefore.length === 0 && nodesAfter.length > 0 && listType === 'doubly') {
            timeline.to("#head-null-node .prevArrow", { opacity: 1, x: 10, scale: 1.2, duration: 0.5 },)
                .to("#head-null-node .prevArrow", { x: 0, fill: "#000", scale: 1, duration: 1 },)
                .to("#head-null-node .prev-null-node", { opacity: 1, color: "#D800A6", duration: 1 })
                .to("#head-null-node .prev-null-node", { color: "#1363DF", duration: 0.5 });
        }

        // reset positions of nodes
        timeline.set("#null-node", { x: 0 });
        nodesAfter.forEach((listNode, index) => {
            const currentNode = `#list-node-${listNode.data} `;
            timeline.set(currentNode, { x: 0 }); // Delay the start of each node's animation
        });

        // deleted the node
        timeline.set(deletedNode, { display: "none", onComplete: onComplete });
    };

    const animateSearch = async (nodeData) => {
        const list = traverseList();
        const index = list.findIndex(node => node.data === nodeData);
        let nodesBefore = [];
        if (index !== -1) {
            nodesBefore = list.slice(0, index); // Exclude the node with the data
        } else {
            // If the target data is not found, the whole array is considered as nodes before the target
            nodesBefore = list;
        }

        // start animation
        const timeline = gsap.timeline();

        // animate head and the nodes before
        animateHead(timeline);
        animateNodes(nodesBefore, timeline);

        const searchNode = document.querySelector(`#list-node-${nodeData} .box`);
        if (!searchNode) {
            animateNull(timeline);
            return;
        };

        const nextBox = document.querySelector(`#list-node-${nodeData} .next`);
        let prevBox = "";
        if (listType === 'doubly') {
            prevBox = `#list-node-${nodeData} .prev`;
        }

        // reach the node
        timeline.to(searchNode, { backgroundColor: "#FAE7F3", color: "#D800A6", borderColor: "#D800A6", duration: 1.5 }, "-=1")
            .to(searchNode, { backgroundColor: "#FFF7FC", color: "#1363DF", borderColor: "#1363DF", duration: 1 },);

        // Highlight the node found
        timeline.to(searchNode, { backgroundColor: "#d3f7db", color: "#015719", borderColor: "#08ad37", duration: 1.5 })
            .to(nextBox, { backgroundColor: "#41B06E", duration: 1.5 }, "<");
        if (prevBox) timeline.to(prevBox, { backgroundColor: "#41B06E", duration: 1.5 }, "<");

        // reset style
        timeline.to(searchNode, { backgroundColor: "#FFF7FC", color: "#1363DF", borderColor: "#1363DF", duration: 1 }, "+=2")
            .to(nextBox, { backgroundColor: "#5999cd", duration: 0.5 }, "<");
        if (prevBox)
            timeline.to(prevBox, { backgroundColor: "#5999cd", duration: 0.5 }, "<");
    };

    const resetLinkedList = () => {
        setLinkedList(null);
        setResultText('');
        setCurrVal('');
    };

    const renderNodes = () => {
        let current = linkedlist.head;
        const nodes = [];
        // head
        nodes.push(
            <div id="head-null-node" className="list-node">
                <div className="box head">
                    <div className='head-node'>HEAD</div>
                    {listType === 'doubly' && current && <div className="prev-null-node">NULL</div>}
                </div>
                <div className='arrowIcons'>
                    <EastIcon className='nextArrow' id="head-arrow" />
                    {listType === 'doubly' && current && <WestIcon className='prevArrow' />}
                </div>
            </div>
        );
        // other nodes
        while (current !== null) {
            nodes.push(
                <div key={current.data} id={(`list-node-${current.data}`)} className="list-node">
                    <div className="box">
                        {listType === 'doubly' && <div className="prev">prev</div>}
                        <div className="data">
                            {current.data}
                        </div>
                        <div className="next">next</div>
                    </div>
                    <div className='arrowIcons'>
                        <EastIcon className='nextArrow' />
                        {listType === 'doubly' && current.next && <WestIcon className='prevArrow' />}
                    </div>
                </div>
            );
            current = current.next;
        }
        // null
        nodes.push(
            <div key="null" className="list-node">
                <div id="null-node" className="box null">NULL</div>
            </div>
        );
        return nodes;
    };

    const toggleSidePanel = () => {
        setSidePanelOpen(!sidePanelOpen);
    };

    return (
        <>
            <Navbar currentPage="Linked List"
                info="LinkedList/info" />
            <button className="side-panel-toggle" onClick={toggleSidePanel}>
                <ListRounded className='sidepanel-icon' />
                View steps
            </button>
            <SidePanel algorithmSteps={algorithmSteps} algorithmName={algorithmName} isOpen={sidePanelOpen} onClose={toggleSidePanel} />

            <div className="linkedlist-visualizer">
                <div>
                    <div className="menu">
                        <select value={listType} onChange={handleListTypeChange}>
                            <option disabled value="">Select Linked List</option>
                            <option value="singly">Singly Linked List</option>
                            <option value="doubly">Doubly Linked List</option>
                            {/* <option disabled value="circular">Circular Linked List</option> */}
                        </select>
                        {/* insert */}
                        <div>
                            <select value={insertPosition} onChange={handleInsertPositionChange}>
                                <option value="Beginning">Beginning</option>
                                <option value="After Node">After Node</option>
                                {listType === 'doubly' && <option value="Before Node">Before Node</option>}
                                <option value="End">End</option>
                            </select>
                            {
                                (insertPosition === 'After Node' || insertPosition === 'Before Node') &&
                                <input
                                    type="text"
                                    placeholder={insertPosition === 'After Node' ? "Prev node" : "Next node"}
                                    value={nodeValue}
                                    onChange={handleNodeValueChange}
                                />
                            }
                            <input type="text" value={newValue} onChange={handleInputChange} placeholder="New value" />
                            <button className='visualize-btn' onClick={insertNode}>Insert</button>
                        </div>
                        {/* delete */}
                        <div>
                            <select value={deletePosition} onChange={handleDeletePositionChange}>
                                <option value="Beginning">Beginning</option>
                                <option value="Middle">Middle</option>
                                <option value="End">End</option>
                            </select>
                            {
                                deletePosition === 'Middle' &&
                                <input
                                    type="text"
                                    placeholder="Delete node"
                                    value={nodeValue}
                                    onChange={handleNodeValueChange}
                                />
                            }
                            <button className='reset-btn' onClick={deleteNode}>Delete</button>
                        </div>
                        {/* search */}
                        <div>
                            <input type="text" value={searchValue} onChange={handleSearchInputChange} placeholder="Search Node" />
                            <button className='visualize-btn' onClick={searchNode}>Search</button>
                        </div>
                        <button className='' onClick={animateTraversal}>Traverse</button>
                        <button className='reset-btn-2' onClick={resetLinkedList}>Reset</button>
                    </div>
                    {(resultText || currVal) &&
                        <div className="result">{resultText} <strong>{currVal}</strong></div>}
                </div>

                <div className="linkedlist">
                    <div className="list">
                        {linkedlist && renderNodes()}
                    </div>
                </div>

                <ComplexityAnalysis
                    timeComplexity={timeComplexity}
                    spaceComplexity={spaceComplexity}
                    realSpaceComplexity={realSpaceComplexity}
                    realTimeComplexity={realTimeComplexity}
                />
            </div>
        </>
    );
};

export default LinkedListVisualizer;