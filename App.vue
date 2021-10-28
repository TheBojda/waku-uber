<template>
  <div style="width: 100%; height: 100%">
    <GmapMap
      ref="map"
      :center="{ lat: 45.508, lng: -73.587 }"
      :zoom="10"
      :options="{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }"
      style="width: 100%; height: 100%"
    >
      <GmapMarker
        :position="myPosition"
        :icon="blackMarker"
        :draggable="true"
        @click="blackMarkerClick"
      >
      </GmapMarker>
      <!--GmapMarker
        :position="{ lat: 45.5, lng: -73.58 }"
        :icon="greenMarker"
        :draggable="true"
      /-->
      <GmapInfoWindow
        :position="infoWindow.position"
        :opened="infoWindow.opened"
        @closeclick="infoWindow.opened = false"
      >
        <div class="container">
          <div class="row">
            <div
              class="col col-3"
              style="padding-left: 0px; padding-right: 0px"
            >
              <img
                class="rounded"
                :src="infoWindow.avatarData.thumbnailUrl"
                style="width: 100%"
              />
            </div>
            <div class="col col-9">
              <strong>{{ infoWindow.avatarData.displayName }}</strong>
              <p>{{ infoWindow.avatarData.aboutMe }}</p>
              <p v-if="infoWindow.avatarData.phoneNumbers">
                <a :href="'tel:' + infoWindow.avatarData.phoneNumbers[0].value">
                  {{ infoWindow.avatarData.phoneNumbers[0].value }}
                </a>
              </p>
              <p v-if="infoWindow.avatarData.skype">
                <a :href="'skype:' + infoWindow.avatarData.skype">
                  {{ infoWindow.avatarData.skype }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </GmapInfoWindow>
    </GmapMap>
    <div
      style="position: absolute; bottom: 30px; right: 20px"
      class="d-inline-flex flex-column"
    >
      <button class="btn btn-lg btn-dark mb-2" @click="showProfilePanel">
        <i class="bi-person"></i>
      </button>
      <button
        id="subscribe"
        class="btn btn-lg btn-dark mb-2"
        :class="{ active: listeningToCalls }"
        @click="listeningToCalls = !listeningToCalls"
      >
        <i class="bi-truck"></i>
      </button>
      <button class="btn btn-lg btn-dark mb-2" @click="callCar">
        <i class="bi-telephone"></i>
      </button>
    </div>
    <ProfilePanel ref="profilePanel" />
  </div>
</template>

<script lang="ts">
import "babel-polyfill";
import { Component, Vue } from "vue-property-decorator";
import { Waku, WakuMessage } from "js-waku";
import { GmapMap } from "vue2-google-maps";
import { blackMarker, greenMarker } from "./utils/markers";
import { proto } from "./utils/proto";
import ProfilePanel from "./components/ProfilePanel.vue";

const wakuTopicName = "/waku-uber/1/call-car/proto";

@Component({
  components: {
    ProfilePanel,
  },
})
export default class App extends Vue {
  public blackMarker = blackMarker;
  public greenMarker = greenMarker;

  public myPosition = { lat: 45.508, lng: -73.587 };
  public infoWindow = {
    position: { lat: 0, lng: 0 },
    opened: false,
    avatarData: <any>{},
  };

  public listeningToCalls = false;

  private waku: Waku;

  constructor() {
    super();
    this.init();
  }

  private async init() {
    this.waku = await Waku.create({ bootstrap: true });
    await this.waku.waitForConnectedPeer();
    console.log("Waku is initialized!");
    this.waku.relay.addObserver(
      (wakuMessage) => {
        if (!wakuMessage.payload) return;
        const decocded = proto.WakuUberMessage.decode(wakuMessage.payload);
        console.log(decocded);
      },
      [wakuTopicName]
    );
  }

  private async mounted() {
    if (navigator.geolocation) {
      const pos: any = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      this.myPosition = {
        lat: pos?.coords.latitude,
        lng: pos?.coords.longitude,
      };
      (this.$refs?.map as GmapMap).$mapPromise?.then((map) => {
        map.panTo(this.myPosition);
      });
    }
  }

  public blackMarkerClick() {
    let avatarData = localStorage.getItem("avatarData");
    if (avatarData) {
      this.infoWindow.position = this.myPosition;
      this.infoWindow.opened = true;
      this.infoWindow.avatarData = JSON.parse(avatarData);
    }
  }

  public showProfilePanel() {
    (this.$refs.profilePanel as ProfilePanel).show();
  }

  public async callCar() {
    let res = confirm("Would you like to call a car?");
    if (res) {
      const payload = proto.WakuUberMessage.encode({
        type: proto.Type.REQUEST,
        lat: this.myPosition.lat,
        lng: this.myPosition.lng,
      });
      const wakuMessage = await WakuMessage.fromBytes(payload, wakuTopicName);
      await this.waku.relay.send(wakuMessage);
    }
  }
}
</script>

<style>
#subscribe.active {
  background-color: #28a745;
  border-color: #28a745;
}
</style>
