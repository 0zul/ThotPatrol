/**
 * @file music command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.id) args.id = message.guild.id;

  let guildModel = await message.client.database.models.guild.findOne({
    attributes: [ 'guildID', 'music' ],
    where: {
      guildID: args.id
    }
  });

  if (!guildModel) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notFound', 'server'), message.channel);
  }

  let musicStatus = !guildModel.dataValues.music;

  await message.client.database.models.guild.update({
    music: musicStatus
  },
  {
    where: {
      guildID: args.id
    },
    fields: [ 'music' ]
  });

  let guild = ThotPatrol.resolver.resolveGuild(args.id);
  let guildDetails = guild ? `**${guild.name}** / ${args.id}` : `**${args.id}**`;

  await message.channel.send({
    embed: {
      color: musicStatus ? ThotPatrol.colors.GREEN : ThotPatrol.colors.RED,
      description: `Music support has been ${musicStatus ? 'enabled' : 'disabled'} in the server ${guildDetails}`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'music',
  description: 'Toggle music support for the specified server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'music <GUILD_ID>',
  example: [ 'music 441122339988775566' ]
};
