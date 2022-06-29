exports.main = async (event, context, cloud, db) => {
  console.log("record.create:", event);

  // 获取用户 OpenId
  const openid = cloud.getWXContext().OPENID;

  // 创建
  let form = event.data;
  await db
    .collection("record")
    .add({
      data: {
        ...form,
        leader: [openid],
        status: "enable",
      },
    })
    .then((res) => {
      console.log(res);
    });
};
