import AbstractView from '../framework/view/abstract-view.js';

function createTitleTemplate(filterValue) {
  const messages = {
    'everything': 'Click New Event to create your first point',
    'future': 'There are no future events now',
    'past': 'There are no past events now'
  };

  return `<p class="trip-events__msg">${messages[filterValue]}</p>`;
}

export default class EmptyListView extends AbstractView {
  #element = null;

  constructor(filterValue) {
    super();
    this.filterValue = filterValue;
  }

  get template() {
    return createTitleTemplate(this.filterValue);
  }
}
