import{R as n}from"./iframe-CDhxciQd.js";import{E as m}from"./index-Cw-G4emr.js";import"./preload-helper-C1FmrZbK.js";import"./images-BVwpUHA0.js";import"./index-Dg7oPcqi.js";import"./index-DzNR_awM.js";import"./PullIcon-Cf3HBiL_.js";import"./OrundumIcon-B-B7q7RV.js";import"./index-Ck0TuH8q.js";import"./index-DVnCvHc-.js";import"./index-Dh_B04Bx.js";import"./index-CIrO3fux.js";import"./SparkIcon-Csi6sMbO.js";import"./index-CowP46fV.js";const o={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",origPrime:18,hhPermits:3,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},D=[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}],R=[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}],$=D.filter(e=>e.star===6).map(e=>e.name);function z(e,r){return e.limited?e.star===6?r.includes(e.name)?200:300:e.star===5?75:null:null}function I(e,r){return e==="Standard"?{name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:R.map(t=>({...t,sparkCost:null}))}:e==="Limited"?{name:o.name,type:"Limited",sparkEligible:!0,operators:D.map(t=>({...t,sparkCost:z(t,r)}))}:null}function P({bannerType:e,selected:r,discountedOperators:t}){const M=I(e,t);return n.createElement("ul",{className:"ak-events-list"},n.createElement(m,{event:{...o,banner:M},selectedEvents:r?new Set([o.name]):new Set,onEventToggle:()=>{}}))}const te={title:"Components/Event",component:m,argTypes:{bannerType:{control:"select",options:["None","Limited","Standard"],description:"Which banner (if any) is attached to the event"},selected:{control:"boolean",description:"Whether the event card is shown selected"},discountedOperators:{control:"multi-select",options:$,description:"6★ operators that currently have a reduced 200-contract spark cost. Only applies to Limited banners."}},render:P},i={args:{bannerType:"None",selected:!1,discountedOperators:[]}},d={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue"]}},l={args:{bannerType:"Standard",selected:!1,discountedOperators:[]}},c={args:{bannerType:"Limited",selected:!0,discountedOperators:[]}},p={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue","Shu"]}};function a(){return n.createElement("ul",{className:"ak-events-list"},n.createElement(m,{event:{...o,banner:I("Limited",["Chongyue"])},selectedEvents:new Set,onEventToggle:()=>{}}),n.createElement(m,{event:{...o,name:"A Different Event",banner:null},selectedEvents:new Set,onEventToggle:()=>{}}))}const G=[{width:1400,height:340,label:"1400px — wide desktop: banner sits beside the event"},{width:700,height:700,label:"700px — banner drops below the event (≤900px), image stays a normal block (>480px)"},{width:420,height:820,label:"420px — image becomes a full-bleed card background (≤480px)"}];function s(){return n.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:"24px",alignItems:"flex-start"}},G.map(({width:e,height:r,label:t})=>n.createElement("div",{key:e},n.createElement("p",{style:{font:"12px monospace",marginBottom:"8px",maxWidth:`${e}px`}},t),n.createElement("iframe",{title:`Event at ${e}px`,src:"iframe.html?id=components-event--limited-banner&viewMode=story",style:{width:`${e}px`,height:`${r}px`,border:"1px dashed #999"}}))))}a.__docgenInfo={description:"",methods:[],displayName:"NoBannerWidthComparison"};s.__docgenInfo={description:"",methods:[],displayName:"ResponsiveSizes"};var u,g,h;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    bannerType: 'None',
    selected: false,
    discountedOperators: []
  }
}`,...(h=(g=i.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var f,v,b;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue']
  }
}`,...(b=(v=d.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var E,y,S;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    bannerType: 'Standard',
    selected: false,
    discountedOperators: []
  }
}`,...(S=(y=l.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var x,w,O;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: true,
    discountedOperators: []
  }
}`,...(O=(w=c.parameters)==null?void 0:w.docs)==null?void 0:O.source}}};var T,k,N;p.parameters={...p.parameters,docs:{...(T=p.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue', 'Shu']
  }
}`,...(N=(k=p.parameters)==null?void 0:k.docs)==null?void 0:N.source}}};var _,C,B;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`function NoBannerWidthComparison() {
  return <ul className="ak-events-list">
      <Event event={{
      ...baseEvent,
      banner: buildBanner('Limited', ['Chongyue'])
    }} selectedEvents={new Set()} onEventToggle={() => {}} />
      <Event event={{
      ...baseEvent,
      name: 'A Different Event',
      banner: null
    }} selectedEvents={new Set()} onEventToggle={() => {}} />
    </ul>;
}`,...(B=(C=a.parameters)==null?void 0:C.docs)==null?void 0:B.source}}};var L,W,A;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`function ResponsiveSizes() {
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
}`,...(A=(W=s.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};const re=["NoBanner","LimitedBanner","StandardBanner","Selected","MultipleDiscountedOperators","NoBannerWidthComparison","ResponsiveSizes"];export{d as LimitedBanner,p as MultipleDiscountedOperators,i as NoBanner,a as NoBannerWidthComparison,s as ResponsiveSizes,c as Selected,l as StandardBanner,re as __namedExportsOrder,te as default};
