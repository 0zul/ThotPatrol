/**
 * @file filterInvite command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'filterInvites' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, filterInviteStats;
  if (guildModel.dataValues.filterInvites) {
    await ThotPatrol.database.models.guild.update({
      filterInvites: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterInvites' ]
    });
    color = ThotPatrol.colors.RED;
    filterInviteStats = ThotPatrol.i18n.info(message.guild.language, 'disableInviteFilter', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      filterInvites: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterInvites' ]
    });
    color = ThotPatrol.colors.GREEN;
    filterInviteStats = ThotPatrol.i18n.info(message.guild.language, 'enableInviteFilter', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: filterInviteStats
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'filterinv' ],
  enabled: true
};

exports.help = {
  name: 'filterInvite',
  description: 'Toggles automatic deleting of Discord server invites posted in the server.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterInvite',
  example: []
};
