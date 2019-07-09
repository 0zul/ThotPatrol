/**
 * @file ignoreChannels command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let channels = message.mentions.channels.size ? message.mentions.channels : [ message.channel ];
  channels = channels.map(channel => channel.id);

  for (let channelID of channels) {
    await ThotPatrol.database.models.textChannel.upsert({
      channelID: channelID,
      guildID: message.guild.id,
      blacklisted: !args.remove
    },
    {
      where: {
        channelID: channelID,
        guildID: message.guild.id
      },
      fields: [ 'channelID', 'guildID', 'blacklisted' ]
    });
  }

  let description;
  if (args.remove) {
    description = 'I\'ll stop ignoring these channel, from now:';
  }
  else {
    description = 'I\'ll ignore these channel, from now:';
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: `${description}\n\n<#${channels.join('>, <#')}>`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ignoreChannel' ],
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'ignoreChannels',
  description: 'Adds or removes channels to/from the ignored channels\' list. ThotPatrol doesn\'t accept any commands in the channel that\'s being ignored.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'ignoreChannels [#CHANNEL_MENTION] [--remove]',
  example: [ 'ignoreChannels', 'ignoreChannels #defenders #avengers', 'ignoreChannels #legends #avengers --remove' ]
};
