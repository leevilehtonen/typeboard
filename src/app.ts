import "reflect-metadata";

import { Express } from "express";
import { createExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { Container } from "typedi";
import { ConnectionOptions, createConnection, useContainer as ormUseContainer } from "typeorm";
import { connectionOptions } from "./database";
import { User } from "./entity/User";
import { UserRepository } from "./repository/UserRepository";
import { UserService } from "./service/UserService";

ormUseContainer(Container);
routingUseContainer(Container);

const app: Express = createExpressServer({
    routePrefix: "/api",
    controllers: [__dirname + "/controller/*.js"],
    // interceptors: [__dirname + "/interceptors/*.js"],
    // middlewares: [__dirname + "/middlewares/*.js"],
});

createConnection(connectionOptions);

app.listen(3000);

module.exports = app;
