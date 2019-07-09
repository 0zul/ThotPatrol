/**
 * @file sellRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.role || !(args.price || args.remove)) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  args.role = args.role.join(' ');

  let role;
  if (message.guild.roles.has(args.role)) {
    role = message.guild.roles.get(args.role);
  }
  else {
    role = message.guild.roles.find(role => role.name === args.role);
  }
  if (!role) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  if (args.remove) {
    await ThotPatrol.database.models.role.update({
      price: null
    },
    {
      where: {
        roleID: role.id,
        guildID: message.guild.id
      },
      fields: [ 'price' ]
    });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: `Unlisted **${role}** role from the Role Store.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else {
    await ThotPatrol.database.models.role.upsert({
      roleID: role.id,
      guildID: message.guild.id,
      price: Math.abs(args.price)
    },
    {
      where: {
        roleID: role.id,
        guildID: message.guild.id
      },
      fields: [ 'roleID', 'guildID', 'price' ]
    });

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `Listed **${role.name}** role for sale in the Role Store for **${args.price}** ThotPatrol Currencies.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, multiple: true, defaultOption: true },
    { name: 'price', type: Number, alias: 'p' },
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'sellRole',
  description: 'Sell roles in your server so that server members can buy them with %currency.name_plural%, using the `buyRole` command. When users buy roles, the server owner gets 90% of the profit.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'sellRole < ROLE_ID | ROLE NAME > < -p PRICE | --remove >',
  example: [ 'sellRole 277132449585713251 -p 100', 'sellRole 277132449585713251 --remove' ]
};
