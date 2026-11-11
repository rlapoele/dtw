/** The Node controller remains outside Chrome's renderer/worker event loops. */
export class OwnedProcessWatchdog {
  constructor(child, evidence, checkpoint, milliseconds=30000) {
    if(!Number.isSafeInteger(child.pid) || child.pid<=0)throw Error('Missing owned process PID');
    this.child=child;this.evidence=evidence;this.checkpoint=checkpoint;this.milliseconds=milliseconds;this.sequence=0;this.expired=false;
  }
  async run(name,fn){
    if(this.timer)throw Error('Overlapping supervised operations');
    if(this.expired)throw Error('Watchdog already stopped this batch');
    const id=++this.sequence,started=performance.now();
    this.evidence.watchdog.push({id,name,event:'armed',at:new Date().toISOString(),pid:this.child.pid,budget:this.milliseconds});this.checkpoint();
    let rejectTimeout;
    const timeout=new Promise((_,reject)=>rejectTimeout=reject);
    this.timer=setTimeout(()=>{
      this.expired=true;
      this.evidence.watchdog.push({id,name,event:'expired-checkpoint-before-kill',elapsed:performance.now()-started,pid:this.child.pid});
      this.evidence.status='watchdog-stopped';this.checkpoint();
      const killed=this.child.kill('SIGKILL');
      this.evidence.watchdog.push({id,name,event:'owned-process-kill-issued',pid:this.child.pid,killed});this.checkpoint();
      rejectTimeout(Error(`${this.milliseconds}ms owned process stop: ${name}`));
    },this.milliseconds);
    try{return await Promise.race([fn(),timeout]);}
    finally{clearTimeout(this.timer);this.timer=undefined;this.evidence.watchdog.push({id,name,event:this.expired?'expired-return':'disarmed',elapsed:performance.now()-started});this.checkpoint();}
  }
  clear(){clearTimeout(this.timer);this.timer=undefined;}
}
