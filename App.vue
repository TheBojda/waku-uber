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
        :icon="myMarker"
        :draggable="true"
        @click="myMarkerClick"
        @dragend="setMyPosition($event.latLng)"
      >
        <InfoPanel ref="myInfoPanel" :position="myPosition" />
      </GmapMarker>
      <GmapMarker
        v-for="(incomingCall, idx) in incomingCalls"
        :key="idx"
        :position="{ lat: incomingCall.lat, lng: incomingCall.lng }"
        :icon="incomingCallMarker"
        @click="markerClick('ic-' + idx, incomingCall.avatarHash)"
      >
        <InfoPanel
          :ref="'ic-' + idx"
          :position="{ lat: incomingCall.lat, lng: incomingCall.lng }"
          :showOfferButton="true"
          @makeOffer="makeAnOffer(incomingCall.avatarHash)"
        />
      </GmapMarker>
      <GmapMarker
        v-for="(incomingOffer, idx) in incomingOffers"
        :key="idx"
        :position="{ lat: incomingOffer.lat, lng: incomingOffer.lng }"
        :icon="incomingOfferMarker"
        @click="markerClick('io-' + idx, incomingOffer.avatarHash)"
      >
        <InfoPanel
          :ref="'io-' + idx"
          :position="{ lat: incomingOffer.lat, lng: incomingOffer.lng }"
        />
      </GmapMarker>
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
        @click="changeSubscribeStatus"
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
import { blackMarker, greenMarker, blueMarker } from "./utils/markers";
import { proto } from "./utils/proto";
import { fetchGrAvatarData } from "./utils/gravatar";
import ProfilePanel from "./components/ProfilePanel.vue";
import InfoPanel from "./components/InfoPanel.vue";

const broadcastTopicName = "/waku-uber/1/broadcast/proto";

@Component({
  components: {
    ProfilePanel,
    InfoPanel,
  },
})
export default class App extends Vue {
  public myMarker = blackMarker;
  public incomingCallMarker = blueMarker;
  public incomingOfferMarker = greenMarker;

  public myPosition = { lat: 45.508, lng: -73.587 };
  public infoWindow = {
    position: { lat: 0, lng: 0 },
    opened: false,
    avatarData: <any>{},
  };

  public listeningToCalls = false;
  public incomingCalls = <any>[];
  public incomingOffers = <any>[];

  private waku: Waku;

  private broadcastOb = (wakuMessage) => {
    this.processBroadcastMessages(wakuMessage);
  };

  constructor() {
    super();
    this.init();
  }

  private async init() {
    this.waku = await Waku.create({ bootstrap: true });
    await this.waku.waitForConnectedPeer();
    console.log("Waku is initialized!");
    this.initPrivateChannel();
  }

  public async initPrivateChannel() {
    let avatarData = localStorage.getItem("avatarData");
    if (avatarData) {
      let parsedAvatarData = JSON.parse(avatarData);
      let privateTopicName = "/waku-uber/1/" + parsedAvatarData.hash + "/proto";
      this.waku.relay.addObserver(
        (wakuMessage) => {
          this.processPrivateMessage(wakuMessage);
        },
        [privateTopicName]
      );
      console.log("Subscribed to private topic: " + privateTopicName);
    }
  }

  public async mounted() {
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

  public myMarkerClick() {
    let avatarData = localStorage.getItem("avatarData");
    if (avatarData) {
      (this.$refs.myInfoPanel as InfoPanel).open(JSON.parse(avatarData));
    }
  }

  public setMyPosition(pos) {
    this.myPosition = {
      lat: pos.lat(),
      lng: pos.lng(),
    };
  }

  public async markerClick(refName, avatarHash) {
    let infoPanelRefs: any = this.$refs[refName];
    let avatarData = await fetchGrAvatarData(avatarHash);
    (infoPanelRefs[0] as InfoPanel).open(avatarData);
  }

  public showProfilePanel() {
    (this.$refs.profilePanel as ProfilePanel).show();
  }

  private processBroadcastMessages(wakuMessage) {
    if (!wakuMessage.payload) return;
    const decoded = proto.WakuUberMessage.decode(wakuMessage.payload);
    console.log("broadcast", decoded);
    this.incomingCalls.push(decoded);
  }

  private processPrivateMessage(wakuMessage) {
    if (!wakuMessage.payload) return;
    const decoded = proto.WakuUberMessage.decode(wakuMessage.payload);
    console.log("private", decoded);
    this.incomingOffers.push(decoded);
  }

  public changeSubscribeStatus() {
    this.listeningToCalls = !this.listeningToCalls;
    if (this.listeningToCalls) {
      this.waku.relay.addObserver(this.broadcastOb, [broadcastTopicName]);
      console.log("Subscribed to broadcast topic: " + broadcastTopicName);
    } else {
      this.waku.relay.deleteObserver(this.broadcastOb, [broadcastTopicName]);
      console.log("Unsubscribed from broadcast topic: " + broadcastTopicName);
    }
  }

  public async callCar() {
    let res = confirm("Would you like to call a car?");
    if (res) {
      let avatarData = localStorage.getItem("avatarData");
      if (avatarData) {
        let parsedAvatarData = JSON.parse(avatarData);
        const payload = proto.WakuUberMessage.encode({
          type: proto.Type.REQUEST,
          lat: this.myPosition.lat,
          lng: this.myPosition.lng,
          avatarHash: parsedAvatarData.hash,
        });
        const wakuMessage = await WakuMessage.fromBytes(
          payload,
          broadcastTopicName
        );
        await this.waku.relay.send(wakuMessage);
        console.log("Waku message sent!");
      } else {
        alert("Please setup your profile!");
      }
    }
  }

  public async makeAnOffer(avatarHash) {
    let res = confirm("Would you like to make an offer?");
    if (res) {
      let avatarData = localStorage.getItem("avatarData");
      if (avatarData) {
        let parsedAvatarData = JSON.parse(avatarData);
        const payload = proto.WakuUberMessage.encode({
          type: proto.Type.RESPONSE,
          lat: this.myPosition.lat,
          lng: this.myPosition.lng,
          avatarHash: parsedAvatarData.hash,
        });
        let privateTopicName = "/waku-uber/1/" + avatarHash + "/proto";
        const wakuMessage = await WakuMessage.fromBytes(
          payload,
          privateTopicName
        );
        await this.waku.relay.send(wakuMessage);
      } else {
        alert("Please setup your profile!");
      }
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
