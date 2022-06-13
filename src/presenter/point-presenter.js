import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {render, replace, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #listComponent = null;

  #changeData = null;
  #changeMode = null;

  #point = null;
  #offers = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #editPointComponent = null;

  constructor(listComponent, changeData, changeMode) {
    this.#listComponent = listComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offers, destinations) => {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(this.#point, this.#offers);
    this.#editPointComponent = new EditPointView(this.#point, this.#offers, this.#destinations);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setRollUpButtonClickHandler(this.#handleRollUpButtonClick);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#listComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditPointComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  #escKeyDownHandler = (evt) => {
    if (['Escape', 'Esc'].includes(evt.key)) {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #handleFormSubmit = (point) => {
    const {basePrice, type} = point;

    const isDatesEqual = this.#point.dateFrom === point.dateFrom && this.#point.dateTo === point.dateTo;
    const isBasePriceTheSame = this.#point.basePrice === point.basePrice;
    const isCheckedOffersTheSame = (this.#point.offers.length === point.offers.length) && this.#point.offers.every((offer, index) => offer === point.offers[index]);
    const isPatchUpdate = isDatesEqual && isBasePriceTheSame && isCheckedOffersTheSame;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isPatchUpdate ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...point,
        basePrice: Number(basePrice ?? 0),
        type: type ?? 'flight'
      }
    );
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleRollUpButtonClick = () => {
    this.#editPointComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
