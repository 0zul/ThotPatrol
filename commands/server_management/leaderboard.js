/**
 * @file leaderboard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildMemberModels = await ThotPatrol.database.models.guildMember.findAll({
    attributes: [ 'userID', 'ThotPatrolCurrencies', 'experiencePoints', 'level' ],
    where: {
      guildID: message.guild.id
    },
    order: [
      [ ThotPatrol.database.fn('ABS', ThotPatrol.database.col('level')), 'DESC' ],
      [ ThotPatrol.database.fn('ABS', ThotPatrol.database.col('experiencePoints')), 'DESC' ],
      [ ThotPatrol.database.fn('ABS', ThotPatrol.database.col('ThotPatrolCurrencies')), 'DESC' ]
    ],
    limit: 10
  });

  let profiles = guildMemberModels.map(guildMember => guildMember.dataValues);

  let fields = [];

  for (let i = 0; i < profiles.length; i++) {
    let user;
    if (message.guild.members.has(profiles[i].userID)) {
      let member = await message.guild.members.get(profiles[i].userID);
      user = member.displayName === member.user.username ? `${member.displayName} / ${member.id}` : `${member.displayName} / ${member.user.tag} / ${member.id}`;
    }
    else {
      user = profiles[i].userID;
    }
    fields.push({
      name: `${i + 1}. ${user}`,
      value: `Level ${profiles[i].level} • ${profiles[i].experiencePoints} Experience Points`
    });
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: 'Leaderboard',
      description: 'These are the users topping the chart!',
      fields: fields
    }
  });
};

exports.config = {
  aliases: [ 'lb', 'hallOfFame', 'hof' ],
  enabled: true
};

exports.help = {
  name: 'leaderboard',
  description: 'Shows the users topping the chart of %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leaderboard [PAGE_NO]',
  example: [ 'leaderboard', 'leaderboard 3' ]
};
