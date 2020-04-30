// Collect and store user color preferences but allow the user to change it with a toggle switch

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]'); // Set the toggle switch
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null; // Check for local storage theme

if (currentTheme) { // If local storage theme exists, use that
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}
else { // If no local storage settings exist
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { // Check OS preferences
    toggleSwitch.checked = true; // Let's just set the toggle switch.  We don't need to store anything until the user has made a change
  }
  else {
    toggleSwitch.checked = false; // this may not be necessary
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

