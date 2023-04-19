import fs from 'fs'
import { exec } from 'child_process';
import { promisify } from 'util';
const promisifiedExec = promisify(exec);

export default async (response) => {

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
          const updateFile_res = await fs.writeFileSync(global.workingDir + '/' + action.filename, action.content, { flag: 'w+', encoding: 'utf-8' });
          console.log(updateFile_res)
          break;
        case 'delete':
          // Delete specified file
          console.log('Deleting specified file:')
          console.log(action.filename)
          const deleteFile_res = await fs.unlinkSync(global.workingDir + '/' + action.filename)
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

}