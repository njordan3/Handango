const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');


const NUM_CLASSES = 7;
let xTrain;
let yTrain;

function loadImage(path) {
  return tf.tidy( () => {
    const imageBuffer = fs.readFileSync(path);
    const tfimage = tf.node.decodeImage(imageBuffer);
    return tfimage.resizeBilinear([224,224])
    .expandDims()
    .toFloat()
    .div(127.0)
    .sub(1);
  });
}

async function loadImages(dir, label) {
  console.log("Getting images\n");
  let img;
  let y;
  fs.readdir(dir, (_, files) => {
    files.forEach(async (file) => {
      img = loadImage(`${dir}/${file}`);
      y = tf.tidy(() => tf.oneHot(tf.tensor1d([label]).toInt(),
      NUM_CLASSES));
      if (xTrain == null) {
        xTrain = img;
        yTrain = y;
      } else {
        xTrain = xTrain.concat(img, 0);
        yTrain = yTrain.concat(y, 0);
      }
    });
  });
  tf.dispose(img);
  tf.dispose(y);
}


async function train() {
  const mobilenet = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
  const cutoffLayer = mobilenet.getLayer('conv_pw_13_relu');
  const truncatedModel = tf.model({
    inputs: mobilenet.inputs,
    outputs: cutoffLayer.output,
  });





  const activation = truncatedModel.predict(xTrain);

  const model = tf.sequential();
  model.add(tf.layers.flatten(
  { inputShape: truncatedModel.output.shape.slice(1) },
  ));
  // Changed this to 100
  model.add(tf.layers.dense({
  units: 100,
  activation: 'relu',
  }));
  // Adding new layers here
  model.add(tf.layers.dense({
  units: 100,
  activation: 'relu',
  }));
  model.add(tf.layers.dense({
  units: 10,
  activation: 'relu',
  }));
  // End of new layers
  model.add(tf.layers.dense({
  units: NUM_CLASSES,
  activation: 'softmax',
  useBias: false,
  kernelInitializer: 'varianceScaling',
  }));
  model.compile({
  loss: 'categoricalCrossentropy',
  optimizer: tf.train.adam(0.0001),
  metrics: ['accuracy'],
  });


 await model.fit(activation, yTrain, {
  batchSize: 32,
  epochs: 15,
  shuffle:true,
  callbacks: tf.node.tensorBoard('tmp/fit_logs'),
  });

 await model.save('file://model/');

}

// Place all class directories here and unique hot label
async function run() {
  // await loadImages('data/guitar/', 0);
  // await loadImages('data/racquet/', 1);

  await loadImages('data/Anew/', 0);
  await loadImages('data/Bnew/', 1);
  await loadImages('data/Cnew/', 2);
  await loadImages('data/Dnew/', 3);
  await loadImages('data/Enew/', 4);
  await loadImages('data/Fnew/', 5);
  await loadImages('data/nothing/', 6);
 // await loadImages('data/At/', 0);
 // await loadImages('data/Bt/', 1);
 // await loadImages('data/Ct/', 2);
 // await loadImages('data/Dt/', 3);
 // await loadImages('data/Et/', 4);
 // await loadImages('data/Ft/', 5);
 // await loadImages('data/Gt/', 6);
 // await loadImages('data/H/', 7);
 // await loadImages('data/I/', 8);
 // await loadImages('data/J/', 9);
 // await loadImages('data/K/', 10);
 // await loadImages('data/L/', 11);
 // await loadImages('data/M/', 12);
 // await loadImages('data/N/', 13);
 // await loadImages('data/O/', 14);
 // await loadImages('data/P/', 15);
 // await loadImages('data/Q/', 16);
 // await loadImages('data/R/', 17);
 // await loadImages('data/S/', 18);
 // await loadImages('data/T/', 19);
 // await loadImages('data/U/', 20);
 // await loadImages('data/V/', 21);
 // await loadImages('data/W/', 22);
 // await loadImages('data/X/', 23);
 // await loadImages('data/Y/', 24);
 // await loadImages('data/Z/', 25);



 train();
}
run();
