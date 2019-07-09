/**
 * @file reloadSettings command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  if (ThotPatrol.shard) {
    await ThotPatrol.shard.broadcastEval('this.reloadSettings()');
  }
  else {
    ThotPatrol.reloadSettings();
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      description: 'Successfully reloaded all the settings.'
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'reloadSettings',
  description: 'Reloads ThotPatrol settings, stored in the `settings` directory, from the cache. When you modify files in the `settings` directory, use this command to reload them without any need to restart.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reloadSettings',
  example: []
};
