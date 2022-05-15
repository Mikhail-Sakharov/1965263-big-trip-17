import {render, RenderPosition} from './framework/render.js';
import TitleView from './view/title-view.js';
import FiltersView from './view/filters-view.js';
import ListPresenter from './presenter/presenter.js';
import PointModel from './model/point-model.js';
import {OFFERS} from './mock/offers.js';
import {returnTitleDuration} from './util.js';

const pointsArray = new PointModel();
const points = pointsArray.points;
const destinationNames = points.map((point) => point.destination.pointName);
const titleContainer = document.querySelector('.trip-main');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const listPresenter = new ListPresenter();

function calculatePrice(pointsData, allOffers) {
  const eventsTotalPrice = pointsData.reduce((totalPrice, point) => totalPrice + point.basePrice + (
    point.offers.reduce((offersTotalPrice, offerId) => offersTotalPrice + allOffers.find((offersBlock) => offersBlock.type === point.type).offers.find((offer) => offer.id === offerId).price, 0)
  ), 0);

  return eventsTotalPrice;
}

if (points && points.length !== 0) {
  const totalPrice = calculatePrice(points, OFFERS);
  const titleDuration = returnTitleDuration(points[0].dateFrom, points[points.length-1].dateTo);

  render(new TitleView(destinationNames, totalPrice, titleDuration), titleContainer, RenderPosition.AFTERBEGIN);
}
render(new FiltersView(points), filtersContainerElement, RenderPosition.BEFOREEND);

listPresenter.init(tripEventsContainer, points);
