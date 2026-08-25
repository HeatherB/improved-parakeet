export default class Expander {
  constructor($el, options = {}) {
    this.init($el, options);
  }

  init($el, options) {
    this.$el = $el;
    this.$trigger = this.$el.find('[data-expander-trigger]');
    this.$triggerText = this.$trigger.find('[data-expander-trigger-text]');
    this.$triggerIcon = this.$trigger.find('[data-expander-trigger-icon]');
    this.$target = this.$el.find('[data-expander-target]');

    this.options = Object.assign({
      animSpeed: 200,
      activeClass: 'is-active',
      defaultHeight: 150,
      expandText: 'Show More',
      collapseText: 'Show Less',
    }, options);

    this.animSpeed = this.options.animSpeed;
    this.activeClass = this.options.activeClass;
    this.defaultHeight = this.options.defaultHeight;
    this.expandText = this.options.expandText;
    this.collapseText = this.options.collapseText;
    this.isActive = false;

    if (this.$target.height() <= this.defaultHeight) {
      this.$el.addClass(this.activeClass);
      this.$trigger.remove();
      return;
    }

    this.$target.height(this.defaultHeight);

    this.$trigger.on('click', this._onClick.bind(this));

    this.$el.addClass('is-initialized');

  }

  _onClick(event) {
    event.preventDefault();
    if (this.isActive) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  expand() {
    let expandedHeight = this.$target.height('auto').height();
    let collapsedHeight = this.defaultHeight;

    this.isActive = true;
    this.$triggerText.text('Show Less');
    this.$triggerIcon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
    this.$el.addClass(this.activeClass);

    this.$target.height(collapsedHeight).animate({
      height: expandedHeight,
    }, this.animSpeed, function(){
      this.$target.height('');
    }.bind(this));

  }

  collapse() {
    let expandedHeight = this.$target.height('auto').height();
    let collapsedHeight = this.defaultHeight;

    this.isActive = false;
    this.$triggerText.text('Show More');
    this.$triggerIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
    this.$el.removeClass(this.activeClass);

    this.$target.height(expandedHeight).animate({
      height: collapsedHeight,
    }, this.animSpeed);

  }

}
