/**
 * @file roleID command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.length) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let role = message.mentions.roles.first();
  if (!role) {
    role = message.guild.roles.find(role => role.name === args.join(' '));
  }

  if (role) {
    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.BLUE,
        fields: [
          {
            name: 'Role Name',
            value: role.name,
            inline: true
          },
          {
            name: 'ID',
            value: role.id,
            inline: true
          }
        ]
      }
    });
  }
  else {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }
};

exports.config = {
  aliases: [ 'rid' ],
  enabled: true
};

exports.help = {
  name: 'roleID',
  description: 'Shows the ID of a specified role of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roleID <@role-mention|role_name>',
  example: [ 'roleID @Dark Knigths', 'roleID The Legends' ]
};
