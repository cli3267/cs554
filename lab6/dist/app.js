"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser"); //used to parse the form data that you pass in the request
const tasks_1 = require("./routes/tasks");
var paths = {};
class App {
    constructor() {
        this.taskRoutes = new tasks_1.Tasks();
        this.Logger = (req, res, next) => {
            if (!paths[req.path])
                paths[req.path] = 0;
            paths[req.path]++;
            console.log('------------');
            console.log('HTTP Request: ' + req.method);
            console.log('Path: ' + req.originalUrl);
            console.log('Body: ' + JSON.stringify(req.body));
            console.log('Total: ' + paths[req.path]);
            console.log('------------');
            next();
        };
        this.app = express(); //run the express instance and store in app
        this.config();
        this.taskRoutes.routes(this.app);
    }
    config() {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({
            extended: false,
        }));
        this.app.use(this.Logger);
    }
}
exports.default = new App().app;
