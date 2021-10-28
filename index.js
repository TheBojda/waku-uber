import Vue from 'vue';
import * as VueGoogleMaps from "vue2-google-maps";

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import App from './App.vue';
import config from './config.json';

Vue.use(VueGoogleMaps, {
    load: {
        key: config.GMAP_API_KEY
    }
});

new Vue({ render: createElement => createElement(App) }).$mount('#app');