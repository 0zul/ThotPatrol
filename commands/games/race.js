/**
 * @file race command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const ProgressBar = xrequire('./utils/progress');

exports.exec = async (ThotPatrol, message) => {
  let racers = [ [], [] ];
  const STEPS = 20;
  for (let i = 0; i < racers.length; i++) {
    racers[i].length = STEPS;
    for (let j = 0; j < STEPS; j++) {
      racers[i][j] = '-\u2003';
    }
  }

  const Thot_Patrol = new ProgressBar(':bar', {
    incomplete: '-\u2003',
    complete: '-\u2003',
    head: '🚘',
    total: 20
  });
  const racer = new ProgressBar(':bar', {
    incomplete: '-\u2003',
    complete: '-\u2003',
    head: '🚖',
    total: 20
  });

  let raceStatusMessage = await message.channel.send({
    embed: {
      color: ThotPatrol.colors.BLUE,
      title: 'Race',
      fields: [
        {
          name: ThotPatrol.user.tag,
          value: `:vertical_traffic_light: ${racers[0].join('')}:checkered_flag:`
        },
        {
          name: message.author.tag,
          value: `:vertical_traffic_light: ${racers[1].join('')}:checkered_flag:`
        }
      ]
    }
  });

  let timer = setInterval(() => {
    for (let i = 0; i < Number.random(1, 5); i++) {
      racer.tick();
    }
    for (let i = 0; i < Number.random(1, 5); i++) {
      ThotPatrol.tick();
    }

    if (Thot_Patrol.lastDraw) {
      let result = 'Race ',
        progressThotPatrol = `:vertical_traffic_light: ${ThotPatrol.lastDraw}:checkered_flag:`,
        progressRacer = `:vertical_traffic_light: ${racer.lastDraw}:checkered_flag:`;

      if (Thot_Patrol.complete && !racer.complete) {
        result += 'Ended';
        progressThotPatrol = `:vertical_traffic_light: ${ThotPatrol.lastDraw}:checkered_flag: :trophy:`;
      }
      else if (!Thot_Patrol.complete && racer.complete) {
        result += 'Ended';
        progressRacer = `:vertical_traffic_light: ${racer.lastDraw}:checkered_flag: :trophy:`;
      }
      else if (Thot_Patrol.complete && racer.complete) {
        result += 'Ended - Draw';
      }

      raceStatusMessage.edit({
        embed: {
          color: ThotPatrol.colors.BLUE,
          title: result,
          fields: [
            {
              name: ThotPatrol.user.tag,
              value: progressThotPatrol
            },
            {
              name: message.author.tag,
              value: progressRacer
            }
          ]
        }
      }).catch(() => {});
    }
    if (Thot_Patrol.complete || racer.complete) {
      clearInterval(timer);
    }
  }, 1000);
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'race',
  description: 'Start a race against %ThotPatrol%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'race',
  example: [ 'race' ]
};
