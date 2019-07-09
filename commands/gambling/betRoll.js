/**
 * @file betRoll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

let recentUsers = [];

exports.exec = async (ThotPatrol, message, args) => {
  let cooldown = 60;

  if (recentUsers.includes(message.author.id)) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'gamblingCooldown', message.author, cooldown), message.channel);
  }

  if (!args.money || args.money < 1 || !/^(one|two|three|four|five|six)$/i.test(args.outcome)) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  args.money = parseInt(args.money);

  let minAmount = 5;
  if (args.money < minAmount) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'minBet', minAmount), message.channel);
  }

  let outcomes = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six'
  ];
  let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

  let guildMemberModel = await message.client.database.models.guildMember.findOne({
    attributes: [ 'ThotPatrolCurrencies' ],
    where: {
      userID: message.author.id,
      guildID: message.guild.id
    }
  });

  guildMemberModel.dataValues.ThotPatrolCurrencies = parseInt(guildMemberModel.dataValues.ThotPatrolCurrencies);

  if (args.money > guildMemberModel.dataValues.ThotPatrolCurrencies) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'insufficientBalance', guildMemberModel.dataValues.ThotPatrolCurrencies), message.channel);
  }

  recentUsers.push(message.author.id);

  let result;
  if (outcome.toLowerCase() === args.outcome.toLowerCase()) {
    let prize = args.money < 50 ? args.money + outcomes.length : args.money < 100 ? args.money : args.money * 2;
    result = `Congratulations! You won the bet.\nYou won **${prize}** ThotPatrol Currencies.`;

    ThotPatrol.emit('userDebit', message.member, prize);
  }
  else {
    result = 'Sorry, you lost the bet. Better luck next time.';

    ThotPatrol.emit('userCredit', message.member, args.money);
  }

  setTimeout(() => {
    recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
  }, cooldown * 60 * 1000);

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: `Rolled :${outcome}:`,
      description: result
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
};

exports.config = {
  aliases: [ 'br' ],
  enabled: true,
  argsDefinitions: [
    { name: 'outcome', type: String, alias: 'o', defaultOption: true },
    { name: 'money', type: Number, alias: 'm' }
  ]
};

exports.help = {
  name: 'betRoll',
  description: 'Bet %currency.name_plural% on prediction of the outcome of rolling a dice. If you win, you get more of it. But if you lose, you lose the amount you have bet.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'betroll < one/two/three/four/five/six > <-m amount>',
  example: [ 'betroll three -m 100' ]
};
