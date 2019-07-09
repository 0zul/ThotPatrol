/**
 * @file filterLink command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'filterLinks' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, filterLinkStats;
  if (guildModel.dataValues.filterLinks) {
    await ThotPatrol.database.models.guild.update({
      filterLinks: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterLinks' ]
    });
    color = ThotPatrol.colors.RED;
    filterLinkStats = ThotPatrol.i18n.info(message.guild.language, 'disableLinkFilter', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      filterLinks: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterLinks' ]
    });
    color = ThotPatrol.colors.GREEN;
    filterLinkStats = ThotPatrol.i18n.info(message.guild.language, 'enableLinkFilter', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: filterLinkStats
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
  name: 'filterLink',
  description: 'Toggles automatic deletion of any links posted in the server.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterLink',
  example: []
};
