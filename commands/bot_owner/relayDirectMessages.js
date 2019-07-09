/**
 * @file relayDirectMessages command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let settingsModel = await ThotPatrol.database.models.settings.findOne({
    attributes: [ 'relayDirectMessages' ],
    where: {
      botID: ThotPatrol.user.id
    }
  });

  await ThotPatrol.database.models.settings.update({
    relayDirectMessages: !settingsModel.dataValues.relayDirectMessages
  },
  {
    where: {
      botID: ThotPatrol.user.id
    },
    fields: [ 'relayDirectMessages' ]
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors[settingsModel.dataValues.relayDirectMessages ? 'RED' : 'GREEN'],
      description: ThotPatrol.i18n.info(message.guild.language, settingsModel.dataValues.relayDirectMessages ? 'disableDirectMessageReyals' : 'enableDirectMessageReyals', message.author.tag)
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'relayPrivateMessages', 'relayDMs', 'relayPMs' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'relayDirectMessages',
  description: 'Toggles relaying of direct messages, sent to ThotPatrol, to your inbox.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'relayDirectMessages',
  example: []
};
