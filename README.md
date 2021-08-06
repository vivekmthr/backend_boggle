# Online Boggle Backend in Node.js

**Introduction**

This Repo contains the Node.js backend for my boggle project.

**Design Overview**
 - The project backend is Node.js. The app.js initializes the server and creates a socket instance between the server and the client website.
 - When a player creates a game, a unique id is generated and passed through the socket instance to the client website.
 - The player can then send the id instance to their friends and start the game. The backend will generate a unique boggle board based on the original letter frequencies and send it over the socket connection.
 - Players can then enter their words on the front-end website, these are passed back to the server which runs an algorithm to auto-score them and verify that they exist on the board. 
 - Finally the back-end scores the board based on boggles word-scoring algorithm, and returns the scores of each player as well as a winner. 
 - When the host navigates off the page the socket instance is destroyed. 

**Deployment**
The game is live at onlineboggle.web.app!
