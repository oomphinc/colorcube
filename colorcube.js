// Two colors provide good color visibility if the brightness difference and the color difference between the two colors are greater than a set range.
// The range for color brightness difference is 125. The range for color difference is 500.

const WHITE  = tinycolor("white");
const BLACK  = tinycolor("black");

// To do: get the colors inputted by the user

var color = tinycolor("DA2442");
document.getElementsByClassName("color")[0].innerHTML = color;
document.getElementsByClassName("color")[0].style.color = color;

// given color's luminance/readability on white
var luminance = tinycolor.readability(color, WHITE);
document.getElementsByClassName("on-white")[0].innerHTML = 'On white = ' + luminance;

// is it readable/is the ratio good?
var readable = tinycolor.isReadable(color, WHITE);
if( readable ) {
  document.getElementsByClassName("on-white")[0].style.color = 'green';
} else {
  document.getElementsByClassName("on-white")[0].style.color = 'red';
}

// given color's luminance/readability on black
var luminance = tinycolor.readability(color, BLACK);
document.getElementsByClassName("on-black")[0].innerHTML = 'On black = ' + luminance;

// is it readable/is the ratio good?
var readable = tinycolor.isReadable(color, BLACK);
if( readable ) {
  document.getElementsByClassName("on-black")[0].style.color = 'green';
} else {
  document.getElementsByClassName("on-black")[0].style.color = 'red';
}