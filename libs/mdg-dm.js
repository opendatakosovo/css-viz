// Calculate how many unit A and unit B should be in the matrix.
// Calculate for every year in the dataset.
// Resulting matrix is pushed in the matrices array.
// 
// A matrix has n units.
// Each unit is represent by a size 2 array:
// [0,0] = No unit-A nor unit-B in that unit.
// [1,0] = A unit-A but no unit-B in that unit.
// [0,1] = A unit-B but no unit-A in that unit.
// [1,1] = A unit-A and a unit-B in that unit.
//
// e.g.: matrix:
// matrix = [
//      [1,1][0,1][0,0],
//      [0,0][0,0][0,0],
//      [0,0][0,0][0,0],
//      [0,0][0,0][0,0],
//  ]
function buildDataMatrix(getUnitACount, getUnitBCount){

    var matrices = [];

    for(var i = 0; i < Object.keys(DATASET).length; i++){
        var unitACount = getUnitACount(DATASET[Object.keys(DATASET)[i]]['unitA']);
        var unitBCount = getUnitBCount(DATASET[Object.keys(DATASET)[i]]['unitB']);

        var matrix = [];
        for(var unitIndex = 0; unitIndex < VISUALIZER_RANGE_MAX; unitIndex++){

            // Unit has unit-A and unit-B.
            if(unitIndex < unitACount && unitIndex < unitBCount){
                matrix.push([1, 1]);
            }
            // Unit only has unit-A.
            else if(unitIndex < unitACount && unitIndex >= unitBCount){
                matrix.push([1, 0]);
            }
            // Unit only has a unit-B.
            else if(unitIndex >= unitACount && unitIndex < unitBCount){
                matrix.push([0, 1]);
            }
            // Unit doesn't have unit-A nor unit-B.
            else{
                matrix.push([0, 0]);
            }
        }

        // Each year we have a different matrix.
        // Each matrix in this array is a matrix for a given year.
        matrices.push(matrix);
    }

    return matrices;

}

// Draw the data.
// Read from the matrix.
function draw(year){
    
    // Get the year index by substract by the first year of the dataset
    var yearIndex = year - parseInt(Object.keys(DATASET)[0]);

    // Travel through each unit of the matrix.
    // For each unit, check if there is a unit-A and/or a unit-B.
    $.each($('.cell'), function(index, desk) {
        var unit = matrices[yearIndex][index];
        var cellIndex = index + 1;

        // If unit has unit-A, draw unit-A.
        if(unit[0] == 1 && !$('.unit-a-' + cellIndex).hasClass('unit-a-present')){
            $('.unit-a-' + cellIndex).addClass('unit-a-present');
        }

        // If desk doesn't have unit-A,
        // make unit-A disappear
        else if(unit[0] == 0 && $('.unit-a-' + cellIndex).hasClass('unit-a-present')){
            $('.unit-a-' + cellIndex).removeClass('unit-a-present');
        }

        // If desk has unit-B, draw unit-B.
        if(unit[1] == 1 && !$('.unit-b-' + cellIndex).hasClass('unit-b-present')){
            $('.unit-b-' + cellIndex).addClass('unit-b-present');      
        }

        // If desk doesn't have unit-B,
        // make unit-B disappear.
        else if (unit[1] == 0 && $('.unit-b-' + cellIndex).hasClass('unit-b-present')) {
            $('.unit-b-' + cellIndex).removeClass('unit-b-present');
        }
    });
}
