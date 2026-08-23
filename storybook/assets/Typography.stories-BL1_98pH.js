import{R as e}from"./iframe-1iDTQ1fr.js";import{S as u}from"./SparkIcon-BZy3T3t4.js";import"./preload-helper-C1FmrZbK.js";const k=[{label:"Page title",usage:"Header <h1>",meta:"~2em (browser default) / bold",render:()=>e.createElement("h1",{className:"ak-typography-specimen-h1"},"Arknights Pull Prophecy")},{label:"Hero pull count",usage:"PullCounter (number-flow-react)",meta:"2em / bold / accent",render:()=>e.createElement("span",{className:"ak-typography-hero-number"},"128")},{label:"Aside title",usage:".ak-aside-title",meta:"18px / 600",render:()=>e.createElement("div",{className:"ak-aside-title"},"Currently Owned")},{label:"Base text",usage:"body / default",meta:"16px / 400",render:()=>e.createElement("span",null,"The quick Doctor commands Rhodes Island.")},{label:"Label / value row",usage:".ak-aside-label / .ak-aside-name / .ak-aside-value",meta:"14px label, 16px value / 600",render:()=>e.createElement("div",{className:"ak-aside-label",style:{cursor:"default"}},e.createElement("span",{className:"ak-aside-name"},"Orundum"),e.createElement("span",{className:"ak-aside-value"},"12,345"))},{label:"Muted small",usage:".ak-event-type / .ak-breakdown-calc",meta:"0.9em–14px / 400",render:()=>e.createElement("span",{className:"ak-event-type"},"Side Story")},{label:"Micro badge",usage:".ak-operator-tag",meta:"8px / 700 / uppercase",render:()=>e.createElement("span",{className:"ak-operator-tag",style:{position:"static"}},e.createElement(u,{className:"ak-operator-tag-icon"}),"200")}];function a({label:n}){return e.createElement("div",{className:"ak-typography"},n&&e.createElement("div",{className:"ak-typography-label"},n),e.createElement("div",{className:"ak-typography-group"},e.createElement("h4",{className:"ak-typography-group-title"},"Font family"),e.createElement("div",{className:"ak-typography-family"},"Arial, sans-serif")),e.createElement("div",{className:"ak-typography-group"},e.createElement("h4",{className:"ak-typography-group-title"},"Type scale"),e.createElement("div",{className:"ak-typography-scale"},k.map(t=>e.createElement("div",{key:t.label,className:"ak-typography-row"},e.createElement("div",{className:"ak-typography-specimen"},t.render()),e.createElement("div",{className:"ak-typography-row-meta"},e.createElement("div",{className:"ak-typography-row-label"},t.label),e.createElement("div",{className:"ak-typography-row-usage"},t.usage),e.createElement("div",{className:"ak-typography-row-detail"},t.meta)))))))}a.__docgenInfo={description:"",methods:[],displayName:"Typography"};const N={title:"Design/Typography",component:a};function r(){return e.createElement("div",{style:{display:"flex",gap:24,flexWrap:"wrap"}},e.createElement("div",{"data-theme":"light"},e.createElement(a,{label:"Light"})),e.createElement("div",{"data-theme":"dark"},e.createElement(a,{label:"Dark"})))}function l(){return e.createElement("div",{"data-theme":"light"},e.createElement(a,{label:"Light"}))}function s(){return e.createElement("div",{"data-theme":"dark"},e.createElement(a,{label:"Dark"}))}r.__docgenInfo={description:"",methods:[],displayName:"LightAndDark"};l.__docgenInfo={description:"",methods:[],displayName:"Light"};s.__docgenInfo={description:"",methods:[],displayName:"Dark"};var o,m,c;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`function LightAndDark() {
  return <div style={{
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap'
  }}>
      <div data-theme="light">
        <Typography label="Light" />
      </div>
      <div data-theme="dark">
        <Typography label="Dark" />
      </div>
    </div>;
}`,...(c=(m=r.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var p,d,i;l.parameters={...l.parameters,docs:{...(p=l.parameters)==null?void 0:p.docs,source:{originalSource:`function Light() {
  return <div data-theme="light">
      <Typography label="Light" />
    </div>;
}`,...(i=(d=l.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};var g,y,h;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`function Dark() {
  return <div data-theme="dark">
      <Typography label="Dark" />
    </div>;
}`,...(h=(y=s.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};const f=["LightAndDark","Light","Dark"];export{s as Dark,l as Light,r as LightAndDark,f as __namedExportsOrder,N as default};
