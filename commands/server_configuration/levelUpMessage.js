/**
 * @file levelUpMessage command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'levelUpMessages' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, levelUpMessageStats;
  if (guildModel.dataValues.levelUpMessages) {
    await ThotPatrol.database.models.guild.update({
      levelUpMessages: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'levelUpMessages' ]
    });
    color = ThotPatrol.colors.RED;
    levelUpMessageStats = ThotPatrol.i18n.info(message.guild.language, 'disableLevelUpMessages', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      levelUpMessages: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'levelUpMessages' ]
    });
    color = ThotPatrol.colors.GREEN;
    levelUpMessageStats = ThotPatrol.i18n.info(message.guild.language, 'enableLevelUpMessages', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: levelUpMessageStats
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'lvlupmsg' ],
  enabled: true
};

exports.help = {
  name: 'levelUpMessage',
  description: 'Toggles sending messages when someone levels up in the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'levelUpMessage',
  example: []
};
