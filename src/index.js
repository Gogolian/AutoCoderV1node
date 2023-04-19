
import * as dotenv from 'dotenv'
dotenv.config();

import init from './modules/init.js';
import answer from './modules/answer.js';
import action from './modules/action.js';

global.workingDir = process.env.WORKING_DIR;

(async () => {

  try {
    
    const agentPrompt = await init();

    // Get the agent's response
    const response = await answer(agentPrompt);

    console.log('agents response')
    console.log(response)
    console.log('/agents response')

    const result = await action(response)

    console.log(result)

  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }

})();