import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import { mapList, getRandomMap, getRandomMaps } from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              // Fetches a random emoji to send from a helper function
              content: `hello world ${getRandomEmoji()}`
            }
          ]
        },
      });
    } else if (name === 'map') {
      let slayerIncluded = true;
      const opt = data.options?.find(option => option.name === 'include_slayer');
      if (opt === 'false') {
        slayerIncluded = false;
      }
      // "map" command
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: getRandomMap(),
            }
          ]
        },
      });
    } else if (name === 'bestof') {
      const user = req.body.member?.user || req.body.user;
      if (user.username === 'zmeatsyyy') {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: `Origin - 3 Flag CTF\nOrigin - 3 Flag CTF\nOrigin - 3 Flag CTF\nOrigin - 3 Flag CTF\nOrigin - 3 Flag CTF\n`, // Pass true to include Slayer maps
              }
            ]
          },
        });
      }

      const mapCountOpt = data.options?.find(option => option.name === 'map_count').value;
      const slayerIncluded = data.options?.find(o => o.name === 'include_slayer')?.value ?? false;
      const uniqueGamemodes = data.options?.find(o => o.name === 'unique_gamemodes')?.value ?? true;
      const uniqueMaps = data.options?.find(o => o.name === 'unique_maps')?.value ?? false;

      // "map" command
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: getRandomMaps(mapCountOpt, slayerIncluded, uniqueGamemodes, uniqueMaps), // Pass true to include Slayer maps
            }
          ]
        },
      });
    } else if (name === 'maplist') {
      // "map" command
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: mapList(),
            }
          ]
        },
      });
    } else if (name === 'bestofchoice') {
      // Generate three random map/gamemode choices
      const choices = getRandomMaps(3, false, true, false)
        .replace(/^🎮.*\n/, '') // Remove the header
        .split('\n• ') // Split into array
        .map(s => s.replace(/^• /, '').trim())
        .filter(Boolean);

      // Build buttons for each choice
      const buttons = choices.map((choice, idx) => ({
        type: 2, // Button
        style: ButtonStyleTypes.PRIMARY,
        label: choice,
        custom_id: `bestofchoice_${idx}`
      }));

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Pick your choice:',
          components: [
            {
              type: 1, // Action Row
              components: buttons
            }
          ]
        }
      });
    }
    // Handle button interactions
  } 
  console.error(`unknown command: ${data?.name || type}`);
  return res.status(400).json({ error: 'unknown command' });
});

if (type === InteractionType.MESSAGE_COMPONENT) {
    const { custom_id } = data;
    if (custom_id && custom_id.startsWith('bestofchoice_')) {
      // Respond to button press
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `You picked: ${req.body.message.components[0].components.find(btn => btn.custom_id === custom_id).label}`,
          flags: InteractionResponseFlags.EPHEMERAL
        }
      });
    }
  }

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
