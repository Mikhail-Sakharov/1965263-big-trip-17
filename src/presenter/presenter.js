import {render, RenderPosition/* , replace */} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EmptyListView from '../view/empty-list-msg.js';
import FiltersView from '../view/filters-view.js';
import {OFFERS} from '../mock/offers.js';
import {DESTINATIONS} from '../mock/destinations.js';
import PointPresenter from './point-presenter.js';

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

  #renderPoints = (points) => {
    points.forEach((point) => {
      const specifiedTypeOffers = OFFERS.find((offer) => offer.type === point.type).offers;
      const pointPresenter = new PointPresenter(this.#listComponent.element);
      pointPresenter.init(point, specifiedTypeOffers, DESTINATIONS);
    });
  };

  init = (listContainer, points) => {
    this.listContainer = listContainer;

    if (!points || points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderList();
      this.#renderSort(points);
      this.#renderPoints(points);
    }
  };
}
