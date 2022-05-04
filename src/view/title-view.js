import {createElement} from '../render.js';

function createTitleTemplate(destinationNames) {
  const title = destinationNames.length <= 3 ? destinationNames.join('-') : `${destinationNames[0]} — ... — ${destinationNames[destinationNames.length - 1]}`;

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${title}</h1>

              <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
            </p>
          </section>`;
}

export default class TitleView {
  constructor(destinationNames) {
    this.destinationNames = destinationNames;
  }

  getTemplate() {
    return createTitleTemplate(this.destinationNames);
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
