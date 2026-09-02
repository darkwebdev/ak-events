import{j as e}from"./jsx-runtime-BTRzZzJ0.js";import{O as v}from"./OrundumIcon-BZGZQ6gO.js";import{O as k}from"./index-ZWzJURF7.js";import{P as x}from"./PullIcon-DjNOtcTD.js";import{S as f}from"./SparkIcon-te2O82U4.js";import{I as j}from"./index-D-Llvr29.js";import"./iframe-CiSBhl-1.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";const I=[{name:"Orundum",usage:"OrundumIcon",file:"icon-orundum-red.svg",render:()=>e.jsx(v,{})},{name:"Originite Prime",usage:"OriginitePrimeIcon",file:"icon-diamond-yellow.svg",render:()=>e.jsx(k,{})},{name:"Pull / Headhunting Permit",usage:"PullIcon",file:"icon-pull.svg",render:()=>e.jsx(x,{})},{name:"Spark",usage:"SparkIcon",file:"icon-spark-token.svg",previewBackground:"color-mix(in srgb, var(--ak-limited) 80%, transparent)",render:()=>e.jsx(f,{})},{name:"Intelligence Certificates",usage:"IntCertsIcon",file:"icon-int-certs.svg",render:()=>e.jsx(j,{})}];function a({label:t}){return e.jsxs("div",{className:"ak-icons",children:[t&&e.jsx("div",{className:"ak-icons-label",children:t}),e.jsx("div",{className:"ak-icons-grid",children:I.map(r=>e.jsxs("div",{className:"ak-icons-swatch",children:[e.jsx("div",{className:"ak-icons-swatch-preview",style:r.previewBackground?{background:r.previewBackground}:void 0,children:r.render()}),e.jsx("div",{className:"ak-icons-swatch-name",children:r.name}),e.jsx("div",{className:"ak-icons-swatch-usage",children:r.usage}),e.jsxs("div",{className:"ak-icons-swatch-file",children:["public/images/",r.file]})]},r.name))})]})}const C={title:"Design/Icons",component:a};function s(){return e.jsxs("div",{style:{display:"flex",gap:24,flexWrap:"wrap"},children:[e.jsx("div",{"data-theme":"light",children:e.jsx(a,{label:"Light"})}),e.jsx("div",{"data-theme":"dark",children:e.jsx(a,{label:"Dark"})})]})}function i(){return e.jsx("div",{"data-theme":"light",children:e.jsx(a,{label:"Light"})})}function n(){return e.jsx("div",{"data-theme":"dark",children:e.jsx(a,{label:"Dark"})})}var c,o,d;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`function LightAndDark() {
  return <div style={{
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap'
  }}>
      <div data-theme="light">
        <Icons label="Light" />
      </div>
      <div data-theme="dark">
        <Icons label="Dark" />
      </div>
    </div>;
}`,...(d=(o=s.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};var l,m,u;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`function Light() {
  return <div data-theme="light">
      <Icons label="Light" />
    </div>;
}`,...(u=(m=i.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var p,g,h;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`function Dark() {
  return <div data-theme="dark">
      <Icons label="Dark" />
    </div>;
}`,...(h=(g=n.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const A=["LightAndDark","Light","Dark"];export{n as Dark,i as Light,s as LightAndDark,A as __namedExportsOrder,C as default};
