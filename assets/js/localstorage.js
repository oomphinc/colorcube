// populate history right away
loadHistory();

const actionButton = document.getElementById('brand-color-button');
console.log(actionButton);
actionButton.addEventListener('click', function() {
    // add contents of the text entry to local storage
    let userInput = document.getElementById('brand-color-field').value;
    // todo: check if local storage available
    // todo: add logic to prevent adding empty values to storage

    // Retrieve local storage or default to empty array
    let storage = JSON.parse(localStorage.getItem('palettes'));
    if (storage) {
        storage.push(userInput);
    }
    else {
        storage = [userInput];
    }

    console.log(storage);
    // add our item to it and store back to local storage
    localStorage.setItem('palettes', JSON.stringify(storage));

    // Update our history section
    let itemsAsArray = extractValues(userInput);
    let markup = createPaletteFromValues(itemsAsArray);
    console.log(itemsAsArray);
    updateHistory(markup);
});

/**
 * Event listener to clear local storage.
 */
document.getElementById('clear-history').addEventListener('click', () => {
    clearHistory();
});

/**
 * Used for initial population from localStorage.
 */
function loadHistory() {
    // todo: hide the palette history if local storage is not available
    const storedPalettes = JSON.parse(localStorage.getItem('palettes'));
    if (storedPalettes && storedPalettes.length > 0) {
        let markup = '';
        storedPalettes.map(palette => {
            let values = extractValues(palette);
            markup = createPaletteFromValues(values);
            updateHistory(markup);
        });
    }
}

// Update the input history content
function updateHistory(markup) {
    const historySection = document.getElementById('input-history');
    // let palette = document.createElement('div');
    // let paletteHistory = localStorage.getItem('items');
    // let newContent = document.createTextNode(paletteHistory);
    // palette.appendChild(newContent);
    historySection.appendChild(markup);

    // historySection.appendChild(palette);
}

/**
 * Creates markup for a single palette.
 * @param items
 */
function createPaletteFromValues(items) {
    if (Array.isArray(items) === false) {
        return;
    }

    // create wrapper for this set
    let element = document.createElement('div');
    element.className = 'palette-set';

    // create each color swatch and add to the set
    // todo: replace this for with a different loop structure
    for (let i=0;i<items.length;i++) {
        let swatch = document.createElement('span');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = items[i];
        swatch.title = items[i];
        swatch.style.height = '10px';
        swatch.style.width = '10px';
        swatch.style.display = 'inline-block';
        element.appendChild(swatch);
        // todo: add copy-to-clipboard-link
    }
    console.log(element);
    return element;
}

// todo: This should be triggered by a button/link to clear out local storage
function clearHistory () {
    localStorage.removeItem('palettes');
    // remove the palettes from the page
    let palettes = document.getElementsByClassName('swatch');
    while (palettes[0]) {
        palettes[0].parentNode.removeChild(palettes[0]);
    }

}

/**
 * Extract separate color values from input.
 *
 * @param stringInput
 *
 * @return
 */
function extractValues(stringInput) {
    // todo: validation and error handling
    let itemArray = stringInput.split('\n');

    return itemArray;
}

/**
 * Check if local storage is supported by client browser
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 */
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}


