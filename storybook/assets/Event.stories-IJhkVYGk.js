import{R as e}from"./iframe-Clwop49s.js";import{E as o}from"./index-m7xkwxxV.js";import"./preload-helper-C1FmrZbK.js";import"./index-CDDi2FKk.js";import"./index-DHYmNLGD.js";import"./index-DcMts5Wn.js";import"./index-CchG0xc_.js";import"./index-CsV-GLlE.js";const l={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",origPrime:18,hhPermits:3,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},i={selectedEvents:new Set,onEventToggle:()=>{}},w={title:"Components/Event",component:o};function s(){return e.createElement("ul",{className:"ak-events-list"},e.createElement(o,{event:{...l,banner:null},...i}))}function a(){const n={name:"Ashes to Ashes, Ages on Ages",type:"Limited",sparkEligible:!0,sparkCost:300,operators:[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}]};return e.createElement("ul",{className:"ak-events-list"},e.createElement(o,{event:{...l,banner:n},...i}))}function t(){const n={name:"Joint Operation #21",type:"Standard",sparkEligible:!1,sparkCost:null,operators:[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}]};return e.createElement("ul",{className:"ak-events-list"},e.createElement(o,{event:{...l,banner:n},...i}))}function r(){const n={name:"Ashes to Ashes, Ages on Ages",type:"Limited",sparkEligible:!0,sparkCost:300,operators:[{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null}]};return e.createElement("ul",{className:"ak-events-list"},e.createElement(o,{event:{...l,banner:n},selectedEvents:new Set([l.name]),onEventToggle:()=>{}}))}s.__docgenInfo={description:"",methods:[],displayName:"NoBanner"};a.__docgenInfo={description:"",methods:[],displayName:"LimitedBanner"};t.__docgenInfo={description:"",methods:[],displayName:"StandardBanner"};r.__docgenInfo={description:"",methods:[],displayName:"Selected"};var c,m,d;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`function NoBanner() {
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
    sparkCost: 300,
    operators: [{
      name: "Ch'en the Dawnstreak",
      star: 6,
      class: 'Guard',
      limited: false,
      icon: null
    }, {
      name: 'Chongyue',
      star: 6,
      class: 'Guard',
      limited: true,
      icon: null
    }, {
      name: 'Shu',
      star: 6,
      class: 'Defender',
      limited: true,
      icon: null
    }, {
      name: 'Taraxacum',
      star: 5,
      class: 'Medic',
      limited: false,
      icon: null
    }]
  };
  return <ul className="ak-events-list">
      <Event event={{
      ...baseEvent,
      banner
    }} {...defaultProps} />
    </ul>;
}`,...(g=(p=a.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var E,v,f;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`function StandardBanner() {
  const banner = {
    name: 'Joint Operation #21',
    type: 'Standard',
    sparkEligible: false,
    sparkCost: null,
    operators: [{
      name: 'Mudrock',
      star: 6,
      class: 'Defender',
      limited: false,
      icon: null
    }, {
      name: 'Whisperain',
      star: 5,
      class: 'Medic',
      limited: false,
      icon: null
    }]
  };
  return <ul className="ak-events-list">
      <Event event={{
      ...baseEvent,
      banner
    }} {...defaultProps} />
    </ul>;
}`,...(f=(v=t.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var h,k,b;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`function Selected() {
  const banner = {
    name: 'Ashes to Ashes, Ages on Ages',
    type: 'Limited',
    sparkEligible: true,
    sparkCost: 300,
    operators: [{
      name: 'Chongyue',
      star: 6,
      class: 'Guard',
      limited: true,
      icon: null
    }]
  };
  return <ul className="ak-events-list">
      <Event event={{
      ...baseEvent,
      banner
    }} selectedEvents={new Set([baseEvent.name])} onEventToggle={() => {}} />
    </ul>;
}`,...(b=(k=r.parameters)==null?void 0:k.docs)==null?void 0:b.source}}};const M=["NoBanner","LimitedBanner","StandardBanner","Selected"];export{a as LimitedBanner,s as NoBanner,r as Selected,t as StandardBanner,M as __namedExportsOrder,w as default};
