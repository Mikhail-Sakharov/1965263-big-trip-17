import {createElement} from '../render.js';

function createTitleTemplate(filterValue) {
  const messages = {
    'everything': 'Click New Event to create your first point',
    'future': 'There are no future events now',
    'past': 'There are no past events now'
  };

  return `<p class="trip-events__msg">${messages[filterValue]}</p>`;
}

export default class EmptyListView {
  #element = null;

  constructor(filterValue) {
    this.filterValue = filterValue;
  }

  get template() {
    return createTitleTemplate(this.filterValue);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
