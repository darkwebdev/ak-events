import{j as e}from"./jsx-runtime-BTRzZzJ0.js";import{I as y}from"./index-Bdy5a7GR.js";import{O as b}from"./index-Vssm1k69.js";import{B as C}from"./index-B-q3Gg_5.js";import{O as m}from"./index-ZWzJURF7.js";import{O as d}from"./OrundumIcon-BZGZQ6gO.js";import{P as l}from"./PullIcon-DjNOtcTD.js";import"./iframe-CiSBhl-1.js";import"./preload-helper-C1FmrZbK.js";import"./index-C8Vv9uEP.js";import"./index-edpvMAAC.js";import"./images-Dzy9b8zS.js";function a({owned:s,updateOwned:u,totalOwned:v}){return e.jsxs("div",{className:"ak-aside ak-currently-owned",children:[e.jsx("h3",{className:"ak-aside-title",children:"Currently owned"}),e.jsxs("div",{className:"ak-aside-list",children:[e.jsx("div",{className:"ak-aside-item",children:e.jsxs("label",{className:"ak-aside-label",children:[e.jsxs("span",{className:"ak-aside-name",children:[e.jsx(d,{}),"Orundum"]}),e.jsx("input",{type:"number",className:"ak-number-input",min:"0",step:"1",value:s.orundum,onChange:r=>u("orundum",parseInt(r.target.value)||0)})]})}),e.jsx("div",{className:"ak-aside-item",children:e.jsxs("label",{className:"ak-aside-label",children:[e.jsxs("span",{className:"ak-aside-name",children:[e.jsx(m,{}),"Originite Prime"]}),e.jsx("input",{type:"number",className:"ak-number-input",min:"0",step:"1",value:s.op,onChange:r=>u("op",parseInt(r.target.value)||0)})]})}),e.jsx("div",{className:"ak-aside-item",children:e.jsxs("label",{className:"ak-aside-label",children:[e.jsxs("span",{className:"ak-aside-name",children:[e.jsx(l,{}),"Pulls"]}),e.jsx("input",{type:"number",className:"ak-number-input",min:"0",step:"1",value:s.hhPermits,onChange:r=>u("hhPermits",parseInt(r.target.value)||0)})]})})]}),e.jsx("div",{className:"ak-aside-total",children:e.jsx("div",{className:"ak-aside-item",children:e.jsxs("div",{className:"ak-aside-label",children:[e.jsx("span",{className:"ak-aside-name",children:e.jsx(y,{title:"Breakdown",label:"Total",children:e.jsx(C,{items:[e.jsx(d,{},"orundum"),e.jsx(m,{},"op"),e.jsx(l,{},"permits")],calcs:["-",`${s.op} × 180`,`${s.hhPermits} × 600`],totals:[s.orundum,s.op*180,s.hhPermits*600]})})}),e.jsx("span",{className:"ak-aside-value",children:e.jsx(b,{withPulls:!0,children:v})})]})})})]})}const z={title:"Components/CurrentlyOwned",component:a},I={owned:{orundum:1e3,op:3,hhPermits:2},updateOwned:()=>{},totalOwned:1e3+3*180+2*600};function n(){return e.jsx(a,{...I})}function t(){return e.jsx(a,{owned:{orundum:0,op:0,hhPermits:0},updateOwned:()=>{},totalOwned:0})}function o(){return e.jsx(a,{owned:{orundum:1e4,op:50,hhPermits:20},updateOwned:()=>{},totalOwned:1e4+50*180+20*600})}function i(){return e.jsx(a,{owned:{orundum:5e3,op:0,hhPermits:0},updateOwned:()=>{},totalOwned:5e3})}var c,p,h;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`function Default() {
  return <CurrentlyOwned {...defaultProps} />;
}`,...(h=(p=n.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var x,O,j;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`function ZeroOwned() {
  return <CurrentlyOwned owned={{
    orundum: 0,
    op: 0,
    hhPermits: 0
  }} updateOwned={() => {}} totalOwned={0} />;
}`,...(j=(O=t.parameters)==null?void 0:O.docs)==null?void 0:j.source}}};var w,f,k;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`function LargeAmounts() {
  return <CurrentlyOwned owned={{
    orundum: 10000,
    op: 50,
    hhPermits: 20
  }} updateOwned={() => {}} totalOwned={10000 + 50 * 180 + 20 * 600} />;
}`,...(k=(f=o.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};var N,P,g;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`function OnlyOrundum() {
  return <CurrentlyOwned owned={{
    orundum: 5000,
    op: 0,
    hhPermits: 0
  }} updateOwned={() => {}} totalOwned={5000} />;
}`,...(g=(P=i.parameters)==null?void 0:P.docs)==null?void 0:g.source}}};const F=["Default","ZeroOwned","LargeAmounts","OnlyOrundum"];export{n as Default,o as LargeAmounts,i as OnlyOrundum,t as ZeroOwned,F as __namedExportsOrder,z as default};
