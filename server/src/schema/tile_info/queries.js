import _ from 'lodash';
import moment from 'moment';
import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { CalendarDateType } from '../calendar_date';
import TileInfoType from './type';
import TileInfo from '../../models/tile_info';
import TileInfoUtil from '../../util/tile_info_util';

async function getTilesInfoFromDb(filter) {
  return new Promise((resolve, reject) => {
    TileInfo.find({
      layer: filter.layer,
      zoom: filter.zoomLevel,
      coords: { $in: filter.coords },
      date: {
        $gte: moment(filter.fromDate).startOf('day').toDate(),
        $lte: moment(filter.toDate).endOf('day').toDate(),
      },
    }, (err, result) => (err ? reject(err) : resolve(result)));
  });
}

async function extractTileInfo(tileDescriptor) {
  const sampleValue = await TileInfoUtil.extractInfo(tileDescriptor);
  const tileInfo = new TileInfo({
    ...tileDescriptor,
    sampleValue,
  });
  return new Promise((resolve, reject) => {
    tileInfo.save((err, res) => (err ? reject(err) : resolve(res)));
  });
}

function generateRequestedUids(filter) {
  const requestedTileUids = {};
  let date = moment(filter.fromDate).hour(12).startOf('hour');
  const toDate = moment(filter.toDate).endOf('day');
  const dates = [];
  while (date.isSameOrBefore(toDate)) {
    dates.push(date);
    date = moment(date).add(1, 'day');
  }
  dates.forEach((d) => {
    filter.coords.forEach((coords) => {
      const tileDescriptor = {
        layer: filter.layer,
        zoom: filter.zoomLevel,
        date: d,
        coords,
      };
      const uid = TileInfoUtil.getTileUid(tileDescriptor);
      requestedTileUids[uid] = tileDescriptor;
    });
  });

  return requestedTileUids;
}

const TileInfoFilterType = new GraphQLInputObjectType({
  name: 'TileInfoFilter',
  fields: () => ({
    layer: { type: new GraphQLNonNull(GraphQLString) },
    fromDate: { type: new GraphQLNonNull(CalendarDateType) },
    toDate: { type: new GraphQLNonNull(CalendarDateType) },
    zoomLevel: { type: new GraphQLNonNull(GraphQLInt) },
    coords: { type: new GraphQLNonNull(new GraphQLList(new GraphQLInputObjectType({
      name: 'Coords',
      fields: () => ({
        x: { type: GraphQLInt },
        y: { type: GraphQLInt },
      }),
    }))) },
  }),
});

export default {
  tilesInfo: {
    type: new GraphQLList(TileInfoType),
    args: {
      filter: { type: new GraphQLNonNull(TileInfoFilterType) },
    },
    resolve: async (root, { filter }) => {
      const tilesInfo = await getTilesInfoFromDb(filter);
      const tilesInfoMap = {};
      tilesInfo.forEach((tileInfo) => {
        tilesInfoMap[TileInfoUtil.getTileUid(tileInfo)] = tileInfo;
      });
      const requestedTileUids = generateRequestedUids(filter);
      await Promise.all(_.map(requestedTileUids, async (tileDescriptor, uid) => {
        if (!tilesInfoMap[uid]) {
          const tileInfo = await extractTileInfo(tileDescriptor);
          tilesInfoMap[uid] = tileInfo;
        }
        return null;
      }));
      return Object.values(tilesInfoMap);
    },
  },
};
