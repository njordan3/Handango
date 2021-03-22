const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path =require('path');
//import {TARGET_CLASSES} from './classes.js'
//require {}

TARGET_CLASSES = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "I",
  9: "J",
  10: "K",
  11: "L",
  12: "M",
  13: "N",
  14: "O",
  15: "P",
  16: "Q",
  17: "R",
  18: "S",
  19: "T",
  20: "U",
  21: "V",
  22: "W",
  23: "X",
  24: "Y",
  25: "Z"
};

console.log('test');
const run = async function () {
  if (process.argv.length < 3 ) {
    console.log('Pass an image to process. Format: \n');
    console.log('node predict.js /path/to/image.jpg');
  } else {
    // Grab image path value
    const imgpath = process.argv[2];

    imageFile = fs.readFileSync(imgpath);

    var tensor = tf.node.decodeImage(imageFile)
    .resizeNearestNeighbor([96,96])
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();



    // Assign model path to our model's directory
    const modelPath =  'file://./model/model.json';

    console.log('Loading model...');

    const model = await tf.loadLayersModel(modelPath);

    let predictions = await model.predict(tensor).data();
  	let top5 = Array.from(predictions)
  		.map(function (p, i) { // this is Array.map
  			return {
  				probability: p,
  				className: TARGET_CLASSES[i] // we are selecting the value from the obj
  			};
  		}).sort(function (a, b) {
  			return b.probability - a.probability;
  		}).slice(0, 2);


    	top5.forEach(function (p) {
          console.log(`${p.className}: ${p.probability.toFixed(6)}`);
    		});
  }
};

run();
