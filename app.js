var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var http = require("http");
var socketIo = require("socket.io");
var { nanoid } = require("nanoid");
var cors = require("cors");
get_players = require("./test.js");
cancel_words = require("./cancel.js")
get_common_words = require("./autosolve.js")
const {
    solve,
    five_and_up_solve
} = require('./completesolve.js');


// key: id, value: room dict
rooms = {};

// create express app
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// create HTTP server with socketIO
var server = http.createServer(app);
var io = socketIo(server);

//creates a socket connection
io.on("connection", function(socket) {
    console.log("socket connection");
});

// creates a room with its own namespace and defines socket communication channels over that namespace
// TOOD: eventually, we want to abstract this logic out of this file because this will become clunky
function create_room(id) {
    // create namespace
    const nsp = io.of(`/rooms/${id}`);

    const room = {
        players_list: [],
        id: id,
        host: "",
        start: false,
        grid: [],
        Words: [],
        player_scores: [],
        time: 0,
        min_length: 3
    };

    const generate_letter = () => {
        let frequencies = [
            9,
            2,
            2,
            4,
            12,
            2,
            3,
            2,
            9,
            1,
            1,
            4,
            2,
            6,
            8,
            2,
            1,
            6,
            4,
            6,
            4,
            2,
            2,
            1,
            2,
            1,
        ];

        let letters = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
        ];

        let letter_bank = [];

        for (let i = 0; i < frequencies.length; i++) {
            for (let j = 0; j < frequencies[i]; j++) {
                letter_bank.push(letters[i]);
            }
        }

        let select = Math.floor(Math.random() * 100 - 2);

        return letter_bank[select];
    };

    generate_grid = () => {
        var grid = [];
        for (let i = 0; i < 16; i++) {
            grid.push(generate_letter());
        }
        for (let i = 0; i < 16; i++) {
            if (grid[i] === undefined) {
                grid[i] = generate_letter();
            }
        }
        return grid;
    };

    nsp.on("connection", function(socket) {
        console.log(`socket connected to room ${id}`);

        //add_player
        socket.on("add_player", (name) => {
            let check = false;
            //if players list length = 0 then it's the host
            if (room.players_list.length === 0) {
                room.host = name;
            }
            for (let i = 0; i < room.players_list.length; i++) {
                let join_name = room.players_list[i].name;
                console.log(join_name);
                if (name === join_name) {
                    check = true;
                }
            }
            if (check) {} else {
                room.players_list.push({ name: name, id: socket.id });
            }
            nsp.emit("host", room.host);
            nsp.emit("add_to_list", room.players_list);
            if (room.time !== 0) {
                console.log(room.time)
                nsp.emit("sending_time", room.time);
            }
        });

        socket.on("setting_time", (args) => {
            console.log(args)
            if (room.host === args.host) {
                room.time = args.time;
                nsp.emit("sending_time", room.time);
            }
        });



        socket.on("min_length", (args) => {
            console.log(args)
            if (room.host === args.host) {
                room.min_length = args.min_length;
                console.log(room.min_length)
                nsp.emit('getmin_length', (room.min_length))
            }
        });

        //start game
        socket.on("start game", (host) => {
            console.log(room.host + 'this is host')
            console.log("Start game getting called" + "by" + host);
            if (host === room.host) {
                room.start = true;
                room.grid = generate_grid();
                room.player_scores = [];
                room.Words = [];
                console.log(room.start);
                console.log(room.grid);
                nsp.emit("starting_game", {
                    start: room.start,
                    grid: room.grid,
                });
            }
        });

        //get words
        socket.on("Words", (data) => {
            console.log("End Game starting");
            words = data.words;
            console.log(words)
            player_count = data.no_of_players;
            console.log(player_count);
            var count = 0;
            name = data.name;
            words += `\n${name}`;
            room.Words.push(words);
            console.log(room.Words)
            for (let i = 0; i < room.Words.length; i++) {
                if (room.Words[i].includes(`${name}`)) {
                    count++;
                    if (count > 1) {
                        room.Words.splice(i, 1);
                    }
                }
            }
            console.log(room.Words);
            players = get_players(room.Words, room.grid);
            room.player_scores.push(players);
            //console.log(room.player_scores)
            if (room.player_scores.length === player_count) {
                console.log('I am getting called player scores')
                socket.on("get_scores", () => {
                    Players = print_players();
                    common_words = get_common_words(room.grid);
                    all_words = solve(room.grid);
                    five_and_up = five_and_up_solve(room.grid);
                    nsp.emit("sending scores", {
                        players: Players,
                        common_words: common_words,
                        all_words: all_words,
                        five_and_up: five_and_up
                    });
                });
            }
        });

        const print_players = () => {
            final_players = room.player_scores.pop()
            if (final_players !== undefined) {
                if (final_players.length === room.players_list.length) {
                    console.log(room.min_length + 'this is min_length')
                    final_players = cancel_words(final_players, room.min_length)
                    return final_players;
                }
            }
        };

        socket.on("disconnect", () => {
            room.players_list.splice();
            //nsp.emit('clients', clientMap); //emits list of players in the
            console.log(`
                            $ { id }: $ { socket.id }
                            disconnected `);
        });
    });

    console.log(`
                            created room with id $ { id }
                            `);
}

/* -------------------------------------------------------------------- */
/* AUTO GENERATED CODE, DO NOT MODIFY UNLESS YOU KNOW WHAT YOU'RE DOING */
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors()); // Use this after the variable declaration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

/*
ROUTE SETUP
*/

// makes io available as req.io in all request handlers
// must be placed BEFORE all request handlers
app.use(function(req, res, next) {
    req.io = io;
    next();
});

// this is a modularized router...
const indexRouter = require("./routes/index");
app.use("/", indexRouter);
// this is not a modularized router...
app.get("/test", function(req, res) {
    res.send("pong");
});

// Route for creating a new room
app.get("/rooms/new", cors(), function(req, res) {
    console.log("being called");
    let newRoomId = nanoid(5).toLocaleUpperCase();
    create_room(newRoomId);
    res.send(newRoomId);
});

// Route for accessing a room id -- returns 200 if room exists and 404 if not
app.get("/rooms/exists/:id", cors(), function(req, res, next) {
    let id = req.params.id;
    if (id in rooms) {
        res.send("true");
        console.log("true");
    } else {
        res.send("false");
    }
});

// CHECKING TOOL, send updates to all sockets in each namespace every second
setInterval(function() {
    for (const id in rooms) {
        const nsp = io.of(` / rooms / $ { id }
                            `);
        nsp.emit(
            "update",
            ` in room $ { id }
                            `
        );
        console.log("sent update");
    }
}, 1000);

/* -------------------------------------------------------------------- */
module.exports = { app: app, server: server };