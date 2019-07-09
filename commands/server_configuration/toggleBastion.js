/**
 * @file toggleThotPatrol command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'enabled' ],
    where: {
      guildID: message.guild.id
    }
  });

  let enabled, color, description;
  if (guildModel.dataValues.enabled) {
    enabled = false;
    color = ThotPatrol.colors.RED;
    description = ThotPatrol.i18n.info(message.guild.language, 'disableThotPatrol', message.author.tag);
  }
  else {
    enabled = true;
    color = ThotPatrol.colors.GREEN;
    description = ThotPatrol.i18n.info(message.guild.language, 'enableThotPatrol', message.author.tag);
  }

  await ThotPatrol.database.models.guild.update({
    enabled: enabled
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'enabled' ]
  });

  await message.channel.send({
    embed: {
      color: color,
      description: description
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'toggleThotPatrol',
  description: 'Enable or disable ThotPatrol in your server. Disabling ThotPatrol will prevent everyone, including the server owner, from using it. But if you have enabled any settings that does not need user interaction, it will still work, like starboard, filters, auto assignable roles etc.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'toggleThotPatrol',
  example: []
};
