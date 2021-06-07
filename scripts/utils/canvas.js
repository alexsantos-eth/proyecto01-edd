"use strict";
var width = window.innerWidth;
var height = window.innerHeight;
var svg = d3
    .select('svg')
    .attr('width', width - 60 + "px")
    .attr('height', height - 60 - 50 + "px");
var resetted = function () {
    return svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
};
var zoomed = function () {
    view.attr('transform', d3.event.transform);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
};
var zoom = d3
    .zoom()
    .scaleExtent([1, 40])
    .translateExtent([
    [-100, -100],
    [width + 90, height + 100],
])
    .on('zoom', zoomed);
var x = d3
    .scaleLinear()
    .domain([-1, width + 1])
    .range([-1, width + 1]);
var y = d3
    .scaleLinear()
    .domain([-1, height + 1])
    .range([-1, height + 1]);
var xAxis = d3
    .axisBottom(x)
    .ticks(((width + 2) / (height + 2)) * 10)
    .tickSize(height)
    .tickPadding(8 - height)
    .tickFormat('');
var yAxis = d3
    .axisRight(y)
    .ticks(10)
    .tickSize(width)
    .tickPadding(8 - width)
    .tickFormat('');
var view = svg
    .append('rect')
    .attr('class', 'view')
    .attr('x', 0.5)
    .attr('y', 0.5)
    .attr('width', width - 1)
    .attr('height', height - 1);
var gX = svg.append('g').attr('class', 'axis axis--x').call(xAxis);
var gY = svg.append('g').attr('class', 'axis axis--y').call(yAxis);
d3.select('.reset').on('click', resetted);
svg.call(zoom);
