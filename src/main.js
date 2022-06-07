import {render, RenderPosition} from './framework/render.js';
import TitleView from './view/title-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ListPresenter from './presenter/list-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import {OFFERS} from './mock/offers.js';
import {returnTitleDuration, calculatePrice} from './util.js';

const pointModel = new PointModel();
const points = pointModel.points;
const filterModel = new FilterModel();

const destinationNames = points.slice().sort((nextItem, currentItem) => new Date(nextItem.dateFrom) - new Date(currentItem.dateFrom)).map((point) => point.destination.name);

const titleContainerElement = document.querySelector('.trip-main');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');

const filterPresenter = new FilterPresenter(filtersContainerElement, filterModel, pointModel);
const listPresenter = new ListPresenter(tripEventsContainerElement, pointModel, filterModel);

if (points && points.length !== 0) {
  const totalPrice = calculatePrice(points, OFFERS);
  const titleDuration = returnTitleDuration(points);

  render(new TitleView(destinationNames, totalPrice, titleDuration), titleContainerElement, RenderPosition.AFTERBEGIN);
}

const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');

const handleNewPointFormClose = () => {
  newPointButtonElement.disabled = false;
};

const newPointButtonClickHandler = () => {
  listPresenter.createPoint(handleNewPointFormClose);
  newPointButtonElement.disabled = true;
};

newPointButtonElement.addEventListener('click', newPointButtonClickHandler);

filterPresenter.init();
listPresenter.init();
