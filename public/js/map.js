
let mapTOken=mapToken;
console.log(mapTOken);
mapboxgl.accessToken =mapTOken ;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/satellite-streets-v12",  // style url
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12 // starting zoom
});

// console.log(coordinates);

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color:"red"})
  .setLngLat(listing.geometry.coordinates) // No extra brackets
  .setPopup(new mapboxgl.Popup({offset: 25, })    //   pop-up
  .setHTML(`<h4>${listing.location}</h4><p><h4>Exact location after provided booking </h4></p>`)
  .setMaxWidth("300px"))
  .addTo(map);
