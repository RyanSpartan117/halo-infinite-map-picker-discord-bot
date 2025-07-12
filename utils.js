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
        'Origin - CTF',
        'Solitude - KOTH',
        'Solitude - Slayer',
        'Fortress - Neutral Bomb',
        'Fortress - CTF',
        'Forbidden - CTF',
        'Aquarius - CTF',
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

// export function getRandomMaps(num, slayerIncluded, uniqueGamemodes, uniqueMaps) {
//   let availableMaps = maps;
//   if (!slayerIncluded) {
//     availableMaps = availableMaps.filter(map => !map.includes('Slayer'));
//   }

//   // Filter for unique maps if needed
//   if (uniqueMaps) {
//     const seen = new Set();
//     availableMaps = availableMaps.filter(map => {
//       const mapName = map.split('-')[0].trim();
//       if (seen.has(mapName)) return false;
//       seen.add(mapName);
//       return true;
//     });
//   }

//   // Filter for unique gamemodes if needed
//   if (uniqueGamemodes) {
//     const seen = new Set();
//     availableMaps = availableMaps.filter(map => {
//       const gamemode = map.split('-')[1]?.trim();
//       if (!gamemode) return false;
//       if (seen.has(gamemode)) return false;
//       seen.add(gamemode);
//       return true;
//     });
//   }

//   if (num > availableMaps.length) {
//     return 'THERE ARENT THAT MANY MAPS IN THE MAP POOL YOU TWAT';
//   }

//   // Shuffle availableMaps
//   const shuffled = availableMaps.slice();
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }

//   const randomMaps = [];
//   let lastMapName = null;
//   for (let i = 0; i < shuffled.length && randomMaps.length < num; i++) {
//     const map = shuffled[i];
//     const mapName = map.split('-')[0].trim();
//     if (!uniqueMaps && lastMapName && mapName === lastMapName) {
//       continue; // skip if same map as previous
//     }
//     randomMaps.push(map);
//     lastMapName = mapName;
//   }

//   return `🎮 **${num === 1 ? 'Random Map' : num + ' Random Maps'}:**\n• ${randomMaps.join('\n• ')}`;
// }

export function getRandomMaps(num, slayerIncluded, uniqueGamemodes, uniqueMaps) {
  let availableMaps = maps;
  if (!slayerIncluded) {
    availableMaps = maps.filter(map => !map.includes('Slayer'));
  }

  if (num > availableMaps.length) {
    return 'THERE ARENT THAT MANY MAPS IN THE MAP POOL YOU TWAT';
  }

  const randomMaps = [];
  const usedGamemodes = new Set();
  const usedMapNames = new Set();
  let lastMapName = null;
  while (randomMaps.length < num && availableMaps.length > 0) {
    const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];
    const [mapName, gamemode] = randomMap.split('-').map(s => s.trim());
    // Unique maps: never select the same map (before hyphen) twice
    if (uniqueMaps) {
      if (usedMapNames.has(mapName)) {
        availableMaps = availableMaps.filter(m => m !== randomMap);
        continue;
      }
    } else {
      // Not unique: still don't allow the same map twice in a row
      if (lastMapName && mapName === lastMapName) {
        availableMaps = availableMaps.filter(m => m !== randomMap);
        continue;
      }
    }
    if (!randomMaps.includes(randomMap)) {
      if (uniqueGamemodes) {
        if (gamemode && !usedGamemodes.has(gamemode)) {
          randomMaps.push(randomMap);
          usedGamemodes.add(gamemode);
          usedMapNames.add(mapName);
          lastMapName = mapName;
        }
      } else {
        randomMaps.push(randomMap);
        usedMapNames.add(mapName);
        lastMapName = mapName;
      }
    }
    availableMaps = availableMaps.filter(m => m !== randomMap);
  }
  return `🎮 **${num === 1 ? 'Random Map' : num + ' Random Maps'}:**\n• ${randomMaps.join('\n• ')}`;
}
