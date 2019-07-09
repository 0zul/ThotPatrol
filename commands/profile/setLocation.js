/**
 * @file setLocation command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.location) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  args.location = args.location.join(' ');

  let charLimit = 20;
  if (args.location.length > charLimit) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'locationRange', charLimit), message.channel);
  }

  let userModel = await ThotPatrol.database.models.user.findOne({
    attributes: [ 'location' ],
    where: {
      userID: message.author.id
    }
  });

  if (!userModel) {
    return message.channel.send({
      embed: {
        description: `<@${message.author.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your location.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }

  await ThotPatrol.database.models.user.update({
    location: args.location
  },
  {
    where: {
      userID: message.author.id
    },
    fields: [ 'location' ]
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      title: 'Location Set',
      description: `${message.author.tag}, your location has been set to ${args.location}.`
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'location', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'setLocation',
  description: 'Sets your location that shows up in the ThotPatrol user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setLocation <CITY>',
  example: [ 'setLocation New York' ]
};
