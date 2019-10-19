const bluebird = require("bluebird");
const express = require("express");
const app = express();
const redis = require("redis");
const client = redis.createClient();
const data = require("./data");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let result = [];

app.get("/api/people/history", async (req, res) => {
    try {
        let dict = [];
        if (result.length <= 20) {
            // checks the result length and returns everything if the length is <= 20
            for (let i = 0; i < result.length; i++) {
                let cMem = JSON.parse(await client.getAsync(result[i]));
                dict.push(cMem);
            }
            res.json(dict)
        } else {
            // tempResult will hold the last 20 users 
            let tempResult = result.slice(Math.max(result.length - 20, 1))
            for (let i = 0; i < tempResult.length; i++) {
                let cMem = JSON.parse(await client.getAsync(tempResult[i]));
                dict.push(cMem);
            }
            res.json(dict)
        }
    } catch (e) {
        res.sendStatus(500).send(e);
    }
});

app.get("/api/people/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cMem = await client.getAsync(id);
        if (cMem) {
            let jParse = JSON.parse(cMem)
            result.push(id);
            res.json(jParse);
        } else {
            try {
                let tried = await data.getById(id);
                result.push(id);
                let jString = JSON.stringify(tried)
                await client.setAsync(id, jString);
                res.json(tried);
            } catch (e) {
                res.sendStatus(404).send(e);
            }
        }
    } catch (e) {
        res.sendStatus(500).send(e);
    }

})

app.get("/", async (req, res) => {
    res.json('Hello there, go to these routes: /api/people/history or /api/people/:id :)')
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});