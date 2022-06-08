import AbstractView from '../framework/view/abstract-view.js';

function createTitleTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class LoadingView extends AbstractView {
  get template() {
    return createTitleTemplate();
  }
}
