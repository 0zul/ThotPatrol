/**
 * @file disconnect command
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

  message.guild.music.songs = [];

  if (message.guild.music.dispatcher) {
    message.guild.music.dispatcher.end();
  }

  if (message.guild.voiceConnection) {
    message.guild.voiceConnection.disconnect();
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.RED,
      description: 'Disconnected from the voice connection of this server.'
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  musicMasterOnly: true
};

exports.help = {
  name: 'disconnect',
  description: 'Disconnect ThotPatrol from any voice connection in the Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'disconnect',
  example: []
};
