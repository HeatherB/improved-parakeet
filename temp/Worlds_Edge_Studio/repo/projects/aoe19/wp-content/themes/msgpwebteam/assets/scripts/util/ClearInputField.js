//Mimics the -webkit- input type='search' clear 'X' icon
export default class ClearInputField {
  constructor($el) {
    this.init($el);
  }

  init($el) {
    this.$el = $el;
    this.$input = this.$el.find('[data-input-field]');
    this.$clear = this.$el.find('[data-clear-button]');

    this.$clear.on('click', this.clear.bind(this));
  }

  clear() {
    this.$input.val('').focus();
  }
}
