import{R as i}from"./iframe-DNHyAXKb.js";import{O as G}from"./index-B2VlN1M3.js";import"./preload-helper-C1FmrZbK.js";import"./SparkIcon-YKI8yJFI.js";function H({name:O,star:L,opClass:E,limited:R,sparkCost:n}){const w={name:O,star:L,class:E,limited:R,icon:null,sparkCost:n==="None"?null:Number(n)};return i.createElement("div",{style:{padding:"24px"}},i.createElement(G,{operator:w}))}const I={title:"Components/Operator",component:G,argTypes:{name:{control:"text"},star:{control:"select",options:[6,5,4],description:"Rarity — only 6★/5★ ever carry a spark cost"},opClass:{control:"text",description:"Operator class, e.g. Guard, Caster"},limited:{control:"boolean",description:"Whether this is a Limited (exclusive) operator — adds the gold ring + LIMIT tag"},sparkCost:{control:"select",options:["None","75","200","300"],description:'Headhunting Data Contract cost. 200 renders in the darker "reduced cost" color; None means not (yet) spark-redeemable.'}},render:H},e={args:{name:"Mudrock",star:6,opClass:"Defender",limited:!1,sparkCost:"None"}},r={args:{name:"Chongyue",star:6,opClass:"Guard",limited:!0,sparkCost:"None"}},a={args:{name:"Ch'en the Dawnstreak",star:6,opClass:"Guard",limited:!1,sparkCost:"300"}},s={args:{name:"Exusiai the New Covenant",star:6,opClass:"Specialist",limited:!0,sparkCost:"300"}},t={args:{name:"Ch'en the Holungday",star:6,opClass:"Guard",limited:!0,sparkCost:"200"}},o={args:{name:"Crackborne",star:5,opClass:"Defender",limited:!0,sparkCost:"75"}};var p,c,d;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    name: 'Mudrock',
    star: 6,
    opClass: 'Defender',
    limited: false,
    sparkCost: 'None'
  }
}`,...(d=(c=e.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var l,m,u;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    name: 'Chongyue',
    star: 6,
    opClass: 'Guard',
    limited: true,
    sparkCost: 'None'
  }
}`,...(u=(m=r.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var C,k,g;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    name: "Ch'en the Dawnstreak",
    star: 6,
    opClass: 'Guard',
    limited: false,
    sparkCost: '300'
  }
}`,...(g=(k=a.parameters)==null?void 0:k.docs)==null?void 0:g.source}}};var h,S,f;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    name: 'Exusiai the New Covenant',
    star: 6,
    opClass: 'Specialist',
    limited: true,
    sparkCost: '300'
  }
}`,...(f=(S=s.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var b,y,N;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    name: "Ch'en the Holungday",
    star: 6,
    opClass: 'Guard',
    limited: true,
    sparkCost: '200'
  }
}`,...(N=(y=t.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};var x,v,D;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    name: 'Crackborne',
    star: 5,
    opClass: 'Defender',
    limited: true,
    sparkCost: '75'
  }
}`,...(D=(v=o.parameters)==null?void 0:v.docs)==null?void 0:D.source}}};const P=["Plain","Limited","Sparkable","LimitedAndSparkable","ReducedSparkCost","FiveStarSparkable"];export{o as FiveStarSparkable,r as Limited,s as LimitedAndSparkable,e as Plain,t as ReducedSparkCost,a as Sparkable,P as __namedExportsOrder,I as default};
