/**
 * @file apod command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let response = await ThotPatrol.methods.makeBWAPIRequest('/nasa/apod');

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      author: {
        name: 'Astronomy Picture of the Day',
        url: 'http://apod.nasa.gov/'
      },
      title: response.title,
      description: response.explanation,
      image: {
        url: response.hdurl || response.url
      },
      footer: {
        text: `Powered by NASA • Image Credit & Copyright - ${response.copyright}`
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'apod',
  description: 'Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'apod',
  example: []
};
