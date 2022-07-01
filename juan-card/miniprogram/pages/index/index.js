Page({
  data: {
    tips: "记得打卡哦~",
    checkName: "立即打卡",
    record: {},
    openid: null,
    isAmin: false,
    member: null,
  },

  onShow: function (e) {
    this.init();
  },

  init: async function (e) {
    await this.getMember();
    await this.getRecord();
    this.isAdmin(this.data.member.openid, this.data.record);
  },

  getMember: async function () {
    // 从缓存中获取上次查询用户信息的时间，校验是否超过10小时
    let member = wx.getStorageSync("member");
    let last = wx.getStorageSync("getMemberTime");
    let now = new Date();
    if (last && now - last < 1000 * 60 * 60 * 10 && member) {
      this.setData({ member });
      console.log("localMember", this.data.member);
      return; //终止执行函数
    }

    // 从数据库中查询用户信息
    try {
      let res = await wx.cloud.callFunction({
        name: "fun",
        data: {
          type: "getMember",
        },
      });
      this.setData({ member: res.result });

      // 设置/更新本地缓存
      wx.setStorageSync("member", member);
      wx.setStorageSync("getMemberTime", now);
    } catch (error) {
      console.log("getMember.error", error);
    } finally {
      console.log("member", this.data.member);
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
});
