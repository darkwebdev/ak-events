import{j as e}from"./jsx-runtime-CitgaYex.js";import{r as g}from"./iframe-Bv7gtsT4.js";import{u as K}from"./useNow-CuxQJZHv.js";import{f as J,a as H}from"./dates-CioEEh1n.js";import"./preload-helper-C1FmrZbK.js";function G(t,r){const[o,a]=g.useState(()=>{try{const s=localStorage.getItem(t);return s?JSON.parse(s):r}catch{return r}});return g.useEffect(()=>{try{localStorage.setItem(t,JSON.stringify(o))}catch{}},[t,o]),[o,a]}const W="https://ak-account-api-705516204230.us-central1.run.app/graphql",B=W;async function j(t,r){var s,d;const a=await(await fetch(B,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,variables:r})})).json();if((s=a.errors)!=null&&s.length)throw new Error(((d=a.errors[0])==null?void 0:d.message)||"GraphQL request failed");return a.data}async function M(t,r="en"){return(await j(`mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,{email:t,server:r})).sendAuthCode}async function Z(t,r,o="en"){return(await j(`mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        server
        error
      }
    }`,{email:t,code:r,server:o})).getAuthToken}async function z({channelUid:t,yostarToken:r,server:o}){var s,d,k,h,v,p;const a=await j(`query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
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
      myRoster(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        charId
        potentialRank
      }
    }`,{channelUid:t,yostarToken:r,server:o});return{nickName:((s=a.myStatus)==null?void 0:s.nickName)??null,level:((d=a.myStatus)==null?void 0:d.level)??null,avatarUrl:((k=a.myStatus)==null?void 0:k.avatarUrl)??null,orundum:((h=a.myInventory)==null?void 0:h.orundum)??0,originitePrime:((v=a.myInventory)==null?void 0:v.originitePrime)??0,headhuntingPermits:((p=a.myInventory)==null?void 0:p.headhuntingPermits)??0,roster:Object.fromEntries((a.myRoster??[]).filter(m=>m.charId).map(m=>[m.charId,m.potentialRank??0]))}}function Q({date:t}){const r=K();return e.jsxs("time",{className:"ak-ark-account-updated",dateTime:t.toISOString(),title:H(t),children:["Updated ",J(t,r)]})}function x({authState:t,setAuthState:r,onFetched:o,onLogout:a}){const s=!!t,[d,k]=g.useState("email"),[h,v]=g.useState(""),[p,m]=g.useState(""),[l,N]=G("ak-events-arknights-linked-account",null),[c,y]=g.useState(!1),[T,i]=g.useState(null);async function O(u){u.preventDefault(),i(null),y(!0);try{const n=await M(h);n.success?k("code"):i(n.message||"Failed to send code.")}catch(n){i(n.message)}finally{y(!1)}}async function P(u){u.preventDefault(),i(null),y(!0);try{const n=await Z(h,p);if(n.success){const U={channelUid:n.channelUid,yostarToken:n.yostarToken,server:n.server};r(U),m(""),await C(U)}else i(n.error||"Invalid or expired code.")}catch(n){i(n.message)}finally{y(!1)}}function V(){k("email"),m(""),i(null)}function q(){r(null),N(null),a==null||a(),k("email"),v(""),i(null)}async function C(u){i(null),y(!0);try{const n=await z(u);N({nickName:n.nickName,level:n.level,avatarUrl:n.avatarUrl,fetchedAt:new Date().toISOString()}),o(n)}catch(n){console.error("[ArknightsAccount] fetchAccountData failed:",n),i("Could not fetch account data — your session may have expired. Please reconnect."),r(null),k("email")}finally{y(!1)}}return e.jsxs("div",{className:"ak-aside ak-arknights-account",children:[e.jsx("h3",{className:"ak-aside-title",children:"Arknights Account"}),!s&&d==="email"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:O,children:[e.jsx("p",{className:"ak-ark-account-warning",children:"Fetching your data will log you out of Arknights on this device, every time you refresh it."}),e.jsx("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:h,onChange:u=>v(u.target.value),required:!0,disabled:c}),e.jsx("button",{type:"submit",className:"ak-button",disabled:c||!h,children:c?"Sending…":"Send code"})]}),!s&&d==="code"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:P,children:[e.jsxs("p",{className:"ak-ark-account-hint",children:["Enter the code sent to ",h]}),e.jsx("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:p,onChange:u=>m(u.target.value),required:!0,disabled:c}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"submit",className:"ak-button",disabled:c||!p,children:c?"Verifying…":"Verify"}),e.jsx("button",{type:"button",className:"ak-button-secondary",onClick:V,disabled:c,children:"Cancel"})]})]}),s&&e.jsxs("div",{className:"ak-ark-account-connected",children:[l&&e.jsxs("p",{className:"ak-ark-account-hint ak-ark-account-linked",children:[l.avatarUrl&&e.jsx("img",{className:"ak-ark-account-avatar",src:l.avatarUrl,alt:"",width:28,height:28}),"Linked: ",l.nickName," (Lv. ",l.level,")",e.jsx("button",{type:"button",className:"ak-ark-account-logout",onClick:q,disabled:c,"aria-label":"Log out of Arknights account",title:"Log out",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",strokeLinecap:"round"}),e.jsx("polyline",{points:"16 17 21 12 16 7",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12",strokeLinecap:"round"})]})})]}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"button",className:"ak-button",onClick:()=>C(t),disabled:c,children:c?"Fetching…":"Refresh data"}),(l==null?void 0:l.fetchedAt)&&e.jsx(Q,{date:new Date(l.fetchedAt)})]})]}),T&&e.jsx("p",{className:"ak-ark-account-error",children:T})]})}const se={title:"Components/ArknightsAccount",component:x},L={channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},X=`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`,Y=`data:image/svg+xml;utf8,${encodeURIComponent(X)}`,f={render:()=>e.jsx(x,{authState:null,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},A={render:()=>e.jsx(x,{authState:L,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},S={render:()=>e.jsx(x,{authState:L,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.setItem("ak-events-arknights-linked-account",JSON.stringify({nickName:"Doctor",level:120,avatarUrl:Y,fetchedAt:"2026-09-28T14:05:00.000Z"})),e.jsx(t,{}))]};var b,w,$;f.parameters={...f.parameters,docs:{...(b=f.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...($=(w=f.parameters)==null?void 0:w.docs)==null?void 0:$.source}}};var I,E,F;A.parameters={...A.parameters,docs:{...(I=A.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(F=(E=A.parameters)==null?void 0:E.docs)==null?void 0:F.source}}};var R,D,_;S.parameters={...S.parameters,docs:{...(R=S.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
}`,...(_=(D=S.parameters)==null?void 0:D.docs)==null?void 0:_.source}}};const oe=["Disconnected","Connected","ConnectedWithAccount"];export{A as Connected,S as ConnectedWithAccount,f as Disconnected,oe as __namedExportsOrder,se as default};
