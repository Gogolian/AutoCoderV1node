export default (pureAgentPrompt, parameters) => {

    return pureAgentPrompt
        .replace('<WORKING_DIR>', parameters?.workingDir || '')
        .replace('<FIRST_TASK>', parameters?.task || '')
        .replace('<OPERATING_SYSTEM>', parameters?.operatingSystem || '')
        .replace('<TERMINAL>', parameters?.terminal || '')
        
}