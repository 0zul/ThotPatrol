/**
 * @file setUsername command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.join(' ').length >= 1) {
    await ThotPatrol.user.setUsername(args.join(' '));

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `${ThotPatrol.user.username}'s username is now set to **${args.join(' ')}**`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'setun' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setUsername',
  description: 'Changes the username of %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setUsername <text>',
  example: [ 'setUsername NewUsername' ]
};
