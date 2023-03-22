
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