Page({
  data: {
    tips: "记得打卡哦~",
    checkName: "立即打卡",
    member: null,
    record: null,
    isAmin: false,
  },

  onShow: function (e) {
    this.init();
  },

  init: async function (e) {
    this.setData({
      member: await getApp().getMember(),
    });
    // await this.getRecord();
    // this.isAdmin(this.data.member.openid, this.data.record);
  },

  getRecord: async function (e) {
    try {
      let res = await wx.cloud.callFunction({
        name: "fun",
        data: {
          type: "getRecord",
        },
      });
      this.setData({
        record: res.result.data[0],
      });
    } catch (error) {
      console.log("getRecord.error".error);
    } finally {
      console.log("record", this.data.record);
    }
  },

  isAdmin: function (openid, record) {
    let isAdmin = record.leader?.indexOf(openid) > -1;
    console.log("isAdmin", isAdmin);
    this.setData({
      isAdmin,
    });
  },

  clearStorage: function () {
    wx.clearStorage();
    wx.showToast({
      title: "清除缓存成功",
    });
  },

  login: function () {
    // wx.login().then((res) => {
    //   console.log(res);
    //   wx.cloud.callFunction({
    //     name: "fun",
    //     data: {
    //       type: "login",
    //       data: {
    //         code: res.code,
    //       },
    //     },
    //   }).then(console.log);
    //   // this.init();
    // });
    wx.getSetting().then(console.log)
    wx.authorize({
      scope: "scope.camera",
    }).then(console.log);
  },
});
