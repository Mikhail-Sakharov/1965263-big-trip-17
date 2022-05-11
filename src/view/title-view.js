import {createElement} from '../render.js';

const DESTINATION_NAMES_MAX_COUNT = 3;

function createTitleTemplate(destinationNames, totalPrice, duration) {
  const set = new Set(destinationNames);
  const names = Array.from(set);
  const title = names.length <= DESTINATION_NAMES_MAX_COUNT ? names.join('-') : `${names[0]} — ... — ${names[names.length - 1]}`;

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${title}</h1>

              <p class="trip-info__dates">${duration}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>`;
}

export default class TitleView {
  #element = null;

  constructor(destinationNames, pointsTotalPrice, titleDuration) {
    this.destinationNames = destinationNames;
    this.pointsTotalPrice = pointsTotalPrice;
    this.titleDuration = titleDuration;
  }

  get template() {
    return createTitleTemplate(this.destinationNames, this.pointsTotalPrice, this.titleDuration);
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
