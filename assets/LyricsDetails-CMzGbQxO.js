import{R as u,r as R,u as me,e as ue,j as l}from"./index-XT8WscD4.js";import pe from"./Nav-DqS-X8Df.js";import fe from"./Footer-DbFkCQId.js";import{s as ge}from"./Lyrics_sample-DbaoSwNR.js";import{R as we}from"./index-CbmRQI8w.js";import{N as X}from"./Normal_Button-c7XoY3fi.js";import{C as ve}from"./index-BOPqhepm.js";import{F as xe,a as ye}from"./index-CGBS4Xg_.js";import{M as Le}from"./MessagePopup-yaKOPx-m.js";import{b as be}from"./index-CQR-aN3X.js";import"./index-CQ9WQHyn.js";import"./index-CF2s9ET1.js";function Ne(){return u.createElement("svg",{"aria-hidden":"true","data-rmiz-btn-unzoom-icon":!0,fill:"currentColor",focusable:"false",viewBox:"0 0 16 16",xmlns:"http://www.w3.org/2000/svg"},u.createElement("path",{d:"M 14.144531 1.148438 L 9 6.292969 L 9 3 L 8 3 L 8 8 L 13 8 L 13 7 L 9.707031 7 L 14.855469 1.851563 Z M 8 8 L 3 8 L 3 9 L 6.292969 9 L 1.148438 14.144531 L 1.851563 14.855469 L 7 9.707031 L 7 13 L 8 13 Z"}))}function Ee(){return u.createElement("svg",{"aria-hidden":"true","data-rmiz-btn-zoom-icon":!0,fill:"currentColor",focusable:"false",viewBox:"0 0 16 16",xmlns:"http://www.w3.org/2000/svg"},u.createElement("path",{d:"M 9 1 L 9 2 L 12.292969 2 L 2 12.292969 L 2 9 L 1 9 L 1 14 L 6 14 L 6 13 L 2.707031 13 L 13 2.707031 L 13 6 L 14 6 L 14 1 Z"}))}const j=(o,e)=>{var t,s;return o===((s=(t=e==null?void 0:e.tagName)==null?void 0:t.toUpperCase)==null?void 0:s.call(t))},Z=o=>j("DIV",o)||j("SPAN",o),T=o=>j("IMG",o),q=o=>o.complete&&o.naturalHeight!==0,M=o=>j("SVG",o),K=({height:o,offset:e,width:t})=>Math.min((window.innerWidth-e*2)/t,(window.innerHeight-e*2)/o),Se=({containerHeight:o,containerWidth:e,offset:t,targetHeight:s,targetWidth:n})=>{const a=K({height:s,offset:t,width:n}),c=n>s?n/e:s/o;return a>1?c:a*c},N=({containerHeight:o,containerWidth:e,hasScalableSrc:t,offset:s,targetHeight:n,targetWidth:a})=>!o||!e?1:!t&&n&&a?Se({containerHeight:o,containerWidth:e,offset:s,targetHeight:n,targetWidth:a}):K({height:o,offset:s,width:e}),Ce=/url(?:\(['"]?)(.*?)(?:['"]?\))/,Q=o=>{var e;if(o){if(T(o))return o.currentSrc;if(Z(o)){const t=window.getComputedStyle(o).backgroundImage;if(t)return(e=Ce.exec(t))==null?void 0:e[1]}}},De=o=>{if(o)return T(o)?o.alt??void 0:o.getAttribute("aria-label")??void 0},ze=({containerHeight:o,containerLeft:e,containerTop:t,containerWidth:s,hasScalableSrc:n,offset:a,targetHeight:c,targetWidth:d})=>{const r=N({containerHeight:o,containerWidth:s,hasScalableSrc:n,offset:a,targetHeight:c,targetWidth:d});return{top:t,left:e,width:s*r,height:o*r,transform:`translate(0,0) scale(${1/r})`}},y=({position:o,relativeNum:e})=>{const t=parseFloat(o);return o.endsWith("%")?e*t/100:t},Ie=({containerHeight:o,containerLeft:e,containerTop:t,containerWidth:s,hasScalableSrc:n,objectFit:a,objectPosition:c,offset:d,targetHeight:r,targetWidth:i})=>{if(a==="scale-down"&&(i<=s&&r<=o?a="none":a="contain"),a==="cover"||a==="contain"){const m=s/i,p=o/r,h=a==="cover"?Math.max(m,p):Math.min(m,p),[w="50%",f="50%"]=c.split(" "),v=y({position:w,relativeNum:s-i*h}),g=y({position:f,relativeNum:o-r*h}),x=N({containerHeight:r*h,containerWidth:i*h,hasScalableSrc:n,offset:d,targetHeight:r,targetWidth:i});return{top:t+g,left:e+v,width:i*h*x,height:r*h*x,transform:`translate(0,0) scale(${1/x})`}}else if(a==="none"){const[m="50%",p="50%"]=c.split(" "),h=y({position:m,relativeNum:s-i}),w=y({position:p,relativeNum:o-r}),f=N({containerHeight:r,containerWidth:i,hasScalableSrc:n,offset:d,targetHeight:r,targetWidth:i});return{top:t+w,left:e+h,width:i*f,height:r*f,transform:`translate(0,0) scale(${1/f})`}}else if(a==="fill"){const m=s/i,p=o/r,h=Math.max(m,p),w=N({containerHeight:r*h,containerWidth:i*h,hasScalableSrc:n,offset:d,targetHeight:r,targetWidth:i});return{width:s*w,height:o*w,transform:`translate(0,0) scale(${1/w})`}}else return{}},Me=({backgroundPosition:o,backgroundSize:e,containerHeight:t,containerLeft:s,containerTop:n,containerWidth:a,hasScalableSrc:c,offset:d,targetHeight:r,targetWidth:i})=>{if(e==="cover"||e==="contain"){const m=a/i,p=t/r,h=e==="cover"?Math.max(m,p):Math.min(m,p),[w="50%",f="50%"]=o.split(" "),v=y({position:w,relativeNum:a-i*h}),g=y({position:f,relativeNum:t-r*h}),x=N({containerHeight:r*h,containerWidth:i*h,hasScalableSrc:c,offset:d,targetHeight:r,targetWidth:i});return{top:n+g,left:s+v,width:i*h*x,height:r*h*x,transform:`translate(0,0) scale(${1/x})`}}else if(e==="auto"){const[m="50%",p="50%"]=o.split(" "),h=y({position:m,relativeNum:a-i}),w=y({position:p,relativeNum:t-r}),f=N({containerHeight:r,containerWidth:i,hasScalableSrc:c,offset:d,targetHeight:r,targetWidth:i});return{top:n+w,left:s+h,width:i*f,height:r*f,transform:`translate(0,0) scale(${1/f})`}}else{const[m="50%",p="50%"]=e.split(" "),h=y({position:m,relativeNum:a}),w=y({position:p,relativeNum:t}),f=h/i,v=w/r,g=Math.min(f,v),[x="50%",E="50%"]=o.split(" "),S=y({position:x,relativeNum:a-i*g}),C=y({position:E,relativeNum:t-r*g}),L=N({containerHeight:r*g,containerWidth:i*g,hasScalableSrc:c,offset:d,targetHeight:r,targetWidth:i});return{top:n+C,left:s+S,width:i*g*L,height:r*g*L,transform:`translate(0,0) scale(${1/L})`}}},je=/\.svg$/i,Te=({hasZoomImg:o,imgSrc:e,isSvg:t,isZoomed:s,loadedImgEl:n,offset:a,shouldRefresh:c,targetEl:d})=>{var x;const r=t||((x=e==null?void 0:e.slice)==null?void 0:x.call(e,0,18))==="data:image/svg+xml"||o||!!(e&&je.test(e)),i=d.getBoundingClientRect(),m=window.getComputedStyle(d),p=n!=null&&Z(d),h=n!=null&&!p,w=ze({containerHeight:i.height,containerLeft:i.left,containerTop:i.top,containerWidth:i.width,hasScalableSrc:r,offset:a,targetHeight:(n==null?void 0:n.naturalHeight)||i.height,targetWidth:(n==null?void 0:n.naturalWidth)||i.width}),f=h?Ie({containerHeight:i.height,containerLeft:i.left,containerTop:i.top,containerWidth:i.width,hasScalableSrc:r,objectFit:m.objectFit,objectPosition:m.objectPosition,offset:a,targetHeight:(n==null?void 0:n.naturalHeight)||i.height,targetWidth:(n==null?void 0:n.naturalWidth)||i.width}):void 0,v=p?Me({backgroundPosition:m.backgroundPosition,backgroundSize:m.backgroundSize,containerHeight:i.height,containerLeft:i.left,containerTop:i.top,containerWidth:i.width,hasScalableSrc:r,offset:a,targetHeight:(n==null?void 0:n.naturalHeight)||i.height,targetWidth:(n==null?void 0:n.naturalWidth)||i.width}):void 0,g=Object.assign({},w,f,v);if(s){const E=window.innerWidth/2,S=window.innerHeight/2,C=parseFloat(String(g.left||0))+parseFloat(String(g.width||0))/2,L=parseFloat(String(g.top||0))+parseFloat(String(g.height||0))/2,z=E-C,A=S-L;c&&(g.transitionDuration="0.01ms"),g.transform=`translate(${z}px,${A}px) scale(1)`}return g},U=o=>{if(!o)return{};if(M(o)){const e=o.parentElement,t=o.getBoundingClientRect();if(e){const s=e.getBoundingClientRect();return{height:t.height,left:s.left-t.left,top:s.top-t.top,width:t.width}}else return{height:t.height,left:t.left,width:t.width,top:t.top}}else return{height:o.offsetHeight,left:o.offsetLeft,width:o.offsetWidth,top:o.offsetTop}},Ae=o=>{const e="-zoom",t=["clip-path","fill","mask","marker-start","marker-mid","marker-end"],s=new Map;if(o.hasAttribute("id")){const n=o.id,a=n+e;s.set(n,a),o.id=a}o.querySelectorAll("[id]").forEach(n=>{const a=n.id,c=a+e;s.set(a,c),n.id=c}),s.forEach((n,a)=>{const c=`url(#${a})`,d=`url(#${n})`,r=t.map(i=>`[${i}="${c}"]`).join(", ");o.querySelectorAll(r).forEach(i=>{t.forEach(m=>{i.getAttribute(m)===c&&i.setAttribute(m,d)})})}),o.querySelectorAll("style").forEach(n=>{s.forEach((a,c)=>{n.textContent&&(n.textContent=n.textContent.replaceAll(`#${c}`,`#${a}`))})})},Oe=["img","svg",'[role="img"]',"[data-zoom]"].map(o=>`${o}:not([aria-hidden="true"])`).join(","),V={overflow:"",width:""};function Re(o){return u.createElement(J,{...o})}class J extends u.Component{constructor(){super(...arguments),this.state={id:"",isZoomImgLoaded:!1,loadedImgEl:void 0,modalState:"UNLOADED",shouldRefresh:!1,styleGhost:{}},this.refContent=u.createRef(),this.refDialog=u.createRef(),this.refModalContent=u.createRef(),this.refModalImg=u.createRef(),this.refWrap=u.createRef(),this.imgEl=null,this.isScaling=!1,this.prevBodyAttrs=V,this.styleModalImg={},this.handleModalStateChange=e=>{var s,n,a,c;const{modalState:t}=this.state;e!=="LOADING"&&t==="LOADING"?(this.loadZoomImg(),window.addEventListener("resize",this.handleResize,{passive:!0}),window.addEventListener("touchstart",this.handleTouchStart,{passive:!0}),window.addEventListener("touchmove",this.handleTouchMove,{passive:!0}),window.addEventListener("touchend",this.handleTouchEnd,{passive:!0}),window.addEventListener("touchcancel",this.handleTouchCancel,{passive:!0}),document.addEventListener("keydown",this.handleKeyDown,!0)):e!=="LOADED"&&t==="LOADED"?window.addEventListener("wheel",this.handleWheel,{passive:!0}):e!=="UNLOADING"&&t==="UNLOADING"?(this.ensureImgTransitionEnd(),window.removeEventListener("wheel",this.handleWheel),window.removeEventListener("touchstart",this.handleTouchStart),window.removeEventListener("touchmove",this.handleTouchMove),window.removeEventListener("touchend",this.handleTouchEnd),window.removeEventListener("touchcancel",this.handleTouchCancel),document.removeEventListener("keydown",this.handleKeyDown,!0)):e!=="UNLOADED"&&t==="UNLOADED"&&(this.bodyScrollEnable(),window.removeEventListener("resize",this.handleResize),(n=(s=this.refModalImg.current)==null?void 0:s.removeEventListener)==null||n.call(s,"transitionend",this.handleImgTransitionEnd),(c=(a=this.refDialog.current)==null?void 0:a.close)==null||c.call(a))},this.getDialogContainer=()=>{let e=document.querySelector("[data-rmiz-portal]");return e==null&&(e=document.createElement("div"),e.setAttribute("data-rmiz-portal",""),document.body.appendChild(e)),e},this.setId=()=>{const e=()=>Math.random().toString(16).slice(-4);this.setState({id:e()+e()+e()})},this.setAndTrackImg=()=>{var t,s;const e=this.refContent.current;e&&(this.imgEl=e.querySelector(Oe),this.imgEl?((s=(t=this.contentNotFoundChangeObserver)==null?void 0:t.disconnect)==null||s.call(t),this.imgEl.addEventListener("load",this.handleImgLoad),this.imgEl.addEventListener("click",this.handleZoom),this.state.loadedImgEl||this.handleImgLoad(),this.imgElResizeObserver=new ResizeObserver(n=>{const a=n[0];a!=null&&a.target&&(this.imgEl=a.target,this.setState({styleGhost:U(this.imgEl)}))}),this.imgElResizeObserver.observe(this.imgEl),this.contentChangeObserver||(this.contentChangeObserver=new MutationObserver(()=>{this.setState({styleGhost:U(this.imgEl)})}),this.contentChangeObserver.observe(e,{attributes:!0,childList:!0,subtree:!0}))):this.contentNotFoundChangeObserver||(this.contentNotFoundChangeObserver=new MutationObserver(this.setAndTrackImg),this.contentNotFoundChangeObserver.observe(e,{childList:!0,subtree:!0})))},this.handleIfZoomChanged=e=>{const{isZoomed:t}=this.props;!e&&t?this.zoom():e&&!t&&this.unzoom()},this.handleImgLoad=()=>{const e=Q(this.imgEl);if(!e)return;const t=new Image;T(this.imgEl)&&(t.sizes=this.imgEl.sizes,t.srcset=this.imgEl.srcset,t.crossOrigin=this.imgEl.crossOrigin),t.src=e;const s=()=>{this.setState({loadedImgEl:t,styleGhost:U(this.imgEl)})};t.decode().then(s).catch(()=>{if(q(t)){s();return}t.onload=s})},this.handleZoom=()=>{var e,t;this.hasImage()&&((t=(e=this.props).onZoomChange)==null||t.call(e,!0))},this.handleUnzoom=()=>{var e,t;(t=(e=this.props).onZoomChange)==null||t.call(e,!1)},this.handleBtnUnzoomClick=e=>{e.preventDefault(),e.stopPropagation(),this.handleUnzoom()},this.handleDialogCancel=e=>{e.preventDefault()},this.handleDialogClick=e=>{(e.target===this.refModalContent.current||e.target===this.refModalImg.current)&&(e.stopPropagation(),this.handleUnzoom())},this.handleDialogClose=e=>{e.stopPropagation(),this.handleUnzoom()},this.handleKeyDown=e=>{(e.key==="Escape"||e.keyCode===27)&&(e.preventDefault(),e.stopPropagation(),this.handleUnzoom())},this.handleWheel=e=>{e.ctrlKey||(e.stopPropagation(),queueMicrotask(()=>{this.handleUnzoom()}))},this.handleTouchStart=e=>{if(e.touches.length>1){this.isScaling=!0;return}e.changedTouches.length===1&&e.changedTouches[0]&&(this.touchYStart=e.changedTouches[0].screenY)},this.handleTouchMove=e=>{var s;const t=((s=window.visualViewport)==null?void 0:s.scale)??1;if(this.props.canSwipeToUnzoom&&!this.isScaling&&t<=1&&this.touchYStart!=null&&e.changedTouches[0]){this.touchYEnd=e.changedTouches[0].screenY;const n=Math.max(this.touchYStart,this.touchYEnd),a=Math.min(this.touchYStart,this.touchYEnd);Math.abs(n-a)>this.props.swipeToUnzoomThreshold&&(this.touchYStart=void 0,this.touchYEnd=void 0,this.handleUnzoom())}},this.handleTouchEnd=()=>{this.isScaling=!1,this.touchYStart=void 0,this.touchYEnd=void 0},this.handleTouchCancel=()=>{this.isScaling=!1,this.touchYStart=void 0,this.touchYEnd=void 0},this.handleResize=()=>{this.setState({shouldRefresh:!0})},this.hasImage=()=>this.imgEl&&(this.state.loadedImgEl||M(this.imgEl))&&window.getComputedStyle(this.imgEl).display!=="none",this.zoom=()=>{var e,t,s,n;this.bodyScrollDisable(),(t=(e=this.refDialog.current)==null?void 0:e.showModal)==null||t.call(e),(n=(s=this.refModalImg.current)==null?void 0:s.addEventListener)==null||n.call(s,"transitionend",this.handleImgTransitionEnd),this.setState({modalState:"LOADING"})},this.unzoom=()=>{this.setState({modalState:"UNLOADING"})},this.handleImgTransitionEnd=()=>{clearTimeout(this.timeoutTransitionEnd),this.state.modalState==="LOADING"?this.setState({modalState:"LOADED"}):this.state.modalState==="UNLOADING"&&this.setState({shouldRefresh:!1,modalState:"UNLOADED"})},this.ensureImgTransitionEnd=()=>{if(this.refModalImg.current){const e=window.getComputedStyle(this.refModalImg.current).transitionDuration,t=parseFloat(e);if(t){const s=t*(e.endsWith("ms")?1:1e3)+50;this.timeoutTransitionEnd=setTimeout(this.handleImgTransitionEnd,s)}}},this.bodyScrollDisable=()=>{this.prevBodyAttrs={overflow:document.body.style.overflow,width:document.body.style.width};const e=document.body.clientWidth;document.body.style.overflow="hidden",document.body.style.width=`${e}px`},this.bodyScrollEnable=()=>{document.body.style.width=this.prevBodyAttrs.width,document.body.style.overflow=this.prevBodyAttrs.overflow,this.prevBodyAttrs=V},this.loadZoomImg=()=>{const{props:{zoomImg:e}}=this,t=e==null?void 0:e.src;if(t){const s=new Image;s.sizes=(e==null?void 0:e.sizes)??"",s.srcset=(e==null?void 0:e.srcSet)??"",s.crossOrigin=(e==null?void 0:e.crossOrigin)??void 0,s.src=t;const n=()=>{this.setState({isZoomImgLoaded:!0})};s.decode().then(n).catch(()=>{if(q(s)){n();return}s.onload=n})}},this.UNSAFE_handleSvg=()=>{var n,a,c,d,r;const{imgEl:e,refModalImg:t,styleModalImg:s}=this;if(M(e)){const i=e.cloneNode(!0);Ae(i),i.style.width=`${s.width||0}px`,i.style.height=`${s.height||0}px`,i.addEventListener("click",this.handleUnzoom),(c=(a=(n=t.current)==null?void 0:n.firstChild)==null?void 0:a.remove)==null||c.call(a),(r=(d=t.current)==null?void 0:d.appendChild)==null||r.call(d,i)}}}render(){const{handleBtnUnzoomClick:e,handleDialogCancel:t,handleDialogClick:s,handleDialogClose:n,handleUnzoom:a,handleZoom:c,imgEl:d,props:{a11yNameButtonUnzoom:r,a11yNameButtonZoom:i,children:m,classDialog:p,IconUnzoom:h,IconZoom:w,isZoomed:f,wrapElement:v,ZoomContent:g,zoomImg:x,zoomMargin:E},refContent:S,refDialog:C,refModalContent:L,refModalImg:z,refWrap:A,state:{id:k,isZoomImgLoaded:W,loadedImgEl:H,modalState:b,shouldRefresh:ee,styleGhost:te}}=this,B=`rmiz-modal-${k}`,G=`rmiz-modal-img-${k}`,se=Z(d),I=T(d),$=M(d),O=De(d),Y=Q(d),ne=I?d.sizes:void 0,oe=I?d.srcset:void 0,ie=I?d.crossOrigin:void 0,ae=!!(x!=null&&x.src),D=this.hasImage(),re=O?`${i}: ${O}`:i,le=b==="LOADING"||b==="LOADED",ce=D?"found":"not-found",de=b==="UNLOADED"||b==="UNLOADING"?"hidden":"visible",he={visibility:b==="UNLOADED"?"visible":"hidden"};this.styleModalImg=D?Te({hasZoomImg:ae,imgSrc:Y,isSvg:$,isZoomed:f&&le,loadedImgEl:H,offset:E,shouldRefresh:ee,targetEl:d}):{};let F=null;if(D){const _=I||se?u.createElement("img",{alt:O,crossOrigin:ie,sizes:ne,src:Y,srcSet:oe,...W&&b==="LOADED"?x:{},"data-rmiz-modal-img":"",height:this.styleModalImg.height||void 0,id:G,ref:z,style:this.styleModalImg,width:this.styleModalImg.width||void 0}):$?u.createElement("div",{"data-rmiz-modal-img":!0,ref:z,style:this.styleModalImg}):null,P=u.createElement("button",{"aria-label":r,"data-rmiz-btn-unzoom":"",onClick:e,type:"button"},u.createElement(h,null));F=g?u.createElement(g,{buttonUnzoom:P,modalState:b,img:_,onUnzoom:a}):u.createElement(u.Fragment,null,_,P)}return u.createElement(v,{"aria-owns":B,"data-rmiz":"",ref:A},u.createElement(v,{"data-rmiz-content":ce,ref:S,style:he},m),D&&u.createElement(v,{"data-rmiz-ghost":"",style:te},u.createElement("button",{"aria-label":re,"data-rmiz-btn-zoom":"",onClick:c,type:"button"},u.createElement(w,null))),D&&we.createPortal(u.createElement("dialog",{"aria-labelledby":G,"aria-modal":"true",className:p,"data-rmiz-modal":"",id:B,onClick:s,onClose:n,onCancel:t,ref:C,role:"dialog"},u.createElement("div",{"data-rmiz-modal-overlay":de}),u.createElement("div",{"data-rmiz-modal-content":"",ref:L},F)),this.getDialogContainer()))}componentDidMount(){this.setId(),this.setAndTrackImg(),this.handleImgLoad(),this.UNSAFE_handleSvg()}componentWillUnmount(){var e,t,s,n,a,c,d,r,i,m,p,h;this.state.modalState!=="UNLOADED"&&this.bodyScrollEnable(),(t=(e=this.contentChangeObserver)==null?void 0:e.disconnect)==null||t.call(e),(n=(s=this.contentNotFoundChangeObserver)==null?void 0:s.disconnect)==null||n.call(s),(c=(a=this.imgElResizeObserver)==null?void 0:a.disconnect)==null||c.call(a),(r=(d=this.imgEl)==null?void 0:d.removeEventListener)==null||r.call(d,"load",this.handleImgLoad),(m=(i=this.imgEl)==null?void 0:i.removeEventListener)==null||m.call(i,"click",this.handleZoom),(h=(p=this.refModalImg.current)==null?void 0:p.removeEventListener)==null||h.call(p,"transitionend",this.handleImgTransitionEnd),window.removeEventListener("wheel",this.handleWheel),window.removeEventListener("touchstart",this.handleTouchStart),window.removeEventListener("touchmove",this.handleTouchMove),window.removeEventListener("touchend",this.handleTouchEnd),window.removeEventListener("touchcancel",this.handleTouchCancel),window.removeEventListener("resize",this.handleResize),document.removeEventListener("keydown",this.handleKeyDown,!0)}componentDidUpdate(e,t){this.handleModalStateChange(t.modalState),this.UNSAFE_handleSvg(),this.handleIfZoomChanged(e.isZoomed)}}J.defaultProps={a11yNameButtonUnzoom:"Minimize image",a11yNameButtonZoom:"Expand image",canSwipeToUnzoom:!0,IconUnzoom:Ne,IconZoom:Ee,swipeToUnzoomThreshold:10,wrapElement:"div",zoomMargin:0};function Ue(o){const[e,t]=u.useState(!1);return u.createElement(Re,{...o,isZoomed:e,onZoomChange:t})}const Ve=()=>{var w;const[o,e]=R.useState(!1),[t,s]=R.useState(""),[n,a]=R.useState(!1),c=me(),r=(w=ue().state)==null?void 0:w.lyric;if(console.log(r),!r)return l.jsx("p",{children:"Lyrics data not found."});const i=()=>{s(n?"Lyrics has been removed from the collection":"Lyrics has been added to the collection"),a(!n),e(!0),setTimeout(()=>{e(!1)},2e3)},m=()=>{c(`/NT_Lyrics/artist/${r.artist}`)},p="text-xs border border-dashed border-gray-300 text-gray-600 px-2 py-1 rounded-full  ",h=()=>{c(-1)};return l.jsxs("div",{className:"w-screen min-h-screen",children:[o&&l.jsx(Le,{message_type:"success",message_text:t}),l.jsx(pe,{}),l.jsxs("div",{className:"min-h-screen flex flex-col items-center justify-center gap-4 md:gap-8 pt-16 px-6 md:px-24",children:[l.jsx("button",{className:"w-full",onClick:h,children:l.jsx(be,{size:20})}),l.jsx("div",{className:"flex justify-center items-center w-full",children:l.jsx(Ue,{overlayBgColorEnd:"rgba(0, 0, 0, 0.8)",transitionDuration:400,zoomMargin:20,children:l.jsx("img",{src:ge,className:"w-full max-w-md rounded-lg shadow-lg",alt:"Lyrics"})})}),l.jsx("div",{className:"w-full md:w-122 aspect-video bg-gray-300 rounded-md",children:l.jsx("iframe",{className:"w-full h-full rounded-md",src:r.video_link,title:"YouTube video player",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowFullScreen:!0})}),l.jsx("div",{className:"animate-down-start w-full md:w-122 h-full bg-white rounded-lg shadow-lg p-4 md:p-8 border border-gray-200",children:l.jsxs("div",{className:"flex flex-col justify-center items-start ml-4 gap-2",children:[l.jsxs("p",{className:"text-lg font-semibold flex items-center",children:[r.title," ",l.jsx("span",{className:"text-sm font-normal ml-2 text-blue-500",children:"(Trending #3)"})]}),l.jsxs("p",{className:"text-sm text-gray-600",children:["Album - ",r.album_name]}),l.jsxs("div",{className:"genres flex flex-wrap gap-2",children:[l.jsxs("span",{className:"text-xs border border-red-300 px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold",children:["Key-",r.major_key]}),r.genre.map((f,v)=>l.jsx("span",{className:`${p}`,children:f},v))]}),l.jsx("hr",{className:"w-full border border-dashed border-gray-200 my-1"}),l.jsxs("div",{className:"flex flex-col gap-2",children:[l.jsxs("div",{className:"flex items-start gap-2",children:[l.jsx("p",{className:"text-sm text-gray-600 w-16",children:"Artist:"}),l.jsx("div",{className:"w-1/2 flex flex-wrap gap-2",children:r.artist.map((f,v)=>l.jsxs("div",{className:"flex items-center gap-2 border border-gray-200 p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap",onClick:m,children:[l.jsx("img",{src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwqXtyBSujH-HlZpZgeBViGQ_MLhG2I5FPQ&s",alt:"Lyrics",className:"w-6 h-6 rounded-full"}),l.jsx("p",{children:f})]},v))})]}),l.jsxs("div",{className:"flex items-start gap-2",children:[l.jsx("p",{className:"text-sm text-gray-600 w-16",children:"Featuring:"}),l.jsx("div",{className:"w-1/2 flex flex-wrap gap-2",children:r.featuring.map((f,v)=>l.jsxs("div",{className:"flex items-center gap-2 border border-gray-200 p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap",onClick:m,children:[l.jsx("img",{src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwqXtyBSujH-HlZpZgeBViGQ_MLhG2I5FPQ&s",alt:"Lyrics",className:"w-6 h-6 rounded-full"}),l.jsx("p",{children:f})]},v))})]}),l.jsxs("div",{className:"flex items-start gap-2",children:[l.jsx("p",{className:"text-sm text-gray-600 w-16",children:"Writer:"}),l.jsx("div",{className:"w-1/2 flex flex-wrap gap-2",children:r.writer.map((f,v)=>l.jsxs("div",{className:"flex items-center gap-2 border border-gray-200 p-1 px-2 pr-3 rounded-full cursor-pointer text-nowrap",onClick:m,children:[l.jsx("img",{src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZwqXtyBSujH-HlZpZgeBViGQ_MLhG2I5FPQ&s",alt:"Lyrics",className:"w-6 h-6 rounded-full"}),l.jsx("p",{className:"text-nowrap",children:f})]},v))})]})]}),l.jsx("hr",{className:"w-full border border-dashed border-gray-200 my-1"}),l.jsxs("div",{className:"flex justify-between w-full",children:[l.jsxs("div",{className:"flex items-center gap-1 font-semibold",children:[l.jsx(xe,{size:16,className:"translate-y-[1px]"})," ",l.jsx("span",{className:"viewCount",children:r.view_count})]}),n?l.jsx(X,{icon:ve,text:"Remove from Collection",custom_class:"py-1 px-3 border-transparent shadow-sm bg-red-50 text-red-500",onClick:i}):l.jsx(X,{icon:ye,text:"Add to collection",custom_class:"py-1 px-3 border-transparent shadow-sm bg-white",onClick:i})]})]})})]}),l.jsx(fe,{})]})};export{Ve as default};
