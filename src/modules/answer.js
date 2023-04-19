import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv'
dotenv.config();

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export default async (prompt) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 2048,
      temperature: 0.2,
    });
    //console.log(completion)
    return completion.data.choices[0].text;
  } catch (error) {
    console.log(error)
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
  return "";
};