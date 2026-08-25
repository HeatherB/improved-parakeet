export default class CategorySelect {
    constructor() {
        this.init();
    }
    init() {
        this.ui = {
            $selectbox  : $('#categorySelect'),
            $option     : $('#categorySelect option'),
        }

        this._addEventListeners();
    }
    _addEventListeners() {
        this.ui.$selectbox.on('change', function (e) {
            e.preventDefault();
            let url = $(this).val();
            if (url) {
                window.location = url;
            }
            return false;
        });
    }
}