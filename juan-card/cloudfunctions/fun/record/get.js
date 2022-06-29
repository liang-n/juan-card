exports.main = async (event, context, cloud, db) => {
  console.log("record.get:", event);

  // 查询
  let res = await db.collection("record").get();
  return res;
};
