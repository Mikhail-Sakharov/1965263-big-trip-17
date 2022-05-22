import {render, RenderPosition, replace} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EditPointView from '../view/edit-point-view.js';
import EmptyListView from '../view/empty-list-msg.js';
import PointView from '../view/point-view.js';
import FiltersView from '../view/filters-view.js';
import {OFFERS} from '../mock/offers.js';
import {DESTINATIONS} from '../mock/destinations.js';

export default class ListPresenter {
  #listComponent = new ListView();

  #renderEmptyList = () => {
    const filters = new FiltersView();
    const checkedFilter = filters.element.querySelector('input[name="trip-filter"]:checked');
    const isChecked = !!(checkedFilter);
    const filterValue = isChecked ? checkedFilter.value : 'everything';
    render(new EmptyListView(filterValue), this.listContainer, RenderPosition.AFTERBEGIN);
  };

  #renderList = () => {
    render(this.#listComponent, this.listContainer, RenderPosition.AFTERBEGIN);
  };

  #renderSort = (points) => {
    render(new SortView(points), this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point, offers, destinations) => {
    const pointComponent = new PointView(point, offers);
    const editPointComponent = new EditPointView(point, offers, destinations);

    const replacePointToForm = () => {
      replace(editPointComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, editPointComponent);
    };

    const onEscKeyDown = (evt) => {
      if (['Escape', 'Esc'].includes(evt.key)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#listComponent.element);
  };

  init = (listContainer, points) => {
    this.listContainer = listContainer;

    if (!points || points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderList();
      this.#renderSort(points);
      points.forEach((point) => {
        const specifiedTypeOffers = OFFERS.find((offer) => offer.type === point.type).offers;
        this.#renderPoint(point, specifiedTypeOffers, DESTINATIONS);
      });
    }
  };
}
