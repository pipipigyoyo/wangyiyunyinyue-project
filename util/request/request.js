import config from './config'
export default (url, data = {}, methods = 'get') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            data,
            methods,
            header: {
                cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item =>
                    item.indexOf('MUSIC_U') !== -1
                ) : ''
            },
            success: (res) => {
                console.log('请求成功', res);
                if (data.isLogin) {
                    wx.setStorageSync('cookies', res.cookies)
                }
                resolve(res.data)
            },
            file: (err) => {
                console.log('请求失败', err);
                reject(err)
            }
        })
    })
}