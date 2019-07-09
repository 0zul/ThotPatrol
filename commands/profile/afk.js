/**
 * @file afk command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  if (!message.guild.usersAFK) message.guild.usersAFK = [];
  if (message.guild.usersAFK.includes(message.author.id)) return;

  message.guild.usersAFK.push(message.author.id);

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: `${message.author} I've set you as AFK. If anyone mentions you while you're away, I'll let them know. AFK mode will be disabled once you're back and send a message anywhere.`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'message', type: String, alias: 'm', defaultOption: true }
  ]
};

exports.help = {
  name: 'afk',
  description: 'Sets you as Away From Keyboard (AFK). So when someone mentions you, ThotPatrol will let them know that you\'re AFK. It\'ll be automatically disabled once you are back.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'afk',
  example: []
};
