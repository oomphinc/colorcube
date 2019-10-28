# ColorCube (view on [Github.io](https://oomphinc.github.io/colorcube/))
Codename: ColorCube. A brand color palette accessibility checker.

Made possible by the excellent [TinyColor](https://bgrins.github.io/TinyColor/) JS library.

## Table of Contents
- [Why](#why)
- [Local Setup](#local-setup)
- [Contributing](#contributing)
- [Alternatives](#alternatives)
- [Team](#team)

## Why
Why another color contrast tool, you are asking? There are already [so many great tools](#alternatives) out in the wild! 

True, but, all of the tools we have found deal with only one color at a time. We wanted a tool that could assist in evaluating an entire color palette, showing us common combinations (black and white) as well as which color pairs can be used together and which to avoid. 

<!-- Additionally, we wanted this tool to adjust colors on the fly in order to achieve a passing grade. (Typically, you have to use another tool to change the color, like Photoshop or [HSLpicker.com](http://hslpicker.com/).) We allow the adjustment of the Saturation and/or the Brightness, but not the Hue. This way, the color intent is preserved but it is adjusted lighter or darker to pass a color contrast threshold. -->


## Local Setup
Very little! This project is vanilla HTML/JS and some SASS. 
1. To make HTML or JS edits, open the `index.html` in a browser and edit `assets/js/colorcube.js` in your editor of choice.
1. To compile SASS or make SCSS edits, use a local command from the project root: `$ sass --watch assets/scss:assets/css`

Need SASS? Download the latest build from [the SASS Lang page](https://sass-lang.com/install). We prefer Brew, if it matters, and version 3.7.4 minimum. 

## Contributing
1. Take a look at our [issues list](https://github.com/oomphinc/colorcube/issues) or create an issue and describe your idea.
1. Open a new Pull Request
1. Profit! Or, you know, feel good about yourself for contributing to the community

## Alternatives: Other Great Tools that Provided Inspiration
- [Contrast Checker](http://contrastchecker.com/)
- [Contrast Ratio](https://leaverou.github.io/contrast-ratio/)
- [Contrast Finder](https://app.contrast-finder.org)
- [Color Safe](http://colorsafe.co/)
- [SSB Bart Color Contrast Checker](http://www.ssbbartgroup.com/reference/color-contrast-checker/)
- [Snook's Colour Contrast Check](https://snook.ca/technical/colour_contrast/colour.html)

## Team
Initially created by [Kathy Beck](https://github.com/kbeck303), [Brandon Herford](https://github.com/BrandonDH), [Brian Hogue](https://github.com/syzygy333), and [J Hogue](https://github.com/jhogue) during Oomph Inc.'s Hack Day, May 2017.
