// pages/songDetail/songDetail.js
import request from '../../util/request/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPaly: false,
    song: {},
    musicId: '',
    musicLink: '',
    finalTime: '',
    currentTime: '00:00',
    currentPmgressBar: 0
  },
  handleMusicPlay() {
    let { musicId, musicLink } = this.data
    this.setData({
      isPaly: !this.data.isPaly
    })
    /* PubSub.subscribe('getId', (msg, nextId) => {
      console.log(nextId);
    })
    PubSub.publish('getIndex', 'next') */
    this.playOrPauseMusic(this.data.isPaly, musicId, musicLink)
  },
  async playOrPauseMusic(isPaly, musicId, musicLink) {
    if (isPaly) {
      if (!musicLink) {
        let musicUrl = await request('/song/url', { id: musicId })
        musicLink = musicUrl.data[0].url
        this.setData({
          musicLink
        })
      }
      this.BackgroundAudioManager.src = musicLink
      this.BackgroundAudioManager.title = this.data.song.name
    } else {
      this.BackgroundAudioManager.pause()
    }
  },
  async getSongInfo(id) {
    this.setData({
      musicId: id
    })
    let song = await request('/song/detail', { ids: id })
    let finalTime = moment(song.songs[0].dt).format('mm:ss')
    this.setData({
      song: song.songs[0],
      finalTime
    })
    wx.setNavigationBarTitle({
      title: song.songs[0].name
    })
  },
  changeIsPlay(isPaly) {
    this.setData({
      isPaly
    });
    this.appInstance.globalData.isMusicPlay = isPaly
  },
  handlePreOrNext(event) {
    PubSub.subscribe('getId', (msg, musicId) => {
      this.BackgroundAudioManager.stop()
      this.getSongInfo(musicId)
      this.playOrPauseMusic(true, musicId)
      PubSub.unsubscribe('getId');
    });
    if (event.currentTarget.id === 'pre') {
      PubSub.publish('getIndex', 'pre');
    } else {
      PubSub.publish('getIndex', 'next')
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getId', (id) => {
      this.getSongInfo(id)
    })

    this.appInstance = getApp()
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()

    if (this.appInstance.globalData.isMusicPlay && this.appInstance.globalData.musicId === this.data.musicId) {
      this.setData({
        isPaly: true
      })
    } else {
      this.BackgroundAudioManager.pause()
    }

    this.BackgroundAudioManager.onPlay(() => {
      this.changeIsPlay(true)
      this.appInstance.globalData.musicId = this.data.musicId
    })
    this.BackgroundAudioManager.onPause(() => {
      this.changeIsPlay(false)

    })

    this.BackgroundAudioManager.onStop(() => {
      this.changeIsPlay(false)

    })
    this.BackgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentPmgressBar = this.BackgroundAudioManager.currentTime / this.BackgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentPmgressBar
      })
    })
    this.BackgroundAudioManager.onEnded(() => {
      PubSub.subscribe('getId', (msg, musicId) => {
        this.BackgroundAudioManager.stop()
        this.getSongInfo(musicId)
        this.playOrPauseMusic(true, musicId)
        PubSub.unsubscribe('getId');
      });
      PubSub.publish('getIndex', 'next')
      this.setData({
        currentPmgressBar: 0,
        currentTime: '00:00'
      })
    })



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