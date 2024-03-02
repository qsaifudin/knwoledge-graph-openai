# Knowledge Graph Using LLM, Azure OpenAi, Nodejs, Neo4j, and VueJs

The Knowledge Graph App is designed to provide information based on user queries and visualize the data in the form of a knowledge graph.

GitHub Repo : https://github.com/qsaifudin/knwoledge-graph-openai.git

Video Demo : https://youtu.be/cNWrqlrbXac

## Design Overview

### User Interaction Flow:

- Users input questions through the website/frontend.
- The website forwards the input to the backend.

### Backend Processing:

- Backend communicates with Azure OpenAI API to process user input.
- OpenAI's response is sent back to the website as the answer to the user's question.
- The backend then queries Azure OpenAI again to convert the response into a Cypher query.

### Data Storage:

- The Cypher query response is used to store data in the form of nodes in AuraDB (Neo4j database in the cloud).

### User Feedback:

- If successful, the node graph is displayed on the website.
- In case of failure, users can click the "TRY AGAIN" button to restore data and visualize nodes.

### Node Management:

- Users can delete all nodes in the database using the "DELETE ALL NODES" button.

## System Architecture

### Backend

- Framework: Express
- Database: AuraDB (Cloud version of Neo4j)

#### Access Cloud Portal

- [https://workspace-preview.neo4j.io/](https://workspace-preview.neo4j.io/)

#### Scheme

- neo4j+s


### Frontend

- Framework: Nuxt3
- UI Framework: Vuetify

## Communication

### Using API

- **Get All Nodes**: 
  - URL: `http://localhost:5000/api/node`
  - Method: GET

- **Query Processing**: 
  - URL: `http://localhost:5000/api/query`
  - Method: POST
  - Body:	
    ```json
    {
      "query": "User query"
    }
    ```

- **Store Cypher Query**: 
  - URL: `http://localhost:5000/api/node-query`
  - Method: POST
  - Body:
    ```json
    {
      "query": "Cypher query"
    }
    ```

- **Delete All Nodes**: 
  - URL: `http://localhost:5000/api/node/delete-all`
  - Method: POST


Detail setup instructions and system requirements are already available in the `README.me` file inside the backend and frontend folders.

## Author

- **Saifudin**
  - Email: qsaifudin.official@gmail.com
  - LinkedIn: [https://www.linkedin.com/in/qsaifudin/](https://www.linkedin.com/in/qsaifudin/)
  - Personal Web: [https://qsaifudin.site/](https://qsaifudin.site/)

