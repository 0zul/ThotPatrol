/**
 * @file The starting point of ThotPatrol
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Tesseract = xrequire('tesseract');
const ThotPatrol = new Tesseract.Client({
  settingsDirectory: './settings',
  monitorsDirectory: './monitors',
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

if (ThotPatrol.shard) process.title = `ThotPatrol-Shard-${ThotPatrol.shard.id}`;
else process.title = 'ThotPatrolBot';

ThotPatrol.package = xrequire('./package.json');
ThotPatrol.Constants = Tesseract.Constants;
ThotPatrol.colors = Tesseract.Constants.Colors;
ThotPatrol.permissions = Tesseract.Permissions.FLAGS;

xrequire('./prototypes/Number.prototype');
xrequire('./prototypes/Number');
xrequire('./prototypes/String.prototype');
xrequire('./prototypes/Array.prototype');
xrequire('./prototypes/Array');
xrequire('./prototypes/Object');

const WebhookHandler = xrequire('./handlers/webhookHandler.js');
ThotPatrol.webhook = new WebhookHandler(ThotPatrol.credentials.webhooks);
ThotPatrol.log = xrequire('./handlers/logHandler');
ThotPatrol.methods = xrequire('./handlers/methodHandler');

const StringHandler = xrequire('./handlers/stringHandler');
ThotPatrol.i18n = new StringHandler();

const Sequelize = xrequire('sequelize');
ThotPatrol.database = new Sequelize(ThotPatrol.credentials.database.URI, {
  operatorsAliases: false,
  logging: false
});
ThotPatrol.database.authenticate().then(() => {
  // Populate Database/Implement model definitions
  xrequire('./utils/models')(Sequelize, ThotPatrol.database);

  // Load ThotPatrol Events
  xrequire('./handlers/eventHandler')(ThotPatrol);

  // Load ThotPatrol Modules
  const Modules = xrequire('./handlers/moduleHandler');
  ThotPatrol.commands = Modules.commands;
  ThotPatrol.aliases = Modules.aliases;

  // Start ThotPatrol
  ThotPatrol.login(ThotPatrol.credentials.token).then(() => {
    /**
     * Using <Model>.findOrCreate() won't require the use of
     * <ModelInstance>.save() but <Model>.findOrBuild() is used instead because
     * <Model>.findOrCreate() creates a race condition where a matching row is
     * created by another connection after the `find` but before the `insert`
     * call. However, it is not always possible to handle this case in SQLite,
     * specifically if one transaction inserts and another tries to select
     * before the first one has committed. TimeoutError is thrown instead.
     */
    ThotPatrol.database.models.settings.findOrBuild({
      where: {
        botID: ThotPatrol.user.id
      }
    }).spread((settingsModel, initialized) => {
      if (initialized) {
        return settingsModel.save();
      }
    }).catch(ThotPatrol.log.error);
  }).catch(e => {
    ThotPatrol.log.error(e.toString());
    process.exit(1);
  });
}).catch(err => {
  ThotPatrol.log.error(err);
});

process.on('unhandledRejection', rejection => {
  /* eslint-disable no-console */
  console.warn('\n[unhandledRejection]');
  console.warn(rejection);
  console.warn('[/unhandledRejection]\n');
  /* eslint-enable no-console */
});
