/**
 * @file announce command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.length) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let guildModels = await ThotPatrol.database.models.guild.findAll({
    attributes: [ 'announcementChannel' ]
  });

  let announcementChannels = guildModels.filter(guildModel => guildModel.dataValues.announcementChannel).map(guildModel => guildModel.dataValues.announcementChannel);
  let announcementMessage = args.join(' ');

  for (let channel of announcementChannels) {
    if (ThotPatrol.shard) {
      await ThotPatrol.shard.broadcastEval(`
        let channel = this.channels.get('${channel}');
        if (channel) {
          channel.send({
            embed: {
              color: this.colors.BLUE,
              description: \`${announcementMessage}\`
            }
          }).catch(this.log.error);
        }
      `);
    }
    else {
      await ThotPatrol.channels.get(channel).send({
        embed: {
          color: ThotPatrol.colors.BLUE,
          description: announcementMessage
        }
      }).catch(() => {});
    }
  }

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.GREEN,
      title: 'Announced',
      description: announcementMessage
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'notify' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'announce',
  description: 'Send a message to announcement channel of all the servers ThotPatrol is connected to.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'announce <message>',
  example: [ 'announce Just a random announcement.' ]
};
