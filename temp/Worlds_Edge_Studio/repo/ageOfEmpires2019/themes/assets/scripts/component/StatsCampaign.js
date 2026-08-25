import ajaxGet from '../util/ajaxGet';
import DonutChart from './StatsCircle';
import ProgressBarChart from './ChartProgressBar';
import Loading from "./Loading";

export default class StatsCampaign {
    constructor(options = {}) {
        console.log("statscampaign")
        this.init(options);
    }

    init(options) {
        let self = this;

        this.campaignProgressFloatLoader = new Loading({
            container: $('.js-campaignProgressFloatLoader'),
        });
        this.campaignProgressFloatLoader.show();
        let xhrs = [
            ajaxGet({
                 url: window.wp_object.ajaxurl + '?action=total_campaign_progress',
            }),
        ];
        Promise.all(xhrs).then((response) => {
            let res0 = response[0];
            let endPercent = +res0.value;
            endPercent = endPercent.toFixed(2);
            let progressData = {};
            progressData.label = 'Total Campaign Progress';
            progressData.value = endPercent;
            if (response) {
                new DonutChart({
                    radius: 82,
                    border: 34,
                    padding: 4,
                    type: 'progress',
                }, {
                    parent: '#chart-campaignprogress',
                    inset: '.chart-inset--campaignprogress',
                }, {
                    data: progressData,
                });
                self.campaignProgressFloatLoader.hide();
            } else {
                this._error();
            }
        }).catch(() => {
            this._error();
        });




        this.campaignProgressLoader = new Loading({
            container: $('.js-campaignProgressLoader'),
        });
        this.campaignProgressLoader.show();
        xhrs = [
            ajaxGet({
                url: window.wp_object.ajaxurl + '?action=campaign_progress',
            }),
        ];
        Promise.all(xhrs).then((response) => {
            let res = response[0]['Campaign01'];
            if (response) {
                new ProgressBarChart({
                    border: 50,
                    width: 908,
                    padding: 4,
                }, {
                    parent: '.bargraph-chart',
                    inset: null,
                }, {
                    data: res,
                });
                self.campaignProgressLoader.hide();
            } else {
                this._error();
            }
        }).catch(() => {
            this._error();
        });






        this.campaignProgressLoader2 = new Loading({
            container: $('.js-campaignProgressLoader-2'),
        });
        this.campaignProgressLoader2.show();
        xhrs = [
            ajaxGet({
                url: window.wp_object.ajaxurl + '?action=campaign_progress',
            }),
        ];
        Promise.all(xhrs).then((response) => {
            let res2 = response[0]['Campaign02'];
            if (response) {
                new ProgressBarChart({
                    border: 50,
                    width: 908,
                    padding: 4,
                }, {
                    parent: '.bargraph-chart-2',
                    inset: null,
                }, {
                    data: res2,
                });
                self.campaignProgressLoader2.hide();
            } else {
                this._error();
            }
        }).catch(() => {
            this._error();
        });





        this.campaignProgressLoader3 = new Loading({
            container: $('.js-campaignProgressLoader-3'),
        });
        this.campaignProgressLoader3.show();
        xhrs = [
            ajaxGet({
                url: window.wp_object.ajaxurl + '?action=campaign_progress',
            }),
        ];
        Promise.all(xhrs).then((response) => {
            let res3 = response[0]['Campaign03'];
            if (response) {
                new ProgressBarChart({
                    border: 50,
                    width: 908,
                    padding: 4,
                }, {
                    parent: '.bargraph-chart-3',
                    inset: null,
                }, {
                    data: res3,
                });
                self.campaignProgressLoader3.hide();
            } else {
                this._error();
            }
        }).catch(() => {
            this._error();
        });

        // this.victoriesLoader = new Loading({
        //     container: $('.js-victorytypesLoader'),
        // })
        //
        // this.victoriesLoader.show();
        //
        // xhrs = [
        //     ajaxGet({
        //         url: window.wp_object.jsonurl + 'chartVictoryType.json',
        //     }),
        // ];
        //
        // Promise.all(xhrs).then((response) => {
        //     console.log("hi")
        //     if (response) {
        //         let donutData = response;
        //         new DonutChart({
        //             radius: 106,
        //             border: 42,
        //             padding: 4,
        //             type: 'donut',
        //         }, {
        //             parent: '#chart-victorytype',
        //             inset: '.chart-inset--victorytype',
        //         }, {
        //             data: donutData,
        //         });
        //         self.victoriesLoader.hide();
        //     } else {
        //         this._error();
        //     }
        // }).catch(() => {
        //     this._error();
        // });

    }

    _error() {

    }
}
