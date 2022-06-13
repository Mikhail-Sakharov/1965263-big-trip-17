import AbstractView from '../framework/view/abstract-view.js';

const DESTINATION_NAMES_MAX_COUNT = 3;

const createTitleTemplate = (destinationNames, totalPrice, duration) => {
  const names = Array.from(destinationNames);
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
};

export default class TitleView extends AbstractView {
  #destinationNames = null;
  #pointsTotalPrice = null;
  #titleDuration = null;

  constructor(destinationNames, pointsTotalPrice, titleDuration) {
    super();
    this.#destinationNames = destinationNames;
    this.#pointsTotalPrice = pointsTotalPrice;
    this.#titleDuration = titleDuration;
  }

  get template() {
    return createTitleTemplate(this.#destinationNames, this.#pointsTotalPrice, this.#titleDuration);
  }
}
