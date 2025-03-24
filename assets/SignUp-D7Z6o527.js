import{r as t,j as e,L as m}from"./index-DVTODEav.js";import{N as d}from"./Normal_Button-C4mYL3sp.js";import{P as C,F as E}from"./Landing_Page-D0hfN4Ns.js";import{b as P}from"./index-B0-9yzBj.js";import{P as S}from"./Password_Input-CVcE3V3T.js";import"./iconBase-CA8JbO3F.js";import"./index-r1iFSQwA.js";const G=()=>{const a="text-gray-700 font-semibold",r="p-2 border border-gray-300 rounded-md",[l,n]=t.useState(!0),[o,x]=t.useState(!0),[c,i]=t.useState(!0),[h,u]=t.useState(""),f=["JohnDoe","JaneSmith","User123"],N=s=>{u(s),f.includes(s.trim())?n(!1):n(!0)},[p,j]=t.useState(""),b=s=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s),g=s=>{j(s),x(b(s))},[w,y]=t.useState(""),v=s=>{y(s),s.length>8?i(!1):i(!0)};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"flex w-screen h-screen justify-center items-center overflow-hidden",id:"main-content",children:[e.jsx(m,{to:"/NT_Lyrics",children:e.jsx(P,{className:"absolute bottom-2 right-2 rounded-full shadow-md p-2 w-10 h-10",size:20})}),e.jsx("div",{className:"imageContainer items-center justify-end h-full hidden md:flex md:w-1/2 bg-gray-100",children:e.jsx("img",{src:C,className:"h-3/5 rounded-lg -translate-x-44 shadow-2xl animate-left",alt:""})}),e.jsxs("div",{className:"animate-appear loginContainer flex flex-col gap-5 w-full md:w-1/2 px-5 md:px-40 text-base",children:[e.jsx("h1",{className:"text-blue-500 font-bold text-3xl italic",children:"NT Lyrics & Chords"}),e.jsx("p",{className:"text-gray-500",children:"Join our musician community today"}),e.jsx("hr",{className:"border-dashed border-gray-300"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("label",{htmlFor:"name",className:`${a}`,children:["Name"," ",!l&&e.jsx("span",{className:"text-red-500 font-bold",children:"*"})]}),e.jsx("input",{type:"text",id:"name",className:`${r} ${!l&&"border-red-400"}`,placeholder:"Enter your Name",value:h,onChange:s=>N(s.target.value)}),!l&&e.jsx("p",{className:"text-sm text-red-400 mt-1",children:"Name is already taken."})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("label",{htmlFor:"email",className:`${a}`,children:["Email"," ",!o&&e.jsx("span",{className:"text-red-500 font-bold",children:"*"})]}),e.jsx("input",{type:"text",id:"email",className:`${r} ${!o&&"border-red-400"}`,placeholder:"Enter your Email",value:p,onChange:s=>g(s.target.value)}),!o&&e.jsx("p",{className:"text-sm text-red-400 mt-1",children:"Invalid Email."})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("label",{htmlFor:"password",className:`${a}`,children:["Password"," ",!c&&e.jsx("span",{className:"text-red-500 font-bold",children:"*"})]}),e.jsx(S,{value:w,onChange:v}),e.jsx("p",{className:`text-sm mt-1 ${c?"text-gray-400":"text-red-400"}`,children:"Password must be less than 8 characters."})]}),e.jsx(d,{custom_class:"w-full bg-blue-500 border-transparent text-white font-medium",text:"Get Started"}),e.jsx(d,{custom_class:`${r} font-semibold`,icon:E,text:"Sign In With Google"}),e.jsxs("p",{children:["Already have an Account?"," ",e.jsx(m,{to:"/NT_Lyrics/login",className:"font-semibold text-blue-500",children:"Login"})]})]})]})})};export{G as default};
