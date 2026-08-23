import{R as e}from"./iframe-C4T7z7Ij.js";import{O as k}from"./OrundumIcon-Dyq1BbLw.js";import{O as v}from"./index-DymClGnZ.js";import{P as f}from"./PullIcon-DGtJlK7S.js";import{S as E}from"./SparkIcon-Cn1SNMLl.js";import"./preload-helper-C1FmrZbK.js";import"./images-BVwpUHA0.js";const I=[{name:"Orundum",usage:"OrundumIcon",file:"icon-orundum-red.svg",render:()=>e.createElement(k,null)},{name:"Originite Prime",usage:"OriginitePrimeIcon",file:"icon-diamond-yellow.svg",render:()=>e.createElement(v,null)},{name:"Pull / Headhunting Permit",usage:"PullIcon",file:"icon-pull.svg",render:()=>e.createElement(f,null)},{name:"Spark",usage:"SparkIcon",file:"icon-spark-token.svg",render:()=>e.createElement(E,null)}];function a({label:s}){return e.createElement("div",{className:"ak-icons"},s&&e.createElement("div",{className:"ak-icons-label"},s),e.createElement("div",{className:"ak-icons-grid"},I.map(r=>e.createElement("div",{key:r.name,className:"ak-icons-swatch"},e.createElement("div",{className:"ak-icons-swatch-preview"},r.render()),e.createElement("div",{className:"ak-icons-swatch-name"},r.name),e.createElement("div",{className:"ak-icons-swatch-usage"},r.usage),e.createElement("div",{className:"ak-icons-swatch-file"},"public/images/",r.file)))))}a.__docgenInfo={description:"",methods:[],displayName:"Icons"};const w={title:"Design/Icons",component:a};function t(){return e.createElement("div",{style:{display:"flex",gap:24,flexWrap:"wrap"}},e.createElement("div",{"data-theme":"light"},e.createElement(a,{label:"Light"})),e.createElement("div",{"data-theme":"dark"},e.createElement(a,{label:"Dark"})))}function n(){return e.createElement("div",{"data-theme":"light"},e.createElement(a,{label:"Light"}))}function i(){return e.createElement("div",{"data-theme":"dark"},e.createElement(a,{label:"Dark"}))}t.__docgenInfo={description:"",methods:[],displayName:"LightAndDark"};n.__docgenInfo={description:"",methods:[],displayName:"Light"};i.__docgenInfo={description:"",methods:[],displayName:"Dark"};var c,o,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`function LightAndDark() {
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
}`,...(l=(o=t.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};var m,d,u;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`function Light() {
  return <div data-theme="light">
      <Icons label="Light" />
    </div>;
}`,...(u=(d=n.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var p,g,h;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`function Dark() {
  return <div data-theme="dark">
      <Icons label="Dark" />
    </div>;
}`,...(h=(g=i.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const P=["LightAndDark","Light","Dark"];export{i as Dark,n as Light,t as LightAndDark,P as __namedExportsOrder,w as default};
