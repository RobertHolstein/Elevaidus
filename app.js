console.log("\n\n===============>\t Elevaidus Started\n");

const db = require('mongojs')('localhost:27017/game', ['account']);
const Bundler = require('parcel-bundler');
const path = require('path');
const http = require ('http');
const express = require('express');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const bundler = new Bundler(path.resolve(__dirname, './client/index.html'));

app.use(bundler.middleware());

db.on('connect', function () {
    console.log('database connected')
})

var pass = (data, cb) => {
    db.account.find({username:"robert"}, (err,res) => {
        if(res[0]){
            cb(res[0].password)
        }
    });
}

io.on('connection',(socket) => {
    console.log(`\n\n===============>\t client connect with id: ${socket.id}\n`)
    var mypass;
    pass("blah", (res) => {
        mypass = res
        console.log(mypass);
    });
    
    console.log(mypass);
 });

server.listen(port, () => {
    console.log(`\n\n===============>\t Elevaidus now listening on port ${port}\n`);
});


