const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({ input, output });

console.log(
  'Hello! Please enter text to save to the file. Type "exit" or press Ctrl+C to quit.',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
  } else {
    writableStream.write(input + '\n', (err) => {
      if (err) console.error('Error writing to file:', err);
    });
  }
});

rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
});

rl.on('close', () => {
  writableStream.end();
  process.exit(0);
});
