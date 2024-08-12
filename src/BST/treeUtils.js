import gsap from "gsap/all";

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function generateRandomBST(nodeCount, maxValue) {
  let tree = null;
  for (let i = 0; i < nodeCount; i++) {
    const value = Math.floor(Math.random() * maxValue) + 1;
    tree = addNodeToBST(tree, value);
  }
  return tree;
}

export function addNodeToBST(tree, value) {
  if (!tree) {
    return createNode(value);
  }

  let current = tree;
  while (true) {
    if (value < current.value) {
      if (!current.left) {
        current.left = createNode(value);
        break;
      } else {
        current = current.left;
      }
    } else {
      if (!current.right) {
        current.right = createNode(value);
        break;
      } else {
        current = current.right;
      }
    }
  }

  return tree;
}

export function createNode(value) {
  return {
    id: generateUniqueId(), // Generate a unique identifier using uuidv4
    value,
    left: null,
    right: null
  };
}

export function searchBST(tree, value, setResultText, animationSpeed) {
  let current = tree;
  const animationTimeline = gsap.timeline();
  const animationDuration = 0.5;
  const delay = (50 - animationSpeed) / 100;

  const visitNode = (node) => {
    return new Promise(resolve => {
      ((node) => {
        const nodeElement = document.querySelector(`#node-${node.id}`);
        animationTimeline.to(nodeElement, {
          duration: animationDuration,
          delay: delay,
          fill: '#00008f',
          onComplete: () => {
            resolve();
          }
        });
        animationTimeline.to(nodeElement, {
          duration: 1,
          fill: 'rgb(0, 119, 255)'
        });
      })(current);
    });
  };

  return new Promise(async (resolve) => {
    while (current) {
      await visitNode(current);
      if (value === current.value) {
        animationTimeline.to(`#node-${current.id}`, {
          duration: animationDuration,
          // delay: delay,
          fill: '#337357',
          r: 25
        });
        resolve(true);
        return;
      }
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    resolve(false);
  });
}

export function deleteNodeFromBST(tree, value) {
  if (!tree) {
    return null;
  }

  if (value < tree.value) {
    tree.left = deleteNodeFromBST(tree.left, value);
  } else if (value > tree.value) {
    tree.right = deleteNodeFromBST(tree.right, value);
  } else {
    if (!tree.left) {
      return tree.right;
    } else if (!tree.right) {
      return tree.left;
    }

    const minValue = findMinValue(tree.right).value;
    tree.value = minValue;
    tree.right = deleteNodeFromBST(tree.right, minValue);
  }
  return tree;
}

export function findMinValue(node) {
  let current = node;
  while (current.left) {
    current = current.left;
  }
  return current;
}

export function inorderTraversal(node) {
  if (!node) return [];
  return [...inorderTraversal(node.left), node, ...inorderTraversal(node.right)];
}

export function preorderTraversal(node) {
  if (!node) return [];
  return [node, ...preorderTraversal(node.left), ...preorderTraversal(node.right)];
}

export function postorderTraversal(node) {
  if (!node) return [];
  return [...postorderTraversal(node.left), ...postorderTraversal(node.right), node];
}

export function findNode(tree, value) {
  let current = tree;

  while (current) {
    if (value === current.value) {
      return current;
    }
    if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }

  return null;
}

export function findParentNode(tree, value) {
  let parent = null;
  let current = tree;

  while (current) {
    if (value === current.value) {
      return parent ? parent : null;
    }
    parent = current;
    if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }

  return null;
}

export function steps(operation) {
  switch (operation) {
    case "addNodeToBST":
      return [
        { code: "1. Start at the root node." },
        { code: "2. Compare each node: " },
        { code: "(i) Is the value lower? Go left. " },
        { code: "(ii) Is the value higher? Go right. " },
        { code: "3. Continue to compare nodes with the new value until there is no right or left to compare with. That is where the new node is inserted." },
      ]
    case "searchBST":
      return [
        { code: "1. Start at the root node. " },
        { code: "2. If this is the value we are looking for, return." },
        { code: "3. If the value we are looking for is higher, continue searching in the right subtree. " },
        { code: "4. If the value we are looking for is lower, continue searching in the left subtree.  " },
        { code: "5. If the subtree we want to search does not exist, return NULL." },
      ]
    case "deleteNodeFromBST":
      return [
        { code: "1. If the node is a leaf node, remove it by removing the link to it." },
        { code: "2. If the node only has one child node, connect the parent node of the node you want to remove to that child node. " },
        { code: "3. If the node has both right and left child nodes: Find the node's in-order successor, change values with that node, then delete it. " },
      ]
    case "inorderTraversal":
      return [
        { code: '1: Follow step 2 to 4 until root != NULL' },
        { code: '2: Inorder (root -> left)' },
        { code: '3: Write root -> data' },
        { code: '4: Inorder (root -> right)' },
      ]
    case "preorderTraversal":
      return [
        { code: '1: Follow step 2 to 4 until root != NULL' },
        { code: '2: Write root -> data' },
        { code: '3: Preorder (root -> left)' },
        { code: '4: Preorder (root -> right)' },
      ]
    case "postorderTraversal":
      return [
        { code: '1: Follow step 2 to 4 until root != NULL' },
        { code: '2: Postorder (root -> left)' },
        { code: '3: Postorder (root -> right)' },
        { code: '4: Write root -> data' },
      ]
    default:
      return []
  }
}