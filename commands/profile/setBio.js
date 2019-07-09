/**
 * @file setInfo command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.length) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }
  args = args.join(' ');

  let charLimit = 160;
  let info = await ThotPatrol.utils.compressString(args);

  if (info.length > charLimit) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'infoRange', charLimit), message.channel);
  }

  let userModel = await ThotPatrol.database.models.user.findOne({
    attributes: [ 'info' ],
    where: {
      userID: message.author.id
    }
  });

  if (!userModel) {
    return message.channel.send({
      embed: {
        description: `<@${args.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your info.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }

  await ThotPatrol.database.models.user.update({
    info: info
  },
  {
    where: {
      userID: message.author.id
    },
    fields: [ 'info' ]
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      title: 'Info Set',
      description: args,
      footer: {
        text: args.tag
      }
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setInfo',
  description: 'Sets your info that shows up in the ThotPatrol user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setInfo <text>',
  example: [ 'setInfo I\'m awesome. :sunglasses:' ]
};
