import {createPoint} from '../mock/point.js';
import {getRandom} from '../util.js';

const EVENT_POINTS_COUNT = getRandom(2, 5);

export default class PointModel {
  points = Array.from({length: EVENT_POINTS_COUNT}, createPoint);

  getPoints() {
    return this.points;
  }
}
