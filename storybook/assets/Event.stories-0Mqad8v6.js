import{j as t}from"./jsx-runtime-BTRzZzJ0.js";import{r as S}from"./iframe-CiSBhl-1.js";import{E as a}from"./index-Bst96_42.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";import"./index-Vssm1k69.js";import"./index-edpvMAAC.js";import"./PullIcon-DjNOtcTD.js";import"./OrundumIcon-BZGZQ6gO.js";import"./index-Bdy5a7GR.js";import"./index-C8Vv9uEP.js";import"./index-B-q3Gg_5.js";import"./index-DLhl2V8Y.js";import"./SparkIcon-te2O82U4.js";import"./index-ZWzJURF7.js";import"./index-D-Llvr29.js";const r={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",start:null,end:null,globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",datesPredicted:!1,origPrime:18,hhPermits:3,intCerts:null,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},V=[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}],F=[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}],J=V.filter(e=>e.star===6).map(e=>e.name);function q(e,s){return e.limited?e.star===6?s.includes(e.name)?200:300:e.star===5?75:null:null}function x(e,s){return e==="Standard"?{name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:F.map(n=>({...n,sparkCost:null}))}:e==="Limited"?{name:r.name,type:"Limited",sparkEligible:!0,operators:V.map(n=>({...n,sparkCost:q(n,s)}))}:null}function K({bannerType:e,selected:s,discountedOperators:n}){const v=x(e,n);return t.jsx("ul",{className:"ak-events-list",children:t.jsx(a,{event:{...r,banner:v},selectedEvents:s?new Set([r.name]):new Set,onEventToggle:()=>{}})})}const ue={title:"Components/Event",component:a,argTypes:{bannerType:{control:"select",options:["None","Limited","Standard"],description:"Which banner (if any) is attached to the event"},selected:{control:"boolean",description:"Whether the event card is shown selected"},discountedOperators:{control:"multi-select",options:J,description:"6★ operators that currently have a reduced 200-contract spark cost. Only applies to Limited banners."}},render:K},d={args:{bannerType:"None",selected:!1,discountedOperators:[]}},l={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue"]}},c={args:{bannerType:"Standard",selected:!1,discountedOperators:[]}},p={args:{bannerType:"Limited",selected:!0,discountedOperators:[]}},m={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue","Shu"]}},Q={...r,name:"When Elegies Are Ashes",type:"Side Story (Rerun)",origPrime:28,hhPermits:3,intCerts:1755};function u(){const[e,s]=S.useState(!1),[n,v]=S.useState(new Set);return t.jsx("ul",{className:"ak-events-list",children:t.jsx(a,{event:{...Q,intCertsIncluded:e,banner:x("Limited",[])},selectedEvents:n,onEventToggle:o=>v(f=>{const i=new Set(f);return i.has(o)?i.delete(o):i.add(o),i}),onToggleIntCerts:(o,f)=>s(f)})})}function h(){return t.jsxs("ul",{className:"ak-events-list",children:[t.jsx(a,{event:{...r,banner:x("Limited",["Chongyue"])},selectedEvents:new Set,onEventToggle:()=>{}}),t.jsx(a,{event:{...r,name:"A Different Event",banner:null},selectedEvents:new Set,onEventToggle:()=>{}})]})}const U=[{width:1400,height:340,label:"1400px — wide desktop: banner sits beside the event"},{width:700,height:700,label:"700px — banner drops below the event (≤900px), image stays a normal block (>480px)"},{width:420,height:820,label:"420px — image becomes a full-bleed card background (≤480px)"}];function g(){return t.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"24px",alignItems:"flex-start"},children:U.map(({width:e,height:s,label:n})=>t.jsxs("div",{children:[t.jsx("p",{style:{font:"12px monospace",marginBottom:"8px",maxWidth:`${e}px`},children:n}),t.jsx("iframe",{title:`Event at ${e}px`,src:"iframe.html?id=components-event--limited-banner&viewMode=story",style:{width:`${e}px`,height:`${s}px`,border:"1px dashed #999"}})]},e))})}var b,E,y;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    bannerType: 'None',
    selected: false,
    discountedOperators: []
  }
}`,...(y=(E=d.parameters)==null?void 0:E.docs)==null?void 0:y.source}}};var C,w,T;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue']
  }
}`,...(T=(w=l.parameters)==null?void 0:w.docs)==null?void 0:T.source}}};var k,O,I;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    bannerType: 'Standard',
    selected: false,
    discountedOperators: []
  }
}`,...(I=(O=c.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};var N,L,W;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: true,
    discountedOperators: []
  }
}`,...(W=(L=p.parameters)==null?void 0:L.docs)==null?void 0:W.source}}};var _,B,j;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue', 'Shu']
  }
}`,...(j=(B=m.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var A,R,D;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`function RerunWithIntCerts() {
  const [intCertsIncluded, setIntCertsIncluded] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  return <ul className="ak-events-list">
      <Event event={{
      ...rerunEvent,
      intCertsIncluded,
      banner: buildBanner('Limited', [])
    }} selectedEvents={selectedEvents} onEventToggle={name => setSelectedEvents(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);else next.add(name);
      return next;
    })} onToggleIntCerts={(_name, checked) => setIntCertsIncluded(checked)} />
    </ul>;
}`,...(D=(R=u.parameters)==null?void 0:R.docs)==null?void 0:D.source}}};var M,$,P;h.parameters={...h.parameters,docs:{...(M=h.parameters)==null?void 0:M.docs,source:{originalSource:`function NoBannerWidthComparison() {
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
}`,...(P=($=h.parameters)==null?void 0:$.docs)==null?void 0:P.source}}};var z,G,H;g.parameters={...g.parameters,docs:{...(z=g.parameters)==null?void 0:z.docs,source:{originalSource:`function ResponsiveSizes() {
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
}`,...(H=(G=g.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};const he=["NoBanner","LimitedBanner","StandardBanner","Selected","MultipleDiscountedOperators","RerunWithIntCerts","NoBannerWidthComparison","ResponsiveSizes"];export{l as LimitedBanner,m as MultipleDiscountedOperators,d as NoBanner,h as NoBannerWidthComparison,u as RerunWithIntCerts,g as ResponsiveSizes,p as Selected,c as StandardBanner,he as __namedExportsOrder,ue as default};
