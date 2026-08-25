export default class SubstanceAccordion {
    constructor() {
        this.init();
    }

    init() {
        this._addEventListeners();
    }

    _addEventListeners() {
        let self = this;

        $('#insiders-landing-faqs .title').on('click', function () {
            if ($(this).parent().hasClass('open')) {
                $(this).parent().removeClass('open');
            } else {
                $(this).parent().addClass('open');
            }
        });

        $('.cordian a.title').on('click', function () {
            if ($(this).parent().hasClass('open')) {
                $(this).parent().removeClass('open');
            } else {
                $(this).parent().addClass('open');
            }
        });

        $('.cordian span.title').on('click', function () {
            if ($(this).parent().hasClass('disabled')) {
                return false;
            } else if ($(this).parent().hasClass('sub_ac_open')) {
                $(this).parent().removeClass('sub_ac_open');
            } else {
                $('.sub_ac_open').removeClass('sub_ac_open');
                $(this).parent().addClass('sub_ac_open');
            }
        });

    }
}
