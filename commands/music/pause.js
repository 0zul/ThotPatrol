/**
 * @file pause command
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

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notPlaying'), message.channel);
  }

  if (!message.guild.voiceConnection.speaking) return;

  await message.guild.music.dispatcher.pause();

  await message.guild.music.textChannel.send({
    embed: {
      color: ThotPatrol.colors.ORANGE,
      title: 'Paused Playback',
      url: message.guild.music.songs[0].id ? `https://youtu.be/${message.guild.music.songs[0].id}` : '',
      description: message.guild.music.songs[0].title,
      footer: {
        text: `🔉 ${message.guild.music.dispatcher.volume * 50}% • ${Math.floor(message.guild.music.dispatcher.time / 60000)}:${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000) < 10 ? `0${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)}` : Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)} / ${message.guild.music.songs[0].duration}`
      }
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
  name: 'pause',
  description: 'Pauses the current playback in your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pause',
  example: []
};
