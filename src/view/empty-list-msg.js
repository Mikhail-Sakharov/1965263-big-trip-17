import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const EmptyMessageType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now'
};

function createTitleTemplate(filterValue) {
  const emptyListMessage = EmptyMessageType[filterValue];

  return `<p class="trip-events__msg">${emptyListMessage}</p>`;
}

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
