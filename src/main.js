import {render, RenderPosition} from './framework/render.js';
import TitleView from './view/title-view.js';
import FiltersView from './view/filters-view.js';
import ListPresenter from './presenter/list-presenter.js';
import PointModel from './model/point-model.js';
import {OFFERS} from './mock/offers.js';
import {returnTitleDuration, calculatePrice} from './util.js';

const pointsArray = new PointModel();
const points = pointsArray.points;

const destinationNames = points.map((point) => point.destination.name);

const titleContainerElement = document.querySelector('.trip-main');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainerElement = document.querySelector('.trip-events');

const listPresenter = new ListPresenter(tripEventsContainerElement, pointsArray);

if (points && points.length !== 0) {
  const totalPrice = calculatePrice(points, OFFERS);
  const titleDuration = returnTitleDuration(points);

  render(new TitleView(destinationNames, totalPrice, titleDuration), titleContainerElement, RenderPosition.AFTERBEGIN);
}
render(new FiltersView(points), filtersContainerElement, RenderPosition.BEFOREEND);

listPresenter.init();
