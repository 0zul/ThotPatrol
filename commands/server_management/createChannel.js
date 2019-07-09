/**
 * @file createChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.name) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let minLength = 2, maxLength = 100;
  args.name = args.name.join(' ');

  if (!args.name.length.inRange(minLength, maxLength)) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'channelNameLength', minLength, maxLength), message.channel);
  }

  args.type = args.type.toLowerCase();
  if (![ 'text', 'voice', 'news', 'store' ].includes(args.type)) {
    return ThotPatrol.emit('error', 'Unsupported Channel Type', 'The specified channel type is not supported.', message.channel);
  }

  if (args.voice) {
    args.type = 'voice';
  }

  if (args.type === 'text') {
    args.name = args.name.replace(' ', '-');
  }

  let channel = await message.guild.createChannel(args.name, {
    type: args.type,
    topic: args.topic,
    nsfw: args.nsfw
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: ThotPatrol.i18n.info(message.guild.language, 'createChannel', message.author.tag, args.type, channel.name),
      footer: {
        text: `ID: ${channel.id}`
      }
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'createc' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', multiple: true, defaultOption: true },
    { name: 'type', type: String, defaultValue: 'text' }, // TODO: add `t` alias after removing the depricated options.
    { name: 'text', type: Boolean, alias: 't' }, // @depricated
    { name: 'voice', type: Boolean, alias: 'v' }, // @depricated
    { name: 'nsfw', type: Boolean, defaultValue: false },
    { name: 'topic', type: String, multiple: true }
  ]
};

exports.help = {
  name: 'createChannel',
  description: 'Creates a new text or voice channel on your Discord server.',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'createChannel [--type text|voice|news|store] <Channel Name>',
  example: [ 'createChannel --type Text Channel-Name --topic Channel Topic --nsfw', 'createChannel --type Voice Channel Name', 'createChannel --type News Channel Name', 'createChannel --type Store Channel Name', 'createChannel Text-Channel-Name' ]
};
