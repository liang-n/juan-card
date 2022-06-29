const cloud = require("wx-server-sdk");

const getOpenId = require("./getOpenId/index");

const createRecord = require("./record/create.js");
const getRecord = require("./record/get.js");
const updateRecord = require("./record/update.js");
const removeRecord = require("./record/remove.js");

const createMember = require("./member/create.js");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    // 工具函数
    case "getOpenId":
      return await getOpenId.main(event, context, cloud);

    // record 活动记录
    case "createRecord":
      return await createRecord.main(event, context, cloud, db);
    case "getRecord":
      return await getRecord.main(event, context, cloud, db);
    case "updateRecord":
      return await updateRecord.main(event, context, cloud, db);
    case "removeRecord":
      return await removeRecord.main(event, context, cloud, db);

    // member 用户信息
    case "createMember":
      return await createMember.main(event, context, cloud, db);
  }
};
