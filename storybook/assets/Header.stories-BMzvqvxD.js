import{R as e}from"./iframe-BoycfbmX.js";import{P as g}from"./index-CI9f1MY6.js";import{P as h}from"./PullIcon-BUDEDpWj.js";import"./preload-helper-C1FmrZbK.js";import"./images-BVwpUHA0.js";function i({totalPulls:P}){return e.createElement("header",{className:"ak-header"},e.createElement("h1",null,"Arknights Pull Prophecy")," ",e.createElement("span",{className:"ak-header-pulls"},e.createElement(h,{className:"ak-header-pulls-icon"}),e.createElement("span",{className:"ak-header-pulls-x"},"×"),e.createElement(g,{value:P})))}i.__docgenInfo={description:"Header component for the app title and pull counter",methods:[],displayName:"Header"};const N={title:"Components/Header",component:i,argTypes:{totalPulls:{control:{type:"number",min:0,max:1e3},description:"The total number of pulls to display in the counter"}}},a={args:{totalPulls:10}},r={args:{totalPulls:0}},s={args:{totalPulls:500}};var t,l,o;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    totalPulls: 10
  }
}`,...(o=(l=a.parameters)==null?void 0:l.docs)==null?void 0:o.source}}};var n,c,m;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    totalPulls: 0
  }
}`,...(m=(c=r.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,p,d;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    totalPulls: 500
  }
}`,...(d=(p=s.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const _=["Default","ZeroPulls","HighPulls"];export{a as Default,s as HighPulls,r as ZeroPulls,_ as __namedExportsOrder,N as default};
