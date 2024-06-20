// Importing the 'readline' module from Node.js
const readline = require('readline');

// Creating an interface for reading input and outputting to the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to handle commands entered by the user
const handleCommand = (command, options) => {
  const { spawn } = require('child_process');
  const appProcess = spawn('node', ['app.js', command, ...options]);

  // Event listeners for standard output, standard error, and close
  appProcess.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  appProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  appProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Process exited with code ${code}`);
    }
    askForCommand();
  });

  appProcess.on('error', (error) => {
    console.error(`Failed to start subprocess: ${error.message}`);
    askForCommand();
  });
};

// Function to ask the user for a command
const askForCommand = () => {
  rl.question('Enter a command: ', (input) => {
    const [command, ...options] = input.trim().split(' ');
    if (command) {
      handleCommand(command, options);
    } else {
      console.log('No command entered. Please try again.');
      askForCommand();
    }
  });
};

// Logging out messages and starting the command input process
console.log('Welcome to the CLI!');
askForCommand();
