(function(root){
 'use strict';
 function readGamepad(pads,focused=true){
  const pad=Array.from(pads||[]).find(p=>p&&p.connected&&p.mapping==='standard');
  const result={connected:!!pad,x:0,y:0,rx:0,ry:0,buttons:0};
  if(!pad||!focused)return result;
  const axis=i=>Number.isFinite(pad.axes[i])?Math.max(-1,Math.min(1,pad.axes[i])):0;
  result.x=axis(0);result.y=-axis(1);result.rx=axis(2);result.ry=-axis(3);
  for(let i=0;i<Math.min(17,pad.buttons.length);i++)if(pad.buttons[i]?.pressed||pad.buttons[i]?.value>.55)result.buttons|=1<<i;
  return result;
 }
 root.readDeadFreightGamepad=readGamepad;if(typeof module!=='undefined')module.exports=readGamepad;
})(typeof window==='undefined'?globalThis:window);
