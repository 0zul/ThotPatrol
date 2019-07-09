/**
 * @file setAvatar command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!/^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i.test(args.join(' '))) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  await ThotPatrol.user.setAvatar(args.join(' '));

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: `${ThotPatrol.user.username}'s avatar changed!`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'setav' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setAvatar',
  description: 'Sets the avatar of %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setavatar <image_url>',
  example: [ 'setavatar https://example.com/avatar.jpeg' ]
};
