import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import ProjectResolver from './resolvers/ProjectResolver';
import TaskResolver from './resolvers/TaskResolver';
import { RegisterResolver } from './modules/user/Register';
import { createConnection } from 'typeorm';

async function start() {
  await createConnection();

  const PORT = 3000;

  const app = express();

  const schema = await buildSchema({
    resolvers: [ProjectResolver, TaskResolver, RegisterResolver],
    emitSchemaFile: true,
  });

  const server = new ApolloServer({
    schema,
    playground: true,
  });

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
}

start();
