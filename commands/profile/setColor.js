/**
 * @file setColor command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (ThotPatrol.methods.isPublicThotPatrol(ThotPatrol)) {
    return ThotPatrol.emit('error', '', 'This command is temporarily disabled in the public ThotPatrol. For details, please contact [ThotPatrol Support](https://discord.gg/fzx8fkt).', message.channel);
  }

  if (!args.color || !/^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(args.color)) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }


  args.color = args.color.replace('#', '');
  args.color = args.color.length === 3 ? args.color.replace(/(.)/g, '$1$1') : args.color;
  let color = parseInt(args.color, 16);

  await ThotPatrol.database.models.user.update({
    color: color
  },
  {
    where: {
      userID: message.author.id
    },
    fields: [ 'color' ]
  });


  message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: `${message.author}, your User Color has been set to **#${args.color}** and will be used in appropriate places.`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'color', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'setColor',
  description: 'Sets your user color that is used in the ThotPatrol user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setColor < #HEX_COLOR_CODE >',
  example: [ 'setColor #000000' ]
};