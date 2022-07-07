exports.main = async (event, context, cloud, db) => {
  console.log("record.get:", event);

  // 查询
  await db
    .collection("record")
    .get()
    .then((res) => {
      return res;
    });
};
