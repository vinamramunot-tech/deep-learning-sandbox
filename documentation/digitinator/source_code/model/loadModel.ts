import * as tf from '@tensorflow/tfjs';

export const loadModel = async (): Promise<any> => await tf.loadLayersModel("model/model.json");