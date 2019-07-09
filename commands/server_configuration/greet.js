/**
 * @file greet command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'greet' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, greetStats;
  if (guildModel.dataValues.greet === message.channel.id) {
    await ThotPatrol.database.models.guild.update({
      greet: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'greet' ]
    });
    color = ThotPatrol.colors.RED;
    greetStats = ThotPatrol.i18n.info(message.guild.language, 'disableGreetingMessages', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      greet: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'greet' ]
    });
    color = ThotPatrol.colors.GREEN;
    greetStats = ThotPatrol.i18n.info(message.guild.language, 'enableGreetingMessages', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: greetStats
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
  name: 'greet',
  description: 'Toggles sending of greeting message for members who join the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greet',
  example: []
};
