(function ($, Drupal) {
    'use strict';
   // console.log("map");

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

    var tooltipOffset = { x: -8, y: -65 };

    function showTooltip(d) {
    moveTooltip();

    tooltip.style("display", "block")
        .text(d);
    }

    function moveTooltip() {
    tooltip.style("top", (d3.event.pageY + tooltipOffset.y) + "px")
        .style("left", (d3.event.pageX + tooltipOffset.x) + "px");
    }

    function hideTooltip() {
    tooltip.style("display", "none");
    }

    d3.selectAll('.feature')
    .on('mouseover', function () {
        var t = d3.select(this);
        t.attr("x", 0).attr("y", 0);
        showTooltip(t.attr('id'));
    })
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

})(jQuery, Drupal);