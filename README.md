# Knowledge Graph App By Saif

## Author

- **Saifudin**
  - Email: qsaifudin.official@gmail.com
  - LinkedIn: [https://www.linkedin.com/in/qsaifudin/](https://www.linkedin.com/in/qsaifudin/)
  - Personal Web: [https://qsaifudin.site/](https://qsaifudin.site/)

Detail setup instructions and system requirements are already available in the `README.me` file inside the backend and frontend folders.

## Introduction

The Knowledge Graph App is designed to provide information based on user queries and visualize the data in the form of a knowledge graph.

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

## Key Design Decisions

1. **Express Framework**:
   - Chosen for its simplicity and efficiency in handling HTTP requests.
   
2. **AuraDB (Neo4j Cloud)**:
   - Cloud-based Neo4j database for easier setup and maintenance.
   
3. **Nuxt3 and Vuetify**:
   - Nuxt3 chosen for its developer-friendly features.
   - Vuetify selected as the UI framework for consistent and responsive design.
   
4. **Azure OpenAI Integration**:
   - Utilizing Azure OpenAI for natural language processing.
   
   - **Answering User Queries**:
     - Azure OpenAI is employed to process user input and provide accurate and relevant responses.
     
   - **Converting Natural Language to Cypher Queries**:
     - Leveraging Azure OpenAI to convert the natural language responses into Cypher queries for efficient data storage in AuraDB.
