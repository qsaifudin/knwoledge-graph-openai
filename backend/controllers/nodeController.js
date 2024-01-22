const axios = require("axios");
const neo4j = require("neo4j-driver");

const URI = "neo4j+s://f98a92b5.databases.neo4j.io";
const USER = "neo4j";
const PASSWORD = "1UOfVjDrHsJhwauUPmTyCKYK0gb1L9NzTEb4qCnHPAM";

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
const session = driver.session();

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
    const response = await axios.post("http://localhost:3000/api/query", {
      query: req.body.query,
    });

    let content = response.data.response.content;
    // let escapedString = content
    let escapedString = content.replace(/'/g, "\\'");

    introQuery =
      "Translate the following information into a Cypher query for a Neo4j graph database: ";
    concatQuery = introQuery + escapedString;
    const responseCypherQuery = await axios.post(
      "http://localhost:3000/api/query",
      {
        query: concatQuery,
      }
    );

    dataStore = responseCypherQuery.data.response.content;
    const result = await session.run(dataStore);
    // res.json(responseCypherQuery.data);
    res.json({ introQuery, dataStore });
  } catch (error) {
    res
      .status(500)
      .json({
        error: error.message,
        concatQuery: concatQuery,
        dataStore: dataStore,
      });
  }
};

function formatResponsetoGraph(input) {
  const nodes = [];
  const edges = [];

  input.records.forEach((record) => {
    const node = record._fields[0];
    const relationship = record._fields[1];
    const targetNode = record._fields[2];

    if (node) {
      const nodeKey = `${node.identity.low}.${node.identity.high}`;
      const nodeAttributes = {
        label: node.labels[0],
        name: node.properties.name,
        // Add more properties as needed
      };
      nodes.push({
        key: nodeKey,
        attributes: nodeAttributes,
      });
    }

    if (relationship) {
      const edgeKey = `${relationship.identity.low}.${relationship.identity.high}`;
      const sourceNodeKey = `${node.identity.low}.${node.identity.high}`;
      const targetNodeKey = `${targetNode.identity.low}.${targetNode.identity.high}`;
      const edgeAttributes = {
        size: 1, // Add more properties as needed
      };
      edges.push({
        key: edgeKey,
        source: sourceNodeKey,
        target: targetNodeKey,
        attributes: edgeAttributes,
      });
    }
  });

  return {
    nodes,
    edges,
  };
}

function formatResponse(input) {
  const nodes = {};
  const edges = {};

  input.records.forEach((record) => {
    const node = record._fields[0];
    const relationship = record._fields[1];
    const targetNode = record._fields[2];

    if (node) {
      const nodeId = `node${node.identity.low}`;
      nodes[nodeId] = { name: node.properties.name, labels: node.labels };
    }

    if (relationship) {
      const edgeId = `edge${relationship.identity.low}`;
      const sourceNodeId = `node${node.identity.low}`;
      const targetNodeId = `node${targetNode.identity.low}`;
      edges[edgeId] = {
        source: sourceNodeId,
        target: targetNodeId,
        type: relationship.type,
        properties: relationship.properties,
      };
    }
  });

  return { nodes, edges };
}

exports.getAllNodes = async (req, res) => {
  try {
    const result = await session.run(`MATCH (n)
    OPTIONAL MATCH (n)-[r]->(m)
    RETURN n, r, m`);
    // let nodes = result.records.map(record => record.get('n').properties);
    let nodes = formatResponsetoGraph(result);
    let  = formatResponse(result);
    // res.json(result);
    res.json(nodes);
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
