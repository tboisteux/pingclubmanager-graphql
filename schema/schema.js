import {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import fetch from 'node-fetch';

const BASE_URL = "http://localhost:8080/api"

const fetchResponseByURL = (relativeURL) => {
  return fetch(`${BASE_URL}${relativeURL}`).then(res => res.json());
}

const fetchPlayers = () => {
  return fetchResponseByURL('/players/').then(json => json);
}

const getPlayerById = (id) => {
  return fetch(`${BASE_URL}/players/${id}/`)
    .then(res => res.json())
    .then(json => json);
}

const PlayerType = new GraphQLObjectType({
  name: "Player",
  description: "...",

  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    firstname: { type: GraphQLString },
    licence: { type: GraphQLString },
    points: { type: GraphQLInt },
    isTransferred: { type: GraphQLBoolean },
  })
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',
  fields: () => ({
    Players: {
      type: new GraphQLList(PlayerType),
      resolve: fetchPlayers,
    },
    Player: {
      type: PlayerType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (root, args) => getPlayerById(args.id),
    },
  })
})

export default new GraphQLSchema({
  query: QueryType,
});
