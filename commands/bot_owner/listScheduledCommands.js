/**
 * @file listScheduledCommands command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let scheduledCommandModels = await ThotPatrol.database.models.scheduledCommand.findAll({
    attributes: [ 'cronExp', 'command', 'arguments' ]
  });

  if (scheduledCommandModels.length === 0) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'scheduledCommandsNotFound'), message.channel);
  }

  let scheduledCommands = scheduledCommandModels.map((sc, i) => `${i + 1}. \`${sc.dataValues.cronExp} ${sc.dataValues.command} ${sc.dataValues.arguments}\``);

  let noOfPages = scheduledCommands.length / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: 'List of Scheduled Commands',
      description: scheduledCommands.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
      }
    }
  });
};

exports.config = {
  aliases: [ 'listschedcmds' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'listScheduledCommands',
  description: 'Lists all the scheduled commands.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'listScheduledCommands [page_no]',
  example: [ 'listScheduledCommands', 'listScheduledCommands 2' ]
};
