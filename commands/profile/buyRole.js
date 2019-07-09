/**
 * @file buyRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  if (!args.role) {
    return ThotPatrol.emit('commandUsage', message, this.help);
  }

  args.role = args.role.join(' ');

  let role;
  if (message.guild.roles.has(args.role)) {
    role = message.guild.roles.get(args.role);
  }
  else {
    role = message.guild.roles.find(role => role.name === args.role);
  }
  if (!role) {
    return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  let roleModel = await ThotPatrol.database.models.role.findOne({
    attributes: [ 'price' ],
    where: {
      roleID: role.id,
      guildID: message.guild.id,
      price: {
        [ThotPatrol.database.Op.not]: null
      }
    }
  });

  if (roleModel) {
    let price = roleModel.dataValues.price;

    let guildMemberModel = await ThotPatrol.database.models.guildMember.findOne({
      attributes: [ 'ThotPatrolCurrencies' ],
      where: {
        userID: message.author.id,
        guildID: message.guild.id
      }
    });
    guildMemberModel.dataValues.ThotPatrolCurrencies = parseInt(guildMemberModel.dataValues.ThotPatrolCurrencies);

    if (price > guildMemberModel.dataValues.ThotPatrolCurrencies) {
      return ThotPatrol.emit('error', '', ThotPatrol.i18n.error(message.guild.language, 'insufficientBalance', guildMemberModel.dataValues.ThotPatrolCurrencies), message.channel);
    }

    await message.member.addRole(role);

    ThotPatrol.emit('userCredit', message.member, price);
    if (message.author.id !== message.guild.owner.id) {
      ThotPatrol.emit('userDebit', message.guild.members.get(message.guild.owner.id), (0.9) * price);
    }

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.BLUE,
        description: `${message.author.tag} bought the **${role.name}** role for **${price}** ThotPatrol Currencies.`
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  else {
    return ThotPatrol.emit('error', 'Not for sale', `The **${role.name}** role is not for sale.`, message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'buyRole',
  description: 'Buy role from the server\'s Role Store.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'buyRole < ROLE NAME | ROLE_ID >',
  example: [ 'buyRole The Knights', 'buyRole 277132449585713251' ]
};
