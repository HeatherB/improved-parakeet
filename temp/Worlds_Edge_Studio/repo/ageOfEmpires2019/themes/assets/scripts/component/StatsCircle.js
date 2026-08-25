import * as d3 from 'd3';
import ajaxGet from '../util/ajaxGet';


export default class StatsCircle {
    constructor(objOptions, objUI, objData) {
        this.init(objOptions, objUI, objData);
    }
    init(objOptions, objUI, objData) {
        let self = this;

        this.originalRadius = objOptions.radius;
        this.originalBorder = objOptions.border;
        this.onceLaoded = null;
        this.options = Object.assign({
            radius: 70,
            border: 0,
            padding: 20,
            type: 'progress', //default is progress
        }, objOptions)
        this.ui = Object.assign({
            parent: 'div#content',
            inset: '.progress-circle__inset',
        }, objUI)
        let cachedWidth = $(window).width();
        this.donutCountCheck = 0;
        this.progressCountCheck = 0;
        let windowWidth;
        if(null !== objData && this.options.type == 'progress') {
            let value = parseFloat(objData.data.value);
            this.graph = {
                startPercent: 0,
                endPercent: value,
            }
            $(window).on("resize", function () {
                windowWidth = $(window).width();
                if (windowWidth < 460) {
                    self.options.radius = 65;
                    self.options.border = 25;
                } else {
                    self.options.radius = self.originalRadius;
                    self.options.border = self.originalBorder;
                }
                if(cachedWidth != windowWidth || self.progressCountCheck == 0) {
                    self._renderProgressChart(self.onceLoaded);
                }
            }).resize();
        } else if(null !== objData && this.options.type == 'donut') {
            this.graph = {
                data: objData.data,
            }
            $(window).on("resize", function () {
                    windowWidth = $(window).width();
                    /*console.log('Resizing!!!');*/
                    if (windowWidth < 460) {
                        self.transformWidth = $('.js-victories-loader').width() / 2;
                        self.options.radius = 65;
                        self.options.border = 25;
                        self.svgWidth = '100%';
                    } else {
                        self.transformWidth = $('.js-victories-loader').width() / 2;
                        self.options.radius = self.originalRadius;
                        self.options.border = self.originalBorder;
                        self.svgWidth = '100%';
                    }

                    if(cachedWidth != windowWidth || self.donutCountCheck == 0) {
                        self._renderDonutChart();
                    }
            }).resize();
        }
    }
    _getTheRightWidth() {
        return $('.js-victories-loader').width() / 2;
    }
    _renderDonutChart() {
        let self = this;
        if (self.transformWidth > 300) {
            self.transformWidth = this._getTheRightWidth();
        }
        $(self.ui.parent).html('');
        let textOffset = 14;

        /*console.log('Graph Data: ' + JSON.stringify(self.graph.data) );*/

        self.graph.data.forEach(function (d) {
            d.value = +d.value;
        })

        let boxSize = (self.options.radius + self.options.padding) * 2;
        let parent = d3.select(self.ui.parent);
        //let color = d3.scaleOrdinal(['#dc8710', '#9e3400', '#f19b12']);
        let color = d3.scaleOrdinal([
            '#efc94c',
            '#dbb442',
            '#c59c35',
            '#af8528',
            '#996d1c',
            '#83560f',
            '#693d04',
        ]);
        let svg = parent.append('svg')
            .attr('width', self.svgWidth)
            .attr('height', boxSize)
          .attr('class', 'donut-svg')

        let donutWrapper = svg.append('g')
          .attr('class', 'donut-wrapper')
            .attr('transform', 'translate('+ self._getTheRightWidth() + ',' + boxSize / 2 + ')');
        donutWrapper.append('g')
            .attr('class', 'slices')
        donutWrapper.append("g")
            .attr("class", "labelName")
        donutWrapper.append("g")
            .attr("class", "labelValue")
        donutWrapper.append("g")
            .attr("class", "lines")
        donutWrapper.append("div")
            .attr("class", "progress-circle__box--victorytype")
        let arc = d3.arc()
            .innerRadius(self.options.radius - self.options.border)
            .outerRadius(self.options.radius);
        let outerArc = d3.arc()
            .innerRadius((self.options.radius - self.options.border))
            .outerRadius((self.options.radius));
        let legendRectSize = self.options.radius * 0.05;
        let legendSpacing  = self.options.radius * 0.02;
        let pie = d3.pie()
            .value(function(d) { return d.value; })
            .sort(null);
        let slice = svg.select('.slices')
            .selectAll('path.slice')
            .data(pie(self.graph.data))
            .enter()
            .append('path')
            .attr("class", "slice")
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.name);
            })
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || 0;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            })
        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }
        let text = svg.select(".labelName").selectAll("text")
            .data(pie(self.graph.data))
            .enter()
            .append("text")
            .attr('class', 'label')
            .attr("dy", "0.35em")
            .style('text-anchor', function(d) {
                // if slice centre is on the left, anchor text to start, otherwise anchor to end
                return (midAngle(d)) < Math.PI ? 'start' : 'end';
            })
            .style("fill", "white")
            .text(function(d) {
                return (" " + d.data.name+": " +d.value+ "");
            })
            .transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = self.options.radius * 1.1 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            })
            .text(function(d) {
                /*console.log('d.data.name ', d.data.name);*/
                return (d.data.name + ": " + d.value) + "%";
            })


        let polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(self.graph.data))
            .enter()
            .append("polyline")
            .attr('points', function(d) {
                var pos = outerArc.centroid(d);
                pos[0] = self.options.radius * 0.9 * (midAngle(d) < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos]
            })
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", "1px");

        let prev;
        // text.each(function(d, i) {
        //     if(i > 0) {
        //         let thisbb = this.getBoundingClientRect(),
        //             prevbb = prev.getBoundingClientRect();
        //         // move if they overlap
        //         console.log(thisbb.left);
        //         console.log(prevbb.right);
        //         if(!(thisbb.right < prevbb.left ||
        //             thisbb.left > prevbb.right ||
        //             thisbb.bottom < prevbb.top ||
        //             thisbb.top > prevbb.bottom)) {
        //             console.log("BBBBBBB")
        //             var ctx = thisbb.left + (thisbb.right - thisbb.left)/2,
        //                 cty = thisbb.top + (thisbb.bottom - thisbb.top)/2,
        //                 cpx = prevbb.left + (prevbb.right - prevbb.left)/2,
        //                 cpy = prevbb.top + (prevbb.bottom - prevbb.top)/2,
        //                 off = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2))/2;
        //             d3.select(this).attr("transform",
        //                 "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) *
        //                 (self.options.radius + textOffset + off) + "," +
        //                 Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) *
        //                 (self.options.radius + textOffset + off) + ")");
        //         }
        //     }
        //     prev = this;
        // });
        let alpha = 1.9;
        let spacing = 12;

        function relax() {
            let again = false;
            text.each(function (d, i) {
                let a = this;
                let da = d3.select(a);
                let y1 = da.attr("y");
                text.each(function (d, j) {
                    let b = this;
                    // a & b are the same element and don't collide.
                    if (a == b) return;
                    let db = d3.select(b);
                    // a & b are on opposite sides of the chart and
                    // don't collide
                    if (da.attr("text-anchor") != db.attr("text-anchor")) return;
                    // Now let's calculate the distance between
                    // these elements.
                    let y2 = db.attr("y");
                    let deltaY = y1 - y2;

                    // Our spacing is greater than our specified spacing,
                    // so they don't collide.
                    if (Math.abs(deltaY) > spacing) return;

                    // If the labels collide, we'll push each
                    // of the two labels up and down a little bit.
                    again = true;
                    let sign = deltaY > 0 ? 1 : -1;
                    let adjust = sign * alpha;
                    da.attr("y",+y1 + adjust);
                    db.attr("y",+y2 - adjust);
                });
            });
            // Adjust our line leaders here
            // so that they follow the labels.
            // if(again) {
            //     let  labelElements = text;
            //     polyline.attr("y2",function(d,i) {
            //         let labelForLine = d3.select(labelElements[i]);
            //         return labelForLine.attr("y");
            //     });
            //     setTimeout(relax,20)
            // }
        }

       // relax();
        this.donutCountCheck = 1;


    }

    _renderProgressChart(onceLoaded) {
        let self = this;
        $(self.ui.parent).html('');
        let colors = {
            'bgColor': '#efc94c',
        };
        let color = colors.bgColor;
        let twoPi = Math.PI * 2;
        let formatPercent = d3.format('.0%');
        let boxSize = (this.options.radius + this.options.padding) * 2;
        //TODO: replace end/startpercent with dynamic variable
        let count = Math.abs((self.graph.endPercent - self.graph.startPercent) / 0.01);
        // Info -- Count is win percentage
        /*console.log('Count: ' + count);*/
        let step = self.graph.endPercent < self.graph.startPercent ? -0.01 : 0.01;
        let arc = d3.arc()
            .startAngle(0)
            .innerRadius(self.options.radius)
            .outerRadius(self.options.radius - self.options.border);

        let parent = d3.select(self.ui.parent);

        let svg = parent.append('svg')
            .attr('width', boxSize)
            .attr('height', boxSize);

        let defs = svg.append('defs');

        var gradient = defs.append('linearGradient')
        .attr('id', 'gradientFill');

        gradient.attr('gradientTransform','rotate(90)');
        gradient.append('stop').attr('offset','5%').attr('stop-color','#efc94c');
        gradient.append('stop').attr('offset','90%').attr('stop-color','#996d1c');

        let g = svg.append('g')
            .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');

        let meter = g.append('g')
            .attr('class', 'progress-meter');

        meter.append('path')
            .attr('class', 'background')
            .attr('fill', '#693d04')
            // .attr('fill-opacity', 0.5)
            .attr('d', arc.endAngle(twoPi));

        let foreground = meter.append('path')
            .attr('class', 'foreground')
            .style('fill', 'url(#gradientFill)')
            .attr('fill-opacity', 1)
            .attr('stroke', 'url(#gradientFill)')

        let front = meter.append('path')
            .attr('class', 'foreground')
            .style('fill', 'url(#gradientFill)')
            .attr('fill-opacity', 1);

        let numberText = meter.append('text')
            .attr('fill', '#fff')
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .attr('font-weight', '900')
            .attr('font-size', '32px')
            .attr('dy', '.35em')


        function updateProgress(progress) {
            foreground.attr('d', arc.endAngle(twoPi * progress));
            front.attr('d', arc.endAngle(twoPi * progress));
            numberText.text(formatPercent(progress));
            //$(self.ui.inset).html('<p>'+formatPercent(progress)+'</p>')
        }

        let progress = this.graph.startPercent;

        (function loops() {
            if (self.onceLoaded != true) {
                updateProgress(progress);

                if (count > 0) {
                    count--;
                    progress += step;
                    setTimeout(loops, 30);
                } else {
                    self.onceLoaded = true;
                }
            } else if (self.onceLoaded == true){
                foreground.attr('d', arc.endAngle(twoPi * self.graph.endPercent));
                front.attr('d', arc.endAngle(twoPi * self.graph.endPercent));
                numberText.text(formatPercent(self.graph.endPercent))
            }
        })();
        this.progressCountCheck = 0;
    }

    _error() {

    }
}
