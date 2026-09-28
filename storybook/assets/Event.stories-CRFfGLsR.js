import{j as t}from"./jsx-runtime-DGCgGnQo.js";import{r as b}from"./iframe-C8DC1cd3.js";import{E as a}from"./index-DPCq0We0.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";import"./dates-BsXIpBPj.js";import"./index-Ror7Ac7l.js";import"./index-BpXv8T8Q.js";import"./PullIcon-DUilbjVA.js";import"./OrundumIcon-BK2g4_4d.js";import"./index-DYmqoXor.js";import"./index-CPBW0NYC.js";import"./index-CxdqT0Ju.js";import"./index-BAiPoLRq.js";import"./SparkIcon-CIsXZqAB.js";import"./index-DRlAubcw.js";import"./index-rvNZwVKT.js";import"./index-D_nFFSAn.js";import"./index-CYW0YZRw.js";import"./index-BEruwQrG.js";const s={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",start:null,end:null,globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",datesPredicted:!1,origPrime:18,hhPermits:3,intCerts:null,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},H=[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}],V=[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}],J=H.filter(e=>e.star===6).map(e=>e.name);function q(e,r){return e.limited?e.star===6?r.includes(e.name)?200:300:e.star===5?75:null:null}function S(e,r){return e==="Standard"?{name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:V.map(n=>({...n,sparkCost:null})),globalStart:s.globalStart,globalEnd:"2026-07-23"}:e==="Limited"?{name:s.name,type:"Limited",sparkEligible:!0,globalStart:s.globalStart,globalEnd:s.globalEnd,operators:H.map(n=>({...n,sparkCost:q(n,r)}))}:null}function K({bannerType:e,selected:r,discountedOperators:n}){const v=S(e,n);return t.jsx("ul",{className:"ak-events-list",children:t.jsx(a,{event:{...s,banner:v,...e==="Limited"&&{dailyFreePulls:14,bannerPermits:10}},selectedEvents:r?new Set([s.name]):new Set,onEventToggle:()=>{}})})}const fe={title:"Components/Event",component:a,argTypes:{bannerType:{control:"select",options:["None","Limited","Standard"],description:"Which banner (if any) is attached to the event"},selected:{control:"boolean",description:"Whether the event card is shown selected"},discountedOperators:{control:"multi-select",options:J,description:"6★ operators that currently have a reduced 200-contract spark cost. Only applies to Limited banners."}},render:K},l={args:{bannerType:"None",selected:!1,discountedOperators:[]}},d={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue"]}},c={args:{bannerType:"Standard",selected:!1,discountedOperators:[]}},p={args:{bannerType:"Limited",selected:!0,discountedOperators:[]}},m={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue","Shu"]}},Q={...s,name:"When Elegies Are Ashes",type:"Side Story (Rerun)",origPrime:28,hhPermits:3,intCerts:1755};function u(){const[e,r]=b.useState(!1),[n,v]=b.useState(new Set);return t.jsx("ul",{className:"ak-events-list",children:t.jsx(a,{event:{...Q,intCertsIncluded:e,banner:S("Limited",[])},selectedEvents:n,onEventToggle:o=>v(f=>{const i=new Set(f);return i.has(o)?i.delete(o):i.add(o),i}),onToggleIntCerts:(o,f)=>r(f)})})}function g(){return t.jsxs("ul",{className:"ak-events-list",children:[t.jsx(a,{event:{...s,banner:S("Limited",["Chongyue"])},selectedEvents:new Set,onEventToggle:()=>{}}),t.jsx(a,{event:{...s,name:"A Different Event",banner:null},selectedEvents:new Set,onEventToggle:()=>{}})]})}const U=[{width:1400,height:340,label:"1400px — wide desktop: banner sits beside the event"},{width:700,height:700,label:"700px — banner drops below the event (≤900px), image stays a normal block (>480px)"},{width:420,height:820,label:"420px — image becomes a full-bleed card background (≤480px)"}];function h(){return t.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"24px",alignItems:"flex-start"},children:U.map(({width:e,height:r,label:n})=>t.jsxs("div",{children:[t.jsx("p",{style:{font:"12px monospace",marginBottom:"8px",maxWidth:`${e}px`},children:n}),t.jsx("iframe",{title:`Event at ${e}px`,src:"iframe.html?id=components-event--limited-banner&viewMode=story",style:{width:`${e}px`,height:`${r}px`,border:"1px dashed #999"}})]},e))})}var x,E,y;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    bannerType: 'None',
    selected: false,
    discountedOperators: []
  }
}`,...(y=(E=l.parameters)==null?void 0:E.docs)==null?void 0:y.source}}};var C,w,T;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue']
  }
}`,...(T=(w=d.parameters)==null?void 0:w.docs)==null?void 0:T.source}}};var k,O,I;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    bannerType: 'Standard',
    selected: false,
    discountedOperators: []
  }
}`,...(I=(O=c.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};var L,N,W;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: true,
    discountedOperators: []
  }
}`,...(W=(N=p.parameters)==null?void 0:N.docs)==null?void 0:W.source}}};var _,B,j;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(D=(R=u.parameters)==null?void 0:R.docs)==null?void 0:D.source}}};var P,M,$;g.parameters={...g.parameters,docs:{...(P=g.parameters)==null?void 0:P.docs,source:{originalSource:`function NoBannerWidthComparison() {
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
}`,...($=(M=g.parameters)==null?void 0:M.docs)==null?void 0:$.source}}};var z,F,G;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`function ResponsiveSizes() {
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
}`,...(G=(F=h.parameters)==null?void 0:F.docs)==null?void 0:G.source}}};const Se=["NoBanner","LimitedBanner","StandardBanner","Selected","MultipleDiscountedOperators","RerunWithIntCerts","NoBannerWidthComparison","ResponsiveSizes"];export{d as LimitedBanner,m as MultipleDiscountedOperators,l as NoBanner,g as NoBannerWidthComparison,u as RerunWithIntCerts,h as ResponsiveSizes,p as Selected,c as StandardBanner,Se as __namedExportsOrder,fe as default};
