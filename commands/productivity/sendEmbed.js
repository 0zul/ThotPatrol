/**
 * @file sendEmbed command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.length) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  args = JSON.parse(args.join(' '));
  args.footer = {
    text: `${ThotPatrol.credentials.ownerId.includes(message.author.id) ? '' : ThotPatrol.i18n.info(message.guild.language, 'endorsementMessage')}`
  };

  await message.channel.send({
    embed: args
  });

  if (message.deletable) await message.delete().catch(() => {});
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sendEmbed',
  description: 'Sends an embed message from the specified embed (JavaScript) object. *To create an embed object, graphically, [click here](https://embedbuilder.looney.gq).*',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'sendEmbed <embedObject>',
  example: [ 'sendEmbed {"title": "Hello", "description": "Isn\'t it cool?"}' ]
};
