// pages/video/video.js
import request from '../../util/request/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    tagId: '',
    videoGroupList: [],
    videoId: '',
    urlInfo: {},
    currentPlay: [],
    isShowRefresher: false,
    scrollToBottomIndix: 0
  },
  async getVideoGroupList() {
    let videoGroupListInfo = await request('/video/group/list')
    let videoList = videoGroupListInfo.data.slice(0, 14)
    this.setData({
      videoList,
      tagId: videoGroupListInfo.data[0].id
    })
    this.getVideoGroup(this.data.tagId)
  },
  async getVideoGroup(tagId) {
    let index = 0
    let videoGroup = await request('/video/group', { id: tagId })
    wx.hideLoading()
    let videoGroupList = videoGroup.datas.map(item => {
      item.index = index++
      return item
    })
    this.setData({
      videoGroupList,
      isShowRefresher: false
    })
    /* this.getVideo() */
  },
  /* async getVideo() {
   let videoGroupList = this.data.videoGroupList
   for (let i = 0; i <= videoGroupList.length - 1; i++) {
     let video = await request('/video/url', { id: videoGroupList[i].data.vid })
     console.log(video);
     this.data.videoGroupList[i].data.urlInfo = video.urls[0]
   }
 },  */
  handleId(event) {
    let tagId = event.currentTarget.dataset.id
    this.setData({
      tagId,
      videoGroupList: [],
      scrollToBottomIndix: 0
    })
    wx.showLoading({
      title: 'loading'
    })
    this.getVideoGroup(this.data.tagId)
  },
  async handlePlay(event) {
    this.setData({
      videoId: event.currentTarget.id
    })
    let video = await request('/video/url', { id: this.data.videoId })
    this.setData({
      urlInfo: video.urls[0]
    })


    let vid = event.currentTarget.id;
    this.videoContext = wx.createVideoContext(vid);
    let { currentPlay } = this.data;
    let videoItem = currentPlay.find(item => item.vid === vid);
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    }
  },
  handleTimeUpdate(event) {
    let videoTimeObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime };
    let { currentPlay } = this.data;

    let videoItem = currentPlay.find(item => item.vid === videoTimeObj.vid);
    if (videoItem) {
      if (videoTimeObj.currentTime > videoItem.currentTime) { videoItem.currentTime = videoTimeObj.currentTime; }//神来之笔
    } else {
      currentPlay.push(videoTimeObj);
    }
    this.setData({
      currentPlay
    })
  },
  handleEnded(event) {
    let { currentPlay } = this.data;
    currentPlay.splice(currentPlay.findIndex(item => item.vid === event.currentTarget.id), 1);
    this.setData({
      currentPlay
    })
  },
  refresher() {
    this.getVideoGroup(this.data.tagId)
  },
  async scrollToBottom() {
    let { videoGroupList, tagId, scrollToBottomIndix } = this.data

    let newVideoGroup = await request('/video/group', { id: tagId, offset: ++scrollToBottomIndix })
    videoGroupList.push(...newVideoGroup.datas)
    this.setData({
      videoGroupList,
      scrollToBottomIndix
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupList()
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