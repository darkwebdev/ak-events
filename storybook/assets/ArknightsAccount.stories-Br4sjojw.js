import{j as e}from"./jsx-runtime-BTRzZzJ0.js";import{r as h}from"./iframe-CiSBhl-1.js";import"./preload-helper-C1FmrZbK.js";function O(t,r){const[o,a]=h.useState(()=>{try{const s=localStorage.getItem(t);return s?JSON.parse(s):r}catch{return r}});return h.useEffect(()=>{try{localStorage.setItem(t,JSON.stringify(o))}catch{}},[t,o]),[o,a]}const K="https://ak-account-api-705516204230.us-central1.run.app/graphql",J=K;async function x(t,r){var s,c;const a=await(await fetch(J,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,variables:r})})).json();if((s=a.errors)!=null&&s.length)throw new Error(((c=a.errors[0])==null?void 0:c.message)||"GraphQL request failed");return a.data}async function H(t,r="en"){return(await x(`mutation SendAuthCode($email: String!, $server: String!) {
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
    }`,{email:t,code:r,server:o})).getAuthToken}async function W({channelUid:t,yostarToken:r,server:o}){var s,c,d,y,m,k;const a=await x(`query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
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
    }`,{channelUid:t,yostarToken:r,server:o});return{nickName:((s=a.myStatus)==null?void 0:s.nickName)??null,level:((c=a.myStatus)==null?void 0:c.level)??null,avatarUrl:((d=a.myStatus)==null?void 0:d.avatarUrl)??null,orundum:((y=a.myInventory)==null?void 0:y.orundum)??0,originitePrime:((m=a.myInventory)==null?void 0:m.originitePrime)??0,headhuntingPermits:((k=a.myInventory)==null?void 0:k.headhuntingPermits)??0}}function f({authState:t,setAuthState:r,onFetched:o}){const a=!!t,[s,c]=h.useState("email"),[d,y]=h.useState(""),[m,k]=h.useState(""),[p,j]=O("ak-events-arknights-linked-account",null),[i,g]=h.useState(!1),[N,l]=h.useState(null);async function D(u){u.preventDefault(),l(null),g(!0);try{const n=await H(d);n.success?c("code"):l(n.message||"Failed to send code.")}catch(n){l(n.message)}finally{g(!1)}}async function P(u){u.preventDefault(),l(null),g(!0);try{const n=await G(d,m);if(n.success){const b={channelUid:n.channelUid,yostarToken:n.yostarToken,server:n.server};r(b),k(""),await C(b)}else l(n.error||"Invalid or expired code.")}catch(n){l(n.message)}finally{g(!1)}}function V(){c("email"),k(""),l(null)}function q(){r(null),j(null),c("email"),y(""),l(null)}async function C(u){l(null),g(!0);try{const n=await W(u);j({nickName:n.nickName,level:n.level,avatarUrl:n.avatarUrl}),o(n)}catch(n){console.error("[ArknightsAccount] fetchAccountData failed:",n),l("Could not fetch account data — your session may have expired. Please reconnect."),r(null),c("email")}finally{g(!1)}}return e.jsxs("div",{className:"ak-aside ak-arknights-account",children:[e.jsx("h3",{className:"ak-aside-title",children:"Arknights Account"}),!a&&s==="email"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:D,children:[e.jsx("p",{className:"ak-ark-account-warning",children:"Fetching your data will log you out of Arknights on this device, every time you refresh it."}),e.jsx("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:d,onChange:u=>y(u.target.value),required:!0,disabled:i}),e.jsx("button",{type:"submit",className:"ak-button",disabled:i||!d,children:i?"Sending…":"Send code"})]}),!a&&s==="code"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:P,children:[e.jsxs("p",{className:"ak-ark-account-hint",children:["Enter the code sent to ",d]}),e.jsx("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:m,onChange:u=>k(u.target.value),required:!0,disabled:i}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"submit",className:"ak-button",disabled:i||!m,children:i?"Verifying…":"Verify"}),e.jsx("button",{type:"button",className:"ak-button-secondary",onClick:V,disabled:i,children:"Cancel"})]})]}),a&&e.jsxs("div",{className:"ak-ark-account-connected",children:[p&&e.jsxs("p",{className:"ak-ark-account-hint ak-ark-account-linked",children:[p.avatarUrl&&e.jsx("img",{className:"ak-ark-account-avatar",src:p.avatarUrl,alt:"",width:28,height:28}),"Linked: ",p.nickName," (Lv. ",p.level,")",e.jsx("button",{type:"button",className:"ak-ark-account-logout",onClick:q,disabled:i,"aria-label":"Log out of Arknights account",title:"Log out",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",strokeLinecap:"round"}),e.jsx("polyline",{points:"16 17 21 12 16 7",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12",strokeLinecap:"round"})]})})]}),e.jsx("div",{className:"ak-ark-account-actions",children:e.jsx("button",{type:"button",className:"ak-button",onClick:()=>C(t),disabled:i,children:i?"Fetching…":"Refresh data"})})]}),N&&e.jsx("p",{className:"ak-ark-account-error",children:N})]})}const Y={title:"Components/ArknightsAccount",component:f},_={channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},B=`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`,M=`data:image/svg+xml;utf8,${encodeURIComponent(B)}`,v={render:()=>e.jsx(f,{authState:null,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},A={render:()=>e.jsx(f,{authState:_,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},S={render:()=>e.jsx(f,{authState:_,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.setItem("ak-events-arknights-linked-account",JSON.stringify({nickName:"Doctor",level:120,avatarUrl:M})),e.jsx(t,{}))]};var T,U,w;v.parameters={...v.parameters,docs:{...(T=v.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(w=(U=v.parameters)==null?void 0:U.docs)==null?void 0:w.source}}};var $,F,E;A.parameters={...A.parameters,docs:{...($=A.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(E=(F=A.parameters)==null?void 0:F.docs)==null?void 0:E.source}}};var I,L,R;S.parameters={...S.parameters,docs:{...(I=S.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.setItem('ak-events-arknights-linked-account', JSON.stringify({
      nickName: 'Doctor',
      level: 120,
      avatarUrl: FAKE_AVATAR
    }));
    return <Story />;
  }]
}`,...(R=(L=S.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};const Z=["Disconnected","Connected","ConnectedWithAccount"];export{A as Connected,S as ConnectedWithAccount,v as Disconnected,Z as __namedExportsOrder,Y as default};
