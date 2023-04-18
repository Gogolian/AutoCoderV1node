export default (pureAgentPrompt, parameters) => {

    return pureAgentPrompt
        .replace('<WORKING DIR>', parameters.workingDir)
        .replace('<tree structure here>', parameters.workingDirTree)
        .replace('<TERMINAL OUTPUT>', parameters.terminalOutput)
        .replace('<FIRST TASK>', parameters.task)
        
}