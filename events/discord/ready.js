/**
 * @file ready event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const COLOR = xrequire('chalk');

module.exports = async ThotPatrol => {
  try {
    // Sanity check
    let application = await ThotPatrol.fetchApplication();
    if (application.botPublic) {
      let errorCode = 0xBAADB002;

      ThotPatrol.log.fatal(Buffer.from('RkFUQUwgRVJST1I6IDB4QkFBREIwMDIKCkdvIHRvIHlvdXIgQm90J3MgYXBwbGljYXRpb24gcGFnZSBpbiBEaXNjb3JkIERldmVsb3BlcnMgc2l0ZSBhbmQgZGlzYWJsZSB0aGUgIlB1YmxpYyBCb3QiIG9wdGlvbi4KClBsZWFzZSBjb250YWN0IHRoZSBzdXBwb3J0IHRlYW0gYXQgQmFzdGlvbiBIUSAtIGh0dHBzOi8vZGlzY29yZC5nZy9meng4Zmt0IC0gZm9yIG1vcmUgaW5mb3JtYXRpb24u', 'base64').toString('utf-8'));

      if (ThotPatrol.shard) {
        await ThotPatrol.shard.broadcastEval(`this.destroy().then(() => process.exitCode = ${errorCode})`);
      }
      else {
        await ThotPatrol.destroy();
        process.exitCode = errorCode;
        process.exit(errorCode);
      }

      return null;
    }

    ThotPatrol.monitors.exec(__filename.slice(__dirname.length + 1, -3), ThotPatrol);

    if (ThotPatrol.shard && ThotPatrol.shard.id + 1 === ThotPatrol.shard.count) {
      await ThotPatrol.shard.broadcastEval('process.env.SHARDS_READY = true');
    }

    ThotPatrol.user.setPresence({
      status: ThotPatrol.configurations.status,
      game: {
        name: typeof ThotPatrol.configurations.game.name === 'string' ? ThotPatrol.configurations.game.name : ThotPatrol.configurations.game.name.length ? ThotPatrol.configurations.game.name[0] : null,
        type: ThotPatrol.configurations.game.type,
        url: ThotPatrol.configurations.game.url && ThotPatrol.configurations.game.url.trim().length ? ThotPatrol.configurations.game.url : null
      }
    });

    if (typeof ThotPatrol.configurations.game.name !== 'string' && ThotPatrol.configurations.game.name.length) {
      ThotPatrol.setInterval(async () => {
        try {
          await ThotPatrol.user.setActivity(ThotPatrol.configurations.game.name[Math.floor(Math.random() * ThotPatrol.configurations.game.name.length)],
            {
              type: ThotPatrol.configurations.game.type,
              url: ThotPatrol.configurations.game.url && ThotPatrol.configurations.game.url.trim().length ? ThotPatrol.configurations.game.url : null
            });
        }
        catch (e) {
          ThotPatrol.log.error(e);
        }
      }, ((typeof ThotPatrol.configurations.game.interval === 'number' && ThotPatrol.configurations.game.interval) || 60) * 60 * 1000);
    }

    let ThotPatrolGuilds = ThotPatrol.guilds.map(g => g.id);
    let guilds = await ThotPatrol.database.models.guild.findAll({
      attributes: [ 'guildID' ]
    });
    guilds = guilds.map(guild => guild.guildID);

    /*
     * Add guilds to the DB which was added ThotPatrol when it was offline.
     */
    for (let i = 0; i < ThotPatrolGuilds.length; i++) {
      let found = false;
      for (let j = 0; j < guilds.length; j++) {
        if (ThotPatrolGuilds[i] === guilds[j]) {
          found = true;
          break;
        }
      }
      if (found === false) {
        /**
         * TODO: Use <Model>.bulkCreate() when Sequelize supports bulk ignore
         * option with it, which isn't supported yet because PostgreSQL doesn't
         * support 'INSERT OR IGNORE' query, yet.
         * @example
         * await ThotPatrol.database.models.guild.bulkCreate(
         *   ThotPatrol.guilds.map(guild => {
         *     return { guildID: guild.id };
         *   }),
         *   { ignore: true }
         * );
         */
        await ThotPatrol.database.models.guild.create({
          guildID: ThotPatrolGuilds[i]
        },
        {
          fields: [ 'guildID' ]
        });
      }
    }

    /**
     * TODO: Remove guilds from DB which removed ThotPatrol when it was offline.
     * @example
     * for (let i = 0; i < guilds.length; i++) {
     *   let found = false;
     *   for (let j = 0; j < ThotPatrolGuilds.length; j++) {
     *     if (guilds[i] === ThotPatrolGuilds[j]){
     *       found = true;
     *       break;
     *     }
     *   }
     *   if (found === false) {
     *     await ThotPatrol.database.models.guild.destroy({
     *       where: {
     *         guildID: guilds[i]
     *       }
     *     });
     *   }
     * }
     */

    xrequire('./handlers/scheduledCommandHandler')(ThotPatrol);
    xrequire('./handlers/streamNotifier')(ThotPatrol);
    xrequire('./handlers/reactionRolesGroupsHandler')(ThotPatrol);

    if (ThotPatrol.shard) {
      ThotPatrol.log.console(`${COLOR.cyan(`[${ThotPatrol.user.username}]:`)} Shard ${ThotPatrol.shard.id} is ready with ${ThotPatrol.guilds.size} servers.`);

      ThotPatrol.webhook.send('ThotPatrolLog', {
        title: `Launched Shard ${ThotPatrol.shard.id}`,
        description: `Shard ${ThotPatrol.shard.id} is ready with ${ThotPatrol.guilds.size} servers.`,
        footer: {
          icon_url: 'https://resources.ThotPatrolbot.org/images/hourglass_loading.gif',
          text: `Launched ${ThotPatrol.shard.id + 1} of ${ThotPatrol.shard.count} shards.`
        },
        timestamp: new Date()
      });
    }

    if (!ThotPatrol.shard || process.env.SHARDS_READY) {
      let bootTime = process.uptime() * 1000;
      let guilds = ThotPatrol.shard ? await ThotPatrol.shard.broadcastEval('this.guilds.size') : ThotPatrol.guilds.size;
      if (guilds instanceof Array) {
        guilds = guilds.reduce((sum, val) => sum + val, 0);
      }

      ThotPatrol.log.console(COLOR`\n{cyan ThotPatrol} v${ThotPatrol.package.version}`);
      ThotPatrol.log.console(COLOR`{gray ${ThotPatrol.package.url}}`);

      ThotPatrol.log.console(COLOR`\n{gray </> with ❤ by The ThotPatrol Bot Team & Contributors}`);
      ThotPatrol.log.console(COLOR`{gray Copyright (C) 2017-2019 The ThotPatrol Bot Project}`);

      ThotPatrol.log.console(COLOR`\n{cyan [${ThotPatrol.user.username}]:} I'm ready to roll! 🚀\n`);

      if (ThotPatrol.shard) {
        ThotPatrol.log.console(COLOR`{green [   SHARDS]:} ${ThotPatrol.shard.count}`);
      }
      ThotPatrol.log.console(COLOR`{green [  SERVERS]:} ${guilds}`);
      ThotPatrol.log.console(COLOR`{green [   PREFIX]:} ${ThotPatrol.configurations.prefix.join(' ')}`);
      ThotPatrol.log.console(COLOR`{green [ COMMANDS]:} ${ThotPatrol.commands.size}`);
      ThotPatrol.log.console(COLOR`{green [BOOT TIME]:} ${bootTime}ms`);

      ThotPatrol.webhook.send('ThotPatrolLog', {
        color: ThotPatrol.colors.BLUE,
        title: 'I\'m Ready to Roll!  🚀',
        description: `Connected to ${guilds} servers${ThotPatrol.shard ? ` in ${ThotPatrol.shard.count} shards` : ''}.`,
        footer: {
          icon_url: 'https://resources.ThotPatrolbot.org/logos/ThotPatrol_Logomark_C.png',
          text: `ThotPatrol v${ThotPatrol.package.version}`
        },
        timestamp: new Date()
      });
    }
  }
  catch (e) {
    ThotPatrol.log.error(e);
    process.exit(1);
  }
};
