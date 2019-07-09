/**
 * @file modLog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

// This feature is absolutely useless because Discord already has audit logs. I'll probably remove this in future.

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'moderationLog' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, modLogStats;
  if (guildModel.dataValues.moderationLog) {
    await ThotPatrol.database.models.guild.update({
      moderationLog: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'moderationLog' ]
    });
    color = ThotPatrol.colors.RED;
    modLogStats = ThotPatrol.i18n.info(message.guild.language, 'disableModerationLog', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      moderationLog: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'moderationLog' ]
    });
    color = ThotPatrol.colors.GREEN;
    modLogStats = ThotPatrol.i18n.info(message.guild.language, 'enableModerationLog', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: modLogStats
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
  name: 'modLog',
  description: 'Toggles logging of various moderation events in the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'modLog',
  example: []
};
