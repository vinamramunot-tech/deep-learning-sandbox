# Understanding the react code structure
2. `src/design_document/digitinator/jsx/mnist/loadModel.ts` file loads the model.json file that contains the model architecture
3. `src/design_document/digitinator/jsx/mnist/numberDetection.ts` file takes the loaded model and then input from the imageData
    - model is loaded using `loadModel`
    - `imageData` is converted into tensor using `tf.browser.fromPixels()`
    - `model.predict()` takes the tensor data as input and prediction is made and returned