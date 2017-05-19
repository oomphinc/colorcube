// Two colors provide good color visibility if the brightness difference and the color difference between the two colors are greater than a set range.
// The range for color brightness difference is 125. The range for color difference is 500.

const WHITE_LUMINANCE  = tinycolor("white").getLuminance();
const BLACK_LUMINANCE  = tinycolor("black").getLuminance();

// To do: get the colors inputted by the user

var color = tinycolor("DA2442");
document.getElementsByClassName("color")[0].innerHTML = color;
document.getElementsByClassName("color")[0].style.color = color;

// given color's luminance
var luminance  = color.getLuminance();
document.getElementsByClassName("luminance")[0].innerHTML = 'Luminance = ' + luminance;

// ratio of chosen color's luminance to white
whiteRatio = (WHITE_LUMINANCE + .05) / (luminance + .05);

document.getElementsByClassName("on-white")[0].innerHTML = 'On white = ' + whiteRatio;
if( whiteRatio > 4.5 ) {
  document.getElementsByClassName("on-white")[0].style.color = 'green';
} else {
  document.getElementsByClassName("on-white")[0].style.color = 'red';
}