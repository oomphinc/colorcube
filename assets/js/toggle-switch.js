// Collect and store user color preferences but allow the user to change it with a toggle switch

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]'); // Set the toggle switch

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { // Check OS preferences and set things accordingly
  toggleSwitch.checked = true;
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
}
else {
  toggleSwitch.checked = false;
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', 'light');
}

function switchTheme(e) { // Let user switch the theme themselves regardless of settings or past page views
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

