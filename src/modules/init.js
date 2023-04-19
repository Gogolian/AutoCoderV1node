import askForWorkingDir from './init/askForWorkingDir.js'
import askForTask from './init/askForTask.js'
import parseDir from './init/parseDir.js'
import parametrizeAgent from './init/parametrizeAgent.js'
import fs from 'fs'
import { exec } from 'child_process';
import { promisify } from 'util';
const promisifiedExec = promisify(exec);

export default async () => {

  console.log('WELCOME TO AUTO-CODER!!!')
  console.log('USE IT AT YOUR OWN RISK!!!')
  console.log('THIS PROJECT IS FOR EDUCATIONAL PURPOSES ONLY!!!')

  global.workingDir = process.env.WORK_ON_DIRECTORY

  if(process.env.MODE === 'params'){
    global.workingDir = await askForWorkingDir();
  } else {
    console.log('workingDir: ', global.workingDir)
  }

  const workingDirTree = await parseDir(global.workingDir)

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
      workingDir: global.workingDir,
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

    return agentPrompt

  } catch (error) {
    console.log(error)
  }
  return null
}