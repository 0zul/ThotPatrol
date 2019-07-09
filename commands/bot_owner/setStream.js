/**
 * @file setStream command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!/^((https:\/\/)(www\.)?(twitch\.tv)\/[a-z0-9-._]+)$/i.test(args[0]) || args.slice(1).join(' ').length < 1) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  await ThotPatrol.user.setActivity(args.slice(1).join(' '), {
    type: 1,
    url: args[0]
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: `${ThotPatrol.user.username} is now streaming **${args.slice(1).join(' ')}**`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setStream',
  description: 'Sets the video stream of %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setStream <twitch> <Status text>',
  example: [ 'setStream https://twitch.tv/k3rn31p4nic Nothing' ]
};
