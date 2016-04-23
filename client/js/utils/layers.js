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

function checkTileParams(tile, zoom) {
  const maxCoord = Math.pow(2, zoom);
  return zoom >= 0 && tile.x >= 0 && tile.y >= 0 && tile.x < maxCoord && tile.y < maxCoord;
}

function getTileUrl(key, date = '2015-03-03') {
  debugger;
  return (tile, zoom) => {
    let result;
    if (checkTileParams(tile, zoom)) {
      result = `//map1.vis.earthdata.nasa.gov/wmts-webmerc/
${key}/default/${date}/GoogleMapsCompatible_Level6/${zoom}/${tile.y}/${tile.x}.png`;
    } else {
      result = null;
    }
    return result;
  };
}

function getLayer(key, filterDate) {
  debugger;
  const options = getLayerOptions({
    getTileUrl: getTileUrl(key, filterDate),
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
  // getLayer: _.partial(getLayer, key),
  getLayer: date => {
    debugger;
    return getLayer(key, date);
  },
}));

export default Layers;
