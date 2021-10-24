<template>
  <b-modal id="profilePanel" title="Profile" hide-footer>
    <b-row>
      <b-col>
        <b-form inline>
          <b-form-input
            v-model="email"
            type="email"
            class="col-10 mr-1"
            placeholder="Enter your gravatar email address"
            required
          ></b-form-input>
          <b-button variant="primary" @click="refreshGravatar">
            <b-icon icon="arrow-repeat" />
          </b-button>
        </b-form>
        <hr />
      </b-col>
    </b-row>
    <b-row v-if="gravatar">
      <b-col cols="3">
        <b-img rounded :src="gravatar.thumbnailUrl" />
      </b-col>
      <b-col cols="9">
        <h5>{{ gravatar.displayName }}</h5>
        <p>{{ gravatar.aboutMe }}</p>
        <div v-if="gravatar.phoneNumbers">
          <p><strong>Phone number: </strong></p>
          <p>
            <b-link :href="'tel:' + gravatar.phoneNumbers[0].value">{{
              gravatar.phoneNumbers[0].value
            }}</b-link>
          </p>
        </div>
        <div v-if="this.gravatar.skype">
          <p><strong>Skype: </strong></p>
          <p>
            <b-link :href="'skype:' + this.gravatar.skype">{{
              this.gravatar.skype
            }}</b-link>
          </p>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import md5 from "md5";
import { fetchGrAvatarData } from "../utils/gravatar";

@Component
export default class ProfilePanel extends Vue {
  public gravatar: any = false;
  public email = "";

  constructor() {
    super();
    let avatarData = localStorage.getItem("avatarData");
    if (avatarData) this.gravatar = JSON.parse(avatarData);
  }

  async refreshGravatar() {
    this.gravatar = await fetchGrAvatarData(md5(this.email));
    localStorage.setItem("avatarData", JSON.stringify(this.gravatar));
  }
}
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
</style>