'use strict';

/******************************************************************************
*
* Renders a hierarchical struture in a donut chart + sunburst style. 
*
*
* ... mmmm, donuts!
*******************************************************************************
*/


var DonutChart = function( data, config ) {

  config = config || {};



  // Defaults
  config.width = config.width || 400;
  config.height = config.height || 400; 
  config.segmentSize = config.segmentSize || 50;

  // Calculated
  config.radius = (config.width  * 0.4);


  // Helpers
  this.pie = d3.layout.pie()
    .sort(null)
    .startAngle(0)
    .value(function(d) { 
       return d.children.length; 
    });

  this.color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
 
  this.translate = function(x, y) {
    return 'translate(' + x + ',' + y + ')';
  };


  // All done
  this.config = config;
  this.data = data;

};


DonutChart.prototype.render = function( element ) {
  var _this = this;
  var svg, chart, arcs;

  var arc = d3.svg.arc()
    .outerRadius(_this.config.radius - _this.config.radius*0.5)
    .innerRadius(_this.config.radius - _this.config.radius*0.4);


  svg = d3.select(element).append('svg').attr('width' , _this.config.width).attr('height', _this.config.height);
  chart = svg.append('g').attr('transform', _this.translate(_this.config.width/2, _this.config.height/2));


  // Setting up, and injecting our own data
  arcs = chart.selectAll('.arc')
    .data(_this.pie( _this.data ))
    .enter()
    .append('g')
    .classed('arc', true)
    .each(function(d, idx) {
      d.children = _this.data[idx].children;
    });

  // Render arcs
  arcs.append('path')
    .attr('d', arc)
    .style("fill", function(d, i) { return _this.color(i); });

  // Render bursts
  arcs.each(function(d, idx) {
    var children = data[idx].children;
    var step = Math.abs( d.endAngle - d.startAngle)/children.length;
    var step_2 = step * 0.5;

    var parentArc = d3.select(this);

    children.forEach(function(child, cidx) {
      var segments = Math.ceil( child.size / _this.config.segmentSize );

      for (var j=0; j < segments; j ++) {
        parentArc.append('circle')
          .attr('cx',  (17*j + _this.config.radius*0.7) * Math.sin( step_2 + d.startAngle + cidx*step) )
          .attr('cy',  (17*j + _this.config.radius*0.7) * -Math.cos( step_2 + d.startAngle + cidx*step) )
          .attr('r', 6)
          .attr('fill', function(d) {
             return _this.color(idx);
          });
      } 

    });

  });

};
