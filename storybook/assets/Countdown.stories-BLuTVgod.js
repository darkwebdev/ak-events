import{j as c}from"./jsx-runtime-CY0MagLH.js";import{C as a}from"./index-Dq_kMto-.js";import"./iframe-CNwyd6wL.js";import"./preload-helper-C1FmrZbK.js";import"./dates-BsXIpBPj.js";const M={title:"Components/Countdown",component:a},r=t=>new Date(Date.now()+t),l=60*60*1e3,s=24*l;function e(){return c.jsx(a,{start:r(5*s),end:r(19*s),exact:!0})}function n(){return c.jsx(a,{start:r(-13*s),end:r(2*l+15*60*1e3),exact:!0})}function o(){const t=new Date;return t.setHours(0,0,0,0),t.setDate(t.getDate()+1),c.jsx(a,{start:r(-13*s),end:t,exact:!1})}var u,d,m;e.parameters={...e.parameters,docs:{...(u=e.parameters)==null?void 0:u.docs,source:{originalSource:`function StartsInDays() {
  return <Countdown start={inMs(5 * DAY)} end={inMs(19 * DAY)} exact />;
}`,...(m=(d=e.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var i,p,D;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`function EndsInHours() {
  return <Countdown start={inMs(-13 * DAY)} end={inMs(2 * HOUR + 15 * 60 * 1000)} exact />;
}`,...(D=(p=n.parameters)==null?void 0:p.docs)==null?void 0:D.source}}};var w,x,f;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`function EndsDateOnly() {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return <Countdown start={inMs(-13 * DAY)} end={tomorrow} exact={false} />;
}`,...(f=(x=o.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};const O=["StartsInDays","EndsInHours","EndsDateOnly"];export{o as EndsDateOnly,n as EndsInHours,e as StartsInDays,O as __namedExportsOrder,M as default};
