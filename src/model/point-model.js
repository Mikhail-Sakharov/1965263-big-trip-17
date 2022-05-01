import {createPoint} from '../mock/point.js';

export default class PointModel {
  points = Array.from({length: 5}, createPoint);

  getPoints() {
    return this.points;
  }
}
