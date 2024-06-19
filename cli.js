// Importing the 'readline' module from Node.js
const readline = require('readline');

// Creating an interface for reading input and outputting to the console
const rl = readline.createInterface({
  input: process.stdin,   
  output: process.stdout, 
});

// This Function handle commands entered by the user
const handleCommand = (command, options) => {
  const { spawn } = require('child_process'); 
  const appProcess = spawn('node', ['app.js', command, ...options]);

  // Event listeners for standard output, standard error ans close
  appProcess.stdout.on('data', (data) => {
    console.log(`${data}`); 
  });
  appProcess.stderr.on('data', (data) => {
    console.error(`${data}`); 
  });
  appProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Process exited with code ${code}`); 
    }
    askForCommand(); 
  });
};

// Function to ask the user for a command
const askForCommand = () => {
  rl.question('Enter a command: ', (input) => {
    const [command, ...options] = input.trim().split(' '); 
    handleCommand(command, options); 
  });
};
//This logging out messages and starting command input process
console.log('Welcome to the CLI!'); 
askForCommand(); 
