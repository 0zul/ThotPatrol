/**
 * @file streamerRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let description = `No role in your server has been set as the streamer role. To set a role as the streamer role, run the command \`${this.help.name} [ROLE_ID]\`.`, color = ThotPatrol.colors.RED;

  if (args.role) {
    if (parseInt(args.message) >= 9223372036854775807) {
      return ThotPatrol.emit('commandUsage', message, this.help);
    }

    let role = message.guild.roles.get(args.role);
    if (!role) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
    }

    await ThotPatrol.database.models.guild.update({
      streamerRole: role.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'streamerRole' ]
    });
    description = ThotPatrol.i18n.info(message.guild.language, 'enableStreamerRole', message.author.tag, role.name);
    color = ThotPatrol.colors.GREEN;
  }
  else if (args.remove) {
    await ThotPatrol.database.models.guild.update({
      streamerRole: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'streamerRole' ]
    });
    description = ThotPatrol.i18n.info(message.guild.language, 'disableStreamerRole', message.author.tag);
    color = ThotPatrol.colors.RED;
  }
  else {
    let guildModel = await ThotPatrol.database.models.guild.findOne({
      attributes: [ 'streamerRole' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (guildModel.dataValues.streamerRole) {
      let streamerRole = message.guild.roles.get(guildModel.dataValues.streamerRole);
      if (streamerRole) {
        description = ThotPatrol.i18n.info(message.guild.language, 'streamerRole', streamerRole.name);
        color = ThotPatrol.colors.BLUE;
      }
    }
  }

  await message.channel.send({
    embed: {
      color: color,
      description: description
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'streamerRole',
  description: 'Adds a role as the streamer role. When a guild member (who is at least in a single role) starts streaming, they are given the streamer role.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'streamerRole [ROLE_ID] [--remove]',
  example: [ 'streamerRole', 'streamerRole 265419266104885248', 'streamerRole --remove' ]
};
