/**
 * @file enableCommand command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let disabledCommands, description;
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

    if (![ 'enablecommand', 'disablecommand' ].includes(command.help.name.toLowerCase()) && !command.config.ownerOnly) {
      let guildModel = await ThotPatrol.database.models.guild.findOne({
        attributes: [ 'disabledCommands' ],
        where: {
          guildID: message.guild.id
        }
      });
      if (guildModel.dataValues.disabledCommands) {
        if (guildModel.dataValues.disabledCommands.includes(command.help.name.toLowerCase())) {
          guildModel.dataValues.disabledCommands.splice(guildModel.dataValues.disabledCommands.indexOf(command.help.name.toLowerCase()), 1);

          await ThotPatrol.database.models.guild.update({
            disabledCommands: guildModel.dataValues.disabledCommands
          },
          {
            where: {
              guildID: message.guild.id
            },
            fields: [ 'disabledCommands' ]
          });
        }
      }
    }

    description = ThotPatrol.i18n.info(message.guild.language, 'enableCommand', message.author.tag, command.help.name);
  }
  else if (args.module) {
    args.module = args.module.join('_').toLowerCase();

    disabledCommands = ThotPatrol.commands.filter(c => c.config.module === args.module).map(c => c.help.name.toLowerCase());

    let guildModel = await ThotPatrol.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (guildModel.dataValues.disabledCommands) {
      disabledCommands = guildModel.dataValues.disabledCommands.filter(command => !disabledCommands.includes(command));
    }

    description = ThotPatrol.i18n.info(message.guild.language, 'enableModule', message.author.tag, args.module);

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
    await ThotPatrol.database.models.guild.update({
      disabledCommands: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
    description = ThotPatrol.i18n.info(message.guild.language, 'enableAllCommands', message.author.tag);
  }
  else {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: description
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'enablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'module', type: String, multiple: true, alias: 'm' },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'enableCommand',
  description: 'Enable disabled command/module in your server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'enableCommand < COMMAND_NAME | --module MODULE NAME | --all >',
  example: [ 'enableCommand echo', 'enableCommand --module game stats', 'enableCommand --all' ]
};
