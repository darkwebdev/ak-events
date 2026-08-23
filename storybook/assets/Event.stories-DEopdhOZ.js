import{R as r}from"./iframe-B1T1Yk4l.js";import{E as N}from"./index-Ce-qBo11.js";import"./preload-helper-C1FmrZbK.js";import"./images-BVwpUHA0.js";import"./index-DYW6-KW1.js";import"./index-BseJRlXy.js";import"./PullIcon-CsPdiUxV.js";import"./OrundumIcon-BVB0yx4M.js";import"./index-BVSdIsob.js";import"./index-CKfR0UGD.js";import"./index-DGyh0HAu.js";import"./index-smipMtFs.js";import"./SparkIcon-BuyR4YrW.js";import"./index-DkTOXXkO.js";const l={name:"Ashes to Ashes, Ages on Ages",type:"Side Story",image:"1280px-EN_The_Masses%27_Travels_banner.png",globalStart:"2026-07-16",globalEnd:"2026-07-30",cnStart:"2026-02-10",cnEnd:"2026-02-24",origPrime:18,hhPermits:3,link:"https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages"},O=[{name:"Ch'en the Dawnstreak",star:6,class:"Guard",limited:!1,icon:null},{name:"Chongyue",star:6,class:"Guard",limited:!0,icon:null},{name:"Shu",star:6,class:"Defender",limited:!0,icon:null},{name:"Taraxacum",star:5,class:"Medic",limited:!1,icon:null}],T=[{name:"Mudrock",star:6,class:"Defender",limited:!1,icon:null},{name:"Whisperain",star:5,class:"Medic",limited:!1,icon:null}],L=O.filter(e=>e.star===6).map(e=>e.name);function W(e,t){return e.star===6?e.name===t?200:300:e.star===5?75:null}function B(e,t){return e==="Standard"?{name:"Joint Operation #21",type:"Standard",sparkEligible:!1,operators:T.map(n=>({...n,sparkCost:null}))}:e==="Limited"?{name:l.name,type:"Limited",sparkEligible:!0,operators:O.map(n=>({...n,sparkCost:W(n,t)}))}:null}function A({bannerType:e,selected:t,discountedOperator:n}){const _=B(e,n);return r.createElement("ul",{className:"ak-events-list"},r.createElement(N,{event:{...l,banner:_},selectedEvents:t?new Set([l.name]):new Set,onEventToggle:()=>{}}))}const K={title:"Components/Event",component:N,argTypes:{bannerType:{control:"select",options:["None","Limited","Standard"],description:"Which banner (if any) is attached to the event"},selected:{control:"boolean",description:"Whether the event card is shown selected"},discountedOperator:{control:"select",options:["None",...L],description:"Which 6★ operator (if any) currently has a reduced 200-contract spark cost. Only applies to Limited banners."}},render:A},s={args:{bannerType:"None",selected:!1,discountedOperator:"None"}},o={args:{bannerType:"Limited",selected:!1,discountedOperator:"Chongyue"}},i={args:{bannerType:"Standard",selected:!1,discountedOperator:"None"}},d={args:{bannerType:"Limited",selected:!0,discountedOperator:"None"}},C=[{width:1400,height:340,label:"1400px — wide desktop: banner sits beside the event"},{width:700,height:700,label:"700px — banner drops below the event (≤900px), image stays a normal block (>480px)"},{width:420,height:820,label:"420px — image becomes a full-bleed card background (≤480px)"}];function a(){return r.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:"24px",alignItems:"flex-start"}},C.map(({width:e,height:t,label:n})=>r.createElement("div",{key:e},r.createElement("p",{style:{font:"12px monospace",marginBottom:"8px",maxWidth:`${e}px`}},n),r.createElement("iframe",{title:`Event at ${e}px`,src:"iframe.html?id=components-event--limited-banner&viewMode=story",style:{width:`${e}px`,height:`${t}px`,border:"1px dashed #999"}}))))}a.__docgenInfo={description:"",methods:[],displayName:"ResponsiveSizes"};var p,c,m;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    bannerType: 'None',
    selected: false,
    discountedOperator: 'None'
  }
}`,...(m=(c=s.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,h,g;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: false,
    discountedOperator: 'Chongyue'
  }
}`,...(g=(h=o.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var f,b,x;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    bannerType: 'Standard',
    selected: false,
    discountedOperator: 'None'
  }
}`,...(x=(b=i.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var y,S,v;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    bannerType: 'Limited',
    selected: true,
    discountedOperator: 'None'
  }
}`,...(v=(S=d.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var E,w,k;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`function ResponsiveSizes() {
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
}`,...(k=(w=a.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};const Q=["NoBanner","LimitedBanner","StandardBanner","Selected","ResponsiveSizes"];export{o as LimitedBanner,s as NoBanner,a as ResponsiveSizes,d as Selected,i as StandardBanner,Q as __namedExportsOrder,K as default};
