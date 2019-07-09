/**
 * @file echo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.length < 1) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      description: args.join(' '),
      footer: {
        text: `${ThotPatrol.credentials.ownerId.includes(message.author.id) ? '' : ThotPatrol.i18n.info(message.guild.language, 'endorsementMessage')}`
      }
    }
  });
};

exports.config = {
  aliases: [ 'say' ],
  enabled: true
};

exports.help = {
  name: 'echo',
  description: 'Sends the same message that you had sent. Just like an echo!',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'echo <text>',
  example: [ 'echo Hello, world!' ]
};
