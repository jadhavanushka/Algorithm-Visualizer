import { Outlet, Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

const list = [
  {
    "title": "Sorting Algorithms",
    "link": "sort",
    "description": "Sorting is a technique to rearrange the elements of an array or a list in a specific order.",
    "algorithms": ["Bubble", "Insertion", "Selection", "Quick"],
    "img": ""
  },
  {
    "title": "Binary Search",
    "link": "binarysearch",
    "description": "Binary Search is defined as a searching algorithm used in a sorted array by repeatedly dividing the search interval in half.",
    "algorithms": ["Binary Search"],
    "img": ""
  },
  {
    "title": "Recursive Sort",
    "link": "recursiveSort",
    "description": "Recursive sort refers to a sorting algorithm that uses the concept of recursion to sort a list of elements.",
    "algorithms": ["Merge", "Heap", "Quick"],
    "img": ""
  },
  {
    "title": "Pathfinding Algorithms",
    "link": "pathfinder",
    "description": "Pathfinding algorithms are methods of finding the shortest path between two points in a graph, such as a map, a maze, or a network.",
    "algorithms": ["Dijkstra's ", "A*", "Breadth-first", "Depth-first"],
    "img": ""
  },
  {
    "title": "Stack",
    "link": "stack",
    "description": "A stack is a Linear data structure. It follows Last in First Out(LIFO). Elements are inserted and deleted from the top of a stack.",
    "algorithms": ["push", "pop", "peek", "isEmpty", "size"],
    "img": ""
  },
  {
    "title": "Queue",
    "link": "queue",
    "description": "A Queue is a Linear data structure. It follows First in First Out(FIFO). Elements are inserted at the end of the Queue and deleted from the beginning of a queue.",
    "algorithms": ["enqueue", "dequeue", "peek", "isEmpty", "isFull", "size"],
    "img": ""
  },
  {
    "title": "Linked List",
    "link": "linkedlist",
    "description": "A linked list is a linear data structure that consists of a series of nodes where each node contains data and a reference (link) to the next node in the sequence. ",
    "algorithms": ["Insert", "Delete", "Search", "Traverse"],
    "img": ""
  },
  {
    "title": "N-queens Problem",
    "link": "queen",
    "description": "The N-Queens Problem is a classical problem in which the goal is to place N queens on an N×N chessboard so that no two queens threaten each other.",
    "algorithms": ["Backtracking"],
    "img": ""
  },
  {
    "title": "Convex Hull",
    "link": "convexHull",
    "description": "The convex hull of a set of points in a plane is the smallest convex polygon that contains all the points within it.",
    "algorithms": ["Graham Scan"],
    "img": ""
  },
  {
    "title": "Minimum Spanning Tree",
    "link": "MinimumSpanningTree",
    "description": "An MST has the minimum possible total edge weight. It connects all the vertices of the graph without forming any cycles.",
    "algorithms": ["Prim's", "Kruskal's"],
    "img": ""
  },
  {
    "title": "Binary Search Tree",
    "link": "binarysearchtree",
    "description": "BST is a node-based binary tree data structure which has the following properties: left subtree of a node contains only nodes with keys lesser than the node’s key.",
    "algorithms": ["Insert", "Delete", "Search", "Traverse"],
    "img": ""
  },
  {
    "title": "Linear Regression",
    "link": "linear-regression",
    "description": "Linear Regression is a basic and commonly used type of predictive analysis.",
    "algorithms": ["Supervised", "Prediction"],
    "img": ""
  },
];

const categories = {
  "Data structures": ["Linked List", "Stack", "Queue", "Binary Search Tree"],
  "Array": ["Sorting Algorithms", "Binary Search", "Recursive Sort"],
  "Graph": ["Pathfinding Algorithms", "Minimum Spanning Tree"],
  "Backtracking": ["N-queens Problem"],
  "Machine Learning": ["Linear Regression"],
};

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 250,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSearchInputChange = (event) => {
    setQuery(event.target.value);
  };

  const getAllItems = () => {
    const uncategorizedItems = list
      .filter(item => !Object.values(categories).flat().includes(item.title))
      .map(item => item.title);
    return [
      ...Object.keys(categories).flatMap(category => categories[category]),
      ...uncategorizedItems
    ];
  };

  const filterItems = (items, query) => {
    return items.filter(item => {
      const lowerCaseItem = item.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      if (lowerCaseItem.includes(lowerCaseQuery)) {
        return true;
      }
      const listItem = list.find(l => l.title.toLowerCase() === lowerCaseItem);
      if (listItem && listItem.algorithms.some(algo => algo.toLowerCase().includes(lowerCaseQuery))) {
        return true;
      }
      return false;
    });
  };

  const displayedItems = query.trim() === ''
    ? (selectedTab === 0 ? getAllItems() : categories[Object.keys(categories)[selectedTab - 1]])
    : filterItems(getAllItems(), query);

  return (
    <>
      <div className="hero-container home22-intro">
        <div className="nav-logo">
          <GraphicEqIcon />
          <h3 className="logo-text">
            Interactive learning platform for Data Structures & Algorithms
          </h3>
        </div>
        <section className="hero-section">
          <div className="hero-text-content">
            <h1 className="hero-text-content-h1">Algorithm Visualizer</h1>
            <h2 className="hero-text-content-h2">
              Explore & Understand Algorithms through Interactive Visualization
            </h2>
          </div>

          <div className="search-input-hero search-input-with-dropdown">
            <SearchIcon className="search-icon"></SearchIcon>
            <form className="search-input-form" onSubmit={e => e.preventDefault()}>
              <label htmlFor="search" className="accessibility-text">Search</label>
              <input
                id="search"
                type="search"
                name="q"
                placeholder="Search..."
                value={query}
                onChange={handleSearchInputChange}
                className="search-input"
              />
            </form>
          </div>
        </section>
      </div>

      <div className="container">

        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3.5 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 100,
                padding: '12px 24px',
                fontSize: '1rem',
                textTransform: 'none',
                color: "gray",
              },
              '& .MuiTabs-flexContainer': {
                justifyContent: 'center',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#5a43c3',
              },
              '& .MuiTab-root.Mui-selected': {
                color: '#5a43c3',
              },
            }}
          >
            <Tab label="All" />
            {Object.keys(categories).map((category, index) => (
              <Tab key={index} label={category} />
            ))}
          </Tabs>
        </Box>

        <section className="dashboard-section">
          <div className="cards-grid">
            {displayedItems.map((item, itemId) => {
              const listItem = list.find(l => l.title === item);
              return (
                <Link to={listItem?.link || '#'} className="algo-card" key={itemId}>
                  <div className="card-content">
                    <h3 className="card-title">{item}</h3>
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">
                            {listItem?.description || ''}
                          </Typography>
                        </React.Fragment>
                      }
                    >
                      <Button>
                        <Link to={listItem?.link + "/info" || '#'} style={{ height: "24px" }}>
                          <InfoIcon color="action"></InfoIcon>
                        </Link>
                      </Button>
                    </HtmlTooltip>
                  </div>
                  <ul className="card-tags">
                    {(listItem?.algorithms || []).map((algo, algoId) => (
                      <li className="card-tag" key={algoId}>{algo}</li>
                    ))}
                  </ul>
                  <img
                    className="card-logo"
                    src={listItem?.img || "https://hrcdn.net/s3_pub/hr-assets/dashboard/ProblemSolving.svg"}
                    alt={item}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
      <Outlet />
    </>
  );
}
