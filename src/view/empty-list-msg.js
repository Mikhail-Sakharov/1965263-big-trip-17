import {createElement} from '../render.js';

function createTitleTemplate() {
  const message = 'Click New Event to create your first point';
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyListView {

  getTemplate() {
    return createTitleTemplate();
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
