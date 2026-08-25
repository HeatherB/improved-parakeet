import * as d3 from 'd3';

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

      $(self.ui.parent).html('');

      if (self.transformWidth > 300) {
        self.transformWidth = this._getTheRightWidth();
      }

      let boxSize = (self.options.radius + self.options.padding) * 2;

      var height = boxSize;
      var width = self.svgWidth;

      let color = d3.scaleOrdinal([
        '#ffcd57',
        '#f4ac43',
        '#e68c35',
        '#d76b2b',
        '#c54a26',
        '#b02323',
      ]);

      var svg = d3.select(self.ui.parent).append('svg').attr('width', width).attr('height', height)
        .append('g')
        .attr('transform', 'translate('+ self._getTheRightWidth() + ',' + boxSize / 2 + ')');

      let arc = d3.arc()
        .innerRadius(self.options.radius - self.options.border)
        .outerRadius(self.options.radius);
      let outerArc = d3.arc()
        .innerRadius((self.options.radius - self.options.border))
        .outerRadius((self.options.radius));

      var pie = d3.pie()
        .value((d) => d.value)
        .sort(null)

      var path = svg
        .selectAll('path')
        .data(pie(self.graph.data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(d.data.name));


        path.on("mouseover", function(d) {
          $('.legend').hide();
          let g = d3.select(this);
            g.style("opacity", "0.9")
            .style("cursor", "pointer");

            let details = svg.append('g').attr("class", "text-group");

            details.append("text")
              .attr("class", "name-text")
              .text(`${d.data.name}`)
              .attr('text-anchor', 'middle')
              .attr('dy', '-1.2em')
              .attr('fill','#f1e9d0')

            details.append("text")
              .attr("class", "value-text")
              .text(`${d.data.value}%`)
              .attr('text-anchor', 'middle')
              .attr('dy', '.6em')
              .attr('fill','#f1e9d0');
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")
            .style("opacity", '1');
            $(".text-group").remove();
            $(".legend").show();
        })


      var legendItemSize = 18
      var legendSpacing = 4

      var legend = svg
        .selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => {
          var height = legendItemSize + legendSpacing
          var offset = height * color.domain().length / 2
          var x = legendItemSize * -3;
          var y = (i * height) - offset
          return `translate(${x}, ${y})`
        })

      legend
        .append('rect')
        .attr('width', legendItemSize)
        .attr('height', legendItemSize)
        .style('fill', color);

      legend
        .append('text')
        .attr('x', legendItemSize + legendSpacing)
        .attr('y', legendItemSize - legendSpacing)
        .text((d) => d)
        .style('fill', '#f1e9d0');
    }
}
