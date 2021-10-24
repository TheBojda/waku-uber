<template>
  <div style="width: 100%; height: 100%">
    <GmapMap
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
        <b-container>
          <b-row>
            <b-col cols="3" style="padding-left: 0px; padding-right: 0px">
              <b-img
                rounded
                :src="infoWindow.avatarData.thumbnailUrl"
                style="width: 100%"
              />
            </b-col>
            <b-col cols="9">
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
            </b-col>
          </b-row></b-container
        >
      </GmapInfoWindow>
    </GmapMap>
    <div
      style="position: absolute; bottom: 30px; right: 20px"
      class="d-inline-flex flex-column"
    >
      <b-button
        size="lg"
        pill
        variant="dark"
        class="mb-2"
        v-b-modal="'profilePanel'"
      >
        <b-icon icon="person" aria-label="Set profile data"></b-icon>
      </b-button>
      <b-button
        id="subscribe"
        size="lg"
        pill
        variant="dark"
        class="mb-2"
        :pressed.sync="listeningToCalls"
      >
        <b-icon icon="truck" aria-label="Share car"></b-icon>
      </b-button>
      <b-button size="lg" pill variant="dark" class="mb-2">
        <b-icon icon="telephone" aria-label="Call car"></b-icon>
      </b-button>
    </div>
    <ProfilePanel />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { blackMarker, greenMarker } from "./utils/markers";
import ProfilePanel from "./components/ProfilePanel.vue";

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
    avatarData: {},
  };

  public listeningToCalls = false;

  public blackMarkerClick() {
    let avatarData = localStorage.getItem("avatarData");
    if (avatarData) {
      this.infoWindow.position = this.myPosition;
      this.infoWindow.opened = true;
      this.infoWindow.avatarData = JSON.parse(avatarData);
    }
  }
}
</script>

<style scoped>
#subscribe.active {
  background-color: #28a745;
  border-color: #28a745;
}
</style>
