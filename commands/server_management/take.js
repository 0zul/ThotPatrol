/**
 * @file take command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  try {
    if (args.length < 1 || (isNaN(args[0] = parseInt(args[0])) || args[0] < 1)) {
      return ThotPatrol.emit('commandUsage', message, this.help);
    }

    let user = message.mentions.users.first();
    if (parseInt(args[1]) < 9223372036854775807) {
      user = await ThotPatrol.fetchUser(args[1]);
    }
    if (!user) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'takeNoUser'), message.channel);
    }
    let reason;
    if (args[2]) {
      reason = args.slice(2).join(' ');
    }
    else {
      reason = 'No reason given.';
    }

    args[0] = Math.abs(args[0]);
    ThotPatrol.emit('userCredit', message.guild.members.get(user.id), args[0]);
    // Send a message in the channel to let the Bot Owner know that the operation was successful.
    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: `${args[0]} ThotPatrol Currencies has been taken from <@${user.id}>`,
        fields: [
          {
            name: 'Reason',
            value: reason
          }
        ]
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });

    // Let the user know by DM that their account has been credited.
    await user.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: `Your account has been credited with **${args[0]}** ThotPatrol Currencies.`,
        fields: [
          {
            name: 'Reason',
            value: reason
          }
        ]
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 10013) {
      ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'takeNoUser'), message.channel);
    }
    else {
      throw e;
    }
  }
};

exports.config = {
  aliases: [ 'fine' ],
  enabled: true,
  guildOwnerOnly: true
};

exports.help = {
  name: 'take',
  description: 'Take the specified amount of %currency.name_plural% from the specified user.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'take <amount> <@user-mention|user_id> [Reason]',
  example: [ 'take 100 @user#0001 Misbehaving', 'take 150 2233445566778899' ]
};
