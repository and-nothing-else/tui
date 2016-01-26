const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();


app.use(express.static(__dirname + '/dist'));

app.post('/api/feedback/', function(request, response){
    response.json({'status': 'ok'});
});

app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'index.html'))
});

app.listen(port);
console.log("server started on port " + port);
