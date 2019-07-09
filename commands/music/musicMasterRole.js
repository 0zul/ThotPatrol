/**
 * @file musicMasterRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!message.guild.music.enabled) {
    if (ThotPatrol.user.id === '267035345537728512') {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
    }
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
  }

  let role;
  if (args.id || message.mentions.roles.size) {
    args.id = args.id.join(' ');

    role = message.mentions.roles.first() || await ThotPatrol.utils.resolver.resolveRole(message.guild, args.id);

    if (!role) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
    }
  }
  else {
    role = null;
  }

  await message.client.database.models.guild.update({
    musicMasterRole: role ? role.id : null
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'musicMasterRole' ]
  });

  return message.channel.send({
    embed: {
      color: role ? ThotPatrol.colors.GREEN : ThotPatrol.colors.RED,
      description: role ? ThotPatrol.i18n.info(message.guild.language, 'addMusicMasterRole', message.author.tag, role.name) : ThotPatrol.i18n.info(message.guild.language, 'removeMusicMasterRole', message.author.tag)
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'musicmaster' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'musicMasterRole',
  description: 'Adds a role specified by its ID as the Music Master role of %ThotPatrol%, in your Discord server. Users with this role get access to restricted music commands like `summon`, `play`, etc. and can summon and play music in any voice channel of your Discord server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'musicMasterRole [ROLE_ID]',
  example: [ 'musicMasterRole 319225727067095043', 'musicMasterRole' ]
};
