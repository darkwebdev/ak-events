import{R as c}from"./iframe-CoUnnczy.js";import{E as N}from"./index-DVmShKQE.js";import"./preload-helper-C1FmrZbK.js";import"./index-W7RqDOjA.js";import"./index-DDdl7xRW.js";import"./index-Cv65uCUJ.js";import"./index-DpS2bRNu.js";import"./index-IV4FJhE2.js";const i={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",origPrime:18,hhPermits:3,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},O=[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}],T=[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}],v=O.filter(e=>e.star===6).map(e=>e.name);function _(e,r){return e.star===6?e.name===r?200:300:e.star===5?75:null}function L(e,r){return e==="Standard"?{name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:T.map(n=>({...n,sparkCost:null}))}:e==="Limited"?{name:i.name,type:"Limited",sparkEligible:!0,operators:O.map(n=>({...n,sparkCost:_(n,r)}))}:null}function A({bannerType:e,selected:r,discountedOperator:n}){const k=L(e,n);return c.createElement("ul",{className:"ak-events-list"},c.createElement(N,{event:{...i,banner:k},selectedEvents:r?new Set([i.name]):new Set,onEventToggle:()=>{}}))}const P={title:"Components/Event",component:N,argTypes:{bannerType:{control:"select",options:["None","Limited","Standard"],description:"Which banner (if any) is attached to the event"},selected:{control:"boolean",description:"Whether the event card is shown selected"},discountedOperator:{control:"select",options:["None",...v],description:"Which 6★ operator (if any) currently has a reduced 200-contract spark cost. Only applies to Limited banners."}},render:A},t={args:{bannerType:"None",selected:!1,discountedOperator:"None"}},a={args:{bannerType:"Limited",selected:!1,discountedOperator:"Chongyue"}},s={args:{bannerType:"Standard",selected:!1,discountedOperator:"None"}},o={args:{bannerType:"Limited",selected:!0,discountedOperator:"None"}};var d,l,p;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    bannerType: 'None',
    selected: false,
    discountedOperator: 'None'
  }
}`,...(p=(l=t.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,u,g;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperator: 'Chongyue'
  }
}`,...(g=(u=a.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,f,b;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    bannerType: 'Standard',
    selected: false,
    discountedOperator: 'None'
  }
}`,...(b=(f=s.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var y,S,E;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: true,
    discountedOperator: 'None'
  }
}`,...(E=(S=o.parameters)==null?void 0:S.docs)==null?void 0:E.source}}};const R=["NoBanner","LimitedBanner","StandardBanner","Selected"];export{a as LimitedBanner,t as NoBanner,o as Selected,s as StandardBanner,R as __namedExportsOrder,P as default};
