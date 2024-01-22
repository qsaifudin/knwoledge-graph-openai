module.exports= async (db) => {
  console.log("🚀 ~ module.exports= ~ db:", db)
  const { records, summary, keys } = await db.driver.executeQuery(
    "MATCH (n:Person) RETURN n.name as name",
    { database: "neo4j" }
  );
  }