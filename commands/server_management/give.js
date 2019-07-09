/**
 * @file give command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.amount) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }
  else if (args.id) {
    user = await ThotPatrol.utils.fetchMember(message.guild, args.id);
    if (user) {
      user = user.user;
    }
  }
  if (!user) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'giveNoUser'), message.channel);
  }

  args.amount = Math.abs(args.amount);
  if (message.author.id === message.guild.ownerID) {
    ThotPatrol.emit('userDebit', message.guild.members.get(user.id), args.amount);

    // Send a message in the channel to let the Guild Owner know that the operation was successful.
    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `You've awarded **${args.amount}** ThotPatrol Currencies to <@${user.id}>.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });

    // Let the user know by DM that their account has been debited.
    await user.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `Your account, in **${message.guild.name}** Server, has been debited with **${args.amount}** ThotPatrol Currencies.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else {
    if (message.author.id === user.id) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'giveYourself'), message.channel);
    }

    if (message.guild.transactions && message.guild.transactions[message.author.id] === 3) {
      return ThotPatrol.emit('error', '', `${message.author.displayName}, you've reached your transaction limit for today. You can only do 3 transactions in 24 hours.`, message.channel);
    }

    let guildMemberModel = await ThotPatrol.database.models.guildMember.findOne({
      attributes: [ 'ThotPatrolCurrencies' ],
      where: {
        userID: message.author.id,
        guildID: message.guild.id
      }
    });
    guildMemberModel.dataValues.ThotPatrolCurrencies = parseInt(guildMemberModel.dataValues.ThotPatrolCurrencies);

    if (guildMemberModel.dataValues.ThotPatrolCurrencies < args.amount) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'insufficientBalance', guildMemberModel.dataValues.ThotPatrolCurrencies), message.channel);
    }

    let giveLimit = 0.5;
    if (args.amount >= giveLimit * guildMemberModel.dataValues.ThotPatrolCurrencies) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'giveLimit', giveLimit * 100), message.channel);
    }

    ThotPatrol.emit('userDebit', message.guild.members.get(user.id), args.amount);
    ThotPatrol.emit('userCredit', message.member, args.amount);

    // Transaction cooldown
    if (!('transactions' in message.guild)) message.guild.transactions = {};
    if (!(message.author.id in message.guild.transactions)) message.guild.transactions[message.author.id] = 0;
    ++message.guild.transactions[message.author.id];

    setTimeout(() => {
      if (message.guild.transactions && message.author.id in message.guild.transactions) {
        delete message.guild.transactions[message.author.id];
      }
    }, 24 * 60 * 60 * 1000);

    // Send a message in the channel to let the user know that the operation was successful.
    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `You have given **${args.amount}** ThotPatrol Currencies to <@${user.id}>.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });

    // Let the user receiving ThotPatrol Currencies know by DM that their account has been debited.
    await user.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: `Your account, in **${message.guild.name}** Server, has been debited with **${args.amount}** ThotPatrol Currencies.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });

    // Let the user sending ThotPatrol Currencies know by DM that their account has been credited.
    await message.author.send({
      embed: {
        color: ThotPatrol.colors.RED,
        description: `Your account, in **${message.guild.name}** Server, has been credited with **${args.amount}** ThotPatrol Currencies.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'amount', type: Number, alias: 'n' }
  ]
};

exports.help = {
  name: 'give',
  description: 'Give the specified amount of %currency.name_plural% from your account to the specified user. If you are the server owner, you can give any amount of %currency.name_plural%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'give < @USER_MENTION | USER_ID > <-n AMOUNT>',
  example: [ 'give @user#0001 -n 50', 'give 114312165731193137 -n 50' ]
};
