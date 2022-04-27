import {render, RenderPosition} from '../render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import ListItemView from '../view/list-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripPointsContainerElement = document.querySelector('.trip-events');

render(new FiltersView(), filtersContainerElement, RenderPosition.BEFOREEND);
render(new SortView(), tripPointsContainerElement, RenderPosition.BEFOREEND);
render(new ListView(), tripPointsContainerElement, RenderPosition.BEFOREEND);

const listElement = tripPointsContainerElement.querySelector('.trip-events__list');
for (let i=0; i<3; i++) {
  render(new PointView(), listElement, RenderPosition.BEFOREEND);
}

render(new ListItemView(), listElement, RenderPosition.AFTERBEGIN);
const firstPointElement = tripPointsContainerElement.querySelector('.trip-events__item');
render(new EditPointView(), firstPointElement, RenderPosition.AFTERBEGIN);
