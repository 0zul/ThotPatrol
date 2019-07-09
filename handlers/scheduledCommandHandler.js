/**
 * @file scheduledCommandHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const CronJob = xrequire('cron').CronJob;
const parseArgs = xrequire('command-line-args');

/**
 * Handles ThotPatrol's scheduled commands
 * @param {ThotPatrol} ThotPatrol ThotPatrol Discord client object
 * @returns {void}
 */
module.exports = ThotPatrol => {
  setTimeout(async () => {
    try {
      let scheduledCommandModel = await ThotPatrol.database.models.scheduledCommand.findAll({
        attributes: [ 'channelID', 'messageID', 'cronExp', 'command', 'arguments' ]
      });

      if (!scheduledCommandModel.length) return;

      for (let i = 0; i < scheduledCommandModel.length; i++) {
        let cronExp = scheduledCommandModel[i].dataValues.cronExp,
          command = scheduledCommandModel[i].dataValues.command.toLowerCase(), cmd,
          channel = ThotPatrol.channels.get(scheduledCommandModel[i].dataValues.channelID);
        if (!channel) {
          removeScheduledCommandByChannelID(ThotPatrol, scheduledCommandModel[i].dataValues.channelID);
          continue;
        }
        let args = scheduledCommandModel[i].dataValues.arguments ? scheduledCommandModel[i].dataValues.arguments.split(' ') : '';

        let job = new CronJob(cronExp,
          async function () {
            let message = await channel.fetchMessage(scheduledCommandModel[i].dataValues.messageID).catch(e => {
              if (e.toString().includes('Unknown Message')) {
                job.stop();
                removeScheduledCommandByMessageID(ThotPatrol, scheduledCommandModel[i].dataValues.messageID);
              }
              else {
                ThotPatrol.log.error(e);
              }
            });

            if (ThotPatrol.commands.has(command)) {
              cmd = ThotPatrol.commands.get(command);
            }
            else if (ThotPatrol.aliases.has(command)) {
              cmd = ThotPatrol.commands.get(ThotPatrol.aliases.get(command).toLowerCase());
            }
            else {
              job.stop();
              return removeScheduledCommandByCommandName(ThotPatrol, command);
            }

            if (cmd.config.enabled) {
              cmd.exec(ThotPatrol, message, parseArgs(cmd.config.argsDefinitions, { argv: args, partial: true }));
            }
          },
          function () {},
          false // Start the job right now
        );
        job.start();
      }
    }
    catch (e) {
      ThotPatrol.log.error(e);
    }
  }, 5 * 1000);
};

/**
 * Removes ThotPatrol's scheduled commands
 * @param {ThotPatrol} ThotPatrol ThotPatrol Discord client object
 * @param {String} channelID The Snowflake ID of the channel where the command is scheduled
 * @returns {void}
 */
function removeScheduledCommandByChannelID(ThotPatrol, channelID) {
  ThotPatrol.database.models.scheduledCommand.destroy({
    where: {
      channelID: channelID
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
}

/**
 * Removes ThotPatrol's scheduled commands
 * @param {ThotPatrol} ThotPatrol ThotPatrol Discord client object
 * @param {String} messageID The Snowflake ID of the message that holds the scheduled command's info
 * @returns {void}
 */
function removeScheduledCommandByMessageID(ThotPatrol, messageID) {
  ThotPatrol.database.models.scheduledCommand.destroy({
    where: {
      messageID: messageID
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
}

/**
 * Removes ThotPatrol's scheduled commands
 * @param {ThotPatrol} ThotPatrol ThotPatrol Discord client object
 * @param {String} commandName The name of the command that is scheduled
 * @returns {void}
 */
function removeScheduledCommandByCommandName(ThotPatrol, commandName) {
  ThotPatrol.database.models.scheduledCommand.destroy({
    where: {
      command: commandName
    }
  }).catch(e => {
    ThotPatrol.log.error(e);
  });
}
