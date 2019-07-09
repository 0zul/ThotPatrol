/**
 * @file levelUpRoles command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.level && args.add) {
    if (!message.member || !message.member.hasPermission('MANAGE_ROLES')) {
      return message.client.emit('userMissingPermissions', 'MANAGE_ROLES');
    }

    let role = message.guild.roles.get(args.add);
    if (!role) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
    }

    await ThotPatrol.database.models.role.upsert({
      roleID: role.id,
      guildID: message.guild.id,
      level: args.level
    },
    {
      where: {
        roleID: role.id,
        guildID: message.guild.id
      },
      fields: [ 'roleID', 'guildID', 'level' ]
    });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: ThotPatrol.i18n.info(message.guild.language, 'addLevelUpRole', message.author.tag, role.name, args.level)
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else if (args.level && args.remove) {
    if (!message.member || !message.member.hasPermission('MANAGE_ROLES')) {
      return message.client.emit('userMissingPermissions', 'MANAGE_ROLES');
    }

    await ThotPatrol.database.models.role.update({
      level: null
    },
    {
      where: {
        guildID: message.guild.id,
        level: args.level
      },
      fields: [ 'level' ]
    });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: ThotPatrol.i18n.info(message.guild.language, 'removeLevelUpRoles', message.author.tag, args.level)
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else {
    let roleModel = await ThotPatrol.database.models.role.findAll({
      attributes: [ 'roleID', 'level' ],
      where: {
        guildID: message.guild.id,
        level: {
          [ThotPatrol.database.Op.ne]: null
        }
      }
    });

    let fields = [], color, description;
    if (!roleModel || !roleModel.length) {
      color = ThotPatrol.colors.RED;
      description = 'No level up roles are set in this server.';
    }
    else {
      let levelUpRoles = {};
      for (let role of roleModel) {
        if (!levelUpRoles.hasOwnProperty(role.dataValues.level)) {
          levelUpRoles[role.dataValues.level] = [];
        }

        levelUpRoles[role.dataValues.level].push(role.dataValues.roleID);
      }

      for (let level in levelUpRoles) {
        let roles = levelUpRoles[level].filter(role => message.guild.roles.has(role)).map(role => message.guild.roles.get(role).name);

        fields.push({
          name: `Level ${level}`,
          value: roles.join(', ')
        });
      }

      color = ThotPatrol.colors.BLUE;
      description = 'Roles to be added to users when they level up in this server.';
    }

    await message.channel.send({
      embed: {
        color: color,
        description: description,
        fields: fields
      }
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'level', type: Number, defaultOption: true },
    { name: 'add', type: String, alias: 'a' },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'levelUpRoles',
  description: 'Add/Remove/Show level up roles. Level up roles are roles that are added to server members when they level up.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'levelUpRoles [ LEVEL --add ROLE_ID ] [ LEVEL --remove ]',
  example: [ 'levelUpRoles', 'levelUpRoles 10 --add 443322110055998877', 'levelUpRoles 10 --remove' ]
};
