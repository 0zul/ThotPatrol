/**
 * @file myItems command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  let color, title, description;

  let itemsModel = await ThotPatrol.database.models.items.findOne({
    attributes: [ 'custom' ],
    where: {
      userID: message.author.id,
      guildID: message.guild.id
    }
  });

  let userItems;
  if (itemsModel) {
    userItems = itemsModel.dataValues.custom;
  }
  else {
    userItems = [];
  }

  if (userItems.length) {
    color = ThotPatrol.colors.BLUE;
    title = `Items available with ${message.author.tag}`;
    description = userItems.join(', ');
  }
  else {
    color = ThotPatrol.colors.RED;
    title = 'Not Found';
    description = 'You don\'t have any items with you in this server.';
  }

  await message.channel.send({
    embed: {
      color: color,
      title: title,
      description: description
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'myItems',
  description: 'Shows the items you\'ve bought from the server\'s shop.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'myItems',
  example: []
};
