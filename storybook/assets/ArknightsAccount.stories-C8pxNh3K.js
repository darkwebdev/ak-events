import{j as e}from"./jsx-runtime-DAYC0_j2.js";import{r as g}from"./iframe-BLC2cCHi.js";import{u as G}from"./useNow-OnZSshtg.js";import{f as B,a as M}from"./dates-CioEEh1n.js";import"./preload-helper-C1FmrZbK.js";function U(n,s){const[l,o]=g.useState(()=>{try{const a=localStorage.getItem(n);return a?JSON.parse(a):s}catch{return s}});return g.useEffect(()=>{try{localStorage.setItem(n,JSON.stringify(l))}catch{}},[n,l]),[l,o]}const Y="https://ak-account-api-705516204230.us-central1.run.app/graphql",Q=Y;async function N(n,s){var a,h;const o=await(await fetch(Q,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:n,variables:s})})).json();if((a=o.errors)!=null&&a.length)throw new Error(((h=o.errors[0])==null?void 0:h.message)||"GraphQL request failed");return o.data}async function Z(n,s="en"){return(await N(`mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,{email:n,server:s})).sendAuthCode}async function z(n,s,l="en"){return(await N(`mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
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
        sanityPotions {
          itemId
          sanity
          count
          expiresAt
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
    }`;function X(n){return n.replace(/\n\s*sanity\n\s*maxSanity/,"").replace(/\n\s*sanityPotions \{[^}]*\}/,"").replace(/\n\s*myStages\([^)]*\) \{[^}]*\}/,"")}const ee=3;async function te({channelUid:n,yostarToken:s,server:l}){var h,k,y,v,p,f,c,S,A,x,i,u;const o={channelUid:n,yostarToken:s,server:l};let a;try{a=await N($,o)}catch(t){if(!/Cannot query field ['"](myStages|sanity|maxSanity|sanityPotions)['"]/.test(String(t==null?void 0:t.message)))throw t;a=await N(X($),o)}return{nickName:((h=a.myStatus)==null?void 0:h.nickName)??null,level:((k=a.myStatus)==null?void 0:k.level)??null,avatarUrl:((y=a.myStatus)==null?void 0:y.avatarUrl)??null,sanity:((v=a.myStatus)==null?void 0:v.sanity)??null,maxSanity:((p=a.myStatus)==null?void 0:p.maxSanity)??null,sanityPotions:(((f=a.myInventory)==null?void 0:f.sanityPotions)??[]).map(t=>({itemId:t.itemId,sanity:t.sanity,count:t.count,expiresAt:t.expiresAt??null})),threeStarStages:(a.myStages??[]).filter(t=>t.state>=ee).map(t=>t.stageId),orundum:((c=a.myInventory)==null?void 0:c.orundum)??0,originitePrime:((S=a.myInventory)==null?void 0:S.originitePrime)??0,headhuntingPermits:((A=a.myInventory)==null?void 0:A.headhuntingPermits)??0,tenHeadhuntingPermits:((x=a.myInventory)==null?void 0:x.tenHeadhuntingPermits)??0,bannerProgress:{items:Object.fromEntries((((i=a.myInventory)==null?void 0:i.bannerItems)??[]).map(t=>[t.itemId,t.count])),pools:Object.fromEntries((((u=a.myInventory)==null?void 0:u.limitedPools)??[]).map(t=>[t.poolId,{pulls:t.pulls,freeCharClaimed:t.freeCharClaimed}]))},roster:Object.fromEntries((a.myRoster??[]).filter(t=>t.charId).map(t=>[t.charId,t.potentialRank??0]))}}function ne({date:n}){const s=G();return e.jsxs("time",{className:"ak-ark-account-updated",dateTime:n.toISOString(),title:M(n),children:["Updated ",B(n,s)]})}function I({authState:n,setAuthState:s,onFetched:l,onLogout:o}){const a=!!n,[h,k]=g.useState("email"),[y,v]=g.useState(""),[p,f]=g.useState(""),[c,S]=U("ak-events-arknights-linked-account",null),[A,x]=U("ak-events-arknights-warning-hidden",!1),[i,u]=g.useState(!1),[t,d]=g.useState(null);async function V(m){m.preventDefault(),d(null),u(!0);try{const r=await Z(y);r.success?k("code"):d(r.message||"Failed to send code.")}catch(r){d(r.message)}finally{u(!1)}}async function K(m){m.preventDefault(),d(null),u(!0);try{const r=await z(y,p);if(r.success){const j={channelUid:r.channelUid,yostarToken:r.yostarToken,server:r.server};s(j),f(""),await w(j)}else d(r.error||"Invalid or expired code.")}catch(r){d(r.message)}finally{u(!1)}}function J(){k("email"),f(""),d(null)}function W(){s(null),S(null),o==null||o(),k("email"),v(""),d(null)}async function w(m){d(null),u(!0);try{const r=await te(m);S({nickName:r.nickName,level:r.level,avatarUrl:r.avatarUrl,fetchedAt:new Date().toISOString()}),l(r)}catch(r){console.error("[ArknightsAccount] fetchAccountData failed:",r);const j=(r==null?void 0:r.message)||String(r);d(`Could not fetch account data: ${j}. Try Refresh, or log out and reconnect if your session expired.`)}finally{u(!1)}}return e.jsxs("div",{className:"ak-aside ak-arknights-account",children:[e.jsx("h3",{className:"ak-aside-title",children:"Arknights Account"}),!a&&h==="email"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:V,children:[!A&&e.jsxs("div",{className:"ak-ark-account-warning",children:[e.jsx("button",{type:"button",className:"ak-ark-account-warning-close",onClick:()=>x(!0),"aria-label":"Hide this warning",title:"Hide",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18",strokeLinecap:"round"}),e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18",strokeLinecap:"round"})]})}),e.jsx("p",{children:"This is not an official Yostar or Hypergryph service. Your login goes through an unofficial third-party server, which receives access to your account. Logging in through third-party tools may break the game's terms of service and can put your account at risk. Use it at your own risk."}),e.jsx("p",{children:"Connecting, and every data refresh after that, logs you out of the Arknights game."})]}),e.jsx("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:y,onChange:m=>v(m.target.value),required:!0,disabled:i}),e.jsx("button",{type:"submit",className:"ak-button",disabled:i||!y,children:i?"Sending…":"Send code"})]}),!a&&h==="code"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:K,children:[e.jsxs("p",{className:"ak-ark-account-hint",children:["Enter the code sent to ",y]}),e.jsx("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:p,onChange:m=>f(m.target.value),required:!0,disabled:i}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"submit",className:"ak-button",disabled:i||!p,children:i?"Verifying…":"Verify"}),e.jsx("button",{type:"button",className:"ak-button-secondary",onClick:J,disabled:i,children:"Cancel"})]})]}),a&&e.jsxs("div",{className:"ak-ark-account-connected",children:[c&&e.jsxs("p",{className:"ak-ark-account-hint ak-ark-account-linked",children:[c.avatarUrl&&e.jsx("img",{className:"ak-ark-account-avatar",src:c.avatarUrl,alt:"",width:28,height:28}),"Linked: ",c.nickName," (Lv. ",c.level,")",e.jsx("button",{type:"button",className:"ak-ark-account-logout",onClick:W,disabled:i,"aria-label":"Log out of Arknights account",title:"Log out",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",strokeLinecap:"round"}),e.jsx("polyline",{points:"16 17 21 12 16 7",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12",strokeLinecap:"round"})]})})]}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"button",className:"ak-button",onClick:()=>w(n),disabled:i,children:i?"Fetching…":"Refresh data"}),(c==null?void 0:c.fetchedAt)&&e.jsx(ne,{date:new Date(c.fetchedAt)})]})]}),t&&e.jsx("p",{className:"ak-ark-account-error",children:t})]})}const de={title:"Components/ArknightsAccount",component:I},q={channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},ae=`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`,re=`data:image/svg+xml;utf8,${encodeURIComponent(ae)}`,C={render:()=>e.jsx(I,{authState:null,setAuthState:()=>{},onFetched:()=>{}}),decorators:[n=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(n,{}))]},T={render:()=>e.jsx(I,{authState:q,setAuthState:()=>{},onFetched:()=>{}}),decorators:[n=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(n,{}))]},b={render:()=>e.jsx(I,{authState:q,setAuthState:()=>{},onFetched:()=>{}}),decorators:[n=>(localStorage.setItem("ak-events-arknights-linked-account",JSON.stringify({nickName:"Doctor",level:120,avatarUrl:re,fetchedAt:"2026-09-28T14:05:00.000Z"})),e.jsx(n,{}))]};var E,P,F;C.parameters={...C.parameters,docs:{...(E=C.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(F=(P=C.parameters)==null?void 0:P.docs)==null?void 0:F.source}}};var R,_,L;T.parameters={...T.parameters,docs:{...(R=T.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(L=(_=T.parameters)==null?void 0:_.docs)==null?void 0:L.source}}};var O,D,H;b.parameters={...b.parameters,docs:{...(O=b.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(H=(D=b.parameters)==null?void 0:D.docs)==null?void 0:H.source}}};const ue=["Disconnected","Connected","ConnectedWithAccount"];export{T as Connected,b as ConnectedWithAccount,C as Disconnected,ue as __namedExportsOrder,de as default};
