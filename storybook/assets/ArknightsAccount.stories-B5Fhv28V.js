import{r as m,R as t}from"./iframe-nrKci1Hc.js";import"./preload-helper-C1FmrZbK.js";function x(a,n){const[c,s]=m.useState(()=>{try{const r=localStorage.getItem(a);return r?JSON.parse(r):n}catch{return n}});return m.useEffect(()=>{try{localStorage.setItem(a,JSON.stringify(c))}catch{}},[a,c]),[c,s]}const F="https://ak-account-api-705516204230.us-central1.run.app/graphql";async function A(a,n){var r;const s=await(await fetch(F,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:a,variables:n})})).json();if((r=s.errors)!=null&&r.length)throw new Error(s.errors[0].message||"GraphQL request failed");return s.data}async function L(a,n="en"){return(await A(`mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,{email:a,server:n})).sendAuthCode}async function O(a,n,c="en"){return(await A(`mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        deviceId
        server
        error
      }
    }`,{email:a,code:n,server:c})).getAuthToken}async function R(a,n){try{return(await A(`query GetPlayerAvatarUrl($playerId: String!, $server: String!) {
        getPlayerAvatarUrl(playerId: $playerId, server: $server)
      }`,{playerId:a,server:n})).getPlayerAvatarUrl??null}catch(c){return console.error("[arkCharsApi] getPlayerAvatarUrl failed:",c),null}}async function j({channelUid:a,yostarToken:n,deviceId:c,server:s}){var f,y,k,u,S,o;const r=await A(`query FetchAccountData(
      $channelUid: String!
      $yostarToken: String!
      $deviceId: String
      $server: String!
    ) {
      myStatus(
        channelUid: $channelUid
        yostarToken: $yostarToken
        deviceId: $deviceId
        server: $server
      ) {
        nickName
        level
        uid
      }
      myInventory(
        channelUid: $channelUid
        yostarToken: $yostarToken
        deviceId: $deviceId
        server: $server
      ) {
        orundum
        originitePrime
        headhuntingPermits
      }
    }`,{channelUid:a,yostarToken:n,deviceId:c,server:s}),h=((f=r.myStatus)==null?void 0:f.uid)??null,d=h?await R(h,s):null;return{nickName:((y=r.myStatus)==null?void 0:y.nickName)??null,level:((k=r.myStatus)==null?void 0:k.level)??null,avatarUrl:d,orundum:((u=r.myInventory)==null?void 0:u.orundum)??0,originitePrime:((S=r.myInventory)==null?void 0:S.originitePrime)??0,headhuntingPermits:((o=r.myInventory)==null?void 0:o.headhuntingPermits)??0}}function N({authState:a,setAuthState:n,onFetched:c}){const s=!!a,[r,h]=m.useState("email"),[d,f]=m.useState(""),[y,k]=m.useState(""),[u,S]=x("ak-events-arknights-linked-account",null),[o,g]=m.useState(!1),[E,i]=m.useState(null);async function _(l){l.preventDefault(),i(null),g(!0);try{const e=await L(d);e.success?h("code"):i(e.message||"Failed to send code.")}catch(e){i(e.message)}finally{g(!1)}}async function D(l){l.preventDefault(),i(null),g(!0);try{const e=await O(d,y);if(e.success){const C={channelUid:e.channelUid,yostarToken:e.yostarToken,deviceId:e.deviceId,server:e.server};n(C),k(""),await $(C)}else i(e.error||"Invalid or expired code.")}catch(e){i(e.message)}finally{g(!1)}}function q(){h("email"),k(""),i(null)}async function $(l){i(null),g(!0);try{const e=await j(l);S({nickName:e.nickName,level:e.level,avatarUrl:e.avatarUrl}),c(e)}catch(e){console.error("[ArknightsAccount] fetchAccountData failed:",e),i("Could not fetch account data — your session may have expired. Please reconnect."),n(null),h("email")}finally{g(!1)}}return t.createElement("div",{className:"ak-aside ak-arknights-account"},t.createElement("h3",{className:"ak-aside-title"},"Arknights Account"),!s&&r==="email"&&t.createElement("form",{className:"ak-ark-account-form",onSubmit:_},t.createElement("p",{className:"ak-ark-account-warning"},"Fetching your data will log you out of Arknights on this device, every time you refresh it."),t.createElement("input",{type:"email",className:"ak-text-input",placeholder:"Email",value:d,onChange:l=>f(l.target.value),required:!0,disabled:o}),t.createElement("button",{type:"submit",className:"ak-button",disabled:o||!d},o?"Sending…":"Send code")),!s&&r==="code"&&t.createElement("form",{className:"ak-ark-account-form",onSubmit:D},t.createElement("p",{className:"ak-ark-account-hint"},"Enter the code sent to ",d),t.createElement("input",{type:"text",inputMode:"numeric",className:"ak-text-input",placeholder:"Code",value:y,onChange:l=>k(l.target.value),required:!0,disabled:o}),t.createElement("div",{className:"ak-ark-account-actions"},t.createElement("button",{type:"submit",className:"ak-button",disabled:o||!y},o?"Verifying…":"Verify"),t.createElement("button",{type:"button",className:"ak-button-secondary",onClick:q,disabled:o},"Cancel"))),s&&t.createElement("div",{className:"ak-ark-account-connected"},u&&t.createElement("p",{className:"ak-ark-account-hint ak-ark-account-linked"},u.avatarUrl&&t.createElement("img",{className:"ak-ark-account-avatar",src:u.avatarUrl,alt:"",width:28,height:28}),"Linked: ",u.nickName," (Lv. ",u.level,")"),t.createElement("div",{className:"ak-ark-account-actions"},t.createElement("button",{type:"button",className:"ak-button",onClick:()=>$(a),disabled:o},o?"Fetching…":"Refresh data"))),E&&t.createElement("p",{className:"ak-ark-account-error"},E))}N.__docgenInfo={description:"",methods:[],displayName:"ArknightsAccount"};const V={title:"Components/ArknightsAccount",component:N};function v(){return t.createElement(N,{authState:null,setAuthState:()=>{},onFetched:()=>{}})}function p(){return t.createElement(N,{authState:{channelUid:"demo-uid",yostarToken:"demo-token",server:"en"},setAuthState:()=>{},onFetched:()=>{}})}v.__docgenInfo={description:"",methods:[],displayName:"Disconnected"};p.__docgenInfo={description:"",methods:[],displayName:"Connected"};var b,I,U;v.parameters={...v.parameters,docs:{...(b=v.parameters)==null?void 0:b.docs,source:{originalSource:`function Disconnected() {
  return <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />;
}`,...(U=(I=v.parameters)==null?void 0:I.docs)==null?void 0:U.source}}};var w,T,P;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`function Connected() {
  return <ArknightsAccount authState={{
    channelUid: 'demo-uid',
    yostarToken: 'demo-token',
    server: 'en'
  }} setAuthState={() => {}} onFetched={() => {}} />;
}`,...(P=(T=p.parameters)==null?void 0:T.docs)==null?void 0:P.source}}};const B=["Disconnected","Connected"];export{p as Connected,v as Disconnected,B as __namedExportsOrder,V as default};
