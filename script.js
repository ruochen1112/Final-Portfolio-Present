


var margin = {top: 30, right: 20, bottom: 50, left: 30}
var width = 1100;
var height = 250;
var padding = -10; 



var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"; 
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block"; 
  dots[slideIndex-1].className += " active";
}



   creatmap();




  


function creatmap() {


    var map = L.map('map').setView([41.88, -87.63], 12);
        mapLink = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);




// L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
//   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   subdomains: 'abcd',
//   minZoom: 0,
//   maxZoom: 20,
//   ext: 'png'
// })

  
    
    var svg = d3.select("#map")
    .select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom*2);

    d3.json("geodata.json", function(error,collection) {
      if(error){
        console.log(error);
      } else {

        collection[0].features.forEach(function(d){
            d.LatLng = new L.LatLng(d.geometry.coordinates[1],
                                    d.geometry.coordinates[0])


            var markerLocation = d.LatLng;
            var color = {icon: orangeIcon};
            if (d.properties.rating == "Level 3"){color = {icon: greyIcon};}
            else if (d.properties.rating == "Level 2"){color = {icon: yellowIcon};}


            var marker = new L.Marker(markerLocation,color).bindPopup("Name:"+d.properties.School_Name+"<br/>"
              +"Rating: "+d.properties.rating +"<br/>"+ "Gang Activeties: "+d.properties.Counts);
                
           map.addLayer(marker);

          });

        };

    });



var yellowIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

  var orangeIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


var greyIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



};


 

d3.csv("gang.csv", function(error, data){
    var input = data.filter(function(d){ return true;});
    var tmp = data.filter(function(d){ return d["SchoolName"] == "Air Force Academy High School";});


  creatbar();  


  });

  
                  

 function  creatbar() {


  var svg = d3.select("#bar")
     .append("svg")
     .attr("width", width + margin.left + margin.right*6)
     .attr("height", height + margin.top + margin.bottom*5);
 
  var g = svg.append('g')
     .attr("transform", "translate(" + margin.left*5+ "," + margin.top*6 + ")")

  



d3.csv("gang.csv", function(error, data){
    var input = data.filter(function(d){ return true;});
    var tmp = data.filter(function(d){ return d["SchoolName"] == "Air Force Academy High School";});

  var y = d3.scale.linear()
         .domain([0, d3.max(tmp, function(d){
         return +d["TOTAL"];
         })])
         .range([0,height]);

  var x = d3.scale.ordinal()
      .domain(tmp.map(function(d){ return d.NAME;}))
      .rangeBands([0, width]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+padding+",0)")
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.15em")
        .attr("transform", "rotate(90)" );


  g.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  g.selectAll("rectangle")
    .data(tmp)
    .enter()
    .append("rect")
    .attr("class","rectangle")
    .attr("width", width / tmp.length)
    .attr("height", function(d){
      return y(+d["TOTAL"]);
    })
    .attr("x", function(d, i){
      return (width / tmp.length) * i ;
    })
    .attr("y",0 );

  var selector = d3.select("#drop")
      .append("select")
      .attr("id","dropdown")
      .on("change", function(d){
          selection = document.getElementById("dropdown");
            var change = data.filter(function(d){ return d["SchoolName"] == selection.value;});
            y.domain([0, d3.max(change, function(d){ return +d["TOTAL"]; })]).range([0,height]);;
            console.log(change);
            x.domain(change.map(function(d){ return d["NAME"]; })).rangeBands([0, width]);;

          yAxis.scale(y);
          
           g.selectAll(".rectangle")
              .data(change, function(d) { return d.NAME})
              .exit().remove()
 
            g.selectAll(".rectangle")
              .data(change, function(d) { return d.NAME})
              .enter()
              .append("rect")
              .attr("class", "rectangle")
              .attr("x", function(d, i){
                return ( width / change.length) * i ;
              })
              .attr("y", 0)
              .attr("width", width / change.length)
              .transition().duration(2000)
              .attr("height", function(d){
                return y(+d["TOTAL"]);
              });
 
            g.selectAll(".rectangle")
              .data(change, function(d) { return d.NAME})
              .attr("x", function(d, i){
                return ( width / change.length) * i ;
              })
              .attr("width", width / change.length)
              .transition().duration(2000)
              .attr("height", function(d){
                return y(+d["TOTAL"]);
              });
      
            d3.selectAll("g.y.axis")
            
              .transition()
              .call(yAxis);
            d3.selectAll("g.x.axis")
              .transition()
              .call(xAxis)
              .selectAll("text")
             .style("text-anchor", "end")
             .attr("dx", "-.8em")
             .attr("dy", "-.15em")
             .attr("transform", "rotate(90)");

         });

    selector.selectAll("option")
      .data(d3.map(input, function(d){return d["SchoolName"];}).keys())
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return d;
      })

//    g.append("text")
  //  .attr("class", "lableText")
 //   .attr("dx", "25em")
   // .attr("dy", "-9em")            
   // .style("text-anchor", "middle")
    //.text("Active Gangs");

    g.append("text")
    .attr("class", "lableText")
    .attr("transform", "rotate(-90)")
    .attr("dx", "-8em")
    .attr("dy", "-2.5em")
    .text("Counts");
})
};












 


                    


