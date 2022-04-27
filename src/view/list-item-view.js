import {createElement} from '../render.js';

const createListItemTemplate = () => '<li class="trip-events__item"></li>';

export default class ListItemView {
  getTemplate() {
    return createListItemTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
