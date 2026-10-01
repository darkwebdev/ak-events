import{j as e}from"./jsx-runtime-DXoopVsM.js";import{r as k}from"./iframe-ByFmYL5X.js";import{u as H}from"./useNow-C8yeknLI.js";import{f as K,a as J}from"./dates-CioEEh1n.js";import"./preload-helper-C1FmrZbK.js";function G(t,s){const[i,a]=k.useState(()=>{try{const o=localStorage.getItem(t);return o?JSON.parse(o):s}catch{return s}});return k.useEffect(()=>{try{localStorage.setItem(t,JSON.stringify(i))}catch{}},[t,i]),[i,a]}const W="https://ak-account-api-705516204230.us-central1.run.app/graphql",B=W;async function C(t,s){var o,u;const a=await(await fetch(B,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,variables:s})})).json();if((o=a.errors)!=null&&o.length)throw new Error(((u=a.errors[0])==null?void 0:u.message)||"GraphQL request failed");return a.data}async function M(t,s="en"){return(await C(`mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,{email:t,server:s})).sendAuthCode}async function Z(t,s,i="en"){return(await C(`mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        server
        error
      }
    }`,{email:t,code:s,server:i})).getAuthToken}async function z({channelUid:t,yostarToken:s,server:i}){var o,u,h,m,f,g,p,c,v;const a=await C(`query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
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
    }`,{channelUid:t,yostarToken:s,server:i});return{nickName:((o=a.myStatus)==null?void 0:o.nickName)??null,level:((u=a.myStatus)==null?void 0:u.level)??null,avatarUrl:((h=a.myStatus)==null?void 0:h.avatarUrl)??null,orundum:((m=a.myInventory)==null?void 0:m.orundum)??0,originitePrime:((f=a.myInventory)==null?void 0:f.originitePrime)??0,headhuntingPermits:((g=a.myInventory)==null?void 0:g.headhuntingPermits)??0,tenHeadhuntingPermits:((p=a.myInventory)==null?void 0:p.tenHeadhuntingPermits)??0,bannerProgress:{items:Object.fromEntries((((c=a.myInventory)==null?void 0:c.bannerItems)??[]).map(n=>[n.itemId,n.count])),pools:Object.fromEntries((((v=a.myInventory)==null?void 0:v.limitedPools)??[]).map(n=>[n.poolId,{pulls:n.pulls,freeCharClaimed:n.freeCharClaimed}]))},roster:Object.fromEntries((a.myRoster??[]).filter(n=>n.charId).map(n=>[n.charId,n.potentialRank??0]))}}function Q({date:t}){const s=H();return e.jsxs("time",{className:"ak-ark-account-updated",dateTime:t.toISOString(),title:J(t),children:["Updated ",K(t,s)]})}function j({authState:t,setAuthState:s,onFetched:i,onLogout:a}){const o=!!t,[u,h]=k.useState("email"),[m,f]=k.useState(""),[g,p]=k.useState(""),[c,v]=G("ak-events-arknights-linked-account",null),[n,y]=k.useState(!1),[N,l]=k.useState(null);async function _(d){d.preventDefault(),l(null),y(!0);try{const r=await M(m);r.success?h("code"):l(r.message||"Failed to send code.")}catch(r){l(r.message)}finally{y(!1)}}async function L(d){d.preventDefault(),l(null),y(!0);try{const r=await Z(m,g);if(r.success){const T={channelUid:r.channelUid,yostarToken:r.yostarToken,server:r.server};s(T),p(""),await b(T)}else l(r.error||"Invalid or expired code.")}catch(r){l(r.message)}finally{y(!1)}}function V(){h("email"),p(""),l(null)}function q(){s(null),v(null),a==null||a(),h("email"),f(""),l(null)}async function b(d){l(null),y(!0);try{const r=await z(d);v({nickName:r.nickName,level:r.level,avatarUrl:r.avatarUrl,fetchedAt:new Date().toISOString()}),i(r)}catch(r){console.error("[ArknightsAccount] fetchAccountData failed:",r),l("Could not fetch account data — your session may have expired. Please reconnect."),s(null),h("email")}finally{y(!1)}}return e.jsxs("div",{className:"ak-aside ak-arknights-account",children:[e.jsx("h3",{className:"ak-aside-title",children:"Arknights Account"}),!o&&u==="email"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:_,children:[e.jsx("p",{className:"ak-ark-account-warning",children:"Fetching your data will log you out of Arknights on this device, every time you refresh it."}),e.jsx("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:m,onChange:d=>f(d.target.value),required:!0,disabled:n}),e.jsx("button",{type:"submit",className:"ak-button",disabled:n||!m,children:n?"Sending…":"Send code"})]}),!o&&u==="code"&&e.jsxs("form",{className:"ak-ark-account-form",onSubmit:L,children:[e.jsxs("p",{className:"ak-ark-account-hint",children:["Enter the code sent to ",m]}),e.jsx("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:g,onChange:d=>p(d.target.value),required:!0,disabled:n}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"submit",className:"ak-button",disabled:n||!g,children:n?"Verifying…":"Verify"}),e.jsx("button",{type:"button",className:"ak-button-secondary",onClick:V,disabled:n,children:"Cancel"})]})]}),o&&e.jsxs("div",{className:"ak-ark-account-connected",children:[c&&e.jsxs("p",{className:"ak-ark-account-hint ak-ark-account-linked",children:[c.avatarUrl&&e.jsx("img",{className:"ak-ark-account-avatar",src:c.avatarUrl,alt:"",width:28,height:28}),"Linked: ",c.nickName," (Lv. ",c.level,")",e.jsx("button",{type:"button",className:"ak-ark-account-logout",onClick:q,disabled:n,"aria-label":"Log out of Arknights account",title:"Log out",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",strokeLinecap:"round"}),e.jsx("polyline",{points:"16 17 21 12 16 7",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12",strokeLinecap:"round"})]})})]}),e.jsxs("div",{className:"ak-ark-account-actions",children:[e.jsx("button",{type:"button",className:"ak-button",onClick:()=>b(t),disabled:n,children:n?"Fetching…":"Refresh data"}),(c==null?void 0:c.fetchedAt)&&e.jsx(Q,{date:new Date(c.fetchedAt)})]})]}),N&&e.jsx("p",{className:"ak-ark-account-error",children:N})]})}const se={title:"Components/ArknightsAccount",component:j},O={channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},X=`<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`,Y=`data:image/svg+xml;utf8,${encodeURIComponent(X)}`,A={render:()=>e.jsx(j,{authState:null,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},S={render:()=>e.jsx(j,{authState:O,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.removeItem("ak-events-arknights-linked-account"),e.jsx(t,{}))]},x={render:()=>e.jsx(j,{authState:O,setAuthState:()=>{},onFetched:()=>{}}),decorators:[t=>(localStorage.setItem("ak-events-arknights-linked-account",JSON.stringify({nickName:"Doctor",level:120,avatarUrl:Y,fetchedAt:"2026-09-28T14:05:00.000Z"})),e.jsx(t,{}))]};var I,U,w;A.parameters={...A.parameters,docs:{...(I=A.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(w=(U=A.parameters)==null?void 0:U.docs)==null?void 0:w.source}}};var $,E,F;S.parameters={...S.parameters,docs:{...($=S.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [(Story: React.ComponentType) => {
    localStorage.removeItem('ak-events-arknights-linked-account');
    return <Story />;
  }]
}`,...(F=(E=S.parameters)==null?void 0:E.docs)==null?void 0:F.source}}};var P,R,D;x.parameters={...x.parameters,docs:{...(P=x.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
}`,...(D=(R=x.parameters)==null?void 0:R.docs)==null?void 0:D.source}}};const oe=["Disconnected","Connected","ConnectedWithAccount"];export{S as Connected,x as ConnectedWithAccount,A as Disconnected,oe as __namedExportsOrder,se as default};
