var path = require('path');

function routes(app, server, express, PORT){
app.use(express.static(path.resolve(__dirname + '/../public')));
 
app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

app.get('/world1', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../public/world1.html'));
  });
 
app.get('/world2', function (req, res) {
res.sendFile(path.resolve(__dirname + '/../public/world2.html'));
});

app.get('/world3', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../public/world3.html'));
});

server.listen(PORT, function () {
  console.log(`Listening on ${server.address().port}`);
});
}

module.exports = routes; 