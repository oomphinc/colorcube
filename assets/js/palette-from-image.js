/**
 *
 */
(function() {
  /**
   * Listen for a file upload and create a preview for it
   */
  const input = document.querySelector('#js-clr-f-img input');

  input.addEventListener('change', (evt) => {
    // remove any existing previews
    clearImagePreview();

    const preview = document.createElement('img');
    // prevent fatal if there hasn't been an upload.
    // This can happen if the file selection dialog is dismissed
    // without a selection made.
    if (evt.target.files.length < 1) {
      return;
    }

    preview.src = window.URL.createObjectURL(evt.target.files[0]);

    const container = document.querySelector('#js-clr-f-img-preview');
    // generate palette from image
    const colorThief = new ColorThief();
    let colors = [];
    preview.onload = (evt) => {
      colors = colorThief.getPalette(evt.target);

      // display thumbnail of uploaded image
      container.appendChild(preview);

      // take raw values and convert to rgb strings
      colors = colors.map((item) => {
        return 'rgb(' + item.join(',') + ')';
      });

      // push the palette to the application and submit
      displayPalette(colors);

      // display the derived palette from the image
      pushPaletteToApp(colors);
    };


  });

  /**
   * Display the output of ColorThief's getPalette() method.
   *
   * @param {Array} colors Multi-dimensional array of rgb values
   *
   */
  function displayPalette(colors) {
    const container = document.querySelector('#js-clr-f-img-derived');

    // iterate on color list and create swatch elements
    for (let i=0;i<colors.length;i++) {
      let swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.backgroundColor = colors[i];
      swatch.title = colors[i];
      container.appendChild(swatch);
    }
  }

  /**
   * Push generated palette to ColorCube app form and submit.
   *
   * @param {Array} colors
   */
  function pushPaletteToApp(colors) {
    // add to color list input and submit form (triggering palette history)
    const input = document.getElementById('brand-color-field');
    input.value = colors.join("\n");

    document.getElementById('brand-color-button').click();
  }

  /**
   * Removes any preview images and their preview palettes.
   */
  function clearImagePreview() {
    const imagePreview = document.querySelector('#js-clr-f-img-preview');
    if (imagePreview) {
      imagePreview.innerHTML = '';
    }

    const palettePreview = document.querySelector("#js-clr-f-img-derived");
    if (palettePreview) {
      palettePreview.innerHTML = '';
    }
  }

// function rgbToHex(r, g, b) = {
//   '#' +[r, g, b].map(x => {
//     const hex = x.toString(16;
//     return hex.length === 1 ? '0' + hex : hex;
//   }).join('')
// };

})();
