const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const SortType = {
  DEFAULT: 'default',
  TIME_DOWN: 'time-down',
  PRICE_DOWN: 'price-down'
};

const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const BLANK_POINT = {
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
  id: null,
  isFavorite: false,
  offers: [],
  type: null
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const DateTimeFormat = {
  HUMAN: 'MMM DD',
  FULL_DATE: 'YYYY-MM-DD',
  TIME: 'hh:mm',
  DATE_TIME: 'DD/MM/YY hh:mm',
  DATEPICKER: 'd/m/y H:i'
};

export {
  FilterType,
  UserAction,
  UpdateType,
  SortType,
  EVENT_TYPES,
  BLANK_POINT,
  TimeLimit,
  Mode,
  DateTimeFormat
};
