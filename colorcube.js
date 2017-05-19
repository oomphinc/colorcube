const WHITE  = tinycolor("#ffffff");
const BLACK  = tinycolor("#000000");
const AARATIO = 4.5;
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
    var ratio     = tinycolor.readability(colorArray[i], WHITE);
        ratio     = Math.round(ratio * 10) / 10;
    
    // get the second container
    var div2 = document.getElementsByClassName('color-ratios--column color-ratios--on-white')[0];
    
    // how readable is it?
    if ( ratio > (AARATIO + 0.5) ) {
      // if it passes by more than .5, append a green div
      div2.innerHTML = div2.innerHTML + '<div class="color-ratios--swatch pass">' + ratio + '</div>';
    } else if ( ratio < (AARATIO + 0.5) && ratio > AARATIO ) {
      // if it barely passes, append a yellow div
      div2.innerHTML = div2.innerHTML + '<div class="color-ratios--swatch edge">' + ratio + '</div>';
    } else {
      // if it fails by more than .5, append a red div
      div2.innerHTML = div2.innerHTML + '<div class="color-ratios--swatch fail">' + ratio + '</div>';
    }
    
    // get the color's contrast ratio compared to black
    var ratio = tinycolor.readability(colorArray[i], BLACK);
        ratio = Math.round(ratio * 10) / 10;
    
    // get the third container
    var div3 = document.getElementsByClassName('color-ratios--column color-ratios--on-black')[0];
    
    // how readable is it?
    if ( ratio > (AARATIO + 0.5) ) {
      // if it passes by more than .5, append a green div
      div3.innerHTML = div3.innerHTML + '<div class="color-ratios--swatch pass">' + ratio + '</div>';
    } else if ( ratio < (AARATIO + 0.5) && ratio > AARATIO ) {
      // if it barely passes, append a yellow div
      div3.innerHTML = div3.innerHTML + '<div class="color-ratios--swatch edge">' + ratio + '</div>';
    } else {
      // if it fails by more than .5, append a red div
      div3.innerHTML = div3.innerHTML + '<div class="color-ratios--swatch fail">' + ratio + '</div>';
    }
    
    // what's most readable with the current color?
    var bestPick = tinycolor.mostReadable(colorArray[i], colorArray);
    // get the color's contrast ratio compared to white
    var ratio     = tinycolor.readability(bestPick['_originalInput'], colorArray[i]);
        ratio     = Math.round(ratio * 10) / 10;
    // get the fourth container
    var div4 = document.getElementsByClassName('color-ratios--column color-ratios--most-legible')[0];
    // append a div with the corresponding background color
    div4.innerHTML = div4.innerHTML + '<div class="color-ratios--swatch most-legible" style="background-color: ' + bestPick['_originalInput'] + '; color: ' + colorArray[i] + '">' + bestPick['_originalInput'] + ' Ratio = ' + ratio + '</div>';
  }
}
