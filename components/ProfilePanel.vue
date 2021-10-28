<template>
  <div ref="profilePanel" class="modal" id="profilePanel">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Profile</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <form class="row" onsubmit="return false;">
                <input
                  v-model="email"
                  type="email"
                  class="col-10 mr-1"
                  placeholder="Enter your gravatar email address"
                  required
                />
                <button class="btn btn-primary col-2" @click="refreshGravatar">
                  <i class="bi-arrow-repeat"></i>
                </button>
              </form>
              <hr />
            </div>
          </div>
          <div class="row" v-if="gravatar">
            <div class="col col-3">
              <img class="rounded" :src="gravatar.thumbnailUrl" />
            </div>
            <div class="col col-9">
              <h5>{{ gravatar.displayName }}</h5>
              <p>{{ gravatar.aboutMe }}</p>
              <div v-if="gravatar.phoneNumbers">
                <p><strong>Phone number: </strong></p>
                <p>
                  <a :href="'tel:' + gravatar.phoneNumbers[0].value">
                    {{ gravatar.phoneNumbers[0].value }}
                  </a>
                </p>
              </div>
              <div v-if="gravatar.skype">
                <p><strong>Skype: </strong></p>
                <p>
                  <a :href="'skype:' + gravatar.skype">{{ gravatar.skype }}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import md5 from "md5";
import { fetchGrAvatarData } from "../utils/gravatar";
import { Modal } from "bootstrap";

@Component
export default class ProfilePanel extends Vue {
  public gravatar: any = false;
  public email = "";

  private modal;

  constructor() {
    super();
    let avatarData = localStorage.getItem("avatarData");
    if (avatarData) this.gravatar = JSON.parse(avatarData);
  }

  async refreshGravatar() {
    this.gravatar = await fetchGrAvatarData(md5(this.email));
    localStorage.setItem("avatarData", JSON.stringify(this.gravatar));
  }

  public show() {
    let modal = new Modal(this.$refs.profilePanel);
    modal.show();
  }
}
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
</style>