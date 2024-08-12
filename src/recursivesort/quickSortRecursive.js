let values = [];

export function quickSortRecursive(rects2){
    let rects = rects2.slice();
    values = [];
    let sz = rects2.length;
    // console.log( "fdsfsd",sz );
    sz = sz-1;
    quick(rects,0,sz);
    return values;
}


function getPartition(rects, left, right){
    values.push({
        left,
        right,
        swap:false,
        changedRange:true,
    })
    let pivot = rects[right].width
    let it = left-1;
    for(var j=left;j<=right-1;j++){
        if( rects[j].width< pivot){
            it++;
            if( it!==j ){
                // swap(rects[it],rects[j];
                const rect1 = {...rects[it]};
                const rect2 = {...rects[j]};
                rects[it] = rect2;
                rects[j] = rect1;
                values.push({
                    left:it,
                    right:j,
                    swap:true,
                    changedRange:false,
                })
            }
        }
    }
    if( it+1!==right ){
        const rect1 = {...rects[it+1]};
        const rect2 = {...rects[right]};
        rects[it+1] = rect2;
        rects[right] = rect1;
        values.push({
            left:it+1,
            right:right,
            swap:true,
            changedRange:false,
        })
    }
    return it+1;
}

// Algorithm steps for Merge Sort
export const quickSortSteps = [
    { code: "Step 1: Choose a pivot element from the array." },
    { code: "Step 2: Partition the array into two subarrays based on the pivot." },
    { code: "Step 3: Recursively apply Quick Sort on the left subarray." },
    { code: "Step 4: Recursively apply Quick Sort on the right subarray." },
    { code: "Step 5: Merge the sorted subarrays into a single sorted array." }
    // Add more steps if needed
];



function quick(rects,left,right){
    if( left>=right ) return ;
    const partition = getPartition(rects,left,right);
    quick(rects,left,partition-1);
    quick(rects,partition+1,right);
}