// Separate process/event loop: can terminate the owned Chrome process group even
// while its controller awaits an unresponsive CDP command. No shared process kill.
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
let timer;
process.on('message',message=>{
 if(message.type==='disarm'){clearTimeout(timer);return;}
 if(message.type!=='arm')return;
 clearTimeout(timer);
 const {pid,profile,file,id}=message;
 if(!Number.isSafeInteger(pid)||pid<=0||!profile.startsWith('/'))throw Error('Invalid owned process');
 const command=execFileSync('/bin/ps',['-p',String(pid),'-o','command=']).toString();
 if(!command.includes('--user-data-dir='+profile))throw Error('Profile/PID ownership mismatch');
 timer=setTimeout(()=>{writeFileSync(file,JSON.stringify({id,pid,profile,expired:true,ms:30000,action:'SIGKILL only owned Chrome process group'},null,2)+'\n');try{process.kill(-pid,'SIGKILL');}catch{}},30000);
 process.send({armed:id,pid,ms:30000});
});
process.on('disconnect',()=>{clearTimeout(timer);process.exit(0);});
