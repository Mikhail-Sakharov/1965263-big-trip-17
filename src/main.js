import {render, RenderPosition} from './render.js';
import TitleView from './view/title-view.js';
import FiltersView from './view/filters-view.js';
import ListPresenter from './presenter/presenter.js';
import PointModel from './model/point-model.js';

const pointsArray = new PointModel();
const points = pointsArray.getPoints();
const destinationNames = points.map((item) => item.destination.pointName);
const titleContainer = document.querySelector('.trip-main');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const listPresenter = new ListPresenter();

render(new TitleView(destinationNames), titleContainer, RenderPosition.AFTERBEGIN);
render(new FiltersView(), filtersContainerElement, RenderPosition.BEFOREEND);

listPresenter.init(tripEventsContainer, points);
