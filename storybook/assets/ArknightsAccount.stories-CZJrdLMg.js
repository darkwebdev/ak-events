import{j as e}from"./jsx-runtime-BlLNtz3U.js";import{r as g}from"./iframe-B1yqWidp.js";import{u as W}from"./useNow-CD1ZFJL9.js";import{f as B,a as G}from"./dates-CioEEh1n.js";import"./preload-helper-C1FmrZbK.js";function I(t,r){const[i,n]=g.useState(()=>{try{const o=localStorage.getItem(t);return o?JSON.parse(o):r}catch{return r}});return g.useEffect(()=>{try{localStorage.setItem(t,JSON.stringify(i))}catch{}},[t,i]),[i,n]}const M="https://ak-account-api-705516204230.us-central1.run.app/graphql",Y=M;async function b(t,r){var o,h;const n=await(await fetch(Y,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,variables:r})})).json();if((o=n.errors)!=null&&o.length)throw new Error(((h=n.errors[0])==null?void 0:h.message)||"GraphQL request failed");return n.data}async function Z(t,r="en"){return(await b(`mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,{email:t,server:r})).sendAuthCode}async function z(t,r,i="en"){return(await b(`mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        server
        error
      }
    }`,{email:t,code:r,server:i})).getAuthToken}async function Q({channelUid:t,yostarToken:r,server:i}){var o,h,k,m,v,p,y,c,A;const n=await b(`query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
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
    }`,{channelUid:t,yostarToken:r,server:i});return{nickName:((o=n.myStatus)==null?void 0:o.nickName)??null,level:((h=n.myStatus)==null?void 0:h.level)??null,avatarUrl:((k=n.myStatus)==null?void 0:k.avatarUrl)??null,orundum:((m=n.myInventory)==null?void 0:m.orundum)??0,originitePrime:((v=n.myInventory)==null?void 0:v.originitePrime)??0,headhuntingPermits:((p=n.myInventory)==null?void 0:p.headhuntingPermits)??0,tenHeadhuntingPermits:((y=n.myInventory)==null?void 0:y.tenHeadhuntingPermits)??0,bannerProgress:{items:Object.fromEntries((((c=n.myInventory)==null?void 0:c.bannerItems)??[]).map(s=>[s.itemId,s.count])),pools:Object.fromEntries((((A=n.myInventory)==null?void 0:A.limitedPools)??[]).map(s=>[s.poolId,{pulls:s.pulls,freeCharClaimed:s.freeCharClaimed}]))},roster:Object.fromEntries((n.myRoster??[]).filter(s=>s.charId).map(s=>[s.charId,s.potentialRank??0]))}}function X({date:t}){const r=W();return e.jsxs("time",{className:"ak-ark-account-updated",dateTime:t.toISOString(),title:G(t),children:["Updated ",B(t,r)]})}function C({authState:t,setAuthState:r,onFetched:i,onLogout:n}){const o=!!t,[h,k]=g.useState("email"),[m,v]=g.useState(""),[p,y]=g.useState(""),[c,A]=I("ak-events-arknights-linked-account",null),[s,_]=I("ak-events-arknights-warning-hidden",!1),[l,f]=g.useState(!1),[N,d]=g.useState(null);async function V(u){u.preventDefault(),d(null),f(!0);try{const a=await Z(m);a.success?k("code"):d(a.message||"Failed to send code.")}catch(a){d(a.message)}finally{f(!1)}}async function q(u){u.preventDefault(),d(null),f(!0);try{const a=await z(m,p);if(a.success){const T={channelUid:a.channelUid,yostarToken:a.yostarToken,server:a.server};r(T),y(""),await w(T)}else d(a.error||"Invalid or expired code.")}catch(a){d(a.message)}finally{f(!1)}}function K(){k("email"),y(""),d(null)}function J(){r(null),A(null),n==null||n(),k("email"),v(""),d(null)}async function w(u){d(null),f(!0);try{const a=await Q(u);A({nickName:a.nickName,level:a.level,avatarUrl:a.avatarUrl,fetchedAt:new Date().toISOString()}),i(a)}catch(a){console.error("[ArknightsAccount] fetchAccountData failed:",a),d("Could not fetch account data — your session may have expired. Please reconnect."),r(null),k("email")}finally{f(!1)}}return e.jsxs("div",{className:"ak-aside ak-arknights-account",children:[e.jsx("h3",{className:"ak-aside-title",children:"Arknights Account"}),!o&&h==="email"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:V,children:[!s&&e.jsxs("div",{className:"ak-ark-account-warning",children:[e.jsx("button",{type:"button",className:"ak-ark-account-warning-close",onClick:()=>_(!0),"aria-label":"Hide this warning",title:"Hide",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18",strokeLinecap:"round"}),e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18",strokeLinecap:"round"})]})}),e.jsx("p",{children:"This is not an official Yostar or Hypergryph service. Your login goes through an unofficial third-party server, which receives access to your account. Logging in through third-party tools may break the game's terms of service and can put your account at risk. Use it at your own risk."}),e.jsx("p",{children:"Connecting, and every data refresh after that, logs you out of the Arknights game."})]}),e.jsx("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:m,onChange:u=>v(u.target.value),required:!0,disabled:l}),e.jsx("button",{type:"submit",className:"ak-button",disabled:l||!m,children:l?"Sending…":"Send code"})]}),!o&&h==="code"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:q,children:[e.jsxs("p",{className:"ak-ark-account-hint",children:["Enter the code sent to ",m]}),e.jsx("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:p,onChange:u=>y(u.target.value),required:!0,disabled:l}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"submit",className:"ak-button",disabled:l||!p,children:l?"Verifying…":"Verify"}),e.jsx("button",{type:"button",className:"ak-button-secondary",onClick:K,disabled:l,children:"Cancel"})]})]}),o&&e.jsxs("div",{className:"ak-ark-account-connected",children:[c&&e.jsxs("p",{className:"ak-ark-account-hint ak-ark-account-linked",children:[c.avatarUrl&&e.jsx("img",{className:"ak-ark-account-avatar",src:c.avatarUrl,alt:"",width:28,height:28}),"Linked: ",c.nickName," (Lv. ",c.level,")",e.jsx("button",{type:"button",className:"ak-ark-account-logout",onClick:J,disabled:l,"aria-label":"Log out of Arknights account",title:"Log out",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",strokeLinecap:"round"}),e.jsx("polyline",{points:"16 17 21 12 16 7",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12",strokeLinecap:"round"})]})})]}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"button",className:"ak-button",onClick:()=>w(t),disabled:l,children:l?"Fetching…":"Refresh data"}),(c==null?void 0:c.fetchedAt)&&e.jsx(X,{date:new Date(c.fetchedAt)})]})]}),N&&e.jsx("p",{className:"ak-ark-account-error",children:N})]})}const ce={title:"Components/ArknightsAccount",component:C},O={channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},ee=`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`,te=`data:image/svg+xml;utf8,${encodeURIComponent(ee)}`,S={render:()=>e.jsx(C,{authState:null,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},x={render:()=>e.jsx(C,{authState:O,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},j={render:()=>e.jsx(C,{authState:O,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.setItem("ak-events-arknights-linked-account",JSON.stringify({nickName:"Doctor",level:120,avatarUrl:te,fetchedAt:"2026-09-28T14:05:00.000Z"})),e.jsx(t,{}))]};var U,$,E;S.parameters={...S.parameters,docs:{...(U=S.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(E=($=S.parameters)==null?void 0:$.docs)==null?void 0:E.source}}};var P,F,R;x.parameters={...x.parameters,docs:{...(P=x.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(R=(F=x.parameters)==null?void 0:F.docs)==null?void 0:R.source}}};var D,L,H;j.parameters={...j.parameters,docs:{...(D=j.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(H=(L=j.parameters)==null?void 0:L.docs)==null?void 0:H.source}}};const ie=["Disconnected","Connected","ConnectedWithAccount"];export{x as Connected,j as ConnectedWithAccount,S as Disconnected,ie as __namedExportsOrder,ce as default};
