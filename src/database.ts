import * as PostgressConnectionStringParser from "pg-connection-string";
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions";

function getConnectionOptions(isProductionDataBase: boolean): ConnectionOptions {
    if (isProductionDataBase) {
        const postgresUrl = PostgressConnectionStringParser.parse(process.env.DATABASE_URL);
        return {
            type: "postgres",
            host: postgresUrl.host,
            port: postgresUrl.port,
            username: postgresUrl.user,
            password: postgresUrl.password,
            database: postgresUrl.database,
            synchronize: true,
            logging: true,
            entities: ["dist/entity/*.js"],
        };
    } else {
        return {
            type: "sqlite",
            database: "database.db",
            logging: true,
            synchronize: true,
            entities: [
                "dist/entity/*.js",
            ],
        };
    }
}

export const connectionOptions: ConnectionOptions = getConnectionOptions(process.env.DATABASE_URL !== undefined);
