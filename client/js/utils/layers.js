import _ from 'lodash';

function getLayerOptions(options) {
  return {
    tileSize: new google.maps.Size(256, 256),
    opacity: 0.5,
    minZoom: 1,
    maxZoom: 6,
    ...options,
  };
}

function getTileUrl(key) {
  return (tile, zoom) => `//map1.vis.earthdata.nasa.gov/wmts-webmerc/
${key}/default/2015-03-03/GoogleMapsCompatible_Level6/${zoom}/${tile.y}/${tile.x}.png`;
}

function getLayer(key) {
  const options = getLayerOptions({
    getTileUrl: getTileUrl(key),
    alt: key,
    name: key,
  });
  return new google.maps.ImageMapType(options);
}

const Layers = [
  'OMI_Aerosol_Index',
  'MODIS_Terra_Aerosol',
  'MODIS_Aqua_Aerosol',
  'AIRS_CO_Total_Column_Day',
  'AIRS_CO_Total_Column_Night',
  'AIRS_Dust_Score',
  'MODIS_Combined_Value_Added_AOD',
  'OMI_Aerosol_Optical_Depth',
  'OMI_Absorbing_Aerosol_Optical_Depth',
].map(key => ({
  key,
  name: key.split('_').slice(1).join(' '),
  getLayer: _.partial(getLayer, key),
}));

export default Layers;
