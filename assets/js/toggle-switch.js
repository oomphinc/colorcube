// Collect and store user color preferences but allow the user to change it with a toggle switch

const toggleSwitch = document.querySelector('#js-theme-toggle input[type="checkbox"]'); // Set the toggle switch
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null; // Check for local storage theme

if (currentTheme) { // If local storage theme exists, use that
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'light') {
        toggleSwitch.checked = false;
    }
    if (currentTheme === 'dark') {
      toggleSwitch.checked = true;
    }
}
// If we found a current theme of "light" or "dark", we're using that.  Otherwise...
else { //  ...we'll look to the OS
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) { // Check for "light"
    toggleSwitch.checked = false; // Let's just set the toggle switch.  We don't need to store anything until the user has made a change
    document.documentElement.setAttribute('data-theme', 'light'); // but perhaps still set the data theme
  }
  else {
    toggleSwitch.checked = true; // may not be necessary, just showing that the default would be "true" which gives us dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function switchTheme(e) { // Let user switch the theme themselves regardless of settings or past page views, and store that preference
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}

toggleSwitch.addEventListener('change', switchTheme, false); // Watch for user changes to the toggle switch
