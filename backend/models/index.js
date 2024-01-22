var neo4j = require("neo4j-driver");

exports.syncDB = async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = "neo4j+s://f98a92b5.databases.neo4j.io";
  const USER = "neo4j";
  const PASSWORD = "1UOfVjDrHsJhwauUPmTyCKYK0gb1L9NzTEb4qCnHPAM";
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    // const serverInfo = await driver.getServerInfo();
    // console.log("Connection established");
    // console.log(serverInfo);

    // const { records, summary, keys } =
    //   await driver.executeQuery(
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

    return driver;
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  }
};
