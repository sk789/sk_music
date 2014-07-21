var request = require('request');
var _ = require('underscore');
var Q = require('q');

var util = require('./util');

var loadFollowsPromise = _(util.loadData('follows.json').operations).map(function(operation) {
    var defer = Q.defer(); 
    request.post('http://localhost:3000/follow', {
        form: {
            from: operation[0],
            to: operation[1]
        }
    }, defer.resolve);

    return defer.promise;
});

var loadListensPromise = _(util.loadData('listen.json').userIds).map(function(songs, id) {

    return Q.all(_(songs).map(function(song) {
        var defer = Q.defer();

        request.post('http://localhost:3000/listen', {
            form: {
                user: id,
                music: song 
            }
        }, defer.resolve);
        
        return defer.promise;
    }));

});

Q.all(loadFollowsPromise.concat(loadListensPromise)).then(function() {
    request.get('http://localhost:3000/recommendations?user=a', function(error, object, response) {
        console.log(response);
    });
});
