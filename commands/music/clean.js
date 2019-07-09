/**
 * @file clean command
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

  message.guild.music.songs.splice(1, message.guild.music.songs.length - 1);

  await message.guild.music.textChannel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: ThotPatrol.i18n.info(message.guild.language, 'cleanQueue', message.author.tag)
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
  name: 'clean',
  description: 'Removes all the songs from the current queue of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'clean',
  example: []
};
