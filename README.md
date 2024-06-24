# 2024Sprint1FullStack
This project is a simple CLI and web application for managing user acciounts and generating tokens for new users. 

The CLI provides commands for initializing the application, confirming settings, creating user tokens, updating user information, and searching for users.

The web application provides a form for new users to enter their username and receive a token for confirming  their account. 

The project is organized into the follwing files:
cli.js handles the main command-line interface commands.
app.js contains the aplication logic for handling configuration, user data.
server.js hosts a simple web server and serves the HTML file for the web form.
index.html is the HTML file for the web form.
token.js for generating user tokens.
modules/config.js for managing configuration file.
modules/logger.js for logging events to a file.
modules/users.js for managing users in jSON file.
data/token.json for storing token information.
data/users.json for storing user data.
app/config.json for storing application.
logs/events.log logs applicationevents, such as initialization.
usage.txt contains instructions on the available command line options based on the project.

The project uses the following dependencies:
CRC: For generating cyclic redundancy check for user tokens.
date-fns for manipulating dates.
fs: For reading and writing files.
express: for creaing and managing web  server.
path: For working with file paths .

To run the project use the CLI with node
cli init              initialize the application
cli status            provides status for initialization and configuration
cli config --show     provides view of the current config file
cli config --set      update the config file with new values
cli config --reset    reset the config file back to it's original state
cli token --new <username>     generate a user token based on an end user's username 
cli token --upd <field> <username> <value>   update user records, email and /or phone number
cli token --search <field> <value>  search for a user record queried by username,email,or phone
Finally, start the server with node server.js. The web form at http://localhost:3000 allows new users to enter their username and receive a token for confirming their account







