const automl = require('@tensorflow/tfjs-automl');
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const axios = require("axios");
const { createCanvas, loadImage, Image} = require('canvas');

 
const loadDictionary = async modelUrl => {
    const lastIndexOfSlash = modelUrl.lastIndexOf("/");
    const prefixUrl =
        lastIndexOfSlash >= 0 ? modelUrl.slice(0, lastIndexOfSlash + 1) : "";
    const dictUrl = `${prefixUrl}dict.txt`;
    const text = await axios.get('https://storage.googleapis.com/moleanalyzer2/dict.txt').then(res => res.data)
    //const text = await axios.get('https://storage.googleapis.com/tensorflow-11/dict.txt').then(res => res.data)
    return text.trim().split("\n");
};

const loadImageClassification = async modelUrl => {
    const [model, dict] = await Promise.all([
        tf.loadGraphModel(modelUrl),
        loadDictionary(modelUrl)
    ]);
    return new automl.ImageClassificationModel(model, dict);
};

const main = async (images) => {
    const modelURL = 'https://storage.googleapis.com/moleanalyzer2/model.json';
    const model = await loadImageClassification(modelURL);
 
	var img = new Image();
	const canvas1 = createCanvas(1024,1024);
	const ctx = canvas1.getContext('2d');
	img.onload = function () {
      ctx.drawImage(img, 0, 0);
				}	
	img.src = "https://www.tutorialspoint.com/images/seaborn-4.jpg?v=2";
     return await model.classify(canvas1);
  
};

exports.automl = (req, res) => {
  let images = req.body.images;
main(images)
    .then(_ => {
  	 res.status(200).send(_);
})
.catch(_ => {
  console.log(_)
  res.status(400).send('Could not analyze the image');
});
};