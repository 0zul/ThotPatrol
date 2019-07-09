/**
 * @file suggestionChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'suggestionChannel' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, suggestionChannelStats;
  if (guildModel.dataValues.suggestionChannel) {
    await ThotPatrol.database.models.guild.update({
      suggestionChannel: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'suggestionChannel' ]
    });
    color = ThotPatrol.colors.RED;
    suggestionChannelStats = ThotPatrol.i18n.info(message.guild.language, 'disableSuggestionChannel', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      suggestionChannel: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'suggestionChannel' ]
    });
    color = ThotPatrol.colors.GREEN;
    suggestionChannelStats = ThotPatrol.i18n.info(message.guild.language, 'enableSuggestionChannel', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: suggestionChannelStats
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
  name: 'suggestionChannel',
  description: 'Adds/removes the channel as the suggestion channel. If it\'s enabled, when user post a suggestion using the `suggest` command, it\'s are posted in this channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'suggestionChannel',
  example: []
};
