
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const TRAIN_IMAGES_DIR = './data/train';
const TEST_IMAGES_DIR = './data/test';

function loadImages(dataDir) {
  const images = [];
  const labels = [];


  var files = fs.readdirSync(dataDir);

  for (let i = 0; i < files.length; i++) {
    if (!files[i].toLocaleLowerCase().endsWith(".jpg")) {
      console.log('Got file?');
      continue;
    }


    // if (files[i].toLocaleLowerCase().startsWith("A1")) {
    //   labels.push(0);
    // } else if (files[i].toLocaleLowerCase().startsWith("B1")) {
    //   labels.push(1);
    // }


    var filePath = path.join(dataDir, files[i]);

    var buffer = fs.readFileSync(filePath);

    var imageTensor = tf.node.decodeImage(buffer)
     .resizeNearestNeighbor([96,96])
     .toFloat()
     .div(tf.scalar(255.0))
     .expandDims();


    images.push(imageTensor);


    // if (files[i].toLocaleLowerCase().startsWith("hello")) {
    //   labels.push(0);
    // } else if (files[i].toLocaleLowerCase().startsWith("thanks")) {
    //   labels.push(1);
    // }
    if (files[i].toLocaleLowerCase().startsWith("a1")) {
      labels.push(0);
    } else if (files[i].toLocaleLowerCase().startsWith("b1")) {
      labels.push(1);
    } else if (files[i].toLocaleLowerCase().startsWith("c1")) {
      labels.push(2);
    } else if (files[i].toLocaleLowerCase().startsWith("d1")) {
      labels.push(3);
    }
  }
    return [images, labels];
}

class AslDataset {
  constructor() {
    this.trainData = [];
    this.testData = [];
  }



  loadData() {
    console.log('Loading train images...');
    this.trainData = loadImages(TRAIN_IMAGES_DIR);
    console.log('Loading test images...');
    this.testData = loadImages(TEST_IMAGES_DIR);
    console.log('Images loaded successfully');
  }


  getTrainData() {
    return {
      images: tf.concat(this.trainData[0]),
      labels: tf.oneHot(tf.tensor1d(this.trainData[1], 'int32'), 2).toFloat()
    }
  }


  getTestData() {
    return {
      images: tf.concat(this.testData[0]),
      labels: tf.oneHot(tf.tensor1d(this.testData[1], 'int32'), 2).toFloat()
    }
  }
}

module.exports = new AslDataset();
