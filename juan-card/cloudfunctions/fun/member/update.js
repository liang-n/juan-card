exports.main = async (event, context, cloud, db) => {
  console.log("member.upadte:", event);

  // 获取用户 openid
  const openid = cloud.getWXContext().OPENID;
  console.log(openid);

  // 更新用户信息
  let form = event.data;
  db.collection("member")
    .doc(openid)
    .update({
      data: {
        avatar: form.avatar,
        name: form.name,
      },
    })
    .then((res) => {
      console.log("member.update.res", res);
      return res;
    });
};
