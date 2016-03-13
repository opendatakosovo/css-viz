// For drawing in random selected cells.
var totalFilledCells = [];
var totalEmptyCells = []

var previouslyFilledCellCount = 0;
var cellsToFill = [];
var cellsToEmpty = [];

// Init cells, all empty. Again, for random selected cells.
for(var i = 0; i < VISUALIZER_RANGE_MAX; i++){
    totalEmptyCells.push(i+1);
}

function draw(value, fillCell, emptyCell){
    if(DRAW_RANDOMLY){
        drawRandomly(value, fillCell, emptyCell);
    }else{
        drawInOrder(value);
    }
}

function drawInOrder(value, fillCell, emptyCell){
    var cellCount = getNumbersOfCellsToFill(value);

    $.each($('.cell'), function(index, trees) {

        if(cellCount >= 1){  
            fillCell($(trees));
        }else{
            emptyCell($(trees));
        }

        cellCount = cellCount - 1;
    });
}


function drawRandomly(value, fillCellFunc, emptyCellFunc){

    var nextFilledCellCount = getNumbersOfCellsToFill(value);
    
    var currentCellCount = nextFilledCellCount - previouslyFilledCellCount;

    // Filling empty cells.
    if(currentCellCount > 0){
        // Build an array with the indices of all cells that are to be filled.
        cellsToFill = _.sample(totalEmptyCells, currentCellCount);
        totalEmptyCells = _.difference(totalEmptyCells, cellsToFill);

        for(var i = 0; i < cellsToFill.length; i++){
            cell = $('.cell-' + cellsToFill[i]);

            fillCellFunc(cell);
            
            totalFilledCells.push(cellsToFill[i]);
        }

    }
    // Emptying previously filled cells.
    else if(currentCellCount < 0){
        // From the total filled cells, remove cells that should be emptied.
        cellsToEmpty = _.sample(totalFilledCells, Math.abs(currentCellCount));
        totalFilledCells = _.difference(totalFilledCells, cellsToEmpty);

        for(var i = 0; i < cellsToEmpty.length; i++){
            cell = $('.cell-' + cellsToEmpty[i]);

            emptyCellFunc(cell);                            

            totalEmptyCells.push(cellsToEmpty[i]);
        }   
    }

    previouslyFilledCellCount = nextFilledCellCount;
}

function registerYearSelectionListeners(fillCell, emptyCell){
    // Register year selection button listeners.
    for(var y=0; y < $('.btn-year').length; y++){
        $($('.btn-year')[y]).click(function() {

            // Get previous year we just moved away from:
            var btnPreviousYearClass = $('.btn-primary').attr("class").match(/btn-[0-9]{4}/);
            var previousYear = btnPreviousYearClass[0].split('-')[1];

            // Update button style state for feedback
            $('.btn-primary').addClass('btn-default');
            $('.btn-primary').removeClass('btn-primary');
            $(this).removeClass('btn-default');
            $(this).addClass('btn-primary');

            // Update visualization
            var btnNextYearClass = $(this).attr("class").match(/btn-[0-9]{4}/);
            var nextYear = btnNextYearClass[0].split('-')[1];
            var nextYearValue = DATASET[nextYear];

            draw(nextYearValue, fillCell, emptyCell);
        });
    }
}

/**
We need to transform the value from the original value range into
a value within a much smaller range.

The smaller range is the range of units that can fit in the
visualizer that is being built

Use the following formula:
 
input = Original value input.
oMin = Min value in the original range of possible value inputs.
oMax = Max value in the original range of possible value inputs.
nMin = Min value in the new range of posssible values.
nMax = Max value in the new range of posssible values.
ouput = New value output.

output = (input - oMin) * (nMax - nMin) / (oMax - oMin) + nMin

**/
function getRangeTransformedValue(input, oMin, oMax, nMin, nMax){
    var output = (input - oMin) * (nMax - nMin) / (oMax - oMin) + nMin;
    return Math.round(output);
}

// Get how many trees should be represented in the visualizer based on given input value.
function getNumbersOfCellsToFill(input){
    return getRangeTransformedValue(input, VALUE_MIN, VALUE_MAX, VISUALIZER_RANGE_MIN, VISUALIZER_RANGE_MAX);
}