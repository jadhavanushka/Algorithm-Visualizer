import React, { useState } from 'react';
import Navbar from '../Components/navbar';
import './linkedlist.css';
import SinglyLinkedList from './SinglyLinkedList'; // Import SinglyLinkedList
import DoublyLinkedList from './DoublyLinkedList'; // Import DoublyLinkedList
import CircularLinkedList from './CircularLinkedList'; // Import CircularLinkedList
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

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
            case 'circular':
                setLinkedList(new CircularLinkedList());
                break;
            default:
                // Handle default case if needed
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
                linkedlist.insertAtBeginning(newData);
                setResultText('Inserted at beginning:');
                setCurrVal(newData);
            } else if (insertPosition === 'After Node') {
                const prevNodeData = parseInt(nodeValue.trim());
                const foundNode = linkedlist.search(prevNodeData);
                if (foundNode) {
                    linkedlist.insertAfterNode(prevNodeData, newData);
                    setResultText('Inserted after ' + prevNodeData + ': ');
                    setCurrVal(newData);
                } else {
                    setResultText('Node not found');
                    setCurrVal('');
                }
            } else if (insertPosition === 'Before Node') {
                const nextNodeData = parseInt(nodeValue.trim());
                const foundNode = linkedlist.search(nextNodeData);
                if (foundNode) {
                    linkedlist.insertBeforeNode(nextNodeData, newData);
                    setResultText('Inserted before ' + nextNodeData + ': ');
                    setCurrVal(newData);
                } else {
                    setResultText('Node not found');
                    setCurrVal('');
                }
            } else if (insertPosition === 'End') {
                linkedlist.insertAtEnd(newData);
                setResultText('Inserted at end:');
                setCurrVal(newData);
            }
        }
    };

    const deleteNode = () => {
        if (linkedlist) {
            if (deletePosition === 'Beginning') {
                const removedData = linkedlist.deleteAtBeginning();
                if (removedData !== null) {
                    setResultText('Deleted from beginning:');
                    setCurrVal(removedData);
                } else {
                    setResultText('List is empty');
                    setCurrVal('');
                }
            } else if (deletePosition === 'Middle') {
                const dataToDelete = parseInt(nodeValue.trim());
                const foundNode = linkedlist.search(dataToDelete);
                if (foundNode) {
                    linkedlist.deleteFromMiddle(dataToDelete);
                    setResultText('Deleted node:');
                    setCurrVal(dataToDelete);
                } else {
                    setResultText('Node not found');
                    setCurrVal('');
                }
            }
            else if (deletePosition === 'End') {
                const removedData = linkedlist.deleteFromEnd();
                if (removedData !== null) {
                    setResultText('Deleted from end:');
                    setCurrVal(removedData);
                } else {
                    setResultText('List is empty');
                    setCurrVal('');
                }
            }
        }
    };

    const searchNode = () => {
        if (linkedlist && searchValue) {
            const valueToSearch = parseInt(searchValue.trim());
            const foundNode = linkedlist.search(valueToSearch);
            if (foundNode) {
                setResultText('Node found:');
                setCurrVal(valueToSearch);
            } else {
                setResultText('Node not found');
                setCurrVal('');
            }
        }
    };

    const traverseList = () => {
        if (linkedlist) {
            const traversalResult = linkedlist.traverse();
            // console.log(traversalResult); // Output the traversal result to console
            return traversalResult;
        }
    };

    const animateTraversal = async () => {
        const list = traverseList();
        if (list.length === 0) return;

        document.getElementById("head-null-node").classList.add('head-null-visited');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for animation to complete
        document.getElementById("head-null-node").classList.remove('head-null-visited');


        for (let i = 0; i < list.length; i++) {
            const listNode = list[i];
            const currentNodeElement = document.getElementById(`list-node-${listNode.data}`);

            listNode.visited = true;
            currentNodeElement.classList.add('list-node-visited');

            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animation to complete

            listNode.visited = false;
            currentNodeElement.classList.remove('list-node-visited');
        };

        document.getElementById("null-node").classList.add('null-visited');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animation to complete
        document.getElementById("null-node").classList.remove('null-visited');

        setResultText('Linked List:');
        setCurrVal(linkedlist.displayList());
    }


    // const displayList = () => {
    //     if (linkedlist) {
    //         setResultText('Linked List:');
    //         setCurrVal(linkedlist.displayList());
    //     }
    // };

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
                    <EastIcon className='nextArrow' id="head-arrow"/>
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


    return (
        <>
            <Navbar currentPage="Linked List" />
            <div className="linkedlist-visualizer">
                <div>
                    <div className="menu">
                        <select value={listType} onChange={handleListTypeChange}>
                            <option disabled value="">Select Linked List</option>
                            <option value="singly">Singly Linked List</option>
                            <option value="doubly">Doubly Linked List</option>
                            <option disabled value="circular">Circular Linked List</option>
                        </select>

                        {/* insert */}
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

                        {/* delete */}
                        <select value={deletePosition} onChange={handleDeletePositionChange}>
                            <option value="Beginning">Beginning</option>
                            <option value="Middle">Middle</option>
                            <option value="End">End</option>
                        </select>
                        {
                            deletePosition === 'Middle' &&
                            <input
                                type="text"
                                placeholder="Enter node value"
                                value={nodeValue}
                                onChange={handleNodeValueChange}
                            />
                        }
                        <button className='reset-btn' onClick={deleteNode}>Delete</button>
                    </div>

                    {/* search */}
                    <input type="text" value={searchValue} onChange={handleSearchInputChange} placeholder="Search Node" />
                    <button className='visualize-btn' onClick={searchNode}>Search Node</button>

                    <button className='' onClick={animateTraversal}>Traverse</button>
                    <button className='reset-btn' onClick={resetLinkedList}>Reset</button>
                    <div className="result">{resultText && `${resultText} ${currVal}`}</div>
                </div>
                <div className="linkedlist">
                    <div className="list">
                        {linkedlist && renderNodes()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LinkedListVisualizer;
