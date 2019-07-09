/**
 * @file stats command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let owners = [];
  for (let userID of ThotPatrol.credentials.ownerId) {
    let user = await ThotPatrol.fetchUser(userID).catch(() => {});
    if (user) owners.push(user.tag);
  }

  let shardStats = ThotPatrol.shard ? await ThotPatrol.shard.broadcastEval('this.uptime') : 'None';
  if (shardStats instanceof Array) {
    shardStats = shardStats.length === ThotPatrol.shard.count ? 'All shards online' : `Launched ${shardStats.length} / ${ThotPatrol.shard.count} shards`;
  }

  let uptime = ThotPatrol.shard ? await ThotPatrol.shard.broadcastEval('this.uptime') : ThotPatrol.uptime;
  if (uptime instanceof Array) {
    uptime = uptime.reduce((max, cur) => Math.max(max, cur), -Infinity);
  }
  let seconds = uptime / 1000;
  let days = parseInt(seconds / 86400);
  seconds = seconds % 86400;
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = parseInt(seconds / 60);
  seconds = parseInt(seconds % 60);

  uptime = `${seconds}s`;
  if (days) {
    uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  else if (hours) {
    uptime = `${hours}h ${minutes}m ${seconds}s`;
  }
  else if (minutes) {
    uptime = `${minutes}m ${seconds}s`;
  }

  let guilds = ThotPatrol.shard ? await ThotPatrol.shard.broadcastEval('this.guilds.size') : ThotPatrol.guilds.size;
  if (guilds instanceof Array) {
    guilds = guilds.reduce((sum, val) => sum + val, 0);
  }
  let textChannels = ThotPatrol.shard ? await ThotPatrol.shard.broadcastEval('this.channels.filter(channel => channel.type === \'text\').size') : ThotPatrol.channels.filter(channel => channel.type === 'text').size;
  if (textChannels instanceof Array) {
    textChannels = textChannels.reduce((sum, val) => sum + val, 0);
  }
  let voiceChannels = ThotPatrol.shard ? await ThotPatrol.shard.broadcastEval('this.channels.filter(channel => channel.type === \'voice\').size') : ThotPatrol.channels.filter(channel => channel.type === 'voice').size;
  if (voiceChannels instanceof Array) {
    voiceChannels = voiceChannels.reduce((sum, val) => sum + val, 0);
  }
  let rss = ThotPatrol.shard ? await ThotPatrol.shard.broadcastEval('process.memoryUsage().rss') : process.memoryUsage().rss;
  if (rss instanceof Array) {
    rss = rss.reduce((sum, val) => sum + val, 0);
  }
  let heapUsed = ThotPatrol.shard ? await ThotPatrol.shard.broadcastEval('process.memoryUsage().heapUsed') : process.memoryUsage().heapUsed;
  if (heapUsed instanceof Array) {
    heapUsed = heapUsed.reduce((sum, val) => sum + val, 0);
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      author: {
        name: `ThotPatrol ${ThotPatrol.package.version}`
      },
      url: ThotPatrol.package.url,
      fields: [
        {
          name: 'Author',
          value: `[${ThotPatrol.package.author}](${ThotPatrol.package.authorUrl})`,
          inline: true
        },
        {
          name: 'BOT ID',
          value: ThotPatrol.credentials.botId,
          inline: true
        },
        {
          name: `Owner${ThotPatrol.credentials.ownerId.length > 1 ? 's' : ''}`,
          value: owners.join('\n') || '-',
          inline: true
        },
        {
          name: `Owner ID${ThotPatrol.credentials.ownerId.length > 1 ? 's' : ''}`,
          value: ThotPatrol.credentials.ownerId.join('\n'),
          inline: true
        },
        {
          name: 'Default Prefixes',
          value: ThotPatrol.configurations.prefix.join(' '),
          inline: true
        },
        {
          name: 'Uptime',
          value: uptime,
          inline: true
        },
        {
          name: 'Shards',
          value: ThotPatrol.shard ? `${ThotPatrol.shard.count} Shards` : 'None',
          inline: true
        },
        {
          name: 'Shard Status',
          value: shardStats,
          inline: true
        },
        {
          name: 'Presence',
          value: `${guilds.toHumanString()} Servers\n`
          + `${textChannels.toHumanString()} Text Channels\n`
          + `${voiceChannels.toHumanString()} Voice Channels`,
          inline: true
        },
        {
          name: 'Memory',
          value: `${(rss / 1024 / 1024).toFixed(2)} MB RSS\n`
                 + `${(heapUsed / 1024 / 1024).toFixed(2)} MB Heap`,
          inline: true
        }
      ],
      thumbnail: {
        url: ThotPatrol.user.displayAvatarURL
      },
      footer: {
        text: `${ThotPatrol.shard ? `Shard: ${ThotPatrol.shard.id} • ` : ''}WebSocket PING: ${parseInt(ThotPatrol.ping)}ms`
      },
      timestamp: new Date()
    }
  });
};

exports.config = {
  aliases: [ 'info' ],
  enabled: true
};

exports.help = {
  name: 'stats',
  description: 'Shows detailed stats and info of %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'stats',
  example: []
};
