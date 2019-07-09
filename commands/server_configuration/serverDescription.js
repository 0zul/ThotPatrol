/**
 * @file serverDescription command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let charLimit = 256;
  let serverDescription = args.length ? args.join(' ') : null;
  let messageDescription = serverDescription;
  let messageColor = ThotPatrol.colors.RED;
  let messageTitle = 'Server Description Removed';

  if (serverDescription) {
    if (serverDescription.length > charLimit) {
      return ThotPatrol.emit('error', '', 'Server description is limited to 256 characters.', message.channel);
    }

    serverDescription = await ThotPatrol.utils.compressString(serverDescription);
    messageColor = ThotPatrol.colors.GREEN;
    messageTitle = 'Server Description Set';
  }

  await ThotPatrol.database.models.guild.update({
    description: serverDescription
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'description' ]
  });

  message.channel.send({
    embed: {
      color: messageColor,
      title: messageTitle,
      description: messageDescription,
      footer: {
        text: message.guild.name
      }
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'guildDescription' ],
  enabled: true
};

exports.help = {
  name: 'serverDescription',
  description: 'Set a description for the server, which will be shown in the `serverInfo` command.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'serverDescription <text>',
  example: [ 'serverDescription The official Discord server of the ThotPatrol Bot. :ThotPatrol:' ]
};
