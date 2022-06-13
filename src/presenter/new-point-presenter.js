import EditPointView from '../view/edit-point-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
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

  init = (callback, offers, destinations) => {
    this.#destroyCallback = callback;

    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView(BLANK_POINT, offers, destinations);

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

  setSaving = () => {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    const {basePrice, type} = point;

    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        ...point,
        basePrice: Number(basePrice ?? 0),
        type: type ?? 'flight'
      }
    );
  };

  #handleRollUpButtonClick = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (['Escape', 'Esc'].includes(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
