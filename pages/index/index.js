// pages/index/index.js
import request from '../../util/request/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommendList: [],
    topList: [],

  },
  toRecommend() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let topListId = []
    let getTopListId = await request('/toplist')
    let topListIdArr = getTopListId.list.slice(0, 4)
    for (let i = 0; i <= topListIdArr.length - 1; i++) {
      let id = topListIdArr[i].id
      topListId.push(id)
    }

    let getBannerList = await request('/banner', { type: 2 },)
    if (getBannerList.code === 200) {
      this.setData({
        banners: getBannerList.banners
      })
    }

    let getRecommendList = await request('/personalized', { limit: 20 },)
    if (getRecommendList.code === 200) {
      this.setData({
        recommendList: getRecommendList.result
      })

    }

    let topListArr = []
    for (let i = 0; i <= 3; i++) {
      let getTopList = await request('/playlist/detail', { id: topListId[i] })
      let arr = {
        name: getTopList.playlist.name,
        topListInfo: getTopList.playlist.tracks.slice(0, 3),
        id: getTopList.playlist.id
      }
      topListArr.push(arr)
      this.setData({
        topList: topListArr
      })
    }



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})