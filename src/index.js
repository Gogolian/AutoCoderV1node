import fs from 'fs'
import answer from './modules/answer.js';
import askForWorkingDir from './modules/askForWorkingDir.js'
import askForTask from './modules/askForTask.js'
import parseDir from './modules/parseDir.js'
import parametrizeAgent from './modules/parametrizeAgent.js'
import { exec } from 'child_process';
import { promisify } from 'util';
const promisifiedExec = promisify(exec);

import * as dotenv from 'dotenv'
dotenv.config();

(async () => {

  console.log('WELCOME TO AUTO-CODER!!!')
  console.log('USE IT AT YOUR OWN RISK!!!')
  console.log('THIS PROJECT IS FOR EDUCATIONAL PURPOSES ONLY!!!')

  let workingDir = process.env.WORK_ON_DIRECTORY

  if(process.env.MODE === 'params'){
    workingDir = await askForWorkingDir();
  } else {
    console.log('workingDir: ', workingDir)
  }

  const workingDirTree = parseDir(workingDir)

  // TODO: Find some common method to use across multiple sustems, especially i dont know about .stdout if it will work.
  const terminalOutput = await promisifiedExec('echo "CMD: %ComSpec% | PS: $PSVersionTable.PSVersion | macOS/Linux: $(uname -a || echo Unknown)" && echo "Python: $(python --version 2>&1 || echo Unknown)"')

  //console.log('terminalOutput', terminalOutput.stdout)

  try {
    // Read agent1.txt file
    const pureAgentPrompt = await fs.readFileSync(process.env.AGENT, 'utf-8');
    // const pureAgentPrompt = await fs.readFileSync('agents/agent1.txt', 'utf-8');

    let task = process.env.FIRST_TASK
    if(process.env.MODE === 'params'){
      task = await askForTask()
    } else {
      console.log('task: ', task)
    }

    const agentPrompt = parametrizeAgent(pureAgentPrompt, {
      workingDir,
      workingDirTree,
      terminalOutput: terminalOutput.stdout,
      task
    })

    console.log();
    console.log('===========');
    console.log();
    console.log('AGENT CREATED: ', agentPrompt)
    console.log();
    console.log('===========');
    console.log();


    // Get the agent's response
    const response = await answer(agentPrompt);

    console.log('agents response:')
    console.log(response)

    // TODO: all this code could be abstracted.
    const start = response.indexOf('JSON:{')
    const end = response.lastIndexOf('}')
    const jsonString = response.substring(start + 5, end + 1)
    const parsedResponse = JSON.parse(jsonString)

    // Process the agent's response
    for (const action of parsedResponse.actions) {
      switch (action.type) {
        case 'command':
          // Execute command
          console.log('Executing command:')
          console.log(action.content)
          const command_res = await promisifiedExec(action.content)
          console.log(command_res)
          break;
        case 'update':
          // Update an existing file with provided content
          console.log('Updating an existing file with provided content:')
          console.log(action?.filename)
          console.log(action?.content)
          const updateFile_res = await fs.writeFileSync(workingDir + '/' + action.filename, action.content, { flag: 'w+', encoding: 'utf-8' });
          console.log(updateFile_res)
          break;
        case 'delete':
          // Delete specified file
          console.log('Deleting specified file:')
          console.log(action.filename)
          const deleteFile_res = await fs.unlinkSync(workingDir + '/' + action.filename)
          console.log(deleteFile_res)
          break;
        default:
          console.log(`Unknown action type: ${action.type}`);
      }
    }

    // Ask the user for input based on the agent's questions
    for (const question of response.questions) {
      console.log(question.question);
      console.log(`Options: ${question.options.join(', ')}`);
      // Get user input and process it accordingly
    }

    // Print suggestions from the agent
    for (const suggestion of response.suggestions) {
      console.log(`Suggestion: ${suggestion}`);
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
})();