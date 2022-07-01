exports.main = async (event, context, cloud, db) => {
  console.log("member.get:", event);

  // 获取用户 OpenId
  const openid = cloud.getWXContext().OPENID;
  console.log(openid);

  // 查询
  let member = await db.collection("member").doc(openid).get();
  if (member.data) {
    return member.data; // 已有用户信息，直接返回
  }

  // 新用户，初始化用户信息
  let form = {
    _id: openid,
    openid,
    name: "",
    avatar: "",
    created: db.serverDate(),
    status: "enable",
    credit: 0,
    role: [],
  };

  // 创建
  await db.collection("member").add({
    data: form,
  });
  return form;
};
