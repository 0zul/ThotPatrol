/**
 * @file removeSelfAssignableRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let index = parseInt(args[0]);
  if (!index || index <= 0) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }
  index -= 1;

  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'selfAssignableRoles' ],
    where: {
      guildID: message.guild.id
    }
  });

  if (!guildModel || !guildModel.dataValues.selfAssignableRoles) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notSet', 'self-assignable roles'), message.channel);
  }
  let roles = guildModel.dataValues.selfAssignableRoles;

  if (index >= roles.length) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'indexRange'), message.channel);
  }

  let deletedRoleID = roles[parseInt(args[0]) - 1];
  roles.splice(parseInt(args[0]) - 1, 1);

  await ThotPatrol.database.models.guild.update({
    selfAssignableRoles: roles
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'selfAssignableRoles' ]
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.RED,
      description: `I've deleted **${message.guild.roles.get(deletedRoleID).name}** from self assignable roles.`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'rsar' ],
  enabled: true
};

exports.help = {
  name: 'removeSelfAssignableRole',
  description: 'Deletes a role from the list of self-assignable roles.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'removeSelfAssignableRole <index>',
  example: [ 'removeSelfAssignableRole 3' ]
};
