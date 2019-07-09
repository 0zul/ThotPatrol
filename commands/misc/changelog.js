/**
 * @file changelog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message) => {
  const CHANGES = xrequire('./changes.json');

  let changes = [];
  for (let section in CHANGES) {
    if (CHANGES.hasOwnProperty(section)) {
      if (section === 'date' || section === 'image' || !CHANGES[section].length) continue;

      changes.push({
        name: section,
        value: `- ${CHANGES[section].join('\n- ')}`
      });
    }
  }

  changes.push(
    {
      name: '\u200B',
      value: '\u200B'
    },
    {
      name: 'Missed an update?',
      value: '[Check out our previous change logs](https://github.com/TheThotPatrolBot/ThotPatrol/releases).'
        + '\nJoin **ThotPatrol HQ** and never miss an update: https://discord.gg/fzx8fkt'
    },
    {
      name: 'Loving ThotPatrol?',
      value: 'Then why wait? Go ahead and express your feelings by tweeting him [@TheThotPatrolBot](https://twitter.com/TheThotPatrolBot) and your testimonial will be posted in [our testimonials page](https://bastionbot.org/testimonials).'
    },
    {
      name: 'Support ThotPatrol\'s Development',
      value: '[Support the development of ThotPatrol](https://bastionbot.org/donate) to keep it running forever and get cool rewards!'
    }
  );

  await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: `ThotPatrol Bot v${ThotPatrol.package.version} Changelog`,
      url: `https://github.com/TheThotPatrolBot/ThotPatrol/releases/v${ThotPatrol.package.version}`,
      fields: changes,
      image: {
        url: CHANGES.image
      },
      footer: {
        text: CHANGES.date
      }
    }
  });
};

exports.config = {
  aliases: [ 'clog', 'changes' ],
  enabled: true
};

exports.help = {
  name: 'changelog',
  description: 'Shows the changes made in the current version of ThotPatrol Bot.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'changelog',
  example: []
};
