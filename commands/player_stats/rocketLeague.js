/**
 * @file rocketLeague command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.player) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  // If user doesn't provide the platform, default to Steam
  if (!args.platform) {
    args.platform = 'Steam';
  }
  else {
    let platforms = [ 'steam', 'ps4', 'xboxone' ]; // Available platforms for the game
    // If the platform is not valid, return the available platforms
    if (!platforms.includes(args.platform = args.platform.toLowerCase())) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'invalidPlatform', `${platforms.join(', ').toUpperCase()}`), message.channel);
    }
  }

  if (args.platform === 'steam') {
    let { steamID64 } = await ThotPatrol.methods.makeBWAPIRequest(`/steam/profile/${args.player}`);

    args.player = steamID64;
  }

  // eslint-disable-next-line require-jsdoc
  let requestURL = stat_type => `https://api.rocketleague.com/api/v1/${args.platform}/leaderboard/stats/${stat_type}/${args.player}`;
  let endpoints = [
    requestURL('wins'),
    requestURL('goals'),
    requestURL('saves'),
    requestURL('shots'),
    requestURL('mvps'),
    requestURL('assists')
  ];

  let stats = [];
  for (let endpoint of endpoints) {
    let options = {
      url: endpoint,
      headers: {
        'Authorization': `Token ${ThotPatrol.credentials.rocketLeagueUserToken}`,
        'User-Agent': `ThotPatrol/${ThotPatrol.package.version} (${ThotPatrol.user.tag}; ${ThotPatrol.user.id}) https://bastionbot.org`
      },
      json: true
    };

    let stat = await request(options);
    stats.push(stat[0]);
  }

  let fields = stats.map(stat => {
    return {
      name: stat.stat_type.toTitleCase(),
      value: stat.value,
      inline: true
    };
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      author: {
        name: args.player
      },
      title: `Rocket League Stats - ${args.platform.toUpperCase()}`,
      fields: fields,
      thumbnail: {
        url: 'https://vignette.wikia.nocookie.net/rocketleague/images/2/27/Rocket_League_logo.jpg'
      },
      footer: {
        text: 'Powered by Rocket League'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'player', type: String, defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'Steam' }
  ]
};

exports.help = {
  name: 'rocketLeague',
  description: 'Get stats of any Rocket League player.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rocketLeague <PLAYER_ID> [ -p <PLATFORM> ]',
  example: [ 'rocketLeague k3rn31p4nic -p XBoxOne' ]
};
