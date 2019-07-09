/**
 * @file choose command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (args.length < 1 || !/^(.+( ?\/ ?.+[^/])+)$/i.test(args = args.join(' '))) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  args = args.split('/');

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: 'In my opinion',
      description: args.getRandom()
    }
  });
};

exports.config = {
  aliases: [ 'decide' ],
  enabled: true
};

exports.help = {
  name: 'choose',
  description: 'Asks the bot to choose an option from a number of options.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'choose <choice1>/<choice2>[/<choice3>][...]',
  example: [ 'choose Chocolate/Ice Cream/Cake' ]
};
