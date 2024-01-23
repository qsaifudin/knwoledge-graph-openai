import { Nodes, Edges } from "v-network-graph";

const nodes: Nodes = {
  node0: { name: "N0" },
  node1: { name: "N1" },
  node2: { name: "N2" },
  node3: { name: "N3" },
  node4: { name: "N4" },
  node5: { name: "N5" },
  node6: { name: "N6" },
  node7: { name: "N7" },
  node8: { name: "N8" },
  node9: { name: "N9" },
  node10: { name: "N10" },
  node11: { name: "N11" },
  node12: { name: "N12" },
  node13: { name: "N13" },
  node14: { name: "N14" },
  node15: { name: "N15" },
};

const edges: Edges = {
  "edge0-4": { source: "node0", target: "node4",label: "1 Gbps" },
  "edge4-0": { source: "node4", target: "node0",label: "22 Gbps" },
  "edge1-0": { source: "node1", target: "node0",label: "1 Gbps" },
  "edge2-0": { source: "node2", target: "node0",label: "1 Gbps" },
  "edge3-0": { source: "node3", target: "node0",label: "1 Gbps" },
  "edge4-8": { source: "node4", target: "node8" },
  "edge5-4": { source: "node5", target: "node4" },
  "edge6-4": { source: "node6", target: "node4" },
  "edge7-4": { source: "node7", target: "node4" },
  "edge8-12": { source: "node8", target: "node12" },
  "edge9-8": { source: "node9", target: "node8" },
  "edge10-8": { source: "node10", target: "node8" },
  "edge11-8": { source: "node11", target: "node8" },
  "edge12-0": { source: "node12", target: "node0" },
  "edge13-12": { source: "node13", target: "node12" },
  "edge14-12": { source: "node14", target: "node12" },
  "edge15-12": { source: "node15", target: "node12" },
};

export default { nodes, edges };
