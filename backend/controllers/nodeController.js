const axios = require("axios");
const neo4j = require("neo4j-driver");

const URI = "neo4j+s://f98a92b5.databases.neo4j.io";
const USER = "neo4j";
const PASSWORD = "1UOfVjDrHsJhwauUPmTyCKYK0gb1L9NzTEb4qCnHPAM";

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
const session = driver.session();
require('dotenv').config()

const PORT = process.env.PORT
const BASE_URL = `http://localhost:${PORT}`

// Controller functions for node operations
exports.createNode = async (req, res) => {
  try {
    const { label, properties } = req.body;
    const result = await session.run(
      `CREATE (n:${label} $properties) RETURN n`,
      { properties }
    );
    res.json(result.records[0].get("n").properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNodeFromQuery = async (req, res) => {
  let concatQuery;
  let dataStore;
  try {
    let content = req.body.query;
    // let escapedString = content
    let escapedString = content.replace(/'/g, "\\'");

    introQuery =
      "Translate the following information into a Cypher query for a Neo4j graph database: ";
    concatQuery = introQuery + escapedString;
    const responseCypherQuery = await axios.post(
      `${BASE_URL}/api/query`,
      {
        query: concatQuery,
      }
    );

    dataStore = responseCypherQuery.data.data;
    const result = await session.run(dataStore);
    // res.json(responseCypherQuery.data);
    res.json({ success: true, data: { concatQuery:concatQuery, dataStore:dataStore } });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      concatQuery: concatQuery,
      dataStore: dataStore,
    });
  }
};
exports.createNodeFromQueryfuLL = async (req, res) => {
  let concatQuery;
  let dataStore;
  try {
    const response = await axios.post(`${BASE_URL}/api/query`, {
      query: req.body.query,
    });

    let content = response.data.data;
    // let escapedString = content
    let escapedString = content.replace(/'/g, "\\'");

    introQuery =
      "Translate the following information into a Cypher query for a Neo4j graph database: ";
    concatQuery = introQuery + escapedString;
    const responseCypherQuery = await axios.post(
      `${BASE_URL}/api/query`,
      {
        query: concatQuery,
      }
    );

    dataStore = responseCypherQuery.data.data;
    const result = await session.run(dataStore);
    // res.json(responseCypherQuery.data);
    res.json({ success: true, data: { concatQuery:concatQuery, dataStore:dataStore } });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      concatQuery: concatQuery,
      dataStore: dataStore,
    });
  }
};

function convertData(inputData) {
  const result = {
    nodes: {},
    edges: {},
  };

  inputData.forEach((data) => {
    const nodeElements = data._fields.filter(
      (field) =>
        field &&
        field.labels &&
        (field.labels.includes("Tree") ||
          field.labels.includes("Squirrel") ||
          field.labels.includes("Forest"))
    );

    data._fields.forEach((field, index) => {
      if (field && field.identity && field.labels) {
        const nodeId = `node${field.identity.low}`;
        const nodeName =
          field.properties && field.properties.name
            ? field.properties.name
            : `N${field.identity.low}`;

        if (!result.nodes[nodeId]) {
          result.nodes[nodeId] = { name: nodeName };
        }
      }
    });

    for (let i = 1; i < data._fields.length; i++) {
      const field = data._fields[i];

      if (
        field &&
        field.startNodeElementId &&
        field.endNodeElementId &&
        field.type
      ) {
        const sourceId = `node${field.startNodeElementId.split(":").pop()}`;
        const targetId = `node${field.endNodeElementId.split(":").pop()}`;
        const edgeLabel = field.type;

        const edgeId = `edge${field.startNodeElementId}:${field.endNodeElementId}:${field.type}`;

        if (!result.edges[edgeId]) {
          result.edges[edgeId] = {
            source: sourceId,
            target: targetId,
            label: edgeLabel,
          };
        }
      }
    }
  });

  return result;
}

exports.getAllNodes = async (req, res) => {
  try {
    const result = await session.run(`MATCH (n)
    OPTIONAL MATCH (n)-[r]->(m)
    RETURN n, r, m`);
    // let nodes = result.records.map(record => record.get('n').properties);
    // let nodes = convertResponse(result);
    let nodes = convertData(result.records);
    // let nodes = result;
    res.json({ success: true, data: nodes });
  } catch (error) {
    console.log("🚀 ~ exports.getAllNodes= ~ error:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getNodesByLabel = async (req, res) => {
  try {
    const { label } = req.params;
    const result = await session.run(`MATCH (n:${label}) RETURN n`);
    let nodes = result.records.map((record) => record.get("n").properties);

    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNode = async (req, res) => {
  try {
    const nodeId = req.params.id;
    const updatedProperties = req.body.properties;

    const result = await session.run(
      `MATCH (n) WHERE ID(n) = $nodeId SET n += $updatedProperties RETURN n`,
      { nodeId: parseInt(nodeId), updatedProperties }
    );
    res.json(result.records[0].get("n").properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNode = async (req, res) => {
  try {
    const nodeId = req.params.id;
    await session.run(`MATCH (n) WHERE ID(n) = $nodeId DELETE n`, {
      nodeId: parseInt(nodeId),
    });
    res.json({ message: "Node deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteAllNode = async (req, res) => {
  try {
    await session.run("MATCH (n) DETACH DELETE n");
    res.json({ message: "All Node deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
