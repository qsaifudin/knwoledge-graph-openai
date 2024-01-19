<template>
  <v-row justify="center" align="start">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          Your Query Answer Here
        </v-card-title>
        <v-card-text>
          <p>
            {{ responseData }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          Query
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="emailForm">
            <v-text-field
              v-model="query"
              label="Query"
              outlined
              clearable
              required
              :rules="rules"
            ></v-text-field>
          </v-form>
          <v-btn color="primary" @click="submitQuery">
            OK
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      valid: true,
      rules: [
        (v) => !!v || "Query is required",
      ],
      responseData: "",
    };
  },
  methods: {
    async submitQuery() {
      try {
        const response = await this.$axios.post("/api/query", {
          query: this.query,
        });

        // Assuming your API response contains the data you want to display
        this.responseData = response.data;

        // You can add further logic here based on your API response
      } catch (error) {
        console.error("Error submitting query:", error);
        // Handle error as needed
      }
    },
  },
};
</script>
