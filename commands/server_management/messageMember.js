/**
 * @file messageMember command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  try {
    if (args.length < 2) {
      return ThotPatrol.emit('commandUsage', message, this.help);
    }

    let user = await ThotPatrol.utils.fetchMember(message.guild, args[0]);

    if (!user) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notFound', 'user'), message.channel);
    }

    let DMChannel = await user.createDM();
    await DMChannel.send({
      embed: {
        color: ThotPatrol.colors.BLUE,
        description: args.slice(1).join(' ')
      }
    }).catch(e => {
      if (e.code === 50007) {
        return ThotPatrol.emit('error', '', 'Can\'t send message to this user. They might have disabled their DM or they don\'t share a server with me.', message.channel);
      }
      throw e;
    });
  }
  catch (e) {
    if (e.code === 10013) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'notFound', 'user'), message.channel);
    }
    throw e;
  }
};

exports.config = {
  aliases: [ 'msgm' ],
  enabled: true
};

exports.help = {
  name: 'messageMember',
  description: 'Send a message to any specified member of your server through ThotPatrol.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'messageMember <USER_ID> <Message>',
  example: [ 'messageMember 284533953031176194 Hello, how are you?' ]
};
