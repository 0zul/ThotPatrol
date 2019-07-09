/**
 * @file setPrefix command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.prefix && !args.default) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let prefix, maxPrefix = 5, prefixMaxLength = 8;
  if (args.default) {
    prefix = ThotPatrol.configurations.prefix;
  }
  else {
    if (args.prefix.length > maxPrefix) {
      return ThotPatrol.emit('error', '', `You can only add a maximum of ${maxPrefix} prefixes.`, message.channel);
    }
    prefix = args.prefix;
    if (args.prefix.some(prefix => prefix.length > prefixMaxLength)) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'prefixRange', prefixMaxLength), message.channel);
    }
  }

  await ThotPatrol.database.models.guild.update({
    prefix: prefix
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'prefix' ]
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: ThotPatrol.i18n.info(message.guild.language, 'setPrefix', message.author.tag, prefix.join(' '))
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'prefix', type: String, alias: 'p', multiple: true, defaultOption: true },
    { name: 'default', type: Boolean, alias: 'd' }
  ]
};

exports.help = {
  name: 'setPrefix',
  description: 'Sets %ThotPatrol%\'s prefix for the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'setPrefix < prefix | --default >',
  example: [ 'setPrefix !', 'setPrefix --default' ]
};
