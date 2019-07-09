/**
 * @file deleteTrigger command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args[0]) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  await ThotPatrol.database.models.trigger.destroy({
    where: {
      trigger: args.join(' '),
      guildID: message.guild.id
    }
  });

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.RED,
      title: 'Trigger deleted',
      description: args.join(' ')
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'deltrigger', 'deletetrip', 'deltrip' ],
  enabled: true
};

exports.help = {
  name: 'deleteTrigger',
  description: 'Deletes the specified message trigger.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'deleteTrigger <trigger>',
  example: [ 'deleteTrigger Hi, there?' ]
};
