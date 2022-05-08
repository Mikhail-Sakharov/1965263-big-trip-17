import {render, RenderPosition} from './render.js';
import TitleView from './view/title-view.js';
import FiltersView from './view/filters-view.js';
import ListPresenter from './presenter/presenter.js';
import PointModel from './model/point-model.js';
import {OFFERS} from './mock/offers.js';
import {returnTitleDuration} from './util.js';

const pointsArray = new PointModel();
const points = pointsArray.points;
const destinationNames = points.map((item) => item.destination.pointName);
const titleContainer = document.querySelector('.trip-main');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const listPresenter = new ListPresenter();

if (points && points.length !== 0) {
  const eventsTotalPrice = points.reduce((sum, item) => sum + item.basePrice, 0);
  let offersTotalPrice = 0;

  points.forEach((element) => {
    const eventType = element.type;
    const checkedOffers = element.offers;

    OFFERS.forEach((item) => {
      if (item.type === eventType) {
        if (checkedOffers !== null && item.offers !== null) {
          item.offers.forEach((elem) => {
            if (checkedOffers.includes(elem.id)) {
              offersTotalPrice += elem.price;
            }
          });
        } else {offersTotalPrice += 0;}
      }
    });
  });

  const totalPrice = eventsTotalPrice + offersTotalPrice;
  const titleDuration = returnTitleDuration(points[0].dateFrom, points[points.length-1].dateTo);

  render(new TitleView(destinationNames, totalPrice, titleDuration), titleContainer, RenderPosition.AFTERBEGIN);
}
render(new FiltersView(), filtersContainerElement, RenderPosition.BEFOREEND);

listPresenter.init(tripEventsContainer, points);
