/**
 * @file setStatus command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.status && /^(?:online|idle|dnd|invisible)$/i.test(args.status)) {
    await ThotPatrol.user.setStatus(args.status);

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `${ThotPatrol.user.username}'s status is now set to **${args.status}**`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else {
    await ThotPatrol.user.setStatus(ThotPatrol.configurations.status);

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `${ThotPatrol.user.username}'s status is now set to the default status **${ThotPatrol.configurations.status}**`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'status', type: String, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'setStatus',
  description: 'Sets the status of %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setStatus [online|idle|dnd|invisible]',
  example: [ 'setStatus invisible', 'setStatus' ]
};
