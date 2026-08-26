import{R as e}from"./iframe-CxGbh8X3.js";import{P as h}from"./index-EJFxvHOX.js";import{P as g}from"./PullIcon-FE_PYMqS.js";import"./preload-helper-C1FmrZbK.js";import"./images-BVwpUHA0.js";function i({totalPulls:P}){return e.createElement("header",{className:"ak-header"},e.createElement("div",{className:"ak-header-title"},e.createElement("h1",null,"Arknights Pull Prophecy"),e.createElement("span",{className:"ak-header-pulls"},e.createElement(g,{className:"ak-header-pulls-icon"}),e.createElement("span",{className:"ak-header-pulls-x"},"×"),e.createElement(h,{value:P}))))}i.__docgenInfo={description:"Header component for the app title and pull counter",methods:[],displayName:"Header"};const y={title:"Components/Header",component:i,argTypes:{totalPulls:{control:{type:"number",min:0,max:1e3},description:"The total number of pulls to display in the counter"}}},a={args:{totalPulls:10}},r={args:{totalPulls:0}},t={args:{totalPulls:500}};var s,l,o;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    totalPulls: 10
  }
}`,...(o=(l=a.parameters)==null?void 0:l.docs)==null?void 0:o.source}}};var n,c,m;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    totalPulls: 0
  }
}`,...(m=(c=r.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,p,d;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    totalPulls: 500
  }
}`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const _=["Default","ZeroPulls","HighPulls"];export{a as Default,t as HighPulls,r as ZeroPulls,_ as __namedExportsOrder,y as default};
