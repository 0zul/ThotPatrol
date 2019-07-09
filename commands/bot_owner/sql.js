/**
 * @file sql command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (ThotPatrol, message, args) => {
  try {
    if (!args.query) {
      return ThotPatrol.emit('commandUsage', message, this.help);
    }

    let startTime = new Date();
    let result = await ThotPatrol.database.query(args.query.join(' '));
    let endTime = new Date();

    await message.channel.send({
      embed: {
        color: ThotPatrol.colors.GREEN,
        description: 'SQL query successfully executed.',
        fields: [
          {
            name: 'SQL Query',
            value: `\`\`\`sql\n${result[1].sql}\`\`\``
          },
          {
            name: 'Execution Time',
            value: `${endTime - startTime}ms`
          }
        ]
      }
    }).catch(e => {
      ThotPatrol.log.error(e);
    });
  }
  catch (e) {
    if (e.code === 'SQLITE_ERROR') {
      return ThotPatrol.emit('error', 'SQLite Error', `\`\`\`${e.stack}\`\`\``, message.channel);
    }
    ThotPatrol.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'query', type: String, multiple: true, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'sql',
  description: 'Execute SQL query on %ThotPatrol%\'s database.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sql <SQL Query>',
  example: [ 'sql ' ]
};
