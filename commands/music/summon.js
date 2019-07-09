/**
 * @file summon command
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

  if (message.guild.music.textChannelID && message.guild.music.textChannelID !== message.channel.id) {
    return ThotPatrol.log.info('Music channels have been set, so music commands will only work in the Music Text Channel.');
  }


  let voiceConnection = message.guild.voiceConnection, voiceChannel;

  if (voiceConnection) {
    if (voiceConnection.speaking) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'isSpeaking'), message.channel);
    }
    voiceChannel = voiceConnection.channel;
  }
  else {
    if (ThotPatrol.credentials.ownerId.includes(message.author.id) || message.member.roles.has(message.guild.music.masterRoleID)) {
      voiceChannel = message.member.voiceChannel;
    }
    else if (message.guild.music.voiceChannelID) {
      voiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(message.guild.music.voiceChannelID);
      if (!voiceChannel) {
        return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'invalidMusicChannel'), message.channel);
      }
    }
    else {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'musicChannelNotFound'), message.channel);
    }

    if (!voiceChannel) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'userNoVC', message.author.tag), message.channel);
    }
    if (!voiceChannel.joinable) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'noPermission', 'join', voiceChannel.name), message.channel);
    }

    voiceConnection = await voiceChannel.join();
  }


  if (!voiceChannel.speakable) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'noPermission', 'speak', `in ${voiceChannel.name}`), message.channel);
  }


  await message.guild.me.setMute(false).catch(() => {});
  await message.guild.me.setDeaf(true).catch(() => {});


  if (!voiceConnection.speaking) {
    voiceConnection.playFile('./assets/greeting.mp3', {
      passes: (ThotPatrol.configurations.music && ThotPatrol.configurations.music.passes) || 1,
      bitrate: 'auto'
    });
  }


  voiceConnection.on('error', ThotPatrol.log.error);
  voiceConnection.on('failed', ThotPatrol.log.error);
};

exports.config = {
  aliases: [ 'join' ],
  enabled: true
};

exports.help = {
  name: 'summon',
  description: 'Asks ThotPatrol to join a voice channel in you Discord server. It joins the default voice channel (if one is set by the Bot Owner) or any channel you are in (if you are the Bot Owner or you are in the Music Master role).',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'summon',
  example: []
};
