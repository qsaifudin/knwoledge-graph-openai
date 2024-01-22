require("dotenv").config();

const db = require("../models/index");

exports.get = async (req, res) => {
  console.log("🚀 ~ exports.get= ~ db:", db);
  // const { records, summary, keys } =
  //   await db.connectNeo4jAuraDb.driver.executeQuery(
  //     "MATCH (n:Person) RETURN n.name as name",
  //     { database: "neo4j" }
  //   );

  // // Summary information
  // console.log(
  //   `>> The query ${summary.query.text} ` +
  //     `returned ${records.length} records ` +
  //     `in ${summary.resultAvailableAfter} ms.`
  // );

  // for (let record of records) {
  //   console.log(record.get("name"));
  // }

  // res.json(records);
};
