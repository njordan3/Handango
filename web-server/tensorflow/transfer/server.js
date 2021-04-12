const tf = require('@tensorflow/tfjs-node');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const multer = require('multer');


// Convert the image to a tensor for prediction
function readImage(imageBuffer) {
 return tf.tidy(() => {
 const tfimage = tf.node.decodeImage(imageBuffer);
 return tfimage.resizeBilinear([224, 224])
 .expandDims()
 .toFloat()
 .div(127)
 .sub(1);
 });
}

async function runServer() {
 const model = await tf.loadLayersModel('file://model/model.json');
 const mobilenet = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
 const cutoffLayer = mobilenet.getLayer('conv_pw_13_relu');
 const truncatedModel = tf.model({ inputs: mobilenet.inputs,
   outputs: cutoffLayer.output });

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

   app.get('/', (req, res) => {
     res.sendFile(__dirname + '/index.html');
   });


   io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('asl-frame', function(data) {
    //console.log(data);
    const img = readImage(data);
    const activation = truncatedModel.predict(img);
    const prediction = model.predict(activation).dataSync();
    console.log(prediction);
    let top5 = Array.from(prediction)
  .map(function (p, i) { // this is Array.map
    return {
      probability: p,
      className: TARGET_CLASSES[i] // we are selecting the value from the obj
    };
  }).sort(function (a, b) {
    return b.probability - a.probability;
  }).slice(0, 5);


  top5.forEach(function (p) {
      console.log(`${p.className}: ${p.probability.toFixed(6)}`);
    });
  });
});

 http.listen(3000, () => {
  console.log('listening on *:3000');
});
}


runServer();
