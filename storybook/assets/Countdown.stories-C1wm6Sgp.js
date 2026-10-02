import{j as o}from"./jsx-runtime-BlLNtz3U.js";import{C as n}from"./index-B2p7zCe6.js";import"./iframe-B1yqWidp.js";import"./preload-helper-C1FmrZbK.js";import"./useNow-CD1ZFJL9.js";import"./dates-CioEEh1n.js";import"./index-BznEJ6Un.js";import"./index-C2nto5Ds.js";const h={title:"Components/Countdown",component:n},t=e=>new Date(Date.now()+e),i=60*60*1e3,r=24*i;function s(){return o.jsx(n,{start:t(5*r),end:t(19*r),exact:!0})}function a(){return o.jsx(n,{start:t(-13*r),end:t(2*i+15*60*1e3),exact:!0})}function c(){const e=new Date;return e.setHours(0,0,0,0),e.setDate(e.getDate()+1),o.jsx(n,{start:t(-13*r),end:e,exact:!1})}function u(){return o.jsx(n,{start:t(-40*r),end:t(-26*r),exact:!0})}function d(){return o.jsx(n,{start:t(-14*r),end:t(-3*i),exact:!0})}var m,p,D;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`function StartsInDays() {
  return <Countdown start={inMs(5 * DAY)} end={inMs(19 * DAY)} exact />;
}`,...(D=(p=s.parameters)==null?void 0:p.docs)==null?void 0:D.source}}};var x,w,f;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`function EndsInHours() {
  return <Countdown start={inMs(-13 * DAY)} end={inMs(2 * HOUR + 15 * 60 * 1000)} exact />;
}`,...(f=(w=a.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};var A,E,g;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`function EndsDateOnly() {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return <Countdown start={inMs(-13 * DAY)} end={tomorrow} exact={false} />;
}`,...(g=(E=c.parameters)==null?void 0:E.docs)==null?void 0:g.source}}};var l,H,C;u.parameters={...u.parameters,docs:{...(l=u.parameters)==null?void 0:l.docs,source:{originalSource:`function EndedDaysAgo() {
  return <Countdown start={inMs(-40 * DAY)} end={inMs(-26 * DAY)} exact />;
}`,...(C=(H=u.parameters)==null?void 0:H.docs)==null?void 0:C.source}}};var M,y,S;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`function EndedHoursAgo() {
  return <Countdown start={inMs(-14 * DAY)} end={inMs(-3 * HOUR)} exact />;
}`,...(S=(y=d.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};const k=["StartsInDays","EndsInHours","EndsDateOnly","EndedDaysAgo","EndedHoursAgo"];export{u as EndedDaysAgo,d as EndedHoursAgo,c as EndsDateOnly,a as EndsInHours,s as StartsInDays,k as __namedExportsOrder,h as default};
