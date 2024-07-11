import 'reflect-metadata';
import express from 'express';
import MongoStore from 'connect-mongo';

import env from '@configs/env';
import configureExpress from '@configs/express';
import { container, registerAllDependencies } from '@configs/inversify';
import MongoDB from '@database/MongoDB';

const mongoDBName = env.mongoDBName;

registerAllDependencies(env.mongoDBUri, mongoDBName);

const database = container.get<MongoDB>(MongoDB);
await database.connect();
const sessionStore = new MongoStore({
  client: database.getClient(),
  dbName: mongoDBName,
  collectionName: env.mongoDBSessionCollection,
});

const app = express();

await configureExpress(app, sessionStore, env);

const port = env.port || 5555;
app.listen(port, async () => {
  console.log(`Server Connected, ${port} port!`);
});
