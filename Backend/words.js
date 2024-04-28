const { response } = require("express");

const http = require("http");

let words = [];

{
// http.get('http://random-word-api.herokuapp.com/word?number=25', (resp) => {
//     let data = '';

//     resp.on('data', (chunk) => {
//         data += chunk;
//     });

//     resp.on('end', () => {
//         console.log(JSON.parse(data));
//         words = JSON.parse(data);
//     });

// }).on("error", (err) => {
//     console.log("Error: " + err.message);
//     words = ["success",
//     "appointment",
//     "administration",
//     "procedure",
//     "situation",
//     "food",
//     "advice",
//     "emphasis",
//     "vehicle",
//     "education",
//     "writing",
//     "gate",
//     "dinner",
//     "independence",
//     "ratio",
//     "wife",
//     "possession",
//     "alcohol",
//     "love",
//     "university",
//     "importance",
//     "committee",
//     "decision",
//     "session",
//     "thanks",
//     "replacement",
//     "fortune",
//     "sister",
//     "article",
//     "studio",
//     "reputation",
//     "math",
//     "percentage",
//     "heart",
//     "topic",
//     "desk",
//     "interaction",
//     "homework",
//     "grandmother",
//     "cell",
//     "reaction",
//     "combination",
//     "indication",
//     "baseball",
//     "currency",
//     "cigarette",
//     "client",
//     "discussion",
//     "breath",
//     "actor"
//     ];
// });  
}

let redTeam = [];
let blueTeam = [];
function allotTeams(clients) {  
    let count = 0;
    for (var key in clients) {
        if (clients.hasOwnProperty(key)) {
            if(count % 2 == 0){
                clients[key].team = "red";
            }
            else{
                clients[key].team = "blue";

            }
            count++;
        }
    }
    assignRoles(clients);
    return clients;
}


function assignRoles(clients) {
    let redTeam = [];
    let blueTeam = [];
  
    // Separate the clients into two arrays based on their team
    for (let key in clients) {
      if (clients.hasOwnProperty(key)) {
        if (clients[key].team === 'red') {
          redTeam.push(clients[key]);
        } else if (clients[key].team === 'blue') {
          blueTeam.push(clients[key]);
        }
      }
    }
  
    // Shuffle each array
    redTeam = shuffle(redTeam);
    blueTeam = shuffle(blueTeam);
  
    // Assign roles
    assignRoleToTeam(redTeam);
    assignRoleToTeam(blueTeam);
  
    return clients;
  }
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function assignRoleToTeam(team) {
    for (let i = 0; i < team.length; i++) {
      if (i === 0) {
        team[i].role = 'spymaster';
      } else {
        team[i].role = 'operative';
      }
    }
  }


words = ["success",
    "appointment",
    "administration",
    "procedure",
    "situation",
    "food",
    "advice",
    "emphasis",
    "vehicle",
    "education",
    "writing",
    "gate",
    "dinner",
    "independence",
    "ratio",
    "wife",
    "possession",
    "alcohol",
    "love",
    "university",
    "importance",
    "committee",
    "decision",
    "session",
    "thanks",
    "replacement",
    "fortune",
    "sister",
    "article",
    "studio",
    "reputation",
    "math",
    "percentage",
    "heart",
    "topic",
    "desk",
    "interaction",
    "homework",
    "grandmother",
    "cell",
    "reaction",
    "combination",
    "indication",
    "baseball",
    "currency",
    "cigarette",
    "client",
    "discussion",
    "breath",
    "actor"
];

function createGame() {

    return new Promise(function (resolve, reject) {
        var cardIndex = []
        var cards = []
        var cardsfinal = [];
        for (var i = 0; i < 25; i++) {
            var singleIndex = getRandomInt(words.length)

            while (cardIndex.includes(singleIndex)) {
                singleIndex = getRandomInt(words.length);
            }

            cardIndex.push(singleIndex)
            cards.push(
                {
                    word: words[singleIndex],
                    color: "neutral",
                    selected: false
                })
        }

        for (var red = 0; red < 9; red++) {
            var singleIndex = getRandomInt(cards.length)

            cards[singleIndex].color = "red";
            cardsfinal.push(cards[singleIndex]);
            cards.splice(singleIndex, 1);
        }

        for (var blue = 0; blue < 8; blue++) {
            var singleIndex = getRandomInt(cards.length)

            cards[singleIndex].color = "blue";
            cardsfinal.push(cards[singleIndex]);
            cards.splice(singleIndex, 1);
        }

        var bombIndex = getRandomInt(cards.length)
        cards[bombIndex].color = "black";

        var final = cards.concat(cardsfinal);
        final = shuffleCards(final);

        resolve(final);
    });
}

function shuffleCards(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffleCards...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    createGame, allotTeams
};