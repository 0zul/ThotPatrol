/**
 * @file setActivity command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.name) {
    args.name = args.name.join(' ');

    await ThotPatrol.user.setActivity(args.name, { type: args.type });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `My activity is now set to **${args.type} ${args.name}**`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else {
    let game = typeof ThotPatrol.configurations.game.name === 'string' ? ThotPatrol.configurations.game.name : ThotPatrol.configurations.game.name.length ? ThotPatrol.configurations.game.name[0] : null;
    await ThotPatrol.user.setActivity(game, { type: ThotPatrol.configurations.game.type });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `My activity has been reset to the default: **${ThotPatrol.configurations.game.type} ${game}**`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'setGame' ],
  enabled: true,
  ownerOnly: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true },
    { name: 'type', type: String, alias: 't', defaultValue: 'Playing' }
  ]
};

exports.help = {
  name: 'setActivity',
  description: 'Sets the activity of %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setActivity [ ACTIVITY NAME [-t ACTIVITY_TYPE] ]',
  example: [ 'setActivity minions! -t Watching', 'setActivity with you', 'setActivity' ]
};
