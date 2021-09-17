import { getAccessorType, mutationTree } from 'typed-vuex'
import Peer from 'peerjs'

type State = {
  peer?: Peer,
}

export const state = (): State => ({
})

type RootState = ReturnType<typeof state>

export const getters = {
  peer: (state: RootState) => state.peer,
}

export const mutations = mutationTree(state, {
  setPeer(state, newValue: Peer) {
    state.peer = newValue
  },

  initialiseStore() {
  },
})

export const accessorType = getAccessorType({
  getters,
  mutations,
  state,
})
