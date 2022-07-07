/**
 * 1. 校验：
 *    - 查询活动详情，校验 status、endDate 字段判断活动是否有效
 *    - 每天只能打一次卡
 * 2. 获取并保存 openid 字段
 * 3. 查询 member 冗余 nickename、avatar 字段（修改用户信息时更新此字段）
 * 4. 创建打卡记录
 */
exports.main = async (event, context, cloud, db) => {
  console.log("card.create.event:", event);
  try {
    // 获取 openid
    const openid = cloud.getWXContext().OPENID;

    // 查询活动详情
    let getRecord = await db
      .collection("record")
      .doc(event.data.recordId)
      .get();
    let record = getRecord.data;
    // 校验活动有效性
    const now = Date.now();
    const start = new Date(record.startDate).getTime();
    const end = new Date(record.endDate).getTime();
    if (record.status !== "enable") {
      return { status: "error", message: "活动未开启" };
    } else if (now < start) {
      return { status: "error", message: "活动未开始" };
    } else if (now > end) {
      return { status: "error", message: "活动已结束" };
    }

    // 查询打卡记录，校验是否重复打卡
    const _ = db.command;
    const zeroTime = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
    const endTime = new Date(
      new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
    ); //获取当天23:59:59的时间
    let getCard = await db
      .collection("card")
      .where({
        checkDate: _.gte(zeroTime).lte(endTime),
      })
      .get();
    console.log("getCard", getCard);
    if (getCard.data.length) {
      return { status: "error", message: "请不要重复打卡" };
    }

    // 查询用户信息
    let getMember = await db.collection("member").doc(openid).get();
    let member = getMember.data;

    // 构造对象并创建
    let form = {
      ...event.data,
      openid,
      avatar: member.avatar,
      nickname: member.name,
      like: 0,
      checkDate: db.serverDate(),
      SubmitTime: db.serverDate(),
      lastTime: db.serverDate(),
    };
    let res = await db.collection("card").add({
      data: form,
    });
    console.log("card.create.event:", event);
    return res;
  } catch (error) {
    console.error(error);
  }
};
