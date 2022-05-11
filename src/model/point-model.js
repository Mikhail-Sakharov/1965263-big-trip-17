import {createPoint} from '../mock/point.js';
import {getRandom} from '../util.js';

const PointsCount = {
  MIN: 2,
  MAX: 5
};
const eventPointsCount = getRandom(PointsCount.MIN, PointsCount.MAX);

export default class PointModel {
  #points = Array.from({length: eventPointsCount}, createPoint);

  get points() {
    return this.#points;
  }
}
