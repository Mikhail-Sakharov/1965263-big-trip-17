import {createPoint} from '../mock/point.js';

const EVENT_POINTS_COUNT = 23;

export default class PointModel {
  points = Array.from({length: EVENT_POINTS_COUNT}, createPoint);

  getPoints() {
    return this.points;
  }
}
