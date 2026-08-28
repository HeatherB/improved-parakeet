var AboutCharacters = {
  classlist: $('.class-nav li'),
  characterselect: $('.class-nav a'),
  previewselect: $('.class-preview li'),
  heroinner: $('.style .hero-inner'),

  selectClass: function(e) {
    e.preventDefault();
    AboutCharacters.classlist.removeClass('active');
    $(this).parent().addClass('active');
    selectedClass = this.getAttribute('data-select');
    AboutCharacters.previewselect.css('visibility', 'visible').animate({opacity: 0 }, 250, function() {
      AboutCharacters.previewselect.removeClass('active');
    });
    AboutCharacters.heroinner.css('visibility', 'visible').animate({opacity: 0 }, 250, function() {
      AboutCharacters.heroinner.removeClass();
      AboutCharacters.loadPreview(selectedClass);
    });
  },

  loadPreview: function(selectedClass) {
    selectedPreview = AboutCharacters.previewselect.filter('[data-id=' + selectedClass + ']');
    selectedPreview.addClass('active').animate({opacity: 1 }, 250);
    AboutCharacters.heroinner.addClass('hero-inner ' + selectedClass).animate({opacity: 1 }, 250);
  },

  init: function() {
    AboutCharacters.characterselect.on('click', null, AboutCharacters.selectClass)
  }
}
$(function() {
  AboutCharacters.init();
});