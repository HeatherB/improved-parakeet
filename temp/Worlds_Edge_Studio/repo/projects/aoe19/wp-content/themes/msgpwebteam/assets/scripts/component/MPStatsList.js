import * as d3 from "d3";
import config from '../config';
import Loading from './Loading';
import ajaxGet from '../util/ajaxGet';

export default class MPStatsList {
    constructor(objOptions = {}) {
        console.log("MPStatsList")
        this.init(objOptions);
    }

    init(objOptions) {
        let self = this;
        this.options = Object.assign({
            apiPropNames            : null,                               // object of all api property names
            // resultsTemplate       : templateResults,                    // template for rendering results
            apiMPFull               : config.api.MPFull,
            apiMPMatchList          : config.api.MPMatchList,
            tempApi                 : window.wp_object.jsonurl + 'MPStatList.json',
        }, objOptions);

        this.data = {};

        let xhrs = [
            ajaxGet({
                url: self.options.apiMPFull,
            }),
        ];

        Promise.all(xhrs).then((response) => {
            //console.log("inside promise")
            //console.log(typeof response)
            //console.log("after typeof")
            //console.log(self.options.apiPropNames.results)
            //console.log("Response")
            //console.log(response)
            if (response) {
                if (response.hasOwnProperty(self.options.apiPropNames.results)) {
                    let resultsObj = response[self.options.apiPropNames.results];
                    self.data.results = resultsObj;
                    if (self.data.results['Victories']) {
                        this.renderVictoriesChart(self.data.results['Victories']);
                    }
                }
                console.log(response)
            } else {
                this._error();
            }
        }).catch(() => {
            this._error();
        });
    }
    _renderedVictoriesChart() {

    }
    _error() {

    }
}