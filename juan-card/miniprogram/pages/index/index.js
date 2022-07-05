Page({
  data: {
    // tips: "记得打卡哦~",
    // checkName: "立即打卡",
    member: null,
    record: null,
    isAdmin: false,
  },

  onShow: function (e) {
    this.init();
  },

  init: async function (e) {
    // this.clearStorage();

    wx.showLoading();

    // 读取缓存中的数据，减少用户等待时间
    // let storageList = wx.batchGetStorageSync(["member", "record"]);
    // if (storageList) {
    this.setData({
      member: wx.getStorageSync("member"),
      record: wx.getStorageSync("record"),
    });
    // }

    wx.hideLoading();

    // 读取实时数据
    await this.getRecord();
    this.setData({
      member: await getApp().getMember(),
    });
    this.isAdmin(this.data.member, this.data.record);
  },

  getRecord: async function (e) {
    try {
      // 查询活动详情
      let res = await wx.cloud.callFunction({
        name: "fun",
        data: {
          type: "getRecord",
        },
      });
      let record = res.result.data[0];

      // 格式化日期: 2022年07月06日 - 08月06日
      const startDate = new Date(record.startDate);
      const endDate = new Date(record.endDate);
      let _strDateRange = `${startDate.getFullYear()}年${
        startDate.getMonth() + 1
      }月${startDate.getDate()}日 - ${
        endDate.getMonth() + 1
      }月${endDate.getDate()}`;
      record._strDateRange = _strDateRange;

      // 计算活动状态
      const now = Date.now();
      const start = startDate.getTime();
      const end = endDate.getTime();
      console.log("now", now, "start", start, "end", end);
      let _status;
      if (now < start) {
        _status = "即将开始";
      } else if (now > end) {
        _status = "已结束";
      } else {
        _status = "进行中";
      }
      record._status = _status;

      // 写入 Data 和本地缓存
      this.setData({
        record,
      });
      wx.setStorageSync("record", record);
    } catch (error) {
      console.error("getRecord.error".error);
    } finally {
      console.log("record", this.data.record);
    }
  },

  isAdmin: function (member, record) {
    let isAdmin =
      record.leader?.indexOf(member.openid) > -1 ||
      this.member.role.indexOf("admin") !== -1;
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
});
