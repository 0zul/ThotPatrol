/**
 * @file autoDisconnect command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  if (!message.guild.music.enabled) {
    if (ThotPatrol.user.id === '267035345537728512') {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
    }
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
  }

  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'musicAutoDisconnect' ],
    where: {
      guildID: message.guild.id
    }
  });

  let enabled, color, autoDisconnectStatus;
  if (guildModel.dataValues.musicAutoDisconnect) {
    enabled = false;
    color = ThotPatrol.colors.RED;
    autoDisconnectStatus = ThotPatrol.i18n.info(message.guild.language, 'disableMusicAutoDisconnect', message.author.tag);
  }
  else {
    enabled = true;
    color = ThotPatrol.colors.GREEN;
    autoDisconnectStatus = ThotPatrol.i18n.info(message.guild.language, 'enableMusicAutoDisconnect', message.author.tag);
  }

  await ThotPatrol.database.models.guild.update({
    musicAutoDisconnect: enabled
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'musicAutoDisconnect' ]
  });

  await message.channel.send({
    embed: {
      color: color,
      description: autoDisconnectStatus
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'autoDisconnect',
  description: 'Toggles auto disconnect from voice channel. If enabled, ThotPatrol will automatically leave the voice channel to save bandwidth when no one else is connected to it.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'autoDisconnect',
  example: []
};
