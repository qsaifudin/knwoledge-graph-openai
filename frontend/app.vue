<template>
  <NuxtLoadingIndicator />
  <v-app dark>

    <v-app-bar :clipped-left="clipped" fixed app>
      <NuxtLink to="https://qsaifudin.site/" target="_blank" style="color: white; text-decoration: none;">
        <v-toolbar-title class="pl-12">
          <h3 style="font-size: 30px;">👉<span class="animate-text">Saifudin</span> </h3>
        </v-toolbar-title>
      </NuxtLink>


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
                    </div>
                    <v-progress-linear indeterminate :active="loadingGraph"></v-progress-linear>
                    <div class="mt-2" style="background-color: white; overflow: hidden; position: relative;">
                      <v-network-graph class="graph" :nodes="nodes" :edges="edges" />
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
                      <v-text-field @click:clear="query = ''" v-model="query" label="Query" outlined clearable required
                        :rules="rules"></v-text-field>
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


<script  lang="ts">
import { VNetworkGraph } from "v-network-graph"
import "v-network-graph/lib/style.css"
import dataJson from "./data.json"
const loading = ref(false);
// const foo = useFoo()
export default {
  name: 'DefaultLayout',
  components: {
    VNetworkGraph
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Saifudin Graph',

      query: "",
      valid: true,
      rules: [
        (v: any) => !!v || "Query is required",
      ],
      responseData: "",

      nodes: {},
      edges: {},
      loadingBtn: false,
      loadingGraph: false,

      responseTruncated: false,
      showFullContent: false,
      maxWordCount: 100,

    }
  },
  computed: {
    truncatedData() {
      // Truncate the data if it exceeds the word count limit
      const words = this.responseData.split(' ');
      if (words.length > this.maxWordCount) {
        return words.slice(0, this.maxWordCount).join(' ') + '...';
      }
      return this.responseData;
    },
    shouldShowButton() {
      // Show the button only if the data exceeds the word count limit
      return this.responseData.split(' ').length > this.maxWordCount;
    },
  },
  watch: {
    responseData() {
      // Reset to truncated view when new data is received
      this.showFullContent = false;
    },
  },
  async mounted() {
    this.loadingGraph = true;
    await this.fetchGraph();
    console.log("🚀 ~ mounted ~ this.responseData:", dataJson)
    this.responseData = dataJson.response.content;
    this.loadingGraph = false;
    // console.log("🚀 ~ mounted ~ this.responseData:", this.responseData)

  },

  methods: {
    toggleShowMore() {
      // Toggle between full content and truncated content
      this.showFullContent = !this.showFullContent;
    },
    async submitQuery() {
      this.loadingBtn = true;

      try {
        const config = useRuntimeConfig()
        const response = await $fetch(config.public.BASE_URL + '/api/query', {
          method: 'POST',
          body: {
            query: this.query
          },
        })

        this.responseData = response.response.content;
        this.loadingBtn = false;
      } catch (error) {
        console.error("Error submitting query:", error);
        this.loadingBtn = false;
      }
    },
    async deleteAllNode() {
      this.loadingGraph = true;
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(config.public.BASE_URL + '/api/node/delete-all',{
          method: 'DELETE'
        })
        await this.fetchGraph();
        this.loadingGraph = false;
      } catch (error) {
        console.error("Error delete node:", error);
        this.loadingGraph = false;
      }
    },
    async fetchGraph() {
      this.loadingBtn = true;

      try {
        const config = useRuntimeConfig()
        const response = await $fetch(config.public.BASE_URL + '/api/node', {
          method: 'GET',
        })

        this.nodes = response.nodes;
        this.edges = response.edges;
        this.loadingBtn = false;
      } catch (error) {
        console.error("Error submitting query:", error);
        this.loadingBtn = false;
      }
    },
  }
}
</script>
<style>
.graph {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
}

.animate-text {
  font-family: "Open Sans";
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