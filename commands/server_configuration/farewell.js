/**
 * @file farewell command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */
// I don't understand why this is even needed, but some fellows like this.

exports.exec = async (ThotPatrol, message) => {
  let guildModel = await ThotPatrol.database.models.guild.findOne({
    attributes: [ 'farewell' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, farewellStats;
  if (guildModel.dataValues.farewell === message.channel.id) {
    await ThotPatrol.database.models.guild.update({
      farewell: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'farewell' ]
    });
    color = ThotPatrol.colors.RED;
    farewellStats = ThotPatrol.i18n.info(message.guild.language, 'disableFarewellMessages', message.author.tag);
  }
  else {
    await ThotPatrol.database.models.guild.update({
      farewell: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'farewell' ]
    });
    color = ThotPatrol.colors.GREEN;
    farewellStats = ThotPatrol.i18n.info(message.guild.language, 'enableFarewellMessages', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: farewellStats
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
  name: 'farewell',
  description: 'Toggles sending of farewell message for members who left the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewell',
  example: []
};
