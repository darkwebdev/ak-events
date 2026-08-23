import{R as e}from"./iframe-SCZB5zPH.js";import{O as h}from"./OrundumIcon-BUiqzSw0.js";import{O as v}from"./index-Cjasg_zx.js";import{P as f}from"./PullIcon-Cu4UA3-g.js";import{S as E}from"./SparkIcon-BrxKFZSQ.js";import"./preload-helper-C1FmrZbK.js";import"./images-BVwpUHA0.js";const I=[{name:"Orundum",usage:"OrundumIcon",file:"icon-orundum-red.svg",render:()=>e.createElement(h,null)},{name:"Originite Prime",usage:"OriginitePrimeIcon",file:"icon-diamond-yellow.svg",render:()=>e.createElement(v,null)},{name:"Pull / Headhunting Permit",usage:"PullIcon",file:"icon-pull.svg",render:()=>e.createElement(f,null)},{name:"Spark",usage:"SparkIcon",file:"icon-spark-token.svg",previewBackground:"color-mix(in srgb, var(--ak-limited) 80%, transparent)",render:()=>e.createElement(E,null)}];function r({label:s}){return e.createElement("div",{className:"ak-icons"},s&&e.createElement("div",{className:"ak-icons-label"},s),e.createElement("div",{className:"ak-icons-grid"},I.map(a=>e.createElement("div",{key:a.name,className:"ak-icons-swatch"},e.createElement("div",{className:"ak-icons-swatch-preview",style:a.previewBackground?{background:a.previewBackground}:void 0},a.render()),e.createElement("div",{className:"ak-icons-swatch-name"},a.name),e.createElement("div",{className:"ak-icons-swatch-usage"},a.usage),e.createElement("div",{className:"ak-icons-swatch-file"},"public/images/",a.file)))))}r.__docgenInfo={description:"",methods:[],displayName:"Icons"};const O={title:"Design/Icons",component:r};function t(){return e.createElement("div",{style:{display:"flex",gap:24,flexWrap:"wrap"}},e.createElement("div",{"data-theme":"light"},e.createElement(r,{label:"Light"})),e.createElement("div",{"data-theme":"dark"},e.createElement(r,{label:"Dark"})))}function n(){return e.createElement("div",{"data-theme":"light"},e.createElement(r,{label:"Light"}))}function i(){return e.createElement("div",{"data-theme":"dark"},e.createElement(r,{label:"Dark"}))}t.__docgenInfo={description:"",methods:[],displayName:"LightAndDark"};n.__docgenInfo={description:"",methods:[],displayName:"Light"};i.__docgenInfo={description:"",methods:[],displayName:"Dark"};var c,o,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`function LightAndDark() {
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
}`,...(u=(d=n.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var p,g,k;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`function Dark() {
  return <div data-theme="dark">
      <Icons label="Dark" />
    </div>;
}`,...(k=(g=i.parameters)==null?void 0:g.docs)==null?void 0:k.source}}};const P=["LightAndDark","Light","Dark"];export{i as Dark,n as Light,t as LightAndDark,P as __namedExportsOrder,O as default};
