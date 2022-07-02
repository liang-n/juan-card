// app.js
App({
  globalData: {},

  onLaunch: function () {
    this.initCloud();
    this.updateProgram();
  },

  initCloud: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }
  },

  updateProgram: function () {
    // 立即更新版本,详见文档: https:/developers.weixin.qg.com/miniprogram/dev/framework/runtime,/update-mechanism.html
    let updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {});
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好,是否重启应用？",
        // showCancel: true,
        success: (result) => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });
  },

  getMember: async function () {
    // 从缓存中获取上次查询用户信息的时间，校验是否超过10小时
    let member = wx.getStorageSync("member");
    let last = wx.getStorageSync("getMemberTime");
    let now = Date.now();

    if (last && now - last < 1000 * 60 * 60 * 10 && member) {
      console.log("localMember", member);
      return member; // 终止执行函数
    }

    // 从数据库中查询用户信息
    try {
      let res = await wx.cloud.callFunction({
        name: "fun",
        data: {
          type: "getMember",
        },
      });
      // 设置/更新本地缓存
      wx.setStorageSync("member", res.result);
      wx.setStorageSync("getMemberTime", now);
      console.log("funMember", res.result);
      return res.result; // 返回
    } catch (error) {
      console.log("getMember.error", error);
    }
  },
});
