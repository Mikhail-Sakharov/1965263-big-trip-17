import {render, RenderPosition} from '../render.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EditPointView from '../view/edit-point-view.js';
import EmptyListView from '../view/empty-list-msg.js';
import PointView from '../view/point-view.js';

export default class ListPresenter {
  ListComponent = new ListView();

  init = (listContainer, points) => {
    this.listContainer = listContainer;

    if (!points) {
      render(new EmptyListView(), this.listContainer, RenderPosition.AFTERBEGIN);
    } //00:54:10 list-empty message

    render(this.ListComponent, this.listContainer, RenderPosition.AFTERBEGIN);
    render(new SortView(), this.ListComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(new EditPointView(points[0]), this.ListComponent.getElement(), RenderPosition.BEFOREEND);
    points.forEach((item) => {
      render(new PointView(item), this.ListComponent.getElement(), RenderPosition.BEFOREEND);
    });

  };
}
