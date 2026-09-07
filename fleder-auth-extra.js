(()=>{
  function byId(id){return document.getElementById(id)}
  function escText(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  const forgot=byId('forgotPassword');
  if(forgot){
    forgot.addEventListener('click',async()=>{
      const email=(byId('authEmail')?.value||'').trim();
      const msg=byId('authMsg');
      if(!email){if(msg)msg.innerHTML='<div class="notice warn">Skriv inn e-postadressen din først.</div>';return;}
      try{
        forgot.disabled=true;
        if(msg)msg.innerHTML='<div class="notice">Sender lenke…</div>';
        const r=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});
        if(r.error)throw r.error;
        if(msg)msg.innerHTML='<div class="notice ok">✓ Vi har sendt en lenke for å lage nytt passord til e-posten din.</div>';
      }catch(err){if(msg)msg.innerHTML='<div class="notice warn">'+escText(err.message||'Kunne ikke sende passordlenke.')+'</div>';}
      finally{forgot.disabled=false;}
    });
  }

  function showRecovery(){
    if(byId('passwordRecoveryBox'))return;
    const box=document.createElement('div');
    box.id='passwordRecoveryBox';
    box.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(7,27,46,.55);display:grid;place-items:center;padding:20px';
    box.innerHTML='<div style="width:min(440px,100%);background:#fff;border-radius:16px;padding:22px;box-shadow:0 20px 70px rgba(0,0,0,.25)"><h2 style="margin:0 0 8px">Lag nytt passord</h2><p class="muted">Skriv inn det nye passordet ditt.</p><div class="field"><label>Nytt passord</label><input id="newPassword1" type="password" minlength="8" autocomplete="new-password"></div><div class="field" style="margin-top:10px"><label>Gjenta nytt passord</label><input id="newPassword2" type="password" minlength="8" autocomplete="new-password"></div><button class="btn" id="saveNewPassword" style="margin-top:16px;width:100%">Lagre nytt passord</button><div id="passwordRecoveryMsg" class="authMsg"></div></div>';
    document.body.appendChild(box);
    byId('saveNewPassword').onclick=async()=>{
      const p1=byId('newPassword1').value,p2=byId('newPassword2').value,m=byId('passwordRecoveryMsg');
      if(p1.length<8){m.innerHTML='<div class="notice warn">Passordet må være minst 8 tegn.</div>';return;}
      if(p1!==p2){m.innerHTML='<div class="notice warn">Passordene er ikke like.</div>';return;}
      try{
        byId('saveNewPassword').disabled=true;
        m.innerHTML='<div class="notice">Lagrer…</div>';
        const r=await sb.auth.updateUser({password:p1});
        if(r.error)throw r.error;
        m.innerHTML='<div class="notice ok">✓ Passordet er endret. Du sendes til innlogging.</div>';
        setTimeout(async()=>{await sb.auth.signOut();location.href=location.origin;},1200);
      }catch(err){m.innerHTML='<div class="notice warn">'+escText(err.message||'Kunne ikke endre passord.')+'</div>';byId('saveNewPassword').disabled=false;}
    };
  }

  if(location.hash.includes('type=recovery')||location.search.includes('type=recovery'))setTimeout(showRecovery,300);
  sb.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')setTimeout(showRecovery,0);});
})();
