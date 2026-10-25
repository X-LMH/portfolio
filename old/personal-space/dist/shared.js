/* Shared data/editor only. Each design owns its page structure, styling and navigation. */
(() => {
  'use strict';
  const scriptUrl=document.currentScript.src;
  const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('shared.css',scriptUrl);document.head.append(link);
  const defaults={name:'林序',role:'记录者 / 创作者',location:'中国 / UTC+8',bio:'有时动手做一点东西，有时只是看看书、出去走走。这里放一些近期的记录，其他的慢慢再说。',about:'喜欢观察普通日子里的小事，也喜欢把一个想法慢慢做出来。给阅读、散步和发呆留一点时间。',now:'整理最近的阅读笔记，试着做一些小东西。',availability:'欢迎交流技术，也聊别的',email:''};
  let profile={...defaults},saved=false;
  try{const stored=JSON.parse(localStorage.getItem('personal-space-profile')||'null');if(stored&&typeof stored==='object'){for(const key of Object.keys(defaults))if(typeof stored[key]==='string')profile[key]=stored[key].slice(0,400);saved=true;}}catch{}
  const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  const toast=el('div','ps-toast');toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');toast.hidden=true;document.body.append(toast);let timer;
  function notify(text){toast.textContent=text;toast.hidden=false;toast.classList.add('ps-visible');clearTimeout(timer);timer=setTimeout(()=>{toast.classList.remove('ps-visible');toast.hidden=true;},3200);}
  function apply(){document.querySelectorAll('[data-profile]').forEach(node=>{const key=node.dataset.profile;node.textContent=profile[key]|| (key==='email'?'尚未填写邮箱':'');});document.querySelectorAll('[data-example-label]').forEach(node=>node.textContent=saved?'本地档案':'示例档案');}
  const dialog=el('dialog','ps-dialog');dialog.setAttribute('aria-labelledby','ps-editor-title');
  const form=el('form','ps-form');
  const header=el('div','ps-dialog-head');const heading=el('div');heading.append(el('small','','PERSONAL FILE'),el('h2','','编辑个人资料'));heading.lastChild.id='ps-editor-title';
  const close=el('button','ps-close','×');close.type='button';close.setAttribute('aria-label','关闭资料编辑');close.addEventListener('click',()=>dialog.close());header.append(heading,close);form.append(header);
  form.append(el('p','ps-hint','更改只保存在当前浏览器，所有方案共用这份资料。需要给所有访客展示时，请替换源文件中的示例资料后重新发布。'));
  const fields=[['name','姓名 / 昵称','input',24],['role','一句话描述','input',80],['location','所在城市','input',60],['email','联系邮箱','email',100],['bio','个人简介','textarea',300],['about','更多关于你','textarea',400],['now','最近在做什么','input',120]];
  const grid=el('div','ps-form-grid');fields.forEach(([key,title,type,max])=>{const label=el('label',type==='textarea'?'ps-wide':'');label.append(el('span','',title));const field=el(type==='textarea'?'textarea':'input');field.name=key;field.maxLength=max;field.setAttribute('aria-label',title);if(type==='email')field.type='email';if(type==='textarea')field.rows=3;if(key==='name'||key==='role')field.required=true;label.append(field);grid.append(label);});form.append(grid);
  const actions=el('div','ps-form-actions');const reset=el('button','ps-text-button','恢复示例');reset.type='button';const submit=el('button','ps-save','保存资料');submit.type='submit';actions.append(reset,submit);form.append(actions);dialog.append(form);document.body.append(dialog);
  function open(){for(const key of Object.keys(defaults)){const field=form.elements.namedItem(key);if(field)field.value=profile[key];}dialog.showModal();}
  reset.addEventListener('click',()=>{profile={...defaults};saved=false;try{localStorage.removeItem('personal-space-profile');}catch{}apply();dialog.close();notify('已恢复示例资料');});
  form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);for(const key of Object.keys(defaults))if(data.has(key))profile[key]=String(data.get(key)||'').trim();let persisted=true;try{localStorage.setItem('personal-space-profile',JSON.stringify(profile));}catch{persisted=false;}saved=true;apply();dialog.close();notify(persisted?'资料已保存，所有方案会同步使用':'本次预览已更新，浏览器未允许长期保存');});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  document.querySelectorAll('[data-edit-profile]').forEach(button=>button.addEventListener('click',open));
  document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{if(!profile.email){open();notify('先填写你的邮箱');}else location.href='mailto:'+encodeURIComponent(profile.email);}));
  document.querySelectorAll('[data-copy-email]').forEach(button=>button.addEventListener('click',async()=>{if(!profile.email){open();return;}try{await navigator.clipboard.writeText(profile.email);notify('邮箱已复制');}catch{notify('当前浏览器无法复制，请手动选择邮箱文字');}}));
  apply();
})();
