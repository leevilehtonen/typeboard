import "reflect-metadata";

import { Express } from "express";
import { createExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { Container } from "typedi";
import { ConnectionOptions, createConnection, useContainer as ormUseContainer } from "typeorm";
import { connectionOptions } from "./config";

ormUseContainer(Container);
routingUseContainer(Container);

const app = createExpressServer({
    routePrefix: "/api",
    controllers: [__dirname + "/controller/*.@(js|ts)"],
});

createConnection(connectionOptions);

app.listen(process.env.PORT || 3000);

module.exports = app;
