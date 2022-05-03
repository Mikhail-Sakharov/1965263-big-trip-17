import './presenter/presenter.js';
import {render, RenderPosition} from './render.js';
import FiltersView from './view/filters-view.js';
import ListPresenter from './presenter/presenter.js';

//const headerElement = document.querySelector('.page-header');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const listPresenter = new ListPresenter();

render(new FiltersView(), filtersContainerElement, RenderPosition.BEFOREEND);

listPresenter.init(tripEventsContainer);
