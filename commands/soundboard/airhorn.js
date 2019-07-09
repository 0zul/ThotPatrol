/**
 * @file airhorn command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  if (message.guild.voiceConnection) {
    if (!message.guild.voiceConnection.channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
      return ThotPatrol.emit('userMissingPermissions', this.help.userTextPermission);
    }

    if (message.guild.voiceConnection.speaking) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'isSpeaking'), message.channel);
    }

    if (!message.guild.voiceConnection.channel.speakable) {
      return ThotPatrol.emit('ThotPatrolMissingPermissions', 'SPEAK', message);
    }

    message.guild.voiceConnection.playFile('./assets/airhorn.wav', {
      passes: (ThotPatrol.configurations.music && ThotPatrol.configurations.music.passes) || 1,
      bitrate: 'auto'
    });
  }
  else if (message.member.voiceChannel) {
    if (!message.member.voiceChannel.permissionsFor(message.member).has(this.help.userTextPermission)) {
      return ThotPatrol.emit('userMissingPermissions', this.help.userTextPermission);
    }

    if (!message.member.voiceChannel.joinable) {
      return ThotPatrol.emit('ThotPatrolMissingPermissions', 'CONNECT', message);
    }

    if (!message.member.voiceChannel.speakable) {
      return ThotPatrol.emit('ThotPatrolMissingPermissions', 'SPEAK', message);
    }

    let connection = await message.member.voiceChannel.join();

    connection.on('error', ThotPatrol.log.error);
    connection.on('failed', ThotPatrol.log.error);

    const dispatcher = connection.playFile('./assets/airhorn.wav', {
      passes: (ThotPatrol.configurations.music && ThotPatrol.configurations.music.passes) || 1,
      bitrate: 'auto'
    });

    dispatcher.on('error', error => {
      ThotPatrol.log.error(error);
    });

    dispatcher.on('end', () => {
      connection.channel.leave();
    });
  }
  else {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'eitherOneInVC'), message.channel);
  }
};

exports.config = {
  aliases: [ 'horn' ],
  enabled: true
};

exports.help = {
  name: 'airhorn',
  description: 'Plays an airhorn in a voice channel.',
  botPermission: '',
  userTextPermission: 'MUTE_MEMBERS',
  userVoicePermission: '',
  usage: 'airhorn',
  example: []
};
