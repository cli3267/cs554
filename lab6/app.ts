import * as express from 'express';
import * as bodyParser from 'body-parser'; //used to parse the form data that you pass in the request
import { Tasks } from './routes/tasks';
var paths: object = {};
class App {
  public app: express.Application;
  public taskRoutes: Tasks = new Tasks();

  constructor() {
    this.app = express(); //run the express instance and store in app
    this.config();
    this.taskRoutes.routes(this.app);
  }

  Logger = (req: express.Request, res: express.Response, next: Function) => {
    if (!paths[req.path]) paths[req.path] = 0;
    paths[req.path]++;
    console.log('------------');
    console.log('HTTP Request: ' + req.method);
    console.log('Path: ' + req.originalUrl);
    console.log('Body: ' + JSON.stringify(req.body));
    console.log('Total: ' + paths[req.path]);
    console.log('------------');
    next();
  };

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      }),
    );
    this.app.use(this.Logger);
  }
}

export default new App().app;
