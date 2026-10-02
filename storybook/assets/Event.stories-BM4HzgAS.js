import{j as t}from"./jsx-runtime-BlLNtz3U.js";import{r as b}from"./iframe-B1yqWidp.js";import{E as a}from"./index-mkyqONL9.js";import{B as Q}from"./index-C7SMJd16.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";import"./dates-CioEEh1n.js";import"./index-BoMHO8PP.js";import"./index-3qZv6aaY.js";import"./PullIcon-C9P_AB3r.js";import"./OrundumIcon-BHMkFH2G.js";import"./index-lALEmX-J.js";import"./index-DdEjE0sM.js";import"./index-2AIDlzz_.js";import"./index-CPrsw9fF.js";import"./index-DtdUxQbn.js";import"./index-4HMt1onE.js";import"./index-B2p7zCe6.js";import"./useNow-CD1ZFJL9.js";import"./index-BznEJ6Un.js";import"./index-C2nto5Ds.js";import"./SparkIcon-rV-YF7g-.js";const r={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",start:null,end:null,globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",datesPredicted:!1,origPrime:18,hhPermits:3,intCerts:null,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},q=[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}],U=[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}],X=q.filter(e=>e.star===6).map(e=>e.name);function Y(e,s){return e.limited?e.star===6?s.includes(e.name)?200:300:e.star===5?75:null:null}function E(e,s){return e==="Standard"?{name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:U.map(n=>({...n,sparkCost:null})),globalStart:r.globalStart,globalEnd:"2026-07-23"}:e==="Limited"?{name:r.name,type:"Limited",sparkEligible:!0,globalStart:r.globalStart,globalEnd:r.globalEnd,operators:q.map(n=>({...n,sparkCost:Y(n,s)}))}:null}function Z({bannerType:e,selected:s,discountedOperators:n}){const S=E(e,n);return t.jsx("ul",{className:"ak-events-list",children:t.jsx(a,{event:{...r,banner:S,...e==="Limited"&&{dailyFreePulls:14,bannerPermits:10}},selectedEvents:s?new Set([r.name]):new Set,onEventToggle:()=>{}})})}const ye={title:"Components/Event",component:a,argTypes:{bannerType:{control:"select",options:["None","Limited","Standard"],description:"Which banner (if any) is attached to the event"},selected:{control:"boolean",description:"Whether the event card is shown selected"},discountedOperators:{control:"multi-select",options:X,description:"6★ operators that currently have a reduced 200-contract spark cost. Only applies to Limited banners."}},render:Z},l={args:{bannerType:"None",selected:!1,discountedOperators:[]}},d={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue"]}},c={args:{bannerType:"Standard",selected:!1,discountedOperators:[]}},m={args:{bannerType:"Limited",selected:!0,discountedOperators:[]}},p={args:{bannerType:"Limited",selected:!1,discountedOperators:["Chongyue","Shu"]}},ee={...r,name:"When Elegies Are Ashes",type:"Side Story (Rerun)",origPrime:28,hhPermits:3,intCerts:1755};function u(){const[e,s]=b.useState(!1),[n,S]=b.useState(new Set);return t.jsx("ul",{className:"ak-events-list",children:t.jsx(a,{event:{...ee,intCertsIncluded:e,banner:E("Limited",[])},selectedEvents:n,onEventToggle:o=>S(f=>{const i=new Set(f);return i.has(o)?i.delete(o):i.add(o),i}),onToggleIntCerts:(o,f)=>s(f)})})}function g(){return t.jsxs("ul",{className:"ak-events-list",children:[t.jsx(a,{event:{...r,banner:E("Limited",["Chongyue"])},selectedEvents:new Set,onEventToggle:()=>{}}),t.jsx(a,{event:{...r,name:"A Different Event",banner:null},selectedEvents:new Set,onEventToggle:()=>{}})]})}const te=[{width:1400,height:340,label:"1400px — wide desktop: banner sits beside the event"},{width:700,height:700,label:"700px — banner drops below the event (≤900px), image stays a normal block (>480px)"},{width:420,height:820,label:"420px — image becomes a full-bleed card background (≤480px)"}];function h(){return t.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"24px",alignItems:"flex-start"},children:te.map(({width:e,height:s,label:n})=>t.jsxs("div",{children:[t.jsx("p",{style:{font:"12px monospace",marginBottom:"8px",maxWidth:`${e}px`},children:n}),t.jsx("iframe",{title:`Event at ${e}px`,src:"iframe.html?id=components-event--limited-banner&viewMode=story",style:{width:`${e}px`,height:`${s}px`,border:"1px dashed #999"}})]},e))})}const ne={items:{LMTGS_COIN_7001:150,LIMITED_TKT_GACHA_10_7001:1},pools:{LIMITED_EN_40_0_4:{pulls:150,freeCharClaimed:!1}}};function v(){const e={...E("Limited",[]),gachaPoolId:"LIMITED_EN_40_0_4",contractItemId:"LMTGS_COIN_7001",tenRollItemId:"LIMITED_TKT_GACHA_10_7001"};return t.jsx(Q.Provider,{value:ne,children:t.jsx("ul",{className:"ak-events-list",children:t.jsx(a,{event:{...r,banner:e},selectedEvents:new Set,onEventToggle:()=>{}})})})}var x,_,I;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    bannerType: 'None',
    selected: false,
    discountedOperators: []
  }
}`,...(I=(_=l.parameters)==null?void 0:_.docs)==null?void 0:I.source}}};var T,y,C;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue']
  }
}`,...(C=(y=d.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};var w,L,O;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    bannerType: 'Standard',
    selected: false,
    discountedOperators: []
  }
}`,...(O=(L=c.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var k,N,P;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: true,
    discountedOperators: []
  }
}`,...(P=(N=m.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var A,B,W;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperators: ['Chongyue', 'Shu']
  }
}`,...(W=(B=p.parameters)==null?void 0:B.docs)==null?void 0:W.source}}};var M,R,j;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`function RerunWithIntCerts() {
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
}`,...(j=(R=u.parameters)==null?void 0:R.docs)==null?void 0:j.source}}};var D,G,$;g.parameters={...g.parameters,docs:{...(D=g.parameters)==null?void 0:D.docs,source:{originalSource:`function NoBannerWidthComparison() {
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
}`,...($=(G=g.parameters)==null?void 0:G.docs)==null?void 0:$.source}}};var H,z,K;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`function ResponsiveSizes() {
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
}`,...(K=(z=h.parameters)==null?void 0:z.docs)==null?void 0:K.source}}};var F,V,J;v.parameters={...v.parameters,docs:{...(F=v.parameters)==null?void 0:F.docs,source:{originalSource:`function WithAccountProgress() {
  const banner = {
    ...(buildBanner('Limited', []) as ResolvedBanner),
    gachaPoolId: 'LIMITED_EN_40_0_4',
    contractItemId: 'LMTGS_COIN_7001',
    tenRollItemId: 'LIMITED_TKT_GACHA_10_7001'
  };
  return <BannerProgressContext.Provider value={PROGRESS}>
      <ul className="ak-events-list">
        <Event event={{
        ...baseEvent,
        banner
      }} selectedEvents={new Set()} onEventToggle={() => {}} />
      </ul>
    </BannerProgressContext.Provider>;
}`,...(J=(V=v.parameters)==null?void 0:V.docs)==null?void 0:J.source}}};const Ce=["NoBanner","LimitedBanner","StandardBanner","Selected","MultipleDiscountedOperators","RerunWithIntCerts","NoBannerWidthComparison","ResponsiveSizes","WithAccountProgress"];export{d as LimitedBanner,p as MultipleDiscountedOperators,l as NoBanner,g as NoBannerWidthComparison,u as RerunWithIntCerts,h as ResponsiveSizes,m as Selected,c as StandardBanner,v as WithAccountProgress,Ce as __namedExportsOrder,ye as default};
