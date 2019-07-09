/**
 * @file greetPrivate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'greetPrivate' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, greetPrivateStats;
  if (guildModel.dataValues.greetPrivate) {
    await ThotPatrol.database.models.guild.update({
      greetPrivate: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'greetPrivate' ]
    });
    color = ThotPatrol.colors.RED;
    greetPrivateStats = ThotPatrol.i18n.info(message.guild.language, 'disablePrivateGreetingMessages', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      greetPrivate: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'greetPrivate' ]
    });
    color = ThotPatrol.colors.GREEN;
    greetPrivateStats = ThotPatrol.i18n.info(message.guild.language, 'enablePrivateGreetingMessages', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: greetPrivateStats
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'greetprv' ],
  enabled: true
};

exports.help = {
  name: 'greetPrivate',
  description: 'Toggles sending of greeting message as direct message for members who join the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'greetPrivate',
  example: []
};
