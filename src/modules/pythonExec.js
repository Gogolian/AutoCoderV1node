import { spawn } from "child_process";

export default async (script) => {
    
    return new Promise(function(success, nosuccess) {

        const pyprog = spawn('python', ["-c", script]);
    
        pyprog.stdout.on('data', function(data) {
    
            success(data.toString());
        });
    
        pyprog.stderr.on('data', (data) => {
    
            nosuccess(data.toString());
        });
    })
}