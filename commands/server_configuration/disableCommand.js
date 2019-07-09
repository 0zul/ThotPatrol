/**
 * @file disableCommand command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let disabledCommands, title, description;
  if (args.name) {
    let command = args.name.toLowerCase();

    if (ThotPatrol.commands.has(command) || ThotPatrol.aliases.has(command)) {
      if (ThotPatrol.commands.has(command)) {
        command = ThotPatrol.commands.get(command);
      }
      else if (ThotPatrol.aliases.has(command)) {
        command = ThotPatrol.commands.get(ThotPatrol.aliases.get(command).toLowerCase());
      }
    }
    else {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notFound', 'command'), message.channel);
    }

    if ([ 'enablecommand', 'disablecommand' ].includes(command.help.name.toLowerCase()) || command.config.ownerOnly) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'commandNoDisable', command.help.name), message.channel);
    }

    let guildModel = await ThotPatrol.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (guildModel.dataValues.disabledCommands) {
      guildModel.dataValues.disabledCommands.push(command.help.name.toLowerCase());
    }
    else {
      guildModel.dataValues.disabledCommands = [ command.help.name.toLowerCase() ];
    }

    guildModel.dataValues.disabledCommands = [ ...new Set(guildModel.dataValues.disabledCommands) ];

    disabledCommands = guildModel.dataValues.disabledCommands;
    description = ThotPatrol.i18n.info(message.guild.language, 'disableCommand', message.author.tag, command.help.name);

    await ThotPatrol.database.models.guild.update({
      disabledCommands: disabledCommands
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
  }
  else if (args.module) {
    args.module = args.module.join('_').toLowerCase();
    if ([ 'bot_owner' ].includes(args.module)) {
      return ThotPatrol.emit('error', '', 'You can\'t disable commands in this module.', message.channel);
    }

    disabledCommands = ThotPatrol.commands.filter(c => c.config.module === args.module && ![ 'enablecommand', 'disablecommand' ].includes(c.help.name.toLowerCase())).map(c => c.help.name.toLowerCase());

    let guildModel = await ThotPatrol.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (guildModel.dataValues.disabledCommands) {
      disabledCommands = disabledCommands.concat(guildModel.dataValues.disabledCommands);
    }

    description = ThotPatrol.i18n.info(message.guild.language, 'disableModule', message.author.tag, args.module);

    await ThotPatrol.database.models.guild.update({
      disabledCommands: disabledCommands
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
  }
  else if (args.all) {
    disabledCommands = ThotPatrol.commands.filter(c => ![ 'enablecommand', 'disablecommand' ].includes(c.help.name.toLowerCase()) && !c.config.ownerOnly).map(c => c.help.name.toLowerCase());
    description = ThotPatrol.i18n.info(message.guild.language, 'disableAllCommands', message.author.tag);

    await ThotPatrol.database.models.guild.update({
      disabledCommands: disabledCommands
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
  }
  else {
    let guildModel = await ThotPatrol.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });
    title = 'Commands disabled in this server:';
    description = guildModel.dataValues.disabledCommands ? guildModel.dataValues.disabledCommands.join(', ') : 'No command has been disabled in this server. Check `help disableCommand` for more info.';
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.RED,
      title: title,
      description: description
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'disablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'module', type: String, multiple: true, alias: 'm' },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'disableCommand',
  description: 'Disable command/module in your server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'disableCommand [ COMMAND_NAME | --module MODULE NAME | --all ]',
  example: [ 'disableCommand echo', 'disableCommand --module game stats', 'disableCommand --all' ]
};
