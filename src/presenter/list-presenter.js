import {render, RenderPosition, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import {SortType, UpdateType, UserAction, FilterType, TimeLimit, MessageType} from '../const.js';
import {filterFormat, sortFormat, showLoadFailMessage} from '../util.js';

export default class ListPresenter {
  #listContainer = null;
  #listComponent = new ListView();
  #loadingComponent = new LoadingView();
  #emptyListMessageComponent = null;
  #sortComponent = null;
  #pointsModel = null;
  #filterModel = null;

  #pointPresenter = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(listContainer, pointsModel, filterModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter(this.#listComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderList();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this.#pointsModel.points.length === 0 || this.#pointsModel.offers === null || this.#pointsModel.destinations === null) {
      showLoadFailMessage(MessageType.POINTS);
      return;
    }
    this.#newPointPresenter.init(callback, this.#pointsModel.offers, this.#pointsModel.destinations);
  };

  get points() {
    this.#filterType = this.#filterModel.filterType;
    const points = this.#pointsModel.points;
    const filteredPoints = filterFormat[this.#filterType](points);
    const sortedPoints = sortFormat[this.#currentSortType](filteredPoints);

    return sortedPoints;
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(point.id).init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearList();
        this.#renderList();
        break;
      case UpdateType.MAJOR:
        this.#clearList(true);
        this.#renderList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEmptyListMessage = () => {
    this.#emptyListMessageComponent = new EmptyListView(this.#filterType);
    render(this.#emptyListMessageComponent, this.#listContainer);
  };

  #renderList = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderEmptyListMessage();
      return;
    }

    render(this.#listComponent, this.#listContainer, RenderPosition.AFTERBEGIN);

    this.#renderSort();
    this.#renderPoints(points.slice());
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #clearList = (resetSortType = false) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#emptyListMessageComponent) {
      remove(this.#emptyListMessageComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
