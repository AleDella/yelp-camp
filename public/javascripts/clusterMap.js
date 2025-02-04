// const {KML} = require('ol/format/KML.js');
// const {Map} = require('ol/Map.js');
// const {View} = require('ol/View.js');
// const {Circle, Fill, RegularShape, Stroke, Style, Text} = require('ol/style.js');
// const CircleStyle = Circle;
// const { Cluster, StadiaMaps, Vector } = require('ol/source.js');
// const VectorSource = Vector;
// const {Select, defaults} = require('ol/interaction.js')
// const defaultInteractions = defaults;
// const { Tile, Vector1 } = require('ol/layer.js');
// const TileLayer = Tile;
// const VectorLayer = Vector1;
// const { createEmpty, extend, getHeight, getWidth } = require('ol/extent.js');

// import KML from 'ol/format/KML.js';
// import Map from 'ol/Map.js';
// import View from 'ol/View.js';
// import {
//   Circle as CircleStyle,
//   Fill,
//   RegularShape,
//   Stroke,
//   Style,
//   Text,
// } from 'ol/style.js';
// import {Cluster, StadiaMaps, Vector as VectorSource} from 'ol/source.js';
// import {
//   Select,
//   defaults as defaultInteractions,
// } from 'ol/interaction.js';
// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
// import {createEmpty, extend, getHeight, getWidth} from 'ol/extent.js';

const earthquakeFill = new ol.source.Fill({
    color: 'rgba(255, 153, 0, 0.8)',
});
const earthquakeStroke = new ol.source.Stroke({
    color: 'rgba(255, 204, 0, 0.2)',
    width: 1,
});
const textFill = new ol.source.Fill({
    color: '#fff',
});
const textStroke = new ol.source.Stroke({
    color: 'rgba(0, 0, 0, 0.6)',
    width: 3,
});
const invisibleFill = new ol.source.Fill({
    color: 'rgba(255, 255, 255, 0.01)',
});

// function createEarthquakeStyle(feature) {
//     // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
//     // standards-violating <magnitude> tag in each Placemark.  We extract it
//     // from the Placemark's name instead.
//     const name = feature.get('name');
//     const magnitude = parseFloat(name.substr(2));
//     const radius = 5 + 20 * (magnitude - 5);

//     return new Style({
//         geometry: feature.getGeometry(),
//         image: new RegularShape({
//             radius: radius,
//             radius2: 3,
//             points: 5,
//             angle: Math.PI,
//             fill: earthquakeFill,
//             stroke: earthquakeStroke,
//         }),
//     });
// }

// let maxFeatureCount;
// let vector = null;
// const calculateClusterInfo = function (resolution) {
//     maxFeatureCount = 0;
//     const features = vector.getSource().getFeatures();
//     let feature, radius;
//     for (let i = features.length - 1; i >= 0; --i) {
//         feature = features[i];
//         const originalFeatures = feature.get('features');
//         const extent = createEmpty();
//         let j, jj;
//         for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
//             extend(extent, originalFeatures[j].getGeometry().getExtent());
//         }
//         maxFeatureCount = Math.max(maxFeatureCount, jj);
//         radius = (0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
//         feature.set('radius', radius);
//     }
// };

// let currentResolution;
// function styleFunction(feature, resolution) {
//     if (resolution != currentResolution) {
//         calculateClusterInfo(resolution);
//         currentResolution = resolution;
//     }
//     let style;
//     const size = feature.get('features').length;
//     if (size > 1) {
//         style = new Style({
//             image: new CircleStyle({
//                 radius: feature.get('radius'),
//                 fill: new Fill({
//                     color: [255, 153, 0, Math.min(0.8, 0.4 + size / maxFeatureCount)],
//                 }),
//             }),
//             text: new Text({
//                 text: size.toString(),
//                 fill: textFill,
//                 stroke: textStroke,
//             }),
//         });
//     } else {
//         const originalFeature = feature.get('features')[0];
//         style = createEarthquakeStyle(originalFeature);
//     }
//     return style;
// }

// function selectStyleFunction(feature) {
//     const styles = [
//         new Style({
//             image: new CircleStyle({
//                 radius: feature.get('radius'),
//                 fill: invisibleFill,
//             }),
//         }),
//     ];
//     const originalFeatures = feature.get('features');
//     let originalFeature;
//     for (let i = originalFeatures.length - 1; i >= 0; --i) {
//         originalFeature = originalFeatures[i];
//         styles.push(createEarthquakeStyle(originalFeature));
//     }
//     return styles;
// }

// vector = new VectorLayer({
//     source: new Cluster({
//         distance: 40,
//         source: new VectorSource({
//             url: 'data/kml/2012_Earthquakes_Mag5.kml',
//             format: new KML({
//                 extractStyles: false,
//             }),
//         }),
//     }),
//     style: styleFunction,
// });

// const raster = new TileLayer({
//     source: new StadiaMaps({
//         layer: 'stamen_toner',
//     }),
// });

// const map = new Map({
//     layers: [raster, vector],
//     interactions: defaultInteractions().extend([
//         new Select({
//             condition: function (evt) {
//                 return evt.type == 'pointermove' || evt.type == 'singleclick';
//             },
//             style: selectStyleFunction,
//         }),
//     ]),
//     target: 'map',
//     view: new View({
//         center: [0, 0],
//         zoom: 2,
//     }),
// });