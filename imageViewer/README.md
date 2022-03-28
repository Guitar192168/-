## json 文件

`"imageViewer":"../../components/imageViewer/imageViewer"`

## wxml

  <view>
    <imageViewer imgUrl="{{imgUrl}}" imgUrls="{{imgUrls}}" imgSort="{{imgSort}}" onShow="{{onShow}}" imgName="{{imgName}}" onClass="{{onClass}}" bind:hideViewer="hideQRCode" bind:changeImg="changeImg"></imageViewer>
  </view>

## js 文件

`imgUrl: '', // 当前正在预览的图片 imgUrls: '', // 当前正在预览的图片集合 imgSort: '', // 当前图片的位置 如：3/5 imgName: '', // 图片名称 imgNames: [], // 图片名称集合 imgIndex: '', // 图片索引 onShow: false, onClass: true,`

### methods:

    ```hideQRCode() {
      this.setData({
        onShow: false,
        onClass: !this.data.onClass
      })
    },
    showImg(e) {
      console.log(e)
      const urls = e.detail.urls
      const imgIndex = e.detail.index
      const isShow = e.detail.isShow
      const imgName = e.detail.names[imgIndex]
      this.setData({
        imgUrl: urls[imgIndex],
        imgUrls: urls,
        imgSort: imgIndex + 1 + '' + '/' + urls.length + '',
        onShow: isShow,
        imgName: imgName,
        imgNames: e.detail.names,
        imgIndex,
        onClass: true // 调整蒙层
      })
    },
    changeImg(e) {
      const urls = this.data.imgUrls
      let imgIndex = this.data.imgIndex
      const change = e.detail.change
      if (change) {
        if (imgIndex + 1 < urls.length) {
          imgIndex = +imgIndex + 1
        }
      } else {
        if (imgIndex - 1 > -1) {
          imgIndex = +imgIndex - 1
        }
      }
      this.setData({
        imgUrl: urls[imgIndex],
        imgSort: imgIndex + 1 + '' + '/' + urls.length + '',
        onShow: true,
        imgIndex,
        imgName: this.data.imgNames[imgIndex],
        onClass: true // 调整蒙层
      })
    }```
