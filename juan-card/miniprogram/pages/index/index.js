Page({
  data: {
    tips: "记得打卡哦~",
    checkName: "立即打卡",
    record: {},
    openid: null,
    isAmin: false,
  },

  onShow: async function (e) {
    await this.getOpenId();
    await this.getRecord();
    // 我想要前两个返回执行结果之后再执行下面的函数
    this.isAdmin(this.data.openid, this.data.record);
  },

  getOpenId: async function () {
    let localOpenid = wx.getStorageSync("openid");
    console.log("localOpenid", localOpenid);
    if (localOpenid) {
      // 从本地缓存中获取 openid
      this.setData({ openid: localOpenid });
    } else {
      // 云函数获取 openid
      try {
        let res = wx.cloud.callFunction({
          name: "fun",
          data: {
            type: "getOpenId",
          },
        });
        let openid = res.result.openid;
        this.setData({ openid });
        // 本地缓存保存 openid
        wx.setStorageSync("openid", openid);
      } catch (error) {
        console.log("getOpenId.error", error);
      } finally {
        console.log("openid", this.data.openid);
      }
    }
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

  changeCheckName: function () {},

  changeTips: function () {},
});
