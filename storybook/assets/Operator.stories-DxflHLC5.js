import{j as r}from"./jsx-runtime-C7wztYQi.js";import{O as p,a as I}from"./index-KljilZnx.js";import"./iframe-B_JnlVQp.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";import"./SparkIcon-hAufPN2v.js";import"./index-DEY7ch44.js";import"./index-BU8dlmI-.js";function G({name:e,star:j,opClass:D,limited:E,sparkCost:d}){const W={name:e,star:j,class:D,limited:E,icon:null,sparkCost:d==="None"?null:Number(d)};return r.jsx("div",{style:{padding:"24px"},children:r.jsx(p,{operator:W})})}const z={title:"Components/Operator",component:p,argTypes:{name:{control:"text"},star:{control:"select",options:[6,5,4],description:"Rarity — only 6★/5★ ever carry a spark cost"},opClass:{control:"text",description:"Operator class, e.g. Guard, Caster"},limited:{control:"boolean",description:"Whether this is a Limited (exclusive) operator — adds the gold ring + LIMITED tag. Every sparkable operator is also Limited, so a sparkCost with limited:false is not a real combination."},sparkCost:{control:"select",options:["None","75","200","300"],description:'Headhunting Data Contract cost. 200 renders in the darker "reduced cost" color; None means not (yet) spark-redeemable.'}},render:G},a={args:{name:"Mudrock",star:6,opClass:"Defender",limited:!1,sparkCost:"None"}},s={args:{name:"Chongyue",star:6,opClass:"Guard",limited:!0,sparkCost:"None"}},o={args:{name:"Exusiai the New Covenant",star:6,opClass:"Specialist",limited:!0,sparkCost:"300"}},t={args:{name:"Ch'en the Holungday",star:6,opClass:"Guard",limited:!0,sparkCost:"200"}},n={args:{name:"Crackborne",star:5,opClass:"Defender",limited:!0,sparkCost:"75"}},L={char_113_cqbw:2};function i(){const e={name:"W",charId:"char_113_cqbw",star:6,class:"Sniper",limited:!0,icon:null,sparkCost:200};return r.jsx(I.Provider,{value:L,children:r.jsxs("div",{style:{padding:"24px",display:"flex",gap:"12px"},children:[r.jsx(p,{operator:e}),r.jsx(p,{operator:{...e,name:"Not owned",charId:"char_other"}})]})})}var c,l,m;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    name: 'Mudrock',
    star: 6,
    opClass: 'Defender',
    limited: false,
    sparkCost: 'None'
  }
}`,...(m=(l=a.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var u,C,g;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    name: 'Chongyue',
    star: 6,
    opClass: 'Guard',
    limited: true,
    sparkCost: 'None'
  }
}`,...(g=(C=s.parameters)==null?void 0:C.docs)==null?void 0:g.source}}};var h,k,x;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    name: 'Exusiai the New Covenant',
    star: 6,
    opClass: 'Specialist',
    limited: true,
    sparkCost: '300'
  }
}`,...(x=(k=o.parameters)==null?void 0:k.docs)==null?void 0:x.source}}};var O,S,v;t.parameters={...t.parameters,docs:{...(O=t.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    name: "Ch'en the Holungday",
    star: 6,
    opClass: 'Guard',
    limited: true,
    sparkCost: '200'
  }
}`,...(v=(S=t.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var f,y,b;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    name: 'Crackborne',
    star: 5,
    opClass: 'Defender',
    limited: true,
    sparkCost: '75'
  }
}`,...(b=(y=n.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var w,N,_;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`function Owned() {
  const operator: ResolvedBannerOperator = {
    name: 'W',
    charId: 'char_113_cqbw',
    star: 6,
    class: 'Sniper',
    limited: true,
    icon: null,
    sparkCost: 200
  };
  return <OwnedOperatorsContext.Provider value={OWNED_W}>
      <div style={{
      padding: '24px',
      display: 'flex',
      gap: '12px'
    }}>
        <Operator operator={operator} />
        <Operator operator={{
        ...operator,
        name: 'Not owned',
        charId: 'char_other'
      }} />
      </div>
    </OwnedOperatorsContext.Provider>;
}`,...(_=(N=i.parameters)==null?void 0:N.docs)==null?void 0:_.source}}};const A=["Plain","Limited","Sparkable","ReducedSparkCost","FiveStarSparkable","Owned"];export{n as FiveStarSparkable,s as Limited,i as Owned,a as Plain,t as ReducedSparkCost,o as Sparkable,A as __namedExportsOrder,z as default};
