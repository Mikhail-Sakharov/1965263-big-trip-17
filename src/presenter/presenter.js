import {render, RenderPosition} from '../render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import ListItemView from '../view/list-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import PointModel from '../model/point-model.js';

const pointsArray = new PointModel();
const points = pointsArray.getPoints();

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripPointsContainerElement = document.querySelector('.trip-events');

render(new FiltersView(), filtersContainerElement, RenderPosition.BEFOREEND);
render(new SortView(), tripPointsContainerElement, RenderPosition.BEFOREEND);
render(new ListView(), tripPointsContainerElement, RenderPosition.BEFOREEND);

const listElement = tripPointsContainerElement.querySelector('.trip-events__list');
for (let i=0; i<points.length; i++) {
  render(new PointView(points[i]), listElement, RenderPosition.BEFOREEND);
}

render(new ListItemView(), listElement, RenderPosition.AFTERBEGIN);
const firstPointElement = tripPointsContainerElement.querySelector('.trip-events__item');
render(new EditPointView(points[0]), firstPointElement, RenderPosition.AFTERBEGIN);
