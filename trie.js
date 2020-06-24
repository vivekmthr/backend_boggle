//TODAY I'M GOING TO PROGRAM A TRIE not stopping until i'm done
const fs = require('fs');
const wordListPath = require('word-list');
const wordlist = require("common_word_list")

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
            // console.log("returning true length")
            return true;
        }
        let curr_letter = string.substr(0, 1);
        // console.log(curr_letter +
        //     'this is curr_letter')
        let position = this.get_position(curr_letter)
        if (curr_node.children[position] === null) {
            // console.log("returning false")
            return false;
        } else {
            return this.prefix(string.substr(1), curr_node.children[position])
        }
    }
    if_word(string, curr_node) {
        console.log(string)
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

trie = new Trie();
const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
let test = [];
for (let i = 0; i < wordArray.length; i++) {
    trie.insert(wordArray[i], trie.root)
}
// for (let i = 0; i < 150; i++) {
//     console.log(trie.prefix(wordArray[i], trie.root))
// }

console.log(wordlist.commonWords())
console.log(trie.if_word('abf', trie.root))
    // trie.insert('aah', trie.root)
    // trie.insert('aahe', trie.root)
    // trie.insert('all', trie.root)

//check = trie.prefix('heard', trie.root)
//trie.print_words(trie.root, "")