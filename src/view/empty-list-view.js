import AbstractView from '../framework/view/abstract-view.js';
import {emptyMessageType} from '../util.js';

const createTitleTemplate = (filterValue) => {
  const emptyListMessage = emptyMessageType[filterValue];

  return `<p class="trip-events__msg">${emptyListMessage}</p>`;
};

export default class EmptyListView extends AbstractView {
  #filterValue = null;

  constructor(filterValue) {
    super();
    this.#filterValue = filterValue;
  }

  get template() {
    return createTitleTemplate(this.#filterValue);
  }
}
