import {render, RenderPosition} from '../render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import PointModel from '../model/point-model.js';

const pointsArray = new PointModel();
const points = pointsArray.getPoints();

export default class ListPresenter {
  ListComponent = new ListView();

  init = (listContainer) => {
    this.listContainer = listContainer;

    render(this.ListComponent, this.listContainer, RenderPosition.AFTERBEGIN);
    render(new SortView(), this.ListComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(new EditPointView(points[0]), this.ListComponent.getElement(), RenderPosition.BEFOREEND);
    points.forEach((item) => {
      render(new PointView(item), this.ListComponent.getElement(), RenderPosition.BEFOREEND);
    });

  };
}
