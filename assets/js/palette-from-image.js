/**
 * Listen for a file upload and create a preview for it
 */
const input = document.querySelector('.image-upload input');

input.addEventListener('change', (evt) => {
  console.log(evt);
  const preview = document.createElement('img');
  // prevent fatal if there hasn't been an upload.
  // This can happen if the file selection dialog is dismissed
  // without a selection made.
  if (evt.target.files.length < 1) {
    return;
  }

  preview.src = window.URL.createObjectURL(evt.target.files[0]);
  preview.width = 250;

  const container = document.querySelector('.image-preview');
  // generate palette from image
  const colorThief = new ColorThief();
  let colors = [];
  preview.onload = (evt) => {
    colors = colorThief.getPalette(evt.target);

    console.log('colors from onload:', colors);
    container.appendChild(preview);

    displayPalette(colors);
    console.log('color', colors);
  };


});

/**
 * Display the output of ColorThief's getPalette() method.
 *
 * @param {Array} colors Multi-dimensional array of rgb values
 *
 */
function displayPalette(colors) {
  const container = document.querySelector('.image-upload .derived-palette');

  // convert that nested array of rgb to a rgb color string
  colors = colors.map((item) => {
    return 'rgb(' + item.join(',') + ')';
  });

  // push this into the user input form
  // const colorList = onePerLine(colors);
  // add to color list input and submit form (triggering palette history)
  const input = document.getElementById('brand-color-field');
  input.value = colors.join("\n");

  // todo: hey this function lives in another file!
  // colors = onePerLine(colors);

  document.getElementById('brand-color-button').click();

}

// function rgbToHex(r, g, b) = {
//   '#' +[r, g, b].map(x => {
//     const hex = x.toString(16;
//     return hex.length === 1 ? '0' + hex : hex;
//   }).join('')
// };
