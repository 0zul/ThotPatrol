/**
 * @file announcementChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  let description, color;

  if (args.remove) {
    await ThotPatrol.database.models.guild.update({
      announcementChannel: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'announcementChannel' ]
    });
    description = ThotPatrol.i18n.info(message.guild.language, 'disableAnnouncementChannel', message.author.tag);
    color = ThotPatrol.colors.RED;
  }
  else {
    await ThotPatrol.database.models.guild.update({
      announcementChannel: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'announcementChannel' ]
    });
    description = ThotPatrol.i18n.info(message.guild.language, 'enableAnnouncementChannel', message.author.tag);
    color = ThotPatrol.colors.GREEN;
  }

  await message.channel.send({
    embed: {
      color: color,
      description: description
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'announcementChannel',
  description: 'Adds/removes an announcement channel. You will receive announcements made by the bot owner in this channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'announcementChannel [--remove]',
  example: [ 'announcementChannel', 'announcementChannel --remove' ]
};
