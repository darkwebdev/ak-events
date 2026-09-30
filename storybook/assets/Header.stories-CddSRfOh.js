import{j as e}from"./jsx-runtime-BLJhYuub.js";import{P}from"./index-LjxHlXeA.js";import{P as j}from"./PullIcon-CvG4WszL.js";import"./iframe-BUZPLpc7.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";function g({totalPulls:x,sidebarOpen:l=!1,onToggleSidebar:o}){return e.jsxs("header",{className:"ak-header",children:[e.jsxs("div",{className:"ak-header-title",children:[e.jsx("h1",{children:"Arknights Pull Prophecy"}),e.jsxs("span",{className:"ak-header-pulls",children:[e.jsx(j,{className:"ak-header-pulls-icon"}),e.jsx("span",{className:"ak-header-pulls-x",children:"×"}),e.jsx(P,{value:x})]})]}),o&&e.jsx("button",{type:"button",className:"ak-header-sidebar-toggle","aria-label":l?"Close pulls and income":"Open pulls and income","aria-expanded":l,"aria-controls":"ak-sidebar",onClick:o,children:e.jsxs("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:[e.jsx("path",{d:"M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"}),e.jsx("circle",{cx:"16",cy:"6",r:"2"}),e.jsx("circle",{cx:"10",cy:"12",r:"2"}),e.jsx("circle",{cx:"18",cy:"18",r:"2"})]})})]})}const H={title:"Components/Header",component:g,argTypes:{totalPulls:{control:{type:"number",min:0,max:1e3},description:"The total number of pulls to display in the counter"}}},s={args:{totalPulls:10}},r={args:{totalPulls:0}},a={args:{totalPulls:500}};var t,c,n;s.parameters={...s.parameters,docs:{...(t=s.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    totalPulls: 10
  }
}`,...(n=(c=s.parameters)==null?void 0:c.docs)==null?void 0:n.source}}};var i,u,d;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    totalPulls: 0
  }
}`,...(d=(u=r.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};var p,m,h;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    totalPulls: 500
  }
}`,...(h=(m=a.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};const v=["Default","ZeroPulls","HighPulls"];export{s as Default,a as HighPulls,r as ZeroPulls,v as __namedExportsOrder,H as default};
