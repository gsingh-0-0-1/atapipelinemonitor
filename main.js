const express = require('express')
var fs = require('fs');
const {URLSearchParams} = require('url')

const redis = require("redis");
const client = redis.createClient(6379, 'redishost');

const app = express()
const port = 81
const host = '0.0.0.0'

app.use(express.static('public'));

app.get("/", (req, res) => {
	res.sendFile("public/templates/main.html", {root: __dirname})
})

app.get("/node", (req, res) => {
	res.sendFile("public/templates/node.html", {root: __dirname})
})

app.get("/allkeys", (req, res) => {
	client.keys("*", function(err, reply) {
		res.send(reply)
	});
})

app.get("/basics", (req, res) => {
	var url = req.url.split("?")[1]
	urlParams = new URLSearchParams(url)

	var nodenum = urlParams.get("nodenum")
	var nodename = "hashpipe://seti-node" + nodenum[0] + "/" + nodenum[1] + "/status"

	client.hmget(nodename, "DAQPULSE", "SYNCTIME", "DAQSTATE", "PHYSGBPS", "ANTNAMES", "OBSNDROP", function(err, reply){
		res.send(reply)
	});
})

app.get("/getall", (req, res) => {
	var url = req.url.split("?")[1]
	urlParams = new URLSearchParams(url)

	var nodenum = urlParams.get("nodenum")
	var nodename = "hashpipe://seti-node" + nodenum[0] + "/" + nodenum[1] + "/status"

	client.hgetall(nodename, function(err, reply){
		res.send(reply)
	})
})

app.get('/ping', (req, res) => {
        const ip = req.connection.remoteAddress;
        console.log("Ping at ", new Date(new Date().toUTCString()), " from ", ip)
        res.send('pong')
})

app.listen(port, host)
