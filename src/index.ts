import { config } from "dotenv";

// Configuring Dotenv
config();

import 'reflect-metadata';
import express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from "cors";

import { redis } from "./redis";
import { UsersResolver, MeResolver } from './queries/user'
import { LoginResolver, RegisterResolver } from './mutations/user';

async function start() {

  await createConnection();

  const PORT = process.env.PORT;

  const app = express();

  // Set trust proxy because in a pass we are behind a proxy
  // And it's useful for express-session when cookie.secure is true.
  app.set('trust proxy', 1);


  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      MeResolver,
      LoginResolver,
      RegisterResolver
    ],
    emitSchemaFile: true,
    authChecker: (
      { context: { req } },
      roles,
    ) => {
      // here we can read the user from context
      // and check his permission in the db against the `roles` argument
      // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
      /*if (req.session.userId) {
        return true;
      }

      return false;*/ // or false if access is denied
      return !!req.session.userId;
    }
  }); 

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN || "http://localhost:3000"
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'qid',
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: process.env.DOMAIN,
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: Boolean(process.env.GRAPHQL_APOLLO_INTROSPECTION) as boolean,
    context: ({ req }: any) => ({ req })
  });

  server.applyMiddleware({ app });

  const HTTP_SERVER:http.Server =  http.createServer(app);;
  let HTTPS_SERVER:https.Server;

  if(process.env.TLS === "true"){
    
    const httpsOptions = {
        key: (new Buffer(process.env.TLS_KEY as string, 'base64')).toString('utf8'),
        cert: (new Buffer(process.env.TLS_CERT as string, 'base64')).toString('utf8'),
        rejectUnauthorized: false
    };

    HTTPS_SERVER = https.createServer(httpsOptions, app);
  }
  
  HTTP_SERVER.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://${process.env.DOMAIN}:${PORT}${server.graphqlPath}`
    );
    if(HTTPS_SERVER !== null){
      HTTPS_SERVER.listen(process.env.TLS_PORT, () => {
        console.log(
          `🚀 Server ready at https://${process.env.DOMAIN}:${process.env.TLS_PORT}${server.graphqlPath}`
        )
      });
    }
  });
  
}

start();
