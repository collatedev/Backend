import mongoose, { Collection } from "mongoose";
import * as MongoMemoryServer from "mongodb-memory-server";
import { Db } from "mongodb";

const timeout : number = 60000;

jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;

export default class MockDB {
    private db : Db | null;
    private server : MongoMemoryServer.MongoMemoryServer;
    private connection : mongoose.Mongoose | null;

    constructor() {
        this.db = null;
        this.server = new MongoMemoryServer.MongoMemoryServer();
        this.connection = null;
    }

    public async start() : Promise<void> {
        const url : string = await this.server.getConnectionString();
        this.connection = await mongoose.connect(url, {
            useNewUrlParser: true
        });
        mongoose.set('useFindAndModify', false);

        this.db = this.connection.connection.db;
    }

    public async stop() : Promise<boolean> {
        if (this.connection) {
            await this.connection.disconnect();
        }
        return this.server.stop();
    }

    public async cleanup() : Promise<void> {
        if (this.db === null) {
            return;
        }
        const collections : Collection[] = await this.db.listCollections().toArray();
        await Promise.all(
            collections
                .map((collection : Collection) : string => collection.name)
                .map(async (collection : string) : Promise<any> => {
                    if (this.db === null) {
                        return;
                    }
                    try {
                        await this.db.collection(collection).drop();
                    } catch (error) {
                        return;
                    }
                })
        );
    }
}