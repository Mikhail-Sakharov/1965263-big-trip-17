import Observable from '../framework/observable.js';
import {createPoint} from '../mock/point.js';
import {getRandomInteger, PointsCount} from '../util.js';

const eventPointsCount = getRandomInteger(PointsCount.MIN, PointsCount.MAX);

export default class PointModel extends Observable {
  #points = Array.from({length: eventPointsCount}, createPoint);

  get points() {
    return this.#points;
  }

  updatePoint = (updateType, update) => {
    this.#points = [...this.#points.map((point) => point.id === update.id ? update : point)];
    console.log(this.#points);
    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];
    console.log(this.#points);
    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    this.#points = [...this.#points.filter((point) => point.id !== update.id)];
    console.log(this.#points);
    this._notify(updateType);
  };
}
