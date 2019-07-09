/**
 * @file filterWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'filterWords' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, filterWordStats;
  if (guildModel.dataValues.filterWords) {
    await ThotPatrol.database.models.guild.update({
      filterWords: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterWords' ]
    });
    color = ThotPatrol.colors.RED;
    filterWordStats = ThotPatrol.i18n.info(message.guild.language, 'disableWordFilter', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      filterWords: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterWords' ]
    });
    color = ThotPatrol.colors.GREEN;
    filterWordStats = ThotPatrol.i18n.info(message.guild.language, 'enableWordFilter', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: filterWordStats
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
  name: 'filterWord',
  description: 'Toggles automatic deletion of messages that contains any word that is being filtered.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterWord',
  example: []
};
