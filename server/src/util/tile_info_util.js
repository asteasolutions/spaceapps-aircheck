import _ from 'lodash';
import http from 'http';
import https from 'https';
import fs from 'fs';
import temp from 'temp';
import moment from 'moment';
import { PNG } from 'pngjs';
import ColorConvert from 'color-convert';

temp.track();

function getTileUrl({ layer, zoom, date, coords }) {
  return `http://map1.vis.earthdata.nasa.gov/wmts-webmerc/${layer}/default/` +
    `${moment(date).format('YYYY-MM-DD')}/GoogleMapsCompatible_Level6/` +
    `${zoom}/${coords.y}/${coords.x}.png`;
}

function getPaletteUrl(layer) {
  return `https://worldview.earthdata.nasa.gov/config/palettes/${layer}.json`;
}

function normalizer(rangeStart, rangeEnd) {
  const len = rangeEnd - rangeStart;
  return (num) => (num - rangeStart) / len;
}

async function openTempFile(prefix) {
  return new Promise((resolve, reject) => {
    temp.open(prefix, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          path: info.path,
          writeStream: fs.createWriteStream(null, { fd: info.fd }),
        });
      }
    });
  });
}

async function getUrl(url) {
  return new Promise((resolve, reject) => {
    const net = /^https/.test(url) ? https : http;
    net.get(url)
      .on('response', resolve)
      .on('error', reject);
  });
}

async function download(url) {
  const tmpFile = await openTempFile('tile');
  const response = await getUrl(url);

  response.pipe(tmpFile.writeStream);

  return new Promise((resolve, reject) => {
    response.on('error', reject);
    response.on('end', () => resolve(tmpFile.path));
  });
}

async function getPalette(layer) {
  const paletteUrl = getPaletteUrl(layer);
  const response = await getUrl(paletteUrl);
  response.setEncoding('utf8');
  return new Promise((resolve, reject) => {
    let buf = '';
    response.on('data', (chunk) => { buf += chunk; });
    response.on('end', () => resolve(JSON.parse(buf)));
    response.on('error', reject);
  });
}

async function parsePng(path, palette) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(new PNG())
      .on('parsed', function parse() {
        const pixelValues = [];
        const colorValues = new Map();
        palette.scale.colors.forEach((color, i) => {
          colorValues.set(color, palette.scale.values[i]);
        });
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const [r, g, b, a] = _.slice(this.data, idx, idx + 4);
            const hex = `${ColorConvert.rgb.hex(r, g, b)}${a.toString(16)}`.toLowerCase();
            const pixelValue = colorValues.get(hex) || 0;
            pixelValues.push(pixelValue);
          }
        }

        const meanPixelValue = _.mean(pixelValues);
        const scale = palette.scale.values;
        const normalize = normalizer(scale[0], scale[scale.length - 1]);
        resolve(normalize(meanPixelValue));
      })
      .on('error', reject);
  });
}

class TileInfoUtil {
  getTileUid(tile) {
    const m = moment(tile.date);
    const { x, y } = tile.coords;
    return `${tile.layer}/${m.format('YYYY-MM-DD')}/${tile.zoom}/${y}/${x}`;
  }

  async extractInfo(tileDescr) {
    let tmpTilePath;
    try {
      const url = getTileUrl(tileDescr);
      tmpTilePath = await download(url);
      const palette = await getPalette(tileDescr.layer);
      const sampleValue = await parsePng(tmpTilePath, palette);
      return sampleValue;
    } finally {
      if (tmpTilePath) {
        fs.unlink(tmpTilePath);
      }
    }
  }
}

export default new TileInfoUtil();
