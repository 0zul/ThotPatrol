/**
 * @file calculate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const mathjs = xrequire('mathjs');

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.length) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  try {
    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.BLUE,
        title: 'Result:',
        description: mathjs.eval(args.join(' ')).toFixed(2)
      }
    });
  }
  catch (error) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'invalidInput', 'mathematical expression'), message.channel);
  }
};

exports.config = {
  aliases: [ 'calc' ],
  enabled: true
};

exports.help = {
  name: 'calculate',
  description: 'Evaluates any mathematical expression.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'calculate <mathematical_expression>',
  example: [ 'calculate 9 * 10 - 11' ]
};
