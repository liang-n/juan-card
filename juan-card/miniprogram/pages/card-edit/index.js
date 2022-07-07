// pages/card-edit/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recordId: null,
    desc: "",
  },

  /**提交表单 */
  submit: async function () {
    wx.cloud.callFunction({
      name: "fun",
      data: {
        type: "createCard",
        data: {
          desc: this.data.desc,
          recordId: this.data.recordId,
        },
      },
      success: (res) => {
        if (res.result && res.result.status === "error") {
          wx.showToast({
            title: res.result.message,
            icon: "error",
          });
        } else {
          wx.showToast({
            title: "提交成功",
            icon: "success",
            duration: 2000,
          });
        }
      },
      fail: console.error,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    if (options.recordId) {
      this.setData({
        recordId: options.recordId,
      });
    } else {
      await wx.showModal({
        title: "异常",
        content: "发生了一点错误，请返回重试",
        showCancel: false,
      });
      await wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
