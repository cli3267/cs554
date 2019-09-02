const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const configRoutes = require('./routes');

app.use(bodyParser.json());

const paths = {};
app.use(function(req, res, next) {
  if (!paths[req.path]) paths[req.path] = 0;
  paths[req.path]++;
  console.log('------------');
  console.log('HTTP Request: ' + req.method);
  console.log('Path: ' + req.originalUrl);
  console.log('Body: ' + JSON.stringify(req.body));
  console.log('Total: ' + paths[req.path]);
  console.log('------------');
  next();
});
configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000/api/tasks');
});
