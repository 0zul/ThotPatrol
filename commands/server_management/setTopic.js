/**
 * @file setTopic command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let channel = message.mentions.channels.first();
  let topic;
  if (!channel) {
    channel = message.channel;
    topic = args.join(' ');
  }
  else {
    topic = args.slice(1).join(' ').trim();
  }

  if (!channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
    return ThotPatrol.emit('userMissingPermissions', this.help.userTextPermission);
  }
  if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
    return ThotPatrol.emit('ThotPatrolMissingPermissions', this.help.botPermission, message);
  }

  await channel.setTopic(topic);

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.ORANGE,
      description: ThotPatrol.i18n.info(message.guild.language, 'updateChannelTopic', message.author.tag, channel.name, channel.topic)
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'sett' ],
  enabled: true
};

exports.help = {
  name: 'setTopic',
  description: 'Sets channel topic of the specified text channel of your Discord server.',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'setTopic [#channel-mention] [Channel Topic]',
  example: [ 'setTopic #channel-name New Topic', 'setTopic New Topic', 'setTopic' ]
};
