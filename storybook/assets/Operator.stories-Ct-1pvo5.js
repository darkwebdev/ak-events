import{j as n}from"./jsx-runtime-BTRzZzJ0.js";import{O as y}from"./index-DLhl2V8Y.js";import"./iframe-CiSBhl-1.js";import"./preload-helper-C1FmrZbK.js";import"./images-Dzy9b8zS.js";import"./SparkIcon-te2O82U4.js";function G({name:N,star:v,opClass:O,limited:D,sparkCost:o}){const E={name:N,star:v,class:O,limited:D,icon:null,sparkCost:o==="None"?null:Number(o)};return n.jsx("div",{style:{padding:"24px"},children:n.jsx(y,{operator:E})})}const _={title:"Components/Operator",component:y,argTypes:{name:{control:"text"},star:{control:"select",options:[6,5,4],description:"Rarity — only 6★/5★ ever carry a spark cost"},opClass:{control:"text",description:"Operator class, e.g. Guard, Caster"},limited:{control:"boolean",description:"Whether this is a Limited (exclusive) operator — adds the gold ring + LIMITED tag. Every sparkable operator is also Limited, so a sparkCost with limited:false is not a real combination."},sparkCost:{control:"select",options:["None","75","200","300"],description:'Headhunting Data Contract cost. 200 renders in the darker "reduced cost" color; None means not (yet) spark-redeemable.'}},render:G},e={args:{name:"Mudrock",star:6,opClass:"Defender",limited:!1,sparkCost:"None"}},r={args:{name:"Chongyue",star:6,opClass:"Guard",limited:!0,sparkCost:"None"}},a={args:{name:"Exusiai the New Covenant",star:6,opClass:"Specialist",limited:!0,sparkCost:"300"}},s={args:{name:"Ch'en the Holungday",star:6,opClass:"Guard",limited:!0,sparkCost:"200"}},t={args:{name:"Crackborne",star:5,opClass:"Defender",limited:!0,sparkCost:"75"}};var i,p,c;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    name: 'Mudrock',
    star: 6,
    opClass: 'Defender',
    limited: false,
    sparkCost: 'None'
  }
}`,...(c=(p=e.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var d,l,m;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    name: 'Chongyue',
    star: 6,
    opClass: 'Guard',
    limited: true,
    sparkCost: 'None'
  }
}`,...(m=(l=r.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var u,C,g;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    name: 'Exusiai the New Covenant',
    star: 6,
    opClass: 'Specialist',
    limited: true,
    sparkCost: '300'
  }
}`,...(g=(C=a.parameters)==null?void 0:C.docs)==null?void 0:g.source}}};var k,h,S;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    name: "Ch'en the Holungday",
    star: 6,
    opClass: 'Guard',
    limited: true,
    sparkCost: '200'
  }
}`,...(S=(h=s.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var x,b,f;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    name: 'Crackborne',
    star: 5,
    opClass: 'Defender',
    limited: true,
    sparkCost: '75'
  }
}`,...(f=(b=t.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};const F=["Plain","Limited","Sparkable","ReducedSparkCost","FiveStarSparkable"];export{t as FiveStarSparkable,r as Limited,e as Plain,s as ReducedSparkCost,a as Sparkable,F as __namedExportsOrder,_ as default};
