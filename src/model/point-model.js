import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';
import {showLoadFailMessage} from '../util.js';

const MessageType = {
  OFFERS: 'offers',
  DESTINATIONS: 'destinations'
};

const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');

export default class PointModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offers = [];
  #destinations = null;

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    newPointButtonElement.disabled = true;
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch(err) {
      this.#offers = null;  //придумать свой вариант обработки ошибки
      showLoadFailMessage(MessageType.OFFERS);
    }

    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#destinations = null;  //придумать свой вариант обработки ошибки
      showLoadFailMessage(MessageType.OFFERS);
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [...this.#points.map((point) => point.id === update.id ? update : point)];

      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    this.#points = [...this.#points.filter((point) => point.id !== update.id)];

    this._notify(updateType);
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
