import{R as r}from"./iframe-prUs4ROx.js";import{E as N}from"./index-CS1awtxV.js";import"./preload-helper-C1FmrZbK.js";import"./images-BVwpUHA0.js";import"./index-DlmHcbOf.js";import"./index-CTWW3JH1.js";import"./PullIcon-zMry3Ap3.js";import"./OrundumIcon-DT-7ggmK.js";import"./index-CFcbsSfW.js";import"./index-dB5YsKN2.js";import"./index-C8mUmNOo.js";import"./index-CHus5EFV.js";import"./SparkIcon-CO4Ut2gC.js";import"./index-C1kppk2G.js";const p={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",origPrime:18,hhPermits:3,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},C=[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}],W=[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}],A=C.filter(e=>e.star===6).map(e=>e.name);function M(e,n){return e.limited?e.star===6?n.includes(e.name)?200:300:e.star===5?75:null:null}function R(e,n){return e==="Standard"?{name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:W.map(t=>({...t,sparkCost:null}))}:e==="Limited"?{name:p.name,type:"Limited",sparkEligible:!0,operators:C.map(t=>({...t,sparkCost:M(t,n)}))}:null}function $({bannerType:e,selected:n,discountedOperators:t}){const B=R(e,t);return r.createElement("ul",{className:"ak-events-list"},r.createElement(N,{event:{...p,banner:B},selectedEvents:n?new Set([p.name]):new Set,onEventToggle:()=>{}}))}const Y={title:"Components/Event",component:N,argTypes:{bannerType:{control:"select",options:["None","Limited","Standard"],description:"Which banner (if any) is attached to the event"},selected:{control:"boolean",description:"Whether the event card is shown selected"},discountedOperators:{control:"multi-select",options:A,description:"6★ operators that currently have a reduced 200-contract spark cost. Only applies to Limited banners."}},render:$},s={args:{bannerType:"None",selected:!1,discountedOperators:[]}},o={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue"]}},i={args:{bannerType:"Standard",selected:!1,discountedOperators:[]}},d={args:{bannerType:"Limited",selected:!0,discountedOperators:[]}},l={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue","Shu"]}},D=[{width:1400,height:340,label:"1400px — wide desktop: banner sits beside the event"},{width:700,height:700,label:"700px — banner drops below the event (≤900px), image stays a normal block (>480px)"},{width:420,height:820,label:"420px — image becomes a full-bleed card background (≤480px)"}];function a(){return r.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:"24px",alignItems:"flex-start"}},D.map(({width:e,height:n,label:t})=>r.createElement("div",{key:e},r.createElement("p",{style:{font:"12px monospace",marginBottom:"8px",maxWidth:`${e}px`}},t),r.createElement("iframe",{title:`Event at ${e}px`,src:"iframe.html?id=components-event--limited-banner&viewMode=story",style:{width:`${e}px`,height:`${n}px`,border:"1px dashed #999"}}))))}a.__docgenInfo={description:"",methods:[],displayName:"ResponsiveSizes"};var c,m,u;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    bannerType: 'None',
    selected: false,
    discountedOperators: []
  }
}`,...(u=(m=s.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var h,g,f;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue']
  }
}`,...(f=(g=o.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var b,y,x;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    bannerType: 'Standard',
    selected: false,
    discountedOperators: []
  }
}`,...(x=(y=i.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var S,v,E;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: true,
    discountedOperators: []
  }
}`,...(E=(v=d.parameters)==null?void 0:v.docs)==null?void 0:E.source}}};var O,w,k;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue', 'Shu']
  }
}`,...(k=(w=l.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};var T,_,L;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`function ResponsiveSizes() {
  return <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    alignItems: 'flex-start'
  }}>
      {RESPONSIVE_WIDTHS.map(({
      width,
      height,
      label
    }) => <div key={width}>
          <p style={{
        font: '12px monospace',
        marginBottom: '8px',
        maxWidth: \`\${width}px\`
      }}>
            {label}
          </p>
          <iframe title={\`Event at \${width}px\`} src="iframe.html?id=components-event--limited-banner&viewMode=story" style={{
        width: \`\${width}px\`,
        height: \`\${height}px\`,
        border: '1px dashed #999'
      }} />
        </div>)}
    </div>;
}`,...(L=(_=a.parameters)==null?void 0:_.docs)==null?void 0:L.source}}};const Z=["NoBanner","LimitedBanner","StandardBanner","Selected","MultipleDiscountedOperators","ResponsiveSizes"];export{o as LimitedBanner,l as MultipleDiscountedOperators,s as NoBanner,a as ResponsiveSizes,d as Selected,i as StandardBanner,Z as __namedExportsOrder,Y as default};
