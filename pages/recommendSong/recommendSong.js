// pages/recommendSong/recommenSong.js
import request from '../../util/request/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: '',
    day: '',
    recommendSongList: [],
    index: ''

  },
  async getRecommendSongList() {
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success() {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    } else {
      let recommendSongList = await request('/recommend/songs')
      this.setData({
        recommendSongList: recommendSongList.data.dailySongs
      })
    }
  },
  toSongDetail(event) {

    let { index } = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail',
      success: function (res) {
        res.eventChannel.emit('getId', event.currentTarget.dataset.item.id)
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    })

    this.getRecommendSongList()

    PubSub.subscribe('getIndex', (msg, data) => {
      let { index, recommendSongList } = this.data
      if (data === 'pre') {
        let musicId = recommendSongList[--index < 0 ? recommendSongList.length - 1 : index].id
        PubSub.publish('getId', musicId)
        this.setData({
          index: index < 0 ? recommendSongList.length - 1 : index
        })
      } else {
        let musicId = recommendSongList[++index > recommendSongList.length - 1 ? 0 : index].id
        PubSub.publish('getId', musicId)
        this.setData({
          index: index > recommendSongList.length - 1 ? 0 : index
        })
      }
    });

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