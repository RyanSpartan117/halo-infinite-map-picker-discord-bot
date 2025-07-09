import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Random picker command
const MAP = {
  name: 'map',
  description: 'Return a single random map',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const MAP3 = {
  name: 'map3',
  description: 'Return three random maps',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}

const MAPLIST = {
  name: 'maplist',
  description: 'Return a list of maps',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [TEST_COMMAND, MAP, CHALLENGE_COMMAND, MAP3, MAPLIST];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
