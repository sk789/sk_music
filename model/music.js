var _ = require('underscore');

var Song = function(opts) {
    this.genres = opts.genres;
};

module.exports = _.bindAll({
    songs: {},
    addSong: function(genres, id) {
        this.songs[id] = new Song({
            genres: genres
            
        });
    },
    getSong: function(id) {
        return this.songs[id];
    }
}, 'addSong', 'getSong');
