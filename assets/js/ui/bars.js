// Bars - numbers inside, pct label small - future reuse
function setBar(barId, pctId, cur, max){ 
  const pct=Math.max(0, Math.floor(cur/max*100)); 
  const bar=document.getElementById(barId);
  const pctEl=document.getElementById(pctId);
  if (bar){ bar.style.width=pct+'%'; bar.textContent=cur+' / '+max; }
  if (pctEl){ pctEl.textContent=pct+'%'; }
}
