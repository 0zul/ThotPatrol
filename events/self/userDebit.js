/**
 * @file userDebit event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

module.exports = async (member, amount) => {
  try {
    let guildMemberModel = await member.client.database.models.guildMember.findOne({
      attributes: [ 'ThotPatrolCurrencies' ],
      where: {
        userID: member.id,
        guildID: member.guild.id
      }
    });

    /*
     * If the user doesn't have a profile, create their profile
     * & add ThotPatrol Currencies.
     */
    if (!guildMemberModel) {
      return await member.client.database.models.guildMember.create({
        userID: member.id,
        guildID: member.guild.id,
        ThotPatrolCurrencies: parseInt(amount)
      },
      {
        fields: [ 'userID', 'guildID', 'ThotPatrolCurrencies' ]
      });
    }

    /*
     * Add the given amount of ThotPatrol Currencies to the user's account.
     */
    await member.client.database.models.guildMember.update({
      ThotPatrolCurrencies: parseInt(guildMemberModel.dataValues.ThotPatrolCurrencies) + parseInt(amount)
    },
    {
      where: {
        userID: member.id,
        guildID: member.guild.id
      },
      fields: [ 'ThotPatrolCurrencies' ]
    });

    /*
     * Add the transaction detail to transactions table.
     */
    await member.client.database.models.transaction.create({
      userID: member.id,
      guildID: member.guild.id,
      type: 'debit',
      amount: parseInt(amount)
    },
    {
      fields: [ 'userID', 'guildID', 'type', 'amount' ]
    });
  }
  catch (e) {
    member.client.log.error(e);
  }
};
