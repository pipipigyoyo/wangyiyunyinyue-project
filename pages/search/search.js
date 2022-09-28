// pages/search/search.js
import request from '../../util/request/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderWord: '',
    hotList: [],
    keyWord: '',
    searchList: [],
    historyList: []
  },
  async getPlaceholderWordAndHotlist() {
    let getPlaceholderWord = await request('/search/default')
    let getHotlist = await request('/search/hot/detail')
    this.setData({
      placeholderWord: getPlaceholderWord.data.realkeyword,
      hotList: getHotlist.data
    })
  },

  getKeyWord(event) {
    this.setData({
      keyWord: event.detail.value.trim()
    })
    if (isSend) {
      clearTimeout(isSend)
    }
    isSend = setTimeout(() => {
      this.getKeyWordList()
    }, 300)
  },
  async getKeyWordList() {
    if (!this.data.keyWord) {
      this.setData({
        searchList: []
      })
      return
    }
    let { historyList, keyWord } = this.data
    let KeyWordList = await request('/search', { keywords: keyWord, limit: 10 })
    if (historyList.indexOf(keyWord) !== -1) {
      historyList.splice(historyList.findIndex(item => item === keyWord), 1)
    }
    historyList.unshift(keyWord)
    wx.setStorageSync('keyWord', historyList)
    this.setData({
      searchList: KeyWordList.result.songs,
      historyList
    })
  },
  deleteAll() {
    wx.showModal({
      content: '确定删除历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: []
          })
          wx.removeStorageSync(
            'keyWord'
          )
        }
      }
    })

  },
  clearKeyWord() {

    this.setData({
      keyWord: '',
      searchList: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPlaceholderWordAndHotlist()
    if (wx.getStorageSync('keyWord')) {
      this.setData({
        historyList: wx.getStorageSync('keyWord')
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