/**
 * @file shutdown command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let confirmation = await message.channel.send({
    embed: {
      color: ThotPatrol.colors.ORANGE,
      description: 'Are you sure you want to shut me down?'
    }
  });

  const collector = confirmation.channel.createMessageCollector(m => ThotPatrol.credentials.ownerId.includes(m.author.id) && (m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no')),
    {
      time: 30 * 1000,
      maxMatches: 1
    }
  );

  collector.on('collect', async answer => {
    if (answer.content.toLowerCase().startsWith('yes')) {
      await message.channel.send({
        embed: {
          description: 'GoodBye :wave:! See you soon.'
        }
      });

      if (ThotPatrol.shard) {
        await ThotPatrol.shard.broadcastEval('this.destroy().then(() => process.exitCode = 0)');
      }
      else {
        await ThotPatrol.destroy();
        process.exitCode = 0;
        setTimeout(() => {
          process.exit(0);
        }, 5000);
      }

      ThotPatrol.log.console('\n');
      ThotPatrol.log.info('GoodBye! See you next time.');
    }
    else {
      await message.channel.send({
        embed: {
          description: 'Cool! I\'m here.'
        }
      });
    }
  });
};

exports.config = {
  aliases: [ 'die', 'turnoff' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'shutdown',
  description: 'Shuts down ThotPatrol and terminates the process.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shutdown',
  example: []
};
