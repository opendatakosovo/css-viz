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

function draw(value, fillCell, emptyCell, initFunc){
    // Fire init function, if defined
    if(initFunc != null){
        initFunc();
    }

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
	
	// Get fill/empty values based on incrementalFill parameter
	if(incrementalFill) {
		changeInCellCount = nextFilledCellCount - previouslyFilledCellCount;
		if(changeInCellCount >= 0) {
			cellsToFillCount = changeInCellCount;
			cellsToEmptyCount = 0;
		}
		else {
			cellsToFillCount = 0;
			cellsToEmptyCount = Math.abs(changeInCellCount);
		}	
	}
	// If not incremental fill, refresh all cells
	else {
		cellsToFillCount = nextFilledCellCount;
		cellsToEmptyCount = previouslyFilledCellCount;
	}
	
    // Emptying previously filled cells.
    if(cellsToEmptyCount > 0){
        // From the total filled cells, remove cells that should be emptied.
        cellsToEmpty = _.sample(totalFilledCells, cellsToEmptyCount);
        totalFilledCells = _.difference(totalFilledCells, cellsToEmpty);

        for(var i = 0; i < cellsToEmpty.length; i++){
            cell = $('.cell-' + cellsToEmpty[i]);

            emptyCellFunc(cell);                            

            totalEmptyCells.push(cellsToEmpty[i]);
        }   
    }

    // Filling new cells
    if(cellsToFillCount > 0){
        // Build an array with the indices of all cells that are to be filled.
        cellsToFill = _.sample(totalEmptyCells, cellsToFillCount);
        totalEmptyCells = _.difference(totalEmptyCells, cellsToFill);

        for(var i = 0; i < cellsToFill.length; i++){
            cell = $('.cell-' + cellsToFill[i]);

            fillCellFunc(cell);
            
            totalFilledCells.push(cellsToFill[i]);
        }

    }

    previouslyFilledCellCount = nextFilledCellCount;
}

function registerYearSelectionListeners(fillCell, emptyCell, initFunc, isPercentage){
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

            $('#value').empty();
            if (isPercentage) {
                $('#value').text(nextYearValue + "%");
            } else {
                $('#value').text(nextYearValue);
            }
            draw(nextYearValue, fillCell, emptyCell, initFunc);
        });
    }
}