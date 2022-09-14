export default class LoadMoreButton {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = document.querySelector('.load-more__text');

    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.label.textContent = 'Load more';
    this.refs.button.classList.remove('load-more--loading');
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.button.classList.add('load-more--loading');
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
