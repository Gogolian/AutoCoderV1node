import fs from 'fs'
import { exec } from 'child_process';
import { promisify } from 'util';
const promisifiedExec = promisify(exec);
import pythonExec from './pythonExec.js';

export default async (response) => {

    const ccmd_start = response.indexOf('CPYT:')
    const cmsg_start = response.lastIndexOf('CMSG:')

    let command, message

    if(ccmd_start !== -1){
      const script = response.substring(ccmd_start + 5)
      command = await pythonExec( script )
      // command = await promisifiedExec( response.substring(ccmd_start + 5) )
    }

    if(cmsg_start !== -1){
      message = response.substring(ccmd_start + 5)
    }

    return {command, message}
}