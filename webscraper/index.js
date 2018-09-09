const rp = require('request-promise');
const cherio = require('cheerio');
const Table = require('cli-table');

let users = [];
let table = new Table({
    head: ['username', 'heart', 'challenges'],
    colWidths: [15, 5, 10]
});

const options = {
    url: 'https://forum.freecodecamp.org/directory_items?period=weekly&order=likes_received&_=1518604435748',
    json: true
};

rp(options).then(data => {
    let promises = [];
    let userData = [];
    for (let user of data.directory_items) {
        userData.push({ name: user.user.userName, likes_received: user.likes_received });
    }
    process.stdout.write('loading');
    getChallengesCompletedAndPushToUserArray(userData);
}).catch(err => {
    console.log(err);
});

function getChallengesCompletedAndPushToUserArray(userData) {
    var i = 0;
    function next() {
        if (i < userData.length) {
            var options = {
                url: 'https://www.freecodecamp.org/' + userData[i].name,
                transform: body => cheerio.load(body)
            };
            rp(options).then(function ($) {
                process.stdout.write(',');
                const fccAccout = $('h1.landing-heading').length == 0;
                const challengesPassed = fssAccount ? $('tbody tr').length : 'unknown';
                table.push([userData[i].name, userData[i].likes_received, challengesPassed]);
                ++i;
                return next();
            });
        } else {
            printData();
        }
    }
    return next();
};

function printData() {
    console.log("checkbox");
    console.log(table.toString());
}