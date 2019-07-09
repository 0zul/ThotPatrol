/**
 * @file deleteAllTriggers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  await ThotPatrol.database.models.trigger.destroy({
    where: {
      guildID: message.guild.id
    }
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.RED,
      description: 'Deleted all the triggers and responses.'
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'delalltriggers', 'deletealltrips', 'delalltrips' ],
  enabled: true
};

exports.help = {
  name: 'deleteAllTriggers',
  description: 'Deletes all the triggers and responses you have set.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'deleteAllTriggers',
  example: []
};
