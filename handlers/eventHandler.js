/**
 * @file Event Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = xrequire('fs');
const path = xrequire('path');

/**
 * Handles/Loads all the events.
 * @module eventHandler
 * @param {object} ThotPatrol The ThotPatrol Object.
 * @returns {void}
 */
module.exports = ThotPatrol => {
  const DISCORD_EVENTS_PATH = './events/discord/';
  const SELF_EVENTS_PATH = './events/self/';

  /* eslint-disable no-sync */
  let DiscordEvents = fs.readdirSync(DISCORD_EVENTS_PATH).
    filter(file => !fs.statSync(path.resolve(DISCORD_EVENTS_PATH, file)).isDirectory()).
    filter(file => file.endsWith('.js'));

  let SelfEvents = fs.readdirSync(SELF_EVENTS_PATH).
    filter(file => !fs.statSync(path.resolve(SELF_EVENTS_PATH, file)).isDirectory()).
    filter(file => file.endsWith('.js'));
  /* eslint-enable no-sync */

  for (let event of DiscordEvents) {
    event = event.replace(/\.js$/i, '');

    if (event === 'ready') {
      ThotPatrol.on(event, () => xrequire(DISCORD_EVENTS_PATH, event)(ThotPatrol));
    }
    else {
      ThotPatrol.on(event, xrequire(DISCORD_EVENTS_PATH, event));
    }
  }

  for (let event of SelfEvents) {
    event = event.replace(/\.js$/i, '');

    ThotPatrol.on(event, xrequire(SELF_EVENTS_PATH, event));
  }
};
