// components/imageViewer/imageViewer.js

let touchDot = 0
let touchMove = 0
let time = 0 // 时间记录，用于滑动时且时间小于1s则执行左右滑动
let interval = '' // 记录/清理时间记录
let canOnePointMove = false
let onePoint = {
  x: 0,
  y: 0
}
let twoPoint = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onShow: {
      type: Boolean,
      value: true
    },
    onClass: {
      type: Boolean,
      value: true
    },
    imgUrl: {
      type: String,
      value: ''
    },
    imgIndex: {
      type: String || Number,
      value: -1
    },
    imgUrls: {
      type: Array,
      value: []
    },
    imgName: { // 图片文件名字
      type: String,
      value: ''
    },
    imgSort: { // 图片的位置
      type: String,
      value: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    width: 0,
    height: 0,
    left: 375,
    top: 760,
    scale: 1,
    windowHeight: '',
    windowWidth: ''
  },
  pageLifetimes: {
    show: function () {
      const {
        windowHeight = '', windowWidth = ''
      } = wx.getSystemInfoSync && wx.getSystemInfoSync() || {}
      this.setData({
        windowHeight,
        windowWidth
      })
      // 页面被展示
      touchDot = 0
      touchMove = 0
      clearInterval(interval)
      time = 0 // 时间记录，用于滑动时且时间小于1s则执行左右滑动
      canOnePointMove = false
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    hideViewer(e) {
      this.triggerEvent('hideViewer')
    },
    // 关闭上拉加载
    onReachBottom: function () {
      return
    },
    bindload: function (e) {
      let width = e.detail.width
      let height = e.detail.height
      if (width > 750) {
        height = (750 * height / width)
        width = 750 * 0.8
      }
      if (height > 1200) {
        width = (1200 * width / height)
        height = 1200 * 0.8
      }
      this.setData({
        width: width,
        height: height
      })
    },
    touchstart: function (e) {
      canOnePointMove = false
      touchDot = e.touches[0].pageX
      clearInterval(interval)
      // 使用js计时器记录时间
      interval = setInterval(function () {
        time++
      }, 100)

      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY
      })
      if (e.touches.length < 2) {
        canOnePointMove = true
        onePoint.x = e.touches[0].pageX * 2
        onePoint.y = e.touches[0].pageY * 2
      } else {
        twoPoint.x1 = e.touches[0].pageX * 2
        twoPoint.y1 = e.touches[0].pageY * 2
        twoPoint.x2 = e.touches[1].pageX * 2
        twoPoint.y2 = e.touches[1].pageY * 2
      }
    },
    touchmove: function (e) {
      touchMove = e.touches[0].pageX
      const that = this
      if (e.touches.length < 2 && canOnePointMove) {
        var onePointDiffX = e.touches[0].pageX * 2 - onePoint.x
        var onePointDiffY = e.touches[0].pageY * 2 - onePoint.y
        that.setData({
          left: that.data.left + onePointDiffX,
          top: that.data.top + onePointDiffY
        })
        onePoint.x = e.touches[0].pageX * 2
        onePoint.y = e.touches[0].pageY * 2
      } else if (e.touches.length > 1) {
        var preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
        twoPoint.x1 = e.touches[0].pageX * 2
        twoPoint.y1 = e.touches[0].pageY * 2
        twoPoint.x2 = e.touches[1].pageX * 2
        twoPoint.y2 = e.touches[1].pageY * 2
        // 计算距离，缩放
        var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
        var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
        let scale = that.data.scale + (curDistance - preDistance) * 0.005
        if (scale < 1) { // 禁止缩小
          scale = 1
        }
        console.log('缩放', scale)
        that.setData({
          scale
        }, () => {
          canOnePointMove = false
        })
      }
    },
    touchend: function (e) {
      const touchEnd = e.changedTouches[0].pageX
      if (touchDot === touchEnd && canOnePointMove) {
        this.triggerEvent('hideViewer')
        clearInterval(interval)
        time = 0
        return
      }
      const imgUrlLength = this.data.imgUrls.length
      console.log(canOnePointMove, 'canOnePointMove')
      if (imgUrlLength > 1 && canOnePointMove) {
        console.log(time, 'time < 3', touchMove - touchDot, 'touchMove - touchDot')
        if (time < 2 && touchMove - touchDot >= 40 && this.data.imgIndex > 0) {
          console.log('右滑')
          this.triggerEvent('changeImg', {
            change: false // false为 下一张
          })
          this.setData({
            left: 375,
            top: 760,
            width: 0,
            height: 0
          })
          clearInterval(interval)
          time = 0
        }
        if (time < 2 && touchMove - touchDot <= -40 && +this.data.imgIndex + 1 < this.data.imgUrls.length) {
          console.log('左滑')
          this.triggerEvent('changeImg', {
            change: true // true左滑，上一张
          })
          this.setData({
            left: 375,
            top: 760,
            width: 0,
            height: 0
          })
          clearInterval(interval)
          time = 0
        }
      }
      clearInterval(interval) // 清除setInterval
      time = 0
    },
    // htouchmove(e) {
    //   console.log('横向的移动', e);
    // },
    // vtouchmove(e) {
    //   console.log('纵向的移动时触发', e);
    // }
  }
})
