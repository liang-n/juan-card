exports.main = async (event, context, cloud, db) => {
  console.log("record.update:", event);

  // 更新
  let form = event.data;
  let res = await db.collection("record").update({
    data: { ...form },
  });
  console.log(res);
  return res;
};
