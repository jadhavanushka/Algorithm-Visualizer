// sortingalgorithms.js

export function bubbleSort2(rects) {
    const pairs = [];
    const num = rects.length;
    const prevRect = rects.slice();

    for (let i = 0; i < num; i++) {
        for (let j = i + 1; j < num; j++) {
            if (prevRect[i].width > prevRect[j].width) {
                const recti = { ...prevRect[i] };
                const rectj = { ...prevRect[j] };
                prevRect[j] = recti;
                prevRect[i] = rectj;
                pairs.push({
                    xx: i,
                    yy: j,
                    changed: true
                });
            } else {
                pairs.push({
                    xx: i,
                    yy: j,
                    changed: false
                });
            }
            if (j === num - 1) {
                pairs.push({
                    xx: i,
                    yy: i,
                    changed: false
                });
            }
        }
    }
    return pairs;
}

export function selectionSort(arr) {
    const pairs = [];
    let n = arr.length;
    const prevRect = arr.slice();

    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            pairs.push({
                xx: min_idx,
                yy: j,
                changed: false
            });
            if (prevRect[j].width < prevRect[min_idx].width) {
                min_idx = j;
            }
        }

        const recti = { ...prevRect[i] };
        const rectj = { ...prevRect[min_idx] };
        prevRect[min_idx] = recti;
        prevRect[i] = rectj;
        pairs.push({
            xx: min_idx,
            yy: i,
            changed: true
        });
        pairs.push({
            xx: i,
            yy: i,
            changed: false
        });
    }
    pairs.push({
        xx: n - 1,
        yy: n - 1,
        changed: false
    });
    return pairs;
}

export function bubbleSort(arr) {
    const pairs = [];
    let n = arr.length;
    const prevRect = arr.slice();

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (prevRect[j].width > prevRect[j + 1].width) {
                const recti = { ...prevRect[j] };
                const rectj = { ...prevRect[j + 1] };
                prevRect[j + 1] = recti;
                prevRect[j] = rectj;
                pairs.push({
                    xx: j,
                    yy: j + 1,
                    changed: true
                });
            } else {
                pairs.push({
                    xx: j,
                    yy: j + 1,
                    changed: false
                });
            }
            if (j === n - i - 2) {
                pairs.push({
                    xx: n - i - 1,
                    yy: n - i - 1,
                    changed: false
                });
            }
        }
    }
    pairs.push({
        xx: 0,
        yy: 0,
        changed: false
    });
    return pairs;
}

export function insertionSort(arr) {
    const pairs = [];
    let n = arr.length;
    const prevRect = arr.slice();

    for (let i = 1; i < n; ++i) {
        let key = prevRect[i].width;
        let j = i - 1;

        while (j >= 0 && prevRect[j].width > key) {
            const recti = { ...prevRect[j] };
            const rectj = { ...prevRect[j + 1] };
            prevRect[j + 1] = recti;
            prevRect[j] = rectj;
            pairs.push({
                xx: j,
                yy: j + 1,
                changed: true
            });
            j = j - 1;
        }
    }
    for (let i = 0; i < n; i++) {
        pairs.push({
            xx: i,
            yy: i,
            changed: true
        });
    }
    return pairs;
}

// sortingSteps.js

export const bubbleSortSteps = [
    { code: "Step 1: Compare adjacent elements in the array." },
    { code: "Step 2: If the first element is greater than the second element, swap them." },
    { code: "Step 3: Repeat steps 1 and 2 until no swaps are needed." },
    { code: "Step 4: Move to the next pair of elements and repeat steps 1-3." },
    { code: "Step 5: Continue this process until the entire array is sorted." },
    { code: "Step 6: The array is now sorted." }
];


export const selectionSortSteps = [
    { code: "Step 1: Find the smallest element in the unsorted portion of the array." },
    { code: "Step 2: Swap it with the first element of the unsorted portion." },
    { code: "Step 3: Repeat steps 1 and 2 for the remaining unsorted elements." },
    { code: "Step 4: Move the boundary of the unsorted portion by one element." },
    { code: "Step 5: Repeat steps 1-4 until the entire array is sorted." },
    { code: "Step 6: The array is now sorted." }
];


export const insertionSortSteps = [
    { code: "Step 1: Start with the second element and compare it with the elements before it." },
    { code: "Step 2: If the current element is smaller, move the larger elements one position to the right." },
    { code: "Step 3: Insert the current element into its correct position in the sorted subarray." },
    { code: "Step 4: Repeat steps 1-3 until all elements are sorted." },
    { code: "Step 5: The array is now sorted." }
];

