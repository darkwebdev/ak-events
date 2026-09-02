import{j as a}from"./jsx-runtime-BTRzZzJ0.js";import{S as y}from"./SparkIcon-te2O82U4.js";import{O as x}from"./OrundumIcon-BZGZQ6gO.js";import"./iframe-CiSBhl-1.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";const k=[{label:"Page title",usage:"Header <h1>",meta:"~2em (browser default) / bold",render:()=>a.jsx("h1",{className:"ak-typography-specimen-h1",children:"Arknights Pull Prophecy"})},{label:"Hero pull count",usage:"PullCounter (number-flow-react)",meta:"2em / bold / accent",render:()=>a.jsx("span",{className:"ak-typography-hero-number",children:"128"})},{label:"Aside title",usage:".ak-aside-title",meta:"18px / 600",render:()=>a.jsx("div",{className:"ak-aside-title",children:"Currently Owned"})},{label:"Base text",usage:"body / default",meta:"16px / 400",render:()=>a.jsx("span",{children:"The quick Doctor commands Rhodes Island."})},{label:"Label / value row",usage:".ak-aside-label / .ak-aside-name / .ak-aside-value",meta:"14px label, 16px value / 600",render:()=>a.jsxs("div",{className:"ak-aside-label",style:{cursor:"default"},children:[a.jsx("span",{className:"ak-aside-name",children:a.jsx(x,{})}),a.jsx("span",{className:"ak-aside-value",children:"12,345"})]})},{label:"Muted small",usage:".ak-event-type / .ak-breakdown-calc",meta:"0.9em–14px / 400",render:()=>a.jsx("span",{className:"ak-event-type",children:"Side Story"})},{label:"Micro badge",usage:".ak-operator-tag",meta:"8px / 700 / uppercase",render:()=>a.jsxs("span",{className:"ak-operator-tag",style:{position:"static"},children:[a.jsx(y,{className:"ak-operator-tag-icon"}),"200"]})}];function r({label:i}){return a.jsxs("div",{className:"ak-typography",children:[i&&a.jsx("div",{className:"ak-typography-label",children:i}),a.jsxs("div",{className:"ak-typography-group",children:[a.jsx("h4",{className:"ak-typography-group-title",children:"Font family"}),a.jsx("div",{className:"ak-typography-family",children:"Arial, sans-serif"})]}),a.jsxs("div",{className:"ak-typography-group",children:[a.jsx("h4",{className:"ak-typography-group-title",children:"Type scale"}),a.jsx("div",{className:"ak-typography-scale",children:k.map(e=>a.jsxs("div",{className:"ak-typography-row",children:[a.jsx("div",{className:"ak-typography-specimen",children:e.render()}),a.jsxs("div",{className:"ak-typography-row-meta",children:[a.jsx("div",{className:"ak-typography-row-label",children:e.label}),a.jsx("div",{className:"ak-typography-row-usage",children:e.usage}),a.jsx("div",{className:"ak-typography-row-detail",children:e.meta})]})]},e.label))})]})]})}const D={title:"Design/Typography",component:r};function s(){return a.jsxs("div",{style:{display:"flex",gap:24,flexWrap:"wrap"},children:[a.jsx("div",{"data-theme":"light",children:a.jsx(r,{label:"Light"})}),a.jsx("div",{"data-theme":"dark",children:a.jsx(r,{label:"Dark"})})]})}function l(){return a.jsx("div",{"data-theme":"light",children:a.jsx(r,{label:"Light"})})}function t(){return a.jsx("div",{"data-theme":"dark",children:a.jsx(r,{label:"Dark"})})}var d,o,p;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`function LightAndDark() {
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
}`,...(p=(o=s.parameters)==null?void 0:o.docs)==null?void 0:p.source}}};var n,c,h;l.parameters={...l.parameters,docs:{...(n=l.parameters)==null?void 0:n.docs,source:{originalSource:`function Light() {
  return <div data-theme="light">
      <Typography label="Light" />
    </div>;
}`,...(h=(c=l.parameters)==null?void 0:c.docs)==null?void 0:h.source}}};var m,g,u;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`function Dark() {
  return <div data-theme="dark">
      <Typography label="Dark" />
    </div>;
}`,...(u=(g=t.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const L=["LightAndDark","Light","Dark"];export{t as Dark,l as Light,s as LightAndDark,L as __namedExportsOrder,D as default};
