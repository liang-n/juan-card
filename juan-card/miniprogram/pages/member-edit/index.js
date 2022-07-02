Page({
  data: {},

  onLoad(options) {
    this.init();
  },

  init: async function (e) {
    await this.getMember();
  },

  getMember: async function () {
    wx.removeStorageSync("member");
    this.setData({
      ...this.data,
      ...(await getApp().getMember()),
    });
  },
});
