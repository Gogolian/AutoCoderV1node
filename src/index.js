
import * as dotenv from 'dotenv'
dotenv.config();

import init from './modules/init.js';
import answer from './modules/answer.js';
import action from './modules/action.js';

(async () => {
  
  try {
    
    const agentPrompt = await init();

    // Get the agent's response
    const response = await answer(agentPrompt);

    console.log('agents response:')
    console.log(response)

    const result = action(response)

  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }

})();