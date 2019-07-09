const sendHeartbeat = require('./modules/sendHeartbeat');
//const guildCount = require('./modules/guildCount');

module.exports = async (ThotPatrol) => {
  try {
    await sendHeartbeat(ThotPatrol);
    //await guildCount(ThotPatrol);
  }
  catch (e) {
    ThotPatrol.log.error(e);
  }
};
