/**
 * @file messageChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.length < 2) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let channel = message.guild.channels.get(args[0]);

  if (!channel) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notFound', 'channel'), message.channel);
  }

  await channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      description: args.slice(1).join(' ')
    }
  }).catch(() => {});
};

exports.config = {
  aliases: [ 'msgc' ],
  enabled: true
};

exports.help = {
  name: 'messageChannel',
  description: 'Send a message to any specified text channel of your server through ThotPatrol.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'messageChannel <CHANNEL_ID> <Message>',
  example: [ 'messageChannel 299588114042454036 Hello everyone!' ]
};
