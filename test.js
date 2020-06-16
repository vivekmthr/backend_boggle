var checkWord = require('check-if-word'),
    words = checkWord('en');



const generate_letter = () => {
    let frequencies = [9, 2, 2, 4, 12, 2, 3, 2, 9, 1, 1, 4, 2, 6, 8, 2, 1, 6, 4, 6, 4, 2, 2, 1, 2, 1]

    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    let letter_bank = []

    for (let i = 0; i < frequencies.length; i++) {
        for (let j = 0; j < frequencies[i]; j++) {
            letter_bank.push(letters[i])
        }
    }

    let select = Math.floor((Math.random() * 100) - 2);

    return letter_bank[select]
}

generate_grid = () => {
    var grid = []
    for (let i = 0; i < 16; i++) {
        grid.push(generate_letter())
    }
    for (let i = 0; i < 16; i++) {
        if (grid[i] === undefined) {
            grid[i] = generate_letter()
        }
    }
    return grid;
}


const get_players = (words_array, letter_grid) => {
    let edited_words = []
    var players = []
        //for (let i = 0; i < words_array.length; i += 2) {
        //edited_words.push(words_array[i])
        //}
        //this currently equals an array of the given words
    array_of_words = into_array(words_array)
    for (let i = 0; i < array_of_words.length; i++) {
        players.push(word_scores(array_of_words[i], letter_grid))
    }
    return players
}

//into array
const into_array = (edited_words) => {
    var word_collection = []
    var words = []
    for (let i = 0; i < edited_words.length; i++) {
        for (let j = 0; j < edited_words[i].length; j++) {
            my_character = edited_words[i][j]
            my_character = my_character.charCodeAt(0)
            if (my_character > 64 && my_character < 91) {
                my_character = String.fromCharCode(my_character)
                my_character = my_character.toLowerCase()
                words.push(my_character)
            } else if (my_character > 96 && my_character < 123) {
                my_character = String.fromCharCode(my_character)
                words.push(my_character)
            } else {
                words.push(' ')
            }
        }
        word_collection.push(words)
        words = []
    }
    return arr_words(word_collection)
}

const arr_words = (new_collection) => {
    var arr_sub = []
    var arr_words = []
    var word = ''
    for (let i = 0; i < new_collection.length; i++) {
        for (let j = 0; j < new_collection[i].length; j++) {
            if (new_collection[i][j] !== ' ') {

                word += new_collection[i][j]
                if (j === new_collection[i].length - 1) {
                    arr_sub.push(word)
                }
            }
            if (new_collection[i][j] === ' ') {
                arr_sub.push(word)
                word = ''
            }
        }
        arr_words.push(arr_sub)
        arr_sub = []
        word = []
    }
    return arr_words
}



const word_scores = (array_of_words, bgrid) => {
    //implementation of the graph data structure in javascript
    // create a graph class 
    class Graph {
        //constructor takes in the number of vertices
        constructor(noOfVertices) {
            this.noOfVertices = noOfVertices;
            //creates a new map
            this.Grid = [];
        }

        // functions to be implemented 

        addVertex = (letter) => {
            // initialize the adjacent list with a 
            // null array 
            this.Grid.push(letter);
        }

        // adds 2 to one's children
        addEdge = (index1, index2) => {
            var child2;
            for (let i = 0; i < this.Grid.length; i++) {
                if (this.Grid[i].position === index2) {
                    child2 = this.Grid[i]
                }
            }

            for (let i = 0; i < this.Grid.length; i++) {
                if (this.Grid[i].position === index1) {
                    this.Grid[i].children.push(child2)
                }
            }
        }

        check_connected(string) {
            if (string.length == 0) {
                //console.log('success')
                return true;
            } else {
                // console.log(string[0] + 'this is string of 0')
                for (let i = 0; i < this.Grid.length; i++) {
                    if (string[0] == this.Grid[i].letter) {
                        // console.log(this.Grid[i].letter + 'letter present in grid')
                        if (string.length == 1) {
                            // console.log('success')
                            return true;
                        }
                        for (let j = 0; j < this.Grid[i].children.length; j++) {
                            if (this.Grid[i].children[j].letter == string[1]) {
                                var bool = this.check_connected(string.substring(1))
                                if (bool === true) {
                                    // console.log('leaving function')
                                    return true
                                }
                                if (bool === false) {
                                    // console.log('leaving function')
                                    return false
                                }
                            } else {
                                if (j === this.Grid[i].children.length - 1) {
                                    // console.log('second string of letter not present in children')
                                }
                            }
                        }
                    }
                    //letter is not present in the grid
                    else {
                        if (i == 15) {
                            // console.log('letter not present in grid')
                            return false
                        }
                    }
                }
            }
        }

        grid_to_structure() {

            for (let i = 0; i < 16; i++) {
                if ((i % 4) === 3) {
                    this.Grid[i].children.push(this.Grid[i - 1]);
                    this.Grid[i].children.push(this.Grid[i + 3])
                    this.Grid[i].children.push(this.Grid[i - 5])
                } // adds the letter to the right for 0,5,9,13
                else if ((i + 1) % 4 === 1) {
                    this.Grid[i].children.push(this.Grid[i + 1])
                    this.Grid[i].children.push(this.Grid[i - 3])
                    this.Grid[i].children.push(this.Grid[i + 5])
                }
                //
                else {
                    //adds the letters to the left and right for middle row letters
                    this.Grid[i].children.push(this.Grid[i + 1])
                    this.Grid[i].children.push(this.Grid[i - 1])
                    this.Grid[i].children.push(this.Grid[i + 3])
                    this.Grid[i].children.push(this.Grid[i - 3])
                    this.Grid[i].children.push(this.Grid[i + 5])
                    this.Grid[i].children.push(this.Grid[i - 5])
                }
                //pushes to the bottom and top
                if (i < 4 || i < 12) {
                    this.Grid[i].children.push(this.Grid[i + 4])
                }
                if (i > 11 || i >= 4) {
                    this.Grid[i].children.push(this.Grid[i - 4])
                }
            }
            //console.log(this.Grid)
        }

        clean() {
            for (let i = 0; i < this.Grid.length; i++) {
                for (let j = 0; j < this.Grid[i].children.length; j++) {
                    if (this.Grid[i].children[j] === undefined) {
                        this.Grid[i].children.splice(j, 1)
                    }
                }
            }
            //console.log(this.Grid[9])
            //console.log(this.Grid[14])

        }

        print() {
            console.log(this.Grid)
            for (let i = 0; i < this.Grid.length; i++) {
                if (this.Grid[i].children.length != 0) {
                    console.log(this.Grid[i].children)
                }
            }
        }


    }


    class Letter {
        constructor(letter, position) {
            this.letter = letter
            this.position = position
            this.children = []
        }
    }

    const populate_structure = (bgrid) => {
        for (let i = 0; i < bgrid.length; i++) {
            graph.addVertex(new Letter(bgrid[i], i, []))
        }
    }

    const if_valid = (array_of_words, graph) => {
        var bool1 = false;
        var bool2 = false;
        final_words = []
        class Word {
            constructor(word, score, bool) {
                this.word = word,
                    this.score = score
            }
        }
        for (let i = 0; i < array_of_words.length; i++) {
            bool1 = graph.check_connected(array_of_words[i])
                //console.log(bool1)
            bool2 = words.check(array_of_words[i])
            if (bool1 && bool2 && array_of_words[i].length >= 3) {
                final_words.push(new Word(array_of_words[i], array_of_words[i].length))
            } else {
                final_words.push(new Word(array_of_words[i], 0))
            }
        }
        return final_words
    }

    const create_player = (array_of_words, graph) => {
        class Player {
            constructor(name, words) {
                this.name = name,
                    this.words = words
            }
        }

        pName = array_of_words.pop()
            //console.log(pName)
        final_words = if_valid(array_of_words, graph)
        my_player = new Player(pName, final_words)
        return my_player
    }

    var graph = new Graph(16)
        //console.log(bgrid)
    populate_structure(bgrid)
    graph.grid_to_structure()
    graph.clean()
        //console.log(array_of_words)
    curr_player = create_player(array_of_words, graph)
    return curr_player
}






//bool = graph.check_connected('uerinadsar')
/*
var bgrid = ['d', 'r', 't', 'i', 'l', 'a', 'n', 'r', 'r', 's', 'a', 'e', 's', 'f', 'd', 'u']

words_array = [
    'UI\nsat\ndart\nVivek',
    'UI\nAm\ndart\nVivek',
    'Hello\nI\nart\nsad\nJohn',
    'Hello\nI\nart\nsad\nJohn'
]*/

module.exports = get_players