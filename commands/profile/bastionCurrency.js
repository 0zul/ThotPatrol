/**
 * @file ThotPatrolCurrency command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  args = message.mentions.users.first() || message.author;

  let guildMemberModel = await ThotPatrol.database.models.guildMember.findOne({
    attributes: [ 'ThotPatrolCurrencies' ],
    where: {
      userID: args.id,
      guildID: message.guild.id
    }
  });

  let ThotPatrolCurrencies = 0;

  if (guildMemberModel) {
    ThotPatrolCurrencies = guildMemberModel.dataValues.ThotPatrolCurrencies;
  }

  let description = message.author.id === args.id ? `**${args.tag}** you currently have **${ThotPatrolCurrencies}** ThotPatrol Currencies in your account.` : `**${args.tag}** currently has **${ThotPatrolCurrencies}** ThotPatrol Currencies in their account.`;

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      description: description
    }
  });
};

exports.config = {
  aliases: [ 'currency', 'money' ],
  enabled: true
};

exports.help = {
  name: 'ThotPatrolCurrency',
  description: 'Shows the amount of %currency.name_plural% in the specified user\'s account.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'ThotPatrolCurrency [@user-mention]',
  example: [ 'ThotPatrolCurrency', 'ThotPatrolCurrency @user#0001' ]
};
