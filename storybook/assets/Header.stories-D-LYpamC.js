import{j as e}from"./jsx-runtime-BTRzZzJ0.js";import{P as h}from"./index-CL0cADiV.js";import{P}from"./PullIcon-DjNOtcTD.js";import"./iframe-CiSBhl-1.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";function g({totalPulls:d}){return e.jsx("header",{className:"ak-header",children:e.jsxs("div",{className:"ak-header-title",children:[e.jsx("h1",{children:"Arknights Pull Prophecy"}),e.jsxs("span",{className:"ak-header-pulls",children:[e.jsx(P,{className:"ak-header-pulls-icon"}),e.jsx("span",{className:"ak-header-pulls-x",children:"×"}),e.jsx(h,{value:d})]})]})})}const y={title:"Components/Header",component:g,argTypes:{totalPulls:{control:{type:"number",min:0,max:1e3},description:"The total number of pulls to display in the counter"}}},s={args:{totalPulls:10}},r={args:{totalPulls:0}},a={args:{totalPulls:500}};var l,o,t;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    totalPulls: 10
  }
}`,...(t=(o=s.parameters)==null?void 0:o.docs)==null?void 0:t.source}}};var n,c,u;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    totalPulls: 0
  }
}`,...(u=(c=r.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var m,p,i;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    totalPulls: 500
  }
}`,...(i=(p=a.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};const S=["Default","ZeroPulls","HighPulls"];export{s as Default,a as HighPulls,r as ZeroPulls,S as __namedExportsOrder,y as default};
