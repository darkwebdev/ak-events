import{j as e}from"./jsx-runtime-ClxbuBi0.js";import{r as h}from"./iframe-C0MbBWNn.js";import{u as q}from"./useNow-CSl7692h.js";import{f as K,a as J}from"./dates-CBOBqRcz.js";import"./preload-helper-C1FmrZbK.js";function H(t,r){const[o,a]=h.useState(()=>{try{const s=localStorage.getItem(t);return s?JSON.parse(s):r}catch{return r}});return h.useEffect(()=>{try{localStorage.setItem(t,JSON.stringify(o))}catch{}},[t,o]),[o,a]}const G="https://ak-account-api-705516204230.us-central1.run.app/graphql",W=G;async function x(t,r){var s,c;const a=await(await fetch(W,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,variables:r})})).json();if((s=a.errors)!=null&&s.length)throw new Error(((c=a.errors[0])==null?void 0:c.message)||"GraphQL request failed");return a.data}async function B(t,r="en"){return(await x(`mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,{email:t,server:r})).sendAuthCode}async function M(t,r,o="en"){return(await x(`mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        server
        error
      }
    }`,{email:t,code:r,server:o})).getAuthToken}async function Z({channelUid:t,yostarToken:r,server:o}){var s,c,m,y,k,g;const a=await x(`query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
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
    }`,{channelUid:t,yostarToken:r,server:o});return{nickName:((s=a.myStatus)==null?void 0:s.nickName)??null,level:((c=a.myStatus)==null?void 0:c.level)??null,avatarUrl:((m=a.myStatus)==null?void 0:m.avatarUrl)??null,orundum:((y=a.myInventory)==null?void 0:y.orundum)??0,originitePrime:((k=a.myInventory)==null?void 0:k.originitePrime)??0,headhuntingPermits:((g=a.myInventory)==null?void 0:g.headhuntingPermits)??0}}function z({date:t}){const r=q();return e.jsxs("time",{className:"ak-ark-account-updated",dateTime:t.toISOString(),title:J(t),children:["Updated ",K(t,r)]})}function S({authState:t,setAuthState:r,onFetched:o}){const a=!!t,[s,c]=h.useState("email"),[m,y]=h.useState(""),[k,g]=h.useState(""),[u,j]=H("ak-events-arknights-linked-account",null),[i,p]=h.useState(!1),[N,l]=h.useState(null);async function _(d){d.preventDefault(),l(null),p(!0);try{const n=await B(m);n.success?c("code"):l(n.message||"Failed to send code.")}catch(n){l(n.message)}finally{p(!1)}}async function P(d){d.preventDefault(),l(null),p(!0);try{const n=await M(m,k);if(n.success){const C={channelUid:n.channelUid,yostarToken:n.yostarToken,server:n.server};r(C),g(""),await T(C)}else l(n.error||"Invalid or expired code.")}catch(n){l(n.message)}finally{p(!1)}}function O(){c("email"),g(""),l(null)}function V(){r(null),j(null),c("email"),y(""),l(null)}async function T(d){l(null),p(!0);try{const n=await Z(d);j({nickName:n.nickName,level:n.level,avatarUrl:n.avatarUrl,fetchedAt:new Date().toISOString()}),o(n)}catch(n){console.error("[ArknightsAccount] fetchAccountData failed:",n),l("Could not fetch account data — your session may have expired. Please reconnect."),r(null),c("email")}finally{p(!1)}}return e.jsxs("div",{className:"ak-aside ak-arknights-account",children:[e.jsx("h3",{className:"ak-aside-title",children:"Arknights Account"}),!a&&s==="email"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:_,children:[e.jsx("p",{className:"ak-ark-account-warning",children:"Fetching your data will log you out of Arknights on this device, every time you refresh it."}),e.jsx("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:m,onChange:d=>y(d.target.value),required:!0,disabled:i}),e.jsx("button",{type:"submit",className:"ak-button",disabled:i||!m,children:i?"Sending…":"Send code"})]}),!a&&s==="code"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:P,children:[e.jsxs("p",{className:"ak-ark-account-hint",children:["Enter the code sent to ",m]}),e.jsx("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:k,onChange:d=>g(d.target.value),required:!0,disabled:i}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"submit",className:"ak-button",disabled:i||!k,children:i?"Verifying…":"Verify"}),e.jsx("button",{type:"button",className:"ak-button-secondary",onClick:O,disabled:i,children:"Cancel"})]})]}),a&&e.jsxs("div",{className:"ak-ark-account-connected",children:[u&&e.jsxs("p",{className:"ak-ark-account-hint ak-ark-account-linked",children:[u.avatarUrl&&e.jsx("img",{className:"ak-ark-account-avatar",src:u.avatarUrl,alt:"",width:28,height:28}),"Linked: ",u.nickName," (Lv. ",u.level,")",e.jsx("button",{type:"button",className:"ak-ark-account-logout",onClick:V,disabled:i,"aria-label":"Log out of Arknights account",title:"Log out",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",strokeLinecap:"round"}),e.jsx("polyline",{points:"16 17 21 12 16 7",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12",strokeLinecap:"round"})]})})]}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"button",className:"ak-button",onClick:()=>T(t),disabled:i,children:i?"Fetching…":"Refresh data"}),(u==null?void 0:u.fetchedAt)&&e.jsx(z,{date:new Date(u.fetchedAt)})]})]}),N&&e.jsx("p",{className:"ak-ark-account-error",children:N})]})}const re={title:"Components/ArknightsAccount",component:S},R={channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},Q=`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`,X=`data:image/svg+xml;utf8,${encodeURIComponent(Q)}`,v={render:()=>e.jsx(S,{authState:null,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},f={render:()=>e.jsx(S,{authState:R,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},A={render:()=>e.jsx(S,{authState:R,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.setItem("ak-events-arknights-linked-account",JSON.stringify({nickName:"Doctor",level:120,avatarUrl:X,fetchedAt:"2026-09-28T14:05:00.000Z"})),e.jsx(t,{}))]};var b,w,U;v.parameters={...v.parameters,docs:{...(b=v.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(U=(w=v.parameters)==null?void 0:w.docs)==null?void 0:U.source}}};var $,I,F;f.parameters={...f.parameters,docs:{...($=f.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(F=(I=f.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};var E,L,D;A.parameters={...A.parameters,docs:{...(E=A.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(D=(L=A.parameters)==null?void 0:L.docs)==null?void 0:D.source}}};const oe=["Disconnected","Connected","ConnectedWithAccount"];export{f as Connected,A as ConnectedWithAccount,v as Disconnected,oe as __namedExportsOrder,re as default};
