(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduce.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}), {threshold:.08});
    document.querySelectorAll('[data-reveal]').forEach(node=>observer.observe(node));
  }
  const views=[...document.querySelectorAll('[data-view]')];
  const tabs=[...document.querySelectorAll('[data-view-target]')];
  if(views.length){
    const ids=views.map(view=>view.id);
    function render(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{}if(!ids.includes(id)){id=ids[0];history.replaceState(history.state,'',location.pathname+location.search+'#'+id);}const active=views.find(view=>view.id===id);const hiding=views.find(view=>view.contains(document.activeElement)&&view!==active);views.forEach(view=>{view.hidden=view!==active;view.inert=view!==active;});tabs.forEach(tab=>{if(tab.dataset.viewTarget===id)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current');});document.body.dataset.activeView=id;if(hiding)tabs.find(tab=>tab.dataset.viewTarget===id)?.focus({preventScroll:true});}
    tabs.forEach(tab=>tab.addEventListener('click',event=>{event.preventDefault();if(ids.includes(tab.dataset.viewTarget)&&location.hash!=='#'+tab.dataset.viewTarget)location.hash=tab.dataset.viewTarget;}));
    window.addEventListener('hashchange',render);render();
    document.addEventListener('keydown',event=>{if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,[contenteditable=true]'))return;if(!['ArrowLeft','ArrowRight'].includes(event.key))return;const index=ids.indexOf(location.hash.slice(1));const next=index+(event.key==='ArrowRight'?1:-1);if(next>=0&&next<ids.length){event.preventDefault();location.hash=ids[next];}});
  }
  const filters=[...document.querySelectorAll('[data-tech-filter]')];
  filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));let count=0;document.querySelectorAll('[data-tech-kind]').forEach(row=>{row.hidden=button.dataset.techFilter!=='all'&&row.dataset.techKind!==button.dataset.techFilter;if(!row.hidden)count++;});const status=document.querySelector('[data-filter-count]');if(status)status.textContent=count+' 篇文字';}));
  document.querySelectorAll('[data-read]').forEach(button=>button.addEventListener('click',()=>{const dialog=document.querySelector('#entry-reader');if(!dialog)return;const a=button.getBoundingClientRect(),b=dialog.getBoundingClientRect();dialog.style.transformOrigin=`${a.left+a.width/2-b.left}px ${a.top+a.height/2-b.top}px`;}));
})();
