import {createPoint} from '../mock/point.js';
import {getRandomInteger, PointsCount} from '../util.js';

const eventPointsCount = getRandomInteger(PointsCount.MIN, PointsCount.MAX);

export default class PointModel {
  #points = Array.from({length: eventPointsCount}, createPoint);

  get points() {
    return this.#points;
  }
}
