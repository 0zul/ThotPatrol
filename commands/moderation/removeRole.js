/**
 * @file removeRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.length) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let user = message.mentions.users.first();
  let role;
  if (!user) {
    user = message.author;
    role = args.join(' ');
  }
  else {
    role = args.slice(1).join(' ');
  }
  role = message.guild.roles.find(r => r.name === role);
  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return ThotPatrol.log.info(ThotPatrol.i18n.error(message.guild.language, 'lowerRole'));
  else if (!role) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  let member = await ThotPatrol.utils.fetchMember(message.guild, user.id);
  await member.removeRole(role);

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.RED,
      description: ThotPatrol.i18n.info(message.guild.language, 'removeRole', message.author.tag, role.name, user.tag)
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });

  let reason = 'No reason given';

  ThotPatrol.emit('moderationLog', message, this.help.name, user, reason, {
    role: role
  });
};

exports.config = {
  aliases: [ 'remover' ],
  enabled: true
};

exports.help = {
  name: 'removeRole',
  description: 'Removes the specified role from a specified user of your Discord server.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'removeRole [@user-mention] <Role Name>',
  example: [ 'removeRole @user#0001 Role Name', 'removeRole Role Name' ]
};
