import{j as e}from"./jsx-runtime-COIlHvu2.js";import{r as k}from"./iframe-Np4jEYQr.js";import{u as G}from"./useNow-Drgdgcrd.js";import{f as B,a as M}from"./dates-CioEEh1n.js";import"./preload-helper-C1FmrZbK.js";function I(n,s){const[l,o]=k.useState(()=>{try{const a=localStorage.getItem(n);return a?JSON.parse(a):s}catch{return s}});return k.useEffect(()=>{try{localStorage.setItem(n,JSON.stringify(l))}catch{}},[n,l]),[l,o]}const Y="https://ak-account-api-705516204230.us-central1.run.app/graphql",Q=Y;async function T(n,s){var a,m;const o=await(await fetch(Q,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:n,variables:s})})).json();if((a=o.errors)!=null&&a.length)throw new Error(((m=o.errors[0])==null?void 0:m.message)||"GraphQL request failed");return o.data}async function Z(n,s="en"){return(await T(`mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,{email:n,server:s})).sendAuthCode}async function z(n,s,l="en"){return(await T(`mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        server
        error
      }
    }`,{email:n,code:s,server:l})).getAuthToken}const $=`query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
      myStatus(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        nickName
        level
        uid
        avatarUrl
        sanity
        maxSanity
      }
      myInventory(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        orundum
        originitePrime
        headhuntingPermits
        tenHeadhuntingPermits
        bannerItems {
          itemId
          count
        }
        limitedPools {
          poolId
          pulls
          freeCharClaimed
        }
      }
      myRoster(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        charId
        potentialRank
      }
      myStages(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        stageId
        state
      }
    }`;function X(n){return n.replace(/\n\s*sanity\n\s*maxSanity/,"").replace(/\n\s*myStages\([^)]*\) \{[^}]*\}/,"")}const ee=3;async function te({channelUid:n,yostarToken:s,server:l}){var m,g,h,f,y,p,i,v,S,A,c;const o={channelUid:n,yostarToken:s,server:l};let a;try{a=await T($,o)}catch(t){if(!/Cannot query field ['"](myStages|sanity|maxSanity)['"]/.test(String(t==null?void 0:t.message)))throw t;a=await T(X($),o)}return{nickName:((m=a.myStatus)==null?void 0:m.nickName)??null,level:((g=a.myStatus)==null?void 0:g.level)??null,avatarUrl:((h=a.myStatus)==null?void 0:h.avatarUrl)??null,sanity:((f=a.myStatus)==null?void 0:f.sanity)??null,maxSanity:((y=a.myStatus)==null?void 0:y.maxSanity)??null,threeStarStages:(a.myStages??[]).filter(t=>t.state>=ee).map(t=>t.stageId),orundum:((p=a.myInventory)==null?void 0:p.orundum)??0,originitePrime:((i=a.myInventory)==null?void 0:i.originitePrime)??0,headhuntingPermits:((v=a.myInventory)==null?void 0:v.headhuntingPermits)??0,tenHeadhuntingPermits:((S=a.myInventory)==null?void 0:S.tenHeadhuntingPermits)??0,bannerProgress:{items:Object.fromEntries((((A=a.myInventory)==null?void 0:A.bannerItems)??[]).map(t=>[t.itemId,t.count])),pools:Object.fromEntries((((c=a.myInventory)==null?void 0:c.limitedPools)??[]).map(t=>[t.poolId,{pulls:t.pulls,freeCharClaimed:t.freeCharClaimed}]))},roster:Object.fromEntries((a.myRoster??[]).filter(t=>t.charId).map(t=>[t.charId,t.potentialRank??0]))}}function ne({date:n}){const s=G();return e.jsxs("time",{className:"ak-ark-account-updated",dateTime:n.toISOString(),title:M(n),children:["Updated ",B(n,s)]})}function b({authState:n,setAuthState:s,onFetched:l,onLogout:o}){const a=!!n,[m,g]=k.useState("email"),[h,f]=k.useState(""),[y,p]=k.useState(""),[i,v]=I("ak-events-arknights-linked-account",null),[S,A]=I("ak-events-arknights-warning-hidden",!1),[c,t]=k.useState(!1),[N,d]=k.useState(null);async function V(u){u.preventDefault(),d(null),t(!0);try{const r=await Z(h);r.success?g("code"):d(r.message||"Failed to send code.")}catch(r){d(r.message)}finally{t(!1)}}async function K(u){u.preventDefault(),d(null),t(!0);try{const r=await z(h,y);if(r.success){const U={channelUid:r.channelUid,yostarToken:r.yostarToken,server:r.server};s(U),p(""),await w(U)}else d(r.error||"Invalid or expired code.")}catch(r){d(r.message)}finally{t(!1)}}function J(){g("email"),p(""),d(null)}function W(){s(null),v(null),o==null||o(),g("email"),f(""),d(null)}async function w(u){d(null),t(!0);try{const r=await te(u);v({nickName:r.nickName,level:r.level,avatarUrl:r.avatarUrl,fetchedAt:new Date().toISOString()}),l(r)}catch(r){console.error("[ArknightsAccount] fetchAccountData failed:",r),d("Could not fetch account data — your session may have expired. Please reconnect."),s(null),g("email")}finally{t(!1)}}return e.jsxs("div",{className:"ak-aside ak-arknights-account",children:[e.jsx("h3",{className:"ak-aside-title",children:"Arknights Account"}),!a&&m==="email"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:V,children:[!S&&e.jsxs("div",{className:"ak-ark-account-warning",children:[e.jsx("button",{type:"button",className:"ak-ark-account-warning-close",onClick:()=>A(!0),"aria-label":"Hide this warning",title:"Hide",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18",strokeLinecap:"round"}),e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18",strokeLinecap:"round"})]})}),e.jsx("p",{children:"This is not an official Yostar or Hypergryph service. Your login goes through an unofficial third-party server, which receives access to your account. Logging in through third-party tools may break the game's terms of service and can put your account at risk. Use it at your own risk."}),e.jsx("p",{children:"Connecting, and every data refresh after that, logs you out of the Arknights game."})]}),e.jsx("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:h,onChange:u=>f(u.target.value),required:!0,disabled:c}),e.jsx("button",{type:"submit",className:"ak-button",disabled:c||!h,children:c?"Sending…":"Send code"})]}),!a&&m==="code"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:K,children:[e.jsxs("p",{className:"ak-ark-account-hint",children:["Enter the code sent to ",h]}),e.jsx("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:y,onChange:u=>p(u.target.value),required:!0,disabled:c}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"submit",className:"ak-button",disabled:c||!y,children:c?"Verifying…":"Verify"}),e.jsx("button",{type:"button",className:"ak-button-secondary",onClick:J,disabled:c,children:"Cancel"})]})]}),a&&e.jsxs("div",{className:"ak-ark-account-connected",children:[i&&e.jsxs("p",{className:"ak-ark-account-hint ak-ark-account-linked",children:[i.avatarUrl&&e.jsx("img",{className:"ak-ark-account-avatar",src:i.avatarUrl,alt:"",width:28,height:28}),"Linked: ",i.nickName," (Lv. ",i.level,")",e.jsx("button",{type:"button",className:"ak-ark-account-logout",onClick:W,disabled:c,"aria-label":"Log out of Arknights account",title:"Log out",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",strokeLinecap:"round"}),e.jsx("polyline",{points:"16 17 21 12 16 7",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12",strokeLinecap:"round"})]})})]}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"button",className:"ak-button",onClick:()=>w(n),disabled:c,children:c?"Fetching…":"Refresh data"}),(i==null?void 0:i.fetchedAt)&&e.jsx(ne,{date:new Date(i.fetchedAt)})]})]}),N&&e.jsx("p",{className:"ak-ark-account-error",children:N})]})}const de={title:"Components/ArknightsAccount",component:b},q={channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},ae=`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`,re=`data:image/svg+xml;utf8,${encodeURIComponent(ae)}`,x={render:()=>e.jsx(b,{authState:null,setAuthState:()=>{},onFetched:()=>{}}),decorators:[n=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(n,{}))]},j={render:()=>e.jsx(b,{authState:q,setAuthState:()=>{},onFetched:()=>{}}),decorators:[n=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(n,{}))]},C={render:()=>e.jsx(b,{authState:q,setAuthState:()=>{},onFetched:()=>{}}),decorators:[n=>(localStorage.setItem("ak-events-arknights-linked-account",JSON.stringify({nickName:"Doctor",level:120,avatarUrl:re,fetchedAt:"2026-09-28T14:05:00.000Z"})),e.jsx(n,{}))]};var E,F,P;x.parameters={...x.parameters,docs:{...(E=x.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(P=(F=x.parameters)==null?void 0:F.docs)==null?void 0:P.source}}};var R,_,L;j.parameters={...j.parameters,docs:{...(R=j.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(L=(_=j.parameters)==null?void 0:_.docs)==null?void 0:L.source}}};var O,D,H;C.parameters={...C.parameters,docs:{...(O=C.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(H=(D=C.parameters)==null?void 0:D.docs)==null?void 0:H.source}}};const ue=["Disconnected","Connected","ConnectedWithAccount"];export{j as Connected,C as ConnectedWithAccount,x as Disconnected,ue as __namedExportsOrder,de as default};
