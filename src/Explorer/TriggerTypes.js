export default {
  // Hacks
  'hacked friendly portal': {
    type: 'portalInteraction',
    upv: true,
    mutate(ev, portal) {
      portal['hacksWhenFriendly']++;
    },
  },
  'hacked enemy portal': {
    type: 'portalInteraction',
    upv: true,
    mutate(ev, portal) {
      portal['hacksWhenEnemy']++;
    },
  },

  // Building
  'captured portal': {
    type: 'portalInteraction',
    upv: true,
    mutate(ev, portal) {
      portal['captures']++;
    },
  },
  'resonator deployed': {
    type: 'portalInteraction',
    upv: true,
    ensureSuccess: true,
    mutate(ev, portal) {
      portal['resonatorsDeployed']++;
    },
  },
  'resonator upgraded': {
    type: 'portalInteraction',
    upv: true,
    ensureSuccess: true,
    mutate(ev, portal) {
      portal['resonatorsUpgraded']++;
    },
  },
  'mod deployed': {
    type: 'portalInteraction',
    upv: true,
    ensureSuccess: true,
    mutate(ev, portal) {
      portal['modsDeployed']++;
    },
  },
  'created link': {
    type: 'portalInteraction',
    upv: true,
    ensureSuccess: true,
    mutate(ev, portal) {
      portal['linksCreated']++;
    },
  },
  'recharged resonator(s)': {
    type: 'portalInteraction',
    ensureSuccess: true,
    mutate(ev, portal) {
      portal['recharges']++;
    },
  },

  // Combat
  'resonator destroyed from portal': {
    type: 'portalInteraction',
    upv: false,
    mutate(ev, portal) {
      portal['resonatorsDestroyed']++;
    },
  },
  'last resonator on portal destroyed': {
    type: 'portalInteraction',
    upv: false,
    mutate(ev, portal) {
      portal['neutralized']++;
    },
  },
  'used alignment virus': {
    type: 'portalInteraction',
    upv: false,
    mutate(ev, portal) {
      portal['virusesUsed']++;
    },
  },

  // $$$
  'used fracker': {
    type: 'portalInteraction',
    upv: true,
    mutate(ev, portal) {
      portal['frackersUsed']++;
    },
  },
  'used beacon': {
    type: 'portalInteraction',
    upv: true,
    mutate(ev, portal) {
      portal['beaconsUsed']++;
      portal['beaconTypes'].add(ev.comments.split(' ').pop());
    },
  },

  // Lucky hacks
  'hacked quantum capsule': {
    type: 'specialHack',
    getData() {
      return {
        item: 'quantum capsule',
      };
    },
  },
  'hacked aegis shield': {
    type: 'specialHack',
    getData() {
      return {
        item: 'aegis shield',
      };
    },
  },

  // Special stuff
  'login': {
    type: 'specialAction',
    mutate(ev, data) {
      data.logins.push({
        time: ev.time,
        lat: ev.lat,
        lng: ev.lng,
      });
    },
  },
};
