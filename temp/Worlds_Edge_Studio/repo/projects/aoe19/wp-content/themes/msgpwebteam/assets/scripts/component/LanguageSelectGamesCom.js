import convertQueryStringToObject from '../util/convertQueryStringToObject';
export default class LanguageSelectGamesCom {
	constructor(objOptions) {
		this.init();
	}
	init() {
    this.Languages = ["de"];
	let params = convertQueryStringToObject() || {};
	if (params.lang == null || params.lang == "") {
		if (window.wp_object.locale != null && window.wp_object.locale != "") {
			let lang = window.wp_object.locale.replace(/^.*[-_]/gi, '');
			//console.log('Language: '+lang);
			if ( this.Languages.includes(lang.toLowerCase())) {
				location.href = "/gamescom-2019/"+lang.toLowerCase()+"?lang="+lang.toLowerCase();
			}
		}
    }
    this.ui = {
      select: $('#LanguageSelect'),
    };
    this._addEventListeners();
	}
	_addEventListeners() {
		this.ui.select.on('change', this._onChange.bind(this));
	}
	_onChange(e) {
		e.preventDefault();
		var lang = this.ui.select.find('option:selected').val();
		//console.log(lang);
		if(lang.toLowerCase() == "en") {
			location.href = "/gamescom-2019?lang="+lang.toLowerCase();
		} else if (lang != "" && this.Languages.includes(lang.toLowerCase())) {
			location.href = "/gamescom-2019/"+lang.toLowerCase()+"?lang="+lang.toLowerCase();
		}
	}
}
