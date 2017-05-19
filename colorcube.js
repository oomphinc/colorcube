// Two colors provide good color visibility if the brightness difference and the color difference between the two colors are greater than a set range.
// The range for color brightness difference is 125. The range for color difference is 500.

const WHITE  = tinycolor("white");
const BLACK  = tinycolor("black");
var colorArray = [];

var button = document.querySelector('#brand-color--button');
button.onclick = function(e) {
  e.preventDefault();
  // get the colors inputted by the user
  var stringInput = document.querySelector('#brand-color--field').value;
  // turn it into an array
  colorArray = stringInput.split("\n");
  // for each value in the array, change the element bg-color
  for (var i = 0; i < colorArray.length; i++) {
    // get the first container
    var div1 = document.getElementsByClassName('color-ratios--column color-ratios--brand-colors')[0];
    // append a div with the corresponding background color
    div1.innerHTML = div1.innerHTML + '<div class="color-ratios--swatch" style="background-color: ' + colorArray[i] + '"></div>';
    
    // get the color's contrast ratio compared to white
    var ratio = tinycolor.readability(colorArray[i], WHITE);
        ratio = Math.round(ratio * 10) / 10;
    
    // get the second container
    var div2 = document.getElementsByClassName('color-ratios--column color-ratios--on-white')[0];
    
    // check if the color is readable
    if ( tinycolor.isReadable(colorArray[i], WHITE) ) {
      // if it is, append a green div
      div2.innerHTML = div2.innerHTML + '<div class="color-ratios--swatch pass">' + ratio + '</div>';
    } else {
      // append a red div
      div2.innerHTML = div2.innerHTML + '<div class="color-ratios--swatch fail">' + ratio + '</div>';
    }
    
    // get the color's contrast ratio compared to black
    var ratio = tinycolor.readability(colorArray[i], BLACK);
        ratio = Math.round(ratio * 10) / 10;
    
    // get the third container
    var div3 = document.getElementsByClassName('color-ratios--column color-ratios--on-black')[0];
    
    // check if the color is readable
    if ( tinycolor.isReadable(colorArray[i], BLACK) ) {
      // if it is, append a green div
      div3.innerHTML = div3.innerHTML + '<div class="color-ratios--swatch pass">' + ratio + '</div>';
    } else {
      // append a red div
      div3.innerHTML = div3.innerHTML + '<div class="color-ratios--swatch fail">' + ratio + '</div>';
    }
  }
}
