/**
 * @file removeFilteredWord command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let index = parseInt(args[0]);
  if (!index || index <= 0) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }
  index -= 1;

  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'filteredWords' ],
    where: {
      guildID: message.guild.id
    }
  });

  if (!guildModel || !guildModel.dataValues.filteredWords) {
    ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notSet', 'filtered words'), message.channel);
  }
  else {
    let filteredWords = guildModel.dataValues.filteredWords;

    if (index >= filteredWords.length) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'indexRange'), message.channel);
    }

    let removedFilteredWord = filteredWords[parseInt(args[0]) - 1];
    filteredWords.splice(parseInt(args[0]) - 1, 1);

    await ThotPatrol.database.models.guild.update({
      filteredWords: filteredWords
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filteredWords' ]
    });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: `I've deleted **${removedFilteredWord}** from filtered words.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'removefw' ],
  enabled: true
};

exports.help = {
  name: 'removeFilteredWord',
  description: 'Deletes a word from the list of filtered words.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'removeFilteredWord <index>',
  example: [ 'removeFilteredWord 3' ]
};
