/**
 * @file profile command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const specialIDs = xrequire('./assets/specialIDs.json');

exports.exec = async (ThotPatrol, message, args) => {
  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }
  else if (args.id) {
    user = await ThotPatrol.utils.fetchMember(message.guild, args.id);
    if (user) {
      user = user.user;
    }
  }
  if (!user) {
    user = message.author;
  }

  let guildMemberModel = await ThotPatrol.database.models.guildMember.findOne({
    attributes: [ 'userID', 'guildID', 'ThotPatrolCurrencies', 'experiencePoints', 'level', 'karma' ].concat([
      [ ThotPatrol.database.literal(`(SELECT COUNT(*) FROM guildMembers AS member WHERE member.guildID = ${message.guild.id} AND member.experiencePoints * 1 > guildMember.experiencePoints * 1)`), 'rank' ]
    ]),
    where: {
      userID: user.id,
      guildID: message.guild.id
    }
  });

  let userModel = await ThotPatrol.database.models.user.findOne({
    attributes: [ 'avatar', 'info', 'birthDate', 'color', 'location' ],
    where: {
      userID: user.id
    }
  });

  if (!guildMemberModel) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'profileNotCreated', `<@${user.id}>`), message.channel);
  }

  let info;
  if (userModel && userModel.dataValues.info) {
    info = await ThotPatrol.utils.decompressString(userModel.dataValues.info);
  }
  else {
    info = `No info has been set. ${user.id === message.author.id ? 'Set your info using `setInfo` command.' : ''}`;
  }

  let rank = parseInt(guildMemberModel.dataValues.rank) + 1;

  let requiredExp = {
    currentLevel: ThotPatrol.methods.getRequiredExpForLevel(parseInt(guildMemberModel.dataValues.level, 10)),
    nextLevel: ThotPatrol.methods.getRequiredExpForLevel(parseInt(guildMemberModel.dataValues.level, 10) + 1)
  };

  let totalRequiredExp = {
    currentLevel: guildMemberModel.dataValues.experiencePoints - requiredExp.currentLevel,
    nextLevel: requiredExp.nextLevel - requiredExp.currentLevel
  };

  let progress = totalRequiredExp.currentLevel / totalRequiredExp.nextLevel * 100;

  let profileData = [
    {
      name: 'ThotPatrol Currency',
      value: guildMemberModel.dataValues.ThotPatrolCurrencies,
      inline: true
    },
    {
      name: 'Rank',
      value: rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank,
      inline: true
    },
    {
      name: 'Experience Points',
      value: guildMemberModel.dataValues.experiencePoints,
      inline: true
    },
    {
      name: 'Level',
      value: guildMemberModel.dataValues.level,
      inline: true
    },
    {
      name: `Progress - ${totalRequiredExp.currentLevel} / ${totalRequiredExp.nextLevel} - ${Math.round(progress)}%`,
      value: ThotPatrol.methods.generateProgressBar(progress, 35)
    }
  ];

  if (userModel && userModel.dataValues.birthDate) {
    profileData.push({
      name: 'Birthday',
      value: new Date(userModel.dataValues.birthDate).toDateString().split(' ').splice(1, 2).join(' '),
      inline: true
    });
  }
  if (userModel && userModel.dataValues.location) {
    profileData.push({
      name: 'Location',
      value: userModel.dataValues.location,
      inline: true
    });
  }

  await message.channel.send({
    embed: {
      color: userModel.dataValues.color ? userModel.dataValues.color : ThotPatrol.colors.BLUE,
      author: {
        name: user.tag,
        icon_url: await getUserIcon(user)
      },
      description: info,
      fields: profileData,
      thumbnail: {
        url: userModel && userModel.dataValues.avatar ? userModel.dataValues.avatar : user.displayAvatarURL
      },
      footer: {
        text: `${guildMemberModel.dataValues.karma} Karma`
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'profile',
  description: 'Shows ThotPatrol user profile of a specified user of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'profile [@USER_MENTION | USER_ID]',
  example: [ 'profle', 'profile @ThotPatrol#0001', 'profile 167433345337713651' ]
};

/**
 * Returns the provided user's staff icon
 * @function getUserIcon
 * @param {User} user The user for which we need to get the icon
 * @returns {String} The url of the user's staff icon
 */
async function getUserIcon(user) {
  try {
    const ThotPatrolGuildID = specialIDs.ThotPatrolGuild;
    const ThotPatrolGuild = user.client.guilds.get(ThotPatrolGuildID);
    if (!ThotPatrolGuild) return;
    const ThotPatrolGuildMember = await user.client.utils.fetchMember(ThotPatrolGuild, user.id);
    if (!ThotPatrolGuildMember) return;

    const devRoleID = specialIDs.developerRole;
    const contributorsRoleID = specialIDs.contributorsRole;
    const donorsRoleID = specialIDs.donorsRole;
    const modsRoleID = specialIDs.modsRole;
    const patronsRoleID = specialIDs.patronsRole;
    const supportRoleID = specialIDs.supportRole;
    const testersRoleID = specialIDs.testersRole;
    const translatorsRoleID = specialIDs.translatorsRole;

    const devIcon = 'https://i.imgur.com/ThSx8bZ.png';
    const modsIcon = 'https://i.imgur.com/vntgkTs.png';
    const contributorsIcon = 'https://i.imgur.com/kH49M8d.png';
    const donorsIcon = 'https://i.imgur.com/0Jfh057.png';
    const patronsIcon = 'https://i.imgur.com/VZePUfw.png';
    const supportIcon = 'http://i.imgur.com/HM9UD6w.png';
    const testersIcon = 'https://i.imgur.com/fVIW1Uy.png';
    const translatorsIcon = 'https://i.imgur.com/COwpvnK.png';
    // const partners = 'https://cdn.discordapp.com/emojis/314068430556758017.png';
    // const hype = 'https://cdn.discordapp.com/emojis/314068430854684672.png';
    // const nitro = 'https://cdn.discordapp.com/emojis/314068430611415041.png';

    if (ThotPatrolGuildMember.roles.has(devRoleID)) {
      return devIcon;
    }
    if (ThotPatrolGuildMember.roles.has(modsRoleID)) {
      return modsIcon;
    }
    else if (ThotPatrolGuildMember.roles.has(contributorsRoleID)) {
      return contributorsIcon;
    }
    else if (ThotPatrolGuildMember.roles.has(supportRoleID)) {
      return supportIcon;
    }
    else if (ThotPatrolGuildMember.roles.has(patronsRoleID)) {
      return patronsIcon;
    }
    else if (ThotPatrolGuildMember.roles.has(donorsRoleID)) {
      return donorsIcon;
    }
    else if (ThotPatrolGuildMember.roles.has(testersRoleID)) {
      return testersIcon;
    }
    else if (ThotPatrolGuildMember.roles.has(translatorsRoleID)) {
      return translatorsIcon;
    }
  }
  catch (e) {
    process.stderr.write(`${e}\n`);
  }
}
