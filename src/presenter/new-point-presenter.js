import EditPointView from '../view/edit-point-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import {OFFERS} from '../mock/offers.js';
import {DESTINATIONS} from '../mock/destinations.js';
import {nanoid} from 'nanoid';
import {BLANK_POINT} from '../const.js';

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

  #handleFormSubmit = (point) => {
    const {basePrice, type} = point;

    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        ...point,
        id: nanoid(),
        basePrice: Number(basePrice ?? 0),
        type: type ?? 'flight'
      }
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
