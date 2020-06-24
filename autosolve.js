//TODAY I'M GOING TO PROGRAM A TRIE not stopping until i'm done


var dictionary = require('word-list-google')
var wordlist = dictionary.englishUsaNoSwearsShort

const autosolve = (bgrid) => {


    //each node has a value, an array of 26 children
    class Node {
        constructor(letter) {
            this.value = letter;
            this.children = new Array(26).fill(null)
            this.end = false;
        }
    }

    class Trie {
        constructor() {
            this.root = new Node(null);
            this.words = [];
        }

        get_position(curr_letter) {
            let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
            for (let i = 0; i < alphabet.length; i++) {
                if (curr_letter === alphabet[i]) {
                    return i;
                }
            }
        }

        insert(string, curr_node) {
            if (string.length === 0) {
                curr_node.end = true;
                return;
            }
            let curr_letter = string.substr(0, 1);
            let position = this.get_position(curr_letter);
            //check if the curr_letter is one of the children
            if (curr_node.children[position] === null) {
                curr_node.children[position] = new Node(curr_letter);
                return this.insert(string.substr(1), curr_node.children[position]);
            } else {
                return this.insert(string.substr(1), curr_node.children[position]);
            }
        }

        prefix(string, curr_node) {
            if (string.length === 0) {
                //console.log("returning true length")
                return true;
            }
            let curr_letter = string.substr(0, 1);
            // console.log(curr_letter +
            //'this is curr_letter')
            let position = this.get_position(curr_letter)
            if (curr_node.children[position] === null) {
                //console.log("returning false")
                return false;
            } else {
                return this.prefix(string.substr(1), curr_node.children[position])
            }
        }

        if_word(string, curr_node) {
            //console.log(string)
            if (string.length === 0) {
                if (curr_node.end === true) {
                    // console.log('returning true')
                    return true;
                }
                // console.log('returning false');
                return false;
            }
            let curr_letter = string.substr(0, 1);
            // console.log(curr_letter +
            //     'this is curr_letter')
            let position = this.get_position(curr_letter)
            if (curr_node.children[position] === null) {
                // console.log("returning false")
                // console.log('returning false');
                return false;
            } else {
                // console.log(curr_letter +
                //     'exists')
                return this.if_word(string.substr(1), curr_node.children[position])
            }
        }


        print(curr_node) {
            if (curr_node === null) {
                return;
            }
            //console.log(curr_node)
            for (let i = 0; i < 26; i++) {
                if (curr_node.children[i] !== null) {
                    process.stdout.write(curr_node.children[i].value + " ");
                }
            }
            process.stdout.write("/");
            for (let i = 0; i < 26; i++) {
                this.print(curr_node.children[i]);
            }
            return;
        }

        print_words(curr_node, word) {
            let count = 0;
            // console.log(curr_node)
            if (curr_node.end === true) {
                this.words.push(word)
            }
            for (let i = 0; i < 26; i++) {
                if (curr_node.children[i] !== null) {
                    count++;
                    if (count >= 2) {
                        word = word.slice(0, -1)
                        word += curr_node.children[i].value;
                        this.print_words(curr_node.children[i], word);
                    } else {
                        word += curr_node.children[i].value;
                        this.print_words(curr_node.children[i], word);
                    }
                }
            }
        }
    }

    //implementation of the graph data structure in javascript
    // create a graph class 
    class Graph {
        //constructor takes in the number of vertices
        constructor(noOfVertices) {
            this.noOfVertices = noOfVertices;
            //creates a new map
            this.Grid = [];
            this.words = [];
            this.count = 0;
            this.trie = new Trie();
        }

        create_trie = () => {
            for (let i = 0; i < wordlist.length; i++) {
                this.trie.insert(wordlist[i], this.trie.root)
            }
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

        possible_consonant = (string) => {
            let digraphs = ['bl', 'br', 'ch', 'ck', 'cl', 'cr', 'dr', 'fl', 'fr', 'gh', 'gl', 'gr', 'ng', 'ph', 'pl',
                'pr', 'qu', 'rh',
                'sc', 'sh', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'th', 'tr', 'tw', 'wh', 'wr'
            ]
            let trigraphs = ['nth', 'sch', 'scr', 'shr', 'spl',
                'spr',
                'squ',
                'str', 'thr'
            ]
            let count = 0;
            for (let i = 0; i < digraphs.length; i++) {
                if (count < trigraphs.length)
                    count = i;
                if (string === digraphs[i]) {
                    return true;
                }
                if (string === trigraphs[count]) {
                    return true;
                }
            }

            return false;
        }

        valid_two_string = (string) => {
            for (let i = 0; i < string.length; i++) {
                if (string[i] === 'a' || string[i] === 'e' || string[i] === 'i' || string[i] === 'o' || string[i] === 'u') {
                    //console.log('returning true')
                    return true;
                }
            }
            return this.possible_consonant(string);
        }

        //generates all 3 letter combinations of a single letter
        letter_combos = (Letter, string_combo, length) => {
            //console.log(length)
            let curr_letter = Letter.letter
            let curr_children = Letter.children;
            //first push the curr_letter into the string and set visited to true
            string_combo += curr_letter;
            if (!this.trie.prefix(string_combo, this.trie.root)) {
                return;
            }
            if (string_combo.length == length) {
                if (this.trie.if_word(string_combo, this.trie.root)) {
                    let check = true;
                    for (let i = 0; i < this.words.length; i++) {
                        if (this.words[i] === string_combo) {
                            check = false;
                        }
                    }
                    if (check)
                        this.words.push(string_combo);
                }

                //console.log(string_combo + ' Final string combo!!!')
                return;
            }
            //loop through every child of the Letter
            for (let i = 0; i < curr_children.length; i++) {
                Letter.visited = true;
                //console.log(curr_letter + 'this is curr_letter')
                //console.log(curr_children[i].letter + 'this is the curr child')
                //console.log(curr_children[i].visited + ' if the child is visited or not')
                if (!curr_children[i].visited)
                    this.letter_combos(curr_children[i], string_combo, length)
            }
            Letter.visited = false;
        }

        all_three_letters = () => {
            for (let j = 3; j < 8; j++) {
                for (let i = 0; i < 16; i++) {
                    this.set_all_false()
                    this.letter_combos(this.Grid[i], "", j)
                }
            }
        }

        set_all_false = () => {
            for (let i = 0; i < this.Grid.length; i++) {
                for (let j = 0; j < this.Grid[i].children.length; j++) {
                    this.Grid[i].children[j].visited = false;
                }
            }
        }


        print() {
            //console.log(this.Grid)
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
            this.visited = false;
        }
    }

    const populate_structure = (bgrid) => {
        for (let i = 0; i < bgrid.length; i++) {
            graph.addVertex(new Letter(bgrid[i], i, []))
        }
    }

    var graph = new Graph(16)
        //console.log(bgrid)
    populate_structure(bgrid)
    graph.grid_to_structure()
    graph.clean()
    graph.create_trie()
    console.log(graph.trie.if_word('abf', graph.trie.root))
        //console.log(graph.Grid[1])
        //console.log(bgrid)
    graph.all_three_letters()
    return graph.words
}

// const grid = [
//     'e', 's', 'z', 'u',
//     'b', 'a', 's', 't',
//     'o', 'c', 'p', 't',
//     'r', 'w', 'e', 'e'
// ]

// console.log(autosolve(grid))

module.exports = autosolve;