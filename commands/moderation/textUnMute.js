/**
 * @file textUnMute command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }
  else if (args.id) {
    user = await ThotPatrol.fetchUser(args.id);
  }
  if (!user) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let member = await ThotPatrol.utils.fetchMember(message.guild, user.id);
  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return ThotPatrol.log.info(ThotPatrol.i18n.error(message.guild.language, 'lowerRole'));

  if (args.server) {
    let mutedRole = message.guild.roles.find(role => role.name === 'ThotPatrol:mute');
    await member.removeRole(mutedRole, args.reason);
  }
  else {
    let permissionOverwrites = message.channel.permissionOverwrites.get(user.id);
    if (permissionOverwrites) {
      await permissionOverwrites.delete();
    }
  }

  args.reason = args.reason.join(' ');

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: ThotPatrol.i18n.info(message.guild.language, 'textUnmute', message.author.tag, user.tag, args.reason)
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });

  ThotPatrol.emit('moderationLog', message, this.help.name, user, args.reason, {
    channel: message.channel
  });
};

exports.config = {
  aliases: [ 'tum' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] },
    { name: 'server', type: Boolean, alias: 's' }
  ]
};

exports.help = {
  name: 'textUnMute',
  description: 'Text unmutes from specified user from the specified text channel of your Discord server.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'textUnMute <@USER_MENTION | USER_ID> [-r Reason] [--server]',
  example: [ 'textUnMute @user#001 -r Apologized', 'textUnMute 167147569575323761 -r Forgiven --server' ]
};
