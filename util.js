var fs = require('fs');
var _ = require('underscore');

module.exports = {
    loadData: function(name) {
        var file = fs.readFileSync('./data/' + name);
        return JSON.parse(file.toString());
    },
    generateRecommendationsForUser: function(user_id, songs, users) {
        var following = users.getAllFollowingForUser(user_id);
        
        //get all the songs from the followers
        var following_songs = _(following).chain().pluck('listened').flatten().countBy(function(song) {
            return song;
        }).value();
        
        //get all the genres from the songs the user has listened to
        var user_genres = _(users.getOrAddUser(user_id).listened).chain().map(songs.getSong).pluck('genres').flatten().countBy(function(song) {
            return song;
        }).value();

        //iterate through all the songs and apply a ranking
        var ranked_songs = _(songs.songs).chain().map(function(song, id) {
            var rank = 0;
            
            //add the number of times the people this user follows have listened to the song
            if (following_songs[id]) {
                rank += following_songs[id];
            }

            //add the number of times each genre appears in the user's listened songs
            _(songs.getSong(id).genres).each(function(genre) {
                if (user_genres[genre]) {
                    rank += user_genres[genre];
                }
            });

            return {
                id: id,
                rank: rank
            }; 
        }).reject(function(song) { 
            //get rid of songs the user has listened to
            var user = users.getOrAddUser(user_id);
            return _(user.listened).contains(song.id);
        }).reject(function(song) { 
            //reject songs with a zero ranking
            return (song.rank === 0);
        }).sortBy('rank').pluck('id').reverse().first(5).value();

        return ranked_songs;
         
    }
};
