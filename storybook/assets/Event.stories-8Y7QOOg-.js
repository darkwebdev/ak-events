import{R as e}from"./iframe-B2UyldO2.js";import{E as l}from"./index-cmhkMW4C.js";import"./preload-helper-C1FmrZbK.js";import"./index-BIjex6oN.js";import"./index-BGSn2QUt.js";import"./index-Dgozae4f.js";import"./index-mD55g4c5.js";import"./index-RwtvCb2S.js";const o={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",origPrime:18,hhPermits:3,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},i={selectedEvents:new Set,onEventToggle:()=>{}},w={title:"Components/Event",component:l};function s(){return e.createElement("ul",{className:"ak-events-list"},e.createElement(l,{event:{...o,banner:null},...i}))}function a(){const n={name:"Ashes to Ashes, Ages on Ages",type:"Limited",sparkEligible:!0,operators:[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null,sparkCost:300},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null,sparkCost:200},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null,sparkCost:300},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null,sparkCost:75}]};return e.createElement("ul",{className:"ak-events-list"},e.createElement(l,{event:{...o,banner:n},...i}))}function t(){const n={name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null,sparkCost:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null,sparkCost:null}]};return e.createElement("ul",{className:"ak-events-list"},e.createElement(l,{event:{...o,banner:n},...i}))}function r(){const n={name:"Ashes to Ashes, Ages on Ages",type:"Limited",sparkEligible:!0,operators:[{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null,sparkCost:300}]};return e.createElement("ul",{className:"ak-events-list"},e.createElement(l,{event:{...o,banner:n},selectedEvents:new Set([o.name]),onEventToggle:()=>{}}))}s.__docgenInfo={description:"",methods:[],displayName:"NoBanner"};a.__docgenInfo={description:"",methods:[],displayName:"LimitedBanner"};t.__docgenInfo={description:"",methods:[],displayName:"StandardBanner"};r.__docgenInfo={description:"",methods:[],displayName:"Selected"};var c,m,d;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`function NoBanner() {
  return <ul className="ak-events-list">
      <Event event={{
      ...baseEvent,
      banner: null
    }} {...defaultProps} />
    </ul>;
}`,...(d=(m=s.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var u,p,g;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`function LimitedBanner() {
  const banner = {
    name: 'Ashes to Ashes, Ages on Ages',
    type: 'Limited',
    sparkEligible: true,
    operators: [{
      name: "Ch'en the Dawnstreak",
      star: 6,
      class: 'Guard',
      limited: false,
      icon: null,
      sparkCost: 300
    }, {
      name: 'Chongyue',
      star: 6,
      class: 'Guard',
      limited: true,
      icon: null,
      sparkCost: 200
    }, {
      name: 'Shu',
      star: 6,
      class: 'Defender',
      limited: true,
      icon: null,
      sparkCost: 300
    }, {
      name: 'Taraxacum',
      star: 5,
      class: 'Medic',
      limited: false,
      icon: null,
      sparkCost: 75
    }]
  };
  return <ul className="ak-events-list">
      <Event event={{
      ...baseEvent,
      banner
    }} {...defaultProps} />
    </ul>;
}`,...(g=(p=a.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var E,k,v;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`function StandardBanner() {
  const banner = {
    name: 'Joint Operation #21',
    type: 'Standard',
    sparkEligible: false,
    operators: [{
      name: 'Mudrock',
      star: 6,
      class: 'Defender',
      limited: false,
      icon: null,
      sparkCost: null
    }, {
      name: 'Whisperain',
      star: 5,
      class: 'Medic',
      limited: false,
      icon: null,
      sparkCost: null
    }]
  };
  return <ul className="ak-events-list">
      <Event event={{
      ...baseEvent,
      banner
    }} {...defaultProps} />
    </ul>;
}`,...(v=(k=t.parameters)==null?void 0:k.docs)==null?void 0:v.source}}};var f,h,b;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`function Selected() {
  const banner = {
    name: 'Ashes to Ashes, Ages on Ages',
    type: 'Limited',
    sparkEligible: true,
    operators: [{
      name: 'Chongyue',
      star: 6,
      class: 'Guard',
      limited: true,
      icon: null,
      sparkCost: 300
    }]
  };
  return <ul className="ak-events-list">
      <Event event={{
      ...baseEvent,
      banner
    }} selectedEvents={new Set([baseEvent.name])} onEventToggle={() => {}} />
    </ul>;
}`,...(b=(h=r.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};const M=["NoBanner","LimitedBanner","StandardBanner","Selected"];export{a as LimitedBanner,s as NoBanner,r as Selected,t as StandardBanner,M as __namedExportsOrder,w as default};
