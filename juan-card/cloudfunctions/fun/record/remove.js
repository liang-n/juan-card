exports.main = async (event, context, cloud, db) => {
  console.log("record.update:", event);

  // 删除
  let id = event.data;
  let res = await db.collection("record").doc(id).remove();
  console.log(res);
  return res;
};
