/**
 * @file starboard command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'starboard' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, starboardStats;
  if (guildModel.dataValues.starboard) {
    await ThotPatrol.database.models.guild.update({
      starboard: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'starboard' ]
    });
    color = ThotPatrol.colors.RED;
    starboardStats = ThotPatrol.i18n.info(message.guild.language, 'disableStarboard', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      starboard: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'starboard' ]
    });
    color = ThotPatrol.colors.GREEN;
    starboardStats = ThotPatrol.i18n.info(message.guild.language, 'enableStarboard', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: starboardStats
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
  name: 'starboard',
  description: 'Toggles logging of starred messages of the server in this channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'starboard',
  example: []
};
