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
    let member = await getApp().getMember();
    this.setData({
      ...this.data,
      ...member,
    });
  },

  onChooseAvatar(e) {
    const avatar = e.detail.avatarUrl;
    this.setData({
      avatar,
    });
  },

  submit: function () {
    wx.cloud
      .callFunction({
        name: "fun",
        data: {
          type: "updateMember",
          data: this.data,
        },
      })
      .then(console.log);
  },
});
