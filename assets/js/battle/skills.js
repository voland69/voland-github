// VOLAND BATTLE SKILLS v4 - MODULAR
// Main loader - delegates to per-hero files in ./heroes/
function parseSkillMultiplier(desc){ const m = desc.match(/(\d+)% урона/); if (m) return parseInt(m[1]); return 0; }
function parseManaCost(meta){ const m = meta.match(/Мана:\s*(\d+)/i); return m ? parseInt(m[1]) : 10; }
function parseCooldown(meta){ const m = meta.match(/КД:\s*(\d+)/i); return m ? parseInt(m[1]) : 3; }

function applySkillEffect(sName, battle){
 // Вызываем только те герои, чьи функции загружены (чтобы не тянуть всех)
 try{ if (typeof applyAmethystSkills === 'function') applyAmethystSkills(sName, battle); }catch(e){}
 try{ if (typeof applyGravelordSkills === 'function') applyGravelordSkills(sName, battle); }catch(e){}
 try{ if (typeof applyDarkRangerSkills === 'function') applyDarkRangerSkills(sName, battle); }catch(e){}
 try{ if (typeof applyLionWardenSkills === 'function') applyLionWardenSkills(sName, battle); }catch(e){}
 try{ if (typeof applyWildPathSkills === 'function') applyWildPathSkills(sName, battle); }catch(e){}
 try{ if (typeof applyIronVowSkills === 'function') applyIronVowSkills(sName, battle); }catch(e){}
 try{ if (typeof applyAzureSageSkills === 'function') applyAzureSageSkills(sName, battle); }catch(e){}
}
