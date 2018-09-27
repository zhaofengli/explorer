<template>
  <div class="details">
    <ul class="plainul tags">
      <li v-if="portal.captures">
        UPC
      </li>
      <li v-else-if="portal.visited">
        UPV
      </li>

      <li v-if="portal.neutralized">
        UPN
      </li>
    </ul>
    <h3>Hacking</h3>
    <dl>
      <dt>Friendly</dt>
      <dd>{{ portal.hacksWhenFriendly }}</dd>
      <dt>Enemy</dt>
      <dd>{{ portal.hacksWhenEnemy }}</dd>
      <dt class="sum">Total</dt>
      <dd>{{ portal.hacksWhenFriendly + portal.hacksWhenEnemy }}</dd>
    </dl>

    <h3>Building</h3>
    <dl>
      <dt>Captures</dt>
      <dd>{{ portal.captures }}</dd>
      <dt>Res. deployed</dt>
      <dd>{{ portal.resonatorsDeployed }}</dd>
      <dt>Res. upgraded</dt>
      <dd>{{ portal.resonatorsUpgraded }}</dd>
      <dt>Links created</dt>
      <dd>{{ portal.linksCreated }}</dd>
    </dl>

    <h3>Combat</h3>
    <dl>
      <dt>Res. destroyed</dt>
      <dd>{{ portal.resonatorsDestroyed }}</dd>
      <dt>Viruses used</dt>
      <dd>{{ portal.virusesUsed }}</dd>
      <dt>Neutralized</dt>
      <dd>{{ portal.neutralized }}</dd>
    </dl>

    <h3>CMU</h3>
    <dl>
      <dt>Frackers used</dt>
      <dd>{{ portal.frackersUsed }}</dd>
      <dt>Beacons used</dt>
      <dd>{{ portal.beaconsUsed }}</dd>
      <dt>Beacon types</dt>
      <dd>{{ portal.beaconTypes }}</dd>
    </dl>

    <ul class="plainul">
      <li><a :href="intelLink">Intel</a></li>
      <li><a :href="mapLink">Google Maps</a></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['portal'],
  data() {
    return {
    };
  },
  computed: {
    coord() {
      return `${this.portal.latLng.lat},${this.portal.latLng.lng}`;
    },
    intelLink() {
      return `https://ingress.com/intel?ll=${this.coord}&pll=${this.coord}&z=16`;
    },
    mapLink() {
      return `https://google.com/maps/place/${this.coord}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.sum {
  font-weight: bold;
}
ul.plainul {
  padding-left: 0;
  margin: 10px 0;

  li {
    display: inline;
    margin-right: 5px;
  }
}
.tags li {
    font-weight: bold;
    color: #555;
}
dl {
	dt {
		float: left;
		text-align: right;
		width: 50%;
		margin-right: 30px;
	}
  dd {
    text-align: left;
  }
	dd:after {
		content: '';
		display: block;
		clear: both;
	}
}
</style>
