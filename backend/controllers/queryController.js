require('dotenv').config()
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;
const deploymentId = "gpt-35-turbo-16k";

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

exports.prosessQuery = async (req, res) => {
  try {
    const userQuery = req.body.query;
    const messages = [{ role: "user", content: userQuery }];

    const result = await client.getChatCompletions(deploymentId, messages);
    //   return result.choices[0].message;

    let messageQuery = result.choices[0].message.content
    res.json({ success: true, data: messageQuery });
  } catch (error) {
    console.error("Error processing the query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
