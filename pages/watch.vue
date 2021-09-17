<template>
  <div class="video-bc">
    <div v-if="loading" class="loader">Loading...</div>
    <video
      ref="videoRef"
      class="fill-aspect"
      :class="{ hidden: loading }"
      muted
    />
  </div>
</template>

<script lang="ts">
// import Peer from 'peerjs'
import Peer from 'peerjs'
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    code() {
      return this.$route.params.code
    },
    peer() {
      return this.$accessor.peer
    },
    video(): undefined | HTMLVideoElement {
      return this.$refs.videoRef as HTMLVideoElement
    },
  },
  created() {
    if (this.peer == null) return
    const peer: Peer = this.peer

    peer.connect(this.code)
    peer.on('error', (error) => {
      console.error(error)
      this.$router.back()
    })
    peer.on('call', (call) => {
      call.answer()

      call.on('error', (error) => {
        console.error(error)
        this.$router.back()
      })

      call.on('close', () => {
        this.$router.back()
      })

      call.on('stream', (incoming: MediaStream) => {
        if (this.video != null) {
          this.loading = false
          this.video.srcObject = incoming
          if (incoming.active) {
            this.video.play()
            incoming.getTracks().forEach((track) => {
              track.addEventListener('ended', () => {
                // handle end of stream
                this.$router.back()
              })
            })
          } else {
            incoming.onaddtrack = () => {
              if (this.video != null) {
                this.video.play()
              }
            }
          }
        }
      })
    })
  },
})
</script>
<style>
.hidden {
  display: none;
}
.video-bc {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.fill-aspect {
  width: 100%;
  max-height: 100vh;
  object-fit: contain;
}
.loader {
  font-size: 10px;
  margin: 50px auto;
  text-indent: -9999em;
  width: 11em;
  height: 11em;
  border-radius: 50%;
  background: #ffffff;
  background: -moz-linear-gradient(
    left,
    #ffffff 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: -webkit-linear-gradient(
    left,
    #ffffff 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: -o-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -ms-linear-gradient(
    left,
    #ffffff 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: linear-gradient(
    to right,
    #ffffff 10%,
    rgba(255, 255, 255, 0) 42%
  );
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.loader:before {
  width: 50%;
  height: 50%;
  background: #ffffff;
  border-radius: 100% 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
}
.loader:after {
  background: #000000;
  width: 75%;
  height: 75%;
  border-radius: 50%;
  content: '';
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
@-webkit-keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
