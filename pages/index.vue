<template>
  <b-container>
    <b-img
      center
      fluid
      width="600"
      height="338.812"
      class="my-5"
      style="max-width: 600px; width: 100%"
      src="~/static/undraw_In_sync_re_jlqd.svg"
      alt="Sharing icon"
    ></b-img>

    <b-row class="my-1">
      <b-col sm="3">
        <label for="input-none">Your code:</label>
      </b-col>
      <b-col sm="9">
        <div style="float: right">{{ code }}</div>
      </b-col>
    </b-row>

    <hr class="my-4" />

    <b-row class="my-1">
      <b-col sm="3">
        <label for="input-none">Client code:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input
          id="input-none"
          v-model="clientCode"
          :state="null"
          autocomplete="off"
        ></b-form-input>
      </b-col>
    </b-row>

    <b-row class="my-1">
      <b-col sm="9"> </b-col>
      <b-col sm="3">
        <b-button
          style="float: right"
          :disabled="peer == null"
          @click="handleWatch"
          >Watch</b-button
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Peer from 'peerjs'
import { getDisplayMedia } from '../util/getUserMedia'

export default Vue.extend({
  data() {
    return {
      code: '',
      clientCode: '',
      peer: null as null | Peer,
    }
  },
  async created() {
    try {
      if (process.browser === false) return
      const PeerJs = (await import('peerjs')).default
      this.peer = new PeerJs()
      this.peer.on('error', () => {
        console.error('Connection with peer was broken')
      })
      this.peer.on('open', () => {
        this.code = this.peer?.id ?? ''
      })

      this.peer.on('connection', async (cb) => {
        const media = await getDisplayMedia({
          video: { width: 1280, height: 720 },
        })

        this.peer?.call(cb.peer, media)
      })
    } catch (error) {
      this.code = ''
      console.error(error)
    }
  },
  methods: {
    handleWatch() {
      if (this.peer == null) return
      this.$accessor.setPeer(this.peer)
      this.$router.push({ name: 'watch', params: { code: this.clientCode } })
    },
  },
})
</script>
