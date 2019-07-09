/**
 * @file log command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'serverLog' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, logStats;
  if (guildModel.dataValues.serverLog) {
    await ThotPatrol.database.models.guild.update({
      serverLog: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'serverLog' ]
    });
    color = ThotPatrol.colors.RED;
    logStats = ThotPatrol.i18n.info(message.guild.language, 'disableServerLog', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      serverLog: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'serverLog' ]
    });
    color = ThotPatrol.colors.GREEN;
    logStats = ThotPatrol.i18n.info(message.guild.language, 'enableServerLog', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: logStats
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
  name: 'log',
  description: 'Toggles logging of various events in the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'log',
  example: []
};
