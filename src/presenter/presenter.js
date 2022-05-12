import {render, RenderPosition} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EditPointView from '../view/edit-point-view.js';
import EmptyListView from '../view/empty-list-msg.js';
import PointView from '../view/point-view.js';

import FiltersView from '../view/filters-view.js';

export default class ListPresenter {
  #listComponent = new ListView();

  init = (listContainer, points) => {
    this.listContainer = listContainer;

    if (!points || points.length === 0) {
      const filters = new FiltersView();
      const filterValue = filters.element.querySelector('input[name="trip-filter"]:checked').value;
      render(new EmptyListView(filterValue), this.listContainer, RenderPosition.AFTERBEGIN);
    } else {
      render(this.#listComponent, this.listContainer, RenderPosition.AFTERBEGIN);
      render(new SortView(), this.#listComponent.element, RenderPosition.AFTERBEGIN);
      points.forEach((item) => {
        this.#renderPoint(item);
      });
    }
  };

  #renderPoint = (point) => {
    const pointComponent = new PointView(point);
    const editPointComponent = new EditPointView(point);

    const replacePointToForm = () => {
      this.#listComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#listComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (['Escape', 'Esc'].includes(evt.key)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#listComponent.element);
  };
}
