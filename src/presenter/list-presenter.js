import {render, RenderPosition, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EmptyListView from '../view/empty-list-msg.js';
//import FiltersView from '../view/filters-view.js';
import {OFFERS} from '../mock/offers.js';
import {DESTINATIONS} from '../mock/destinations.js';
import PointPresenter from './point-presenter.js';
import {SortType, UpdateType, UserAction} from '../const.js';

export default class ListPresenter {
  #listContainer = null;
  #listComponent = new ListView();
  #emptyListMessageComponent = new EmptyListView();
  #sortComponent = null;
  #pointsModel = null;

  #pointPresenter = new Map();

  #currentSortType = SortType.DEFAULT;

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderList();
  };

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME_DOWN:
        return [...this.#pointsModel.points].sort((nextItem, currentItem) => (new Date(currentItem.dateTo) - new Date(currentItem.dateFrom)) - (new Date(nextItem.dateTo) - new Date(nextItem.dateFrom)));
      case SortType.PRICE_DOWN:
        return [...this.#pointsModel.points].sort((nextItem, currentItem) => currentItem.basePrice - nextItem.basePrice);
      case SortType.DEFAULT:
        return [...this.#pointsModel.points].sort((nextItem, currentItem) => new Date(nextItem.dateFrom) - new Date(currentItem.dateFrom));
    }

    return this.#pointsModel.points;
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearList();
        this.#renderList();
        break;
      case UpdateType.MAJOR:
        this.#clearList(true);
        this.#renderList();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearList();
    this.#renderList();
  };

  #renderEmptyListMessage = () => {
    const checkedFilter = document.querySelector('input[name="trip-filter"]:checked');
    const isChecked = !!(checkedFilter);
    const filterValue = isChecked ? checkedFilter.value : 'everything';

    render(new EmptyListView(filterValue), this.#listContainer);
  };

  #renderList = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderEmptyListMessage();
      return;
    }

    render(this.#listComponent, this.#listContainer, RenderPosition.AFTERBEGIN);

    this.#renderSort();
    this.#renderPoints(this.points.slice());
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, OFFERS, DESTINATIONS);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #clearList = (resetSortType = false) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListMessageComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
