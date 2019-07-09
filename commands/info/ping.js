/**
 * @file ping command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let responseMessage = await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      description: 'PINGing...'
    }
  });
  await responseMessage.edit({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: `${ThotPatrol.user.username} PING Statistics`,
      fields: [
        {
          name: 'Response Time',
          value: `${responseMessage.createdTimestamp - message.createdTimestamp}ms`,
          inline: true
        },
        {
          name: 'WebSocket PING',
          value: `${ThotPatrol.ping}ms`,
          inline: true
        }
      ]
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'ping',
  description: 'Shows the response time and average WebSocket ping of %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'ping',
  example: []
};
