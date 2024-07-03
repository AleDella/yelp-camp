const key = mapToken;
const attribution = new ol.control.Attribution({
  collapsible: false,
});
const source = new ol.source.TileJSON({
  url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`, // source URL
  tileSize: 512,
  crossOrigin: 'anonymous'
});

// Get the popup content
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
// Create an overlay to anchor the popup on the map
const overlay = new ol.Overlay({
  element: container,
});
// Function to close the popup
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};



const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: source
    })
  ],
  controls: ol.control.defaults.defaults({ attribution: false }).extend([attribution]),
  overlays: [overlay],
  target: 'map',
  view: new ol.View({
    constrainResolution: true,
    center: ol.proj.fromLonLat(campground.geometry.coordinates), // starting position [lng, lat]
    zoom: 9 // starting zoom
  })
});

const locationLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(campground.geometry.coordinates)),
      })
    ]
  }),
  style: new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      crossOrigin: 'anonymous',
      src: '/helper_images/marker-icon.png',
    })
  })
});
map.addLayer(locationLayer);

// Add the popup on the map
map.on('singleclick', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature, layer){
      if(layer == locationLayer){
        return feature;
      }
  });
  if(feature){
    var popupContent = '<h3>' + campground.title + '</h3>';
    popupContent += '<p> Location: ' + campground.location + '</p>';

    content.innerHTML = popupContent;
    overlay.setPosition(ol.proj.fromLonLat(campground.geometry.coordinates));
  }
});