
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


    if (files[i].toLocaleLowerCase().startsWith("a1")) {
      labels.push(0);
    } else if (files[i].toLocaleLowerCase().startsWith("b1")) {
      labels.push(1);
    } else if (files[i].toLocaleLowerCase().startsWith("c1")) {
      labels.push(2);
    } else if (files[i].toLocaleLowerCase().startsWith("d1")) {
      labels.push(3);
    } else if (files[i].toLocaleLowerCase().startsWith("e1")) {
      labels.push(4);
    } else if (files[i].toLocaleLowerCase().startsWith("f1")) {
      labels.push(5);
    } else if (files[i].toLocaleLowerCase().startsWith("g1")) {
      labels.push(6);
    } else if (files[i].toLocaleLowerCase().startsWith("h1")) {
      labels.push(7);
    } else if (files[i].toLocaleLowerCase().startsWith("i1")) {
      labels.push(8);
    } else if (files[i].toLocaleLowerCase().startsWith("j1")) {
      labels.push(9);
    } else if (files[i].toLocaleLowerCase().startsWith("k1")) {
      labels.push(10);
    } else if (files[i].toLocaleLowerCase().startsWith("l1")) {
      labels.push(11);
    } else if (files[i].toLocaleLowerCase().startsWith("m1")) {
      labels.push(12);
    } else if (files[i].toLocaleLowerCase().startsWith("n1")) {
      labels.push(13);
    } else if (files[i].toLocaleLowerCase().startsWith("o1")) {
      labels.push(14);
    } else if (files[i].toLocaleLowerCase().startsWith("p1")) {
      labels.push(15);
    } else if (files[i].toLocaleLowerCase().startsWith("q1")) {
      labels.push(16);
    } else if (files[i].toLocaleLowerCase().startsWith("r1")) {
      labels.push(17);
    } else if (files[i].toLocaleLowerCase().startsWith("s1")) {
      labels.push(18);
    } else if (files[i].toLocaleLowerCase().startsWith("t1")) {
      labels.push(19);
    } else if (files[i].toLocaleLowerCase().startsWith("u1")) {
      labels.push(20);
    } else if (files[i].toLocaleLowerCase().startsWith("v1")) {
      labels.push(21);
    } else if (files[i].toLocaleLowerCase().startsWith("w1")) {
      labels.push(22);
    } else if (files[i].toLocaleLowerCase().startsWith("x1")) {
      labels.push(23);
    } else if (files[i].toLocaleLowerCase().startsWith("y1")) {
      labels.push(24);
    } else if (files[i].toLocaleLowerCase().startsWith("z1")) {
      labels.push(25);
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
      labels: tf.oneHot(tf.tensor1d(this.trainData[1], 'int32'), 26).toFloat()
    }
  }


  getTestData() {
    return {
      images: tf.concat(this.testData[0]),
      labels: tf.oneHot(tf.tensor1d(this.testData[1], 'int32'), 26).toFloat()
    }
  }
}

module.exports = new AslDataset();
