get_players = require("./test.js");

// let players1 = [{
//         name: 'steve',
//         words: [
//             { word: 'sad', score: 0, common: false },
//             { word: 'happy', score: 0, common: false },
//             { word: 'melancholy', score: 0, common: false },
//             { word: 'unhappy', score: 0, common: false },
//             { word: 'fib', score: 3, common: false },
//             { word: 'shameful', score: 0, common: false },
//             { word: 'horrid', score: 0, common: false },
//             { word: 'boo', score: 0, common: false }
//         ]
//     },
//     {
//         name: 'vivek',
//         words: [
//             { word: 'apple', score: 0, common: false },
//             { word: 'bool', score: 4, common: false },
//             { word: 'feed', score: 0, common: false },
//             { word: 'happy', score: 0, common: false },
//             { word: 'sad', score: 0, common: false },
//             { word: 'amazing', score: 0, common: false },
//             { word: 'boo', score: 3, common: false },
//             { word: 'life', score: 4, common: false },
//             { word: 'dile', score: 0, common: false },
//             { word: 'bio', score: 3, common: false },
//             { word: 'vole', score: 4, common: false }
//         ]
//     }, {
//         name: 'john',
//         words: [
//             { word: 'brilliant', score: 0, common: false },
//             { word: 'great', score: 0, common: false },
//             { word: 'wonderful', score: 0, common: false },
//             { word: 'blue', score: 0, common: false },
//             { word: '', score: 0, common: false },
//             { word: 'green', score: 0, common: false },
//             { word: 'boo', score: 3, common: false },
//             { word: 'life', score: 4, common: false }
//         ]
//     }
// ]

//cancel words
const cancel_words = (players, min_length) => {
    for (let i = 0; i < players.length; i++) {
        similar_words(players[i].words)
    }
    //while loop where everytime one player is removed
    let count = players.length;
    let players_cancel = [];
    let player_words = []
    while (count != 1) {
        //check the first player against the others, and then remove the first player 
        for (let i = 1; i < count; i++) {
            console.log(players[0].name);
            console.log(players[i].name);
            //inner for loop loops through players words
            //console.log(players[i].words)
            cancel_helper(players, i, min_length)
        }
        players_cancel.push(players[0])
        players.splice(0, 1);
        count--;
    }
    players_cancel.push(players[0])
    players_cancel = score_words(players_cancel, min_length);
    return players_cancel;
}

//compares 2 arrays of words and finds similarities
const cancel_helper = (players, index, min_length) => {
    for (let i = 0; i < players[0].words.length; i++) {
        //loop through p2 words
        for (let j = 0; j < players[index].words.length; j++) {
            if (players[0].words[i].word === players[index].words[j].word) {
                players[0].words[i].score = 0;
                players[0].words[i].common = true;
                players[index].words[j].common = true;
                players[index].words[j].score = 0;
            }
        }
    }
}

const similar_words = (list) => {
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            if (list[i].word === list[j].word) {
                console.log(list[j].word)
                list.splice(i, 1);
            }
        }
    }
}

score_words = (players_cancel, min_length) => {
    console.log(min_length)
    for (let i = 0; i < players_cancel.length; i++) {
        for (let j = 0; j < players_cancel[i].words.length; j++) {

            if (players_cancel[i].words[j].word.length < min_length) {
                console.log(players_cancel[i].words[j].word.length)
                console.log(min_length)
                players_cancel[i].words[j].score = 0;
            }
        }
    }
    return players_cancel;
}


module.exports = (cancel_words);