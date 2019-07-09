/**
 * @file listFilteredWords command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'filteredWords' ],
    where: {
      guildID: message.guild.id
    }
  });

  if (!guildModel || !guildModel.dataValues.filteredWords) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notSet', 'filtered words'), message.channel);
  }

  let filteredWords = guildModel.dataValues.filteredWords;

  filteredWords = filteredWords.map((r, i) => `${i + 1}. ${r}`);

  let noOfPages = filteredWords.length / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: 'Filtered Words',
      description: filteredWords.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
      }
    }
  });
};

exports.config = {
  aliases: [ 'listfw' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listFilteredWords',
  description: 'Lists all filtered words.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'listFilteredWords [page_no]',
  example: [ 'listFilteredWords', 'listFilteredWords 2' ]
};
