$(function(){
  $.widget('ui.gallery', {
    options: {
      thumbsPerPage: 12,
      pageLinkContext: 1
    },
    _init: function () {
      this._thumbs = this.element.find('a').lightBox({
        onSetItem: $.proxy(this._onLightboxSetItem, this),
        requiredVideoYearsOld: 17
      });
      this._nPages = Math.ceil(this._thumbs.length / this.options.thumbsPerPage);
      this._currentPage = 0;

      this._setupPagination();
      this._navigate(0);

    },

    _navigate: function (increment, increment_absolute) {
      var newval = increment_absolute ? increment : increment + this._currentPage;
      if(newval >= 0 || newval < this._nPages) {
        this._currentPage = newval;
      }

      this._enableLink(this._prev, this._currentPage === 0);
      this._enableLink(this._next, newval >= this._nPages - 1);

      // Show selected page of thumbs
      this._hide(this._thumbs.parent());
      var start = this._currentPage*this.options.thumbsPerPage;
      this._show(this._thumbs.slice(start, start+this.options.thumbsPerPage).parent());

      // Show pageLinkContext of links around current page link
      this._hide(this._pageLinks);
      start = this._currentPage - this.options.pageLinkContext;
      var end = start + (1+2*this.options.pageLinkContext);
      if(start < 0) { start = 0; }
      $.each(this._pageLinks, $.proxy(function (i, link) {
        page = parseInt(link.textContent, 10) - 1 ;
        if(page >= start || page < end) {
          this._show($(link)) ;
        }
      }, this));

      // Page elipses
      this._hide($('.elipses'));
      if(start >= 2) { this._show(this._firstPageElipses); }
      if(end <= this._nPages - 2) { this._show(this._lastPageElipses); }

      // Always show first/last
      this._show(this._firstPageLinks);
      this._show(this._lastPageLinks);

      // Disable only selected page
      this._pageLinks.removeClass('disabled');
      $.each(this._pageLinks, $.proxy(function (i, link) {
        page = parseInt(link.textContent, 10) - 1;
        if(page == this._currentPage) {
          $(link).addClass('disabled') ;
        }
      }, this));
    },

    _hide: function(o) {
      o.addClass('hidden') ;
    },

    _show: function(o) {
      o.removeClass('hidden') ;
    },

    _setupPagination: function () {
      var bottom_pagination = $(JST['templates/gallery_pagination']({
        nPages: this._nPages
      }));

      
      var left_pagination = $(JST['templates/gallery_side_pagination']({
          pon: 'prev'
      }));
      var right_pagination = $(JST['templates/gallery_side_pagination']({
          pon: 'next'
      }));
      
      left_pagination.prependTo(this.element);
      right_pagination.appendTo(this.element);
      bottom_pagination.appendTo(this.element);

      // prev/next
      this._prev = $('.prev_page')
      .click($.proxy(function (e) {
        this._handleNavClick(e, this._prev, -1, false);
      }, this));
      // next
      this._next = $('.next_page')
      .click($.proxy(function (e) {
        this._handleNavClick(e, this._next, 1, false);
      }, this));

      // page links and elipses
      this._pageLinks = this.element.find('a.page_link');
      $.each(this._pageLinks, $.proxy(function (i, link) {
        $(link).click($.proxy(function (e) {
          var page = parseInt(link.textContent, 10) - 1;
          this._handleNavClick(e, link, page, true);
        }, this));
      }, this));
      this._firstPageLinks = this.element.find('.first-page-link');
      this._lastPageLinks = this.element.find('.last-page-link');
      this._firstPageElipses = this.element.find('.first-page.elipses');
      this._lastPageElipses = this.element.find('.last-page.elipses');
    },
    _onLightboxSetItem: function (itemIndex) {
      var page = this._itemIndexToPage(itemIndex);
      if(page !== this._currentPage) {
        this._navigate(page, true);
      }
    },

    _itemIndexToPage: function (itemIndex) {
      return Math.floor(itemIndex/this.options.thumbsPerPage);
    },
    _handleNavClick: function (e, el, inc, abs) {
      e.preventDefault();
      if($(el).is('.disabled')) { return; }
      this._navigate(inc, abs);
    },
    _enableLink: function (el, en) {
      if(en) {
        el.addClass('disabled');
      } else {
        el.removeClass('disabled');
      }
    }
  });

  $('.gallery').gallery();
});
