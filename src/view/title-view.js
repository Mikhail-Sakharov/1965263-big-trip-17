import {createElement} from '../render.js';

function createTitleTemplate(destinationNames, totalPrice='0', date='') {
  const set = new Set(destinationNames);
  const names = Array.from(set);
  const title = names.length <= 3 ? names.join('-') : `${names[0]} — ... — ${names[names.length - 1]}`;

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${title}</h1>

              <p class="trip-info__dates">${date}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>`;
}

export default class TitleView {
  #element = null;

  constructor(destinationNames) {
    this.destinationNames = destinationNames;
  }

  get template() {
    return createTitleTemplate(this.destinationNames);
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
