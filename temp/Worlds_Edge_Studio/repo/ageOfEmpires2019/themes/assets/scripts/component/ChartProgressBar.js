/* eslint-disable */

import * as d3 from 'd3';
// import config from '../config';
// import ajaxGet from '../util/ajaxGet';
// import ajaxPost from '../util/ajaxPost';

export default class StatsCampaign {
    constructor(objOptions, objUI, objData) {
        this.init(objOptions, objUI, objData);
    }

    init(objOptions, objUI, objData) {
        this.options = Object.assign({
            width: '',
            height: '',
            axisMargin: 20,
            valueMargin: 4,
            margin: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
            },
            barHeight: 20,
            barBgHeight: 44, // barHeight + 24
            barPadding: 0,
            labelWidth: 60,
            color: d3.scaleOrdinal(d3.schemeCategory20c),
            variable: '',
            category: '',
            padAngle: '',
            floatFormat: '',
            cornerRadius: '',
            percentFormat: d3.format(',.2%'),
        }, objOptions);

        this.ui = Object.assign({
            parent: null,
            inset: null,
        }, objUI)

        if(null !== objData) {
            this.graph = {
            }
            this._renderProgressBarChart(objData.data);
        }

    }

    _renderProgressBarChart(data) {
        let self = this;
        data = data.sort(function (a, b) {
            return d3.ascending(a.label, b.label);
        });
        data.forEach(function (d) {
            d.value = +d.value;
        })

        //let max = d3.max(data, function(d) { return d.value; });
        let max = 8;

        let svg = d3.select(self.ui.parent)
            .append("svg")
            .attr("width", self.options.width)
            .attr("height", 'auto');

        let bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

        bar.attr("class", "bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + 0 + "," + (i * (self.options.barBgHeight + self.options.barPadding) + self.options.barPadding) + ")";
            });

        bar.append("text")
            .attr("class", "label")
            .attr('stroke-width', 1)
            .attr('stroke', '#000000')
            .attr('x', 8)
            .attr("y", 0)
            .attr("transform", "translate(0, 19)")
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
                return d.label;
            });

        let scale = d3.scaleLinear()
            .range([0, self.options.width - self.options.labelWidth*2])
            .domain([0, max])
        //
        let color = d3.scaleOrdinal()
            .domain(["Easy", "Medium", "Hard"])
            .range(["#f19d17", "#c1770d" , "#ae570a"]);

        let xAxis = d3.axisBottom(scale)
            .ticks(4)
            .tickFormat("")
            .tickSize(data.length*self.options.barBgHeight);

        // let barMaxWidth = scale(d3.max(data, function (d) {
        //     return d.value;
        // }));

        let barMaxWidth = 8;

        bar.append('rect')
            .attr('class', 'bar-bg')
            .attr("transform", "translate(0, 0)")
            .attr("height", self.options.barBgHeight)
            .attr('width', self.options.width)
            .style('fill', function (d, i) {
                if ( i%2 == 0 ) {
                    return 'rgba(204,166,85,.1)';
                } else {
                    return 'transparent';
                }
            });

        console.log("labelwidth")
        console.log(self.options.labelWidth)

        bar.append("rect")
            .attr('class', 'rect-bar')
            .attr("transform", "translate("+self.options.labelWidth+", "+(self.options.barBgHeight-self.options.barHeight)/2+")")
            .attr("height", self.options.barHeight)
            .attr('fill', function (d) {
                return color(d.label)
            })
            .transition()
            .duration(3000)
            .attr("width", function(d){
                return scale(d.value);
            });

        bar.append("text")
            .attr("class", "value")
            .attr("y", 19)
            .attr("dx", scale(max) + 46) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d){
                return (d.value + " of 8");
            })
            .attr("x", barMaxWidth + 56);

        svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (self.options.labelWidth) + ",0)")
            .call(xAxis);


    }

}