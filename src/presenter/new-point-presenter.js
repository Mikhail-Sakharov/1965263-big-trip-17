import EditPointView from '../view/edit-point-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import {getId} from '../util.js';
import {OFFERS} from '../mock/offers.js';
import {DESTINATIONS} from '../mock/destinations.js';

const BLANK_POINT = {  //перенести в константы
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
  id: null,
  isFavorite: false,
  offers: [],
  type: null
};

export default class NewPointPresenter {
  #listContainer = null;
  #changeData = null;
  #editPointComponent = null;
  #destroyCallback = null;

  constructor(listContainer, changeData) {
    this.#listContainer = listContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView(BLANK_POINT, OFFERS, DESTINATIONS);

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setRollUpButtonClickHandler(this.#handleRollUpButtonClick);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#editPointComponent, this.#listContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (['Escape', 'Esc'].includes(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => { //валидация формы, если не заполнены все поля
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: getId(), ...point}
    );
    this.destroy();
  };

  #handleRollUpButtonClick = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}
