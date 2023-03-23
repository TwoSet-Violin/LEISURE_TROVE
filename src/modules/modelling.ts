
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

// eslint-disable-next-line camelcase
interface CarsData { Miles_per_Gallon: number; Horsepower: number; }
interface InputData {mpg: number; horsepower: number;}

interface ConvertedInputs {
  inputs: tf.Tensor<tf.Rank>;
  labels: tf.Tensor<tf.Rank>;

  inputMax: tf.Tensor<tf.Rank>;
  inputMin: tf.Tensor<tf.Rank>;
  labelMax: tf.Tensor<tf.Rank>;
  labelMin: tf.Tensor<tf.Rank>;
}

let model: tf.Sequential;

/**
 * Get the car data reduced to just the variables we are interested
 * and cleaned of missing data.
 */
async function getData(): Promise<Array<InputData>> {
  const carsDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
  const carsData = await carsDataResponse.json() as CarsData[];
  const cleaned = carsData.map((car) => ({
    mpg: car.Miles_per_Gallon,
    horsepower: car.Horsepower,
  }))
    .filter((car) => (car.mpg != null && car.horsepower != null));

  return cleaned;
}

function createModel(): tf.Sequential {
  // Create a sequential model
  const blankModel = tf.sequential();

  // Add a single input layer
  blankModel.add(tf.layers.dense({
    inputShape: [1], units: 16, useBias: true, activation: 'relu',
  }));
  blankModel.add(tf.layers.dense({ units: 8, activation: 'relu' }));

  // Add an output layer
  blankModel.add(tf.layers.dense({ units: 1, useBias: true }));

  return blankModel;
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
function convertToTensor(data: InputData[]): ConvertedInputs {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors.

  return tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map((d) => d.horsepower);
    const labels = data.map((d) => d.mpg);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    // Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,