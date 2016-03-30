// For drawing in random selected cells.
var totalFilledCells = [];
var totalEmptyCells = []

var previouslyFilledCellCount = 0;
var cellsToFill = [];
var cellsToEmpty = [];

// Init cells, all empty. Again, for random selected cells.
for (var i = 0; i < VISUALIZER_RANGE_MAX; i++) {
    totalEmptyCells.push(i + 1);
}

function draw(value, fillCell, emptyCell, initFunc) {
    // Fire init function, if defined
    if (initFunc != null) {
        initFunc();
    }

    if (DRAW_RANDOMLY) {
        drawRandomly(value, fillCell, emptyCell);
    } else {
        drawInOrder(value);
    }
}

function drawInOrder(value, fillCell, emptyCell) {
    var cellCount = getNumbersOfCellsToFill(value);

    $.each($('.cell'), function (index, trees) {

        if (cellCount >= 1) {
            fillCell($(trees));
        } else {
            emptyCell($(trees));
        }

        cellCount = cellCount - 1;
    });
}


function drawRandomly(value, fillCellFunc, emptyCellFunc) {

    var nextFilledCellCount = getNumbersOfCellsToFill(value);

    // Get fill/empty values based on incrementalFill parameter
    if (incrementalFill) {
        changeInCellCount = nextFilledCellCount - previouslyFilledCellCount;
        if (changeInCellCount >= 0) {
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
    if (cellsToEmptyCount > 0) {
        // From the total filled cells, remove cells that should be emptied.
        cellsToEmpty = _.sample(totalFilledCells, cellsToEmptyCount);
        totalFilledCells = _.difference(totalFilledCells, cellsToEmpty);

        for (var i = 0; i < cellsToEmpty.length; i++) {
            cell = $('.cell-' + cellsToEmpty[i]);

            emptyCellFunc(cell);

            totalEmptyCells.push(cellsToEmpty[i]);
        }
    }

    // Filling new cells
    if (cellsToFillCount > 0) {
        // Build an array with the indices of all cells that are to be filled.
        cellsToFill = _.sample(totalEmptyCells, cellsToFillCount);
        totalEmptyCells = _.difference(totalEmptyCells, cellsToFill);

        for (var i = 0; i < cellsToFill.length; i++) {
            cell = $('.cell-' + cellsToFill[i]);

            fillCellFunc(cell);

            totalFilledCells.push(cellsToFill[i]);
        }

    }

    previouslyFilledCellCount = nextFilledCellCount;
}

function timedLoop(i, time) {
	setTimeout(function(x) {
	    var years = $('.btn-year');
		var max_i = years.length;
		var btn_class = $(years[i]).attr("class").match(/btn-[0-9]{4}/)[0];
		
		//Advance loop
		i = i + 1
		if (i <= max_i && !clicked) {
			$("." + btn_class).click();
			timedLoop(i, time);
		}
	}, time);
};

Number.prototype.formatNumber = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

function registerYearSelectionListeners(fillCell, emptyCell, initFunc, isPercentage, invertValues, formatter) {
    // Register year selection button listeners.
    for (var y = 0; y < $('.btn-year').length; y++) {
        $($('.btn-year')[y]).click(function () {

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

            //Invert Values
            if (invertValues == 1) {
                TextValue = Number(100 - nextYearValue).toFixed(1);
            } else {
                if (formatter) {
                    TextValue = nextYearValue.formatNumber(0, ".", ",") + " ha";
                } else {
                    TextValue = nextYearValue.formatNumber(1, ".", ",");
                }
            }

            var year_text = $(this).text().trim()
            if (year_text.indexOf("*") > -1) {
                $("#extrapolated-data").css("display", "block");
            } else {
                $("#extrapolated-data").css("display", "none");
            }
            //console.log($(this).text().trim());
            // Update Text
            $('#value').empty();
            if (isPercentage) {
                $('#value').text(TextValue + "%");
            } else {
                $('#value').text(TextValue);
            }

            // Update Cells
            draw(nextYearValue, fillCell, emptyCell, initFunc);
        });
    }
}