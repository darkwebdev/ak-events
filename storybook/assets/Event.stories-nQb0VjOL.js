import{R as t,r as S}from"./iframe-DIbKmyl5.js";import{E as d}from"./index-CcXGaLjU.js";import"./preload-helper-C1FmrZbK.js";import"./images-BVwpUHA0.js";import"./index-OVl3bfFc.js";import"./index-B9v_O1Q3.js";import"./PullIcon-D6CLEiIq.js";import"./OrundumIcon-Wn6b2gIR.js";import"./index-BGa6Ve1Q.js";import"./index-B3w_3oyi.js";import"./index-CX3xjrhm.js";import"./index-kEZYUuSk.js";import"./SparkIcon-k87Qw_ZR.js";import"./index-DjKFVnxB.js";const s={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",origPrime:18,hhPermits:3,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},F=[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}],J=[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}],j=F.filter(e=>e.star===6).map(e=>e.name);function q(e,r){return e.limited?e.star===6?r.includes(e.name)?200:300:e.star===5?75:null:null}function f(e,r){return e==="Standard"?{name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:J.map(n=>({...n,sparkCost:null}))}:e==="Limited"?{name:s.name,type:"Limited",sparkEligible:!0,operators:F.map(n=>({...n,sparkCost:q(n,r)}))}:null}function K({bannerType:e,selected:r,discountedOperators:n}){const v=f(e,n);return t.createElement("ul",{className:"ak-events-list"},t.createElement(d,{event:{...s,banner:v},selectedEvents:r?new Set([s.name]):new Set,onEventToggle:()=>{}}))}const pe={title:"Components/Event",component:d,argTypes:{bannerType:{control:"select",options:["None","Limited","Standard"],description:"Which banner (if any) is attached to the event"},selected:{control:"boolean",description:"Whether the event card is shown selected"},discountedOperators:{control:"multi-select",options:j,description:"6★ operators that currently have a reduced 200-contract spark cost. Only applies to Limited banners."}},render:K},p={args:{bannerType:"None",selected:!1,discountedOperators:[]}},m={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue"]}},u={args:{bannerType:"Standard",selected:!1,discountedOperators:[]}},h={args:{bannerType:"Limited",selected:!0,discountedOperators:[]}},g={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue","Shu"]}},Q={...s,name:"When Elegies Are Ashes",type:"Side Story (Rerun)",origPrime:28,hhPermits:3,intCerts:1755};function a(){const[e,r]=S.useState(!1),[n,v]=S.useState(new Set);return t.createElement("ul",{className:"ak-events-list"},t.createElement(d,{event:{...Q,intCertsIncluded:e,banner:f("Limited",[])},selectedEvents:n,onEventToggle:l=>v(E=>{const c=new Set(E);return c.has(l)?c.delete(l):c.add(l),c}),onToggleIntCerts:(l,E)=>r(E)}))}function o(){return t.createElement("ul",{className:"ak-events-list"},t.createElement(d,{event:{...s,banner:f("Limited",["Chongyue"])},selectedEvents:new Set,onEventToggle:()=>{}}),t.createElement(d,{event:{...s,name:"A Different Event",banner:null},selectedEvents:new Set,onEventToggle:()=>{}}))}const U=[{width:1400,height:340,label:"1400px — wide desktop: banner sits beside the event"},{width:700,height:700,label:"700px — banner drops below the event (≤900px), image stays a normal block (>480px)"},{width:420,height:820,label:"420px — image becomes a full-bleed card background (≤480px)"}];function i(){return t.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:"24px",alignItems:"flex-start"}},U.map(({width:e,height:r,label:n})=>t.createElement("div",{key:e},t.createElement("p",{style:{font:"12px monospace",marginBottom:"8px",maxWidth:`${e}px`}},n),t.createElement("iframe",{title:`Event at ${e}px`,src:"iframe.html?id=components-event--limited-banner&viewMode=story",style:{width:`${e}px`,height:`${r}px`,border:"1px dashed #999"}}))))}a.__docgenInfo={description:"",methods:[],displayName:"RerunWithIntCerts"};o.__docgenInfo={description:"",methods:[],displayName:"NoBannerWidthComparison"};i.__docgenInfo={description:"",methods:[],displayName:"ResponsiveSizes"};var b,y,x;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    bannerType: 'None',
    selected: false,
    discountedOperators: []
  }
}`,...(x=(y=p.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var C,w,T;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue']
  }
}`,...(T=(w=m.parameters)==null?void 0:w.docs)==null?void 0:T.source}}};var k,I,_;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    bannerType: 'Standard',
    selected: false,
    discountedOperators: []
  }
}`,...(_=(I=u.parameters)==null?void 0:I.docs)==null?void 0:_.source}}};var N,O,W;h.parameters={...h.parameters,docs:{...(N=h.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: true,
    discountedOperators: []
  }
}`,...(W=(O=h.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};var L,B,R;g.parameters={...g.parameters,docs:{...(L=g.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue', 'Shu']
  }
}`,...(R=(B=g.parameters)==null?void 0:B.docs)==null?void 0:R.source}}};var A,D,M;a.parameters={...a.parameters,docs:{...(A=a.parameters)==null?void 0:A.docs,source:{originalSource:`function RerunWithIntCerts() {
  const [intCertsIncluded, setIntCertsIncluded] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(new Set());
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
}`,...(M=(D=a.parameters)==null?void 0:D.docs)==null?void 0:M.source}}};var $,P,z;o.parameters={...o.parameters,docs:{...($=o.parameters)==null?void 0:$.docs,source:{originalSource:`function NoBannerWidthComparison() {
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
}`,...(z=(P=o.parameters)==null?void 0:P.docs)==null?void 0:z.source}}};var G,H,V;i.parameters={...i.parameters,docs:{...(G=i.parameters)==null?void 0:G.docs,source:{originalSource:`function ResponsiveSizes() {
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
}`,...(V=(H=i.parameters)==null?void 0:H.docs)==null?void 0:V.source}}};const me=["NoBanner","LimitedBanner","StandardBanner","Selected","MultipleDiscountedOperators","RerunWithIntCerts","NoBannerWidthComparison","ResponsiveSizes"];export{m as LimitedBanner,g as MultipleDiscountedOperators,p as NoBanner,o as NoBannerWidthComparison,a as RerunWithIntCerts,i as ResponsiveSizes,h as Selected,u as StandardBanner,me as __namedExportsOrder,pe as default};
