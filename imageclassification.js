exports.helloWorld = (req, res) => {
let image = req.body.image;
const automl = require('@google-cloud/automl').v1beta1;
 function predict() {
        // Create client for prediction service.
        const client = new automl.PredictionServiceClient();
        const projectId = 'mole-analyzer';
        const computeRegion = 'us-central1';
        const modelId = '/ICN1443914483178962066';
  		const scoreThreshold = '0';
           
        // Get the full path of the model.
        const modelFullId = client.modelPath(projectId, computeRegion, modelId);
        // Read the file content for prediction.
   
    	const params = {};
        params.score_threshold = scoreThreshold;
		const payload = {
              "image": {
                "imageBytes": image
              },
            };

        client.predict({
                name: modelFullId,
                payload: payload,
                params: params,
        }).then(result => {
          const [response] = result;
          res.status(200).send(response.payload)
        })
        .catch(error => {
        	res.status(404).send(error);
        })
        console.log('Prediction results:');
         
}
predict();

};
