/**
 * @file sendHeartbeat
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

/**
 * Send a heartbeat to ThotPatrol Web API.
 * @param {TesseractClient} ThotPatrol Tesseract client object
 * @returns {void}
 */
module.exports = async ThotPatrol => {
  try {
    return await ThotPatrol.methods.makeBWAPIRequest('/heartbeat', {
      method: 'POST',
      body: {
        bot: ThotPatrol.user.id
      }
    });
  }
  catch (e) {
    ThotPatrol.log.error(e);
  }
};
