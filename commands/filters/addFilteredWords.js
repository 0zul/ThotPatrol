/**
 * @file addFilteredWords command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.length) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'filteredWords' ],
    where: {
      guildID: message.guild.id
    }
  });

  let filteredWords = [];
  if (guildModel.dataValues.filteredWords) {
    filteredWords = guildModel.dataValues.filteredWords;
  }
  filteredWords = filteredWords.concat(args);
  filteredWords = [ ...new Set(filteredWords) ];

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
      color: ThotPatrol.colors.GREEN,
      title: 'Added Words to Filter List',
      description: args.join(', ')
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'addfw' ],
  enabled: true
};

exports.help = {
  name: 'addFilteredWords',
  description: 'Adds specified words to the list of filtered words. If someone sends a message containing these words, their message will be automatically deleted.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addFilteredWords word [anotherWord] [someOtherWord]',
  example: [ 'addFilteredWords cast creed race religion' ]
};
