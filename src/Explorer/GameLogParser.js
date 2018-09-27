import TriggerTypes from './TriggerTypes';

export default class GameLogParser {
  constructor() {
    this.data = {
      portals: {}, // keyed with "{lat},{lng}"
      logins: [], // a list of logins
      hacks: [], // a list of special hacks
    };
  }

  parseString(file) {
    return this.parseLines(file.split('\n').slice(1));
  }

  parseLines(lines) {
    const events = [];
    for (const rawLine of lines) {
      const line = rawLine.trim().split('\t');
      events.push({
        time: line[0],
        lat: line[1],
        lng: line[2],
        trigger: line[3],
        comments: line[4],
      });
    }
    return this.parseEvents(events);
  }

  parseEvents(events) {
    let lastEvent = null;
    let lastPortalTrigger = null;

    for (const ev of events) {
      if (TriggerTypes[ev.trigger]) {
        const trigger = TriggerTypes[ev.trigger];
        switch (trigger.type) {
          case 'portalInteraction': {
            const portal = this._getPortalFromEvent(ev);
            if (trigger.ensureSuccess && ev.comments !== 'success') {
              // Unsuccessful :(
              break;
            }
            if (trigger.upv) {
              portal.visited = true;
            }
            trigger.mutate(ev, portal);

            if (lastPortalTrigger) {
              lastPortalTrigger.mutate(lastEvent, portal);
              lastPortalTrigger = null;
            }
            break;
          }
          case 'lastPortalInteraction': {
            lastPortalTrigger = trigger;
            break;
          }
          case 'specialHack': {
            const hack = Object.assign({
              time: ev.time,
              lat: ev.lat,
              lng: ev.lng,
            }, trigger.getData(ev));
            this.data.hacks.push(hack);
            break;
          }
          case 'specialAction': {
            trigger.mutate(ev, this.data);
            break;
          }
        }
      }

      lastEvent = ev;
    }
  }

  exportData() {
    const result = {
      logins: this.data.logins,
      hacks: this.data.hacks,
      portals: {},
    };

    for (const coord of Object.keys(this.data.portals)) {
      const portal = Object.assign({}, this.data.portals[coord]);
      for (const key of Object.keys(portal)) {
        if (!portal[key]) delete portal[key];
      }
      result.portals[coord] = portal;
    }

    return result;
  }

  _getPortalFromEvent(ev) {
    const key = `${ev.lat},${ev.lng}`;
    if (!this.data.portals[key]) {
      this.data.portals[key] = {
        visited: false,

        // Hacking
        hacksWhenFriendly: 0,
        hacksWhenEnemy: 0,

        // Building
        captures: 0,
        recharges: 0, // old data only
        modsDeployed: 0,
        resonatorsDeployed: 0,
        resonatorsUpgraded: 0,
        linksCreated: 0,

        // Combat
        resonatorsDestroyed: 0,
        neutralized: 0,
        virusesUsed: 0,

        // $$$
        frackersUsed: 0,
        beaconsUsed: 0,
        beaconTypes: new Set(),
      };
    }
    return this.data.portals[key];
  }
}
