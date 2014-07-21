var _ = require('underscore');

var User = function() {
    this.listened = [];
    this.following = []; 
};

User.prototype.addFollower = function(user_id) {
    this.following.push(user_id);
};

User.prototype.addListened = function(song_id) {
    this.listened.push(song_id);
};


module.exports = _.bindAll({
    users: {},
    getOrAddUser: function(user_id) {
        if (!this.users[user_id]) {
            this.users[user_id] = new User();
        }

        return this.users[user_id];
    },
    getAllFollowingForUser: function(user_id) {
        return _(this.getOrAddUser(user_id).following).map(_.bind(function(user) {
            return this.getOrAddUser(user);
        }, this));
    }
}, 'getOrAddUser', 'getAllFollowingForUser');
