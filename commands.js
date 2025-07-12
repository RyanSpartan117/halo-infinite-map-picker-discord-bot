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

const BESTOF = {
  name: 'bestof',
  description: 'Choose a best of series. Defaults to using unique game modes without slayer maps',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      type: 4, // integer
      name: 'map_count',
      description: 'Number of maps to return',
      required: true,
      min_value: 1,
      max_value: 25,
    },
    {
      type: 5, // boolean
      name: 'unique_gamemodes',
      description: 'Choose if you dont want duplicate gamemodes in this series (default: true)',
      required: false,
    },
    {
      type: 5, // boolean
      name: 'include_slayer',
      description: 'Include Slayer maps (default: false)',
      required: false,
    },
  ]
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

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND, BESTOF, MAP, MAPLIST];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
