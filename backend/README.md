# Backend Knowledge Graph App

## Author

- **Saifudin**
  - Email: qsaifudin.official@gmail.com
  - LinkedIn: [https://www.linkedin.com/in/qsaifudin/](https://www.linkedin.com/in/qsaifudin/)
  - Personal Web: [https://qsaifudin.site/](https://qsaifudin.site/)

Welcome to the Backend Knowledge Graph App! This application serves as the backend for a knowledge graph. Below are the setup instructions and system requirements to get you started.

## System Requirements
Ensure that your system meets the following requirements:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Internet connection (for external API calls)

## Setup

1. Install dependencies using npm:
   ```bash
   npm install
2. Configure your environment variables:
- Create a .env file in the root directory.
- Add the following environment variables with your specific values:
   ```bash
   AZURE_OPENAI_ENDPOINT=https://dana-automation-hiring-temp.openai.azure.com/
   AZURE_OPENAI_KEY=b0e73c18d58e46d1b02c3eb533d7dc26
   PORT=5000
   ```
   or you can just copy the .env-example file 


## Usage

1. Run the application using the following command:
   ```bash
   npm start
   ```
   The application will be accessible at http://localhost:5000 by default. You can customize the port by changing the value in the .env file.