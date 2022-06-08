import {render, RenderPosition} from './framework/render.js';
import TitleView from './view/title-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ListPresenter from './presenter/list-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import {returnTitleDuration, calculatePrice} from './util.js';
import PointsApiService from './api-services/points-api-service.js';

const AUTHORIZATION = 'Basic z1f7ti3dx123f7t3SMG888';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip/';

const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');
const titleContainerElement = document.querySelector('.trip-main');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');

const filterModel = new FilterModel();
const pointModel = new PointModel(new PointsApiService(END_POINT, AUTHORIZATION));

const filterPresenter = new FilterPresenter(filtersContainerElement, filterModel, pointModel);
const listPresenter = new ListPresenter(tripEventsContainerElement, pointModel, filterModel);

const handleNewPointFormClose = () => {
  newPointButtonElement.disabled = false;
};

const newPointButtonClickHandler = () => {
  listPresenter.createPoint(handleNewPointFormClose);
  newPointButtonElement.disabled = true;
};

pointModel.init().finally(() => {
  newPointButtonElement.disabled = false;
  newPointButtonElement.addEventListener('click', newPointButtonClickHandler);
});

const points = pointModel.points;
const offers = pointModel.offers;
//console.log(points, offers);

const destinationNames = points.slice().sort((nextItem, currentItem) => new Date(nextItem.dateFrom) - new Date(currentItem.dateFrom)).map((point) => point.destination.name);

if (points && points.length !== 0) {
  const totalPrice = calculatePrice(points, offers);
  const titleDuration = returnTitleDuration(points);

  render(new TitleView(destinationNames, totalPrice, titleDuration), titleContainerElement, RenderPosition.AFTERBEGIN);
}

filterPresenter.init();
listPresenter.init();
