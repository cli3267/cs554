const storeRoutes = require("./store");

const constructorMethod = app => {
    app.use("/", storeRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;