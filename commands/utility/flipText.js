/**
 * @file flipText command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const flipText = xrequire('./assets/flipText.json');

exports.exec = async (ThotPatrol, message, args) => {
  if (args.length < 1) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  args = args.join(' ');
  for (let i = 0; i < Object.keys(flipText).length; i++) {
    args = args.replace(Object.keys(flipText)[i], flipText[Object.keys(flipText)[i]]);
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: 'Flipped Text:',
      description: args.split('').reverse().join('')
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'flipText',
  description: 'Sends the same message that you had sent, but flipped.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fliptext <text>',
  example: [ 'fliptext This is Upside Down!' ]
};
