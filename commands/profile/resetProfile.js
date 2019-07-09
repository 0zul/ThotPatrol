/**
 * @file resetProfile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let guildMemberModel = await ThotPatrol.database.models.guildMember.describe();

  let deletionMessage;

  if (args.user && message.member.hasPermission('MANAGE_GUILD')) {
    await ThotPatrol.database.models.guildMember.update({
      ThotPatrolCurrencies: guildMemberModel.ThotPatrolCurrencies.defaultValue,
      experiencePoints: guildMemberModel.experiencePoints.defaultValue,
      level: guildMemberModel.level.defaultValue,
      karma: guildMemberModel.karma.defaultValue,
      lastClaimed: guildMemberModel.lastClaimed.defaultValue,
      claimStreak: guildMemberModel.claimStreak.defaultValue
    },
    {
      where: {
        guildID: message.guild.id,
        userID: args.user
      },
      fields: [ 'ThotPatrolCurrencies', 'experiencePoints', 'level', 'karma', 'lastClaimed', 'claimStreak' ]
    });

    deletionMessage = `You've successfully reset the ThotPatrol profile of <@${args.user}>.`;
  }
  else if (args.all && message.member.hasPermission('MANAGE_GUILD')) {
    await ThotPatrol.database.models.guildMember.update({
      ThotPatrolCurrencies: guildMemberModel.ThotPatrolCurrencies.defaultValue,
      experiencePoints: guildMemberModel.experiencePoints.defaultValue,
      level: guildMemberModel.level.defaultValue,
      karma: guildMemberModel.karma.defaultValue,
      lastClaimed: guildMemberModel.lastClaimed.defaultValue,
      claimStreak: guildMemberModel.claimStreak.defaultValue
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'ThotPatrolCurrencies', 'experiencePoints', 'level', 'karma', 'lastClaimed', 'claimStreak' ]
    });

    deletionMessage = 'You\'ve successfully reset every ThotPatrol profiles.';
  }
  else {
    await ThotPatrol.database.models.guildMember.update({
      ThotPatrolCurrencies: guildMemberModel.ThotPatrolCurrencies.defaultValue,
      experiencePoints: guildMemberModel.experiencePoints.defaultValue,
      level: guildMemberModel.level.defaultValue,
      karma: guildMemberModel.karma.defaultValue,
      lastClaimed: guildMemberModel.lastClaimed.defaultValue,
      claimStreak: guildMemberModel.claimStreak.defaultValue
    },
    {
      where: {
        guildID: message.guild.id,
        userID: message.author.id
      },
      fields: [ 'ThotPatrolCurrencies', 'experiencePoints', 'level', 'karma', 'lastClaimed', 'claimStreak' ]
    });

    deletionMessage = 'You\'ve successfully reset your ThotPatrol profile.';
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: deletionMessage
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'user', type: String, alias: 'u', defaultOption: true },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'resetProfile',
  description: 'Resets all your profile data, inluding all the XP, level, karma and currency that you\'ve earned. If you have Manage Server permission, you can reset anyone and everyone\'s profiles.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'resetProfile [ USER_ID | --all ]',
  example: [ 'resetProfile', 'resetProfile 267035345537728512', 'resetProfile --all' ]
};
