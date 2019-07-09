/**
 * @file musicChannel command
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

  let musicTextChannel, musicVoiceChannel, color, description;

  if (args.remove) {
    await message.client.database.models.guild.update({
      musicTextChannel: null,
      musicVoiceChannel: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'musicTextChannel', 'musicVoiceChannel' ]
    });
    color = ThotPatrol.colors.RED;
    description = ThotPatrol.i18n.info(message.guild.language, 'removeMusicChannels', message.author.tag);
  }
  else if (args.id) {
    musicTextChannel = message.channel;
    musicVoiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(args.id);
    if (musicVoiceChannel) {
      await message.client.database.models.guild.update({
        musicTextChannel: musicTextChannel.id,
        musicVoiceChannel: musicVoiceChannel.id
      },
      {
        where: {
          guildID: message.guild.id
        },
        fields: [ 'musicTextChannel', 'musicVoiceChannel' ]
      });
      color = ThotPatrol.colors.GREEN;
      description = ThotPatrol.i18n.info(message.guild.language, 'addMusicChannels', message.author.tag, musicTextChannel, musicVoiceChannel.name);
    }
    else {
      color = ThotPatrol.colors.RED;
      description = 'Invalid voice channel ID for music channel.';
    }
  }
  else {
    if (message.guild.music.textChannelID) {
      musicTextChannel = message.guild.channels.filter(c => c.type === 'text').get(message.guild.music.textChannelID);
    }
    if (message.guild.music.voiceChannelID) {
      musicVoiceChannel = message.guild.channels.filter(c => c.type === 'voice').get(message.guild.music.voiceChannelID);
    }

    if (!musicTextChannel || !musicVoiceChannel) {
      color = ThotPatrol.colors.RED;
      description = 'Music channels have not been set.';
    }
    else {
      color = ThotPatrol.colors.BLUE;
      description = ThotPatrol.i18n.info(message.guild.language, 'musicChannels', musicTextChannel, musicVoiceChannel.name);
    }
  }

  await message.channel.send({
    embed: {
      color: color,
      title: 'Music Channel',
      description: description
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'remove', alias: 'r', type: Boolean }
  ]
};

exports.help = {
  name: 'musicChannel',
  description: 'Shows/Removes/Adds a voice channel specified by the ID and a text channel (the channel this command was used in) of you Discord server as default for the music module. ThotPatrol will only accept music commands in that text channel and if anyone asks him to join a voice channel, it will automatically join the specified voice channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'musicChannel [VOICE_CHANNEL_ID] [--remove]',
  example: [ 'musicChannel 308278968078041098', 'musicChannel', 'musicChannel --remove' ]
};
