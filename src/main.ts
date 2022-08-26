import Vue from 'vue';
import Swal from 'sweetalert2';

import * as modelling from './modules/modelling';

interface UIModel {
  manifestFile: File | null,
  weightsFile: File | null,
  counter: number,
  isActive: boolean
}

const KFEdgeApp = Vue.extend({
  data(): UIModel {
    return {
 