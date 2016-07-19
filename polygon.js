var state_code;
var yelp_data;
var marker=[];

var scores=[];
function showButtonBar() {
   document.getElementById('buttonControllerMenu').style.display = "block";
}

function ButtonControl(controlDiv, map, category) {

        // Set CSS for the control border.
        var controlUI = document.createElement('button');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '8px solid #fff';
          controlUI.style.fontSize = '16px';
        controlUI.style.borderRadius = '6px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.style.marginLeft = '15px';
        
        controlUI.title = 'Click to get the ' +category+' recommendations of this area';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createTextNode(category);
        controlUI.appendChild(controlText);

        
        controlUI.addEventListener('click', function(event) {


//Function to clear previous markers on map          
clearPreviousMarkers();



for(var key in yelp_data[state_code].business_types[category].business_name){



if(yelp_data[state_code].name=="IL" || yelp_data[state_code].name=="NC"||yelp_data[state_code].name=="PA"){




placeMarker({lat:Number(yelp_data[state_code].business_types[category].business_name[key].latitude) , lng:Number(yelp_data[state_code].business_types[category].business_name[key].longitude) },map,yelp_data[state_code].business_types[category].business_name[key].reviews,key,yelp_data[state_code].business_types[category].business_name[key].scores);

}

 else noDataPrompt(yelp_data[state_code].name);

}


//function to zoom into markers on clickling the category

var bounds = new google.maps.LatLngBounds();
for (var i = 0; i < marker.length; i++) {
 bounds.extend(marker[i].getPosition());
}

map.fitBounds(bounds);

//end of above function


        });

      }




 function initMap() {


//get the json data for business types via ajax


$.getJSON("http://172.26.179.13:8080/final.data", function(result){
        
        yelp_data=result;

        });


//end of ajax function


        var map = new google.maps.Map(document.getElementById('map'), {
          
          
          center: new google.maps.LatLng(39.50, -98.35),
          zoom: 1,
          apTypeId: google.maps.MapTypeId.ROADMAP
        });



var myParser = new geoXML3.parser({map: map});
myParser.parse('http://172.26.179.13:8080/Server/gz_2010_us_040_00_20m.kml');



      
        var centerControlDiv = document.createElement('div');

        centerControlDiv.id="buttonControllerMenu";

        var centerControl1 = new ButtonControl(centerControlDiv, map,"Food");

        var centerControl2 = new ButtonControl(centerControlDiv, map,"Active Life");

        var centerControl3 = new ButtonControl(centerControlDiv, map,"Hair Salons");

        var centerControl4 = new ButtonControl(centerControlDiv, map,"Health & Medical"); 

        var centerControl5 = new ButtonControl(centerControlDiv, map,"Banks & Credit Unions");

        var centerControl6 = new ButtonControl(centerControlDiv, map,"Hotels & Travel"); 

        var centerControl7 = new ButtonControl(centerControlDiv, map,"Shopping");


//Making a reset button that resets the pane

var button_reset = document.createElement('button');

button_reset.style.marginTop='15px';

button_reset.style.marginRight='15px';
button_reset.style.backgroundColor = '#fff';
        button_reset.style.border = '8px solid #fff';
          button_reset.style.fontSize = '16px';
        button_reset.style.borderRadius = '6px';
        button_reset.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        button_reset.style.cursor = 'pointer';
        button_reset.style.marginBottom = '22px';
        button_reset.style.textAlign = 'center';
        button_reset.style.marginLeft = '15px';
 
 var ResetText = document.createTextNode("Reset Pane");


        button_reset.appendChild(ResetText);

        



        button_reset.addEventListener('click', function(event) {

console.log("Page Reloading...");

location.reload(true);

        });



map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button_reset);



//Reset button code complete

        centerControlDiv.index = 1;

        //hiding menubar by default
        centerControlDiv.style="display:none;";

        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
      


       
      }
      
//function for placing markers

function placeMarker(location,Map,Reviews,name_Of_Business,scores) {
 //var icon='parking_lot_maps.png'
  //console.log("Executed placemarker");
    var mkr=new google.maps.Marker({
        position: location, 
       // icon:'Yelp.png',
        //size:new google.maps.Size(42,68),
        map: Map,
        animation: google.maps.Animation.DROP



    });

mkr.addListener('click', toggleBounce);

    marker.push(mkr);




var infowindow = new google.maps.InfoWindow();

//console.log(scores);

makeInfoWindowEvent(Map, infowindow, Reviews,mkr,name_Of_Business,scores);
   
   infowindow.addListener('closeclick', function(){


for(var i=0;i<marker.length;i++){

  marker[i].setAnimation(null);
}


   });
}

//function for placing review windows

function makeInfoWindowEvent(map, infowindow,reviews, marker,name_Of_Business,scores) {

var sum_positive=0;
var sum_negative=0;
var sum_neutral=0;
var avg_positive=0;
var avg_negative=0;
var avg_neutral=0;

  google.maps.event.addListener(marker, 'click', function() {
    
 infowindow.setContent("<div><h1>Sentiment Certificate</h1><br><h2>"+name_Of_Business+"<h2><h3>Sentiments:-</h3><ul>");

/*for(var i=0;i<reviews.length;i++){

   infowindow.setContent(infowindow.getContent()+"<li>"+reviews[i].toString()+"</li>")

}
*/ 
/*console.log(scores);*/

//infowindow.setContent(infowindow.getContent()+"</ul></div>");   

//loop over scores
for(var data in scores){

//Initialize variables to zero for operations in loop once again
var sum_positive=0;
var sum_negative=0;
var sum_neutral=0;
var avg_positive=0;
var avg_negative=0;
var avg_neutral=0;

infowindow.setContent(infowindow.getContent()+"<li>"+data);   
//console.log(data);
//loop over POS/NEG/NEUTRAL scores
for(var i=0;i<scores[data].length;i++){
//Summing all scores 
sum_positive+=scores[data][i][0];
sum_negative+=scores[data][i][1];
sum_neutral+=scores[data][i][2];



}
//console.log(" Scores length--> "+scores[data].length);
//console.log("Pos== "+sum_positive+" Neg== "+sum_negative+" Neutral== "+sum_neutral);
//Averaging all score
avg_positive=(sum_positive/scores[data].length)
avg_negative=(sum_negative/scores[data].length)
avg_neutral=(sum_neutral/scores[data].length)

var happy_smileys=Math.ceil(avg_positive*10);
var angry_smileys=Math.floor(avg_negative*10);
var neutral_smileys=Math.floor(avg_neutral*10);



infowindow.setContent(infowindow.getContent()+" : Positive Score--> "+happy_smileys+" Negative Score--> "+angry_smileys+" Neutral Score--> "+neutral_smileys+"</li>");   

}


infowindow.setContent(infowindow.getContent()+"</ul></div>");   
    infowindow.open(map, marker);
  });
}


function setStateName(name){



 mapStataNameToCode(name);

//console.log("seted state code "+state_code+" for state name "+name);

}

function mapStataNameToCode(name){

  if(name=="Illinois")
state_code="IL";
else if(name=="North Carolina")
state_code="NC";
else if(name=="Pennsylvania")
state_code="PA";
//else setTimeOut(noDataPrompt(name));

}

function noDataPrompt(name){

alert("Data of "+name+" is not yet available. We Will soon update our database for that...")

}

//testign clearing markers

function clearPreviousMarkers(Map){

  for (var i = 0; i < marker.length; i++) {
          marker[i].setMap(null);

        }

marker=[];

}


 

function toggleBounce() {
  if (this.getAnimation() !== null) {
    this.setAnimation(null);
  } else {
    this.setAnimation(google.maps.Animation.BOUNCE);
  }
}



function average_calculator(){





}