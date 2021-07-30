import { GraphQLServer, PubSub } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

import db from './db';
const prisma = new PrismaClient();

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment
  },
  context: {
    db,
    pubsub
  }
});

server.start(async () => {
  console.log('server running');
  // console.log('querying database');
  //
  // const allUsers = await prisma.user.findMany();
  // console.log(allUsers);
});
