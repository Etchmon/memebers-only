#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Message = require('./models/message');
var User = require('./models/user');


var mongoose = require('mongoose');
const { DateTime } = require('luxon');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var messages = [];
var users = [];

function userCreate(username, password, member, admin, cb) {
    userdetail = {
        username: username,
        password: password,
        member: member,
        admin: admin,
    };

    // Create an instance of the User model
    const user = new User(userdetail);

    // Save the new model instance, passing a callback
    user.save((err) => {
        if (err) return cb(err, null);
        console.log(`New User: ${user}`);
        users.push(user);
        return cb(null, user);
    });
}

function messageCreate(user, title, text, timestamp, cb) {
    messageDetail = { user: user, title: title, text: text, timestamp: timestamp };

    var message = new Message(messageDetail);

    message.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Message: ' + message)
        messages.push(message)
        cb(null, message)
    });
};

function createUsers(cb) {
    async.series([
        function (callback) {
            userCreate("George", "George69420", false, false, callback);
        },
        function (callback) {
            userCreate("Manc_United", "United4eva", false, false, callback);
        },
    ], cb);
};


function createMessages(cb) {
    async.series([
        function (callback) {
            messageCreate('62b36ffe0615b281dc5ac527', "Yooooo! Goodluck Junior's!", "Dream it, Believe it, Achieve it", Date.now(), callback);
        },
        function (callback) {
            messageCreate('62b370000615b281dc5ac52a', "Look into the bagel", "Everything, Everywhere, All at Once.", Date.now(), callback);
        },
    ], cb);
};

async.series([
    createUsers,
    createMessages
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('Items: ' + messages);

        }
        // All done, disconnect from database
        mongoose.connection.close();
        console.log('All done!')
    });



