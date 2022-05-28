import {render, RenderPosition} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EmptyListView from '../view/empty-list-msg.js';
import FiltersView from '../view/filters-view.js';
import {OFFERS} from '../mock/offers.js';
import {DESTINATIONS} from '../mock/destinations.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../view/sort-view.js';

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export default class ListPresenter {
  #listContainer = null;
  #listComponent = new ListView();
  #sortComponent = new SortView();
  #pointsModel = null;

  #pointPresenter = new Map();

  #listPoints = [];

  #currentSortType = SortType.DEFAULT;
  #sourcedBoardPoints = [];

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#listPoints = [...this.#pointsModel.points];
    this.#listPoints.sort((nextItem, currentItem) => new Date(nextItem.dateFrom) - new Date(currentItem.dateFrom));
    this.#sourcedBoardPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints.sort((nextItem, currentItem) => new Date(nextItem.dateFrom) - new Date(currentItem.dateFrom));

    if (!this.#listPoints || this.#listPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderList();
      this.#renderSort(this.#listPoints);
      this.#renderPoints(this.#listPoints);
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    const specifiedTypeOffers = OFFERS.find((offer) => offer.type === updatedPoint.type).offers;
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, specifiedTypeOffers, DESTINATIONS);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME_DOWN:
        this.#listPoints.sort((nextItem, currentItem) => (new Date(currentItem.dateTo) - new Date(currentItem.dateFrom)) - (new Date(nextItem.dateTo) - new Date(nextItem.dateFrom)));
        break;
      case SortType.PRICE_DOWN:
        this.#listPoints.sort((nextItem, currentItem) => currentItem.basePrice - nextItem.basePrice);
        break;
      default:
        this.#listPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);

    this.#clearPointList();
    this.#renderPoints(this.#listPoints);
  };

  #renderEmptyList = () => {
    const filters = new FiltersView();
    const checkedFilter = filters.element.querySelector('input[name="trip-filter"]:checked');
    const isChecked = !!(checkedFilter);
    const filterValue = isChecked ? checkedFilter.value : 'everything';
    render(new EmptyListView(filterValue), this.#listContainer, RenderPosition.AFTERBEGIN);
  };

  #renderList = () => {
    render(this.#listComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderPoint = (point) => {
    const specifiedTypeOffers = OFFERS.find((offer) => offer.type === point.type).offers;
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, specifiedTypeOffers, DESTINATIONS);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}
