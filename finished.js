'use strict';

(function () {
    /*////////////////////
    ////////////////////////
  
    For this assignment, I followed along to this guide:
    http://bl.ocks.org/nnattawat/8916402
  
    ////////////////////////
    *////////////////////////

    var episodeData = '';
    var seasonData = '';
    var svg = '';
    var margin = { top: 20, right: 20, bottom: 70, left: 60 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // load data and make scatter plot after window loads
    window.onload = function () {
        d3.csv("seasons.csv", function (data) {
            data['Avg. Viewers (mil)'] = +data['Avg. Viewers (mil)'];
            data.Year = +data.Year;
            return data;
        }, function (rows) {
            seasonData = rows;
        });
        // d3.csv is basically fetch but it can be be passed a csv file as a parameter
        d3.csv("episodes.csv", function (data) {
            data['U.S. Viewers'] = +data['U.S. Viewers'];
            data.Season = +data.Season;
            return data;
        }, function (rows) {
            makeScatterPlot(rows);
        });


    }

    // make scatter plot with trend line
    function makeScatterPlot(csvData) {
        var color = "steelblue";
        episodeData = csvData


        // A formatter for counts.
        var formatCount = d3.format(",.0f");



        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        svg = d3.select(".container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        x.domain(seasonData.map(function (d) { return d.Year; }));
        y.domain([0, d3.max(seasonData, function (d) { return d['Avg. Viewers (mil)'] + 3; })]);

        plotData(x, y, xAxis, yAxis);
    }

    function plotData(x, y, xAxis, yAxis) {

        var bar = svg.selectAll(".bar")
            .data(seasonData)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) { return "translate(" + x(d.Year) + "," + y(d['Avg. Viewers (mil)']) + ")"; });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -15)
            .attr("x", 15)
            .attr("text-anchor", "middle")
            .text(function (d) { return d['Avg. Viewers (mil)'] });

        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll('bar')
            .data(seasonData)
            .enter().append("rect")
            .style("fill", function (d) {
                if (d.Data == "Actual") {
                    return "steelblue"
                }
                return "gray"
            })
            .style("stroke", "black")
            .attr("x", function (d) { return x(d.Year); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(d['Avg. Viewers (mil)']); })
            .attr("height", function (d) { return height - y(d['Avg. Viewers (mil)']); })
            .on("mouseover", (d) => {
                d3.select(d3.event.target).style("stroke", "white");
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(
                    'Season # ' + d.Year + "<br/>" +
                    'Year: ' + d.Year + "<br/>" +
                    'Episodes: ' + d.Episodes + "<br/>" +
                    'Avg. Viewers (mil): ' + d['Avg. Viewers (mil)'] + "<br/>" +
                    "<br/>" +
                    'Most Watched Episode: ' + d['Most watched episode'] + "<br/>" +
                    'Viewers (mil): ' + d['Viewers (mil)']

                )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("width", "auto")
                    .style("height", "auto")
                    .style("text-align", "left")
                    .style("padding", ".5em");
            })
            .on("mouseout", (d) => {
                d3.select(d3.event.target).style("stroke", "black");
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");


        // Find average and draw line along the average viewership
        var allAverages = seasonData.map((row) => row['Avg. Viewers (mil)']);
        var total = 0;
        for (var i = 0; i < allAverages.length; i++) {
            total += allAverages[i];
        }
        var totalAvg = Math.round((total / seasonData.length) * 10) / 10;


        svg.append("line")
            .attr("x1", 0)
            .attr("y1", y(totalAvg))
            .attr("x2", width)
            .attr("y2", y(totalAvg))
            .attr("stroke-width", 2)
            .attr("stroke", "white")
            .style("opacity", "0.5");

        svg.append("rect")
            .style("fill", "white")
            .style("opacity", "0.5")
            .attr("x", 0)
            .attr("width", 40)
            .attr("y", y(totalAvg) - 15)
            .attr("height", 15);

        svg.append("text")
            .attr("dy", ".75em")
            .style("font-size", "12px")
            .attr("y", y(totalAvg) - 12)
            .attr("x", 25)
            .attr("text-anchor", "middle")
            .text(totalAvg);


        svg.append('text')
            .attr('transform', 'translate(-40, 300)rotate(-90)')
            .style('font-size', '13pt')
            .text('Avg. Viewers (in millions)');

        svg.append('text')
            .attr('x', 420)
            .attr('y', 480)
            .style('font-size', '13pt')
            .text("Season Year");

        svg.append("rect")
            .style("fill", "steelblue")
            .style("stroke", "black")
            .attr("x", "650")
            .attr("y", "30")
            .attr("width", "20px")
            .attr("height", "20px")

            svg.append("rect")
            .style("fill", "gray")
            .style("stroke", "black")
            .attr("x", "650")
            .attr("y", "60")
            .attr("width", "20px")
            .attr("height", "20px")

            svg.append('text')
            .attr('x', 675)
            .attr('y', 77)
            .style('font-size', '13pt')
            .text("Estimated");

            svg.append('text')
            .attr('x', 675)
            .attr('y', 47)
            .style('font-size', '13pt')
            .text("Actual");

            svg.append('text')
            .attr('x', 650)
            .attr('y', 20)
            .style('font-size', '13pt')
            .text("Viewership Data:");




        // Add a silly image
        var img = document.createElement("img");
        img.src = "homer.jpg";

        var src = document.getElementById("container");
        src.appendChild(img);

    }


})();
