var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');


var util = require('./util');
var users = require('./model/users');
var music = require('./model/music');

//load in song data
_(util.loadData('music.json')).each(music.addSong);

var app = new express();

app.use( bodyParser.json() ); 
app.use( bodyParser.urlencoded() ); 

app.post('/follow', function(req, res) {
    var from = req.body['from'];
    var to = req.body['to'];

    var user_from = users.getOrAddUser(from); 
    user_from.addFollower(to);

    res.end();
});

app.post('/listen', function(req, res) {
    var user_id = req.body['user'];
    var music_id = req.body['music'];

    var user = users.getOrAddUser(user_id);
    user.addListened(music_id);

    res.end();
});

app.get('/recommendations', function(req, res) {
    var user_id = req.query['user'];

    res.json({
        list: util.generateRecommendationsForUser(user_id, music, users)
    });

});

app.listen(3000);
