/**
 * @file zalgolize command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.length) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: 'Zalgolized Text',
      description: ThotPatrol.methods.zalgolize(args.join(' '))
    }
  });
};

exports.config = {
  aliases: [ 'zalgo' ],
  enabled: true
};

exports.help = {
  name: 'zalgolize',
  description: 'Sends the same message that you had sent, but zalgolized.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'zalgolize <text>',
  example: [ 'zalgolize It looks clumsy, but it\'s cool!' ]
};
