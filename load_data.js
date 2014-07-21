var request = require('request');
var _ = require('underscore');

var util = require('./util');

_(util.loadData('follows.json').operations).each(function(operation) {
    request.post('http://localhost:3000/follow', {
        form: {
            from: operation[0],
            to: operation[1]
        }
    });
});

_(util.loadData('listen.json').userIds).each(function(songs, id) {
    _(songs).each(function(song) {
        request.post('http://localhost:3000/listen', {
            form: {
                user: id,
                music: song 
            }
        });
    });
});
