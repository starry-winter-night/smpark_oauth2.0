import { MongoClient, Collection, Document } from 'mongodb';
import createError from 'http-errors';
import { inject, injectable } from 'inversify';

@injectable()
class MongoDB {
  private client: MongoClient | undefined;
  private dbName: string;
  private url: string;

  constructor(@inject('DbURL') url: string, @inject('DbName') dbName: string) {
    this.url = url;
    this.dbName = dbName;
  }

  async connect(): Promise<void> {
    try {
      this.client = await new MongoClient(this.url).connect();
      console.log(`Connected to MongoDB!`);
    } catch (error) {
      throw createError(500, 'Failed to connect to MongoDB', { cause: error });
    }
  }

  getCollection<T extends Document>(name: string): Collection<T> {
    if (!this.client) {
      throw createError(500, 'Database not connected');
    }
    return this.client.db(this.dbName).collection(name);
  }

  getClient(): MongoClient {
    if (!this.client) {
      throw createError(500, 'Database not connected');
    }
    return this.client;
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }
}

export default MongoDB;
