export function gateFacts(received,{lock,targetCase,witnessCase}) {
  const start=received.find(e=>e.type==='block-start'&&e.lock===lock&&e.caseId===targetCase&&e.actor==='native-worker'&&e.worker==='A');
  const natural=start&&received.find(e=>e.type==='natural-finish'&&e.caseId===targetCase&&e.actor===start.actor&&e.worker===start.worker&&e.seq>start.seq);
  const request=received.find(e=>e.type==='witness-request-after-positive-start'&&e.lock===lock&&e.caseId===witnessCase);
  const acquired=received.find(e=>e.type==='witness-acquired'&&e.lock===lock&&e.caseId===witnessCase&&e.actor==='native-worker'&&e.worker==='A');
  return {start,natural,request,acquired};
}
export function assessControl(control,facts) {
  const {start,natural,request,acquired}=facts;
  if(!start||!request||!acquired||!control.pendingAtPositiveStart)throw Error('missing matching causal start/witness evidence');
  if(acquired.rendererAt<request.rendererAt)throw Error('witness renderer order invalid');
  if(!control.intervention) {
    if(control.commandError||control.result!==true||!natural||natural.at-start.at<12000)throw Error('finite natural control incomplete');
  }else {
    if(!control.pendingAtClose||!control.close?.ok||control.close.responseAt-control.close.requestAt>3000||control.close.requestAt<Date.parse(start.receivedAt)+2000||control.close.responseAt>=Date.parse(start.receivedAt)+12000)throw Error('close pending/timing/response evidence failed');
    if(!Array.isArray(control.close.response?.value)||control.close.response.value.includes(control.target))throw Error('close did not identify target disappearance');
    if(natural||Date.parse(acquired.receivedAt)<control.close.requestAt||Date.parse(acquired.receivedAt)>=Date.parse(start.receivedAt)+12000)throw Error('cessation before natural finish not established');
  }
  return true;
}
