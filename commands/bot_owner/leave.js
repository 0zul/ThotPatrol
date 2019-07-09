/**
 * @file leave command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!(parseInt(args[0]) < 9223372036854775807)) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let guild, found = true;
  if (ThotPatrol.shard) {
    guild = await ThotPatrol.shard.broadcastEval(`this.guilds.get('${args[0]}') && this.guilds.get('${args[0]}').leave().catch(e => this.log.error(e))`);
    guild = guild.filter(g => g);
    if (!guild.length) {
      found = false;
    }
  }
  else {
    guild = ThotPatrol.guilds.get(args[0]);
    if (!guild) {
      found = false;
    }
    await guild.leave();
  }

  if (found) {
    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: `I've left the${ThotPatrol.shard ? ' ' : ` **${guild.name}** `}Discord server with the ID **${args[0]}**.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else {
    ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notFound', 'Discord server'), message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'leave',
  description: 'Asks ThotPatrol to leave a specified server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leave <guild_id>',
  example: [ 'leave 441122339988775566' ]
};
