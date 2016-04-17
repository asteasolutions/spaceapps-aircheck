import {
  nodeDefinitions,
  fromGlobalId,
} from 'graphql-relay';

class Node {
  constructor() {
    this._idFetchers = new Map();
    this._nodeDefinitions = nodeDefinitions((globalId) => this._fetchById(fromGlobalId(globalId)));
  }

  setIdFetcher(type, idFetcher) {
    this._idFetchers.set(type, idFetcher);
  }

  _fetchById({ type, id }) {
    const idFetcher = this._idFetchers.get(type);
    return idFetcher ? idFetcher(id) : null;
  }

  get interface() {
    return this._nodeDefinitions.nodeInterface;
  }

  get field() {
    return this._nodeDefinitions.nodeField;
  }
}

export default new Node();
