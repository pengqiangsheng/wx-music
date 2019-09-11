const app = getApp()
Component({
  properties: {
    list: {
      type: Array,
      value: [],
    }
  },
  data: {
  },
  methods: {
    handleTap (e) {
      const item = e.currentTarget.dataset.item
      const index = e.currentTarget.dataset.index

      const object = {
        item, 
        index
      }
      
      this.triggerEvent('handleTap', object)
    },
    handleMutil (e) {
      const item = e.currentTarget.dataset.item
      const index = e.currentTarget.dataset.index

      const object = {
        item,
        index
      }
      this.triggerEvent('handleMutil', object)
    },
    handlePlay (e) {
      const item = e.currentTarget.dataset.item
      const index = e.currentTarget.dataset.index

      const object = {
        item,
        index
      }
      this.triggerEvent('handlePlay', object)
    }
  }
})