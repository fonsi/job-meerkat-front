export const NEWSLETTER_SUBSCRIBE_ROOT_ATTR = 'data-newsletter-subscribe';
export const NEWSLETTER_SUBSCRIBE_FIELDS_ATTR = 'data-newsletter-fields';
export const NEWSLETTER_SUBSCRIBE_FORM_ATTR = 'data-newsletter-form';
export const NEWSLETTER_SUBSCRIBE_EMAIL_ATTR = 'data-newsletter-email';
export const NEWSLETTER_SUBSCRIBE_SUBMIT_ATTR = 'data-newsletter-submit';
export const NEWSLETTER_SUBSCRIBE_SUCCESS_ATTR = 'data-newsletter-success';

const STORAGE_KEY = 'jobmeerkat:newsletter-popup';
const SENT_EVENT = 'newsletter-sent';

/** Vanilla enhance script for static SSR job pages (no React hydration). */
export const buildNewsletterInlineSubscribeSsrScript = (
    apiEndpoint: string,
): string => {
    const endpoint = JSON.stringify(
        `${apiEndpoint.replace(/\/$/, '')}/newsletter/subscribe`,
    );
    const storageKey = JSON.stringify(STORAGE_KEY);
    const sentEvent = JSON.stringify(SENT_EVENT);

    // Prefer remove()/display over [hidden]: styled-components `display:flex`
    // on the form beats the UA `[hidden]{display:none}` rule.
    return `(function(){
var root=document.querySelector('[${NEWSLETTER_SUBSCRIBE_ROOT_ATTR}]');
if(!root)return;
var fields=root.querySelector('[${NEWSLETTER_SUBSCRIBE_FIELDS_ATTR}]');
var form=root.querySelector('[${NEWSLETTER_SUBSCRIBE_FORM_ATTR}]');
var emailInput=root.querySelector('[${NEWSLETTER_SUBSCRIBE_EMAIL_ATTR}]');
var submitBtn=root.querySelector('[${NEWSLETTER_SUBSCRIBE_SUBMIT_ATTR}]');
var success=root.querySelector('[${NEWSLETTER_SUBSCRIBE_SUCCESS_ATTR}]');
if(!fields||!form||!emailInput||!submitBtn||!success)return;
form.addEventListener('submit',function(event){
event.preventDefault();
var email=(emailInput.value||'').trim();
if(!email)return;
var label=submitBtn.textContent;
submitBtn.disabled=true;
submitBtn.textContent='Sending…';
fetch(${endpoint},{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({email:email})
}).then(function(res){
if(!res.ok)throw new Error('subscribe_failed');
try{
var raw=localStorage.getItem(${storageKey});
var existing=raw?JSON.parse(raw):null;
localStorage.setItem(${storageKey},JSON.stringify({
lastShownAt:(existing&&typeof existing.lastShownAt==='number')?existing.lastShownAt:Date.now(),
subscribed:true
}));
}catch(e){}
try{if(window.umami&&typeof window.umami.track==='function')window.umami.track(${sentEvent});}catch(e){}
fields.remove();
success.removeAttribute('hidden');
success.style.display='';
}).catch(function(){
submitBtn.disabled=false;
submitBtn.textContent=label;
});
});
})();`;
};
