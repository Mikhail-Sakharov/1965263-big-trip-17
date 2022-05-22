import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {render, replace} from '../framework/render.js';

export default class PointPresenter {
  #listComponent = null;

  #point = null;
  #offers = null;
  #destinations = null;

  #pointComponent = null;
  #editPointComponent = null;

  constructor(listComponent) {
    this.#listComponent = listComponent;
  }

  init = (point, offers, destinations) => {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#pointComponent = new PointView(this.#point, this.#offers);
    this.#editPointComponent = new EditPointView(this.#point, this.#offers, this.#destinations);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    render(this.#pointComponent, this.#listComponent);
  };

  #escKeyDownHandler = (evt) => {
    if (['Escape', 'Esc'].includes(evt.key)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
