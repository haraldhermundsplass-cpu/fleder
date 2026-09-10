(()=>{
  function initForgotPassword(){
    const button=document.getElementById('forgotPasswordBtn');
    const email=document.getElementById('authEmail');
    const msg=document.getElementById('authMsg');
    if(!button||!email||!msg||button.dataset.ready==='1') return;
    button.dataset.ready='1';

    const sync=()=>{button.classList.toggle('hidden',document.getElementById('authTabLogin')?.classList.contains('active')===false)};
    ['authTabLogin','authTabLeader','authTabTeacher'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(sync,0)));
    sync();

    button.addEventListener('click',async()=>{
      const address=email.value.trim();
      if(!address){msg.innerHTML='<div class="notice warn">Skriv inn e-postadressen din først.</div>';email.focus();return;}
      try{
        button.disabled=true;
        msg.innerHTML='<div class="notice">Sender lenke for nytt passord…</div>';
        const result=await sb.auth.resetPasswordForEmail(address,{redirectTo:location.origin});
        if(result.error) throw result.error;
        msg.innerHTML='<div class="notice ok">✓ Vi har sendt en lenke for nytt passord til e-postadressen din.</div>';
      }catch(err){
        console.error(err);
        msg.innerHTML='<div class="notice warn">Kunne ikke sende lenke for nytt passord. Prøv igjen.</div>';
      }finally{button.disabled=false;}
    });
  }

  initForgotPassword();
  setTimeout(initForgotPassword,250);
})();
