<template>
  <div>
    <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      class="map"
      ref="map"
      @moveend="updateView"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-circle-marker
        v-for="portal of portalsInView"
        :lat-lng="portal.latLng"
        :color="getPortalColor(portal)"
        :fillColor="getPortalFill(portal)"
      >
        <l-popup>
          <PortalDetails :portal="portal"/>
        </l-popup>
      </l-circle-marker>
    </l-map>
    <v-btn
      dark fab fixed bottom left
      @click="filterDialog = true"
      v-if="data"
    >
      <v-icon>filter_list</v-icon>
    </v-btn>
    <v-btn
      dark fab fixed bottom right
      @click="showNextPortal"
      v-if="filterCode"
    >
      <v-icon>navigate_next</v-icon>
    </v-btn>
    <v-dialog
      v-model="filterDialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline"
          primary-title
        >
          Filter
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="filterCode"
            label="Filter"
          ></v-text-field>

          <h2>Examples</h2>
          <ul>
            <li>Show UPVs only: <code>portal.visited</code></li>
            <li>Show UPCs only: <code>portal.captures &gt; 0</code></li>
            <li>Show gatherings: <code>portal.frackersUsed > 0 && portal.beaconsUsed > 0</code></li>
          </ul>

          <h2>Sample data</h2>
          <pre>
{
  visited: true,

  // Hacking
  hacksWhenFriendly: 5,
  hacksWhenEnemy: 3,

  // Building
  captures: 2,
  recharges: 0, // Not updated after May 2018
  modsDeployed: 3,
  resonatorsDeployed: 14,
  resonatorsUpgraded: 0,
  linksCreated: 0,

  // Combat
  resonatorsDestroyed: 0,
  neutralized: 0,
  virusesUsed: 0,

  // $$$
  frackersUsed: 0,
  beaconsUsed: 2,
  beaconTypes: new Set{['MEET', 'RES']},
}
          </pre>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="updateFiltered">Apply</v-btn>
          <span v-if="filterError">Error</span>
          <span>{{ filteredPortals.length }} / {{ portals.length }}</span>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      v-model="introDialog"
      width="500"
    >
      <v-card>
        <v-toolbar dark dense color="#AB47BC">
          <v-toolbar-title>Explorer</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <p>
            See where Ingress has taken you to.
          </p>
          <p>
            Processing is done entirely in your browser.
            No data is uploaded.
            Interested in contributing? Get involved on <a href="https://github.com/zhaofengli/explorer">GitHub</a>.
          </p>
        </v-card-text>
        <v-card-actions>
          <input type="file" ref="filePicker" class="hiddenFileInput" @change="processFile">
          <v-btn
            flat
            @click="activateFilePicker"
          >
            Import game log
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import L from 'leaflet';
import { LMap, LTileLayer, LCircleMarker, LPopup } from 'vue2-leaflet';
import GameLogParser from '@/Explorer/GameLogParser';
import PortalDetails from '@/components/PortalDetails';
import filter from 'lodash/filter';

export default {
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
    LPopup,
    PortalDetails,
  },
  data() {
    return {
      zoom: 13,
      center: L.latLng(33.6777869, -117.8976865),
      // center: L.latLng(22.3526738, 113.9876151),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      introDialog: true,
      filterDialog: false,
      filterCode: '',
      data: null,
      portals: [],
      filteredPortals: [],
      portalsInView: [],
      filterError: false,
      resultIndex: 0,
      mapOptions: {
        preferCanvas: true,
      },
    };
  },
  methods: {
    activateFilePicker() {
      this.$refs.filePicker.click();
    },
    processFile() {
      if (!this.$refs.filePicker.files.length) {
        return;
      }
      const file = this.$refs.filePicker.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const parser = new GameLogParser();
        parser.parseString(e.target.result);
        this.data = parser.data;

        this.portals = Object.keys(this.data.portals).map((coord) => {
          const c = coord.split(',');
          const latLng = L.latLng(c[0], c[1]);
          this.data.portals[coord].latLng = latLng;
          return this.data.portals[coord];
        });
        this.center = L.latLng(
          this.data.logins[0].lat,
          this.data.logins[0].lng,
        );
        this.introDialog = false;
        this.updateFiltered();
      };
      reader.readAsText(file);
    },
    updateFiltered() {
      if (this.filterCode.length) {
        const filterFunc = new Function('portal', `return (${this.filterCode})`);
        try {
          this.filteredPortals = filter(this.portals, filterFunc);
        } catch (e) {
          console.error(e);
          this.filterError = true;
          return;
        }
      } else {
        this.filteredPortals = this.portals;
      }
      this.filterError = false;
      this.resultIndex = 0;
      this.updateView();
    },
    updateView() {
      const rawBounds = this.$refs.map.mapObject.getBounds();
      const bounds = L.latLngBounds(rawBounds.getNorthWest().wrap(), rawBounds.getSouthEast().wrap());
      this.portalsInView = filter(this.filteredPortals, p => bounds.contains(p.latLng));
      console.log(`${this.portalsInView.length}/${this.portals.length} portals in view (${bounds.getNorthWest()}, ${bounds.getSouthEast()})`);
    },
    showNextPortal() {
      if (!this.filteredPortals.length) {
        return;
      }

      this.resultIndex++;
      if (this.resultIndex >= this.filteredPortals.length) {
        this.resultIndex = 0;
      }

      this.center = this.filteredPortals[this.resultIndex].latLng;
    },
    toLatLng(coord) {
      const c = coord.split(',');
      return L.latLng(c[0], c[1]);
    },
    getPortalColor(portal) {
      if (portal.captures) {
        // UPC
        return '#8E24AA'; // purple darken-1
      } else if (portal.visited) {
        // UPV
        return '#F9A825'; // yellow darken-3
      } else {
        return '#546E7A'; // blue-grey darken-1
      }
    },
    getPortalFill(portal) {
      if (portal.captures) {
        // UPC
        return '#CE93D8'; // purple lighten-3
      } else if (portal.visited) {
        // UPV
        return '#FFF176'; // yellow lighten-2
      } else {
        return '#B0BEC5'; // blue-grey lighten-3
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.map {
  position: absolute !important;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -9999;
}
.hiddenFileInput {
  display: none;
}
</style>
<style>
.leaflet-popup-content {
  width: 200px !important;
}
</style>
