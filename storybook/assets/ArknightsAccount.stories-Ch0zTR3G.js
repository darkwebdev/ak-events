import{j as e}from"./jsx-runtime-7_IaB1HC.js";import{r as m}from"./iframe--LM4F6tE.js";import"./preload-helper-C1FmrZbK.js";function q(t,r){const[o,a]=m.useState(()=>{try{const s=localStorage.getItem(t);return s?JSON.parse(s):r}catch{return r}});return m.useEffect(()=>{try{localStorage.setItem(t,JSON.stringify(o))}catch{}},[t,o]),[o,a]}const K="https://ak-account-api-705516204230.us-central1.run.app/graphql",J=K;async function x(t,r){var s,c;const a=await(await fetch(J,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,variables:r})})).json();if((s=a.errors)!=null&&s.length)throw new Error(((c=a.errors[0])==null?void 0:c.message)||"GraphQL request failed");return a.data}async function H(t,r="en"){return(await x(`mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,{email:t,server:r})).sendAuthCode}async function G(t,r,o="en"){return(await x(`mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        server
        error
      }
    }`,{email:t,code:r,server:o})).getAuthToken}async function W({channelUid:t,yostarToken:r,server:o}){var s,c,h,p,k,g;const a=await x(`query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
      myStatus(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        nickName
        level
        uid
        avatarUrl
      }
      myInventory(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        orundum
        originitePrime
        headhuntingPermits
      }
    }`,{channelUid:t,yostarToken:r,server:o});return{nickName:((s=a.myStatus)==null?void 0:s.nickName)??null,level:((c=a.myStatus)==null?void 0:c.level)??null,avatarUrl:((h=a.myStatus)==null?void 0:h.avatarUrl)??null,orundum:((p=a.myInventory)==null?void 0:p.orundum)??0,originitePrime:((k=a.myInventory)==null?void 0:k.originitePrime)??0,headhuntingPermits:((g=a.myInventory)==null?void 0:g.headhuntingPermits)??0}}function B({date:t}){return e.jsxs("time",{className:"ak-ark-account-updated",dateTime:t.toISOString(),title:t.toLocaleString(void 0,{dateStyle:"long",timeStyle:"short"}),children:["Updated ",t.toLocaleString(void 0,{dateStyle:"short",timeStyle:"short"})]})}function A({authState:t,setAuthState:r,onFetched:o}){const a=!!t,[s,c]=m.useState("email"),[h,p]=m.useState(""),[k,g]=m.useState(""),[u,j]=q("ak-events-arknights-linked-account",null),[i,y]=m.useState(!1),[N,l]=m.useState(null);async function _(d){d.preventDefault(),l(null),y(!0);try{const n=await H(h);n.success?c("code"):l(n.message||"Failed to send code.")}catch(n){l(n.message)}finally{y(!1)}}async function P(d){d.preventDefault(),l(null),y(!0);try{const n=await G(h,k);if(n.success){const T={channelUid:n.channelUid,yostarToken:n.yostarToken,server:n.server};r(T),g(""),await C(T)}else l(n.error||"Invalid or expired code.")}catch(n){l(n.message)}finally{y(!1)}}function O(){c("email"),g(""),l(null)}function V(){r(null),j(null),c("email"),p(""),l(null)}async function C(d){l(null),y(!0);try{const n=await W(d);j({nickName:n.nickName,level:n.level,avatarUrl:n.avatarUrl,fetchedAt:new Date().toISOString()}),o(n)}catch(n){console.error("[ArknightsAccount] fetchAccountData failed:",n),l("Could not fetch account data — your session may have expired. Please reconnect."),r(null),c("email")}finally{y(!1)}}return e.jsxs("div",{className:"ak-aside ak-arknights-account",children:[e.jsx("h3",{className:"ak-aside-title",children:"Arknights Account"}),!a&&s==="email"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:_,children:[e.jsx("p",{className:"ak-ark-account-warning",children:"Fetching your data will log you out of Arknights on this device, every time you refresh it."}),e.jsx("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:h,onChange:d=>p(d.target.value),required:!0,disabled:i}),e.jsx("button",{type:"submit",className:"ak-button",disabled:i||!h,children:i?"Sending…":"Send code"})]}),!a&&s==="code"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:P,children:[e.jsxs("p",{className:"ak-ark-account-hint",children:["Enter the code sent to ",h]}),e.jsx("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:k,onChange:d=>g(d.target.value),required:!0,disabled:i}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"submit",className:"ak-button",disabled:i||!k,children:i?"Verifying…":"Verify"}),e.jsx("button",{type:"button",className:"ak-button-secondary",onClick:O,disabled:i,children:"Cancel"})]})]}),a&&e.jsxs("div",{className:"ak-ark-account-connected",children:[u&&e.jsxs("p",{className:"ak-ark-account-hint ak-ark-account-linked",children:[u.avatarUrl&&e.jsx("img",{className:"ak-ark-account-avatar",src:u.avatarUrl,alt:"",width:28,height:28}),"Linked: ",u.nickName," (Lv. ",u.level,")",e.jsx("button",{type:"button",className:"ak-ark-account-logout",onClick:V,disabled:i,"aria-label":"Log out of Arknights account",title:"Log out",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",strokeLinecap:"round"}),e.jsx("polyline",{points:"16 17 21 12 16 7",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12",strokeLinecap:"round"})]})})]}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"button",className:"ak-button",onClick:()=>C(t),disabled:i,children:i?"Fetching…":"Refresh data"}),(u==null?void 0:u.fetchedAt)&&e.jsx(B,{date:new Date(u.fetchedAt)})]})]}),N&&e.jsx("p",{className:"ak-ark-account-error",children:N})]})}const Y={title:"Components/ArknightsAccount",component:A},R={channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},M=`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`,Z=`data:image/svg+xml;utf8,${encodeURIComponent(M)}`,v={render:()=>e.jsx(A,{authState:null,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},S={render:()=>e.jsx(A,{authState:R,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},f={render:()=>e.jsx(A,{authState:R,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.setItem("ak-events-arknights-linked-account",JSON.stringify({nickName:"Doctor",level:120,avatarUrl:Z,fetchedAt:"2026-09-28T14:05:00.000Z"})),e.jsx(t,{}))]};var b,U,w;v.parameters={...v.parameters,docs:{...(b=v.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(w=(U=v.parameters)==null?void 0:U.docs)==null?void 0:w.source}}};var $,I,F;S.parameters={...S.parameters,docs:{...($=S.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(F=(I=S.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};var E,L,D;f.parameters={...f.parameters,docs:{...(E=f.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.setItem('ak-events-arknights-linked-account', JSON.stringify({
      nickName: 'Doctor',
      level: 120,
      avatarUrl: FAKE_AVATAR,
      fetchedAt: '2026-09-28T14:05:00.000Z'
    }));
    return <Story />;
  }]
}`,...(D=(L=f.parameters)==null?void 0:L.docs)==null?void 0:D.source}}};const ee=["Disconnected","Connected","ConnectedWithAccount"];export{S as Connected,f as ConnectedWithAccount,v as Disconnected,ee as __namedExportsOrder,Y as default};
