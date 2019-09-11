const app = getApp()
Component({
  properties: {
    list: {
      type: Array,
      value: [],
    },
    mode: {
      type: Number,
      value: 1
    },
    playIndex: {
      type: Number,
      value: -1
    }
  },
  data: {
    event: 'handleTap'
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
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
    },
    handleDel (e) {
      const item = e.currentTarget.dataset.item
      const index = e.currentTarget.dataset.index

      const object = {
        item,
        index
      }

      this.triggerEvent('handleDel', object)
    }
  }
})