# Digit-Inator
The Digit-Inator allows you to convert your favorite hand drawn digit to text with the latest and greatest in computer vision.

## Installation
1. Install [npm](https://www.npmjs.com/get-npm)
2. Install [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) 

:exclamation::exclamation:
`This project was constructed using Nodejs and React. Thus, in order for us to integrate this project with our flask application we had to build the project and compile it into HTML, CSS and JS. Below are the following instructions that were used to compile our project such that the browser can read it.`

1. Clone the repository using git: `git clone https://github.com/RodneyMcQuain/Digit-Inator`
2. Change the directory: `cd Digit-Inator`
3. Install all the packages: `yarn`
4. Generate production build: `yarn build`

# Understanding the flask code structure

1. Majority of the app resides in the `src/static/digitinator`.
2. The `src/digitinator/css` folder inside the contains the styling for the whole app.
3. The `src/digitinator/model` folder contains the CNN model that is created after following the instructions in `digitinator_model_build.md`. 
4. The `src/digitinator/media` folder contains background image, svg file for the pencil that shows up on the canvas to draw, and the favicon of the app.
5. The `src/digitinator/chunks` folder contains all the javascript code.
5. The `src/digitinator/sw.js` is a service worker file. A service worker is a script that your browser runs in the background, separate from a web page, opening the door to features that don't need a webpage or user interaction.
