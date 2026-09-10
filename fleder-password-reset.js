(()=>{
  function initForgotPassword(){
    const form=document.getElementById('authForm');
    const submit=document.getElementById('authSubmit');
    const email=document.getElementById('authEmail');
    const msg=document.getElementById('authMsg');
    if(!form||!submit||!email||!msg||document.getElementById('forgotPasswordBtn')) return;

    const button=document.createElement('button');
    button.type='button';
    button.id='forgotPasswordBtn';
    button.className='btn secondary';
    button.textContent='Glemt passord?';
    button.style.marginLeft='8px';
    submit.insertAdjacentElement('afterend',button);

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
        msg.innerHTML='<div class="notice warn">Kunne ikke sende lenke for nytt passord. Prøv igjen.</div>';
      }finally{button.disabled=false;}
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initForgotPassword);
  else initForgotPassword();
  setTimeout(initForgotPassword,500);
})();
