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
    var output = getRangeTransformedValue(input, VALUE_MIN, VALUE_MAX, VISUALIZER_RANGE_MIN, VISUALIZER_RANGE_MAX);
    return output;
}