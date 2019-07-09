/**
 * @file Test script to test ThotPatrol's successful booting
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const Tesseract = xrequire('tesseract');
const ThotPatrol = new Tesseract.Client({
  settingsDirectory: './settings',
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

ThotPatrol.package = xrequire('./package.json');
ThotPatrol.Constants = Tesseract.Constants;
ThotPatrol.colors = Tesseract.Constants.Colors;
ThotPatrol.permissions = Tesseract.Permissions.FLAGS;

// xrequire('./prototypes/Array.prototype');
xrequire('./prototypes/String.prototype');
xrequire('./prototypes/Number.prototype');

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

  if (ThotPatrol.commands && ThotPatrol.aliases) {
    ThotPatrol.log.info(`Successfully loaded ${ThotPatrol.commands.size} commands`);
  }
  else {
    ThotPatrol.log.error('Failed to load commands.');
    process.exit(1);
  }
}).catch(e => {
  ThotPatrol.log.error(e.stack);
  process.exit(1);
});
