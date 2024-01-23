<template>
  <NuxtLoadingIndicator />
  <v-app dark>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-btn class="ml-12">
        <NuxtLink class="" to="https://qsaifudin.site/" target="_blank" style="color: white; text-decoration: none;">
          <v-toolbar-title >
            <h3 style="font-size: 30px;">👉<span class="animate-text">Saifudin</span> </h3>
          </v-toolbar-title>
        </NuxtLink>
      </v-btn>


    </v-app-bar>
    <v-main>
      <v-container>
        <div>

          <div class="">
            <v-row justify="center" align="start">
              <v-col cols="12" sm="8" md="8">
                <v-card>
                  <v-card-title class="headline">
                    Saif Knowledge Graph App
                  </v-card-title>
                  <v-card-text>
                    <div class="mb-2">
                      <b>
                        Your query answer here:
                      </b>
                    </div>
                    <div v-if="showFullContent" style="white-space: pre-line;" v-html="responseData">
                    </div>
                    <div v-else style="white-space: pre-line;" v-html="truncatedData">
                    </div>
                    <v-btn size="x-small" v-if="shouldShowButton" @click="toggleShowMore" variant="text">
                      {{ showFullContent ? 'Show Less' : 'Show More' }}
                    </v-btn>

                    <v-divider class="mt-2"></v-divider>
                    <h3 class="mt-4">Database Graph</h3>
                    <div class="mt-2 ">
                      <div class="">

                      </div>
                      The following is a display of the knowledge graph comprising all nodes stored in the database.
                      <v-btn color="red" size="x-small" @click="deleteAllNode" variant="text">
                        Delete All Nodes
                      </v-btn>
                      <div class="" v-if="!successInputNode">
                        <v-alert border="start" border-color="deep-orange accent-4" elevation="2">
                          Failed to visualize new query on the knowledge graph.
                          <v-btn color="primary" size="x-small" @click="inputQueryToGrah" variant="text">
                            Try Again
                          </v-btn>
                        </v-alert>

                      </div>
                    </div>
                    <v-progress-linear indeterminate :active="loadingGraph"></v-progress-linear>
                    <div class="mt-2" style="background-color: white; overflow: hidden; position: relative;">
                      <v-network-graph style="height:400px" :zoom-level="0.5" :nodes="nodesGraph" :edges="edgesGraph"
                        :configs="configs">
                        <template #edge-label="{ edge, ...slotProps }">
                          <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
                        </template>
                      </v-network-graph>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="8" md="4">
                <v-card>
                  <v-card-title class="headline">
                    Query
                  </v-card-title>

                  <v-card-text>
                    <v-form v-model="valid" ref="emailForm" @submit.prevent="submitQuery">
                      <v-textarea   @click:clear="query = ''" v-model="query" label="Query" outlined clearable required
                        :rules="rules"></v-textarea>
                    </v-form>
                    <v-spacer></v-spacer>
                    <v-btn block class="mt-2" color="primary" @click="submitQuery" :loading="loadingBtn"
                      :disabled="!valid || !query.trim()">
                      OK
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup lang="ts">

import type { Nodes, Edges } from "v-network-graph";
import { reactive, ref, onMounted, watch } from 'vue';
import * as vNG from "v-network-graph"
import {
  ForceLayout,
  type ForceNodeDatum,
  type ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
import { useToast } from "vue-toastification";
const toast = useToast();

import dataJson from './data.json';
// import dataNodes from "./data2"
let nodesGraph: Nodes = {}
let edgesGraph: Edges = {}

const clipped = ref(false);

const query = ref('');
const valid = ref(true);
const rules = [(v: any) => !!v || 'Query is required'];
const responseData = ref('');

const nodeCount = ref(20)
const nodes = ref({});
const edges = ref({});
const loadingBtn = ref(false);
const loadingGraph = ref(false);

const responseTruncated = ref(false);
const showFullContent = ref(false);
const maxWordCount = 100;

let successInputNode = ref(true)
const queryResponse = ''

const truncatedData = computed(() => {
  const words = responseData.value.split(' ');
  if (words.length > maxWordCount) {
    return words.slice(0, maxWordCount).join(' ') + '...';
  }
  return responseData.value;
});

const shouldShowButton = computed(() => {
  return responseData.value.split(' ').length > maxWordCount;
});

// initialize network
buildNetwork(nodeCount.value, nodes, edges)

watch(responseData, () => {
  showFullContent.value = false;
});
watch(nodeCount, () => {
  buildNetwork(nodeCount.value, nodes, edges)
})
const configs = reactive(
  vNG.defineConfigs({
    view: {
      layoutHandler: new ForceLayout({
        positionFixedByDrag: false,
        positionFixedByClickWithAltKey: true,
        createSimulation: (d3, nodes, edges) => {
          // d3-force parameters
          const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
          return d3
            .forceSimulation(nodes)
            .force("edge", forceLink.distance(40).strength(0.5))
            .force("charge", d3.forceManyBody().strength(-800))
            .force("center", d3.forceCenter().strength(0.05))
            .alphaMin(0.001)

          // * The following are the default parameters for the simulation.
          // const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
          // return d3
          //   .forceSimulation(nodes)
          //   .force("edge", forceLink.distance(100))
          //   .force("charge", d3.forceManyBody())
          //   .force("collide", d3.forceCollide(50).strength(0.2))
          //   .force("center", d3.forceCenter().strength(0.05))
          //   .alphaMin(0.001)
        }
      }),
    },
    node: {
      label: {
        visible: true,
      },
    },
  })
)

function buildNetwork(count: number, nodes: vNG.Nodes, edges: vNG.Edges) {
  const idNums = [...Array(count)].map((_, i) => i)

  // nodes
  const newNodes = Object.fromEntries(idNums.map(id => [`node${id}`, {}]))
  Object.keys(nodes).forEach(id => delete nodes[id])
  Object.assign(nodes, newNodes)

  // edges
  const makeEdgeEntry = (id1: number, id2: number) => {
    return [`edge${id1}-${id2}`, { source: `node${id1}`, target: `node${id2}` }]
  }
  const newEdges = Object.fromEntries([
    ...idNums
      .map(n => [n, (Math.floor(n / 4) * 4) % count])
      .map(([n, m]) => (n === m ? [n, (n + 4) % count] : [n, m]))
      .map(([n, m]) => makeEdgeEntry(n, m)),
  ])
  Object.keys(edges).forEach(id => delete edges[id])
  Object.assign(edges, newEdges)
}

onMounted(async () => {
  loadingGraph.value = true;
  await fetchGraph();
  // responseData.value = dataJson.response.content;
  loadingGraph.value = false;
});

const toggleShowMore = () => {
  showFullContent.value = !showFullContent.value;
};

const submitQuery = async () => {
  loadingBtn.value = true;

  try {
    const config = useRuntimeConfig();
    const response = await $fetch(config.public.BASE_URL + '/api/query', {
      method: 'POST',
      body: {
        query: query.value,
      },
    });
    if (response.success) {
      responseData.value = response.data;
      await inputQueryToGrah()
    }

    loadingBtn.value = false;
  } catch (error) {
    console.error('Error submitting query:', error);
    toast.error(`error : ${error}`);
    loadingBtn.value = false;
  }
};
const inputQueryToGrah = async () => {
  loadingBtn.value = true;
  loadingGraph.value = true;

  try {
    const config = useRuntimeConfig();
    const response = await $fetch(config.public.BASE_URL + '/api/node-query', {
      method: 'POST',
      body: {
        query: responseData.value
      },
    });
    if (response.success) {
      console.log("🚀 ~ inputQueryToGrah ~ response:", response)
      successInputNode.value=true
      await fetchGraph()
      
    }else{
      successInputNode.value=false
    }
    loadingGraph.value = false;
    loadingBtn.value = false;
  } catch (error) {
    toast.error(`error : ${error}`);
    successInputNode.value=false
    loadingBtn.value = false;
    loadingGraph.value = false;
  }
};

const deleteAllNode = async () => {
  loadingGraph.value = true;
  try {
    const config = useRuntimeConfig(); // Make sure useRuntimeConfig is available in Nuxt 3
    const response = await $fetch(config.public.BASE_URL + '/api/node/delete-all', {
      method: 'DELETE',
    });
    await fetchGraph();
    loadingGraph.value = false;
  } catch (error) {
    console.error('Error delete node:', error);
    loadingGraph.value = false;
  }
};

const fetchGraph = async () => {
  loadingBtn.value = true;

  try {
    const config = useRuntimeConfig(); // Make sure useRuntimeConfig is available in Nuxt 3
    const response = await $fetch(config.public.BASE_URL + '/api/node', {
      method: 'GET',
    });
    console.log("🚀 ~ fetchGraph ~ response:", response)
    if (response.success) {
      nodesGraph = response.data.nodes
      edgesGraph = response.data.edges

    }
    loadingBtn.value = false;
  } catch (error) {
    console.error('Error submitting query:', error);
    loadingBtn.value = false;
  }
};


</script>
<style scoped>
.graph {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
}

.animate-text {
  font-family: 'Open Sans';
  font-weight: 800;
  font-size: 30px;
  background: linear-gradient(to right,
      currentColor 0,
      #a2ebd58f 10%,
      currentColor 20%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: borderAnimate 10s infinite alternate;
}

@keyframes borderAnimate {

  0%,
  100% {
    background-position: -100px;
  }

  50% {
    background-position: 510px;
  }
}
</style>
