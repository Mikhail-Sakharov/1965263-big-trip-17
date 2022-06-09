import TitleView from '../view/title-view.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {returnTitleDuration, calculatePrice} from '../util.js';

export default class TitlePresenter {
  #titleContainer = null;
  #pointsModel = null;

  #titleComponent = null;

  constructor(titleContainer, pointsModel) {
    this.#titleContainer = titleContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;
    return points;
  }

  get offers() {
    const offers = this.#pointsModel.offers;
    return offers;
  }

  init = () => {
    const destinationNames = this.points.slice().sort((nextItem, currentItem) => new Date(nextItem.dateFrom) - new Date(currentItem.dateFrom)).map((point) => point.destination.name);
    const totalPrice = calculatePrice(this.points, this.offers);
    const titleDuration = returnTitleDuration(this.points);

    const prevTitleComponent = this.#titleComponent;

    this.#titleComponent = new TitleView(destinationNames, totalPrice, titleDuration);

    if (prevTitleComponent === null) {
      render(this.#titleComponent, this.#titleContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#titleComponent, prevTitleComponent);
    remove(prevTitleComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
