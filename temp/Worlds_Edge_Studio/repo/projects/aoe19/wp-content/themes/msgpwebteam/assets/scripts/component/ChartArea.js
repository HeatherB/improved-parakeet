import * as d3 from "d3";
import config from '../config';
import ajaxGet from '../util/ajaxGet';

export default class ChartArea {
    constructor(objOptions, objUI, objData) {
        this.init(objOptions, objUI, objData);
    }
    init(objOptions, objUI, objData) {
        let self = this;

        this.options = Object.assign({
            margin: {
                top: 20,
                right: 15,
                bottom: 20,
                left: 50,
            },
            padding: 0,
            width: 1200,
            height: 500,
        });

        this.graph = Object.assign({
            data: (objData.data) ? objData.data : null,
        }, objData);

        this.width = this.options.width - this.options.margin.left - this.options.margin.right;
        this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        this.ui = Object.assign({
            $mount: '#chart-area',
        }, objUI);

       if(null !== this.options.data) {
           this._renderChart(this.graph.data);
       }

        $(window).on("resize", function () {
            // Set .right's width to the window width minus 480 pixels
            let windowWidth = self._getWidth();
            if (windowWidth < 1200) {
                self.options.width = self._getWidth();
                if (self.options.margin.right == 15) {
                    self.options.margin.right = self.options.margin.right * 1;
                }
                self.width = self.options.width - self.options.margin.left - self.options.margin.right;
            } else {
                if (self.options.margin.right != 15) {
                    self.options.margin.right = 15;
                }
                self.options.width = 1200;
                self.width = self.options.width - self.options.margin.left - self.options.margin.right;
            }
            self._renderChart(self.graph.data);
// Invoke the resize event immediately
        }).resize();

    }
    _getWidth() {
        return $('.js-stat-listings').width();
    }
    _renderChart(data) {
        $(this.ui.$mount).html('');

        let self = this;

        let allData = [];

        data.timeInAge.forEach(function (d) {
            d.value = +d.value;
            //d.value = Math.floor(d.value / 60) // change seconds to minutes
            d.name = d.name;
            allData.push(d);
        });

        data.timeToAge.forEach(function (d) {
            d.value = +d.value;
            //d.value = Math.floor(d.value / 60) // change seconds to minutes
            d.name = d.name;
            allData.push(d);
        });

        let timeIn = data.timeInAge;
        let timeTo = data.timeToAge;

        let dataLabelArr = [
          "Stone",
          "Iron",
          "Bronze",
          "Tool",
          "Finish",
        ];

        let x = d3.scalePoint()
            .domain(timeIn.map(function(d){return d.name}))
            .range([0, self.width])
          //.padding(.01)
        let y = d3.scaleLinear()
            .range([self.height, 0])
            .domain([0, d3.max(allData, function(d) { return d.value; })])
          .nice()

        let xAxis = d3.axisBottom()
            .scale(x)
            .tickSize(8);
        let yAxis = d3.axisLeft()
            .scale(y)
            .tickSize(8)
          .tickFormat(function (d) {
              var hours   = Math.floor(d / 3600);
              var minutes = Math.floor((d - (hours * 3600)) / 60);
              var seconds = d - (hours * 3600) - (minutes * 60);

              // round seconds
              seconds = Math.round(seconds * 100) / 100

              var result = (hours < 10 ? "0" + hours : hours);
              result += ":" + (minutes < 10 ? "0" + minutes : minutes);
              result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
              return result;
          })



        let area = d3.area()
            .x(function(d){ return x(d.name)})
            .y0(self.height)
            .y1(function (d) { return y(d.value) })

        let svg = d3.select(self.ui.$mount).append("svg")
            .attr("width", self.width + this.options.margin.left + this.options.margin.right)
            .attr("height", self.height + this.options.margin.top + this.options.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.options.margin.left + "," + this.options.margin.top + ")");

        svg.append("path")
            .datum(timeIn)
            .attr("fill", "#994022")
            .attr('fill-opacity', '.5')
            .attr("class", "chart-area__path")
            .attr('d', area)

        svg.append("path")
          .datum(timeTo)
          .attr("fill", "#f0a42f")
          .attr('fill-opacity', '.5')
          .attr("class", "chart-area__path")
          .attr('d', area)

        svg.append("g")
            .attr("fill", "#f1e9d0")
            .attr("class", "axis--white chart-area__g chart-area__g--y")
            .call(yAxis);

        svg.append("g")
            .attr("transform", "translate(0," + self.height + ")")
            .attr("class", "axis--white chart-area__g chart-area__g--x")
            .attr("fill", "#f1e9d0")
            .call(xAxis);
        //$(this.ui.$mount).html("width: "+ self.options.width);

        d3.selectAll('axis--white .tick line').attr("stroke", "#f1e9d0")
    }
    _error() {
    }
}

