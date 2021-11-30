<template>
  <GmapInfoWindow
    :position="position"
    :opened="opened"
    @closeclick="opened = false"
  >
    <div class="container">
      <div class="row">
        <div class="col col-3" style="padding-left: 0px; padding-right: 0px">
          <img
            class="rounded"
            :src="avatarData.thumbnailUrl"
            style="width: 100%"
          />
        </div>
        <div class="col col-9">
          <strong>{{ avatarData.displayName }}</strong>
          <p>{{ avatarData.aboutMe }}</p>
          <p v-if="avatarData.phoneNumbers">
            Phone:
            <a :href="'tel:' + avatarData.phoneNumbers[0].value">
              {{ avatarData.phoneNumbers[0].value }}
            </a>
          </p>
          <p v-if="avatarData.skype">
            Skype:
            <a :href="'skype:' + avatarData.skype">
              {{ avatarData.skype }}
            </a>
          </p>
          <p v-if="showOfferButton">
            <button class="btn btn-primary" @click="makeAnOffer">
              Make an offer
            </button>
          </p>
        </div>
      </div>
    </div>
  </GmapInfoWindow>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component
class InfoPanel extends Vue {
  @Prop({ type: Boolean, default: false }) public showOfferButton;

  public position = { lat: 0, lng: 0 };
  public opened = false;
  public avatarHash = "";
  public avatarData: any = {};

  public open(avatarData) {
    this.avatarData = avatarData;
    this.opened = true;
  }

  @Emit("makeOffer") public makeAnOffer() {
    this.opened = false;
  }
}

export default InfoPanel;
</script>
