const tf = require('@tensorflow/tfjs-node');
const Jimp = require('jimp');
const {Image, createCanvas} = require('canvas');

//require('@tensorflow/tfjs-node-gpu')

//let model;
//let modelLoaded = false;
/*
async loadModel() {
  console.log("Loading model!!!");

  model = await tf.loadGraphModel
};
*/


console.log('test');
const run = async function () {
  if (process.argv.length < 3 ) {
    console.log('Pass an image to process. Format: \n');
    console.log('node predict.js /path/to/image.jpg');
  } else {
    // Grab image path value
    const imgpath = process.argv[2];
    // Assign model path to our model's directory
    const modelPath =  'file://./model/model.json';

    console.log('Loading model...');

    const model = await tf.loadGraphModel(modelPath);
    //Image creation
    const width = 300;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      console.log("image loaded.");

      ctx.drawImage(img, 0, 0, width, height);

      // classify
      model.predict(canvas).then(function (predictions) {
        // Classify the image
        console.log('Predictions: ', predictions)
      })
    }
    img.onerror = err => { throw err }
    //img.src = 'jenna.jpg';
    img.src = imgpath
    //tf.browser.fromPixels(img);


    console.log('Loading model...');

  //  const model = await tf.loadGraphModel(modelPath);
//    model.predict();

    console.log('Running prediction');


  }
};

run();
