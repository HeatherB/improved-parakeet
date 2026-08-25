import ClansSearchFilters from '../component/ClansSearchFilters';
import ClansSearchResults from '../component/ClansSearchResults';
import templateFeatured from '../templates/clansFeatured.html';

export default {
  init() {
    this.ui = {
      filters       : $('.clans-filters'),
      featuredGroup : $('.clans-featured'),
      results       : $('#clans-search-results'),
      pagination    : $('.pagination-container'),
    }

    // All API property names.
    // This is used so we don't have to update every line of the filters/results JS if the API names change.
    // We just have to update these values.
    this.apiPropNames = {
      term          : 'q',
      skill         : 'skill',
      activity      : 'activity',
      members       : 'memberRange',
      date          : 'dateRange',
      language      : 'language',
      searchby      : 'searchby',
      sortCategory  : 'sort',
      sortOrder     : 'sortOrder',
      startIndex    : 'paged',
      countMax      : 'postsPerPage',
      total         : 'totalCount',
      results       : 'clans',
    }

    this._initViews();
  },

  _initViews() {
    if (this.ui.filters.length) {
      this.ui.filters.each((i, el) => {
        let $curFilters = $(el);
        new ClansSearchFilters($curFilters, {
          apiPropNames : this.apiPropNames,
        });
      });
    }

    if (this.ui.featuredGroup.length) {
      this.ui.featuredGroup.each((i, el) => {
        let $curGroup = $(el);
        new ClansSearchResults($curGroup, {
          isFeaturedResults  : true,
          numCountMax        : 6,
          resultsTemplate    : templateFeatured,
          selectorBtnParams  : '.search-params',
          selectorResultItem : '.clans-featured__tile',
          showPagination     : false,
          apiPropNames       : this.apiPropNames,
        });
      });
    }

    if (this.ui.results.length) {
      this.ui.results.each((i, el) => {
        let $curResults = $(el);
        new ClansSearchResults($curResults, {
          apiPropNames : this.apiPropNames,
        });
      });
    }
  },
};
