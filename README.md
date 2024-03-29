# AccessibleColor.design (view on [Github.io](https://oomphinc.github.io/colorcube/))
Previously known as “ColorCube” — A brand color palette accessibility checker. Renamed in 2022.

Made possible by the excellent [TinyColor](https://bgrins.github.io/TinyColor/) JS library.

## Table of Contents
- [Why](#why)
- [Local Setup](#local-setup)
- [Offline Mode](#offline-mode)
- [Contributing](#contributing)
- [Alternatives](#alternatives)
- [Team](#team)

## Why
Why create another color contrast tool? There are already [so many great tools](#alternatives) out in the wild!

True, but, all of the tools we have found deal with only one color at a time. We wanted a tool that could assist in evaluating an entire color palette, showing us common combinations (black and white) as well as which color pairs can be used together and which to avoid.

Additionally, we wanted this tool to adjust colors on the fly in order to achieve a passing grade. (Typically, you have to use another tool to change the color, like Photoshop or [HSLpicker.com](http://hslpicker.com).) With HSL (Hue Saturation Lightness) manipulation as part of the tool, colors can be darkened or lightened without effecting the “intent” of the color through its Hue.


## Local Setup
Very little! This project is (mostly) vanilla HTML/JS and some SASS.
1. To make HTML or JS edits, open the `index.html` in a browser and edit `assets/js/colorcube.js` in your editor of choice.
1. To compile SASS or make SCSS edits, use a local command from the project root: `$ sass --watch assets/scss:assets/css`

Need SASS? Download the latest build from [the SASS Lang page](https://sass-lang.com/install). We prefer Brew, if it matters, and version 3.7.4 minimum.


## Offline mode
This project uses [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (Progressive Web App) features to provide an app-like experience and to function when your device is offline.

If you are contributing to the project, you'll need to understand how to bypass this cache to see your changes and test your work with and without a network connection to ensure offline mode continues to provide a good experience.

1. Be sure to *update the static cache version* `staticCacheName` in the service worker file (`sw.js`) to force client-side
cache invalidation
1. Add new files to the `assets` array where it makes sense so they are available offline to return visitors


## Contributing
1. Take a look at our [issues list](https://github.com/oomphinc/colorcube/issues) or create an issue and describe your idea.
1. Open a new Pull Request
1. Profit! Or, you know, feel good about yourself for contributing to the community

## Alternatives: Other Great Tools that Provided Inspiration
- [ContrastGrid](https://contrast-grid.eightshapes.com) — A very useful tool for multiple color comparisons. Shows A LOT of information in a table format
- [Contrast Checker](http://contrastchecker.com) — Simple comparison of two colors. One of the nicest, cleanest interfaces
- [Contrast Finder](https://app.contrast-finder.org) — Provide two colors, but get back multiple possible shifts in the provided color to make a more accessible pair
- [Contrast Ratio](https://leaverou.github.io/contrast-ratio) — One of the earliest from Lea Verou (limited to two colors)
- [Snook’s Colour Contrast Check](https://snook.ca/technical/colour_contrast/colour.html) — Perhaps the earliest contrast tool from Snook (limited to two colors)


## Team
Initially created by [Kathy Beck](https://github.com/kbeck303), [Brandon Herford](https://github.com/BrandonDH), [Brian Hogue](https://github.com/syzygy333), and [J Hogue](https://github.com/jhogue) during Oomph Inc.'s Hack Day, May 2017. Maintained by the Oomph team. Rebranded and renamed in 2022 to move away from a similarly-named iOS puzzle game.
