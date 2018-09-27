import '@babel/polyfill'
import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';

import Router from 'vue-router';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet hack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

import Index from '@/pages/Index';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Router
Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      component: Index,
    },
  ],
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
