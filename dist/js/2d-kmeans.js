var width = 800;
var height = 600;

var svg = d3.select("#js-londonmap").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style","background:rgba(0,0,0,0)");

drawMap(2);

function drawMap(kFlag){
    // $('#map').empty();
    d3.json("dist/data/london.geojson",function (json) {
            //create geo.path object, set the projection to merator bring it to the svg-viewport

                // Create a unit projection.
            var projection = d3.geo.albers()
                .scale(1)
                .translate([0, 0]);

            // Create a path generator.
            var path = d3.geo.path()
                .projection(projection);

            // Compute the bounds of a feature of interest, then derive scale & translate.
            var b = path.bounds(json),
                s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

            // Update the projection to use computed scale & translate.
            projection
                .scale(s)
                .translate(t);

            //drawing a map
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                // .attr("fill","#2F2F2F")
                .attr("stroke","white")
                .attr("d", path);

            //Name of district
            svg.selectAll("text")
                .data(json.features)
                .enter()
                .append("svg:text")
                .text(function(d){
                    return d.properties.name;
                    // return " ";
                })
                .attr("x", function(d){
                    return path.centroid(d)[0];
                })
                .attr("y", function(d){
                    return  path.centroid(d)[1];
                })
                .attr("fill","white")
                .attr("text-anchor","middle")
                .attr('font-size','7pt');


            // draw small points
            d3.json("notebooks/cluster.json",function (json) {
                // console.log(kFlag);
                // console.log(json[0].X)
                // console.log(projection([json[0].Y,json[0].X]));
                svg.selectAll("circle")
                    .data(json).enter()
                    .append("circle")
                    // .attr("cx", function (d) { console.log(projection(d)); return projection(d.Y)[0]; })
                    .attr("cx", function (d) { return projection([d.lon,d.lat])[0]; })
                    .attr("cy", function (d) { return projection([d.lon,d.lat])[1]; })
                    .attr("r", "2px")
                    .attr("class","prost-points")
                    .attr("fill", function(d){ 
                        var color = getColor(d.kmeans2);
                        switch(kFlag){
                            case 3:
                                color = getColor(d.kmeans3);
                                break;
                            case 4:
                                color = getColor(d.kmeans4);
                                break;
                            case 5:
                                color = getColor(d.kmeans5);
                                break;
                            case 6:
                                color = getColor(d.kmeans6);
                                break;
                        }
                        return color});

                var k2 = [[-0.21196502847330773, 51.50016899082028], [0.012658447132919583, 51.515914969265054]];

                var k3 = [[-0.09920349744736034, 51.50938925989318], [-0.31281720306217314, 51.496047862541744], [0.09297534844983701, 51.51086459586324]];

                var k4 =[[-0.3338654314747769, 51.517091639694655], [0.0894639642360957, 51.51366938493721], [-0.10814862420794083, 51.53900849303768], [-0.13019760646462827, 51.430245134008835]];

                 var k5 = [[0.10306148210516339, 51.50583788619866], [-0.09041817046309002, 51.538700185839446], [-0.4017705175862271, 51.51003635133509], [-0.2327686189695014, 51.506221785133704], [-0.0961201260647206, 51.409385222061054]];
                
                 var k6 =[[-0.056069828823752554, 51.40334877748558], [-0.11272951467098788, 51.56242165052308], [-0.3554630790209041, 51.50983152054485], [-0.16985632915537652, 51.48408794482532], [0.1332605412195496, 51.51602156175918], [-0.01522703888203801, 51.529517316731244]]; 


                var allKmeans = [k2,k3,k4,k5,k6];

                //set delay because of layers in svg
                // var delay=5000; //1 second
                // setTimeout(function() {
                    for (var i = 0; i < allKmeans.length; i++) {
                        // console.log(allKmeans[i]);
                        svg.selectAll("circles")
                            .data(allKmeans[i]).enter()
                            .append("circle")
                            .attr("class", "centroid " + "k"+(i+2))
                            .attr("stroke","#dedede")
                            .attr("stroke-width","3")
                            .attr("visibility","hidden")
                            .attr("cx", function (d) { return projection(d)[0]; })
                            .attr("cy", function (d) { return projection(d)[1]; })
                            .attr("r", "10px")
                            .attr("fill", function(d,k){ return getColor(k) } );
                    }

                    svg.selectAll("circle").filter(".k2")
                        .attr("visibility","visible"); 

            });
                // }, delay); 

            kTitle = "Showing K-2"
            //title
            svg.append("text")
            .attr("class", "kTitle")
            .attr("fill","white")
            .attr("style", "font-size: 1.3em;")
            .attr("text-anchor", "end")
            .attr("x", 220)
            .attr("y", 60)
            .text(kTitle);
            });
}

//a color palete for points
function getColor(i){
    var dict = {0:"#88d5d2", 1:"#9c9d47", 2:"#fec842",3:"#e97a2e",4:"#834e71",5:"red"}
    return dict[i];
}

//changes colors of points based on kFlag = Kmeans
function repaintPoints(kFlag){
     svg.selectAll("circle").filter(".prost-points")
        .attr("fill", function(d){ 
            var color = getColor(d.kmeans2);
            switch(kFlag){
                case 3:
                    color = getColor(d.kmeans3);
                    break;
                case 4:
                    color = getColor(d.kmeans4);
                    break;
                case 5:
                    color = getColor(d.kmeans5);
                    break;
                case 6:
                    color = getColor(d.kmeans6);
                    break;
            }
            return color});                

    svg.selectAll("circle").filter(".centroid")
        .attr("visibility","hidden"); 


    switch(kFlag){
        case 2: 
            svg.selectAll("circle").filter(".k2")
                .attr("visibility","visible") 
            break;
        case 3:
            svg.selectAll("circle").filter(".k3")
                .attr("visibility","visible") 
            break;
        case 4:
            svg.selectAll("circle").filter(".k4")
                .attr("visibility","visible") 
            break;
        case 5:
            svg.selectAll("circle").filter(".k5")
                .attr("visibility","visible") 
            break;
        case 6:
            svg.selectAll("circle").filter(".k6")
                .attr("visibility","visible") 
            break;
    }

    svg.selectAll("text").filter(".kTitle")
        .text("Showing K-" + kFlag);
}