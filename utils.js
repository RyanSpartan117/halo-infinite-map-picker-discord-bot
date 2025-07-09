import 'dotenv/config';
const maps = [
        'Live Fire - Strongholds',
        'Live Fire - Oddball',
        'Live Fire - KOTH',
        'Live Fire - Slayer',
        'Recharge - Strongholds',
        'Recharge - Oddball',
        'Recharge - KOTH',
        'Recharge - Slayer',
        'Streets - Oddball',
        'Origin - 3 Flag CTF',
        'Solitude - KOTH',
        'Solitude - Slayer',
        'Fortress - Neutral Bomb',
        'Fortress - 3 Flag CTF',
        'Forbidden - 3 Flag CTF',
        'Aquarius - 5 Flag CTF',
        'Aquarius - Neutral Bomb',
        'Aquarius - Slayer',
]
export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function mapList() {
  return `🗺️ **All Available Maps:**\n• ${maps.join('\n• ')}`;
}

export function getRandomMap() {
  return maps[Math.floor(Math.random() * maps.length)];

}

export function getThreeRandomMaps() {
  const randomMaps = [];
  while (randomMaps.length < 3) {
    const randomMap = maps[Math.floor(Math.random() * maps.length)];
    if (!randomMaps.includes(randomMap)) {
      randomMaps.push(randomMap);
    }
  }
  return `🎮 **Three Random Maps:**\n• ${randomMaps.join('\n• ')}`;
}