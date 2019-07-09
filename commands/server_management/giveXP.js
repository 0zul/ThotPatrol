/**
 * @file giveXP command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.id || !args.points || !Number.isSafeInteger(parseInt(args.points))) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  if (message.mentions.users.size) {
    args.id = message.mentions.users.first().id;
  }

  let guildMemberModel = await ThotPatrol.database.models.guildMember.findOne({
    attributes: [ 'experiencePoints' ],
    where: {
      userID: args.id,
      guildID: message.guild.id
    }
  });
  if (!guildMemberModel) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'profileNotCreated', `<@${args.id}>`), message.channel);
  }

  let awardedXP = args.points;
  args.points = `${parseInt(guildMemberModel.dataValues.experiencePoints) + parseInt(args.points)}`;
  if (!Number.isSafeInteger(parseInt(args.points))) args.points = '0';

  await ThotPatrol.database.models.guildMember.update({
    experiencePoints: args.points
  },
  {
    where: {
      userID: args.id,
      guildID: message.guild.id
    },
    fields: [ 'experiencePoints' ]
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: `<@${args.id}> has been awarded with **${awardedXP}** experience points.`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'points', alias: 'n', type: String }
  ]
};

exports.help = {
  name: 'giveXP',
  description: 'Give the specified amount of experience points to the specified user and increase their level.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'giveXP <@USER_MENTION | USER_ID> <-n POINTS>',
  example: [ 'giveXP @user#0001 -n 100', 'giveXP 242621467230268813 -n 150' ]
};
