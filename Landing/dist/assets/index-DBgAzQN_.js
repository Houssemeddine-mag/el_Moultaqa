function nw(t,e){for(var n=0;n<e.length;n++){const r=e[n];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in t)){const s=Object.getOwnPropertyDescriptor(r,i);s&&Object.defineProperty(t,i,s.get?s:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();function rw(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ag={exports:{}},fl={},lg={exports:{}},X={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eo=Symbol.for("react.element"),iw=Symbol.for("react.portal"),sw=Symbol.for("react.fragment"),ow=Symbol.for("react.strict_mode"),aw=Symbol.for("react.profiler"),lw=Symbol.for("react.provider"),uw=Symbol.for("react.context"),cw=Symbol.for("react.forward_ref"),hw=Symbol.for("react.suspense"),dw=Symbol.for("react.memo"),fw=Symbol.for("react.lazy"),Ff=Symbol.iterator;function pw(t){return t===null||typeof t!="object"?null:(t=Ff&&t[Ff]||t["@@iterator"],typeof t=="function"?t:null)}var ug={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},cg=Object.assign,hg={};function Ai(t,e,n){this.props=t,this.context=e,this.refs=hg,this.updater=n||ug}Ai.prototype.isReactComponent={};Ai.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Ai.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function dg(){}dg.prototype=Ai.prototype;function uh(t,e,n){this.props=t,this.context=e,this.refs=hg,this.updater=n||ug}var ch=uh.prototype=new dg;ch.constructor=uh;cg(ch,Ai.prototype);ch.isPureReactComponent=!0;var Uf=Array.isArray,fg=Object.prototype.hasOwnProperty,hh={current:null},pg={key:!0,ref:!0,__self:!0,__source:!0};function mg(t,e,n){var r,i={},s=null,a=null;if(e!=null)for(r in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)fg.call(e,r)&&!pg.hasOwnProperty(r)&&(i[r]=e[r]);var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){for(var u=Array(l),h=0;h<l;h++)u[h]=arguments[h+2];i.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)i[r]===void 0&&(i[r]=l[r]);return{$$typeof:eo,type:t,key:s,ref:a,props:i,_owner:hh.current}}function mw(t,e){return{$$typeof:eo,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function dh(t){return typeof t=="object"&&t!==null&&t.$$typeof===eo}function gw(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var jf=/\/+/g;function du(t,e){return typeof t=="object"&&t!==null&&t.key!=null?gw(""+t.key):e.toString(36)}function oa(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case eo:case iw:a=!0}}if(a)return a=t,i=i(a),t=r===""?"."+du(a,0):r,Uf(i)?(n="",t!=null&&(n=t.replace(jf,"$&/")+"/"),oa(i,e,n,"",function(h){return h})):i!=null&&(dh(i)&&(i=mw(i,n+(!i.key||a&&a.key===i.key?"":(""+i.key).replace(jf,"$&/")+"/")+t)),e.push(i)),1;if(a=0,r=r===""?".":r+":",Uf(t))for(var l=0;l<t.length;l++){s=t[l];var u=r+du(s,l);a+=oa(s,e,n,u,i)}else if(u=pw(t),typeof u=="function")for(t=u.call(t),l=0;!(s=t.next()).done;)s=s.value,u=r+du(s,l++),a+=oa(s,e,n,u,i);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function bo(t,e,n){if(t==null)return t;var r=[],i=0;return oa(t,r,"","",function(s){return e.call(n,s,i++)}),r}function vw(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var nt={current:null},aa={transition:null},yw={ReactCurrentDispatcher:nt,ReactCurrentBatchConfig:aa,ReactCurrentOwner:hh};function gg(){throw Error("act(...) is not supported in production builds of React.")}X.Children={map:bo,forEach:function(t,e,n){bo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return bo(t,function(){e++}),e},toArray:function(t){return bo(t,function(e){return e})||[]},only:function(t){if(!dh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};X.Component=Ai;X.Fragment=sw;X.Profiler=aw;X.PureComponent=uh;X.StrictMode=ow;X.Suspense=hw;X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=yw;X.act=gg;X.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var r=cg({},t.props),i=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=hh.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)fg.call(e,u)&&!pg.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var h=0;h<u;h++)l[h]=arguments[h+2];r.children=l}return{$$typeof:eo,type:t.type,key:i,ref:s,props:r,_owner:a}};X.createContext=function(t){return t={$$typeof:uw,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:lw,_context:t},t.Consumer=t};X.createElement=mg;X.createFactory=function(t){var e=mg.bind(null,t);return e.type=t,e};X.createRef=function(){return{current:null}};X.forwardRef=function(t){return{$$typeof:cw,render:t}};X.isValidElement=dh;X.lazy=function(t){return{$$typeof:fw,_payload:{_status:-1,_result:t},_init:vw}};X.memo=function(t,e){return{$$typeof:dw,type:t,compare:e===void 0?null:e}};X.startTransition=function(t){var e=aa.transition;aa.transition={};try{t()}finally{aa.transition=e}};X.unstable_act=gg;X.useCallback=function(t,e){return nt.current.useCallback(t,e)};X.useContext=function(t){return nt.current.useContext(t)};X.useDebugValue=function(){};X.useDeferredValue=function(t){return nt.current.useDeferredValue(t)};X.useEffect=function(t,e){return nt.current.useEffect(t,e)};X.useId=function(){return nt.current.useId()};X.useImperativeHandle=function(t,e,n){return nt.current.useImperativeHandle(t,e,n)};X.useInsertionEffect=function(t,e){return nt.current.useInsertionEffect(t,e)};X.useLayoutEffect=function(t,e){return nt.current.useLayoutEffect(t,e)};X.useMemo=function(t,e){return nt.current.useMemo(t,e)};X.useReducer=function(t,e,n){return nt.current.useReducer(t,e,n)};X.useRef=function(t){return nt.current.useRef(t)};X.useState=function(t){return nt.current.useState(t)};X.useSyncExternalStore=function(t,e,n){return nt.current.useSyncExternalStore(t,e,n)};X.useTransition=function(){return nt.current.useTransition()};X.version="18.3.1";lg.exports=X;var z=lg.exports;const vg=rw(z),_w=nw({__proto__:null,default:vg},[z]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ew=z,ww=Symbol.for("react.element"),Iw=Symbol.for("react.fragment"),Tw=Object.prototype.hasOwnProperty,Sw=Ew.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Aw={key:!0,ref:!0,__self:!0,__source:!0};function yg(t,e,n){var r,i={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(r in e)Tw.call(e,r)&&!Aw.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:ww,type:t,key:s,ref:a,props:i,_owner:Sw.current}}fl.Fragment=Iw;fl.jsx=yg;fl.jsxs=yg;ag.exports=fl;var N=ag.exports,Qu={},_g={exports:{}},gt={},Eg={exports:{}},wg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(B,q){var G=B.length;B.push(q);e:for(;0<G;){var de=G-1>>>1,re=B[de];if(0<i(re,q))B[de]=q,B[G]=re,G=de;else break e}}function n(B){return B.length===0?null:B[0]}function r(B){if(B.length===0)return null;var q=B[0],G=B.pop();if(G!==q){B[0]=G;e:for(var de=0,re=B.length,Ee=re>>>1;de<Ee;){var Qt=2*(de+1)-1,Xt=B[Qt],Yt=Qt+1,Jt=B[Yt];if(0>i(Xt,G))Yt<re&&0>i(Jt,Xt)?(B[de]=Jt,B[Yt]=G,de=Yt):(B[de]=Xt,B[Qt]=G,de=Qt);else if(Yt<re&&0>i(Jt,G))B[de]=Jt,B[Yt]=G,de=Yt;else break e}}return q}function i(B,q){var G=B.sortIndex-q.sortIndex;return G!==0?G:B.id-q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,l=a.now();t.unstable_now=function(){return a.now()-l}}var u=[],h=[],f=1,m=null,v=3,S=!1,P=!1,x=!1,D=typeof setTimeout=="function"?setTimeout:null,w=typeof clearTimeout=="function"?clearTimeout:null,y=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function A(B){for(var q=n(h);q!==null;){if(q.callback===null)r(h);else if(q.startTime<=B)r(h),q.sortIndex=q.expirationTime,e(u,q);else break;q=n(h)}}function L(B){if(x=!1,A(B),!P)if(n(u)!==null)P=!0,Di(F);else{var q=n(h);q!==null&&Gt(L,q.startTime-B)}}function F(B,q){P=!1,x&&(x=!1,w(g),g=-1),S=!0;var G=v;try{for(A(q),m=n(u);m!==null&&(!(m.expirationTime>q)||B&&!C());){var de=m.callback;if(typeof de=="function"){m.callback=null,v=m.priorityLevel;var re=de(m.expirationTime<=q);q=t.unstable_now(),typeof re=="function"?m.callback=re:m===n(u)&&r(u),A(q)}else r(u);m=n(u)}if(m!==null)var Ee=!0;else{var Qt=n(h);Qt!==null&&Gt(L,Qt.startTime-q),Ee=!1}return Ee}finally{m=null,v=G,S=!1}}var U=!1,E=null,g=-1,_=5,I=-1;function C(){return!(t.unstable_now()-I<_)}function k(){if(E!==null){var B=t.unstable_now();I=B;var q=!0;try{q=E(!0,B)}finally{q?T():(U=!1,E=null)}}else U=!1}var T;if(typeof y=="function")T=function(){y(k)};else if(typeof MessageChannel<"u"){var yt=new MessageChannel,sr=yt.port2;yt.port1.onmessage=k,T=function(){sr.postMessage(null)}}else T=function(){D(k,0)};function Di(B){E=B,U||(U=!0,T())}function Gt(B,q){g=D(function(){B(t.unstable_now())},q)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(B){B.callback=null},t.unstable_continueExecution=function(){P||S||(P=!0,Di(F))},t.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):_=0<B?Math.floor(1e3/B):5},t.unstable_getCurrentPriorityLevel=function(){return v},t.unstable_getFirstCallbackNode=function(){return n(u)},t.unstable_next=function(B){switch(v){case 1:case 2:case 3:var q=3;break;default:q=v}var G=v;v=q;try{return B()}finally{v=G}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(B,q){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var G=v;v=B;try{return q()}finally{v=G}},t.unstable_scheduleCallback=function(B,q,G){var de=t.unstable_now();switch(typeof G=="object"&&G!==null?(G=G.delay,G=typeof G=="number"&&0<G?de+G:de):G=de,B){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=G+re,B={id:f++,callback:q,priorityLevel:B,startTime:G,expirationTime:re,sortIndex:-1},G>de?(B.sortIndex=G,e(h,B),n(u)===null&&B===n(h)&&(x?(w(g),g=-1):x=!0,Gt(L,G-de))):(B.sortIndex=re,e(u,B),P||S||(P=!0,Di(F))),B},t.unstable_shouldYield=C,t.unstable_wrapCallback=function(B){var q=v;return function(){var G=v;v=q;try{return B.apply(this,arguments)}finally{v=G}}}})(wg);Eg.exports=wg;var Cw=Eg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Pw=z,mt=Cw;function M(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Ig=new Set,As={};function Lr(t,e){di(t,e),di(t+"Capture",e)}function di(t,e){for(As[t]=e,t=0;t<e.length;t++)Ig.add(e[t])}var fn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Xu=Object.prototype.hasOwnProperty,Rw=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Bf={},zf={};function kw(t){return Xu.call(zf,t)?!0:Xu.call(Bf,t)?!1:Rw.test(t)?zf[t]=!0:(Bf[t]=!0,!1)}function Nw(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function xw(t,e,n,r){if(e===null||typeof e>"u"||Nw(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function rt(t,e,n,r,i,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Ue={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Ue[t]=new rt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Ue[e]=new rt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Ue[t]=new rt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Ue[t]=new rt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Ue[t]=new rt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Ue[t]=new rt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Ue[t]=new rt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Ue[t]=new rt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Ue[t]=new rt(t,5,!1,t.toLowerCase(),null,!1,!1)});var fh=/[\-:]([a-z])/g;function ph(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(fh,ph);Ue[e]=new rt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(fh,ph);Ue[e]=new rt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(fh,ph);Ue[e]=new rt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Ue[t]=new rt(t,1,!1,t.toLowerCase(),null,!1,!1)});Ue.xlinkHref=new rt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Ue[t]=new rt(t,1,!1,t.toLowerCase(),null,!0,!0)});function mh(t,e,n,r){var i=Ue.hasOwnProperty(e)?Ue[e]:null;(i!==null?i.type!==0:r||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(xw(e,n,i,r)&&(n=null),r||i===null?kw(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var _n=Pw.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Fo=Symbol.for("react.element"),Hr=Symbol.for("react.portal"),Wr=Symbol.for("react.fragment"),gh=Symbol.for("react.strict_mode"),Yu=Symbol.for("react.profiler"),Tg=Symbol.for("react.provider"),Sg=Symbol.for("react.context"),vh=Symbol.for("react.forward_ref"),Ju=Symbol.for("react.suspense"),Zu=Symbol.for("react.suspense_list"),yh=Symbol.for("react.memo"),Cn=Symbol.for("react.lazy"),Ag=Symbol.for("react.offscreen"),$f=Symbol.iterator;function qi(t){return t===null||typeof t!="object"?null:(t=$f&&t[$f]||t["@@iterator"],typeof t=="function"?t:null)}var ge=Object.assign,fu;function rs(t){if(fu===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);fu=e&&e[1]||""}return`
`+fu+t}var pu=!1;function mu(t,e){if(!t||pu)return"";pu=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(h){var r=h}Reflect.construct(t,[],e)}else{try{e.call()}catch(h){r=h}t.call(e.prototype)}else{try{throw Error()}catch(h){r=h}t()}}catch(h){if(h&&r&&typeof h.stack=="string"){for(var i=h.stack.split(`
`),s=r.stack.split(`
`),a=i.length-1,l=s.length-1;1<=a&&0<=l&&i[a]!==s[l];)l--;for(;1<=a&&0<=l;a--,l--)if(i[a]!==s[l]){if(a!==1||l!==1)do if(a--,l--,0>l||i[a]!==s[l]){var u=`
`+i[a].replace(" at new "," at ");return t.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",t.displayName)),u}while(1<=a&&0<=l);break}}}finally{pu=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?rs(t):""}function Ow(t){switch(t.tag){case 5:return rs(t.type);case 16:return rs("Lazy");case 13:return rs("Suspense");case 19:return rs("SuspenseList");case 0:case 2:case 15:return t=mu(t.type,!1),t;case 11:return t=mu(t.type.render,!1),t;case 1:return t=mu(t.type,!0),t;default:return""}}function ec(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Wr:return"Fragment";case Hr:return"Portal";case Yu:return"Profiler";case gh:return"StrictMode";case Ju:return"Suspense";case Zu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Sg:return(t.displayName||"Context")+".Consumer";case Tg:return(t._context.displayName||"Context")+".Provider";case vh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case yh:return e=t.displayName||null,e!==null?e:ec(t.type)||"Memo";case Cn:e=t._payload,t=t._init;try{return ec(t(e))}catch{}}return null}function Dw(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ec(e);case 8:return e===gh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Gn(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Cg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Lw(t){var e=Cg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(a){r=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(a){r=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Uo(t){t._valueTracker||(t._valueTracker=Lw(t))}function Pg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=Cg(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function Aa(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function tc(t,e){var n=e.checked;return ge({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Hf(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=Gn(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Rg(t,e){e=e.checked,e!=null&&mh(t,"checked",e,!1)}function nc(t,e){Rg(t,e);var n=Gn(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?rc(t,e.type,n):e.hasOwnProperty("defaultValue")&&rc(t,e.type,Gn(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Wf(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function rc(t,e,n){(e!=="number"||Aa(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var is=Array.isArray;function ni(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+Gn(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function ic(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(M(91));return ge({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Kf(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(M(92));if(is(n)){if(1<n.length)throw Error(M(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Gn(n)}}function kg(t,e){var n=Gn(e.value),r=Gn(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function qf(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Ng(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function sc(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Ng(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var jo,xg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(jo=jo||document.createElement("div"),jo.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=jo.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Cs(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var hs={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Vw=["Webkit","ms","Moz","O"];Object.keys(hs).forEach(function(t){Vw.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),hs[e]=hs[t]})});function Og(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||hs.hasOwnProperty(t)&&hs[t]?(""+e).trim():e+"px"}function Dg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Og(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var Mw=ge({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function oc(t,e){if(e){if(Mw[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(M(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(M(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(M(61))}if(e.style!=null&&typeof e.style!="object")throw Error(M(62))}}function ac(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var lc=null;function _h(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var uc=null,ri=null,ii=null;function Gf(t){if(t=ro(t)){if(typeof uc!="function")throw Error(M(280));var e=t.stateNode;e&&(e=yl(e),uc(t.stateNode,t.type,e))}}function Lg(t){ri?ii?ii.push(t):ii=[t]:ri=t}function Vg(){if(ri){var t=ri,e=ii;if(ii=ri=null,Gf(t),e)for(t=0;t<e.length;t++)Gf(e[t])}}function Mg(t,e){return t(e)}function bg(){}var gu=!1;function Fg(t,e,n){if(gu)return t(e,n);gu=!0;try{return Mg(t,e,n)}finally{gu=!1,(ri!==null||ii!==null)&&(bg(),Vg())}}function Ps(t,e){var n=t.stateNode;if(n===null)return null;var r=yl(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(M(231,e,typeof n));return n}var cc=!1;if(fn)try{var Gi={};Object.defineProperty(Gi,"passive",{get:function(){cc=!0}}),window.addEventListener("test",Gi,Gi),window.removeEventListener("test",Gi,Gi)}catch{cc=!1}function bw(t,e,n,r,i,s,a,l,u){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(f){this.onError(f)}}var ds=!1,Ca=null,Pa=!1,hc=null,Fw={onError:function(t){ds=!0,Ca=t}};function Uw(t,e,n,r,i,s,a,l,u){ds=!1,Ca=null,bw.apply(Fw,arguments)}function jw(t,e,n,r,i,s,a,l,u){if(Uw.apply(this,arguments),ds){if(ds){var h=Ca;ds=!1,Ca=null}else throw Error(M(198));Pa||(Pa=!0,hc=h)}}function Vr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Ug(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Qf(t){if(Vr(t)!==t)throw Error(M(188))}function Bw(t){var e=t.alternate;if(!e){if(e=Vr(t),e===null)throw Error(M(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return Qf(i),t;if(s===r)return Qf(i),e;s=s.sibling}throw Error(M(188))}if(n.return!==r.return)n=i,r=s;else{for(var a=!1,l=i.child;l;){if(l===n){a=!0,n=i,r=s;break}if(l===r){a=!0,r=i,n=s;break}l=l.sibling}if(!a){for(l=s.child;l;){if(l===n){a=!0,n=s,r=i;break}if(l===r){a=!0,r=s,n=i;break}l=l.sibling}if(!a)throw Error(M(189))}}if(n.alternate!==r)throw Error(M(190))}if(n.tag!==3)throw Error(M(188));return n.stateNode.current===n?t:e}function jg(t){return t=Bw(t),t!==null?Bg(t):null}function Bg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Bg(t);if(e!==null)return e;t=t.sibling}return null}var zg=mt.unstable_scheduleCallback,Xf=mt.unstable_cancelCallback,zw=mt.unstable_shouldYield,$w=mt.unstable_requestPaint,we=mt.unstable_now,Hw=mt.unstable_getCurrentPriorityLevel,Eh=mt.unstable_ImmediatePriority,$g=mt.unstable_UserBlockingPriority,Ra=mt.unstable_NormalPriority,Ww=mt.unstable_LowPriority,Hg=mt.unstable_IdlePriority,pl=null,zt=null;function Kw(t){if(zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(pl,t,void 0,(t.current.flags&128)===128)}catch{}}var Vt=Math.clz32?Math.clz32:Qw,qw=Math.log,Gw=Math.LN2;function Qw(t){return t>>>=0,t===0?32:31-(qw(t)/Gw|0)|0}var Bo=64,zo=4194304;function ss(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function ka(t,e){var n=t.pendingLanes;if(n===0)return 0;var r=0,i=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var l=a&~i;l!==0?r=ss(l):(s&=a,s!==0&&(r=ss(s)))}else a=n&~i,a!==0?r=ss(a):s!==0&&(r=ss(s));if(r===0)return 0;if(e!==0&&e!==r&&!(e&i)&&(i=r&-r,s=e&-e,i>=s||i===16&&(s&4194240)!==0))return e;if(r&4&&(r|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-Vt(e),i=1<<n,r|=t[n],e&=~i;return r}function Xw(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Yw(t,e){for(var n=t.suspendedLanes,r=t.pingedLanes,i=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Vt(s),l=1<<a,u=i[a];u===-1?(!(l&n)||l&r)&&(i[a]=Xw(l,e)):u<=e&&(t.expiredLanes|=l),s&=~l}}function dc(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Wg(){var t=Bo;return Bo<<=1,!(Bo&4194240)&&(Bo=64),t}function vu(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function to(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Vt(e),t[e]=n}function Jw(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var r=t.eventTimes;for(t=t.expirationTimes;0<n;){var i=31-Vt(n),s=1<<i;e[i]=0,r[i]=-1,t[i]=-1,n&=~s}}function wh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var r=31-Vt(n),i=1<<r;i&e|t[r]&e&&(t[r]|=e),n&=~i}}var ne=0;function Kg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var qg,Ih,Gg,Qg,Xg,fc=!1,$o=[],Mn=null,bn=null,Fn=null,Rs=new Map,ks=new Map,Rn=[],Zw="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Yf(t,e){switch(t){case"focusin":case"focusout":Mn=null;break;case"dragenter":case"dragleave":bn=null;break;case"mouseover":case"mouseout":Fn=null;break;case"pointerover":case"pointerout":Rs.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ks.delete(e.pointerId)}}function Qi(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},e!==null&&(e=ro(e),e!==null&&Ih(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function e0(t,e,n,r,i){switch(e){case"focusin":return Mn=Qi(Mn,t,e,n,r,i),!0;case"dragenter":return bn=Qi(bn,t,e,n,r,i),!0;case"mouseover":return Fn=Qi(Fn,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return Rs.set(s,Qi(Rs.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,ks.set(s,Qi(ks.get(s)||null,t,e,n,r,i)),!0}return!1}function Yg(t){var e=fr(t.target);if(e!==null){var n=Vr(e);if(n!==null){if(e=n.tag,e===13){if(e=Ug(n),e!==null){t.blockedOn=e,Xg(t.priority,function(){Gg(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function la(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=pc(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var r=new n.constructor(n.type,n);lc=r,n.target.dispatchEvent(r),lc=null}else return e=ro(n),e!==null&&Ih(e),t.blockedOn=n,!1;e.shift()}return!0}function Jf(t,e,n){la(t)&&n.delete(e)}function t0(){fc=!1,Mn!==null&&la(Mn)&&(Mn=null),bn!==null&&la(bn)&&(bn=null),Fn!==null&&la(Fn)&&(Fn=null),Rs.forEach(Jf),ks.forEach(Jf)}function Xi(t,e){t.blockedOn===e&&(t.blockedOn=null,fc||(fc=!0,mt.unstable_scheduleCallback(mt.unstable_NormalPriority,t0)))}function Ns(t){function e(i){return Xi(i,t)}if(0<$o.length){Xi($o[0],t);for(var n=1;n<$o.length;n++){var r=$o[n];r.blockedOn===t&&(r.blockedOn=null)}}for(Mn!==null&&Xi(Mn,t),bn!==null&&Xi(bn,t),Fn!==null&&Xi(Fn,t),Rs.forEach(e),ks.forEach(e),n=0;n<Rn.length;n++)r=Rn[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<Rn.length&&(n=Rn[0],n.blockedOn===null);)Yg(n),n.blockedOn===null&&Rn.shift()}var si=_n.ReactCurrentBatchConfig,Na=!0;function n0(t,e,n,r){var i=ne,s=si.transition;si.transition=null;try{ne=1,Th(t,e,n,r)}finally{ne=i,si.transition=s}}function r0(t,e,n,r){var i=ne,s=si.transition;si.transition=null;try{ne=4,Th(t,e,n,r)}finally{ne=i,si.transition=s}}function Th(t,e,n,r){if(Na){var i=pc(t,e,n,r);if(i===null)Pu(t,e,r,xa,n),Yf(t,r);else if(e0(i,t,e,n,r))r.stopPropagation();else if(Yf(t,r),e&4&&-1<Zw.indexOf(t)){for(;i!==null;){var s=ro(i);if(s!==null&&qg(s),s=pc(t,e,n,r),s===null&&Pu(t,e,r,xa,n),s===i)break;i=s}i!==null&&r.stopPropagation()}else Pu(t,e,r,null,n)}}var xa=null;function pc(t,e,n,r){if(xa=null,t=_h(r),t=fr(t),t!==null)if(e=Vr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Ug(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return xa=t,null}function Jg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Hw()){case Eh:return 1;case $g:return 4;case Ra:case Ww:return 16;case Hg:return 536870912;default:return 16}default:return 16}}var Dn=null,Sh=null,ua=null;function Zg(){if(ua)return ua;var t,e=Sh,n=e.length,r,i="value"in Dn?Dn.value:Dn.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var a=n-t;for(r=1;r<=a&&e[n-r]===i[s-r];r++);return ua=i.slice(t,1<r?1-r:void 0)}function ca(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Ho(){return!0}function Zf(){return!1}function vt(t){function e(n,r,i,s,a){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Ho:Zf,this.isPropagationStopped=Zf,this}return ge(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ho)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ho)},persist:function(){},isPersistent:Ho}),e}var Ci={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ah=vt(Ci),no=ge({},Ci,{view:0,detail:0}),i0=vt(no),yu,_u,Yi,ml=ge({},no,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ch,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Yi&&(Yi&&t.type==="mousemove"?(yu=t.screenX-Yi.screenX,_u=t.screenY-Yi.screenY):_u=yu=0,Yi=t),yu)},movementY:function(t){return"movementY"in t?t.movementY:_u}}),ep=vt(ml),s0=ge({},ml,{dataTransfer:0}),o0=vt(s0),a0=ge({},no,{relatedTarget:0}),Eu=vt(a0),l0=ge({},Ci,{animationName:0,elapsedTime:0,pseudoElement:0}),u0=vt(l0),c0=ge({},Ci,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),h0=vt(c0),d0=ge({},Ci,{data:0}),tp=vt(d0),f0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},p0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},m0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function g0(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=m0[t])?!!e[t]:!1}function Ch(){return g0}var v0=ge({},no,{key:function(t){if(t.key){var e=f0[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=ca(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?p0[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ch,charCode:function(t){return t.type==="keypress"?ca(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?ca(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),y0=vt(v0),_0=ge({},ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),np=vt(_0),E0=ge({},no,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ch}),w0=vt(E0),I0=ge({},Ci,{propertyName:0,elapsedTime:0,pseudoElement:0}),T0=vt(I0),S0=ge({},ml,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),A0=vt(S0),C0=[9,13,27,32],Ph=fn&&"CompositionEvent"in window,fs=null;fn&&"documentMode"in document&&(fs=document.documentMode);var P0=fn&&"TextEvent"in window&&!fs,ev=fn&&(!Ph||fs&&8<fs&&11>=fs),rp=" ",ip=!1;function tv(t,e){switch(t){case"keyup":return C0.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function nv(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Kr=!1;function R0(t,e){switch(t){case"compositionend":return nv(e);case"keypress":return e.which!==32?null:(ip=!0,rp);case"textInput":return t=e.data,t===rp&&ip?null:t;default:return null}}function k0(t,e){if(Kr)return t==="compositionend"||!Ph&&tv(t,e)?(t=Zg(),ua=Sh=Dn=null,Kr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return ev&&e.locale!=="ko"?null:e.data;default:return null}}var N0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function sp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!N0[t.type]:e==="textarea"}function rv(t,e,n,r){Lg(r),e=Oa(e,"onChange"),0<e.length&&(n=new Ah("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var ps=null,xs=null;function x0(t){pv(t,0)}function gl(t){var e=Qr(t);if(Pg(e))return t}function O0(t,e){if(t==="change")return e}var iv=!1;if(fn){var wu;if(fn){var Iu="oninput"in document;if(!Iu){var op=document.createElement("div");op.setAttribute("oninput","return;"),Iu=typeof op.oninput=="function"}wu=Iu}else wu=!1;iv=wu&&(!document.documentMode||9<document.documentMode)}function ap(){ps&&(ps.detachEvent("onpropertychange",sv),xs=ps=null)}function sv(t){if(t.propertyName==="value"&&gl(xs)){var e=[];rv(e,xs,t,_h(t)),Fg(x0,e)}}function D0(t,e,n){t==="focusin"?(ap(),ps=e,xs=n,ps.attachEvent("onpropertychange",sv)):t==="focusout"&&ap()}function L0(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return gl(xs)}function V0(t,e){if(t==="click")return gl(e)}function M0(t,e){if(t==="input"||t==="change")return gl(e)}function b0(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Ft=typeof Object.is=="function"?Object.is:b0;function Os(t,e){if(Ft(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Xu.call(e,i)||!Ft(t[i],e[i]))return!1}return!0}function lp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function up(t,e){var n=lp(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=lp(n)}}function ov(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?ov(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function av(){for(var t=window,e=Aa();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Aa(t.document)}return e}function Rh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function F0(t){var e=av(),n=t.focusedElem,r=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&ov(n.ownerDocument.documentElement,n)){if(r!==null&&Rh(n)){if(e=r.start,t=r.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=n.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!t.extend&&s>r&&(i=r,r=s,s=i),i=up(n,s);var a=up(n,r);i&&a&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),s>r?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var U0=fn&&"documentMode"in document&&11>=document.documentMode,qr=null,mc=null,ms=null,gc=!1;function cp(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;gc||qr==null||qr!==Aa(r)||(r=qr,"selectionStart"in r&&Rh(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),ms&&Os(ms,r)||(ms=r,r=Oa(mc,"onSelect"),0<r.length&&(e=new Ah("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=qr)))}function Wo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Gr={animationend:Wo("Animation","AnimationEnd"),animationiteration:Wo("Animation","AnimationIteration"),animationstart:Wo("Animation","AnimationStart"),transitionend:Wo("Transition","TransitionEnd")},Tu={},lv={};fn&&(lv=document.createElement("div").style,"AnimationEvent"in window||(delete Gr.animationend.animation,delete Gr.animationiteration.animation,delete Gr.animationstart.animation),"TransitionEvent"in window||delete Gr.transitionend.transition);function vl(t){if(Tu[t])return Tu[t];if(!Gr[t])return t;var e=Gr[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in lv)return Tu[t]=e[n];return t}var uv=vl("animationend"),cv=vl("animationiteration"),hv=vl("animationstart"),dv=vl("transitionend"),fv=new Map,hp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Zn(t,e){fv.set(t,e),Lr(e,[t])}for(var Su=0;Su<hp.length;Su++){var Au=hp[Su],j0=Au.toLowerCase(),B0=Au[0].toUpperCase()+Au.slice(1);Zn(j0,"on"+B0)}Zn(uv,"onAnimationEnd");Zn(cv,"onAnimationIteration");Zn(hv,"onAnimationStart");Zn("dblclick","onDoubleClick");Zn("focusin","onFocus");Zn("focusout","onBlur");Zn(dv,"onTransitionEnd");di("onMouseEnter",["mouseout","mouseover"]);di("onMouseLeave",["mouseout","mouseover"]);di("onPointerEnter",["pointerout","pointerover"]);di("onPointerLeave",["pointerout","pointerover"]);Lr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Lr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Lr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Lr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Lr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Lr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var os="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),z0=new Set("cancel close invalid load scroll toggle".split(" ").concat(os));function dp(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,jw(r,e,void 0,t),t.currentTarget=null}function pv(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var a=r.length-1;0<=a;a--){var l=r[a],u=l.instance,h=l.currentTarget;if(l=l.listener,u!==s&&i.isPropagationStopped())break e;dp(i,l,h),s=u}else for(a=0;a<r.length;a++){if(l=r[a],u=l.instance,h=l.currentTarget,l=l.listener,u!==s&&i.isPropagationStopped())break e;dp(i,l,h),s=u}}}if(Pa)throw t=hc,Pa=!1,hc=null,t}function ue(t,e){var n=e[wc];n===void 0&&(n=e[wc]=new Set);var r=t+"__bubble";n.has(r)||(mv(e,t,2,!1),n.add(r))}function Cu(t,e,n){var r=0;e&&(r|=4),mv(n,t,r,e)}var Ko="_reactListening"+Math.random().toString(36).slice(2);function Ds(t){if(!t[Ko]){t[Ko]=!0,Ig.forEach(function(n){n!=="selectionchange"&&(z0.has(n)||Cu(n,!1,t),Cu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Ko]||(e[Ko]=!0,Cu("selectionchange",!1,e))}}function mv(t,e,n,r){switch(Jg(e)){case 1:var i=n0;break;case 4:i=r0;break;default:i=Th}n=i.bind(null,e,n,t),i=void 0,!cc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function Pu(t,e,n,r,i){var s=r;if(!(e&1)&&!(e&2)&&r!==null)e:for(;;){if(r===null)return;var a=r.tag;if(a===3||a===4){var l=r.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(a===4)for(a=r.return;a!==null;){var u=a.tag;if((u===3||u===4)&&(u=a.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;a=a.return}for(;l!==null;){if(a=fr(l),a===null)return;if(u=a.tag,u===5||u===6){r=s=a;continue e}l=l.parentNode}}r=r.return}Fg(function(){var h=s,f=_h(n),m=[];e:{var v=fv.get(t);if(v!==void 0){var S=Ah,P=t;switch(t){case"keypress":if(ca(n)===0)break e;case"keydown":case"keyup":S=y0;break;case"focusin":P="focus",S=Eu;break;case"focusout":P="blur",S=Eu;break;case"beforeblur":case"afterblur":S=Eu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":S=ep;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":S=o0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":S=w0;break;case uv:case cv:case hv:S=u0;break;case dv:S=T0;break;case"scroll":S=i0;break;case"wheel":S=A0;break;case"copy":case"cut":case"paste":S=h0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":S=np}var x=(e&4)!==0,D=!x&&t==="scroll",w=x?v!==null?v+"Capture":null:v;x=[];for(var y=h,A;y!==null;){A=y;var L=A.stateNode;if(A.tag===5&&L!==null&&(A=L,w!==null&&(L=Ps(y,w),L!=null&&x.push(Ls(y,L,A)))),D)break;y=y.return}0<x.length&&(v=new S(v,P,null,n,f),m.push({event:v,listeners:x}))}}if(!(e&7)){e:{if(v=t==="mouseover"||t==="pointerover",S=t==="mouseout"||t==="pointerout",v&&n!==lc&&(P=n.relatedTarget||n.fromElement)&&(fr(P)||P[pn]))break e;if((S||v)&&(v=f.window===f?f:(v=f.ownerDocument)?v.defaultView||v.parentWindow:window,S?(P=n.relatedTarget||n.toElement,S=h,P=P?fr(P):null,P!==null&&(D=Vr(P),P!==D||P.tag!==5&&P.tag!==6)&&(P=null)):(S=null,P=h),S!==P)){if(x=ep,L="onMouseLeave",w="onMouseEnter",y="mouse",(t==="pointerout"||t==="pointerover")&&(x=np,L="onPointerLeave",w="onPointerEnter",y="pointer"),D=S==null?v:Qr(S),A=P==null?v:Qr(P),v=new x(L,y+"leave",S,n,f),v.target=D,v.relatedTarget=A,L=null,fr(f)===h&&(x=new x(w,y+"enter",P,n,f),x.target=A,x.relatedTarget=D,L=x),D=L,S&&P)t:{for(x=S,w=P,y=0,A=x;A;A=zr(A))y++;for(A=0,L=w;L;L=zr(L))A++;for(;0<y-A;)x=zr(x),y--;for(;0<A-y;)w=zr(w),A--;for(;y--;){if(x===w||w!==null&&x===w.alternate)break t;x=zr(x),w=zr(w)}x=null}else x=null;S!==null&&fp(m,v,S,x,!1),P!==null&&D!==null&&fp(m,D,P,x,!0)}}e:{if(v=h?Qr(h):window,S=v.nodeName&&v.nodeName.toLowerCase(),S==="select"||S==="input"&&v.type==="file")var F=O0;else if(sp(v))if(iv)F=M0;else{F=L0;var U=D0}else(S=v.nodeName)&&S.toLowerCase()==="input"&&(v.type==="checkbox"||v.type==="radio")&&(F=V0);if(F&&(F=F(t,h))){rv(m,F,n,f);break e}U&&U(t,v,h),t==="focusout"&&(U=v._wrapperState)&&U.controlled&&v.type==="number"&&rc(v,"number",v.value)}switch(U=h?Qr(h):window,t){case"focusin":(sp(U)||U.contentEditable==="true")&&(qr=U,mc=h,ms=null);break;case"focusout":ms=mc=qr=null;break;case"mousedown":gc=!0;break;case"contextmenu":case"mouseup":case"dragend":gc=!1,cp(m,n,f);break;case"selectionchange":if(U0)break;case"keydown":case"keyup":cp(m,n,f)}var E;if(Ph)e:{switch(t){case"compositionstart":var g="onCompositionStart";break e;case"compositionend":g="onCompositionEnd";break e;case"compositionupdate":g="onCompositionUpdate";break e}g=void 0}else Kr?tv(t,n)&&(g="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(g="onCompositionStart");g&&(ev&&n.locale!=="ko"&&(Kr||g!=="onCompositionStart"?g==="onCompositionEnd"&&Kr&&(E=Zg()):(Dn=f,Sh="value"in Dn?Dn.value:Dn.textContent,Kr=!0)),U=Oa(h,g),0<U.length&&(g=new tp(g,t,null,n,f),m.push({event:g,listeners:U}),E?g.data=E:(E=nv(n),E!==null&&(g.data=E)))),(E=P0?R0(t,n):k0(t,n))&&(h=Oa(h,"onBeforeInput"),0<h.length&&(f=new tp("onBeforeInput","beforeinput",null,n,f),m.push({event:f,listeners:h}),f.data=E))}pv(m,e)})}function Ls(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Oa(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Ps(t,n),s!=null&&r.unshift(Ls(t,s,i)),s=Ps(t,e),s!=null&&r.push(Ls(t,s,i))),t=t.return}return r}function zr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function fp(t,e,n,r,i){for(var s=e._reactName,a=[];n!==null&&n!==r;){var l=n,u=l.alternate,h=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&h!==null&&(l=h,i?(u=Ps(n,s),u!=null&&a.unshift(Ls(n,u,l))):i||(u=Ps(n,s),u!=null&&a.push(Ls(n,u,l)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var $0=/\r\n?/g,H0=/\u0000|\uFFFD/g;function pp(t){return(typeof t=="string"?t:""+t).replace($0,`
`).replace(H0,"")}function qo(t,e,n){if(e=pp(e),pp(t)!==e&&n)throw Error(M(425))}function Da(){}var vc=null,yc=null;function _c(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Ec=typeof setTimeout=="function"?setTimeout:void 0,W0=typeof clearTimeout=="function"?clearTimeout:void 0,mp=typeof Promise=="function"?Promise:void 0,K0=typeof queueMicrotask=="function"?queueMicrotask:typeof mp<"u"?function(t){return mp.resolve(null).then(t).catch(q0)}:Ec;function q0(t){setTimeout(function(){throw t})}function Ru(t,e){var n=e,r=0;do{var i=n.nextSibling;if(t.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){t.removeChild(i),Ns(e);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Ns(e)}function Un(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function gp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Pi=Math.random().toString(36).slice(2),Bt="__reactFiber$"+Pi,Vs="__reactProps$"+Pi,pn="__reactContainer$"+Pi,wc="__reactEvents$"+Pi,G0="__reactListeners$"+Pi,Q0="__reactHandles$"+Pi;function fr(t){var e=t[Bt];if(e)return e;for(var n=t.parentNode;n;){if(e=n[pn]||n[Bt]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=gp(t);t!==null;){if(n=t[Bt])return n;t=gp(t)}return e}t=n,n=t.parentNode}return null}function ro(t){return t=t[Bt]||t[pn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Qr(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(M(33))}function yl(t){return t[Vs]||null}var Ic=[],Xr=-1;function er(t){return{current:t}}function ce(t){0>Xr||(t.current=Ic[Xr],Ic[Xr]=null,Xr--)}function oe(t,e){Xr++,Ic[Xr]=t.current,t.current=e}var Qn={},Xe=er(Qn),ot=er(!1),Tr=Qn;function fi(t,e){var n=t.type.contextTypes;if(!n)return Qn;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function at(t){return t=t.childContextTypes,t!=null}function La(){ce(ot),ce(Xe)}function vp(t,e,n){if(Xe.current!==Qn)throw Error(M(168));oe(Xe,e),oe(ot,n)}function gv(t,e,n){var r=t.stateNode;if(e=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in e))throw Error(M(108,Dw(t)||"Unknown",i));return ge({},n,r)}function Va(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Qn,Tr=Xe.current,oe(Xe,t),oe(ot,ot.current),!0}function yp(t,e,n){var r=t.stateNode;if(!r)throw Error(M(169));n?(t=gv(t,e,Tr),r.__reactInternalMemoizedMergedChildContext=t,ce(ot),ce(Xe),oe(Xe,t)):ce(ot),oe(ot,n)}var nn=null,_l=!1,ku=!1;function vv(t){nn===null?nn=[t]:nn.push(t)}function X0(t){_l=!0,vv(t)}function tr(){if(!ku&&nn!==null){ku=!0;var t=0,e=ne;try{var n=nn;for(ne=1;t<n.length;t++){var r=n[t];do r=r(!0);while(r!==null)}nn=null,_l=!1}catch(i){throw nn!==null&&(nn=nn.slice(t+1)),zg(Eh,tr),i}finally{ne=e,ku=!1}}return null}var Yr=[],Jr=0,Ma=null,ba=0,_t=[],Et=0,Sr=null,sn=1,on="";function cr(t,e){Yr[Jr++]=ba,Yr[Jr++]=Ma,Ma=t,ba=e}function yv(t,e,n){_t[Et++]=sn,_t[Et++]=on,_t[Et++]=Sr,Sr=t;var r=sn;t=on;var i=32-Vt(r)-1;r&=~(1<<i),n+=1;var s=32-Vt(e)+i;if(30<s){var a=i-i%5;s=(r&(1<<a)-1).toString(32),r>>=a,i-=a,sn=1<<32-Vt(e)+i|n<<i|r,on=s+t}else sn=1<<s|n<<i|r,on=t}function kh(t){t.return!==null&&(cr(t,1),yv(t,1,0))}function Nh(t){for(;t===Ma;)Ma=Yr[--Jr],Yr[Jr]=null,ba=Yr[--Jr],Yr[Jr]=null;for(;t===Sr;)Sr=_t[--Et],_t[Et]=null,on=_t[--Et],_t[Et]=null,sn=_t[--Et],_t[Et]=null}var pt=null,ft=null,he=!1,Nt=null;function _v(t,e){var n=wt(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function _p(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,pt=t,ft=Un(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,pt=t,ft=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Sr!==null?{id:sn,overflow:on}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=wt(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,pt=t,ft=null,!0):!1;default:return!1}}function Tc(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Sc(t){if(he){var e=ft;if(e){var n=e;if(!_p(t,e)){if(Tc(t))throw Error(M(418));e=Un(n.nextSibling);var r=pt;e&&_p(t,e)?_v(r,n):(t.flags=t.flags&-4097|2,he=!1,pt=t)}}else{if(Tc(t))throw Error(M(418));t.flags=t.flags&-4097|2,he=!1,pt=t}}}function Ep(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;pt=t}function Go(t){if(t!==pt)return!1;if(!he)return Ep(t),he=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!_c(t.type,t.memoizedProps)),e&&(e=ft)){if(Tc(t))throw Ev(),Error(M(418));for(;e;)_v(t,e),e=Un(e.nextSibling)}if(Ep(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(M(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){ft=Un(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}ft=null}}else ft=pt?Un(t.stateNode.nextSibling):null;return!0}function Ev(){for(var t=ft;t;)t=Un(t.nextSibling)}function pi(){ft=pt=null,he=!1}function xh(t){Nt===null?Nt=[t]:Nt.push(t)}var Y0=_n.ReactCurrentBatchConfig;function Ji(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(M(309));var r=n.stateNode}if(!r)throw Error(M(147,t));var i=r,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var l=i.refs;a===null?delete l[s]:l[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(M(284));if(!n._owner)throw Error(M(290,t))}return t}function Qo(t,e){throw t=Object.prototype.toString.call(e),Error(M(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function wp(t){var e=t._init;return e(t._payload)}function wv(t){function e(w,y){if(t){var A=w.deletions;A===null?(w.deletions=[y],w.flags|=16):A.push(y)}}function n(w,y){if(!t)return null;for(;y!==null;)e(w,y),y=y.sibling;return null}function r(w,y){for(w=new Map;y!==null;)y.key!==null?w.set(y.key,y):w.set(y.index,y),y=y.sibling;return w}function i(w,y){return w=$n(w,y),w.index=0,w.sibling=null,w}function s(w,y,A){return w.index=A,t?(A=w.alternate,A!==null?(A=A.index,A<y?(w.flags|=2,y):A):(w.flags|=2,y)):(w.flags|=1048576,y)}function a(w){return t&&w.alternate===null&&(w.flags|=2),w}function l(w,y,A,L){return y===null||y.tag!==6?(y=Mu(A,w.mode,L),y.return=w,y):(y=i(y,A),y.return=w,y)}function u(w,y,A,L){var F=A.type;return F===Wr?f(w,y,A.props.children,L,A.key):y!==null&&(y.elementType===F||typeof F=="object"&&F!==null&&F.$$typeof===Cn&&wp(F)===y.type)?(L=i(y,A.props),L.ref=Ji(w,y,A),L.return=w,L):(L=va(A.type,A.key,A.props,null,w.mode,L),L.ref=Ji(w,y,A),L.return=w,L)}function h(w,y,A,L){return y===null||y.tag!==4||y.stateNode.containerInfo!==A.containerInfo||y.stateNode.implementation!==A.implementation?(y=bu(A,w.mode,L),y.return=w,y):(y=i(y,A.children||[]),y.return=w,y)}function f(w,y,A,L,F){return y===null||y.tag!==7?(y=_r(A,w.mode,L,F),y.return=w,y):(y=i(y,A),y.return=w,y)}function m(w,y,A){if(typeof y=="string"&&y!==""||typeof y=="number")return y=Mu(""+y,w.mode,A),y.return=w,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Fo:return A=va(y.type,y.key,y.props,null,w.mode,A),A.ref=Ji(w,null,y),A.return=w,A;case Hr:return y=bu(y,w.mode,A),y.return=w,y;case Cn:var L=y._init;return m(w,L(y._payload),A)}if(is(y)||qi(y))return y=_r(y,w.mode,A,null),y.return=w,y;Qo(w,y)}return null}function v(w,y,A,L){var F=y!==null?y.key:null;if(typeof A=="string"&&A!==""||typeof A=="number")return F!==null?null:l(w,y,""+A,L);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case Fo:return A.key===F?u(w,y,A,L):null;case Hr:return A.key===F?h(w,y,A,L):null;case Cn:return F=A._init,v(w,y,F(A._payload),L)}if(is(A)||qi(A))return F!==null?null:f(w,y,A,L,null);Qo(w,A)}return null}function S(w,y,A,L,F){if(typeof L=="string"&&L!==""||typeof L=="number")return w=w.get(A)||null,l(y,w,""+L,F);if(typeof L=="object"&&L!==null){switch(L.$$typeof){case Fo:return w=w.get(L.key===null?A:L.key)||null,u(y,w,L,F);case Hr:return w=w.get(L.key===null?A:L.key)||null,h(y,w,L,F);case Cn:var U=L._init;return S(w,y,A,U(L._payload),F)}if(is(L)||qi(L))return w=w.get(A)||null,f(y,w,L,F,null);Qo(y,L)}return null}function P(w,y,A,L){for(var F=null,U=null,E=y,g=y=0,_=null;E!==null&&g<A.length;g++){E.index>g?(_=E,E=null):_=E.sibling;var I=v(w,E,A[g],L);if(I===null){E===null&&(E=_);break}t&&E&&I.alternate===null&&e(w,E),y=s(I,y,g),U===null?F=I:U.sibling=I,U=I,E=_}if(g===A.length)return n(w,E),he&&cr(w,g),F;if(E===null){for(;g<A.length;g++)E=m(w,A[g],L),E!==null&&(y=s(E,y,g),U===null?F=E:U.sibling=E,U=E);return he&&cr(w,g),F}for(E=r(w,E);g<A.length;g++)_=S(E,w,g,A[g],L),_!==null&&(t&&_.alternate!==null&&E.delete(_.key===null?g:_.key),y=s(_,y,g),U===null?F=_:U.sibling=_,U=_);return t&&E.forEach(function(C){return e(w,C)}),he&&cr(w,g),F}function x(w,y,A,L){var F=qi(A);if(typeof F!="function")throw Error(M(150));if(A=F.call(A),A==null)throw Error(M(151));for(var U=F=null,E=y,g=y=0,_=null,I=A.next();E!==null&&!I.done;g++,I=A.next()){E.index>g?(_=E,E=null):_=E.sibling;var C=v(w,E,I.value,L);if(C===null){E===null&&(E=_);break}t&&E&&C.alternate===null&&e(w,E),y=s(C,y,g),U===null?F=C:U.sibling=C,U=C,E=_}if(I.done)return n(w,E),he&&cr(w,g),F;if(E===null){for(;!I.done;g++,I=A.next())I=m(w,I.value,L),I!==null&&(y=s(I,y,g),U===null?F=I:U.sibling=I,U=I);return he&&cr(w,g),F}for(E=r(w,E);!I.done;g++,I=A.next())I=S(E,w,g,I.value,L),I!==null&&(t&&I.alternate!==null&&E.delete(I.key===null?g:I.key),y=s(I,y,g),U===null?F=I:U.sibling=I,U=I);return t&&E.forEach(function(k){return e(w,k)}),he&&cr(w,g),F}function D(w,y,A,L){if(typeof A=="object"&&A!==null&&A.type===Wr&&A.key===null&&(A=A.props.children),typeof A=="object"&&A!==null){switch(A.$$typeof){case Fo:e:{for(var F=A.key,U=y;U!==null;){if(U.key===F){if(F=A.type,F===Wr){if(U.tag===7){n(w,U.sibling),y=i(U,A.props.children),y.return=w,w=y;break e}}else if(U.elementType===F||typeof F=="object"&&F!==null&&F.$$typeof===Cn&&wp(F)===U.type){n(w,U.sibling),y=i(U,A.props),y.ref=Ji(w,U,A),y.return=w,w=y;break e}n(w,U);break}else e(w,U);U=U.sibling}A.type===Wr?(y=_r(A.props.children,w.mode,L,A.key),y.return=w,w=y):(L=va(A.type,A.key,A.props,null,w.mode,L),L.ref=Ji(w,y,A),L.return=w,w=L)}return a(w);case Hr:e:{for(U=A.key;y!==null;){if(y.key===U)if(y.tag===4&&y.stateNode.containerInfo===A.containerInfo&&y.stateNode.implementation===A.implementation){n(w,y.sibling),y=i(y,A.children||[]),y.return=w,w=y;break e}else{n(w,y);break}else e(w,y);y=y.sibling}y=bu(A,w.mode,L),y.return=w,w=y}return a(w);case Cn:return U=A._init,D(w,y,U(A._payload),L)}if(is(A))return P(w,y,A,L);if(qi(A))return x(w,y,A,L);Qo(w,A)}return typeof A=="string"&&A!==""||typeof A=="number"?(A=""+A,y!==null&&y.tag===6?(n(w,y.sibling),y=i(y,A),y.return=w,w=y):(n(w,y),y=Mu(A,w.mode,L),y.return=w,w=y),a(w)):n(w,y)}return D}var mi=wv(!0),Iv=wv(!1),Fa=er(null),Ua=null,Zr=null,Oh=null;function Dh(){Oh=Zr=Ua=null}function Lh(t){var e=Fa.current;ce(Fa),t._currentValue=e}function Ac(t,e,n){for(;t!==null;){var r=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,r!==null&&(r.childLanes|=e)):r!==null&&(r.childLanes&e)!==e&&(r.childLanes|=e),t===n)break;t=t.return}}function oi(t,e){Ua=t,Oh=Zr=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(st=!0),t.firstContext=null)}function Tt(t){var e=t._currentValue;if(Oh!==t)if(t={context:t,memoizedValue:e,next:null},Zr===null){if(Ua===null)throw Error(M(308));Zr=t,Ua.dependencies={lanes:0,firstContext:t}}else Zr=Zr.next=t;return e}var pr=null;function Vh(t){pr===null?pr=[t]:pr.push(t)}function Tv(t,e,n,r){var i=e.interleaved;return i===null?(n.next=n,Vh(e)):(n.next=i.next,i.next=n),e.interleaved=n,mn(t,r)}function mn(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Pn=!1;function Mh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Sv(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function cn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function jn(t,e,n){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,ee&2){var i=r.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),r.pending=e,mn(t,n)}return i=r.interleaved,i===null?(e.next=e,Vh(r)):(e.next=i.next,i.next=e),r.interleaved=e,mn(t,n)}function ha(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,wh(t,n)}}function Ip(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function ja(t,e,n,r){var i=t.updateQueue;Pn=!1;var s=i.firstBaseUpdate,a=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var u=l,h=u.next;u.next=null,a===null?s=h:a.next=h,a=u;var f=t.alternate;f!==null&&(f=f.updateQueue,l=f.lastBaseUpdate,l!==a&&(l===null?f.firstBaseUpdate=h:l.next=h,f.lastBaseUpdate=u))}if(s!==null){var m=i.baseState;a=0,f=h=u=null,l=s;do{var v=l.lane,S=l.eventTime;if((r&v)===v){f!==null&&(f=f.next={eventTime:S,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var P=t,x=l;switch(v=e,S=n,x.tag){case 1:if(P=x.payload,typeof P=="function"){m=P.call(S,m,v);break e}m=P;break e;case 3:P.flags=P.flags&-65537|128;case 0:if(P=x.payload,v=typeof P=="function"?P.call(S,m,v):P,v==null)break e;m=ge({},m,v);break e;case 2:Pn=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,v=i.effects,v===null?i.effects=[l]:v.push(l))}else S={eventTime:S,lane:v,tag:l.tag,payload:l.payload,callback:l.callback,next:null},f===null?(h=f=S,u=m):f=f.next=S,a|=v;if(l=l.next,l===null){if(l=i.shared.pending,l===null)break;v=l,l=v.next,v.next=null,i.lastBaseUpdate=v,i.shared.pending=null}}while(!0);if(f===null&&(u=m),i.baseState=u,i.firstBaseUpdate=h,i.lastBaseUpdate=f,e=i.shared.interleaved,e!==null){i=e;do a|=i.lane,i=i.next;while(i!==e)}else s===null&&(i.shared.lanes=0);Cr|=a,t.lanes=a,t.memoizedState=m}}function Tp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(M(191,i));i.call(r)}}}var io={},$t=er(io),Ms=er(io),bs=er(io);function mr(t){if(t===io)throw Error(M(174));return t}function bh(t,e){switch(oe(bs,e),oe(Ms,t),oe($t,io),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:sc(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=sc(e,t)}ce($t),oe($t,e)}function gi(){ce($t),ce(Ms),ce(bs)}function Av(t){mr(bs.current);var e=mr($t.current),n=sc(e,t.type);e!==n&&(oe(Ms,t),oe($t,n))}function Fh(t){Ms.current===t&&(ce($t),ce(Ms))}var pe=er(0);function Ba(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Nu=[];function Uh(){for(var t=0;t<Nu.length;t++)Nu[t]._workInProgressVersionPrimary=null;Nu.length=0}var da=_n.ReactCurrentDispatcher,xu=_n.ReactCurrentBatchConfig,Ar=0,me=null,Ce=null,ke=null,za=!1,gs=!1,Fs=0,J0=0;function $e(){throw Error(M(321))}function jh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Ft(t[n],e[n]))return!1;return!0}function Bh(t,e,n,r,i,s){if(Ar=s,me=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,da.current=t===null||t.memoizedState===null?nI:rI,t=n(r,i),gs){s=0;do{if(gs=!1,Fs=0,25<=s)throw Error(M(301));s+=1,ke=Ce=null,e.updateQueue=null,da.current=iI,t=n(r,i)}while(gs)}if(da.current=$a,e=Ce!==null&&Ce.next!==null,Ar=0,ke=Ce=me=null,za=!1,e)throw Error(M(300));return t}function zh(){var t=Fs!==0;return Fs=0,t}function jt(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ke===null?me.memoizedState=ke=t:ke=ke.next=t,ke}function St(){if(Ce===null){var t=me.alternate;t=t!==null?t.memoizedState:null}else t=Ce.next;var e=ke===null?me.memoizedState:ke.next;if(e!==null)ke=e,Ce=t;else{if(t===null)throw Error(M(310));Ce=t,t={memoizedState:Ce.memoizedState,baseState:Ce.baseState,baseQueue:Ce.baseQueue,queue:Ce.queue,next:null},ke===null?me.memoizedState=ke=t:ke=ke.next=t}return ke}function Us(t,e){return typeof e=="function"?e(t):e}function Ou(t){var e=St(),n=e.queue;if(n===null)throw Error(M(311));n.lastRenderedReducer=t;var r=Ce,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var a=i.next;i.next=s.next,s.next=a}r.baseQueue=i=s,n.pending=null}if(i!==null){s=i.next,r=r.baseState;var l=a=null,u=null,h=s;do{var f=h.lane;if((Ar&f)===f)u!==null&&(u=u.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),r=h.hasEagerState?h.eagerState:t(r,h.action);else{var m={lane:f,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};u===null?(l=u=m,a=r):u=u.next=m,me.lanes|=f,Cr|=f}h=h.next}while(h!==null&&h!==s);u===null?a=r:u.next=l,Ft(r,e.memoizedState)||(st=!0),e.memoizedState=r,e.baseState=a,e.baseQueue=u,n.lastRenderedState=r}if(t=n.interleaved,t!==null){i=t;do s=i.lane,me.lanes|=s,Cr|=s,i=i.next;while(i!==t)}else i===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Du(t){var e=St(),n=e.queue;if(n===null)throw Error(M(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var a=i=i.next;do s=t(s,a.action),a=a.next;while(a!==i);Ft(s,e.memoizedState)||(st=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function Cv(){}function Pv(t,e){var n=me,r=St(),i=e(),s=!Ft(r.memoizedState,i);if(s&&(r.memoizedState=i,st=!0),r=r.queue,$h(Nv.bind(null,n,r,t),[t]),r.getSnapshot!==e||s||ke!==null&&ke.memoizedState.tag&1){if(n.flags|=2048,js(9,kv.bind(null,n,r,i,e),void 0,null),xe===null)throw Error(M(349));Ar&30||Rv(n,e,i)}return i}function Rv(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=me.updateQueue,e===null?(e={lastEffect:null,stores:null},me.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function kv(t,e,n,r){e.value=n,e.getSnapshot=r,xv(e)&&Ov(t)}function Nv(t,e,n){return n(function(){xv(e)&&Ov(t)})}function xv(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Ft(t,n)}catch{return!0}}function Ov(t){var e=mn(t,1);e!==null&&Mt(e,t,1,-1)}function Sp(t){var e=jt();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Us,lastRenderedState:t},e.queue=t,t=t.dispatch=tI.bind(null,me,t),[e.memoizedState,t]}function js(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=me.updateQueue,e===null?(e={lastEffect:null,stores:null},me.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function Dv(){return St().memoizedState}function fa(t,e,n,r){var i=jt();me.flags|=t,i.memoizedState=js(1|e,n,void 0,r===void 0?null:r)}function El(t,e,n,r){var i=St();r=r===void 0?null:r;var s=void 0;if(Ce!==null){var a=Ce.memoizedState;if(s=a.destroy,r!==null&&jh(r,a.deps)){i.memoizedState=js(e,n,s,r);return}}me.flags|=t,i.memoizedState=js(1|e,n,s,r)}function Ap(t,e){return fa(8390656,8,t,e)}function $h(t,e){return El(2048,8,t,e)}function Lv(t,e){return El(4,2,t,e)}function Vv(t,e){return El(4,4,t,e)}function Mv(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function bv(t,e,n){return n=n!=null?n.concat([t]):null,El(4,4,Mv.bind(null,e,t),n)}function Hh(){}function Fv(t,e){var n=St();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&jh(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function Uv(t,e){var n=St();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&jh(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function jv(t,e,n){return Ar&21?(Ft(n,e)||(n=Wg(),me.lanes|=n,Cr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,st=!0),t.memoizedState=n)}function Z0(t,e){var n=ne;ne=n!==0&&4>n?n:4,t(!0);var r=xu.transition;xu.transition={};try{t(!1),e()}finally{ne=n,xu.transition=r}}function Bv(){return St().memoizedState}function eI(t,e,n){var r=zn(t);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},zv(t))$v(e,n);else if(n=Tv(t,e,n,r),n!==null){var i=tt();Mt(n,t,r,i),Hv(n,e,r)}}function tI(t,e,n){var r=zn(t),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(zv(t))$v(e,i);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,l=s(a,n);if(i.hasEagerState=!0,i.eagerState=l,Ft(l,a)){var u=e.interleaved;u===null?(i.next=i,Vh(e)):(i.next=u.next,u.next=i),e.interleaved=i;return}}catch{}finally{}n=Tv(t,e,i,r),n!==null&&(i=tt(),Mt(n,t,r,i),Hv(n,e,r))}}function zv(t){var e=t.alternate;return t===me||e!==null&&e===me}function $v(t,e){gs=za=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Hv(t,e,n){if(n&4194240){var r=e.lanes;r&=t.pendingLanes,n|=r,e.lanes=n,wh(t,n)}}var $a={readContext:Tt,useCallback:$e,useContext:$e,useEffect:$e,useImperativeHandle:$e,useInsertionEffect:$e,useLayoutEffect:$e,useMemo:$e,useReducer:$e,useRef:$e,useState:$e,useDebugValue:$e,useDeferredValue:$e,useTransition:$e,useMutableSource:$e,useSyncExternalStore:$e,useId:$e,unstable_isNewReconciler:!1},nI={readContext:Tt,useCallback:function(t,e){return jt().memoizedState=[t,e===void 0?null:e],t},useContext:Tt,useEffect:Ap,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,fa(4194308,4,Mv.bind(null,e,t),n)},useLayoutEffect:function(t,e){return fa(4194308,4,t,e)},useInsertionEffect:function(t,e){return fa(4,2,t,e)},useMemo:function(t,e){var n=jt();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=jt();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},r.queue=t,t=t.dispatch=eI.bind(null,me,t),[r.memoizedState,t]},useRef:function(t){var e=jt();return t={current:t},e.memoizedState=t},useState:Sp,useDebugValue:Hh,useDeferredValue:function(t){return jt().memoizedState=t},useTransition:function(){var t=Sp(!1),e=t[0];return t=Z0.bind(null,t[1]),jt().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var r=me,i=jt();if(he){if(n===void 0)throw Error(M(407));n=n()}else{if(n=e(),xe===null)throw Error(M(349));Ar&30||Rv(r,e,n)}i.memoizedState=n;var s={value:n,getSnapshot:e};return i.queue=s,Ap(Nv.bind(null,r,s,t),[t]),r.flags|=2048,js(9,kv.bind(null,r,s,n,e),void 0,null),n},useId:function(){var t=jt(),e=xe.identifierPrefix;if(he){var n=on,r=sn;n=(r&~(1<<32-Vt(r)-1)).toString(32)+n,e=":"+e+"R"+n,n=Fs++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=J0++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},rI={readContext:Tt,useCallback:Fv,useContext:Tt,useEffect:$h,useImperativeHandle:bv,useInsertionEffect:Lv,useLayoutEffect:Vv,useMemo:Uv,useReducer:Ou,useRef:Dv,useState:function(){return Ou(Us)},useDebugValue:Hh,useDeferredValue:function(t){var e=St();return jv(e,Ce.memoizedState,t)},useTransition:function(){var t=Ou(Us)[0],e=St().memoizedState;return[t,e]},useMutableSource:Cv,useSyncExternalStore:Pv,useId:Bv,unstable_isNewReconciler:!1},iI={readContext:Tt,useCallback:Fv,useContext:Tt,useEffect:$h,useImperativeHandle:bv,useInsertionEffect:Lv,useLayoutEffect:Vv,useMemo:Uv,useReducer:Du,useRef:Dv,useState:function(){return Du(Us)},useDebugValue:Hh,useDeferredValue:function(t){var e=St();return Ce===null?e.memoizedState=t:jv(e,Ce.memoizedState,t)},useTransition:function(){var t=Du(Us)[0],e=St().memoizedState;return[t,e]},useMutableSource:Cv,useSyncExternalStore:Pv,useId:Bv,unstable_isNewReconciler:!1};function Rt(t,e){if(t&&t.defaultProps){e=ge({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Cc(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:ge({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var wl={isMounted:function(t){return(t=t._reactInternals)?Vr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=tt(),i=zn(t),s=cn(r,i);s.payload=e,n!=null&&(s.callback=n),e=jn(t,s,i),e!==null&&(Mt(e,t,i,r),ha(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=tt(),i=zn(t),s=cn(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=jn(t,s,i),e!==null&&(Mt(e,t,i,r),ha(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=tt(),r=zn(t),i=cn(n,r);i.tag=2,e!=null&&(i.callback=e),e=jn(t,i,r),e!==null&&(Mt(e,t,r,n),ha(e,t,r))}};function Cp(t,e,n,r,i,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,a):e.prototype&&e.prototype.isPureReactComponent?!Os(n,r)||!Os(i,s):!0}function Wv(t,e,n){var r=!1,i=Qn,s=e.contextType;return typeof s=="object"&&s!==null?s=Tt(s):(i=at(e)?Tr:Xe.current,r=e.contextTypes,s=(r=r!=null)?fi(t,i):Qn),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=wl,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function Pp(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&wl.enqueueReplaceState(e,e.state,null)}function Pc(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs={},Mh(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Tt(s):(s=at(e)?Tr:Xe.current,i.context=fi(t,s)),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Cc(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&wl.enqueueReplaceState(i,i.state,null),ja(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function vi(t,e){try{var n="",r=e;do n+=Ow(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i,digest:null}}function Lu(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Rc(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var sI=typeof WeakMap=="function"?WeakMap:Map;function Kv(t,e,n){n=cn(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){Wa||(Wa=!0,Fc=r),Rc(t,e)},n}function qv(t,e,n){n=cn(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return r(i)},n.callback=function(){Rc(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Rc(t,e),typeof r!="function"&&(Bn===null?Bn=new Set([this]):Bn.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function Rp(t,e,n){var r=t.pingCache;if(r===null){r=t.pingCache=new sI;var i=new Set;r.set(e,i)}else i=r.get(e),i===void 0&&(i=new Set,r.set(e,i));i.has(n)||(i.add(n),t=_I.bind(null,t,e,n),e.then(t,t))}function kp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Np(t,e,n,r,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=cn(-1,1),e.tag=2,jn(n,e,1))),n.lanes|=1),t)}var oI=_n.ReactCurrentOwner,st=!1;function et(t,e,n,r){e.child=t===null?Iv(e,null,n,r):mi(e,t.child,n,r)}function xp(t,e,n,r,i){n=n.render;var s=e.ref;return oi(e,i),r=Bh(t,e,n,r,s,i),n=zh(),t!==null&&!st?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,gn(t,e,i)):(he&&n&&kh(e),e.flags|=1,et(t,e,r,i),e.child)}function Op(t,e,n,r,i){if(t===null){var s=n.type;return typeof s=="function"&&!Jh(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,Gv(t,e,s,r,i)):(t=va(n.type,null,r,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&i)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Os,n(a,r)&&t.ref===e.ref)return gn(t,e,i)}return e.flags|=1,t=$n(s,r),t.ref=e.ref,t.return=e,e.child=t}function Gv(t,e,n,r,i){if(t!==null){var s=t.memoizedProps;if(Os(s,r)&&t.ref===e.ref)if(st=!1,e.pendingProps=r=s,(t.lanes&i)!==0)t.flags&131072&&(st=!0);else return e.lanes=t.lanes,gn(t,e,i)}return kc(t,e,n,r,i)}function Qv(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},oe(ti,dt),dt|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,oe(ti,dt),dt|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,oe(ti,dt),dt|=r}else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,oe(ti,dt),dt|=r;return et(t,e,i,n),e.child}function Xv(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function kc(t,e,n,r,i){var s=at(n)?Tr:Xe.current;return s=fi(e,s),oi(e,i),n=Bh(t,e,n,r,s,i),r=zh(),t!==null&&!st?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,gn(t,e,i)):(he&&r&&kh(e),e.flags|=1,et(t,e,n,i),e.child)}function Dp(t,e,n,r,i){if(at(n)){var s=!0;Va(e)}else s=!1;if(oi(e,i),e.stateNode===null)pa(t,e),Wv(e,n,r),Pc(e,n,r,i),r=!0;else if(t===null){var a=e.stateNode,l=e.memoizedProps;a.props=l;var u=a.context,h=n.contextType;typeof h=="object"&&h!==null?h=Tt(h):(h=at(n)?Tr:Xe.current,h=fi(e,h));var f=n.getDerivedStateFromProps,m=typeof f=="function"||typeof a.getSnapshotBeforeUpdate=="function";m||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(l!==r||u!==h)&&Pp(e,a,r,h),Pn=!1;var v=e.memoizedState;a.state=v,ja(e,r,a,i),u=e.memoizedState,l!==r||v!==u||ot.current||Pn?(typeof f=="function"&&(Cc(e,n,f,r),u=e.memoizedState),(l=Pn||Cp(e,n,l,r,v,u,h))?(m||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=r,e.memoizedState=u),a.props=r,a.state=u,a.context=h,r=l):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),r=!1)}else{a=e.stateNode,Sv(t,e),l=e.memoizedProps,h=e.type===e.elementType?l:Rt(e.type,l),a.props=h,m=e.pendingProps,v=a.context,u=n.contextType,typeof u=="object"&&u!==null?u=Tt(u):(u=at(n)?Tr:Xe.current,u=fi(e,u));var S=n.getDerivedStateFromProps;(f=typeof S=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(l!==m||v!==u)&&Pp(e,a,r,u),Pn=!1,v=e.memoizedState,a.state=v,ja(e,r,a,i);var P=e.memoizedState;l!==m||v!==P||ot.current||Pn?(typeof S=="function"&&(Cc(e,n,S,r),P=e.memoizedState),(h=Pn||Cp(e,n,h,r,v,P,u)||!1)?(f||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(r,P,u),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(r,P,u)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||l===t.memoizedProps&&v===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&v===t.memoizedState||(e.flags|=1024),e.memoizedProps=r,e.memoizedState=P),a.props=r,a.state=P,a.context=u,r=h):(typeof a.componentDidUpdate!="function"||l===t.memoizedProps&&v===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&v===t.memoizedState||(e.flags|=1024),r=!1)}return Nc(t,e,n,r,s,i)}function Nc(t,e,n,r,i,s){Xv(t,e);var a=(e.flags&128)!==0;if(!r&&!a)return i&&yp(e,n,!1),gn(t,e,s);r=e.stateNode,oI.current=e;var l=a&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&a?(e.child=mi(e,t.child,null,s),e.child=mi(e,null,l,s)):et(t,e,l,s),e.memoizedState=r.state,i&&yp(e,n,!0),e.child}function Yv(t){var e=t.stateNode;e.pendingContext?vp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&vp(t,e.context,!1),bh(t,e.containerInfo)}function Lp(t,e,n,r,i){return pi(),xh(i),e.flags|=256,et(t,e,n,r),e.child}var xc={dehydrated:null,treeContext:null,retryLane:0};function Oc(t){return{baseLanes:t,cachePool:null,transitions:null}}function Jv(t,e,n){var r=e.pendingProps,i=pe.current,s=!1,a=(e.flags&128)!==0,l;if((l=a)||(l=t!==null&&t.memoizedState===null?!1:(i&2)!==0),l?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),oe(pe,i&1),t===null)return Sc(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=r.children,t=r.fallback,s?(r=e.mode,s=e.child,a={mode:"hidden",children:a},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=Sl(a,r,0,null),t=_r(t,r,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Oc(n),e.memoizedState=xc,t):Wh(e,a));if(i=t.memoizedState,i!==null&&(l=i.dehydrated,l!==null))return aI(t,e,a,r,l,i,n);if(s){s=r.fallback,a=e.mode,i=t.child,l=i.sibling;var u={mode:"hidden",children:r.children};return!(a&1)&&e.child!==i?(r=e.child,r.childLanes=0,r.pendingProps=u,e.deletions=null):(r=$n(i,u),r.subtreeFlags=i.subtreeFlags&14680064),l!==null?s=$n(l,s):(s=_r(s,a,n,null),s.flags|=2),s.return=e,r.return=e,r.sibling=s,e.child=r,r=s,s=e.child,a=t.child.memoizedState,a=a===null?Oc(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=xc,r}return s=t.child,t=s.sibling,r=$n(s,{mode:"visible",children:r.children}),!(e.mode&1)&&(r.lanes=n),r.return=e,r.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=r,e.memoizedState=null,r}function Wh(t,e){return e=Sl({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Xo(t,e,n,r){return r!==null&&xh(r),mi(e,t.child,null,n),t=Wh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function aI(t,e,n,r,i,s,a){if(n)return e.flags&256?(e.flags&=-257,r=Lu(Error(M(422))),Xo(t,e,a,r)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=r.fallback,i=e.mode,r=Sl({mode:"visible",children:r.children},i,0,null),s=_r(s,i,a,null),s.flags|=2,r.return=e,s.return=e,r.sibling=s,e.child=r,e.mode&1&&mi(e,t.child,null,a),e.child.memoizedState=Oc(a),e.memoizedState=xc,s);if(!(e.mode&1))return Xo(t,e,a,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error(M(419)),r=Lu(s,r,void 0),Xo(t,e,a,r)}if(l=(a&t.childLanes)!==0,st||l){if(r=xe,r!==null){switch(a&-a){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|a)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,mn(t,i),Mt(r,t,i,-1))}return Yh(),r=Lu(Error(M(421))),Xo(t,e,a,r)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=EI.bind(null,t),i._reactRetry=e,null):(t=s.treeContext,ft=Un(i.nextSibling),pt=e,he=!0,Nt=null,t!==null&&(_t[Et++]=sn,_t[Et++]=on,_t[Et++]=Sr,sn=t.id,on=t.overflow,Sr=e),e=Wh(e,r.children),e.flags|=4096,e)}function Vp(t,e,n){t.lanes|=e;var r=t.alternate;r!==null&&(r.lanes|=e),Ac(t.return,e,n)}function Vu(t,e,n,r,i){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=i)}function Zv(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(et(t,e,r.children,n),r=pe.current,r&2)r=r&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Vp(t,n,e);else if(t.tag===19)Vp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(oe(pe,r),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&Ba(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),Vu(e,!1,i,n,s);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&Ba(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}Vu(e,!0,n,null,s);break;case"together":Vu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function pa(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function gn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Cr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(M(153));if(e.child!==null){for(t=e.child,n=$n(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=$n(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function lI(t,e,n){switch(e.tag){case 3:Yv(e),pi();break;case 5:Av(e);break;case 1:at(e.type)&&Va(e);break;case 4:bh(e,e.stateNode.containerInfo);break;case 10:var r=e.type._context,i=e.memoizedProps.value;oe(Fa,r._currentValue),r._currentValue=i;break;case 13:if(r=e.memoizedState,r!==null)return r.dehydrated!==null?(oe(pe,pe.current&1),e.flags|=128,null):n&e.child.childLanes?Jv(t,e,n):(oe(pe,pe.current&1),t=gn(t,e,n),t!==null?t.sibling:null);oe(pe,pe.current&1);break;case 19:if(r=(n&e.childLanes)!==0,t.flags&128){if(r)return Zv(t,e,n);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),oe(pe,pe.current),r)break;return null;case 22:case 23:return e.lanes=0,Qv(t,e,n)}return gn(t,e,n)}var ey,Dc,ty,ny;ey=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Dc=function(){};ty=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,mr($t.current);var s=null;switch(n){case"input":i=tc(t,i),r=tc(t,r),s=[];break;case"select":i=ge({},i,{value:void 0}),r=ge({},r,{value:void 0}),s=[];break;case"textarea":i=ic(t,i),r=ic(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=Da)}oc(n,r);var a;n=null;for(h in i)if(!r.hasOwnProperty(h)&&i.hasOwnProperty(h)&&i[h]!=null)if(h==="style"){var l=i[h];for(a in l)l.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(As.hasOwnProperty(h)?s||(s=[]):(s=s||[]).push(h,null));for(h in r){var u=r[h];if(l=i!=null?i[h]:void 0,r.hasOwnProperty(h)&&u!==l&&(u!=null||l!=null))if(h==="style")if(l){for(a in l)!l.hasOwnProperty(a)||u&&u.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in u)u.hasOwnProperty(a)&&l[a]!==u[a]&&(n||(n={}),n[a]=u[a])}else n||(s||(s=[]),s.push(h,n)),n=u;else h==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(s=s||[]).push(h,u)):h==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(h,""+u):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(As.hasOwnProperty(h)?(u!=null&&h==="onScroll"&&ue("scroll",t),s||l===u||(s=[])):(s=s||[]).push(h,u))}n&&(s=s||[]).push("style",n);var h=s;(e.updateQueue=h)&&(e.flags|=4)}};ny=function(t,e,n,r){n!==r&&(e.flags|=4)};function Zi(t,e){if(!he)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function He(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,r=0;if(e)for(var i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=r,t.childLanes=n,e}function uI(t,e,n){var r=e.pendingProps;switch(Nh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return He(e),null;case 1:return at(e.type)&&La(),He(e),null;case 3:return r=e.stateNode,gi(),ce(ot),ce(Xe),Uh(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(Go(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Nt!==null&&(Bc(Nt),Nt=null))),Dc(t,e),He(e),null;case 5:Fh(e);var i=mr(bs.current);if(n=e.type,t!==null&&e.stateNode!=null)ty(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!r){if(e.stateNode===null)throw Error(M(166));return He(e),null}if(t=mr($t.current),Go(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[Bt]=e,r[Vs]=s,t=(e.mode&1)!==0,n){case"dialog":ue("cancel",r),ue("close",r);break;case"iframe":case"object":case"embed":ue("load",r);break;case"video":case"audio":for(i=0;i<os.length;i++)ue(os[i],r);break;case"source":ue("error",r);break;case"img":case"image":case"link":ue("error",r),ue("load",r);break;case"details":ue("toggle",r);break;case"input":Hf(r,s),ue("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},ue("invalid",r);break;case"textarea":Kf(r,s),ue("invalid",r)}oc(n,s),i=null;for(var a in s)if(s.hasOwnProperty(a)){var l=s[a];a==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&qo(r.textContent,l,t),i=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&qo(r.textContent,l,t),i=["children",""+l]):As.hasOwnProperty(a)&&l!=null&&a==="onScroll"&&ue("scroll",r)}switch(n){case"input":Uo(r),Wf(r,s,!0);break;case"textarea":Uo(r),qf(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Da)}r=i,e.updateQueue=r,r!==null&&(e.flags|=4)}else{a=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Ng(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=a.createElement(n,{is:r.is}):(t=a.createElement(n),n==="select"&&(a=t,r.multiple?a.multiple=!0:r.size&&(a.size=r.size))):t=a.createElementNS(t,n),t[Bt]=e,t[Vs]=r,ey(t,e,!1,!1),e.stateNode=t;e:{switch(a=ac(n,r),n){case"dialog":ue("cancel",t),ue("close",t),i=r;break;case"iframe":case"object":case"embed":ue("load",t),i=r;break;case"video":case"audio":for(i=0;i<os.length;i++)ue(os[i],t);i=r;break;case"source":ue("error",t),i=r;break;case"img":case"image":case"link":ue("error",t),ue("load",t),i=r;break;case"details":ue("toggle",t),i=r;break;case"input":Hf(t,r),i=tc(t,r),ue("invalid",t);break;case"option":i=r;break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=ge({},r,{value:void 0}),ue("invalid",t);break;case"textarea":Kf(t,r),i=ic(t,r),ue("invalid",t);break;default:i=r}oc(n,i),l=i;for(s in l)if(l.hasOwnProperty(s)){var u=l[s];s==="style"?Dg(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&xg(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Cs(t,u):typeof u=="number"&&Cs(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(As.hasOwnProperty(s)?u!=null&&s==="onScroll"&&ue("scroll",t):u!=null&&mh(t,s,u,a))}switch(n){case"input":Uo(t),Wf(t,r,!1);break;case"textarea":Uo(t),qf(t);break;case"option":r.value!=null&&t.setAttribute("value",""+Gn(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?ni(t,!!r.multiple,s,!1):r.defaultValue!=null&&ni(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=Da)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return He(e),null;case 6:if(t&&e.stateNode!=null)ny(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(M(166));if(n=mr(bs.current),mr($t.current),Go(e)){if(r=e.stateNode,n=e.memoizedProps,r[Bt]=e,(s=r.nodeValue!==n)&&(t=pt,t!==null))switch(t.tag){case 3:qo(r.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&qo(r.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Bt]=e,e.stateNode=r}return He(e),null;case 13:if(ce(pe),r=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(he&&ft!==null&&e.mode&1&&!(e.flags&128))Ev(),pi(),e.flags|=98560,s=!1;else if(s=Go(e),r!==null&&r.dehydrated!==null){if(t===null){if(!s)throw Error(M(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(M(317));s[Bt]=e}else pi(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;He(e),s=!1}else Nt!==null&&(Bc(Nt),Nt=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(r=r!==null,r!==(t!==null&&t.memoizedState!==null)&&r&&(e.child.flags|=8192,e.mode&1&&(t===null||pe.current&1?Pe===0&&(Pe=3):Yh())),e.updateQueue!==null&&(e.flags|=4),He(e),null);case 4:return gi(),Dc(t,e),t===null&&Ds(e.stateNode.containerInfo),He(e),null;case 10:return Lh(e.type._context),He(e),null;case 17:return at(e.type)&&La(),He(e),null;case 19:if(ce(pe),s=e.memoizedState,s===null)return He(e),null;if(r=(e.flags&128)!==0,a=s.rendering,a===null)if(r)Zi(s,!1);else{if(Pe!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Ba(t),a!==null){for(e.flags|=128,Zi(s,!1),r=a.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),e.subtreeFlags=0,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return oe(pe,pe.current&1|2),e.child}t=t.sibling}s.tail!==null&&we()>yi&&(e.flags|=128,r=!0,Zi(s,!1),e.lanes=4194304)}else{if(!r)if(t=Ba(a),t!==null){if(e.flags|=128,r=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Zi(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!he)return He(e),null}else 2*we()-s.renderingStartTime>yi&&n!==1073741824&&(e.flags|=128,r=!0,Zi(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=we(),e.sibling=null,n=pe.current,oe(pe,r?n&1|2:n&1),e):(He(e),null);case 22:case 23:return Xh(),r=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==r&&(e.flags|=8192),r&&e.mode&1?dt&1073741824&&(He(e),e.subtreeFlags&6&&(e.flags|=8192)):He(e),null;case 24:return null;case 25:return null}throw Error(M(156,e.tag))}function cI(t,e){switch(Nh(e),e.tag){case 1:return at(e.type)&&La(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return gi(),ce(ot),ce(Xe),Uh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Fh(e),null;case 13:if(ce(pe),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(M(340));pi()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return ce(pe),null;case 4:return gi(),null;case 10:return Lh(e.type._context),null;case 22:case 23:return Xh(),null;case 24:return null;default:return null}}var Yo=!1,qe=!1,hI=typeof WeakSet=="function"?WeakSet:Set,$=null;function ei(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){ye(t,e,r)}else n.current=null}function Lc(t,e,n){try{n()}catch(r){ye(t,e,r)}}var Mp=!1;function dI(t,e){if(vc=Na,t=av(),Rh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,l=-1,u=-1,h=0,f=0,m=t,v=null;t:for(;;){for(var S;m!==n||i!==0&&m.nodeType!==3||(l=a+i),m!==s||r!==0&&m.nodeType!==3||(u=a+r),m.nodeType===3&&(a+=m.nodeValue.length),(S=m.firstChild)!==null;)v=m,m=S;for(;;){if(m===t)break t;if(v===n&&++h===i&&(l=a),v===s&&++f===r&&(u=a),(S=m.nextSibling)!==null)break;m=v,v=m.parentNode}m=S}n=l===-1||u===-1?null:{start:l,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(yc={focusedElem:t,selectionRange:n},Na=!1,$=e;$!==null;)if(e=$,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,$=t;else for(;$!==null;){e=$;try{var P=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(P!==null){var x=P.memoizedProps,D=P.memoizedState,w=e.stateNode,y=w.getSnapshotBeforeUpdate(e.elementType===e.type?x:Rt(e.type,x),D);w.__reactInternalSnapshotBeforeUpdate=y}break;case 3:var A=e.stateNode.containerInfo;A.nodeType===1?A.textContent="":A.nodeType===9&&A.documentElement&&A.removeChild(A.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(M(163))}}catch(L){ye(e,e.return,L)}if(t=e.sibling,t!==null){t.return=e.return,$=t;break}$=e.return}return P=Mp,Mp=!1,P}function vs(t,e,n){var r=e.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&t)===t){var s=i.destroy;i.destroy=void 0,s!==void 0&&Lc(e,n,s)}i=i.next}while(i!==r)}}function Il(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var r=n.create;n.destroy=r()}n=n.next}while(n!==e)}}function Vc(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function ry(t){var e=t.alternate;e!==null&&(t.alternate=null,ry(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Bt],delete e[Vs],delete e[wc],delete e[G0],delete e[Q0])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function iy(t){return t.tag===5||t.tag===3||t.tag===4}function bp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||iy(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Mc(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Da));else if(r!==4&&(t=t.child,t!==null))for(Mc(t,e,n),t=t.sibling;t!==null;)Mc(t,e,n),t=t.sibling}function bc(t,e,n){var r=t.tag;if(r===5||r===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(bc(t,e,n),t=t.sibling;t!==null;)bc(t,e,n),t=t.sibling}var Le=null,kt=!1;function Sn(t,e,n){for(n=n.child;n!==null;)sy(t,e,n),n=n.sibling}function sy(t,e,n){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(pl,n)}catch{}switch(n.tag){case 5:qe||ei(n,e);case 6:var r=Le,i=kt;Le=null,Sn(t,e,n),Le=r,kt=i,Le!==null&&(kt?(t=Le,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Le.removeChild(n.stateNode));break;case 18:Le!==null&&(kt?(t=Le,n=n.stateNode,t.nodeType===8?Ru(t.parentNode,n):t.nodeType===1&&Ru(t,n),Ns(t)):Ru(Le,n.stateNode));break;case 4:r=Le,i=kt,Le=n.stateNode.containerInfo,kt=!0,Sn(t,e,n),Le=r,kt=i;break;case 0:case 11:case 14:case 15:if(!qe&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Lc(n,e,a),i=i.next}while(i!==r)}Sn(t,e,n);break;case 1:if(!qe&&(ei(n,e),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){ye(n,e,l)}Sn(t,e,n);break;case 21:Sn(t,e,n);break;case 22:n.mode&1?(qe=(r=qe)||n.memoizedState!==null,Sn(t,e,n),qe=r):Sn(t,e,n);break;default:Sn(t,e,n)}}function Fp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new hI),e.forEach(function(r){var i=wI.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function Pt(t,e){var n=e.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var s=t,a=e,l=a;e:for(;l!==null;){switch(l.tag){case 5:Le=l.stateNode,kt=!1;break e;case 3:Le=l.stateNode.containerInfo,kt=!0;break e;case 4:Le=l.stateNode.containerInfo,kt=!0;break e}l=l.return}if(Le===null)throw Error(M(160));sy(s,a,i),Le=null,kt=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(h){ye(i,e,h)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)oy(e,t),e=e.sibling}function oy(t,e){var n=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Pt(e,t),Ut(t),r&4){try{vs(3,t,t.return),Il(3,t)}catch(x){ye(t,t.return,x)}try{vs(5,t,t.return)}catch(x){ye(t,t.return,x)}}break;case 1:Pt(e,t),Ut(t),r&512&&n!==null&&ei(n,n.return);break;case 5:if(Pt(e,t),Ut(t),r&512&&n!==null&&ei(n,n.return),t.flags&32){var i=t.stateNode;try{Cs(i,"")}catch(x){ye(t,t.return,x)}}if(r&4&&(i=t.stateNode,i!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,l=t.type,u=t.updateQueue;if(t.updateQueue=null,u!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&Rg(i,s),ac(l,a);var h=ac(l,s);for(a=0;a<u.length;a+=2){var f=u[a],m=u[a+1];f==="style"?Dg(i,m):f==="dangerouslySetInnerHTML"?xg(i,m):f==="children"?Cs(i,m):mh(i,f,m,h)}switch(l){case"input":nc(i,s);break;case"textarea":kg(i,s);break;case"select":var v=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var S=s.value;S!=null?ni(i,!!s.multiple,S,!1):v!==!!s.multiple&&(s.defaultValue!=null?ni(i,!!s.multiple,s.defaultValue,!0):ni(i,!!s.multiple,s.multiple?[]:"",!1))}i[Vs]=s}catch(x){ye(t,t.return,x)}}break;case 6:if(Pt(e,t),Ut(t),r&4){if(t.stateNode===null)throw Error(M(162));i=t.stateNode,s=t.memoizedProps;try{i.nodeValue=s}catch(x){ye(t,t.return,x)}}break;case 3:if(Pt(e,t),Ut(t),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Ns(e.containerInfo)}catch(x){ye(t,t.return,x)}break;case 4:Pt(e,t),Ut(t);break;case 13:Pt(e,t),Ut(t),i=t.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(Gh=we())),r&4&&Fp(t);break;case 22:if(f=n!==null&&n.memoizedState!==null,t.mode&1?(qe=(h=qe)||f,Pt(e,t),qe=h):Pt(e,t),Ut(t),r&8192){if(h=t.memoizedState!==null,(t.stateNode.isHidden=h)&&!f&&t.mode&1)for($=t,f=t.child;f!==null;){for(m=$=f;$!==null;){switch(v=$,S=v.child,v.tag){case 0:case 11:case 14:case 15:vs(4,v,v.return);break;case 1:ei(v,v.return);var P=v.stateNode;if(typeof P.componentWillUnmount=="function"){r=v,n=v.return;try{e=r,P.props=e.memoizedProps,P.state=e.memoizedState,P.componentWillUnmount()}catch(x){ye(r,n,x)}}break;case 5:ei(v,v.return);break;case 22:if(v.memoizedState!==null){jp(m);continue}}S!==null?(S.return=v,$=S):jp(m)}f=f.sibling}e:for(f=null,m=t;;){if(m.tag===5){if(f===null){f=m;try{i=m.stateNode,h?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=m.stateNode,u=m.memoizedProps.style,a=u!=null&&u.hasOwnProperty("display")?u.display:null,l.style.display=Og("display",a))}catch(x){ye(t,t.return,x)}}}else if(m.tag===6){if(f===null)try{m.stateNode.nodeValue=h?"":m.memoizedProps}catch(x){ye(t,t.return,x)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===t)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===t)break e;for(;m.sibling===null;){if(m.return===null||m.return===t)break e;f===m&&(f=null),m=m.return}f===m&&(f=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Pt(e,t),Ut(t),r&4&&Fp(t);break;case 21:break;default:Pt(e,t),Ut(t)}}function Ut(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(iy(n)){var r=n;break e}n=n.return}throw Error(M(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Cs(i,""),r.flags&=-33);var s=bp(t);bc(t,s,i);break;case 3:case 4:var a=r.stateNode.containerInfo,l=bp(t);Mc(t,l,a);break;default:throw Error(M(161))}}catch(u){ye(t,t.return,u)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function fI(t,e,n){$=t,ay(t)}function ay(t,e,n){for(var r=(t.mode&1)!==0;$!==null;){var i=$,s=i.child;if(i.tag===22&&r){var a=i.memoizedState!==null||Yo;if(!a){var l=i.alternate,u=l!==null&&l.memoizedState!==null||qe;l=Yo;var h=qe;if(Yo=a,(qe=u)&&!h)for($=i;$!==null;)a=$,u=a.child,a.tag===22&&a.memoizedState!==null?Bp(i):u!==null?(u.return=a,$=u):Bp(i);for(;s!==null;)$=s,ay(s),s=s.sibling;$=i,Yo=l,qe=h}Up(t)}else i.subtreeFlags&8772&&s!==null?(s.return=i,$=s):Up(t)}}function Up(t){for(;$!==null;){var e=$;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:qe||Il(5,e);break;case 1:var r=e.stateNode;if(e.flags&4&&!qe)if(n===null)r.componentDidMount();else{var i=e.elementType===e.type?n.memoizedProps:Rt(e.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Tp(e,s,r);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Tp(e,a,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var u=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var h=e.alternate;if(h!==null){var f=h.memoizedState;if(f!==null){var m=f.dehydrated;m!==null&&Ns(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(M(163))}qe||e.flags&512&&Vc(e)}catch(v){ye(e,e.return,v)}}if(e===t){$=null;break}if(n=e.sibling,n!==null){n.return=e.return,$=n;break}$=e.return}}function jp(t){for(;$!==null;){var e=$;if(e===t){$=null;break}var n=e.sibling;if(n!==null){n.return=e.return,$=n;break}$=e.return}}function Bp(t){for(;$!==null;){var e=$;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Il(4,e)}catch(u){ye(e,n,u)}break;case 1:var r=e.stateNode;if(typeof r.componentDidMount=="function"){var i=e.return;try{r.componentDidMount()}catch(u){ye(e,i,u)}}var s=e.return;try{Vc(e)}catch(u){ye(e,s,u)}break;case 5:var a=e.return;try{Vc(e)}catch(u){ye(e,a,u)}}}catch(u){ye(e,e.return,u)}if(e===t){$=null;break}var l=e.sibling;if(l!==null){l.return=e.return,$=l;break}$=e.return}}var pI=Math.ceil,Ha=_n.ReactCurrentDispatcher,Kh=_n.ReactCurrentOwner,It=_n.ReactCurrentBatchConfig,ee=0,xe=null,Se=null,Fe=0,dt=0,ti=er(0),Pe=0,Bs=null,Cr=0,Tl=0,qh=0,ys=null,it=null,Gh=0,yi=1/0,tn=null,Wa=!1,Fc=null,Bn=null,Jo=!1,Ln=null,Ka=0,_s=0,Uc=null,ma=-1,ga=0;function tt(){return ee&6?we():ma!==-1?ma:ma=we()}function zn(t){return t.mode&1?ee&2&&Fe!==0?Fe&-Fe:Y0.transition!==null?(ga===0&&(ga=Wg()),ga):(t=ne,t!==0||(t=window.event,t=t===void 0?16:Jg(t.type)),t):1}function Mt(t,e,n,r){if(50<_s)throw _s=0,Uc=null,Error(M(185));to(t,n,r),(!(ee&2)||t!==xe)&&(t===xe&&(!(ee&2)&&(Tl|=n),Pe===4&&kn(t,Fe)),lt(t,r),n===1&&ee===0&&!(e.mode&1)&&(yi=we()+500,_l&&tr()))}function lt(t,e){var n=t.callbackNode;Yw(t,e);var r=ka(t,t===xe?Fe:0);if(r===0)n!==null&&Xf(n),t.callbackNode=null,t.callbackPriority=0;else if(e=r&-r,t.callbackPriority!==e){if(n!=null&&Xf(n),e===1)t.tag===0?X0(zp.bind(null,t)):vv(zp.bind(null,t)),K0(function(){!(ee&6)&&tr()}),n=null;else{switch(Kg(r)){case 1:n=Eh;break;case 4:n=$g;break;case 16:n=Ra;break;case 536870912:n=Hg;break;default:n=Ra}n=my(n,ly.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function ly(t,e){if(ma=-1,ga=0,ee&6)throw Error(M(327));var n=t.callbackNode;if(ai()&&t.callbackNode!==n)return null;var r=ka(t,t===xe?Fe:0);if(r===0)return null;if(r&30||r&t.expiredLanes||e)e=qa(t,r);else{e=r;var i=ee;ee|=2;var s=cy();(xe!==t||Fe!==e)&&(tn=null,yi=we()+500,yr(t,e));do try{vI();break}catch(l){uy(t,l)}while(!0);Dh(),Ha.current=s,ee=i,Se!==null?e=0:(xe=null,Fe=0,e=Pe)}if(e!==0){if(e===2&&(i=dc(t),i!==0&&(r=i,e=jc(t,i))),e===1)throw n=Bs,yr(t,0),kn(t,r),lt(t,we()),n;if(e===6)kn(t,r);else{if(i=t.current.alternate,!(r&30)&&!mI(i)&&(e=qa(t,r),e===2&&(s=dc(t),s!==0&&(r=s,e=jc(t,s))),e===1))throw n=Bs,yr(t,0),kn(t,r),lt(t,we()),n;switch(t.finishedWork=i,t.finishedLanes=r,e){case 0:case 1:throw Error(M(345));case 2:hr(t,it,tn);break;case 3:if(kn(t,r),(r&130023424)===r&&(e=Gh+500-we(),10<e)){if(ka(t,0)!==0)break;if(i=t.suspendedLanes,(i&r)!==r){tt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Ec(hr.bind(null,t,it,tn),e);break}hr(t,it,tn);break;case 4:if(kn(t,r),(r&4194240)===r)break;for(e=t.eventTimes,i=-1;0<r;){var a=31-Vt(r);s=1<<a,a=e[a],a>i&&(i=a),r&=~s}if(r=i,r=we()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*pI(r/1960))-r,10<r){t.timeoutHandle=Ec(hr.bind(null,t,it,tn),r);break}hr(t,it,tn);break;case 5:hr(t,it,tn);break;default:throw Error(M(329))}}}return lt(t,we()),t.callbackNode===n?ly.bind(null,t):null}function jc(t,e){var n=ys;return t.current.memoizedState.isDehydrated&&(yr(t,e).flags|=256),t=qa(t,e),t!==2&&(e=it,it=n,e!==null&&Bc(e)),t}function Bc(t){it===null?it=t:it.push.apply(it,t)}function mI(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],s=i.getSnapshot;i=i.value;try{if(!Ft(s(),i))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function kn(t,e){for(e&=~qh,e&=~Tl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Vt(e),r=1<<n;t[n]=-1,e&=~r}}function zp(t){if(ee&6)throw Error(M(327));ai();var e=ka(t,0);if(!(e&1))return lt(t,we()),null;var n=qa(t,e);if(t.tag!==0&&n===2){var r=dc(t);r!==0&&(e=r,n=jc(t,r))}if(n===1)throw n=Bs,yr(t,0),kn(t,e),lt(t,we()),n;if(n===6)throw Error(M(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,hr(t,it,tn),lt(t,we()),null}function Qh(t,e){var n=ee;ee|=1;try{return t(e)}finally{ee=n,ee===0&&(yi=we()+500,_l&&tr())}}function Pr(t){Ln!==null&&Ln.tag===0&&!(ee&6)&&ai();var e=ee;ee|=1;var n=It.transition,r=ne;try{if(It.transition=null,ne=1,t)return t()}finally{ne=r,It.transition=n,ee=e,!(ee&6)&&tr()}}function Xh(){dt=ti.current,ce(ti)}function yr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,W0(n)),Se!==null)for(n=Se.return;n!==null;){var r=n;switch(Nh(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&La();break;case 3:gi(),ce(ot),ce(Xe),Uh();break;case 5:Fh(r);break;case 4:gi();break;case 13:ce(pe);break;case 19:ce(pe);break;case 10:Lh(r.type._context);break;case 22:case 23:Xh()}n=n.return}if(xe=t,Se=t=$n(t.current,null),Fe=dt=e,Pe=0,Bs=null,qh=Tl=Cr=0,it=ys=null,pr!==null){for(e=0;e<pr.length;e++)if(n=pr[e],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,s=n.pending;if(s!==null){var a=s.next;s.next=i,r.next=a}n.pending=r}pr=null}return t}function uy(t,e){do{var n=Se;try{if(Dh(),da.current=$a,za){for(var r=me.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}za=!1}if(Ar=0,ke=Ce=me=null,gs=!1,Fs=0,Kh.current=null,n===null||n.return===null){Pe=1,Bs=e,Se=null;break}e:{var s=t,a=n.return,l=n,u=e;if(e=Fe,l.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var h=u,f=l,m=f.tag;if(!(f.mode&1)&&(m===0||m===11||m===15)){var v=f.alternate;v?(f.updateQueue=v.updateQueue,f.memoizedState=v.memoizedState,f.lanes=v.lanes):(f.updateQueue=null,f.memoizedState=null)}var S=kp(a);if(S!==null){S.flags&=-257,Np(S,a,l,s,e),S.mode&1&&Rp(s,h,e),e=S,u=h;var P=e.updateQueue;if(P===null){var x=new Set;x.add(u),e.updateQueue=x}else P.add(u);break e}else{if(!(e&1)){Rp(s,h,e),Yh();break e}u=Error(M(426))}}else if(he&&l.mode&1){var D=kp(a);if(D!==null){!(D.flags&65536)&&(D.flags|=256),Np(D,a,l,s,e),xh(vi(u,l));break e}}s=u=vi(u,l),Pe!==4&&(Pe=2),ys===null?ys=[s]:ys.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var w=Kv(s,u,e);Ip(s,w);break e;case 1:l=u;var y=s.type,A=s.stateNode;if(!(s.flags&128)&&(typeof y.getDerivedStateFromError=="function"||A!==null&&typeof A.componentDidCatch=="function"&&(Bn===null||!Bn.has(A)))){s.flags|=65536,e&=-e,s.lanes|=e;var L=qv(s,l,e);Ip(s,L);break e}}s=s.return}while(s!==null)}dy(n)}catch(F){e=F,Se===n&&n!==null&&(Se=n=n.return);continue}break}while(!0)}function cy(){var t=Ha.current;return Ha.current=$a,t===null?$a:t}function Yh(){(Pe===0||Pe===3||Pe===2)&&(Pe=4),xe===null||!(Cr&268435455)&&!(Tl&268435455)||kn(xe,Fe)}function qa(t,e){var n=ee;ee|=2;var r=cy();(xe!==t||Fe!==e)&&(tn=null,yr(t,e));do try{gI();break}catch(i){uy(t,i)}while(!0);if(Dh(),ee=n,Ha.current=r,Se!==null)throw Error(M(261));return xe=null,Fe=0,Pe}function gI(){for(;Se!==null;)hy(Se)}function vI(){for(;Se!==null&&!zw();)hy(Se)}function hy(t){var e=py(t.alternate,t,dt);t.memoizedProps=t.pendingProps,e===null?dy(t):Se=e,Kh.current=null}function dy(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=cI(n,e),n!==null){n.flags&=32767,Se=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Pe=6,Se=null;return}}else if(n=uI(n,e,dt),n!==null){Se=n;return}if(e=e.sibling,e!==null){Se=e;return}Se=e=t}while(e!==null);Pe===0&&(Pe=5)}function hr(t,e,n){var r=ne,i=It.transition;try{It.transition=null,ne=1,yI(t,e,n,r)}finally{It.transition=i,ne=r}return null}function yI(t,e,n,r){do ai();while(Ln!==null);if(ee&6)throw Error(M(327));n=t.finishedWork;var i=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(M(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(Jw(t,s),t===xe&&(Se=xe=null,Fe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Jo||(Jo=!0,my(Ra,function(){return ai(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=It.transition,It.transition=null;var a=ne;ne=1;var l=ee;ee|=4,Kh.current=null,dI(t,n),oy(n,t),F0(yc),Na=!!vc,yc=vc=null,t.current=n,fI(n),$w(),ee=l,ne=a,It.transition=s}else t.current=n;if(Jo&&(Jo=!1,Ln=t,Ka=i),s=t.pendingLanes,s===0&&(Bn=null),Kw(n.stateNode),lt(t,we()),e!==null)for(r=t.onRecoverableError,n=0;n<e.length;n++)i=e[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(Wa)throw Wa=!1,t=Fc,Fc=null,t;return Ka&1&&t.tag!==0&&ai(),s=t.pendingLanes,s&1?t===Uc?_s++:(_s=0,Uc=t):_s=0,tr(),null}function ai(){if(Ln!==null){var t=Kg(Ka),e=It.transition,n=ne;try{if(It.transition=null,ne=16>t?16:t,Ln===null)var r=!1;else{if(t=Ln,Ln=null,Ka=0,ee&6)throw Error(M(331));var i=ee;for(ee|=4,$=t.current;$!==null;){var s=$,a=s.child;if($.flags&16){var l=s.deletions;if(l!==null){for(var u=0;u<l.length;u++){var h=l[u];for($=h;$!==null;){var f=$;switch(f.tag){case 0:case 11:case 15:vs(8,f,s)}var m=f.child;if(m!==null)m.return=f,$=m;else for(;$!==null;){f=$;var v=f.sibling,S=f.return;if(ry(f),f===h){$=null;break}if(v!==null){v.return=S,$=v;break}$=S}}}var P=s.alternate;if(P!==null){var x=P.child;if(x!==null){P.child=null;do{var D=x.sibling;x.sibling=null,x=D}while(x!==null)}}$=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,$=a;else e:for(;$!==null;){if(s=$,s.flags&2048)switch(s.tag){case 0:case 11:case 15:vs(9,s,s.return)}var w=s.sibling;if(w!==null){w.return=s.return,$=w;break e}$=s.return}}var y=t.current;for($=y;$!==null;){a=$;var A=a.child;if(a.subtreeFlags&2064&&A!==null)A.return=a,$=A;else e:for(a=y;$!==null;){if(l=$,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:Il(9,l)}}catch(F){ye(l,l.return,F)}if(l===a){$=null;break e}var L=l.sibling;if(L!==null){L.return=l.return,$=L;break e}$=l.return}}if(ee=i,tr(),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(pl,t)}catch{}r=!0}return r}finally{ne=n,It.transition=e}}return!1}function $p(t,e,n){e=vi(n,e),e=Kv(t,e,1),t=jn(t,e,1),e=tt(),t!==null&&(to(t,1,e),lt(t,e))}function ye(t,e,n){if(t.tag===3)$p(t,t,n);else for(;e!==null;){if(e.tag===3){$p(e,t,n);break}else if(e.tag===1){var r=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Bn===null||!Bn.has(r))){t=vi(n,t),t=qv(e,t,1),e=jn(e,t,1),t=tt(),e!==null&&(to(e,1,t),lt(e,t));break}}e=e.return}}function _I(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=tt(),t.pingedLanes|=t.suspendedLanes&n,xe===t&&(Fe&n)===n&&(Pe===4||Pe===3&&(Fe&130023424)===Fe&&500>we()-Gh?yr(t,0):qh|=n),lt(t,e)}function fy(t,e){e===0&&(t.mode&1?(e=zo,zo<<=1,!(zo&130023424)&&(zo=4194304)):e=1);var n=tt();t=mn(t,e),t!==null&&(to(t,e,n),lt(t,n))}function EI(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),fy(t,n)}function wI(t,e){var n=0;switch(t.tag){case 13:var r=t.stateNode,i=t.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=t.stateNode;break;default:throw Error(M(314))}r!==null&&r.delete(e),fy(t,n)}var py;py=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||ot.current)st=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return st=!1,lI(t,e,n);st=!!(t.flags&131072)}else st=!1,he&&e.flags&1048576&&yv(e,ba,e.index);switch(e.lanes=0,e.tag){case 2:var r=e.type;pa(t,e),t=e.pendingProps;var i=fi(e,Xe.current);oi(e,n),i=Bh(null,e,r,t,i,n);var s=zh();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,at(r)?(s=!0,Va(e)):s=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Mh(e),i.updater=wl,e.stateNode=i,i._reactInternals=e,Pc(e,r,t,n),e=Nc(null,e,r,!0,s,n)):(e.tag=0,he&&s&&kh(e),et(null,e,i,n),e=e.child),e;case 16:r=e.elementType;e:{switch(pa(t,e),t=e.pendingProps,i=r._init,r=i(r._payload),e.type=r,i=e.tag=TI(r),t=Rt(r,t),i){case 0:e=kc(null,e,r,t,n);break e;case 1:e=Dp(null,e,r,t,n);break e;case 11:e=xp(null,e,r,t,n);break e;case 14:e=Op(null,e,r,Rt(r.type,t),n);break e}throw Error(M(306,r,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Rt(r,i),kc(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Rt(r,i),Dp(t,e,r,i,n);case 3:e:{if(Yv(e),t===null)throw Error(M(387));r=e.pendingProps,s=e.memoizedState,i=s.element,Sv(t,e),ja(e,r,null,n);var a=e.memoizedState;if(r=a.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){i=vi(Error(M(423)),e),e=Lp(t,e,r,n,i);break e}else if(r!==i){i=vi(Error(M(424)),e),e=Lp(t,e,r,n,i);break e}else for(ft=Un(e.stateNode.containerInfo.firstChild),pt=e,he=!0,Nt=null,n=Iv(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(pi(),r===i){e=gn(t,e,n);break e}et(t,e,r,n)}e=e.child}return e;case 5:return Av(e),t===null&&Sc(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,a=i.children,_c(r,i)?a=null:s!==null&&_c(r,s)&&(e.flags|=32),Xv(t,e),et(t,e,a,n),e.child;case 6:return t===null&&Sc(e),null;case 13:return Jv(t,e,n);case 4:return bh(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=mi(e,null,r,n):et(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Rt(r,i),xp(t,e,r,i,n);case 7:return et(t,e,e.pendingProps,n),e.child;case 8:return et(t,e,e.pendingProps.children,n),e.child;case 12:return et(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(r=e.type._context,i=e.pendingProps,s=e.memoizedProps,a=i.value,oe(Fa,r._currentValue),r._currentValue=a,s!==null)if(Ft(s.value,a)){if(s.children===i.children&&!ot.current){e=gn(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var l=s.dependencies;if(l!==null){a=s.child;for(var u=l.firstContext;u!==null;){if(u.context===r){if(s.tag===1){u=cn(-1,n&-n),u.tag=2;var h=s.updateQueue;if(h!==null){h=h.shared;var f=h.pending;f===null?u.next=u:(u.next=f.next,f.next=u),h.pending=u}}s.lanes|=n,u=s.alternate,u!==null&&(u.lanes|=n),Ac(s.return,n,e),l.lanes|=n;break}u=u.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(M(341));a.lanes|=n,l=a.alternate,l!==null&&(l.lanes|=n),Ac(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}et(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,r=e.pendingProps.children,oi(e,n),i=Tt(i),r=r(i),e.flags|=1,et(t,e,r,n),e.child;case 14:return r=e.type,i=Rt(r,e.pendingProps),i=Rt(r.type,i),Op(t,e,r,i,n);case 15:return Gv(t,e,e.type,e.pendingProps,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Rt(r,i),pa(t,e),e.tag=1,at(r)?(t=!0,Va(e)):t=!1,oi(e,n),Wv(e,r,i),Pc(e,r,i,n),Nc(null,e,r,!0,t,n);case 19:return Zv(t,e,n);case 22:return Qv(t,e,n)}throw Error(M(156,e.tag))};function my(t,e){return zg(t,e)}function II(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wt(t,e,n,r){return new II(t,e,n,r)}function Jh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function TI(t){if(typeof t=="function")return Jh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===vh)return 11;if(t===yh)return 14}return 2}function $n(t,e){var n=t.alternate;return n===null?(n=wt(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function va(t,e,n,r,i,s){var a=2;if(r=t,typeof t=="function")Jh(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case Wr:return _r(n.children,i,s,e);case gh:a=8,i|=8;break;case Yu:return t=wt(12,n,e,i|2),t.elementType=Yu,t.lanes=s,t;case Ju:return t=wt(13,n,e,i),t.elementType=Ju,t.lanes=s,t;case Zu:return t=wt(19,n,e,i),t.elementType=Zu,t.lanes=s,t;case Ag:return Sl(n,i,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Tg:a=10;break e;case Sg:a=9;break e;case vh:a=11;break e;case yh:a=14;break e;case Cn:a=16,r=null;break e}throw Error(M(130,t==null?t:typeof t,""))}return e=wt(a,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function _r(t,e,n,r){return t=wt(7,t,r,e),t.lanes=n,t}function Sl(t,e,n,r){return t=wt(22,t,r,e),t.elementType=Ag,t.lanes=n,t.stateNode={isHidden:!1},t}function Mu(t,e,n){return t=wt(6,t,null,e),t.lanes=n,t}function bu(t,e,n){return e=wt(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function SI(t,e,n,r,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=vu(0),this.expirationTimes=vu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=vu(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Zh(t,e,n,r,i,s,a,l,u){return t=new SI(t,e,n,l,u),e===1?(e=1,s===!0&&(e|=8)):e=0,s=wt(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Mh(s),t}function AI(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Hr,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function gy(t){if(!t)return Qn;t=t._reactInternals;e:{if(Vr(t)!==t||t.tag!==1)throw Error(M(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(at(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(M(171))}if(t.tag===1){var n=t.type;if(at(n))return gv(t,n,e)}return e}function vy(t,e,n,r,i,s,a,l,u){return t=Zh(n,r,!0,t,i,s,a,l,u),t.context=gy(null),n=t.current,r=tt(),i=zn(n),s=cn(r,i),s.callback=e??null,jn(n,s,i),t.current.lanes=i,to(t,i,r),lt(t,r),t}function Al(t,e,n,r){var i=e.current,s=tt(),a=zn(i);return n=gy(n),e.context===null?e.context=n:e.pendingContext=n,e=cn(s,a),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),t=jn(i,e,a),t!==null&&(Mt(t,i,a,s),ha(t,i,a)),a}function Ga(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Hp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function ed(t,e){Hp(t,e),(t=t.alternate)&&Hp(t,e)}function CI(){return null}var yy=typeof reportError=="function"?reportError:function(t){console.error(t)};function td(t){this._internalRoot=t}Cl.prototype.render=td.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(M(409));Al(t,e,null,null)};Cl.prototype.unmount=td.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Pr(function(){Al(null,t,null,null)}),e[pn]=null}};function Cl(t){this._internalRoot=t}Cl.prototype.unstable_scheduleHydration=function(t){if(t){var e=Qg();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Rn.length&&e!==0&&e<Rn[n].priority;n++);Rn.splice(n,0,t),n===0&&Yg(t)}};function nd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Pl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Wp(){}function PI(t,e,n,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var h=Ga(a);s.call(h)}}var a=vy(e,r,t,0,null,!1,!1,"",Wp);return t._reactRootContainer=a,t[pn]=a.current,Ds(t.nodeType===8?t.parentNode:t),Pr(),a}for(;i=t.lastChild;)t.removeChild(i);if(typeof r=="function"){var l=r;r=function(){var h=Ga(u);l.call(h)}}var u=Zh(t,0,!1,null,null,!1,!1,"",Wp);return t._reactRootContainer=u,t[pn]=u.current,Ds(t.nodeType===8?t.parentNode:t),Pr(function(){Al(e,u,n,r)}),u}function Rl(t,e,n,r,i){var s=n._reactRootContainer;if(s){var a=s;if(typeof i=="function"){var l=i;i=function(){var u=Ga(a);l.call(u)}}Al(e,a,t,i)}else a=PI(n,e,t,i,r);return Ga(a)}qg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=ss(e.pendingLanes);n!==0&&(wh(e,n|1),lt(e,we()),!(ee&6)&&(yi=we()+500,tr()))}break;case 13:Pr(function(){var r=mn(t,1);if(r!==null){var i=tt();Mt(r,t,1,i)}}),ed(t,1)}};Ih=function(t){if(t.tag===13){var e=mn(t,134217728);if(e!==null){var n=tt();Mt(e,t,134217728,n)}ed(t,134217728)}};Gg=function(t){if(t.tag===13){var e=zn(t),n=mn(t,e);if(n!==null){var r=tt();Mt(n,t,e,r)}ed(t,e)}};Qg=function(){return ne};Xg=function(t,e){var n=ne;try{return ne=t,e()}finally{ne=n}};uc=function(t,e,n){switch(e){case"input":if(nc(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=yl(r);if(!i)throw Error(M(90));Pg(r),nc(r,i)}}}break;case"textarea":kg(t,n);break;case"select":e=n.value,e!=null&&ni(t,!!n.multiple,e,!1)}};Mg=Qh;bg=Pr;var RI={usingClientEntryPoint:!1,Events:[ro,Qr,yl,Lg,Vg,Qh]},es={findFiberByHostInstance:fr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},kI={bundleType:es.bundleType,version:es.version,rendererPackageName:es.rendererPackageName,rendererConfig:es.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:_n.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=jg(t),t===null?null:t.stateNode},findFiberByHostInstance:es.findFiberByHostInstance||CI,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Zo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Zo.isDisabled&&Zo.supportsFiber)try{pl=Zo.inject(kI),zt=Zo}catch{}}gt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=RI;gt.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!nd(e))throw Error(M(200));return AI(t,e,null,n)};gt.createRoot=function(t,e){if(!nd(t))throw Error(M(299));var n=!1,r="",i=yy;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(r=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=Zh(t,1,!1,null,null,n,!1,r,i),t[pn]=e.current,Ds(t.nodeType===8?t.parentNode:t),new td(e)};gt.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(M(188)):(t=Object.keys(t).join(","),Error(M(268,t)));return t=jg(e),t=t===null?null:t.stateNode,t};gt.flushSync=function(t){return Pr(t)};gt.hydrate=function(t,e,n){if(!Pl(e))throw Error(M(200));return Rl(null,t,e,!0,n)};gt.hydrateRoot=function(t,e,n){if(!nd(t))throw Error(M(405));var r=n!=null&&n.hydratedSources||null,i=!1,s="",a=yy;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=vy(e,null,t,1,n??null,i,!1,s,a),t[pn]=e.current,Ds(t),r)for(t=0;t<r.length;t++)n=r[t],i=n._getVersion,i=i(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,i]:e.mutableSourceEagerHydrationData.push(n,i);return new Cl(e)};gt.render=function(t,e,n){if(!Pl(e))throw Error(M(200));return Rl(null,t,e,!1,n)};gt.unmountComponentAtNode=function(t){if(!Pl(t))throw Error(M(40));return t._reactRootContainer?(Pr(function(){Rl(null,null,t,!1,function(){t._reactRootContainer=null,t[pn]=null})}),!0):!1};gt.unstable_batchedUpdates=Qh;gt.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!Pl(n))throw Error(M(200));if(t==null||t._reactInternals===void 0)throw Error(M(38));return Rl(t,e,n,!1,r)};gt.version="18.3.1-next-f1338f8080-20240426";function _y(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(_y)}catch(t){console.error(t)}}_y(),_g.exports=gt;var NI=_g.exports,Kp=NI;Qu.createRoot=Kp.createRoot,Qu.hydrateRoot=Kp.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function zs(){return zs=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},zs.apply(this,arguments)}var Vn;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(Vn||(Vn={}));const qp="popstate";function xI(t){t===void 0&&(t={});function e(r,i){let{pathname:s,search:a,hash:l}=r.location;return zc("",{pathname:s,search:a,hash:l},i.state&&i.state.usr||null,i.state&&i.state.key||"default")}function n(r,i){return typeof i=="string"?i:Ey(i)}return DI(e,n,null,t)}function Ae(t,e){if(t===!1||t===null||typeof t>"u")throw new Error(e)}function rd(t,e){if(!t){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function OI(){return Math.random().toString(36).substr(2,8)}function Gp(t,e){return{usr:t.state,key:t.key,idx:e}}function zc(t,e,n,r){return n===void 0&&(n=null),zs({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?Ri(e):e,{state:n,key:e&&e.key||r||OI()})}function Ey(t){let{pathname:e="/",search:n="",hash:r=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(e+=r.charAt(0)==="#"?r:"#"+r),e}function Ri(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let r=t.indexOf("?");r>=0&&(e.search=t.substr(r),t=t.substr(0,r)),t&&(e.pathname=t)}return e}function DI(t,e,n,r){r===void 0&&(r={});let{window:i=document.defaultView,v5Compat:s=!1}=r,a=i.history,l=Vn.Pop,u=null,h=f();h==null&&(h=0,a.replaceState(zs({},a.state,{idx:h}),""));function f(){return(a.state||{idx:null}).idx}function m(){l=Vn.Pop;let D=f(),w=D==null?null:D-h;h=D,u&&u({action:l,location:x.location,delta:w})}function v(D,w){l=Vn.Push;let y=zc(x.location,D,w);h=f()+1;let A=Gp(y,h),L=x.createHref(y);try{a.pushState(A,"",L)}catch(F){if(F instanceof DOMException&&F.name==="DataCloneError")throw F;i.location.assign(L)}s&&u&&u({action:l,location:x.location,delta:1})}function S(D,w){l=Vn.Replace;let y=zc(x.location,D,w);h=f();let A=Gp(y,h),L=x.createHref(y);a.replaceState(A,"",L),s&&u&&u({action:l,location:x.location,delta:0})}function P(D){let w=i.location.origin!=="null"?i.location.origin:i.location.href,y=typeof D=="string"?D:Ey(D);return y=y.replace(/ $/,"%20"),Ae(w,"No window.location.(origin|href) available to create URL for href: "+y),new URL(y,w)}let x={get action(){return l},get location(){return t(i,a)},listen(D){if(u)throw new Error("A history only accepts one active listener");return i.addEventListener(qp,m),u=D,()=>{i.removeEventListener(qp,m),u=null}},createHref(D){return e(i,D)},createURL:P,encodeLocation(D){let w=P(D);return{pathname:w.pathname,search:w.search,hash:w.hash}},push:v,replace:S,go(D){return a.go(D)}};return x}var Qp;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(Qp||(Qp={}));function LI(t,e,n){return n===void 0&&(n="/"),VI(t,e,n)}function VI(t,e,n,r){let i=typeof e=="string"?Ri(e):e,s=Ty(i.pathname||"/",n);if(s==null)return null;let a=wy(t);MI(a);let l=null;for(let u=0;l==null&&u<a.length;++u){let h=GI(s);l=WI(a[u],h)}return l}function wy(t,e,n,r){e===void 0&&(e=[]),n===void 0&&(n=[]),r===void 0&&(r="");let i=(s,a,l)=>{let u={relativePath:l===void 0?s.path||"":l,caseSensitive:s.caseSensitive===!0,childrenIndex:a,route:s};u.relativePath.startsWith("/")&&(Ae(u.relativePath.startsWith(r),'Absolute route path "'+u.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),u.relativePath=u.relativePath.slice(r.length));let h=Er([r,u.relativePath]),f=n.concat(u);s.children&&s.children.length>0&&(Ae(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+h+'".')),wy(s.children,e,f,h)),!(s.path==null&&!s.index)&&e.push({path:h,score:$I(h,s.index),routesMeta:f})};return t.forEach((s,a)=>{var l;if(s.path===""||!((l=s.path)!=null&&l.includes("?")))i(s,a);else for(let u of Iy(s.path))i(s,a,u)}),e}function Iy(t){let e=t.split("/");if(e.length===0)return[];let[n,...r]=e,i=n.endsWith("?"),s=n.replace(/\?$/,"");if(r.length===0)return i?[s,""]:[s];let a=Iy(r.join("/")),l=[];return l.push(...a.map(u=>u===""?s:[s,u].join("/"))),i&&l.push(...a),l.map(u=>t.startsWith("/")&&u===""?"/":u)}function MI(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:HI(e.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const bI=/^:[\w-]+$/,FI=3,UI=2,jI=1,BI=10,zI=-2,Xp=t=>t==="*";function $I(t,e){let n=t.split("/"),r=n.length;return n.some(Xp)&&(r+=zI),e&&(r+=UI),n.filter(i=>!Xp(i)).reduce((i,s)=>i+(bI.test(s)?FI:s===""?jI:BI),r)}function HI(t,e){return t.length===e.length&&t.slice(0,-1).every((r,i)=>r===e[i])?t[t.length-1]-e[e.length-1]:0}function WI(t,e,n){let{routesMeta:r}=t,i={},s="/",a=[];for(let l=0;l<r.length;++l){let u=r[l],h=l===r.length-1,f=s==="/"?e:e.slice(s.length)||"/",m=KI({path:u.relativePath,caseSensitive:u.caseSensitive,end:h},f),v=u.route;if(!m)return null;Object.assign(i,m.params),a.push({params:i,pathname:Er([s,m.pathname]),pathnameBase:ZI(Er([s,m.pathnameBase])),route:v}),m.pathnameBase!=="/"&&(s=Er([s,m.pathnameBase]))}return a}function KI(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,r]=qI(t.path,t.caseSensitive,t.end),i=e.match(n);if(!i)return null;let s=i[0],a=s.replace(/(.)\/+$/,"$1"),l=i.slice(1);return{params:r.reduce((h,f,m)=>{let{paramName:v,isOptional:S}=f;if(v==="*"){let x=l[m]||"";a=s.slice(0,s.length-x.length).replace(/(.)\/+$/,"$1")}const P=l[m];return S&&!P?h[v]=void 0:h[v]=(P||"").replace(/%2F/g,"/"),h},{}),pathname:s,pathnameBase:a,pattern:t}}function qI(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),rd(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let r=[],i="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(a,l,u)=>(r.push({paramName:l,isOptional:u!=null}),u?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(r.push({paramName:"*"}),i+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?i+="\\/*$":t!==""&&t!=="/"&&(i+="(?:(?=\\/|$))"),[new RegExp(i,e?void 0:"i"),r]}function GI(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return rd(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function Ty(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,r=t.charAt(n);return r&&r!=="/"?null:t.slice(n)||"/"}const QI=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,XI=t=>QI.test(t);function YI(t,e){e===void 0&&(e="/");let{pathname:n,search:r="",hash:i=""}=typeof t=="string"?Ri(t):t,s;if(n)if(XI(n))s=n;else{if(n.includes("//")){let a=n;n=n.replace(/\/\/+/g,"/"),rd(!1,"Pathnames cannot have embedded double slashes - normalizing "+(a+" -> "+n))}n.startsWith("/")?s=Yp(n.substring(1),"/"):s=Yp(n,e)}else s=e;return{pathname:s,search:eT(r),hash:tT(i)}}function Yp(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(i=>{i===".."?n.length>1&&n.pop():i!=="."&&n.push(i)}),n.length>1?n.join("/"):"/"}function Fu(t,e,n,r){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function JI(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function Sy(t,e){let n=JI(t);return e?n.map((r,i)=>i===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function Ay(t,e,n,r){r===void 0&&(r=!1);let i;typeof t=="string"?i=Ri(t):(i=zs({},t),Ae(!i.pathname||!i.pathname.includes("?"),Fu("?","pathname","search",i)),Ae(!i.pathname||!i.pathname.includes("#"),Fu("#","pathname","hash",i)),Ae(!i.search||!i.search.includes("#"),Fu("#","search","hash",i)));let s=t===""||i.pathname==="",a=s?"/":i.pathname,l;if(a==null)l=n;else{let m=e.length-1;if(!r&&a.startsWith("..")){let v=a.split("/");for(;v[0]==="..";)v.shift(),m-=1;i.pathname=v.join("/")}l=m>=0?e[m]:"/"}let u=YI(i,l),h=a&&a!=="/"&&a.endsWith("/"),f=(s||a===".")&&n.endsWith("/");return!u.pathname.endsWith("/")&&(h||f)&&(u.pathname+="/"),u}const Er=t=>t.join("/").replace(/\/\/+/g,"/"),ZI=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),eT=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,tT=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function nT(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const Cy=["post","put","patch","delete"];new Set(Cy);const rT=["get",...Cy];new Set(rT);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function $s(){return $s=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},$s.apply(this,arguments)}const id=z.createContext(null),iT=z.createContext(null),so=z.createContext(null),kl=z.createContext(null),Mr=z.createContext({outlet:null,matches:[],isDataRoute:!1}),Py=z.createContext(null);function oo(){return z.useContext(kl)!=null}function sd(){return oo()||Ae(!1),z.useContext(kl).location}function Ry(t){z.useContext(so).static||z.useLayoutEffect(t)}function ky(){let{isDataRoute:t}=z.useContext(Mr);return t?vT():sT()}function sT(){oo()||Ae(!1);let t=z.useContext(id),{basename:e,future:n,navigator:r}=z.useContext(so),{matches:i}=z.useContext(Mr),{pathname:s}=sd(),a=JSON.stringify(Sy(i,n.v7_relativeSplatPath)),l=z.useRef(!1);return Ry(()=>{l.current=!0}),z.useCallback(function(h,f){if(f===void 0&&(f={}),!l.current)return;if(typeof h=="number"){r.go(h);return}let m=Ay(h,JSON.parse(a),s,f.relative==="path");t==null&&e!=="/"&&(m.pathname=m.pathname==="/"?e:Er([e,m.pathname])),(f.replace?r.replace:r.push)(m,f.state,f)},[e,r,a,s,t])}function oT(t,e){return aT(t,e)}function aT(t,e,n,r){oo()||Ae(!1);let{navigator:i}=z.useContext(so),{matches:s}=z.useContext(Mr),a=s[s.length-1],l=a?a.params:{};a&&a.pathname;let u=a?a.pathnameBase:"/";a&&a.route;let h=sd(),f;if(e){var m;let D=typeof e=="string"?Ri(e):e;u==="/"||(m=D.pathname)!=null&&m.startsWith(u)||Ae(!1),f=D}else f=h;let v=f.pathname||"/",S=v;if(u!=="/"){let D=u.replace(/^\//,"").split("/");S="/"+v.replace(/^\//,"").split("/").slice(D.length).join("/")}let P=LI(t,{pathname:S}),x=dT(P&&P.map(D=>Object.assign({},D,{params:Object.assign({},l,D.params),pathname:Er([u,i.encodeLocation?i.encodeLocation(D.pathname).pathname:D.pathname]),pathnameBase:D.pathnameBase==="/"?u:Er([u,i.encodeLocation?i.encodeLocation(D.pathnameBase).pathname:D.pathnameBase])})),s,n,r);return e&&x?z.createElement(kl.Provider,{value:{location:$s({pathname:"/",search:"",hash:"",state:null,key:"default"},f),navigationType:Vn.Pop}},x):x}function lT(){let t=gT(),e=nT(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,i={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return z.createElement(z.Fragment,null,z.createElement("h2",null,"Unexpected Application Error!"),z.createElement("h3",{style:{fontStyle:"italic"}},e),n?z.createElement("pre",{style:i},n):null,null)}const uT=z.createElement(lT,null);class cT extends z.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?z.createElement(Mr.Provider,{value:this.props.routeContext},z.createElement(Py.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function hT(t){let{routeContext:e,match:n,children:r}=t,i=z.useContext(id);return i&&i.static&&i.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(i.staticContext._deepestRenderedBoundaryId=n.route.id),z.createElement(Mr.Provider,{value:e},r)}function dT(t,e,n,r){var i;if(e===void 0&&(e=[]),n===void 0&&(n=null),r===void 0&&(r=null),t==null){var s;if(!n)return null;if(n.errors)t=n.matches;else if((s=r)!=null&&s.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let a=t,l=(i=n)==null?void 0:i.errors;if(l!=null){let f=a.findIndex(m=>m.route.id&&(l==null?void 0:l[m.route.id])!==void 0);f>=0||Ae(!1),a=a.slice(0,Math.min(a.length,f+1))}let u=!1,h=-1;if(n&&r&&r.v7_partialHydration)for(let f=0;f<a.length;f++){let m=a[f];if((m.route.HydrateFallback||m.route.hydrateFallbackElement)&&(h=f),m.route.id){let{loaderData:v,errors:S}=n,P=m.route.loader&&v[m.route.id]===void 0&&(!S||S[m.route.id]===void 0);if(m.route.lazy||P){u=!0,h>=0?a=a.slice(0,h+1):a=[a[0]];break}}}return a.reduceRight((f,m,v)=>{let S,P=!1,x=null,D=null;n&&(S=l&&m.route.id?l[m.route.id]:void 0,x=m.route.errorElement||uT,u&&(h<0&&v===0?(yT("route-fallback"),P=!0,D=null):h===v&&(P=!0,D=m.route.hydrateFallbackElement||null)));let w=e.concat(a.slice(0,v+1)),y=()=>{let A;return S?A=x:P?A=D:m.route.Component?A=z.createElement(m.route.Component,null):m.route.element?A=m.route.element:A=f,z.createElement(hT,{match:m,routeContext:{outlet:f,matches:w,isDataRoute:n!=null},children:A})};return n&&(m.route.ErrorBoundary||m.route.errorElement||v===0)?z.createElement(cT,{location:n.location,revalidation:n.revalidation,component:x,error:S,children:y(),routeContext:{outlet:null,matches:w,isDataRoute:!0}}):y()},null)}var Ny=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(Ny||{}),xy=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}(xy||{});function fT(t){let e=z.useContext(id);return e||Ae(!1),e}function pT(t){let e=z.useContext(iT);return e||Ae(!1),e}function mT(t){let e=z.useContext(Mr);return e||Ae(!1),e}function Oy(t){let e=mT(),n=e.matches[e.matches.length-1];return n.route.id||Ae(!1),n.route.id}function gT(){var t;let e=z.useContext(Py),n=pT(),r=Oy();return e!==void 0?e:(t=n.errors)==null?void 0:t[r]}function vT(){let{router:t}=fT(Ny.UseNavigateStable),e=Oy(xy.UseNavigateStable),n=z.useRef(!1);return Ry(()=>{n.current=!0}),z.useCallback(function(i,s){s===void 0&&(s={}),n.current&&(typeof i=="number"?t.navigate(i):t.navigate(i,$s({fromRouteId:e},s)))},[t,e])}const Jp={};function yT(t,e,n){Jp[t]||(Jp[t]=!0)}function _T(t,e){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function Zp(t){let{to:e,replace:n,state:r,relative:i}=t;oo()||Ae(!1);let{future:s,static:a}=z.useContext(so),{matches:l}=z.useContext(Mr),{pathname:u}=sd(),h=ky(),f=Ay(e,Sy(l,s.v7_relativeSplatPath),u,i==="path"),m=JSON.stringify(f);return z.useEffect(()=>h(JSON.parse(m),{replace:n,state:r,relative:i}),[h,m,i,n,r]),null}function as(t){Ae(!1)}function ET(t){let{basename:e="/",children:n=null,location:r,navigationType:i=Vn.Pop,navigator:s,static:a=!1,future:l}=t;oo()&&Ae(!1);let u=e.replace(/^\/*/,"/"),h=z.useMemo(()=>({basename:u,navigator:s,static:a,future:$s({v7_relativeSplatPath:!1},l)}),[u,l,s,a]);typeof r=="string"&&(r=Ri(r));let{pathname:f="/",search:m="",hash:v="",state:S=null,key:P="default"}=r,x=z.useMemo(()=>{let D=Ty(f,u);return D==null?null:{location:{pathname:D,search:m,hash:v,state:S,key:P},navigationType:i}},[u,f,m,v,S,P,i]);return x==null?null:z.createElement(so.Provider,{value:h},z.createElement(kl.Provider,{children:n,value:x}))}function wT(t){let{children:e,location:n}=t;return oT($c(e),n)}new Promise(()=>{});function $c(t,e){e===void 0&&(e=[]);let n=[];return z.Children.forEach(t,(r,i)=>{if(!z.isValidElement(r))return;let s=[...e,i];if(r.type===z.Fragment){n.push.apply(n,$c(r.props.children,s));return}r.type!==as&&Ae(!1),!r.props.index||!r.props.children||Ae(!1);let a={id:r.props.id||s.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(a.children=$c(r.props.children,s)),n.push(a)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const IT="6";try{window.__reactRouterVersion=IT}catch{}const TT="startTransition",em=_w[TT];function ST(t){let{basename:e,children:n,future:r,window:i}=t,s=z.useRef();s.current==null&&(s.current=xI({window:i,v5Compat:!0}));let a=s.current,[l,u]=z.useState({action:a.action,location:a.location}),{v7_startTransition:h}=r||{},f=z.useCallback(m=>{h&&em?em(()=>u(m)):u(m)},[u,h]);return z.useLayoutEffect(()=>a.listen(f),[a,f]),z.useEffect(()=>_T(r),[r]),z.createElement(ET,{basename:e,children:n,location:l.location,navigationType:l.action,navigator:a,future:r})}var tm;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})(tm||(tm={}));var nm;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(nm||(nm={}));const AT="/assets/icon-Zs7S41bU.png";var rm={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dy=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},CT=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],l=t[n++],u=((i&7)<<18|(s&63)<<12|(a&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Ly={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,l=a?t[i+1]:0,u=i+2<t.length,h=u?t[i+2]:0,f=s>>2,m=(s&3)<<4|l>>4;let v=(l&15)<<2|h>>6,S=h&63;u||(S=64,a||(v=64)),r.push(n[f],n[m],n[v],n[S])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Dy(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):CT(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const h=i<t.length?n[t.charAt(i)]:64;++i;const m=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||h==null||m==null)throw new PT;const v=s<<2|l>>4;if(r.push(v),h!==64){const S=l<<4&240|h>>2;if(r.push(S),m!==64){const P=h<<6&192|m;r.push(P)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class PT extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const RT=function(t){const e=Dy(t);return Ly.encodeByteArray(e,!0)},Qa=function(t){return RT(t).replace(/\./g,"")},Vy=function(t){try{return Ly.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kT(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NT=()=>kT().__FIREBASE_DEFAULTS__,xT=()=>{if(typeof process>"u"||typeof rm>"u")return;const t=rm.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},OT=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Vy(t[1]);return e&&JSON.parse(e)},Nl=()=>{try{return NT()||xT()||OT()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},My=t=>{var e,n;return(n=(e=Nl())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},DT=t=>{const e=My(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},by=()=>{var t;return(t=Nl())===null||t===void 0?void 0:t.config},Fy=t=>{var e;return(e=Nl())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LT{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function VT(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Qa(JSON.stringify(n)),Qa(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function MT(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ye())}function bT(){var t;const e=(t=Nl())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function FT(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function UT(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function jT(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function BT(){const t=Ye();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function zT(){return!bT()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function $T(){try{return typeof indexedDB=="object"}catch{return!1}}function HT(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WT="FirebaseError";class En extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=WT,Object.setPrototypeOf(this,En.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ao.prototype.create)}}class ao{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?KT(s,r):"Error",l=`${this.serviceName}: ${a} (${i}).`;return new En(i,l,r)}}function KT(t,e){return t.replace(qT,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const qT=/\{\$([^}]+)}/g;function GT(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Xa(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(im(s)&&im(a)){if(!Xa(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function im(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lo(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function ls(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function us(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function QT(t,e){const n=new XT(t,e);return n.subscribe.bind(n)}class XT{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");YT(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Uu),i.error===void 0&&(i.error=Uu),i.complete===void 0&&(i.complete=Uu);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function YT(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Uu(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ut(t){return t&&t._delegate?t._delegate:t}class Rr{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JT{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new LT;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(eS(e))try{this.getOrInitializeService({instanceIdentifier:dr})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=dr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=dr){return this.instances.has(e)}getOptions(e=dr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&a.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:ZT(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=dr){return this.component?this.component.multipleInstances?e:dr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ZT(t){return t===dr?void 0:t}function eS(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tS{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new JT(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Y;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(Y||(Y={}));const nS={debug:Y.DEBUG,verbose:Y.VERBOSE,info:Y.INFO,warn:Y.WARN,error:Y.ERROR,silent:Y.SILENT},rS=Y.INFO,iS={[Y.DEBUG]:"log",[Y.VERBOSE]:"log",[Y.INFO]:"info",[Y.WARN]:"warn",[Y.ERROR]:"error"},sS=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=iS[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class od{constructor(e){this.name=e,this._logLevel=rS,this._logHandler=sS,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Y))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?nS[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Y.DEBUG,...e),this._logHandler(this,Y.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Y.VERBOSE,...e),this._logHandler(this,Y.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Y.INFO,...e),this._logHandler(this,Y.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Y.WARN,...e),this._logHandler(this,Y.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Y.ERROR,...e),this._logHandler(this,Y.ERROR,...e)}}const oS=(t,e)=>e.some(n=>t instanceof n);let sm,om;function aS(){return sm||(sm=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function lS(){return om||(om=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Uy=new WeakMap,Hc=new WeakMap,jy=new WeakMap,ju=new WeakMap,ad=new WeakMap;function uS(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Hn(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Uy.set(n,t)}).catch(()=>{}),ad.set(e,t),e}function cS(t){if(Hc.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Hc.set(t,e)}let Wc={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Hc.get(t);if(e==="objectStoreNames")return t.objectStoreNames||jy.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Hn(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function hS(t){Wc=t(Wc)}function dS(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Bu(this),e,...n);return jy.set(r,e.sort?e.sort():[e]),Hn(r)}:lS().includes(t)?function(...e){return t.apply(Bu(this),e),Hn(Uy.get(this))}:function(...e){return Hn(t.apply(Bu(this),e))}}function fS(t){return typeof t=="function"?dS(t):(t instanceof IDBTransaction&&cS(t),oS(t,aS())?new Proxy(t,Wc):t)}function Hn(t){if(t instanceof IDBRequest)return uS(t);if(ju.has(t))return ju.get(t);const e=fS(t);return e!==t&&(ju.set(t,e),ad.set(e,t)),e}const Bu=t=>ad.get(t);function pS(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),l=Hn(a);return r&&a.addEventListener("upgradeneeded",u=>{r(Hn(a.result),u.oldVersion,u.newVersion,Hn(a.transaction),u)}),n&&a.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const mS=["get","getKey","getAll","getAllKeys","count"],gS=["put","add","delete","clear"],zu=new Map;function am(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(zu.get(e))return zu.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=gS.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||mS.includes(n)))return;const s=async function(a,...l){const u=this.transaction(a,i?"readwrite":"readonly");let h=u.store;return r&&(h=h.index(l.shift())),(await Promise.all([h[n](...l),i&&u.done]))[0]};return zu.set(e,s),s}hS(t=>({...t,get:(e,n,r)=>am(e,n)||t.get(e,n,r),has:(e,n)=>!!am(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vS{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(yS(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function yS(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Kc="@firebase/app",lm="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vn=new od("@firebase/app"),_S="@firebase/app-compat",ES="@firebase/analytics-compat",wS="@firebase/analytics",IS="@firebase/app-check-compat",TS="@firebase/app-check",SS="@firebase/auth",AS="@firebase/auth-compat",CS="@firebase/database",PS="@firebase/data-connect",RS="@firebase/database-compat",kS="@firebase/functions",NS="@firebase/functions-compat",xS="@firebase/installations",OS="@firebase/installations-compat",DS="@firebase/messaging",LS="@firebase/messaging-compat",VS="@firebase/performance",MS="@firebase/performance-compat",bS="@firebase/remote-config",FS="@firebase/remote-config-compat",US="@firebase/storage",jS="@firebase/storage-compat",BS="@firebase/firestore",zS="@firebase/vertexai-preview",$S="@firebase/firestore-compat",HS="firebase",WS="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qc="[DEFAULT]",KS={[Kc]:"fire-core",[_S]:"fire-core-compat",[wS]:"fire-analytics",[ES]:"fire-analytics-compat",[TS]:"fire-app-check",[IS]:"fire-app-check-compat",[SS]:"fire-auth",[AS]:"fire-auth-compat",[CS]:"fire-rtdb",[PS]:"fire-data-connect",[RS]:"fire-rtdb-compat",[kS]:"fire-fn",[NS]:"fire-fn-compat",[xS]:"fire-iid",[OS]:"fire-iid-compat",[DS]:"fire-fcm",[LS]:"fire-fcm-compat",[VS]:"fire-perf",[MS]:"fire-perf-compat",[bS]:"fire-rc",[FS]:"fire-rc-compat",[US]:"fire-gcs",[jS]:"fire-gcs-compat",[BS]:"fire-fst",[$S]:"fire-fst-compat",[zS]:"fire-vertex","fire-js":"fire-js",[HS]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ya=new Map,qS=new Map,Gc=new Map;function um(t,e){try{t.container.addComponent(e)}catch(n){vn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function _i(t){const e=t.name;if(Gc.has(e))return vn.debug(`There were multiple attempts to register component ${e}.`),!1;Gc.set(e,t);for(const n of Ya.values())um(n,t);for(const n of qS.values())um(n,t);return!0}function ld(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Dt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GS={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Wn=new ao("app","Firebase",GS);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QS{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Rr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Wn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ki=WS;function By(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:qc,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw Wn.create("bad-app-name",{appName:String(i)});if(n||(n=by()),!n)throw Wn.create("no-options");const s=Ya.get(i);if(s){if(Xa(n,s.options)&&Xa(r,s.config))return s;throw Wn.create("duplicate-app",{appName:i})}const a=new tS(i);for(const u of Gc.values())a.addComponent(u);const l=new QS(n,r,a);return Ya.set(i,l),l}function zy(t=qc){const e=Ya.get(t);if(!e&&t===qc&&by())return By();if(!e)throw Wn.create("no-app",{appName:t});return e}function Kn(t,e,n){var r;let i=(r=KS[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),vn.warn(l.join(" "));return}_i(new Rr(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XS="firebase-heartbeat-database",YS=1,Hs="firebase-heartbeat-store";let $u=null;function $y(){return $u||($u=pS(XS,YS,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Hs)}catch(n){console.warn(n)}}}}).catch(t=>{throw Wn.create("idb-open",{originalErrorMessage:t.message})})),$u}async function JS(t){try{const n=(await $y()).transaction(Hs),r=await n.objectStore(Hs).get(Hy(t));return await n.done,r}catch(e){if(e instanceof En)vn.warn(e.message);else{const n=Wn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});vn.warn(n.message)}}}async function cm(t,e){try{const r=(await $y()).transaction(Hs,"readwrite");await r.objectStore(Hs).put(e,Hy(t)),await r.done}catch(n){if(n instanceof En)vn.warn(n.message);else{const r=Wn.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});vn.warn(r.message)}}}function Hy(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZS=1024,eA=30*24*60*60*1e3;class tA{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new rA(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=hm();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=eA}),this._storage.overwrite(this._heartbeatsCache))}catch(r){vn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=hm(),{heartbeatsToSend:r,unsentEntries:i}=nA(this._heartbeatsCache.heartbeats),s=Qa(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return vn.warn(n),""}}}function hm(){return new Date().toISOString().substring(0,10)}function nA(t,e=ZS){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),dm(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),dm(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class rA{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return $T()?HT().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await JS(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return cm(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return cm(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function dm(t){return Qa(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iA(t){_i(new Rr("platform-logger",e=>new vS(e),"PRIVATE")),_i(new Rr("heartbeat",e=>new tA(e),"PRIVATE")),Kn(Kc,lm,t),Kn(Kc,lm,"esm2017"),Kn("fire-js","")}iA("");var sA="firebase",oA="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Kn(sA,oA,"app");function ud(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}function Wy(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const aA=Wy,Ky=new ao("auth","Firebase",Wy());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ja=new od("@firebase/auth");function lA(t,...e){Ja.logLevel<=Y.WARN&&Ja.warn(`Auth (${ki}): ${t}`,...e)}function ya(t,...e){Ja.logLevel<=Y.ERROR&&Ja.error(`Auth (${ki}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function At(t,...e){throw hd(t,...e)}function bt(t,...e){return hd(t,...e)}function cd(t,e,n){const r=Object.assign(Object.assign({},aA()),{[e]:n});return new ao("auth","Firebase",r).create(e,{appName:t.name})}function hn(t){return cd(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function uA(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&At(t,"argument-error"),cd(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function hd(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return Ky.create(t,...e)}function W(t,e,...n){if(!t)throw hd(e,...n)}function an(t){const e="INTERNAL ASSERTION FAILED: "+t;throw ya(e),new Error(e)}function yn(t,e){t||an(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qc(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function cA(){return fm()==="http:"||fm()==="https:"}function fm(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hA(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(cA()||UT()||"connection"in navigator)?navigator.onLine:!0}function dA(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uo{constructor(e,n){this.shortDelay=e,this.longDelay=n,yn(n>e,"Short delay should be less than long delay!"),this.isMobile=MT()||jT()}get(){return hA()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dd(t,e){yn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qy{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;an("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;an("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;an("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fA={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pA=new uo(3e4,6e4);function nr(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function rr(t,e,n,r,i={}){return Gy(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const l=lo(Object.assign({key:t.config.apiKey},a)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const h=Object.assign({method:e,headers:u},s);return FT()||(h.referrerPolicy="no-referrer"),qy.fetch()(Qy(t,t.config.apiHost,n,l),h)})}async function Gy(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},fA),e);try{const i=new gA(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw ea(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const l=s.ok?a.errorMessage:a.error.message,[u,h]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw ea(t,"credential-already-in-use",a);if(u==="EMAIL_EXISTS")throw ea(t,"email-already-in-use",a);if(u==="USER_DISABLED")throw ea(t,"user-disabled",a);const f=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw cd(t,f,h);At(t,f)}}catch(i){if(i instanceof En)throw i;At(t,"network-request-failed",{message:String(i)})}}async function co(t,e,n,r,i={}){const s=await rr(t,e,n,r,i);return"mfaPendingCredential"in s&&At(t,"multi-factor-auth-required",{_serverResponse:s}),s}function Qy(t,e,n,r){const i=`${e}${n}?${r}`;return t.config.emulator?dd(t.config,i):`${t.config.apiScheme}://${i}`}function mA(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class gA{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(bt(this.auth,"network-request-failed")),pA.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ea(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=bt(t,e,r);return i.customData._tokenResponse=n,i}function pm(t){return t!==void 0&&t.enterprise!==void 0}class vA{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return mA(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function yA(t,e){return rr(t,"GET","/v2/recaptchaConfig",nr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _A(t,e){return rr(t,"POST","/v1/accounts:delete",e)}async function Xy(t,e){return rr(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Es(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function EA(t,e=!1){const n=ut(t),r=await n.getIdToken(e),i=fd(r);W(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Es(Hu(i.auth_time)),issuedAtTime:Es(Hu(i.iat)),expirationTime:Es(Hu(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Hu(t){return Number(t)*1e3}function fd(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return ya("JWT malformed, contained fewer than 3 sections"),null;try{const i=Vy(n);return i?JSON.parse(i):(ya("Failed to decode base64 JWT payload"),null)}catch(i){return ya("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function mm(t){const e=fd(t);return W(e,"internal-error"),W(typeof e.exp<"u","internal-error"),W(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ws(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof En&&wA(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function wA({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IA{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xc{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Es(this.lastLoginAt),this.creationTime=Es(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Za(t){var e;const n=t.auth,r=await t.getIdToken(),i=await Ws(t,Xy(n,{idToken:r}));W(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?Yy(s.providerUserInfo):[],l=SA(t.providerData,a),u=t.isAnonymous,h=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),f=u?h:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new Xc(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(t,m)}async function TA(t){const e=ut(t);await Za(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function SA(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Yy(t){return t.map(e=>{var{providerId:n}=e,r=ud(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function AA(t,e){const n=await Gy(t,{},async()=>{const r=lo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=Qy(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",qy.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function CA(t,e){return rr(t,"POST","/v2/accounts:revokeToken",nr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){W(e.idToken,"internal-error"),W(typeof e.idToken<"u","internal-error"),W(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):mm(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){W(e.length!==0,"internal-error");const n=mm(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(W(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await AA(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new li;return r&&(W(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(W(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(W(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new li,this.toJSON())}_performRefresh(){return an("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function An(t,e){W(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ln{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=ud(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new IA(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Xc(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await Ws(this,this.stsTokenManager.getToken(this.auth,e));return W(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return EA(this,e)}reload(){return TA(this)}_assign(e){this!==e&&(W(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ln(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){W(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Za(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Dt(this.auth.app))return Promise.reject(hn(this.auth));const e=await this.getIdToken();return await Ws(this,_A(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,a,l,u,h,f;const m=(r=n.displayName)!==null&&r!==void 0?r:void 0,v=(i=n.email)!==null&&i!==void 0?i:void 0,S=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,P=(a=n.photoURL)!==null&&a!==void 0?a:void 0,x=(l=n.tenantId)!==null&&l!==void 0?l:void 0,D=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,w=(h=n.createdAt)!==null&&h!==void 0?h:void 0,y=(f=n.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:A,emailVerified:L,isAnonymous:F,providerData:U,stsTokenManager:E}=n;W(A&&E,e,"internal-error");const g=li.fromJSON(this.name,E);W(typeof A=="string",e,"internal-error"),An(m,e.name),An(v,e.name),W(typeof L=="boolean",e,"internal-error"),W(typeof F=="boolean",e,"internal-error"),An(S,e.name),An(P,e.name),An(x,e.name),An(D,e.name),An(w,e.name),An(y,e.name);const _=new ln({uid:A,auth:e,email:v,emailVerified:L,displayName:m,isAnonymous:F,photoURL:P,phoneNumber:S,tenantId:x,stsTokenManager:g,createdAt:w,lastLoginAt:y});return U&&Array.isArray(U)&&(_.providerData=U.map(I=>Object.assign({},I))),D&&(_._redirectEventId=D),_}static async _fromIdTokenResponse(e,n,r=!1){const i=new li;i.updateFromServerResponse(n);const s=new ln({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Za(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];W(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Yy(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new li;l.updateFromIdToken(r);const u=new ln({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:a}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Xc(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gm=new Map;function un(t){yn(t instanceof Function,"Expected a class definition");let e=gm.get(t);return e?(yn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,gm.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jy{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Jy.type="NONE";const vm=Jy;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _a(t,e,n){return`firebase:${t}:${e}:${n}`}class ui{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=_a(this.userKey,i.apiKey,s),this.fullPersistenceKey=_a("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?ln._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new ui(un(vm),e,r);const i=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let s=i[0]||un(vm);const a=_a(r,e.config.apiKey,e.name);let l=null;for(const h of n)try{const f=await h._get(a);if(f){const m=ln._fromJSON(e,f);h!==s&&(l=m),s=h;break}}catch{}const u=i.filter(h=>h._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new ui(s,e,r):(s=u[0],l&&await s._set(a,l.toJSON()),await Promise.all(n.map(async h=>{if(h!==s)try{await h._remove(a)}catch{}})),new ui(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ym(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(n_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Zy(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(i_(e))return"Blackberry";if(s_(e))return"Webos";if(e_(e))return"Safari";if((e.includes("chrome/")||t_(e))&&!e.includes("edge/"))return"Chrome";if(r_(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Zy(t=Ye()){return/firefox\//i.test(t)}function e_(t=Ye()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function t_(t=Ye()){return/crios\//i.test(t)}function n_(t=Ye()){return/iemobile/i.test(t)}function r_(t=Ye()){return/android/i.test(t)}function i_(t=Ye()){return/blackberry/i.test(t)}function s_(t=Ye()){return/webos/i.test(t)}function pd(t=Ye()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function PA(t=Ye()){var e;return pd(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function RA(){return BT()&&document.documentMode===10}function o_(t=Ye()){return pd(t)||r_(t)||s_(t)||i_(t)||/windows phone/i.test(t)||n_(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function a_(t,e=[]){let n;switch(t){case"Browser":n=ym(Ye());break;case"Worker":n=`${ym(Ye())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${ki}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kA{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,l)=>{try{const u=e(s);a(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function NA(t,e={}){return rr(t,"GET","/v2/passwordPolicy",nr(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xA=6;class OA{constructor(e){var n,r,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=a.minPasswordLength)!==null&&n!==void 0?n:xA,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,a,l;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(a=u.containsNumericCharacter)!==null&&a!==void 0?a:!0),u.isValid&&(u.isValid=(l=u.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),u}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DA{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new _m(this),this.idTokenSubscription=new _m(this),this.beforeStateQueue=new kA(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ky,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=un(n)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await ui.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Xy(this,{idToken:e}),r=await ln._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Dt(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=i==null?void 0:i._redirectEventId,u=await this.tryRedirectSignIn(e);(!a||a===l)&&(u!=null&&u.user)&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return W(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Za(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=dA()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Dt(this.app))return Promise.reject(hn(this));const n=e?ut(e):null;return n&&W(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&W(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Dt(this.app)?Promise.reject(hn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Dt(this.app)?Promise.reject(hn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(un(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await NA(this),n=new OA(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ao("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await CA(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&un(e)||this._popupRedirectResolver;W(n,this,"argument-error"),this.redirectPersistenceManager=await ui.create(this,[un(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(W(l,this,"internal-error"),l.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{a=!0,u()}}else{const u=e.addObserver(n);return()=>{a=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return W(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=a_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&lA(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function ir(t){return ut(t)}class _m{constructor(e){this.auth=e,this.observer=null,this.addObserver=QT(n=>this.observer=n)}get next(){return W(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xl={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function LA(t){xl=t}function l_(t){return xl.loadJS(t)}function VA(){return xl.recaptchaEnterpriseScript}function MA(){return xl.gapiScript}function bA(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const FA="recaptcha-enterprise",UA="NO_RECAPTCHA";class jA{constructor(e){this.type=FA,this.auth=ir(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,l)=>{yA(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const h=new vA(u);return s.tenantId==null?s._agentRecaptchaConfig=h:s._tenantRecaptchaConfigs[s.tenantId]=h,a(h.siteKey)}}).catch(u=>{l(u)})})}function i(s,a,l){const u=window.grecaptcha;pm(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(h=>{a(h)}).catch(()=>{a(UA)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,a)=>{r(this.auth).then(l=>{if(!n&&pm(window.grecaptcha))i(l,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let u=VA();u.length!==0&&(u+=l),l_(u).then(()=>{i(l,s,a)}).catch(h=>{a(h)})}}).catch(l=>{a(l)})})}}async function Em(t,e,n,r=!1){const i=new jA(t);let s;try{s=await i.verify(n)}catch{s=await i.verify(n,!0)}const a=Object.assign({},e);return r?Object.assign(a,{captchaResp:s}):Object.assign(a,{captchaResponse:s}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Yc(t,e,n,r){var i;if(!((i=t._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Em(t,e,n,n==="getOobCode");return r(t,s)}else return r(t,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await Em(t,e,n,n==="getOobCode");return r(t,a)}else return Promise.reject(s)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BA(t,e){const n=ld(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(Xa(s,e??{}))return i;At(i,"already-initialized")}return n.initialize({options:e})}function zA(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(un);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function $A(t,e,n){const r=ir(t);W(r._canInitEmulator,r,"emulator-config-failed"),W(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=u_(e),{host:a,port:l}=HA(e),u=l===null?"":`:${l}`;r.config.emulator={url:`${s}//${a}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),WA()}function u_(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function HA(t){const e=u_(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:wm(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:wm(a)}}}function wm(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function WA(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return an("not implemented")}_getIdTokenResponse(e){return an("not implemented")}_linkToIdToken(e,n){return an("not implemented")}_getReauthenticationResolver(e){return an("not implemented")}}async function KA(t,e){return rr(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qA(t,e){return co(t,"POST","/v1/accounts:signInWithPassword",nr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function GA(t,e){return co(t,"POST","/v1/accounts:signInWithEmailLink",nr(t,e))}async function QA(t,e){return co(t,"POST","/v1/accounts:signInWithEmailLink",nr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks extends md{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new Ks(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new Ks(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Yc(e,n,"signInWithPassword",qA);case"emailLink":return GA(e,{email:this._email,oobCode:this._password});default:At(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Yc(e,r,"signUpPassword",KA);case"emailLink":return QA(e,{idToken:n,email:this._email,oobCode:this._password});default:At(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ci(t,e){return co(t,"POST","/v1/accounts:signInWithIdp",nr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XA="http://localhost";class kr extends md{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new kr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):At("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=ud(n,["providerId","signInMethod"]);if(!r||!i)return null;const a=new kr(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return ci(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,ci(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,ci(e,n)}buildRequest(){const e={requestUri:XA,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=lo(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YA(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function JA(t){const e=ls(us(t)).link,n=e?ls(us(e)).deep_link_id:null,r=ls(us(t)).deep_link_id;return(r?ls(us(r)).link:null)||r||n||e||t}class gd{constructor(e){var n,r,i,s,a,l;const u=ls(us(e)),h=(n=u.apiKey)!==null&&n!==void 0?n:null,f=(r=u.oobCode)!==null&&r!==void 0?r:null,m=YA((i=u.mode)!==null&&i!==void 0?i:null);W(h&&f&&m,"argument-error"),this.apiKey=h,this.operation=m,this.code=f,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(a=u.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=u.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=JA(e);try{return new gd(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni{constructor(){this.providerId=Ni.PROVIDER_ID}static credential(e,n){return Ks._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=gd.parseLink(n);return W(r,"argument-error"),Ks._fromEmailAndCode(e,r.code,r.tenantId)}}Ni.PROVIDER_ID="password";Ni.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Ni.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho extends vd{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn extends ho{constructor(){super("facebook.com")}static credential(e){return kr._fromParams({providerId:Nn.PROVIDER_ID,signInMethod:Nn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Nn.credentialFromTaggedObject(e)}static credentialFromError(e){return Nn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Nn.credential(e.oauthAccessToken)}catch{return null}}}Nn.FACEBOOK_SIGN_IN_METHOD="facebook.com";Nn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn extends ho{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return kr._fromParams({providerId:rn.PROVIDER_ID,signInMethod:rn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return rn.credentialFromTaggedObject(e)}static credentialFromError(e){return rn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return rn.credential(n,r)}catch{return null}}}rn.GOOGLE_SIGN_IN_METHOD="google.com";rn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn extends ho{constructor(){super("github.com")}static credential(e){return kr._fromParams({providerId:xn.PROVIDER_ID,signInMethod:xn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return xn.credentialFromTaggedObject(e)}static credentialFromError(e){return xn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return xn.credential(e.oauthAccessToken)}catch{return null}}}xn.GITHUB_SIGN_IN_METHOD="github.com";xn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On extends ho{constructor(){super("twitter.com")}static credential(e,n){return kr._fromParams({providerId:On.PROVIDER_ID,signInMethod:On.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return On.credentialFromTaggedObject(e)}static credentialFromError(e){return On.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return On.credential(n,r)}catch{return null}}}On.TWITTER_SIGN_IN_METHOD="twitter.com";On.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ZA(t,e){return co(t,"POST","/v1/accounts:signUp",nr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await ln._fromIdTokenResponse(e,r,i),a=Im(r);return new Nr({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Im(r);return new Nr({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Im(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el extends En{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,el.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new el(e,n,r,i)}}function c_(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?el._fromErrorAndOperation(t,s,e,r):s})}async function eC(t,e,n=!1){const r=await Ws(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Nr._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tC(t,e,n=!1){const{auth:r}=t;if(Dt(r.app))return Promise.reject(hn(r));const i="reauthenticate";try{const s=await Ws(t,c_(r,i,e,t),n);W(s.idToken,r,"internal-error");const a=fd(s.idToken);W(a,r,"internal-error");const{sub:l}=a;return W(t.uid===l,r,"user-mismatch"),Nr._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&At(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function h_(t,e,n=!1){if(Dt(t.app))return Promise.reject(hn(t));const r="signIn",i=await c_(t,r,e),s=await Nr._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function nC(t,e){return h_(ir(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function d_(t){const e=ir(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function rC(t,e,n){if(Dt(t.app))return Promise.reject(hn(t));const r=ir(t),a=await Yc(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",ZA).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&d_(t),u}),l=await Nr._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(l.user),l}function iC(t,e,n){return Dt(t.app)?Promise.reject(hn(t)):nC(ut(t),Ni.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&d_(t),r})}function sC(t,e,n,r){return ut(t).onIdTokenChanged(e,n,r)}function oC(t,e,n){return ut(t).beforeAuthStateChanged(e,n)}function aC(t,e,n,r){return ut(t).onAuthStateChanged(e,n,r)}function lC(t){return ut(t).signOut()}const tl="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(tl,"1"),this.storage.removeItem(tl),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uC=1e3,cC=10;class p_ extends f_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=o_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,l,u)=>{this.notifyListeners(a,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);RA()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,cC):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},uC)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}p_.type="LOCAL";const hC=p_;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m_ extends f_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}m_.type="SESSION";const g_=m_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dC(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ol{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new Ol(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(a).map(async h=>h(n.origin,s)),u=await dC(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ol.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yd(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fC{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((l,u)=>{const h=yd("",20);i.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(m){const v=m;if(v.data.eventId===h)switch(v.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(v.data.response);break;default:clearTimeout(f),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ht(){return window}function pC(t){Ht().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v_(){return typeof Ht().WorkerGlobalScope<"u"&&typeof Ht().importScripts=="function"}async function mC(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function gC(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function vC(){return v_()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const y_="firebaseLocalStorageDb",yC=1,nl="firebaseLocalStorage",__="fbase_key";class fo{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Dl(t,e){return t.transaction([nl],e?"readwrite":"readonly").objectStore(nl)}function _C(){const t=indexedDB.deleteDatabase(y_);return new fo(t).toPromise()}function Jc(){const t=indexedDB.open(y_,yC);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(nl,{keyPath:__})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(nl)?e(r):(r.close(),await _C(),e(await Jc()))})})}async function Tm(t,e,n){const r=Dl(t,!0).put({[__]:e,value:n});return new fo(r).toPromise()}async function EC(t,e){const n=Dl(t,!1).get(e),r=await new fo(n).toPromise();return r===void 0?null:r.value}function Sm(t,e){const n=Dl(t,!0).delete(e);return new fo(n).toPromise()}const wC=800,IC=3;class E_{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Jc(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>IC)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return v_()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ol._getInstance(vC()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await mC(),!this.activeServiceWorker)return;this.sender=new fC(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||gC()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Jc();return await Tm(e,tl,"1"),await Sm(e,tl),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Tm(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>EC(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Sm(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Dl(i,!1).getAll();return new fo(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),wC)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}E_.type="LOCAL";const TC=E_;new uo(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w_(t,e){return e?un(e):(W(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _d extends md{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ci(e,this._buildIdpRequest())}_linkToIdToken(e,n){return ci(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return ci(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function SC(t){return h_(t.auth,new _d(t),t.bypassAuthState)}function AC(t){const{auth:e,user:n}=t;return W(n,e,"internal-error"),tC(n,new _d(t),t.bypassAuthState)}async function CC(t){const{auth:e,user:n}=t;return W(n,e,"internal-error"),eC(n,new _d(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I_{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:l}=e;if(a){this.reject(a);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return SC;case"linkViaPopup":case"linkViaRedirect":return CC;case"reauthViaPopup":case"reauthViaRedirect":return AC;default:At(this.auth,"internal-error")}}resolve(e){yn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){yn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PC=new uo(2e3,1e4);async function RC(t,e,n){if(Dt(t.app))return Promise.reject(bt(t,"operation-not-supported-in-this-environment"));const r=ir(t);uA(t,e,vd);const i=w_(r,n);return new gr(r,"signInViaPopup",e,i).executeNotNull()}class gr extends I_{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,gr.currentPopupAction&&gr.currentPopupAction.cancel(),gr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return W(e,this.auth,"internal-error"),e}async onExecution(){yn(this.filter.length===1,"Popup operations only handle one event");const e=yd();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(bt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(bt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,gr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(bt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,PC.get())};e()}}gr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kC="pendingRedirect",Ea=new Map;class NC extends I_{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Ea.get(this.auth._key());if(!e){try{const r=await xC(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Ea.set(this.auth._key(),e)}return this.bypassAuthState||Ea.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function xC(t,e){const n=LC(e),r=DC(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function OC(t,e){Ea.set(t._key(),e)}function DC(t){return un(t._redirectPersistence)}function LC(t){return _a(kC,t.config.apiKey,t.name)}async function VC(t,e,n=!1){if(Dt(t.app))return Promise.reject(hn(t));const r=ir(t),i=w_(r,e),a=await new NC(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MC=10*60*1e3;class bC{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!FC(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!T_(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(bt(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=MC&&this.cachedEventUids.clear(),this.cachedEventUids.has(Am(e))}saveEventToCache(e){this.cachedEventUids.add(Am(e)),this.lastProcessedEventTime=Date.now()}}function Am(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function T_({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function FC(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return T_(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function UC(t,e={}){return rr(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jC=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,BC=/^https?/;async function zC(t){if(t.config.emulator)return;const{authorizedDomains:e}=await UC(t);for(const n of e)try{if($C(n))return}catch{}At(t,"unauthorized-domain")}function $C(t){const e=Qc(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!BC.test(n))return!1;if(jC.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const HC=new uo(3e4,6e4);function Cm(){const t=Ht().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function WC(t){return new Promise((e,n)=>{var r,i,s;function a(){Cm(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Cm(),n(bt(t,"network-request-failed"))},timeout:HC.get()})}if(!((i=(r=Ht().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Ht().gapi)===null||s===void 0)&&s.load)a();else{const l=bA("iframefcb");return Ht()[l]=()=>{gapi.load?a():n(bt(t,"network-request-failed"))},l_(`${MA()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw wa=null,e})}let wa=null;function KC(t){return wa=wa||WC(t),wa}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qC=new uo(5e3,15e3),GC="__/auth/iframe",QC="emulator/auth/iframe",XC={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},YC=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function JC(t){const e=t.config;W(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?dd(e,QC):`https://${t.config.authDomain}/${GC}`,r={apiKey:e.apiKey,appName:t.name,v:ki},i=YC.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${lo(r).slice(1)}`}async function ZC(t){const e=await KC(t),n=Ht().gapi;return W(n,t,"internal-error"),e.open({where:document.body,url:JC(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:XC,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=bt(t,"network-request-failed"),l=Ht().setTimeout(()=>{s(a)},qC.get());function u(){Ht().clearTimeout(l),i(r)}r.ping(u).then(u,()=>{s(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eP={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},tP=500,nP=600,rP="_blank",iP="http://localhost";class Pm{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function sP(t,e,n,r=tP,i=nP){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u=Object.assign(Object.assign({},eP),{width:r.toString(),height:i.toString(),top:s,left:a}),h=Ye().toLowerCase();n&&(l=t_(h)?rP:n),Zy(h)&&(e=e||iP,u.scrollbars="yes");const f=Object.entries(u).reduce((v,[S,P])=>`${v}${S}=${P},`,"");if(PA(h)&&l!=="_self")return oP(e||"",l),new Pm(null);const m=window.open(e||"",l,f);W(m,t,"popup-blocked");try{m.focus()}catch{}return new Pm(m)}function oP(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aP="__/auth/handler",lP="emulator/auth/handler",uP=encodeURIComponent("fac");async function Rm(t,e,n,r,i,s){W(t.config.authDomain,t,"auth-domain-config-required"),W(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:ki,eventId:i};if(e instanceof vd){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",GT(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof ho){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}t.tenantId&&(a.tid=t.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const u=await t._getAppCheckToken(),h=u?`#${uP}=${encodeURIComponent(u)}`:"";return`${cP(t)}?${lo(l).slice(1)}${h}`}function cP({config:t}){return t.emulator?dd(t,lP):`https://${t.authDomain}/${aP}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wu="webStorageSupport";class hP{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=g_,this._completeRedirectFn=VC,this._overrideRedirectResult=OC}async _openPopup(e,n,r,i){var s;yn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const a=await Rm(e,n,r,Qc(),i);return sP(e,a,yd())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Rm(e,n,r,Qc(),i);return pC(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(yn(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await ZC(e),r=new bC(e);return n.register("authEvent",i=>(W(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Wu,{type:Wu},i=>{var s;const a=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[Wu];a!==void 0&&n(!!a),At(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=zC(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return o_()||e_()||pd()}}const dP=hP;var km="@firebase/auth",Nm="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fP{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){W(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pP(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function mP(t){_i(new Rr("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;W(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:a,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:a_(t)},h=new DA(r,i,s,u);return zA(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),_i(new Rr("auth-internal",e=>{const n=ir(e.getProvider("auth").getImmediate());return(r=>new fP(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Kn(km,Nm,pP(t)),Kn(km,Nm,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gP=5*60,vP=Fy("authIdTokenMaxAge")||gP;let xm=null;const yP=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>vP)return;const i=n==null?void 0:n.token;xm!==i&&(xm=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function _P(t=zy()){const e=ld(t,"auth");if(e.isInitialized())return e.getImmediate();const n=BA(t,{popupRedirectResolver:dP,persistence:[TC,hC,g_]}),r=Fy("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=yP(s.toString());oC(n,a,()=>a(n.currentUser)),sC(n,l=>a(l))}}const i=My("auth");return i&&$A(n,`http://${i}`),n}function EP(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}LA({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=bt("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",EP().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});mP("Browser");var Om=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var S_;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,g){function _(){}_.prototype=g.prototype,E.D=g.prototype,E.prototype=new _,E.prototype.constructor=E,E.C=function(I,C,k){for(var T=Array(arguments.length-2),yt=2;yt<arguments.length;yt++)T[yt-2]=arguments[yt];return g.prototype[C].apply(I,T)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,g,_){_||(_=0);var I=Array(16);if(typeof g=="string")for(var C=0;16>C;++C)I[C]=g.charCodeAt(_++)|g.charCodeAt(_++)<<8|g.charCodeAt(_++)<<16|g.charCodeAt(_++)<<24;else for(C=0;16>C;++C)I[C]=g[_++]|g[_++]<<8|g[_++]<<16|g[_++]<<24;g=E.g[0],_=E.g[1],C=E.g[2];var k=E.g[3],T=g+(k^_&(C^k))+I[0]+3614090360&4294967295;g=_+(T<<7&4294967295|T>>>25),T=k+(C^g&(_^C))+I[1]+3905402710&4294967295,k=g+(T<<12&4294967295|T>>>20),T=C+(_^k&(g^_))+I[2]+606105819&4294967295,C=k+(T<<17&4294967295|T>>>15),T=_+(g^C&(k^g))+I[3]+3250441966&4294967295,_=C+(T<<22&4294967295|T>>>10),T=g+(k^_&(C^k))+I[4]+4118548399&4294967295,g=_+(T<<7&4294967295|T>>>25),T=k+(C^g&(_^C))+I[5]+1200080426&4294967295,k=g+(T<<12&4294967295|T>>>20),T=C+(_^k&(g^_))+I[6]+2821735955&4294967295,C=k+(T<<17&4294967295|T>>>15),T=_+(g^C&(k^g))+I[7]+4249261313&4294967295,_=C+(T<<22&4294967295|T>>>10),T=g+(k^_&(C^k))+I[8]+1770035416&4294967295,g=_+(T<<7&4294967295|T>>>25),T=k+(C^g&(_^C))+I[9]+2336552879&4294967295,k=g+(T<<12&4294967295|T>>>20),T=C+(_^k&(g^_))+I[10]+4294925233&4294967295,C=k+(T<<17&4294967295|T>>>15),T=_+(g^C&(k^g))+I[11]+2304563134&4294967295,_=C+(T<<22&4294967295|T>>>10),T=g+(k^_&(C^k))+I[12]+1804603682&4294967295,g=_+(T<<7&4294967295|T>>>25),T=k+(C^g&(_^C))+I[13]+4254626195&4294967295,k=g+(T<<12&4294967295|T>>>20),T=C+(_^k&(g^_))+I[14]+2792965006&4294967295,C=k+(T<<17&4294967295|T>>>15),T=_+(g^C&(k^g))+I[15]+1236535329&4294967295,_=C+(T<<22&4294967295|T>>>10),T=g+(C^k&(_^C))+I[1]+4129170786&4294967295,g=_+(T<<5&4294967295|T>>>27),T=k+(_^C&(g^_))+I[6]+3225465664&4294967295,k=g+(T<<9&4294967295|T>>>23),T=C+(g^_&(k^g))+I[11]+643717713&4294967295,C=k+(T<<14&4294967295|T>>>18),T=_+(k^g&(C^k))+I[0]+3921069994&4294967295,_=C+(T<<20&4294967295|T>>>12),T=g+(C^k&(_^C))+I[5]+3593408605&4294967295,g=_+(T<<5&4294967295|T>>>27),T=k+(_^C&(g^_))+I[10]+38016083&4294967295,k=g+(T<<9&4294967295|T>>>23),T=C+(g^_&(k^g))+I[15]+3634488961&4294967295,C=k+(T<<14&4294967295|T>>>18),T=_+(k^g&(C^k))+I[4]+3889429448&4294967295,_=C+(T<<20&4294967295|T>>>12),T=g+(C^k&(_^C))+I[9]+568446438&4294967295,g=_+(T<<5&4294967295|T>>>27),T=k+(_^C&(g^_))+I[14]+3275163606&4294967295,k=g+(T<<9&4294967295|T>>>23),T=C+(g^_&(k^g))+I[3]+4107603335&4294967295,C=k+(T<<14&4294967295|T>>>18),T=_+(k^g&(C^k))+I[8]+1163531501&4294967295,_=C+(T<<20&4294967295|T>>>12),T=g+(C^k&(_^C))+I[13]+2850285829&4294967295,g=_+(T<<5&4294967295|T>>>27),T=k+(_^C&(g^_))+I[2]+4243563512&4294967295,k=g+(T<<9&4294967295|T>>>23),T=C+(g^_&(k^g))+I[7]+1735328473&4294967295,C=k+(T<<14&4294967295|T>>>18),T=_+(k^g&(C^k))+I[12]+2368359562&4294967295,_=C+(T<<20&4294967295|T>>>12),T=g+(_^C^k)+I[5]+4294588738&4294967295,g=_+(T<<4&4294967295|T>>>28),T=k+(g^_^C)+I[8]+2272392833&4294967295,k=g+(T<<11&4294967295|T>>>21),T=C+(k^g^_)+I[11]+1839030562&4294967295,C=k+(T<<16&4294967295|T>>>16),T=_+(C^k^g)+I[14]+4259657740&4294967295,_=C+(T<<23&4294967295|T>>>9),T=g+(_^C^k)+I[1]+2763975236&4294967295,g=_+(T<<4&4294967295|T>>>28),T=k+(g^_^C)+I[4]+1272893353&4294967295,k=g+(T<<11&4294967295|T>>>21),T=C+(k^g^_)+I[7]+4139469664&4294967295,C=k+(T<<16&4294967295|T>>>16),T=_+(C^k^g)+I[10]+3200236656&4294967295,_=C+(T<<23&4294967295|T>>>9),T=g+(_^C^k)+I[13]+681279174&4294967295,g=_+(T<<4&4294967295|T>>>28),T=k+(g^_^C)+I[0]+3936430074&4294967295,k=g+(T<<11&4294967295|T>>>21),T=C+(k^g^_)+I[3]+3572445317&4294967295,C=k+(T<<16&4294967295|T>>>16),T=_+(C^k^g)+I[6]+76029189&4294967295,_=C+(T<<23&4294967295|T>>>9),T=g+(_^C^k)+I[9]+3654602809&4294967295,g=_+(T<<4&4294967295|T>>>28),T=k+(g^_^C)+I[12]+3873151461&4294967295,k=g+(T<<11&4294967295|T>>>21),T=C+(k^g^_)+I[15]+530742520&4294967295,C=k+(T<<16&4294967295|T>>>16),T=_+(C^k^g)+I[2]+3299628645&4294967295,_=C+(T<<23&4294967295|T>>>9),T=g+(C^(_|~k))+I[0]+4096336452&4294967295,g=_+(T<<6&4294967295|T>>>26),T=k+(_^(g|~C))+I[7]+1126891415&4294967295,k=g+(T<<10&4294967295|T>>>22),T=C+(g^(k|~_))+I[14]+2878612391&4294967295,C=k+(T<<15&4294967295|T>>>17),T=_+(k^(C|~g))+I[5]+4237533241&4294967295,_=C+(T<<21&4294967295|T>>>11),T=g+(C^(_|~k))+I[12]+1700485571&4294967295,g=_+(T<<6&4294967295|T>>>26),T=k+(_^(g|~C))+I[3]+2399980690&4294967295,k=g+(T<<10&4294967295|T>>>22),T=C+(g^(k|~_))+I[10]+4293915773&4294967295,C=k+(T<<15&4294967295|T>>>17),T=_+(k^(C|~g))+I[1]+2240044497&4294967295,_=C+(T<<21&4294967295|T>>>11),T=g+(C^(_|~k))+I[8]+1873313359&4294967295,g=_+(T<<6&4294967295|T>>>26),T=k+(_^(g|~C))+I[15]+4264355552&4294967295,k=g+(T<<10&4294967295|T>>>22),T=C+(g^(k|~_))+I[6]+2734768916&4294967295,C=k+(T<<15&4294967295|T>>>17),T=_+(k^(C|~g))+I[13]+1309151649&4294967295,_=C+(T<<21&4294967295|T>>>11),T=g+(C^(_|~k))+I[4]+4149444226&4294967295,g=_+(T<<6&4294967295|T>>>26),T=k+(_^(g|~C))+I[11]+3174756917&4294967295,k=g+(T<<10&4294967295|T>>>22),T=C+(g^(k|~_))+I[2]+718787259&4294967295,C=k+(T<<15&4294967295|T>>>17),T=_+(k^(C|~g))+I[9]+3951481745&4294967295,E.g[0]=E.g[0]+g&4294967295,E.g[1]=E.g[1]+(C+(T<<21&4294967295|T>>>11))&4294967295,E.g[2]=E.g[2]+C&4294967295,E.g[3]=E.g[3]+k&4294967295}r.prototype.u=function(E,g){g===void 0&&(g=E.length);for(var _=g-this.blockSize,I=this.B,C=this.h,k=0;k<g;){if(C==0)for(;k<=_;)i(this,E,k),k+=this.blockSize;if(typeof E=="string"){for(;k<g;)if(I[C++]=E.charCodeAt(k++),C==this.blockSize){i(this,I),C=0;break}}else for(;k<g;)if(I[C++]=E[k++],C==this.blockSize){i(this,I),C=0;break}}this.h=C,this.o+=g},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var g=1;g<E.length-8;++g)E[g]=0;var _=8*this.o;for(g=E.length-8;g<E.length;++g)E[g]=_&255,_/=256;for(this.u(E),E=Array(16),g=_=0;4>g;++g)for(var I=0;32>I;I+=8)E[_++]=this.g[g]>>>I&255;return E};function s(E,g){var _=l;return Object.prototype.hasOwnProperty.call(_,E)?_[E]:_[E]=g(E)}function a(E,g){this.h=g;for(var _=[],I=!0,C=E.length-1;0<=C;C--){var k=E[C]|0;I&&k==g||(_[C]=k,I=!1)}this.g=_}var l={};function u(E){return-128<=E&&128>E?s(E,function(g){return new a([g|0],0>g?-1:0)}):new a([E|0],0>E?-1:0)}function h(E){if(isNaN(E)||!isFinite(E))return m;if(0>E)return D(h(-E));for(var g=[],_=1,I=0;E>=_;I++)g[I]=E/_|0,_*=4294967296;return new a(g,0)}function f(E,g){if(E.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(E.charAt(0)=="-")return D(f(E.substring(1),g));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=h(Math.pow(g,8)),I=m,C=0;C<E.length;C+=8){var k=Math.min(8,E.length-C),T=parseInt(E.substring(C,C+k),g);8>k?(k=h(Math.pow(g,k)),I=I.j(k).add(h(T))):(I=I.j(_),I=I.add(h(T)))}return I}var m=u(0),v=u(1),S=u(16777216);t=a.prototype,t.m=function(){if(x(this))return-D(this).m();for(var E=0,g=1,_=0;_<this.g.length;_++){var I=this.i(_);E+=(0<=I?I:4294967296+I)*g,g*=4294967296}return E},t.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(P(this))return"0";if(x(this))return"-"+D(this).toString(E);for(var g=h(Math.pow(E,6)),_=this,I="";;){var C=L(_,g).g;_=w(_,C.j(g));var k=((0<_.g.length?_.g[0]:_.h)>>>0).toString(E);if(_=C,P(_))return k+I;for(;6>k.length;)k="0"+k;I=k+I}},t.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function P(E){if(E.h!=0)return!1;for(var g=0;g<E.g.length;g++)if(E.g[g]!=0)return!1;return!0}function x(E){return E.h==-1}t.l=function(E){return E=w(this,E),x(E)?-1:P(E)?0:1};function D(E){for(var g=E.g.length,_=[],I=0;I<g;I++)_[I]=~E.g[I];return new a(_,~E.h).add(v)}t.abs=function(){return x(this)?D(this):this},t.add=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],I=0,C=0;C<=g;C++){var k=I+(this.i(C)&65535)+(E.i(C)&65535),T=(k>>>16)+(this.i(C)>>>16)+(E.i(C)>>>16);I=T>>>16,k&=65535,T&=65535,_[C]=T<<16|k}return new a(_,_[_.length-1]&-2147483648?-1:0)};function w(E,g){return E.add(D(g))}t.j=function(E){if(P(this)||P(E))return m;if(x(this))return x(E)?D(this).j(D(E)):D(D(this).j(E));if(x(E))return D(this.j(D(E)));if(0>this.l(S)&&0>E.l(S))return h(this.m()*E.m());for(var g=this.g.length+E.g.length,_=[],I=0;I<2*g;I++)_[I]=0;for(I=0;I<this.g.length;I++)for(var C=0;C<E.g.length;C++){var k=this.i(I)>>>16,T=this.i(I)&65535,yt=E.i(C)>>>16,sr=E.i(C)&65535;_[2*I+2*C]+=T*sr,y(_,2*I+2*C),_[2*I+2*C+1]+=k*sr,y(_,2*I+2*C+1),_[2*I+2*C+1]+=T*yt,y(_,2*I+2*C+1),_[2*I+2*C+2]+=k*yt,y(_,2*I+2*C+2)}for(I=0;I<g;I++)_[I]=_[2*I+1]<<16|_[2*I];for(I=g;I<2*g;I++)_[I]=0;return new a(_,0)};function y(E,g){for(;(E[g]&65535)!=E[g];)E[g+1]+=E[g]>>>16,E[g]&=65535,g++}function A(E,g){this.g=E,this.h=g}function L(E,g){if(P(g))throw Error("division by zero");if(P(E))return new A(m,m);if(x(E))return g=L(D(E),g),new A(D(g.g),D(g.h));if(x(g))return g=L(E,D(g)),new A(D(g.g),g.h);if(30<E.g.length){if(x(E)||x(g))throw Error("slowDivide_ only works with positive integers.");for(var _=v,I=g;0>=I.l(E);)_=F(_),I=F(I);var C=U(_,1),k=U(I,1);for(I=U(I,2),_=U(_,2);!P(I);){var T=k.add(I);0>=T.l(E)&&(C=C.add(_),k=T),I=U(I,1),_=U(_,1)}return g=w(E,C.j(g)),new A(C,g)}for(C=m;0<=E.l(g);){for(_=Math.max(1,Math.floor(E.m()/g.m())),I=Math.ceil(Math.log(_)/Math.LN2),I=48>=I?1:Math.pow(2,I-48),k=h(_),T=k.j(g);x(T)||0<T.l(E);)_-=I,k=h(_),T=k.j(g);P(k)&&(k=v),C=C.add(k),E=w(E,T)}return new A(C,E)}t.A=function(E){return L(this,E).h},t.and=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],I=0;I<g;I++)_[I]=this.i(I)&E.i(I);return new a(_,this.h&E.h)},t.or=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],I=0;I<g;I++)_[I]=this.i(I)|E.i(I);return new a(_,this.h|E.h)},t.xor=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],I=0;I<g;I++)_[I]=this.i(I)^E.i(I);return new a(_,this.h^E.h)};function F(E){for(var g=E.g.length+1,_=[],I=0;I<g;I++)_[I]=E.i(I)<<1|E.i(I-1)>>>31;return new a(_,E.h)}function U(E,g){var _=g>>5;g%=32;for(var I=E.g.length-_,C=[],k=0;k<I;k++)C[k]=0<g?E.i(k+_)>>>g|E.i(k+_+1)<<32-g:E.i(k+_);return new a(C,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=h,a.fromString=f,S_=a}).apply(typeof Om<"u"?Om:typeof self<"u"?self:typeof window<"u"?window:{});var ta=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var A_,cs,C_,Ia,Zc,P_,R_,k_;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,c,d){return o==Array.prototype||o==Object.prototype||(o[c]=d.value),o};function n(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof ta=="object"&&ta];for(var c=0;c<o.length;++c){var d=o[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=n(this);function i(o,c){if(c)e:{var d=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var R=o[p];if(!(R in d))break e;d=d[R]}o=o[o.length-1],p=d[o],c=c(p),c!=p&&c!=null&&e(d,o,{configurable:!0,writable:!0,value:c})}}function s(o,c){o instanceof String&&(o+="");var d=0,p=!1,R={next:function(){if(!p&&d<o.length){var O=d++;return{value:c(O,o[O]),done:!1}}return p=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}i("Array.prototype.values",function(o){return o||function(){return s(this,function(c,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function u(o){var c=typeof o;return c=c!="object"?c:o?Array.isArray(o)?"array":c:"null",c=="array"||c=="object"&&typeof o.length=="number"}function h(o){var c=typeof o;return c=="object"&&o!=null||c=="function"}function f(o,c,d){return o.call.apply(o.bind,arguments)}function m(o,c,d){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,p),o.apply(c,R)}}return function(){return o.apply(c,arguments)}}function v(o,c,d){return v=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,v.apply(null,arguments)}function S(o,c){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function P(o,c){function d(){}d.prototype=c.prototype,o.aa=c.prototype,o.prototype=new d,o.prototype.constructor=o,o.Qb=function(p,R,O){for(var j=Array(arguments.length-2),ie=2;ie<arguments.length;ie++)j[ie-2]=arguments[ie];return c.prototype[R].apply(p,j)}}function x(o){const c=o.length;if(0<c){const d=Array(c);for(let p=0;p<c;p++)d[p]=o[p];return d}return[]}function D(o,c){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(u(p)){const R=o.length||0,O=p.length||0;o.length=R+O;for(let j=0;j<O;j++)o[R+j]=p[j]}else o.push(p)}}class w{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function y(o){return/^[\s\xa0]*$/.test(o)}function A(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function L(o){return L[" "](o),o}L[" "]=function(){};var F=A().indexOf("Gecko")!=-1&&!(A().toLowerCase().indexOf("webkit")!=-1&&A().indexOf("Edge")==-1)&&!(A().indexOf("Trident")!=-1||A().indexOf("MSIE")!=-1)&&A().indexOf("Edge")==-1;function U(o,c,d){for(const p in o)c.call(d,o[p],p,o)}function E(o,c){for(const d in o)c.call(void 0,o[d],d,o)}function g(o){const c={};for(const d in o)c[d]=o[d];return c}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(o,c){let d,p;for(let R=1;R<arguments.length;R++){p=arguments[R];for(d in p)o[d]=p[d];for(let O=0;O<_.length;O++)d=_[O],Object.prototype.hasOwnProperty.call(p,d)&&(o[d]=p[d])}}function C(o){var c=1;o=o.split(":");const d=[];for(;0<c&&o.length;)d.push(o.shift()),c--;return o.length&&d.push(o.join(":")),d}function k(o){l.setTimeout(()=>{throw o},0)}function T(){var o=q;let c=null;return o.g&&(c=o.g,o.g=o.g.next,o.g||(o.h=null),c.next=null),c}class yt{constructor(){this.h=this.g=null}add(c,d){const p=sr.get();p.set(c,d),this.h?this.h.next=p:this.g=p,this.h=p}}var sr=new w(()=>new Di,o=>o.reset());class Di{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Gt,B=!1,q=new yt,G=()=>{const o=l.Promise.resolve(void 0);Gt=()=>{o.then(de)}};var de=()=>{for(var o;o=T();){try{o.h.call(o.g)}catch(d){k(d)}var c=sr;c.j(o),100>c.h&&(c.h++,o.next=c.g,c.g=o)}B=!1};function re(){this.s=this.s,this.C=this.C}re.prototype.s=!1,re.prototype.ma=function(){this.s||(this.s=!0,this.N())},re.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ee(o,c){this.type=o,this.g=this.target=c,this.defaultPrevented=!1}Ee.prototype.h=function(){this.defaultPrevented=!0};var Qt=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,c=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const d=()=>{};l.addEventListener("test",d,c),l.removeEventListener("test",d,c)}catch{}return o}();function Xt(o,c){if(Ee.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var d=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=c,c=o.relatedTarget){if(F){e:{try{L(c.nodeName);var R=!0;break e}catch{}R=!1}R||(c=null)}}else d=="mouseover"?c=o.fromElement:d=="mouseout"&&(c=o.toElement);this.relatedTarget=c,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Yt[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Xt.aa.h.call(this)}}P(Xt,Ee);var Yt={2:"touch",3:"pen",4:"mouse"};Xt.prototype.h=function(){Xt.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Jt="closure_listenable_"+(1e6*Math.random()|0),AE=0;function CE(o,c,d,p,R){this.listener=o,this.proxy=null,this.src=c,this.type=d,this.capture=!!p,this.ha=R,this.key=++AE,this.da=this.fa=!1}function _o(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Eo(o){this.src=o,this.g={},this.h=0}Eo.prototype.add=function(o,c,d,p,R){var O=o.toString();o=this.g[O],o||(o=this.g[O]=[],this.h++);var j=Hl(o,c,p,R);return-1<j?(c=o[j],d||(c.fa=!1)):(c=new CE(c,this.src,O,!!p,R),c.fa=d,o.push(c)),c};function $l(o,c){var d=c.type;if(d in o.g){var p=o.g[d],R=Array.prototype.indexOf.call(p,c,void 0),O;(O=0<=R)&&Array.prototype.splice.call(p,R,1),O&&(_o(c),o.g[d].length==0&&(delete o.g[d],o.h--))}}function Hl(o,c,d,p){for(var R=0;R<o.length;++R){var O=o[R];if(!O.da&&O.listener==c&&O.capture==!!d&&O.ha==p)return R}return-1}var Wl="closure_lm_"+(1e6*Math.random()|0),Kl={};function Fd(o,c,d,p,R){if(Array.isArray(c)){for(var O=0;O<c.length;O++)Fd(o,c[O],d,p,R);return null}return d=Bd(d),o&&o[Jt]?o.K(c,d,h(p)?!!p.capture:!1,R):PE(o,c,d,!1,p,R)}function PE(o,c,d,p,R,O){if(!c)throw Error("Invalid event type");var j=h(R)?!!R.capture:!!R,ie=Gl(o);if(ie||(o[Wl]=ie=new Eo(o)),d=ie.add(c,d,p,j,O),d.proxy)return d;if(p=RE(),d.proxy=p,p.src=o,p.listener=d,o.addEventListener)Qt||(R=j),R===void 0&&(R=!1),o.addEventListener(c.toString(),p,R);else if(o.attachEvent)o.attachEvent(jd(c.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function RE(){function o(d){return c.call(o.src,o.listener,d)}const c=kE;return o}function Ud(o,c,d,p,R){if(Array.isArray(c))for(var O=0;O<c.length;O++)Ud(o,c[O],d,p,R);else p=h(p)?!!p.capture:!!p,d=Bd(d),o&&o[Jt]?(o=o.i,c=String(c).toString(),c in o.g&&(O=o.g[c],d=Hl(O,d,p,R),-1<d&&(_o(O[d]),Array.prototype.splice.call(O,d,1),O.length==0&&(delete o.g[c],o.h--)))):o&&(o=Gl(o))&&(c=o.g[c.toString()],o=-1,c&&(o=Hl(c,d,p,R)),(d=-1<o?c[o]:null)&&ql(d))}function ql(o){if(typeof o!="number"&&o&&!o.da){var c=o.src;if(c&&c[Jt])$l(c.i,o);else{var d=o.type,p=o.proxy;c.removeEventListener?c.removeEventListener(d,p,o.capture):c.detachEvent?c.detachEvent(jd(d),p):c.addListener&&c.removeListener&&c.removeListener(p),(d=Gl(c))?($l(d,o),d.h==0&&(d.src=null,c[Wl]=null)):_o(o)}}}function jd(o){return o in Kl?Kl[o]:Kl[o]="on"+o}function kE(o,c){if(o.da)o=!0;else{c=new Xt(c,this);var d=o.listener,p=o.ha||o.src;o.fa&&ql(o),o=d.call(p,c)}return o}function Gl(o){return o=o[Wl],o instanceof Eo?o:null}var Ql="__closure_events_fn_"+(1e9*Math.random()>>>0);function Bd(o){return typeof o=="function"?o:(o[Ql]||(o[Ql]=function(c){return o.handleEvent(c)}),o[Ql])}function je(){re.call(this),this.i=new Eo(this),this.M=this,this.F=null}P(je,re),je.prototype[Jt]=!0,je.prototype.removeEventListener=function(o,c,d,p){Ud(this,o,c,d,p)};function Je(o,c){var d,p=o.F;if(p)for(d=[];p;p=p.F)d.push(p);if(o=o.M,p=c.type||c,typeof c=="string")c=new Ee(c,o);else if(c instanceof Ee)c.target=c.target||o;else{var R=c;c=new Ee(p,o),I(c,R)}if(R=!0,d)for(var O=d.length-1;0<=O;O--){var j=c.g=d[O];R=wo(j,p,!0,c)&&R}if(j=c.g=o,R=wo(j,p,!0,c)&&R,R=wo(j,p,!1,c)&&R,d)for(O=0;O<d.length;O++)j=c.g=d[O],R=wo(j,p,!1,c)&&R}je.prototype.N=function(){if(je.aa.N.call(this),this.i){var o=this.i,c;for(c in o.g){for(var d=o.g[c],p=0;p<d.length;p++)_o(d[p]);delete o.g[c],o.h--}}this.F=null},je.prototype.K=function(o,c,d,p){return this.i.add(String(o),c,!1,d,p)},je.prototype.L=function(o,c,d,p){return this.i.add(String(o),c,!0,d,p)};function wo(o,c,d,p){if(c=o.i.g[String(c)],!c)return!0;c=c.concat();for(var R=!0,O=0;O<c.length;++O){var j=c[O];if(j&&!j.da&&j.capture==d){var ie=j.listener,De=j.ha||j.src;j.fa&&$l(o.i,j),R=ie.call(De,p)!==!1&&R}}return R&&!p.defaultPrevented}function zd(o,c,d){if(typeof o=="function")d&&(o=v(o,d));else if(o&&typeof o.handleEvent=="function")o=v(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:l.setTimeout(o,c||0)}function $d(o){o.g=zd(()=>{o.g=null,o.i&&(o.i=!1,$d(o))},o.l);const c=o.h;o.h=null,o.m.apply(null,c)}class NE extends re{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:$d(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Li(o){re.call(this),this.h=o,this.g={}}P(Li,re);var Hd=[];function Wd(o){U(o.g,function(c,d){this.g.hasOwnProperty(d)&&ql(c)},o),o.g={}}Li.prototype.N=function(){Li.aa.N.call(this),Wd(this)},Li.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Xl=l.JSON.stringify,xE=l.JSON.parse,OE=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function Yl(){}Yl.prototype.h=null;function Kd(o){return o.h||(o.h=o.i())}function qd(){}var Vi={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Jl(){Ee.call(this,"d")}P(Jl,Ee);function Zl(){Ee.call(this,"c")}P(Zl,Ee);var or={},Gd=null;function Io(){return Gd=Gd||new je}or.La="serverreachability";function Qd(o){Ee.call(this,or.La,o)}P(Qd,Ee);function Mi(o){const c=Io();Je(c,new Qd(c))}or.STAT_EVENT="statevent";function Xd(o,c){Ee.call(this,or.STAT_EVENT,o),this.stat=c}P(Xd,Ee);function Ze(o){const c=Io();Je(c,new Xd(c,o))}or.Ma="timingevent";function Yd(o,c){Ee.call(this,or.Ma,o),this.size=c}P(Yd,Ee);function bi(o,c){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},c)}function Fi(){this.g=!0}Fi.prototype.xa=function(){this.g=!1};function DE(o,c,d,p,R,O){o.info(function(){if(o.g)if(O)for(var j="",ie=O.split("&"),De=0;De<ie.length;De++){var te=ie[De].split("=");if(1<te.length){var Be=te[0];te=te[1];var ze=Be.split("_");j=2<=ze.length&&ze[1]=="type"?j+(Be+"="+te+"&"):j+(Be+"=redacted&")}}else j=null;else j=O;return"XMLHTTP REQ ("+p+") [attempt "+R+"]: "+c+`
`+d+`
`+j})}function LE(o,c,d,p,R,O,j){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+R+"]: "+c+`
`+d+`
`+O+" "+j})}function Fr(o,c,d,p){o.info(function(){return"XMLHTTP TEXT ("+c+"): "+ME(o,d)+(p?" "+p:"")})}function VE(o,c){o.info(function(){return"TIMEOUT: "+c})}Fi.prototype.info=function(){};function ME(o,c){if(!o.g)return c;if(!c)return null;try{var d=JSON.parse(c);if(d){for(o=0;o<d.length;o++)if(Array.isArray(d[o])){var p=d[o];if(!(2>p.length)){var R=p[1];if(Array.isArray(R)&&!(1>R.length)){var O=R[0];if(O!="noop"&&O!="stop"&&O!="close")for(var j=1;j<R.length;j++)R[j]=""}}}}return Xl(d)}catch{return c}}var To={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Jd={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},eu;function So(){}P(So,Yl),So.prototype.g=function(){return new XMLHttpRequest},So.prototype.i=function(){return{}},eu=new So;function wn(o,c,d,p){this.j=o,this.i=c,this.l=d,this.R=p||1,this.U=new Li(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Zd}function Zd(){this.i=null,this.g="",this.h=!1}var ef={},tu={};function nu(o,c,d){o.L=1,o.v=Ro(Zt(c)),o.m=d,o.P=!0,tf(o,null)}function tf(o,c){o.F=Date.now(),Ao(o),o.A=Zt(o.v);var d=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),gf(d.i,"t",p),o.C=0,d=o.j.J,o.h=new Zd,o.g=Lf(o.j,d?c:null,!o.m),0<o.O&&(o.M=new NE(v(o.Y,o,o.g),o.O)),c=o.U,d=o.g,p=o.ca;var R="readystatechange";Array.isArray(R)||(R&&(Hd[0]=R.toString()),R=Hd);for(var O=0;O<R.length;O++){var j=Fd(d,R[O],p||c.handleEvent,!1,c.h||c);if(!j)break;c.g[j.key]=j}c=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,c)):(o.u="GET",o.g.ea(o.A,o.u,null,c)),Mi(),DE(o.i,o.u,o.A,o.l,o.R,o.m)}wn.prototype.ca=function(o){o=o.target;const c=this.M;c&&en(o)==3?c.j():this.Y(o)},wn.prototype.Y=function(o){try{if(o==this.g)e:{const ze=en(this.g);var c=this.g.Ba();const Br=this.g.Z();if(!(3>ze)&&(ze!=3||this.g&&(this.h.h||this.g.oa()||Tf(this.g)))){this.J||ze!=4||c==7||(c==8||0>=Br?Mi(3):Mi(2)),ru(this);var d=this.g.Z();this.X=d;t:if(nf(this)){var p=Tf(this.g);o="";var R=p.length,O=en(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){ar(this),Ui(this);var j="";break t}this.h.i=new l.TextDecoder}for(c=0;c<R;c++)this.h.h=!0,o+=this.h.i.decode(p[c],{stream:!(O&&c==R-1)});p.length=0,this.h.g+=o,this.C=0,j=this.h.g}else j=this.g.oa();if(this.o=d==200,LE(this.i,this.u,this.A,this.l,this.R,ze,d),this.o){if(this.T&&!this.K){t:{if(this.g){var ie,De=this.g;if((ie=De.g?De.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!y(ie)){var te=ie;break t}}te=null}if(d=te)Fr(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,iu(this,d);else{this.o=!1,this.s=3,Ze(12),ar(this),Ui(this);break e}}if(this.P){d=!0;let Ct;for(;!this.J&&this.C<j.length;)if(Ct=bE(this,j),Ct==tu){ze==4&&(this.s=4,Ze(14),d=!1),Fr(this.i,this.l,null,"[Incomplete Response]");break}else if(Ct==ef){this.s=4,Ze(15),Fr(this.i,this.l,j,"[Invalid Chunk]"),d=!1;break}else Fr(this.i,this.l,Ct,null),iu(this,Ct);if(nf(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ze!=4||j.length!=0||this.h.h||(this.s=1,Ze(16),d=!1),this.o=this.o&&d,!d)Fr(this.i,this.l,j,"[Invalid Chunked Response]"),ar(this),Ui(this);else if(0<j.length&&!this.W){this.W=!0;var Be=this.j;Be.g==this&&Be.ba&&!Be.M&&(Be.j.info("Great, no buffering proxy detected. Bytes received: "+j.length),cu(Be),Be.M=!0,Ze(11))}}else Fr(this.i,this.l,j,null),iu(this,j);ze==4&&ar(this),this.o&&!this.J&&(ze==4?Nf(this.j,this):(this.o=!1,Ao(this)))}else ew(this.g),d==400&&0<j.indexOf("Unknown SID")?(this.s=3,Ze(12)):(this.s=0,Ze(13)),ar(this),Ui(this)}}}catch{}finally{}};function nf(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function bE(o,c){var d=o.C,p=c.indexOf(`
`,d);return p==-1?tu:(d=Number(c.substring(d,p)),isNaN(d)?ef:(p+=1,p+d>c.length?tu:(c=c.slice(p,p+d),o.C=p+d,c)))}wn.prototype.cancel=function(){this.J=!0,ar(this)};function Ao(o){o.S=Date.now()+o.I,rf(o,o.I)}function rf(o,c){if(o.B!=null)throw Error("WatchDog timer not null");o.B=bi(v(o.ba,o),c)}function ru(o){o.B&&(l.clearTimeout(o.B),o.B=null)}wn.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(VE(this.i,this.A),this.L!=2&&(Mi(),Ze(17)),ar(this),this.s=2,Ui(this)):rf(this,this.S-o)};function Ui(o){o.j.G==0||o.J||Nf(o.j,o)}function ar(o){ru(o);var c=o.M;c&&typeof c.ma=="function"&&c.ma(),o.M=null,Wd(o.U),o.g&&(c=o.g,o.g=null,c.abort(),c.ma())}function iu(o,c){try{var d=o.j;if(d.G!=0&&(d.g==o||su(d.h,o))){if(!o.K&&su(d.h,o)&&d.G==3){try{var p=d.Da.g.parse(c)}catch{p=null}if(Array.isArray(p)&&p.length==3){var R=p;if(R[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<o.F)Lo(d),Oo(d);else break e;uu(d),Ze(18)}}else d.za=R[1],0<d.za-d.T&&37500>R[2]&&d.F&&d.v==0&&!d.C&&(d.C=bi(v(d.Za,d),6e3));if(1>=af(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else ur(d,11)}else if((o.K||d.g==o)&&Lo(d),!y(c))for(R=d.Da.g.parse(c),c=0;c<R.length;c++){let te=R[c];if(d.T=te[0],te=te[1],d.G==2)if(te[0]=="c"){d.K=te[1],d.ia=te[2];const Be=te[3];Be!=null&&(d.la=Be,d.j.info("VER="+d.la));const ze=te[4];ze!=null&&(d.Aa=ze,d.j.info("SVER="+d.Aa));const Br=te[5];Br!=null&&typeof Br=="number"&&0<Br&&(p=1.5*Br,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const Ct=o.g;if(Ct){const Mo=Ct.g?Ct.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Mo){var O=p.h;O.g||Mo.indexOf("spdy")==-1&&Mo.indexOf("quic")==-1&&Mo.indexOf("h2")==-1||(O.j=O.l,O.g=new Set,O.h&&(ou(O,O.h),O.h=null))}if(p.D){const hu=Ct.g?Ct.g.getResponseHeader("X-HTTP-Session-Id"):null;hu&&(p.ya=hu,le(p.I,p.D,hu))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-o.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var j=o;if(p.qa=Df(p,p.J?p.ia:null,p.W),j.K){lf(p.h,j);var ie=j,De=p.L;De&&(ie.I=De),ie.B&&(ru(ie),Ao(ie)),p.g=j}else Rf(p);0<d.i.length&&Do(d)}else te[0]!="stop"&&te[0]!="close"||ur(d,7);else d.G==3&&(te[0]=="stop"||te[0]=="close"?te[0]=="stop"?ur(d,7):lu(d):te[0]!="noop"&&d.l&&d.l.ta(te),d.v=0)}}Mi(4)}catch{}}var FE=class{constructor(o,c){this.g=o,this.map=c}};function sf(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function of(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function af(o){return o.h?1:o.g?o.g.size:0}function su(o,c){return o.h?o.h==c:o.g?o.g.has(c):!1}function ou(o,c){o.g?o.g.add(c):o.h=c}function lf(o,c){o.h&&o.h==c?o.h=null:o.g&&o.g.has(c)&&o.g.delete(c)}sf.prototype.cancel=function(){if(this.i=uf(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function uf(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let c=o.i;for(const d of o.g.values())c=c.concat(d.D);return c}return x(o.i)}function UE(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(u(o)){for(var c=[],d=o.length,p=0;p<d;p++)c.push(o[p]);return c}c=[],d=0;for(p in o)c[d++]=o[p];return c}function jE(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(u(o)||typeof o=="string"){var c=[];o=o.length;for(var d=0;d<o;d++)c.push(d);return c}c=[],d=0;for(const p in o)c[d++]=p;return c}}}function cf(o,c){if(o.forEach&&typeof o.forEach=="function")o.forEach(c,void 0);else if(u(o)||typeof o=="string")Array.prototype.forEach.call(o,c,void 0);else for(var d=jE(o),p=UE(o),R=p.length,O=0;O<R;O++)c.call(void 0,p[O],d&&d[O],o)}var hf=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function BE(o,c){if(o){o=o.split("&");for(var d=0;d<o.length;d++){var p=o[d].indexOf("="),R=null;if(0<=p){var O=o[d].substring(0,p);R=o[d].substring(p+1)}else O=o[d];c(O,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function lr(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof lr){this.h=o.h,Co(this,o.j),this.o=o.o,this.g=o.g,Po(this,o.s),this.l=o.l;var c=o.i,d=new zi;d.i=c.i,c.g&&(d.g=new Map(c.g),d.h=c.h),df(this,d),this.m=o.m}else o&&(c=String(o).match(hf))?(this.h=!1,Co(this,c[1]||"",!0),this.o=ji(c[2]||""),this.g=ji(c[3]||"",!0),Po(this,c[4]),this.l=ji(c[5]||"",!0),df(this,c[6]||"",!0),this.m=ji(c[7]||"")):(this.h=!1,this.i=new zi(null,this.h))}lr.prototype.toString=function(){var o=[],c=this.j;c&&o.push(Bi(c,ff,!0),":");var d=this.g;return(d||c=="file")&&(o.push("//"),(c=this.o)&&o.push(Bi(c,ff,!0),"@"),o.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&o.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&o.push("/"),o.push(Bi(d,d.charAt(0)=="/"?HE:$E,!0))),(d=this.i.toString())&&o.push("?",d),(d=this.m)&&o.push("#",Bi(d,KE)),o.join("")};function Zt(o){return new lr(o)}function Co(o,c,d){o.j=d?ji(c,!0):c,o.j&&(o.j=o.j.replace(/:$/,""))}function Po(o,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);o.s=c}else o.s=null}function df(o,c,d){c instanceof zi?(o.i=c,qE(o.i,o.h)):(d||(c=Bi(c,WE)),o.i=new zi(c,o.h))}function le(o,c,d){o.i.set(c,d)}function Ro(o){return le(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function ji(o,c){return o?c?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Bi(o,c,d){return typeof o=="string"?(o=encodeURI(o).replace(c,zE),d&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function zE(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var ff=/[#\/\?@]/g,$E=/[#\?:]/g,HE=/[#\?]/g,WE=/[#\?@]/g,KE=/#/g;function zi(o,c){this.h=this.g=null,this.i=o||null,this.j=!!c}function In(o){o.g||(o.g=new Map,o.h=0,o.i&&BE(o.i,function(c,d){o.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}t=zi.prototype,t.add=function(o,c){In(this),this.i=null,o=Ur(this,o);var d=this.g.get(o);return d||this.g.set(o,d=[]),d.push(c),this.h+=1,this};function pf(o,c){In(o),c=Ur(o,c),o.g.has(c)&&(o.i=null,o.h-=o.g.get(c).length,o.g.delete(c))}function mf(o,c){return In(o),c=Ur(o,c),o.g.has(c)}t.forEach=function(o,c){In(this),this.g.forEach(function(d,p){d.forEach(function(R){o.call(c,R,p,this)},this)},this)},t.na=function(){In(this);const o=Array.from(this.g.values()),c=Array.from(this.g.keys()),d=[];for(let p=0;p<c.length;p++){const R=o[p];for(let O=0;O<R.length;O++)d.push(c[p])}return d},t.V=function(o){In(this);let c=[];if(typeof o=="string")mf(this,o)&&(c=c.concat(this.g.get(Ur(this,o))));else{o=Array.from(this.g.values());for(let d=0;d<o.length;d++)c=c.concat(o[d])}return c},t.set=function(o,c){return In(this),this.i=null,o=Ur(this,o),mf(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[c]),this.h+=1,this},t.get=function(o,c){return o?(o=this.V(o),0<o.length?String(o[0]):c):c};function gf(o,c,d){pf(o,c),0<d.length&&(o.i=null,o.g.set(Ur(o,c),x(d)),o.h+=d.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],c=Array.from(this.g.keys());for(var d=0;d<c.length;d++){var p=c[d];const O=encodeURIComponent(String(p)),j=this.V(p);for(p=0;p<j.length;p++){var R=O;j[p]!==""&&(R+="="+encodeURIComponent(String(j[p]))),o.push(R)}}return this.i=o.join("&")};function Ur(o,c){return c=String(c),o.j&&(c=c.toLowerCase()),c}function qE(o,c){c&&!o.j&&(In(o),o.i=null,o.g.forEach(function(d,p){var R=p.toLowerCase();p!=R&&(pf(this,p),gf(this,R,d))},o)),o.j=c}function GE(o,c){const d=new Fi;if(l.Image){const p=new Image;p.onload=S(Tn,d,"TestLoadImage: loaded",!0,c,p),p.onerror=S(Tn,d,"TestLoadImage: error",!1,c,p),p.onabort=S(Tn,d,"TestLoadImage: abort",!1,c,p),p.ontimeout=S(Tn,d,"TestLoadImage: timeout",!1,c,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else c(!1)}function QE(o,c){const d=new Fi,p=new AbortController,R=setTimeout(()=>{p.abort(),Tn(d,"TestPingServer: timeout",!1,c)},1e4);fetch(o,{signal:p.signal}).then(O=>{clearTimeout(R),O.ok?Tn(d,"TestPingServer: ok",!0,c):Tn(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(R),Tn(d,"TestPingServer: error",!1,c)})}function Tn(o,c,d,p,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),p(d)}catch{}}function XE(){this.g=new OE}function YE(o,c,d){const p=d||"";try{cf(o,function(R,O){let j=R;h(R)&&(j=Xl(R)),c.push(p+O+"="+encodeURIComponent(j))})}catch(R){throw c.push(p+"type="+encodeURIComponent("_badmap")),R}}function ko(o){this.l=o.Ub||null,this.j=o.eb||!1}P(ko,Yl),ko.prototype.g=function(){return new No(this.l,this.j)},ko.prototype.i=function(o){return function(){return o}}({});function No(o,c){je.call(this),this.D=o,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}P(No,je),t=No.prototype,t.open=function(o,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=c,this.readyState=1,Hi(this)},t.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(c.body=o),(this.D||l).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,$i(this)),this.readyState=0},t.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,Hi(this)),this.g&&(this.readyState=3,Hi(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;vf(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function vf(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}t.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var c=o.value?o.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!o.done}))&&(this.response=this.responseText+=c)}o.done?$i(this):Hi(this),this.readyState==3&&vf(this)}},t.Ra=function(o){this.g&&(this.response=this.responseText=o,$i(this))},t.Qa=function(o){this.g&&(this.response=o,$i(this))},t.ga=function(){this.g&&$i(this)};function $i(o){o.readyState=4,o.l=null,o.j=null,o.v=null,Hi(o)}t.setRequestHeader=function(o,c){this.u.append(o,c)},t.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,o.push(d[0]+": "+d[1]),d=c.next();return o.join(`\r
`)};function Hi(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(No.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function yf(o){let c="";return U(o,function(d,p){c+=p,c+=":",c+=d,c+=`\r
`}),c}function au(o,c,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=yf(d),typeof o=="string"?d!=null&&encodeURIComponent(String(d)):le(o,c,d))}function ve(o){je.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}P(ve,je);var JE=/^https?$/i,ZE=["POST","PUT"];t=ve.prototype,t.Ha=function(o){this.J=o},t.ea=function(o,c,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);c=c?c.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():eu.g(),this.v=this.o?Kd(this.o):Kd(eu),this.g.onreadystatechange=v(this.Ea,this);try{this.B=!0,this.g.open(c,String(o),!0),this.B=!1}catch(O){_f(this,O);return}if(o=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var R in p)d.set(R,p[R]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const O of p.keys())d.set(O,p.get(O));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(O=>O.toLowerCase()=="content-type"),R=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(ZE,c,void 0))||p||R||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[O,j]of d)this.g.setRequestHeader(O,j);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{If(this),this.u=!0,this.g.send(o),this.u=!1}catch(O){_f(this,O)}};function _f(o,c){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=c,o.m=5,Ef(o),xo(o)}function Ef(o){o.A||(o.A=!0,Je(o,"complete"),Je(o,"error"))}t.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Je(this,"complete"),Je(this,"abort"),xo(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),xo(this,!0)),ve.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?wf(this):this.bb())},t.bb=function(){wf(this)};function wf(o){if(o.h&&typeof a<"u"&&(!o.v[1]||en(o)!=4||o.Z()!=2)){if(o.u&&en(o)==4)zd(o.Ea,0,o);else if(Je(o,"readystatechange"),en(o)==4){o.h=!1;try{const j=o.Z();e:switch(j){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var p;if(p=j===0){var R=String(o.D).match(hf)[1]||null;!R&&l.self&&l.self.location&&(R=l.self.location.protocol.slice(0,-1)),p=!JE.test(R?R.toLowerCase():"")}d=p}if(d)Je(o,"complete"),Je(o,"success");else{o.m=6;try{var O=2<en(o)?o.g.statusText:""}catch{O=""}o.l=O+" ["+o.Z()+"]",Ef(o)}}finally{xo(o)}}}}function xo(o,c){if(o.g){If(o);const d=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,c||Je(o,"ready");try{d.onreadystatechange=p}catch{}}}function If(o){o.I&&(l.clearTimeout(o.I),o.I=null)}t.isActive=function(){return!!this.g};function en(o){return o.g?o.g.readyState:0}t.Z=function(){try{return 2<en(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(o){if(this.g){var c=this.g.responseText;return o&&c.indexOf(o)==0&&(c=c.substring(o.length)),xE(c)}};function Tf(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function ew(o){const c={};o=(o.g&&2<=en(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(y(o[p]))continue;var d=C(o[p]);const R=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const O=c[R]||[];c[R]=O,O.push(d)}E(c,function(p){return p.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Wi(o,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[o]||c}function Sf(o){this.Aa=0,this.i=[],this.j=new Fi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Wi("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Wi("baseRetryDelayMs",5e3,o),this.cb=Wi("retryDelaySeedMs",1e4,o),this.Wa=Wi("forwardChannelMaxRetries",2,o),this.wa=Wi("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new sf(o&&o.concurrentRequestLimit),this.Da=new XE,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Sf.prototype,t.la=8,t.G=1,t.connect=function(o,c,d,p){Ze(0),this.W=o,this.H=c||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=Df(this,null,this.W),Do(this)};function lu(o){if(Af(o),o.G==3){var c=o.U++,d=Zt(o.I);if(le(d,"SID",o.K),le(d,"RID",c),le(d,"TYPE","terminate"),Ki(o,d),c=new wn(o,o.j,c),c.L=2,c.v=Ro(Zt(d)),d=!1,l.navigator&&l.navigator.sendBeacon)try{d=l.navigator.sendBeacon(c.v.toString(),"")}catch{}!d&&l.Image&&(new Image().src=c.v,d=!0),d||(c.g=Lf(c.j,null),c.g.ea(c.v)),c.F=Date.now(),Ao(c)}Of(o)}function Oo(o){o.g&&(cu(o),o.g.cancel(),o.g=null)}function Af(o){Oo(o),o.u&&(l.clearTimeout(o.u),o.u=null),Lo(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Do(o){if(!of(o.h)&&!o.s){o.s=!0;var c=o.Ga;Gt||G(),B||(Gt(),B=!0),q.add(c,o),o.B=0}}function tw(o,c){return af(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=c.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=bi(v(o.Ga,o,c),xf(o,o.B)),o.B++,!0)}t.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const R=new wn(this,this.j,o);let O=this.o;if(this.S&&(O?(O=g(O),I(O,this.S)):O=this.S),this.m!==null||this.O||(R.H=O,O=null),this.P)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(c+=p,4096<c){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=Pf(this,R,c),d=Zt(this.I),le(d,"RID",o),le(d,"CVER",22),this.D&&le(d,"X-HTTP-Session-Id",this.D),Ki(this,d),O&&(this.O?c="headers="+encodeURIComponent(String(yf(O)))+"&"+c:this.m&&au(d,this.m,O)),ou(this.h,R),this.Ua&&le(d,"TYPE","init"),this.P?(le(d,"$req",c),le(d,"SID","null"),R.T=!0,nu(R,d,null)):nu(R,d,c),this.G=2}}else this.G==3&&(o?Cf(this,o):this.i.length==0||of(this.h)||Cf(this))};function Cf(o,c){var d;c?d=c.l:d=o.U++;const p=Zt(o.I);le(p,"SID",o.K),le(p,"RID",d),le(p,"AID",o.T),Ki(o,p),o.m&&o.o&&au(p,o.m,o.o),d=new wn(o,o.j,d,o.B+1),o.m===null&&(d.H=o.o),c&&(o.i=c.D.concat(o.i)),c=Pf(o,d,1e3),d.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),ou(o.h,d),nu(d,p,c)}function Ki(o,c){o.H&&U(o.H,function(d,p){le(c,p,d)}),o.l&&cf({},function(d,p){le(c,p,d)})}function Pf(o,c,d){d=Math.min(o.i.length,d);var p=o.l?v(o.l.Na,o.l,o):null;e:{var R=o.i;let O=-1;for(;;){const j=["count="+d];O==-1?0<d?(O=R[0].g,j.push("ofs="+O)):O=0:j.push("ofs="+O);let ie=!0;for(let De=0;De<d;De++){let te=R[De].g;const Be=R[De].map;if(te-=O,0>te)O=Math.max(0,R[De].g-100),ie=!1;else try{YE(Be,j,"req"+te+"_")}catch{p&&p(Be)}}if(ie){p=j.join("&");break e}}}return o=o.i.splice(0,d),c.D=o,p}function Rf(o){if(!o.g&&!o.u){o.Y=1;var c=o.Fa;Gt||G(),B||(Gt(),B=!0),q.add(c,o),o.v=0}}function uu(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=bi(v(o.Fa,o),xf(o,o.v)),o.v++,!0)}t.Fa=function(){if(this.u=null,kf(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=bi(v(this.ab,this),o)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ze(10),Oo(this),kf(this))};function cu(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function kf(o){o.g=new wn(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var c=Zt(o.qa);le(c,"RID","rpc"),le(c,"SID",o.K),le(c,"AID",o.T),le(c,"CI",o.F?"0":"1"),!o.F&&o.ja&&le(c,"TO",o.ja),le(c,"TYPE","xmlhttp"),Ki(o,c),o.m&&o.o&&au(c,o.m,o.o),o.L&&(o.g.I=o.L);var d=o.g;o=o.ia,d.L=1,d.v=Ro(Zt(c)),d.m=null,d.P=!0,tf(d,o)}t.Za=function(){this.C!=null&&(this.C=null,Oo(this),uu(this),Ze(19))};function Lo(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Nf(o,c){var d=null;if(o.g==c){Lo(o),cu(o),o.g=null;var p=2}else if(su(o.h,c))d=c.D,lf(o.h,c),p=1;else return;if(o.G!=0){if(c.o)if(p==1){d=c.m?c.m.length:0,c=Date.now()-c.F;var R=o.B;p=Io(),Je(p,new Yd(p,d)),Do(o)}else Rf(o);else if(R=c.s,R==3||R==0&&0<c.X||!(p==1&&tw(o,c)||p==2&&uu(o)))switch(d&&0<d.length&&(c=o.h,c.i=c.i.concat(d)),R){case 1:ur(o,5);break;case 4:ur(o,10);break;case 3:ur(o,6);break;default:ur(o,2)}}}function xf(o,c){let d=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(d*=2),d*c}function ur(o,c){if(o.j.info("Error code "+c),c==2){var d=v(o.fb,o),p=o.Xa;const R=!p;p=new lr(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Co(p,"https"),Ro(p),R?GE(p.toString(),d):QE(p.toString(),d)}else Ze(2);o.G=0,o.l&&o.l.sa(c),Of(o),Af(o)}t.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Ze(2)):(this.j.info("Failed to ping google.com"),Ze(1))};function Of(o){if(o.G=0,o.ka=[],o.l){const c=uf(o.h);(c.length!=0||o.i.length!=0)&&(D(o.ka,c),D(o.ka,o.i),o.h.i.length=0,x(o.i),o.i.length=0),o.l.ra()}}function Df(o,c,d){var p=d instanceof lr?Zt(d):new lr(d);if(p.g!="")c&&(p.g=c+"."+p.g),Po(p,p.s);else{var R=l.location;p=R.protocol,c=c?c+"."+R.hostname:R.hostname,R=+R.port;var O=new lr(null);p&&Co(O,p),c&&(O.g=c),R&&Po(O,R),d&&(O.l=d),p=O}return d=o.D,c=o.ya,d&&c&&le(p,d,c),le(p,"VER",o.la),Ki(o,p),p}function Lf(o,c,d){if(c&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=o.Ca&&!o.pa?new ve(new ko({eb:d})):new ve(o.pa),c.Ha(o.J),c}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Vf(){}t=Vf.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function Vo(){}Vo.prototype.g=function(o,c){return new ht(o,c)};function ht(o,c){je.call(this),this.g=new Sf(c),this.l=o,this.h=c&&c.messageUrlParams||null,o=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(o?o["X-WebChannel-Content-Type"]=c.messageContentType:o={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(o?o["X-WebChannel-Client-Profile"]=c.va:o={"X-WebChannel-Client-Profile":c.va}),this.g.S=o,(o=c&&c.Sb)&&!y(o)&&(this.g.m=o),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!y(c)&&(this.g.D=c,o=this.h,o!==null&&c in o&&(o=this.h,c in o&&delete o[c])),this.j=new jr(this)}P(ht,je),ht.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ht.prototype.close=function(){lu(this.g)},ht.prototype.o=function(o){var c=this.g;if(typeof o=="string"){var d={};d.__data__=o,o=d}else this.u&&(d={},d.__data__=Xl(o),o=d);c.i.push(new FE(c.Ya++,o)),c.G==3&&Do(c)},ht.prototype.N=function(){this.g.l=null,delete this.j,lu(this.g),delete this.g,ht.aa.N.call(this)};function Mf(o){Jl.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var c=o.__sm__;if(c){e:{for(const d in c){o=d;break e}o=void 0}(this.i=o)&&(o=this.i,c=c!==null&&o in c?c[o]:void 0),this.data=c}else this.data=o}P(Mf,Jl);function bf(){Zl.call(this),this.status=1}P(bf,Zl);function jr(o){this.g=o}P(jr,Vf),jr.prototype.ua=function(){Je(this.g,"a")},jr.prototype.ta=function(o){Je(this.g,new Mf(o))},jr.prototype.sa=function(o){Je(this.g,new bf)},jr.prototype.ra=function(){Je(this.g,"b")},Vo.prototype.createWebChannel=Vo.prototype.g,ht.prototype.send=ht.prototype.o,ht.prototype.open=ht.prototype.m,ht.prototype.close=ht.prototype.close,k_=function(){return new Vo},R_=function(){return Io()},P_=or,Zc={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},To.NO_ERROR=0,To.TIMEOUT=8,To.HTTP_ERROR=6,Ia=To,Jd.COMPLETE="complete",C_=Jd,qd.EventType=Vi,Vi.OPEN="a",Vi.CLOSE="b",Vi.ERROR="c",Vi.MESSAGE="d",je.prototype.listen=je.prototype.K,cs=qd,ve.prototype.listenOnce=ve.prototype.L,ve.prototype.getLastError=ve.prototype.Ka,ve.prototype.getLastErrorCode=ve.prototype.Ba,ve.prototype.getStatus=ve.prototype.Z,ve.prototype.getResponseJson=ve.prototype.Oa,ve.prototype.getResponseText=ve.prototype.oa,ve.prototype.send=ve.prototype.ea,ve.prototype.setWithCredentials=ve.prototype.Ha,A_=ve}).apply(typeof ta<"u"?ta:typeof self<"u"?self:typeof window<"u"?window:{});const Dm="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ke.UNAUTHENTICATED=new Ke(null),Ke.GOOGLE_CREDENTIALS=new Ke("google-credentials-uid"),Ke.FIRST_PARTY=new Ke("first-party-uid"),Ke.MOCK_USER=new Ke("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xi="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xr=new od("@firebase/firestore");function ts(){return xr.logLevel}function H(t,...e){if(xr.logLevel<=Y.DEBUG){const n=e.map(Ed);xr.debug(`Firestore (${xi}): ${t}`,...n)}}function Or(t,...e){if(xr.logLevel<=Y.ERROR){const n=e.map(Ed);xr.error(`Firestore (${xi}): ${t}`,...n)}}function rl(t,...e){if(xr.logLevel<=Y.WARN){const n=e.map(Ed);xr.warn(`Firestore (${xi}): ${t}`,...n)}}function Ed(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J(t="Unexpected state"){const e=`FIRESTORE (${xi}) INTERNAL ASSERTION FAILED: `+t;throw Or(e),new Error(e)}function Ie(t,e){t||J()}function ae(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class K extends En{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wr{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class wP{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Ke.UNAUTHENTICATED))}shutdown(){}}class IP{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class TP{constructor(e){this.t=e,this.currentUser=Ke.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Ie(this.o===void 0);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new wr;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new wr,e.enqueueRetryable(()=>i(this.currentUser))};const a=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},l=u=>{H("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(H("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new wr)}},0),a()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(H("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Ie(typeof r.accessToken=="string"),new N_(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ie(e===null||typeof e=="string"),new Ke(e)}}class SP{constructor(e,n,r){this.l=e,this.h=n,this.P=r,this.type="FirstParty",this.user=Ke.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class AP{constructor(e,n,r){this.l=e,this.h=n,this.P=r}getToken(){return Promise.resolve(new SP(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(Ke.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class CP{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class PP{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){Ie(this.o===void 0);const r=s=>{s.error!=null&&H("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const a=s.token!==this.R;return this.R=s.token,H("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{H("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):H("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Ie(typeof n.token=="string"),this.R=n.token,new CP(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RP(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x_{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=RP(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%e.length))}return r}}function se(t,e){return t<e?-1:t>e?1:0}function Ei(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new K(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new K(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new K(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new K(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Oe.fromMillis(Date.now())}static fromDate(e){return Oe.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new Oe(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?se(this.nanoseconds,e.nanoseconds):se(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e){this.timestamp=e}static fromTimestamp(e){return new fe(e)}static min(){return new fe(new Oe(0,0))}static max(){return new fe(new Oe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e,n,r){n===void 0?n=0:n>e.length&&J(),r===void 0?r=e.length-n:r>e.length-n&&J(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return qs.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof qs?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=e.get(i),a=n.get(i);if(s<a)return-1;if(s>a)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class _e extends qs{construct(e,n,r){return new _e(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new K(b.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new _e(n)}static emptyPath(){return new _e([])}}const kP=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class be extends qs{construct(e,n,r){return new be(e,n,r)}static isValidIdentifier(e){return kP.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),be.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new be(["__name__"])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new K(b.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let a=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new K(b.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new K(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else l==="`"?(a=!a,i++):l!=="."||a?(r+=l,i++):(s(),i++)}if(s(),a)throw new K(b.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new be(n)}static emptyPath(){return new be([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e){this.path=e}static fromPath(e){return new Q(_e.fromString(e))}static fromName(e){return new Q(_e.fromString(e).popFirst(5))}static empty(){return new Q(_e.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&_e.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return _e.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Q(new _e(e.slice()))}}function NP(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=fe.fromTimestamp(r===1e9?new Oe(n+1,0):new Oe(n,r));return new Xn(i,Q.empty(),e)}function xP(t){return new Xn(t.readTime,t.key,-1)}class Xn{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Xn(fe.min(),Q.empty(),-1)}static max(){return new Xn(fe.max(),Q.empty(),-1)}}function OP(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=Q.comparator(t.documentKey,e.documentKey),n!==0?n:se(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DP="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class LP{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function O_(t){if(t.code!==b.FAILED_PRECONDITION||t.message!==DP)throw t;H("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&J(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new V((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof V?n:V.resolve(n)}catch(n){return V.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):V.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):V.reject(n)}static resolve(e){return new V((n,r)=>{n(e)})}static reject(e){return new V((n,r)=>{r(e)})}static waitFor(e){return new V((n,r)=>{let i=0,s=0,a=!1;e.forEach(l=>{++i,l.next(()=>{++s,a&&s===i&&n()},u=>r(u))}),a=!0,s===i&&n()})}static or(e){let n=V.resolve(!1);for(const r of e)n=n.next(i=>i?V.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new V((r,i)=>{const s=e.length,a=new Array(s);let l=0;for(let u=0;u<s;u++){const h=u;n(e[h]).next(f=>{a[h]=f,++l,l===s&&r(a)},f=>i(f))}})}static doWhile(e,n){return new V((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}function VP(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Ll(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D_{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ie(r),this.se=r=>n.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}D_.oe=-1;function wd(t){return t==null}function il(t){return t===0&&1/t==-1/0}function MP(t){return typeof t=="number"&&Number.isInteger(t)&&!il(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lm(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function po(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function L_(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e,n){this.comparator=e,this.root=n||Ve.EMPTY}insert(e,n){return new ct(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Ve.BLACK,null,null))}remove(e){return new ct(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ve.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new na(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new na(this.root,e,this.comparator,!1)}getReverseIterator(){return new na(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new na(this.root,e,this.comparator,!0)}}class na{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ve{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??Ve.RED,this.left=i??Ve.EMPTY,this.right=s??Ve.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new Ve(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Ve.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return Ve.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ve.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ve.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw J();const e=this.left.check();if(e!==this.right.check())throw J();return e+(this.isRed()?0:1)}}Ve.EMPTY=null,Ve.RED=!0,Ve.BLACK=!1;Ve.EMPTY=new class{constructor(){this.size=0}get key(){throw J()}get value(){throw J()}get color(){throw J()}get left(){throw J()}get right(){throw J()}copy(e,n,r,i,s){return this}insert(e,n,r){return new Ve(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e){this.comparator=e,this.data=new ct(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Vm(this.data.getIterator())}getIteratorFrom(e){return new Vm(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof Qe)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Qe(this.comparator);return n.data=e,n}}class Vm{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e){this.fields=e,e.sort(be.comparator)}static empty(){return new Lt([])}unionWith(e){let n=new Qe(be.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Lt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Ei(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bP extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new bP("Invalid base64 string: "+s):s}}(e);return new Kt(n)}static fromUint8Array(e){const n=function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s}(e);return new Kt(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return se(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Kt.EMPTY_BYTE_STRING=new Kt("");const FP=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Dr(t){if(Ie(!!t),typeof t=="string"){let e=0;const n=FP.exec(t);if(Ie(!!n),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Me(t.seconds),nanos:Me(t.nanos)}}function Me(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Gs(t){return typeof t=="string"?Kt.fromBase64String(t):Kt.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Id(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function V_(t){const e=t.mapValue.fields.__previous_value__;return Id(e)?V_(e):e}function sl(t){const e=Dr(t.mapValue.fields.__local_write_time__.timestampValue);return new Oe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UP{constructor(e,n,r,i,s,a,l,u,h){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h}}class ol{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new ol("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof ol&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ra={mapValue:{}};function wi(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Id(t)?4:BP(t)?9007199254740991:jP(t)?10:11:J()}function qt(t,e){if(t===e)return!0;const n=wi(t);if(n!==wi(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return sl(t).isEqual(sl(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const a=Dr(i.timestampValue),l=Dr(s.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Gs(i.bytesValue).isEqual(Gs(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Me(i.geoPointValue.latitude)===Me(s.geoPointValue.latitude)&&Me(i.geoPointValue.longitude)===Me(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Me(i.integerValue)===Me(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const a=Me(i.doubleValue),l=Me(s.doubleValue);return a===l?il(a)===il(l):isNaN(a)&&isNaN(l)}return!1}(t,e);case 9:return Ei(t.arrayValue.values||[],e.arrayValue.values||[],qt);case 10:case 11:return function(i,s){const a=i.mapValue.fields||{},l=s.mapValue.fields||{};if(Lm(a)!==Lm(l))return!1;for(const u in a)if(a.hasOwnProperty(u)&&(l[u]===void 0||!qt(a[u],l[u])))return!1;return!0}(t,e);default:return J()}}function Qs(t,e){return(t.values||[]).find(n=>qt(n,e))!==void 0}function Ii(t,e){if(t===e)return 0;const n=wi(t),r=wi(e);if(n!==r)return se(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return se(t.booleanValue,e.booleanValue);case 2:return function(s,a){const l=Me(s.integerValue||s.doubleValue),u=Me(a.integerValue||a.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return Mm(t.timestampValue,e.timestampValue);case 4:return Mm(sl(t),sl(e));case 5:return se(t.stringValue,e.stringValue);case 6:return function(s,a){const l=Gs(s),u=Gs(a);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,a){const l=s.split("/"),u=a.split("/");for(let h=0;h<l.length&&h<u.length;h++){const f=se(l[h],u[h]);if(f!==0)return f}return se(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,a){const l=se(Me(s.latitude),Me(a.latitude));return l!==0?l:se(Me(s.longitude),Me(a.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return bm(t.arrayValue,e.arrayValue);case 10:return function(s,a){var l,u,h,f;const m=s.fields||{},v=a.fields||{},S=(l=m.value)===null||l===void 0?void 0:l.arrayValue,P=(u=v.value)===null||u===void 0?void 0:u.arrayValue,x=se(((h=S==null?void 0:S.values)===null||h===void 0?void 0:h.length)||0,((f=P==null?void 0:P.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:bm(S,P)}(t.mapValue,e.mapValue);case 11:return function(s,a){if(s===ra.mapValue&&a===ra.mapValue)return 0;if(s===ra.mapValue)return 1;if(a===ra.mapValue)return-1;const l=s.fields||{},u=Object.keys(l),h=a.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let m=0;m<u.length&&m<f.length;++m){const v=se(u[m],f[m]);if(v!==0)return v;const S=Ii(l[u[m]],h[f[m]]);if(S!==0)return S}return se(u.length,f.length)}(t.mapValue,e.mapValue);default:throw J()}}function Mm(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return se(t,e);const n=Dr(t),r=Dr(e),i=se(n.seconds,r.seconds);return i!==0?i:se(n.nanos,r.nanos)}function bm(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=Ii(n[i],r[i]);if(s)return s}return se(n.length,r.length)}function Ti(t){return eh(t)}function eh(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=Dr(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Gs(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return Q.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=eh(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const a of r)s?s=!1:i+=",",i+=`${a}:${eh(n.fields[a])}`;return i+"}"}(t.mapValue):J()}function th(t){return!!t&&"integerValue"in t}function Td(t){return!!t&&"arrayValue"in t}function Ta(t){return!!t&&"mapValue"in t}function jP(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function ws(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return po(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=ws(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=ws(t.arrayValue.values[n]);return e}return Object.assign({},t)}function BP(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e){this.value=e}static empty(){return new Ot({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Ta(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=ws(n)}setAll(e){let n=be.emptyPath(),r={},i=[];e.forEach((a,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=l.popLast()}a?r[l.lastSegment()]=ws(a):i.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());Ta(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return qt(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];Ta(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){po(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new Ot(ws(this.value))}}function M_(t){const e=[];return po(t.fields,(n,r)=>{const i=new be([n]);if(Ta(r)){const s=M_(r.mapValue).fields;if(s.length===0)e.push(i);else for(const a of s)e.push(i.child(a))}else e.push(i)}),new Lt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(e,n,r,i,s,a,l){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=a,this.documentState=l}static newInvalidDocument(e){return new xt(e,0,fe.min(),fe.min(),fe.min(),Ot.empty(),0)}static newFoundDocument(e,n,r,i){return new xt(e,1,n,fe.min(),r,i,0)}static newNoDocument(e,n){return new xt(e,2,n,fe.min(),fe.min(),Ot.empty(),0)}static newUnknownDocument(e,n){return new xt(e,3,n,fe.min(),fe.min(),Ot.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(fe.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ot.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ot.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=fe.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof xt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new xt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(e,n){this.position=e,this.inclusive=n}}function Fm(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],a=t.position[i];if(s.field.isKeyField()?r=Q.comparator(Q.fromName(a.referenceValue),n.key):r=Ii(a,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Um(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!qt(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll{constructor(e,n="asc"){this.field=e,this.dir=n}}function zP(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b_{}class Ne extends b_{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new HP(e,n,r):n==="array-contains"?new qP(e,r):n==="in"?new GP(e,r):n==="not-in"?new QP(e,r):n==="array-contains-any"?new XP(e,r):new Ne(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new WP(e,r):new KP(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Ii(n,this.value)):n!==null&&wi(this.value)===wi(n)&&this.matchesComparison(Ii(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return J()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Yn extends b_{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new Yn(e,n)}matches(e){return F_(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function F_(t){return t.op==="and"}function U_(t){return $P(t)&&F_(t)}function $P(t){for(const e of t.filters)if(e instanceof Yn)return!1;return!0}function nh(t){if(t instanceof Ne)return t.field.canonicalString()+t.op.toString()+Ti(t.value);if(U_(t))return t.filters.map(e=>nh(e)).join(",");{const e=t.filters.map(n=>nh(n)).join(",");return`${t.op}(${e})`}}function j_(t,e){return t instanceof Ne?function(r,i){return i instanceof Ne&&r.op===i.op&&r.field.isEqual(i.field)&&qt(r.value,i.value)}(t,e):t instanceof Yn?function(r,i){return i instanceof Yn&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,a,l)=>s&&j_(a,i.filters[l]),!0):!1}(t,e):void J()}function B_(t){return t instanceof Ne?function(n){return`${n.field.canonicalString()} ${n.op} ${Ti(n.value)}`}(t):t instanceof Yn?function(n){return n.op.toString()+" {"+n.getFilters().map(B_).join(" ,")+"}"}(t):"Filter"}class HP extends Ne{constructor(e,n,r){super(e,n,r),this.key=Q.fromName(r.referenceValue)}matches(e){const n=Q.comparator(e.key,this.key);return this.matchesComparison(n)}}class WP extends Ne{constructor(e,n){super(e,"in",n),this.keys=z_("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class KP extends Ne{constructor(e,n){super(e,"not-in",n),this.keys=z_("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function z_(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>Q.fromName(r.referenceValue))}class qP extends Ne{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Td(n)&&Qs(n.arrayValue,this.value)}}class GP extends Ne{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Qs(this.value.arrayValue,n)}}class QP extends Ne{constructor(e,n){super(e,"not-in",n)}matches(e){if(Qs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Qs(this.value.arrayValue,n)}}class XP extends Ne{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Td(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>Qs(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YP{constructor(e,n=null,r=[],i=[],s=null,a=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=a,this.endAt=l,this.ue=null}}function jm(t,e=null,n=[],r=[],i=null,s=null,a=null){return new YP(t,e,n,r,i,s,a)}function Sd(t){const e=ae(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>nh(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),wd(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>Ti(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>Ti(r)).join(",")),e.ue=n}return e.ue}function Ad(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!zP(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!j_(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Um(t.startAt,e.startAt)&&Um(t.endAt,e.endAt)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl{constructor(e,n=null,r=[],i=[],s=null,a="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=a,this.startAt=l,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function JP(t,e,n,r,i,s,a,l){return new Vl(t,e,n,r,i,s,a,l)}function ZP(t){return new Vl(t)}function Bm(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function eR(t){return t.collectionGroup!==null}function Is(t){const e=ae(t);if(e.ce===null){e.ce=[];const n=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new Qe(be.comparator);return a.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.ce.push(new ll(s,r))}),n.has(be.keyField().canonicalString())||e.ce.push(new ll(be.keyField(),r))}return e.ce}function Ir(t){const e=ae(t);return e.le||(e.le=tR(e,Is(t))),e.le}function tR(t,e){if(t.limitType==="F")return jm(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new ll(i.field,s)});const n=t.endAt?new al(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new al(t.startAt.position,t.startAt.inclusive):null;return jm(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function rh(t,e,n){return new Vl(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function $_(t,e){return Ad(Ir(t),Ir(e))&&t.limitType===e.limitType}function H_(t){return`${Sd(Ir(t))}|lt:${t.limitType}`}function ns(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>B_(i)).join(", ")}]`),wd(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>Ti(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>Ti(i)).join(",")),`Target(${r})`}(Ir(t))}; limitType=${t.limitType})`}function Cd(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):Q.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of Is(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(a,l,u){const h=Fm(a,l,u);return a.inclusive?h<=0:h<0}(r.startAt,Is(r),i)||r.endAt&&!function(a,l,u){const h=Fm(a,l,u);return a.inclusive?h>=0:h>0}(r.endAt,Is(r),i))}(t,e)}function nR(t){return(e,n)=>{let r=!1;for(const i of Is(t)){const s=rR(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function rR(t,e,n){const r=t.field.isKeyField()?Q.comparator(e.key,n.key):function(s,a,l){const u=a.data.field(s),h=l.data.field(s);return u!==null&&h!==null?Ii(u,h):J()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return J()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){po(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return L_(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iR=new ct(Q.comparator);function ul(){return iR}const W_=new ct(Q.comparator);function ia(...t){let e=W_;for(const n of t)e=e.insert(n.key,n);return e}function K_(t){let e=W_;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function vr(){return Ts()}function q_(){return Ts()}function Ts(){return new Oi(t=>t.toString(),(t,e)=>t.isEqual(e))}const sR=new ct(Q.comparator),oR=new Qe(Q.comparator);function Ge(...t){let e=oR;for(const n of t)e=e.add(n);return e}const aR=new Qe(se);function lR(){return aR}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pd(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:il(e)?"-0":e}}function G_(t){return{integerValue:""+t}}function uR(t,e){return MP(e)?G_(e):Pd(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ml{constructor(){this._=void 0}}function cR(t,e,n){return t instanceof Xs?function(i,s){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Id(s)&&(s=V_(s)),s&&(a.fields.__previous_value__=s),{mapValue:a}}(n,e):t instanceof Ys?X_(t,e):t instanceof Js?Y_(t,e):function(i,s){const a=Q_(i,s),l=zm(a)+zm(i.Pe);return th(a)&&th(i.Pe)?G_(l):Pd(i.serializer,l)}(t,e)}function hR(t,e,n){return t instanceof Ys?X_(t,e):t instanceof Js?Y_(t,e):n}function Q_(t,e){return t instanceof cl?function(r){return th(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class Xs extends Ml{}class Ys extends Ml{constructor(e){super(),this.elements=e}}function X_(t,e){const n=J_(e);for(const r of t.elements)n.some(i=>qt(i,r))||n.push(r);return{arrayValue:{values:n}}}class Js extends Ml{constructor(e){super(),this.elements=e}}function Y_(t,e){let n=J_(e);for(const r of t.elements)n=n.filter(i=>!qt(i,r));return{arrayValue:{values:n}}}class cl extends Ml{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function zm(t){return Me(t.integerValue||t.doubleValue)}function J_(t){return Td(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dR{constructor(e,n){this.field=e,this.transform=n}}function fR(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof Ys&&i instanceof Ys||r instanceof Js&&i instanceof Js?Ei(r.elements,i.elements,qt):r instanceof cl&&i instanceof cl?qt(r.Pe,i.Pe):r instanceof Xs&&i instanceof Xs}(t.transform,e.transform)}class pR{constructor(e,n){this.version=e,this.transformResults=n}}class dn{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new dn}static exists(e){return new dn(void 0,e)}static updateTime(e){return new dn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Sa(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class bl{}function Z_(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new tE(t.key,dn.none()):new mo(t.key,t.data,dn.none());{const n=t.data,r=Ot.empty();let i=new Qe(be.comparator);for(let s of e.fields)if(!i.has(s)){let a=n.field(s);a===null&&s.length>1&&(s=s.popLast(),a=n.field(s)),a===null?r.delete(s):r.set(s,a),i=i.add(s)}return new br(t.key,r,new Lt(i.toArray()),dn.none())}}function mR(t,e,n){t instanceof mo?function(i,s,a){const l=i.value.clone(),u=Hm(i.fieldTransforms,s,a.transformResults);l.setAll(u),s.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(t,e,n):t instanceof br?function(i,s,a){if(!Sa(i.precondition,s))return void s.convertToUnknownDocument(a.version);const l=Hm(i.fieldTransforms,s,a.transformResults),u=s.data;u.setAll(eE(i)),u.setAll(l),s.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,a){s.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,n)}function Ss(t,e,n,r){return t instanceof mo?function(s,a,l,u){if(!Sa(s.precondition,a))return l;const h=s.value.clone(),f=Wm(s.fieldTransforms,u,a);return h.setAll(f),a.convertToFoundDocument(a.version,h).setHasLocalMutations(),null}(t,e,n,r):t instanceof br?function(s,a,l,u){if(!Sa(s.precondition,a))return l;const h=Wm(s.fieldTransforms,u,a),f=a.data;return f.setAll(eE(s)),f.setAll(h),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(t,e,n,r):function(s,a,l){return Sa(s.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(t,e,n)}function gR(t,e){let n=null;for(const r of t.fieldTransforms){const i=e.data.field(r.field),s=Q_(r.transform,i||null);s!=null&&(n===null&&(n=Ot.empty()),n.set(r.field,s))}return n||null}function $m(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&Ei(r,i,(s,a)=>fR(s,a))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class mo extends bl{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class br extends bl{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function eE(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function Hm(t,e,n){const r=new Map;Ie(t.length===n.length);for(let i=0;i<n.length;i++){const s=t[i],a=s.transform,l=e.data.field(s.field);r.set(s.field,hR(a,l,n[i]))}return r}function Wm(t,e,n){const r=new Map;for(const i of t){const s=i.transform,a=n.data.field(i.field);r.set(i.field,cR(s,a,e))}return r}class tE extends bl{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class vR extends bl{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yR{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&mR(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=Ss(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=Ss(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=q_();return this.mutations.forEach(i=>{const s=e.get(i.key),a=s.overlayedDocument;let l=this.applyToLocalView(a,s.mutatedFields);l=n.has(i.key)?null:l;const u=Z_(a,l);u!==null&&r.set(i.key,u),a.isValidDocument()||a.convertToNoDocument(fe.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),Ge())}isEqual(e){return this.batchId===e.batchId&&Ei(this.mutations,e.mutations,(n,r)=>$m(n,r))&&Ei(this.baseMutations,e.baseMutations,(n,r)=>$m(n,r))}}class Rd{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){Ie(e.mutations.length===r.length);let i=function(){return sR}();const s=e.mutations;for(let a=0;a<s.length;a++)i=i.insert(s[a].key,r[a].version);return new Rd(e,n,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _R{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Te,Z;function ER(t){switch(t){default:return J();case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0}}function wR(t){if(t===void 0)return Or("GRPC error has no .code"),b.UNKNOWN;switch(t){case Te.OK:return b.OK;case Te.CANCELLED:return b.CANCELLED;case Te.UNKNOWN:return b.UNKNOWN;case Te.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case Te.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case Te.INTERNAL:return b.INTERNAL;case Te.UNAVAILABLE:return b.UNAVAILABLE;case Te.UNAUTHENTICATED:return b.UNAUTHENTICATED;case Te.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case Te.NOT_FOUND:return b.NOT_FOUND;case Te.ALREADY_EXISTS:return b.ALREADY_EXISTS;case Te.PERMISSION_DENIED:return b.PERMISSION_DENIED;case Te.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case Te.ABORTED:return b.ABORTED;case Te.OUT_OF_RANGE:return b.OUT_OF_RANGE;case Te.UNIMPLEMENTED:return b.UNIMPLEMENTED;case Te.DATA_LOSS:return b.DATA_LOSS;default:return J()}}(Z=Te||(Te={}))[Z.OK=0]="OK",Z[Z.CANCELLED=1]="CANCELLED",Z[Z.UNKNOWN=2]="UNKNOWN",Z[Z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Z[Z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Z[Z.NOT_FOUND=5]="NOT_FOUND",Z[Z.ALREADY_EXISTS=6]="ALREADY_EXISTS",Z[Z.PERMISSION_DENIED=7]="PERMISSION_DENIED",Z[Z.UNAUTHENTICATED=16]="UNAUTHENTICATED",Z[Z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Z[Z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Z[Z.ABORTED=10]="ABORTED",Z[Z.OUT_OF_RANGE=11]="OUT_OF_RANGE",Z[Z.UNIMPLEMENTED=12]="UNIMPLEMENTED",Z[Z.INTERNAL=13]="INTERNAL",Z[Z.UNAVAILABLE=14]="UNAVAILABLE",Z[Z.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new S_([4294967295,4294967295],0);class IR{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function ih(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function TR(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function SR(t,e){return ih(t,e.toTimestamp())}function hi(t){return Ie(!!t),fe.fromTimestamp(function(n){const r=Dr(n);return new Oe(r.seconds,r.nanos)}(t))}function nE(t,e){return sh(t,e).canonicalString()}function sh(t,e){const n=function(i){return new _e(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function AR(t){const e=_e.fromString(t);return Ie(DR(e)),e}function oh(t,e){return nE(t.databaseId,e.path)}function CR(t){const e=AR(t);return e.length===4?_e.emptyPath():RR(e)}function PR(t){return new _e(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function RR(t){return Ie(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function Km(t,e,n){return{name:oh(t,e),fields:n.value.mapValue.fields}}function kR(t,e){let n;if(e instanceof mo)n={update:Km(t,e.key,e.value)};else if(e instanceof tE)n={delete:oh(t,e.key)};else if(e instanceof br)n={update:Km(t,e.key,e.data),updateMask:OR(e.fieldMask)};else{if(!(e instanceof vR))return J();n={verify:oh(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,a){const l=a.transform;if(l instanceof Xs)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Ys)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Js)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof cl)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw J()}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:SR(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:J()}(t,e.precondition)),n}function NR(t,e){return t&&t.length>0?(Ie(e!==void 0),t.map(n=>function(i,s){let a=i.updateTime?hi(i.updateTime):hi(s);return a.isEqual(fe.min())&&(a=hi(s)),new pR(a,i.transformResults||[])}(n,e))):[]}function xR(t){let e=CR(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){Ie(r===1);const f=n.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];n.where&&(s=function(m){const v=rE(m);return v instanceof Yn&&U_(v)?v.getFilters():[v]}(n.where));let a=[];n.orderBy&&(a=function(m){return m.map(v=>function(P){return new ll($r(P.field),function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(P.direction))}(v))}(n.orderBy));let l=null;n.limit&&(l=function(m){let v;return v=typeof m=="object"?m.value:m,wd(v)?null:v}(n.limit));let u=null;n.startAt&&(u=function(m){const v=!!m.before,S=m.values||[];return new al(S,v)}(n.startAt));let h=null;return n.endAt&&(h=function(m){const v=!m.before,S=m.values||[];return new al(S,v)}(n.endAt)),JP(e,i,a,s,l,"F",u,h)}function rE(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=$r(n.unaryFilter.field);return Ne.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=$r(n.unaryFilter.field);return Ne.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=$r(n.unaryFilter.field);return Ne.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=$r(n.unaryFilter.field);return Ne.create(a,"!=",{nullValue:"NULL_VALUE"});default:return J()}}(t):t.fieldFilter!==void 0?function(n){return Ne.create($r(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return J()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return Yn.create(n.compositeFilter.filters.map(r=>rE(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return J()}}(n.compositeFilter.op))}(t):J()}function $r(t){return be.fromServerFormat(t.fieldPath)}function OR(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function DR(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LR{constructor(e){this.ct=e}}function VR(t){const e=xR({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?rh(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MR{constructor(){this.un=new bR}addToCollectionParentIndex(e,n){return this.un.add(n),V.resolve()}getCollectionParents(e,n){return V.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return V.resolve()}deleteFieldIndex(e,n){return V.resolve()}deleteAllFieldIndexes(e){return V.resolve()}createTargetIndexes(e,n){return V.resolve()}getDocumentsMatchingTarget(e,n){return V.resolve(null)}getIndexType(e,n){return V.resolve(0)}getFieldIndexes(e,n){return V.resolve([])}getNextCollectionGroupToUpdate(e){return V.resolve(null)}getMinOffset(e,n){return V.resolve(Xn.min())}getMinOffsetFromCollectionGroup(e,n){return V.resolve(Xn.min())}updateCollectionGroup(e,n,r){return V.resolve()}updateIndexEntries(e,n){return V.resolve()}}class bR{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new Qe(_e.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new Qe(_e.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Si(0)}static kn(){return new Si(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FR{constructor(){this.changes=new Oi(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,xt.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?V.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UR{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jR{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&Ss(r.mutation,i,Lt.empty(),Oe.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,Ge()).next(()=>r))}getLocalViewOfDocuments(e,n,r=Ge()){const i=vr();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let a=ia();return s.forEach((l,u)=>{a=a.insert(l,u.overlayedDocument)}),a}))}getOverlayedDocuments(e,n){const r=vr();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,Ge()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((a,l)=>{n.set(a,l)})})}computeViews(e,n,r,i){let s=ul();const a=Ts(),l=function(){return Ts()}();return n.forEach((u,h)=>{const f=r.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof br)?s=s.insert(h.key,h):f!==void 0?(a.set(h.key,f.mutation.getFieldMask()),Ss(f.mutation,h,f.mutation.getFieldMask(),Oe.now())):a.set(h.key,Lt.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((h,f)=>a.set(h,f)),n.forEach((h,f)=>{var m;return l.set(h,new UR(f,(m=a.get(h))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const r=Ts();let i=new ct((a,l)=>a-l),s=Ge();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(a=>{for(const l of a)l.keys().forEach(u=>{const h=n.get(u);if(h===null)return;let f=r.get(u)||Lt.empty();f=l.applyToLocalView(h,f),r.set(u,f);const m=(i.get(l.batchId)||Ge()).add(u);i=i.insert(l.batchId,m)})}).next(()=>{const a=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,f=u.value,m=q_();f.forEach(v=>{if(!s.has(v)){const S=Z_(n.get(v),r.get(v));S!==null&&m.set(v,S),s=s.add(v)}}),a.push(this.documentOverlayCache.saveOverlays(e,h,m))}return V.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return function(a){return Q.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):eR(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const a=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):V.resolve(vr());let l=-1,u=s;return a.next(h=>V.forEach(h,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),s.get(f)?V.resolve():this.remoteDocumentCache.getEntry(e,f).next(v=>{u=u.insert(f,v)}))).next(()=>this.populateOverlays(e,h,s)).next(()=>this.computeViews(e,u,h,Ge())).next(f=>({batchId:l,changes:K_(f)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new Q(n)).next(r=>{let i=ia();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let a=ia();return this.indexManager.getCollectionParents(e,s).next(l=>V.forEach(l,u=>{const h=function(m,v){return new Vl(v,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,h,r,i).next(f=>{f.forEach((m,v)=>{a=a.insert(m,v)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(a=>(s=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(a=>{s.forEach((u,h)=>{const f=h.getKey();a.get(f)===null&&(a=a.insert(f,xt.newInvalidDocument(f)))});let l=ia();return a.forEach((u,h)=>{const f=s.get(u);f!==void 0&&Ss(f.mutation,h,Lt.empty(),Oe.now()),Cd(n,h)&&(l=l.insert(u,h))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BR{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return V.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(i){return{id:i.id,version:i.version,createTime:hi(i.createTime)}}(n)),V.resolve()}getNamedQuery(e,n){return V.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(i){return{name:i.name,query:VR(i.bundledQuery),readTime:hi(i.readTime)}}(n)),V.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zR{constructor(){this.overlays=new ct(Q.comparator),this.Ir=new Map}getOverlay(e,n){return V.resolve(this.overlays.get(n))}getOverlays(e,n){const r=vr();return V.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.ht(e,n,s)}),V.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.Ir.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(r)),V.resolve()}getOverlaysForCollection(e,n,r){const i=vr(),s=n.length+1,a=new Q(n.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return V.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new ct((h,f)=>h-f);const a=this.overlays.getIterator();for(;a.hasNext();){const h=a.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let f=s.get(h.largestBatchId);f===null&&(f=vr(),s=s.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const l=vr(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,f)=>l.set(h,f)),!(l.size()>=i)););return V.resolve(l)}ht(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const a=this.Ir.get(i.largestBatchId).delete(r.key);this.Ir.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new _R(n,r));let s=this.Ir.get(n);s===void 0&&(s=Ge(),this.Ir.set(n,s)),this.Ir.set(n,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $R{constructor(){this.sessionToken=Kt.EMPTY_BYTE_STRING}getSessionToken(e){return V.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,V.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kd{constructor(){this.Tr=new Qe(Re.Er),this.dr=new Qe(Re.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const r=new Re(e,n);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Vr(new Re(e,n))}mr(e,n){e.forEach(r=>this.removeReference(r,n))}gr(e){const n=new Q(new _e([])),r=new Re(n,e),i=new Re(n,e+1),s=[];return this.dr.forEachInRange([r,i],a=>{this.Vr(a),s.push(a.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new Q(new _e([])),r=new Re(n,e),i=new Re(n,e+1);let s=Ge();return this.dr.forEachInRange([r,i],a=>{s=s.add(a.key)}),s}containsKey(e){const n=new Re(e,0),r=this.Tr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class Re{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return Q.comparator(e.key,n.key)||se(e.wr,n.wr)}static Ar(e,n){return se(e.wr,n.wr)||Q.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HR{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new Qe(Re.Er)}checkEmpty(e){return V.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new yR(s,n,r,i);this.mutationQueue.push(a);for(const l of i)this.br=this.br.add(new Re(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return V.resolve(a)}lookupMutationBatch(e,n){return V.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.vr(r),s=i<0?0:i;return V.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return V.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return V.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new Re(n,0),i=new Re(n,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([r,i],a=>{const l=this.Dr(a.wr);s.push(l)}),V.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new Qe(se);return n.forEach(i=>{const s=new Re(i,0),a=new Re(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,a],l=>{r=r.add(l.wr)})}),V.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;Q.isDocumentKey(s)||(s=s.child(""));const a=new Re(new Q(s),0);let l=new Qe(se);return this.br.forEachWhile(u=>{const h=u.key.path;return!!r.isPrefixOf(h)&&(h.length===i&&(l=l.add(u.wr)),!0)},a),V.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(r=>{const i=this.Dr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){Ie(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return V.forEach(n.mutations,i=>{const s=new Re(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,n){const r=new Re(n,0),i=this.br.firstAfterOrEqual(r);return V.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,V.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WR{constructor(e){this.Mr=e,this.docs=function(){return new ct(Q.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,a=this.Mr(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:a}),this.size+=a-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return V.resolve(r?r.document.mutableCopy():xt.newInvalidDocument(n))}getEntries(e,n){let r=ul();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():xt.newInvalidDocument(i))}),V.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=ul();const a=n.path,l=new Q(a.child("")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!a.isPrefixOf(h.path))break;h.path.length>a.length+1||OP(xP(f),r)<=0||(i.has(f.key)||Cd(n,f))&&(s=s.insert(f.key,f.mutableCopy()))}return V.resolve(s)}getAllFromCollectionGroup(e,n,r,i){J()}Or(e,n){return V.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new KR(this)}getSize(e){return V.resolve(this.size)}}class KR extends FR{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.cr.addEntry(e,i)):this.cr.removeEntry(r)}),V.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qR{constructor(e){this.persistence=e,this.Nr=new Oi(n=>Sd(n),Ad),this.lastRemoteSnapshotVersion=fe.min(),this.highestTargetId=0,this.Lr=0,this.Br=new kd,this.targetCount=0,this.kr=Si.Bn()}forEachTarget(e,n){return this.Nr.forEach((r,i)=>n(i)),V.resolve()}getLastRemoteSnapshotVersion(e){return V.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return V.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),V.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.Lr&&(this.Lr=n),V.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Si(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,V.resolve()}updateTargetData(e,n){return this.Kn(n),V.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,V.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.Nr.delete(a),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),V.waitFor(s).next(()=>i)}getTargetCount(e){return V.resolve(this.targetCount)}getTargetData(e,n){const r=this.Nr.get(n)||null;return V.resolve(r)}addMatchingKeys(e,n,r){return this.Br.Rr(n,r),V.resolve()}removeMatchingKeys(e,n,r){this.Br.mr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(a=>{s.push(i.markPotentiallyOrphaned(e,a))}),V.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),V.resolve()}getMatchingKeysForTargetId(e,n){const r=this.Br.yr(n);return V.resolve(r)}containsKey(e,n){return V.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GR{constructor(e,n){this.qr={},this.overlays={},this.Qr=new D_(0),this.Kr=!1,this.Kr=!0,this.$r=new $R,this.referenceDelegate=e(this),this.Ur=new qR(this),this.indexManager=new MR,this.remoteDocumentCache=function(i){return new WR(i)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new LR(n),this.Gr=new BR(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new zR,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this.qr[e.toKey()];return r||(r=new HR(n,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,r){H("MemoryPersistence","Starting transaction:",e);const i=new QR(this.Qr.next());return this.referenceDelegate.zr(),r(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,n){return V.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,n)))}}class QR extends LP{constructor(e){super(),this.currentSequenceNumber=e}}class Nd{constructor(e){this.persistence=e,this.Jr=new kd,this.Yr=null}static Zr(e){return new Nd(e)}get Xr(){if(this.Yr)return this.Yr;throw J()}addReference(e,n,r){return this.Jr.addReference(r,n),this.Xr.delete(r.toString()),V.resolve()}removeReference(e,n,r){return this.Jr.removeReference(r,n),this.Xr.add(r.toString()),V.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),V.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(i=>this.Xr.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return V.forEach(this.Xr,r=>{const i=Q.fromPath(r);return this.ei(e,i).next(s=>{s||n.removeEntry(i,fe.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(r=>{r?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return V.or([()=>V.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xd{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.$i=r,this.Ui=i}static Wi(e,n){let r=Ge(),i=Ge();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new xd(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XR{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YR{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return zT()?8:VP(Ye())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.Yi(e,n).next(a=>{s.result=a}).next(()=>{if(!s.result)return this.Zi(e,n,i,r).next(a=>{s.result=a})}).next(()=>{if(s.result)return;const a=new XR;return this.Xi(e,n,a).next(l=>{if(s.result=l,this.zi)return this.es(e,n,a,l.size)})}).next(()=>s.result)}es(e,n,r,i){return r.documentReadCount<this.ji?(ts()<=Y.DEBUG&&H("QueryEngine","SDK will not create cache indexes for query:",ns(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),V.resolve()):(ts()<=Y.DEBUG&&H("QueryEngine","Query:",ns(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Hi*i?(ts()<=Y.DEBUG&&H("QueryEngine","The SDK decides to create cache indexes for query:",ns(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ir(n))):V.resolve())}Yi(e,n){if(Bm(n))return V.resolve(null);let r=Ir(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=rh(n,null,"F"),r=Ir(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const a=Ge(...s);return this.Ji.getDocuments(e,a).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const h=this.ts(n,l);return this.ns(n,h,a,u.readTime)?this.Yi(e,rh(n,null,"F")):this.rs(e,h,n,u)}))})))}Zi(e,n,r,i){return Bm(n)||i.isEqual(fe.min())?V.resolve(null):this.Ji.getDocuments(e,r).next(s=>{const a=this.ts(n,s);return this.ns(n,a,r,i)?V.resolve(null):(ts()<=Y.DEBUG&&H("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),ns(n)),this.rs(e,a,n,NP(i,-1)).next(l=>l))})}ts(e,n){let r=new Qe(nR(e));return n.forEach((i,s)=>{Cd(e,s)&&(r=r.add(s))}),r}ns(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,n,r){return ts()<=Y.DEBUG&&H("QueryEngine","Using full collection scan to execute query:",ns(n)),this.Ji.getDocumentsMatchingQuery(e,n,Xn.min(),r)}rs(e,n,r,i){return this.Ji.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(a=>{s=s.insert(a.key,a)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JR{constructor(e,n,r,i){this.persistence=e,this.ss=n,this.serializer=i,this.os=new ct(se),this._s=new Oi(s=>Sd(s),Ad),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new jR(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function ZR(t,e,n,r){return new JR(t,e,n,r)}async function iE(t,e){const n=ae(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.ls(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const a=[],l=[];let u=Ge();for(const h of i){a.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of s){l.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return n.localDocuments.getDocuments(r,u).next(h=>({hs:h,removedBatchIds:a,addedBatchIds:l}))})})}function e1(t,e){const n=ae(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=n.cs.newChangeBuffer({trackRemovals:!0});return function(l,u,h,f){const m=h.batch,v=m.keys();let S=V.resolve();return v.forEach(P=>{S=S.next(()=>f.getEntry(u,P)).next(x=>{const D=h.docVersions.get(P);Ie(D!==null),x.version.compareTo(D)<0&&(m.applyToRemoteDocument(x,h),x.isValidDocument()&&(x.setReadTime(h.commitVersion),f.addEntry(x)))})}),S.next(()=>l.mutationQueue.removeMutationBatch(u,m))}(n,r,e,s).next(()=>s.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let u=Ge();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,i))})}function t1(t){const e=ae(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function n1(t,e){const n=ae(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}class qm{constructor(){this.activeTargetIds=lR()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class r1{constructor(){this.so=new qm,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,r){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new qm,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i1{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){H("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){H("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sa=null;function Ku(){return sa===null?sa=function(){return 268435456+Math.round(2147483648*Math.random())}():sa++,"0x"+sa.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s1={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o1{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const We="WebChannelConnection";class a1 extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+n.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(n,r,i,s,a){const l=Ku(),u=this.xo(n,r.toUriEncodedString());H("RestConnection",`Sending RPC '${n}' ${l}:`,u,i);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,s,a),this.No(n,u,h,i).then(f=>(H("RestConnection",`Received RPC '${n}' ${l}: `,f),f),f=>{throw rl("RestConnection",`RPC '${n}' ${l} failed with error: `,f,"url: ",u,"request:",i),f})}Lo(n,r,i,s,a,l){return this.Mo(n,r,i,s,a)}Oo(n,r,i){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+xi}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,a)=>n[a]=s),i&&i.headers.forEach((s,a)=>n[a]=s)}xo(n,r){const i=s1[n];return`${this.Do}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,r,i){const s=Ku();return new Promise((a,l)=>{const u=new A_;u.setWithCredentials(!0),u.listenOnce(C_.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case Ia.NO_ERROR:const f=u.getResponseJson();H(We,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),a(f);break;case Ia.TIMEOUT:H(We,`RPC '${e}' ${s} timed out`),l(new K(b.DEADLINE_EXCEEDED,"Request time out"));break;case Ia.HTTP_ERROR:const m=u.getStatus();if(H(We,`RPC '${e}' ${s} failed with status:`,m,"response text:",u.getResponseText()),m>0){let v=u.getResponseJson();Array.isArray(v)&&(v=v[0]);const S=v==null?void 0:v.error;if(S&&S.status&&S.message){const P=function(D){const w=D.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(w)>=0?w:b.UNKNOWN}(S.status);l(new K(P,S.message))}else l(new K(b.UNKNOWN,"Server responded with status "+u.getStatus()))}else l(new K(b.UNAVAILABLE,"Connection failed."));break;default:J()}}finally{H(We,`RPC '${e}' ${s} completed.`)}});const h=JSON.stringify(i);H(We,`RPC '${e}' ${s} sending request:`,i),u.send(n,"POST",h,r,15)})}Bo(e,n,r){const i=Ku(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=k_(),l=R_(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,n,r),u.encodeInitMessageHeaders=!0;const f=s.join("");H(We,`Creating RPC '${e}' stream ${i}: ${f}`,u);const m=a.createWebChannel(f,u);let v=!1,S=!1;const P=new o1({Io:D=>{S?H(We,`Not sending because RPC '${e}' stream ${i} is closed:`,D):(v||(H(We,`Opening RPC '${e}' stream ${i} transport.`),m.open(),v=!0),H(We,`RPC '${e}' stream ${i} sending:`,D),m.send(D))},To:()=>m.close()}),x=(D,w,y)=>{D.listen(w,A=>{try{y(A)}catch(L){setTimeout(()=>{throw L},0)}})};return x(m,cs.EventType.OPEN,()=>{S||(H(We,`RPC '${e}' stream ${i} transport opened.`),P.yo())}),x(m,cs.EventType.CLOSE,()=>{S||(S=!0,H(We,`RPC '${e}' stream ${i} transport closed`),P.So())}),x(m,cs.EventType.ERROR,D=>{S||(S=!0,rl(We,`RPC '${e}' stream ${i} transport errored:`,D),P.So(new K(b.UNAVAILABLE,"The operation could not be completed")))}),x(m,cs.EventType.MESSAGE,D=>{var w;if(!S){const y=D.data[0];Ie(!!y);const A=y,L=A.error||((w=A[0])===null||w===void 0?void 0:w.error);if(L){H(We,`RPC '${e}' stream ${i} received error:`,L);const F=L.status;let U=function(_){const I=Te[_];if(I!==void 0)return wR(I)}(F),E=L.message;U===void 0&&(U=b.INTERNAL,E="Unknown error status: "+F+" with message "+L.message),S=!0,P.So(new K(U,E)),m.close()}else H(We,`RPC '${e}' stream ${i} received:`,y),P.bo(y)}}),x(l,P_.STAT_EVENT,D=>{D.stat===Zc.PROXY?H(We,`RPC '${e}' stream ${i} detected buffering proxy`):D.stat===Zc.NOPROXY&&H(We,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{P.wo()},0),P}}function qu(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fl(t){return new IR(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sE{constructor(e,n,r=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=n,this.ko=r,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),i=Math.max(0,n-r);i>0&&H("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l1{constructor(e,n,r,i,s,a,l,u){this.ui=e,this.Ho=r,this.Jo=i,this.connection=s,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new sE(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===b.RESOURCE_EXHAUSTED?(Or(n.toString()),Or("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Yo===n&&this.P_(r,i)},r=>{e(()=>{const i=new K(b.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(i)})})}P_(e,n){const r=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{r(()=>this.I_(i))}),this.stream.onMessage(i=>{r(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return H("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(H("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class u1 extends l1{constructor(e,n,r,i,s,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,a),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return Ie(!!e.streamToken),this.lastStreamToken=e.streamToken,Ie(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Ie(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=NR(e.writeResults,e.commitTime),r=hi(e.commitTime);return this.listener.g_(r,n)}p_(){const e={};e.database=PR(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>kR(this.serializer,r))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c1 extends class{}{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new K(b.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.Mo(e,sh(n,r),i,s,a)).catch(s=>{throw s.name==="FirebaseError"?(s.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new K(b.UNKNOWN,s.toString())})}Lo(e,n,r,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(e,sh(n,r),i,a,l,s)).catch(a=>{throw a.name==="FirebaseError"?(a.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new K(b.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class h1{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Or(n),this.D_=!1):H("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d1{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(a=>{r.enqueueAndForget(async()=>{vo(this)&&(H("RemoteStore","Restarting streams for network reachability change."),await async function(u){const h=ae(u);h.L_.add(4),await go(h),h.q_.set("Unknown"),h.L_.delete(4),await Ul(h)}(this))})}),this.q_=new h1(r,i)}}async function Ul(t){if(vo(t))for(const e of t.B_)await e(!0)}async function go(t){for(const e of t.B_)await e(!1)}function vo(t){return ae(t).L_.size===0}async function oE(t,e,n){if(!Ll(e))throw e;t.L_.add(1),await go(t),t.q_.set("Offline"),n||(n=()=>t1(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{H("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await Ul(t)})}function aE(t,e){return e().catch(n=>oE(t,n,e))}async function jl(t){const e=ae(t),n=Jn(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;f1(e);)try{const i=await n1(e.localStore,r);if(i===null){e.O_.length===0&&n.o_();break}r=i.batchId,p1(e,i)}catch(i){await oE(e,i)}lE(e)&&uE(e)}function f1(t){return vo(t)&&t.O_.length<10}function p1(t,e){t.O_.push(e);const n=Jn(t);n.r_()&&n.V_&&n.m_(e.mutations)}function lE(t){return vo(t)&&!Jn(t).n_()&&t.O_.length>0}function uE(t){Jn(t).start()}async function m1(t){Jn(t).p_()}async function g1(t){const e=Jn(t);for(const n of t.O_)e.m_(n.mutations)}async function v1(t,e,n){const r=t.O_.shift(),i=Rd.from(r,e,n);await aE(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await jl(t)}async function y1(t,e){e&&Jn(t).V_&&await async function(r,i){if(function(a){return ER(a)&&a!==b.ABORTED}(i.code)){const s=r.O_.shift();Jn(r).s_(),await aE(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await jl(r)}}(t,e),lE(t)&&uE(t)}async function Qm(t,e){const n=ae(t);n.asyncQueue.verifyOperationInProgress(),H("RemoteStore","RemoteStore received new credentials");const r=vo(n);n.L_.add(3),await go(n),r&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await Ul(n)}async function _1(t,e){const n=ae(t);e?(n.L_.delete(2),await Ul(n)):e||(n.L_.add(2),await go(n),n.q_.set("Unknown"))}function Jn(t){return t.U_||(t.U_=function(n,r,i){const s=ae(n);return s.w_(),new u1(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:m1.bind(null,t),mo:y1.bind(null,t),f_:g1.bind(null,t),g_:v1.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await jl(t)):(await t.U_.stop(),t.O_.length>0&&(H("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Od{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new wr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const a=Date.now()+r,l=new Od(e,n,a,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new K(b.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function cE(t,e){if(Or("AsyncQueue",`${e}: ${t}`),Ll(t))return new K(b.UNAVAILABLE,`${e}: ${t}`);throw t}class E1{constructor(){this.queries=Xm(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,r){const i=ae(n),s=i.queries;i.queries=Xm(),s.forEach((a,l)=>{for(const u of l.j_)u.onError(r)})})(this,new K(b.ABORTED,"Firestore shutting down"))}}function Xm(){return new Oi(t=>H_(t),$_)}function w1(t){t.Y_.forEach(e=>{e.next()})}var Ym,Jm;(Jm=Ym||(Ym={})).ea="default",Jm.Cache="cache";class I1{constructor(e,n,r,i,s,a){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new Oi(l=>H_(l),$_),this.Ma=new Map,this.xa=new Set,this.Oa=new ct(Q.comparator),this.Na=new Map,this.La=new kd,this.Ba={},this.ka=new Map,this.qa=Si.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function T1(t,e,n){const r=P1(t);try{const i=await function(a,l){const u=ae(a),h=Oe.now(),f=l.reduce((S,P)=>S.add(P.key),Ge());let m,v;return u.persistence.runTransaction("Locally write mutations","readwrite",S=>{let P=ul(),x=Ge();return u.cs.getEntries(S,f).next(D=>{P=D,P.forEach((w,y)=>{y.isValidDocument()||(x=x.add(w))})}).next(()=>u.localDocuments.getOverlayedDocuments(S,P)).next(D=>{m=D;const w=[];for(const y of l){const A=gR(y,m.get(y.key).overlayedDocument);A!=null&&w.push(new br(y.key,A,M_(A.value.mapValue),dn.exists(!0)))}return u.mutationQueue.addMutationBatch(S,h,w,l)}).next(D=>{v=D;const w=D.applyToLocalDocumentSet(m,x);return u.documentOverlayCache.saveOverlays(S,D.batchId,w)})}).then(()=>({batchId:v.batchId,changes:K_(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(a,l,u){let h=a.Ba[a.currentUser.toKey()];h||(h=new ct(se)),h=h.insert(l,u),a.Ba[a.currentUser.toKey()]=h}(r,i.batchId,n),await Bl(r,i.changes),await jl(r.remoteStore)}catch(i){const s=cE(i,"Failed to persist write");n.reject(s)}}function Zm(t,e,n){const r=ae(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Fa.forEach((s,a)=>{const l=a.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(a,l){const u=ae(a);u.onlineState=l;let h=!1;u.queries.forEach((f,m)=>{for(const v of m.j_)v.Z_(l)&&(h=!0)}),h&&w1(u)}(r.eventManager,e),i.length&&r.Ca.d_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function S1(t,e){const n=ae(t),r=e.batch.batchId;try{const i=await e1(n.localStore,e);dE(n,r,null),hE(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Bl(n,i)}catch(i){await O_(i)}}async function A1(t,e,n){const r=ae(t);try{const i=await function(a,l){const u=ae(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return u.mutationQueue.lookupMutationBatch(h,l).next(m=>(Ie(m!==null),f=m.keys(),u.mutationQueue.removeMutationBatch(h,m))).next(()=>u.mutationQueue.performConsistencyCheck(h)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>u.localDocuments.getDocuments(h,f))})}(r.localStore,e);dE(r,e,n),hE(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Bl(r,i)}catch(i){await O_(i)}}function hE(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function dE(t,e,n){const r=ae(t);let i=r.Ba[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(n?s.reject(n):s.resolve(),i=i.remove(e)),r.Ba[r.currentUser.toKey()]=i}}async function Bl(t,e,n){const r=ae(t),i=[],s=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((l,u)=>{a.push(r.Ka(u,e,n).then(h=>{var f;if((h||n)&&r.isPrimaryClient){const m=h?!h.fromCache:(f=void 0)===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(h){i.push(h);const m=xd.Wi(u.targetId,h);s.push(m)}}))}),await Promise.all(a),r.Ca.d_(i),await async function(u,h){const f=ae(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>V.forEach(h,v=>V.forEach(v.$i,S=>f.persistence.referenceDelegate.addReference(m,v.targetId,S)).next(()=>V.forEach(v.Ui,S=>f.persistence.referenceDelegate.removeReference(m,v.targetId,S)))))}catch(m){if(!Ll(m))throw m;H("LocalStore","Failed to update sequence numbers: "+m)}for(const m of h){const v=m.targetId;if(!m.fromCache){const S=f.os.get(v),P=S.snapshotVersion,x=S.withLastLimboFreeSnapshotVersion(P);f.os=f.os.insert(v,x)}}}(r.localStore,s))}async function C1(t,e){const n=ae(t);if(!n.currentUser.isEqual(e)){H("SyncEngine","User change. New user:",e.toKey());const r=await iE(n.localStore,e);n.currentUser=e,function(s,a){s.ka.forEach(l=>{l.forEach(u=>{u.reject(new K(b.CANCELLED,a))})}),s.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Bl(n,r.hs)}}function P1(t){const e=ae(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=S1.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=A1.bind(null,e),e}class hl{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Fl(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return ZR(this.persistence,new YR,e.initialUser,this.serializer)}Ga(e){return new GR(Nd.Zr,this.serializer)}Wa(e){return new r1}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}hl.provider={build:()=>new hl};class ah{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Zm(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=C1.bind(null,this.syncEngine),await _1(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new E1}()}createDatastore(e){const n=Fl(e.databaseInfo.databaseId),r=function(s){return new a1(s)}(e.databaseInfo);return function(s,a,l,u){return new c1(s,a,l,u)}(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,a,l){return new d1(r,i,s,a,l)}(this.localStore,this.datastore,e.asyncQueue,n=>Zm(this.syncEngine,n,0),function(){return Gm.D()?new Gm:new i1}())}createSyncEngine(e,n){return function(i,s,a,l,u,h,f){const m=new I1(i,s,a,l,u,h);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=ae(i);H("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await go(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}ah.provider={build:()=>new ah};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R1{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this.databaseInfo=i,this.user=Ke.UNAUTHENTICATED,this.clientId=x_.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async a=>{H("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(H("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new wr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=cE(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Gu(t,e){t.asyncQueue.verifyOperationInProgress(),H("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await iE(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function eg(t,e){t.asyncQueue.verifyOperationInProgress();const n=await k1(t);H("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>Qm(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>Qm(e.remoteStore,i)),t._onlineComponents=e}async function k1(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){H("FirestoreClient","Using user provided OfflineComponentProvider");try{await Gu(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===b.FAILED_PRECONDITION||i.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;rl("Error using user provided cache. Falling back to memory cache: "+n),await Gu(t,new hl)}}else H("FirestoreClient","Using default OfflineComponentProvider"),await Gu(t,new hl);return t._offlineComponents}async function N1(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(H("FirestoreClient","Using user provided OnlineComponentProvider"),await eg(t,t._uninitializedComponentsProvider._online)):(H("FirestoreClient","Using default OnlineComponentProvider"),await eg(t,new ah))),t._onlineComponents}function x1(t){return N1(t).then(e=>e.syncEngine)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fE(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tg=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pE(t,e,n){if(!n)throw new K(b.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function O1(t,e,n,r){if(e===!0&&r===!0)throw new K(b.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function ng(t){if(!Q.isDocumentKey(t))throw new K(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function rg(t){if(Q.isDocumentKey(t))throw new K(b.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Dd(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":J()}function lh(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new K(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Dd(t);throw new K(b.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ig{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new K(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new K(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}O1("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=fE((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new K(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new K(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new K(b.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class zl{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ig({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new K(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new K(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ig(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new wP;switch(r.type){case"firstParty":return new AP(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new K(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=tg.get(n);r&&(H("ComponentProvider","Removing Datastore"),tg.delete(n),r.terminate())}(this),Promise.resolve()}}function D1(t,e,n,r={}){var i;const s=(t=lh(t,zl))._getSettings(),a=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==a&&rl("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),r.mockUserToken){let l,u;if(typeof r.mockUserToken=="string")l=r.mockUserToken,u=Ke.MOCK_USER;else{l=VT(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const h=r.mockUserToken.sub||r.mockUserToken.user_id;if(!h)throw new K(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Ke(h)}t._authCredentials=new IP(new N_(l,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ld{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Ld(this.firestore,e,this._query)}}class Wt{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new qn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Wt(this.firestore,e,this._key)}}class qn extends Ld{constructor(e,n,r){super(e,n,ZP(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Wt(this.firestore,null,new Q(e))}withConverter(e){return new qn(this.firestore,e,this._path)}}function L1(t,e,...n){if(t=ut(t),pE("collection","path",e),t instanceof zl){const r=_e.fromString(e,...n);return rg(r),new qn(t,null,r)}{if(!(t instanceof Wt||t instanceof qn))throw new K(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(_e.fromString(e,...n));return rg(r),new qn(t.firestore,null,r)}}function V1(t,e,...n){if(t=ut(t),arguments.length===1&&(e=x_.newId()),pE("doc","path",e),t instanceof zl){const r=_e.fromString(e,...n);return ng(r),new Wt(t,null,new Q(r))}{if(!(t instanceof Wt||t instanceof qn))throw new K(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(_e.fromString(e,...n));return ng(r),new Wt(t.firestore,t instanceof qn?t.converter:null,new Q(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sg{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new sE(this,"async_queue_retry"),this.Vu=()=>{const r=qu();r&&H("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const n=qu();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=qu();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new wr;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Ll(e))throw e;H("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const i=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw Or("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.du=!1,r))));return this.mu=n,n}enqueueAfterDelay(e,n,r){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const i=Od.createAndSchedule(this,e,n,r,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&J()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class mE extends zl{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new sg,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new sg(e),this._firestoreClient=void 0,await e}}}function M1(t,e){const n=typeof t=="object"?t:zy(),r=typeof t=="string"?t:"(default)",i=ld(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=DT("firestore");s&&D1(i,...s)}return i}function b1(t){if(t._terminated)throw new K(b.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||F1(t),t._firestoreClient}function F1(t){var e,n,r;const i=t._freezeSettings(),s=function(l,u,h,f){return new UP(l,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,fE(f.experimentalLongPollingOptions),f.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,i);t._componentsProvider||!((n=i.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new R1(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zs{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Zs(Kt.fromBase64String(e))}catch(n){throw new K(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Zs(Kt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gE{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new K(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new be(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vd{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vE{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new K(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new K(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return se(this._lat,e._lat)||se(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yE{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U1=/^__.*__$/;class j1{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new br(e,this.data,this.fieldMask,n,this.fieldTransforms):new mo(e,this.data,n,this.fieldTransforms)}}function _E(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw J()}}class Md{constructor(e,n,r,i,s,a){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Md(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.Ou(e),i}Nu(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.Fu({path:r,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return dl(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(_E(this.Cu)&&U1.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class B1{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||Fl(e)}Qu(e,n,r,i=!1){return new Md({Cu:e,methodName:n,qu:r,path:be.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function z1(t){const e=t._freezeSettings(),n=Fl(t._databaseId);return new B1(t._databaseId,!!e.ignoreUndefinedProperties,n)}function $1(t,e,n,r,i,s={}){const a=t.Qu(s.merge||s.mergeFields?2:0,e,n,i);TE("Data must be an object, but it was:",a,r);const l=wE(r,a);let u,h;if(s.merge)u=new Lt(a.fieldMask),h=a.fieldTransforms;else if(s.mergeFields){const f=[];for(const m of s.mergeFields){const v=H1(e,m,n);if(!a.contains(v))throw new K(b.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);q1(f,v)||f.push(v)}u=new Lt(f),h=a.fieldTransforms.filter(m=>u.covers(m.field))}else u=null,h=a.fieldTransforms;return new j1(new Ot(l),u,h)}class bd extends Vd{_toFieldTransform(e){return new dR(e.path,new Xs)}isEqual(e){return e instanceof bd}}function EE(t,e){if(IE(t=ut(t)))return TE("Unsupported field value:",e,t),wE(t,e);if(t instanceof Vd)return function(r,i){if(!_E(i.Cu))throw i.Bu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,i){const s=[];let a=0;for(const l of r){let u=EE(l,i.Lu(a));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),a++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=ut(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return uR(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=Oe.fromDate(r);return{timestampValue:ih(i.serializer,s)}}if(r instanceof Oe){const s=new Oe(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:ih(i.serializer,s)}}if(r instanceof vE)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Zs)return{bytesValue:TR(i.serializer,r._byteString)};if(r instanceof Wt){const s=i.databaseId,a=r.firestore._databaseId;if(!a.isEqual(s))throw i.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:nE(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof yE)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(u=>{if(typeof u!="number")throw l.Bu("VectorValues must only contain numeric values.");return Pd(l.serializer,u)})}}}}}}(r,i);throw i.Bu(`Unsupported field value: ${Dd(r)}`)}(t,e)}function wE(t,e){const n={};return L_(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):po(t,(r,i)=>{const s=EE(i,e.Mu(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function IE(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Oe||t instanceof vE||t instanceof Zs||t instanceof Wt||t instanceof Vd||t instanceof yE)}function TE(t,e,n){if(!IE(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const r=Dd(n);throw r==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+r)}}function H1(t,e,n){if((e=ut(e))instanceof gE)return e._internalPath;if(typeof e=="string")return K1(t,e);throw dl("Field path arguments must be of type string or ",t,!1,void 0,n)}const W1=new RegExp("[~\\*/\\[\\]]");function K1(t,e,n){if(e.search(W1)>=0)throw dl(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new gE(...e.split("."))._internalPath}catch{throw dl(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function dl(t,e,n,r,i){const s=r&&!r.isEmpty(),a=i!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(s||a)&&(u+=" (found",s&&(u+=` in field ${r}`),a&&(u+=` in document ${i}`),u+=")"),new K(b.INVALID_ARGUMENT,l+t+u)}function q1(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G1(t,e,n){let r;return r=t?t.toFirestore(e):e,r}function Q1(t,e,n){t=lh(t,Wt);const r=lh(t.firestore,mE),i=G1(t.converter,e);return X1(r,[$1(z1(r),"setDoc",t._key,i,t.converter!==null,n).toMutation(t._key,dn.none())])}function X1(t,e){return function(r,i){const s=new wr;return r.asyncQueue.enqueueAndForget(async()=>T1(await x1(r),i,s)),s.promise}(b1(t),e)}function og(){return new bd("serverTimestamp")}(function(e,n=!0){(function(i){xi=i})(ki),_i(new Rr("firestore",(r,{instanceIdentifier:i,options:s})=>{const a=r.getProvider("app").getImmediate(),l=new mE(new TP(r.getProvider("auth-internal")),new PP(r.getProvider("app-check-internal")),function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new K(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ol(h.options.projectId,f)}(a,i),a);return s=Object.assign({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),Kn(Dm,"4.7.3",e),Kn(Dm,"4.7.3","esm2017")})();const Y1={apiKey:"AIzaSyCwRvnoykrIJInBbHZueC9ewjfMScIdBu4",authDomain:"el-moultaqa.firebaseapp.com",projectId:"el-moultaqa",storageBucket:"el-moultaqa.firebasestorage.app",messagingSenderId:"1071950791904",appId:"1:1071950791904:web:3f461ef9c323a7cef6fc85"},SE=By(Y1),yo=_P(SE),J1=M1(SE);function Z1(t){return aC(yo,t)}function ek(t,e){return rC(yo,t,e)}function tk(t,e){return iC(yo,t,e)}const nk=new rn;function rk(){return RC(yo,nk)}function ik(){return lC(yo)}async function sk(t){const e=V1(L1(J1,"conferences")),n=t.shortName?t.shortName.trim().toLowerCase().replace(/\s+/g,"-"):e.id;return await Q1(e,{...t,slug:n,attendeeEmails:(t.attendees||[]).filter(Boolean),collaborators:(t.collaborators||[]).filter(Boolean),sponsors:(t.sponsors||[]).filter(Boolean),ownerId:t.ownerId,ownerEmail:t.ownerEmail,createdAt:og(),updatedAt:og(),published:!0}),e.id}const ok="/assets/logo-D3WmcXsA.png",ak=[{quote:"ElMoultaqa helped us launch our hybrid event in a single week.",author:"Sana, Event Director"},{quote:"The mobile and web apps were ready to use immediately.",author:"Karim, Conference Producer"},{quote:"Sponsors loved the branded experience and live updates.",author:"Nadia, Head of Partnerships"}];function lk({user:t,onCreate:e,onAuth:n}){return N.jsxs("main",{className:"landing-main",children:[N.jsxs("section",{className:"hero-panel",children:[N.jsxs("div",{className:"hero-copy",children:[N.jsx("p",{className:"eyebrow",children:"Conference software in one place"}),N.jsx("h1",{children:"Build and launch any conference experience with confidence."}),N.jsx("p",{children:"ElMoultaqa gives you a unified landing page, attendee web app, mobile experience and admin dashboard that are easy to configure for every event."}),N.jsxs("div",{className:"hero-actions",children:[N.jsx("button",{className:"hero-button",onClick:t?e:n,children:t?"Create your conference":"Sign in to create"}),N.jsx("button",{className:"secondary-button",onClick:t?e:n,children:t?"Start with a demo":"Try the landing"})]})]}),N.jsx("div",{className:"hero-visual",children:N.jsxs("div",{className:"hero-card",children:[N.jsx("img",{className:"hero-logo",src:ok,alt:"El Moultaqa logo"}),N.jsx("h2",{children:"Organize sessions, speakers, and mobile access in one place."}),N.jsx("p",{children:"A conference platform designed for Algerian digital events, with powerful attendee journeys and modern admin controls."}),N.jsxs("div",{className:"hero-stats-grid",children:[N.jsxs("div",{children:[N.jsx("strong",{children:"24/7"}),N.jsx("p",{children:"Event operations coverage"})]}),N.jsxs("div",{children:[N.jsx("strong",{children:"3 apps"}),N.jsx("p",{children:"Web, mobile, and admin experiences"})]})]})]})})]}),N.jsxs("section",{className:"features-panel",children:[N.jsx("h2",{children:"What you get"}),N.jsxs("div",{className:"feature-grid",children:[N.jsxs("article",{children:[N.jsx("h3",{children:"Mobile app"}),N.jsx("p",{children:"Native mobile experiences for attendees, sessions, and updates."})]}),N.jsxs("article",{children:[N.jsx("h3",{children:"Web app"}),N.jsx("p",{children:"Responsive attendee portal for schedules, speakers and live streams."})]}),N.jsxs("article",{children:[N.jsx("h3",{children:"Admin panel"}),N.jsx("p",{children:"Manage sessions, speakers, users, and conference settings."})]})]})]}),N.jsxs("section",{className:"landing-steps",children:[N.jsx("h2",{children:"How it works"}),N.jsxs("div",{className:"steps-grid",children:[N.jsxs("div",{children:[N.jsx("strong",{children:"1. Create your conference"}),N.jsx("p",{children:"Choose a package and define your conference brand."})]}),N.jsxs("div",{children:[N.jsx("strong",{children:"2. Customize everything"}),N.jsx("p",{children:"Set dates, theme, sponsors, collaborators, and logos."})]}),N.jsxs("div",{children:[N.jsx("strong",{children:"3. Go live"}),N.jsx("p",{children:"Launch your admin panel, attendee webapp, and branded mobile app."})]})]})]}),N.jsxs("section",{className:"feedback-panel",children:[N.jsx("h2",{children:"Trusted by conference organizers"}),N.jsx("div",{className:"feedback-grid",children:ak.map(r=>N.jsxs("article",{children:[N.jsxs("p",{children:["“",r.quote,"”"]}),N.jsx("strong",{children:r.author})]},r.author))})]})]})}const uk=[{id:"starter",name:"Starter",price:"$499",description:"Landing page + basic web app + admin dashboard."},{id:"growth",name:"Growth",price:"$899",description:"Mobile app + web portal + advanced conference tools."},{id:"enterprise",name:"Enterprise",price:"$1,499",description:"Full event suite with sponsorship, notifications, and support."}];function ck({config:t,onChange:e,onBack:n,onFinish:r,saveError:i,saving:s}){const[a,l]=z.useState(1),u=()=>l(S=>Math.min(4,S+1)),h=()=>l(S=>Math.max(1,S-1)),f=(S,P)=>{e({...t,[S]:P})},m=S=>e({...t,[S]:[...t[S],""]}),v=(S,P,x)=>{const D=[...t[S]];D[P]=x,e({...t,[S]:D})};return N.jsxs("div",{className:"builder-shell",children:[N.jsx("button",{className:"builder-back",onClick:n,children:"← Back to landing"}),N.jsxs("div",{className:"builder-card",children:[N.jsxs("header",{className:"builder-header",children:[N.jsxs("div",{children:[N.jsx("p",{className:"eyebrow",children:"Customize your conference"}),N.jsx("h1",{children:"Build your branded conference experience"})]}),N.jsxs("div",{className:"builder-step-pill",children:["Step ",a," of 4"]})]}),a===1&&N.jsxs("section",{className:"builder-step",children:[N.jsx("h2",{children:"Choose your package"}),N.jsx("div",{className:"offer-grid",children:uk.map(S=>N.jsxs("button",{type:"button",className:S.id===t.offer?"offer-card selected":"offer-card",onClick:()=>f("offer",S.id),children:[N.jsx("strong",{children:S.name}),N.jsx("span",{children:S.price}),N.jsx("p",{children:S.description})]},S.id))})]}),a===2&&N.jsxs("section",{className:"builder-step",children:[N.jsx("h2",{children:"Conference details"}),N.jsxs("div",{className:"form-grid",children:[N.jsxs("label",{children:["Conference name",N.jsx("input",{type:"text",value:t.name,onChange:S=>f("name",S.target.value),placeholder:"ElMoultaqa Summit 2026"})]}),N.jsxs("label",{children:["Short name",N.jsx("input",{type:"text",value:t.shortName,onChange:S=>f("shortName",S.target.value),placeholder:"ElMoultaqa"})]}),N.jsxs("label",{children:["Theme color",N.jsx("input",{type:"color",value:t.themeColor,onChange:S=>f("themeColor",S.target.value)})]}),N.jsxs("label",{children:["Logo URL",N.jsx("input",{type:"text",value:t.logo,onChange:S=>f("logo",S.target.value),placeholder:"https://.../logo.png"})]}),N.jsxs("label",{children:["Start date",N.jsx("input",{type:"date",value:t.startDate,onChange:S=>f("startDate",S.target.value)})]}),N.jsxs("label",{children:["End date",N.jsx("input",{type:"date",value:t.endDate,onChange:S=>f("endDate",S.target.value)})]})]})]}),a===3&&N.jsxs("section",{className:"builder-step",children:[N.jsx("h2",{children:"Invite attendees and sponsors"}),N.jsxs("div",{className:"form-grid",children:[N.jsxs("div",{children:[N.jsx("p",{className:"field-title",children:"Attendee emails"}),t.attendees.map((S,P)=>N.jsx("input",{type:"email",value:S,onChange:x=>v("attendees",P,x.target.value),placeholder:`Attendee email ${P+1}`},P)),N.jsx("button",{type:"button",className:"link-button",onClick:()=>m("attendees"),children:"+ Add attendee"})]}),N.jsxs("div",{children:[N.jsx("p",{className:"field-title",children:"Sponsors"}),t.sponsors.map((S,P)=>N.jsx("input",{type:"text",value:S,onChange:x=>v("sponsors",P,x.target.value),placeholder:`Sponsor ${P+1}`},P)),N.jsx("button",{type:"button",className:"link-button",onClick:()=>m("sponsors"),children:"+ Add sponsor"})]})]})]}),a===4&&N.jsxs("section",{className:"builder-step",children:[N.jsx("h2",{children:"Review and launch"}),N.jsxs("div",{className:"result-card",children:[N.jsx("strong",{children:t.name||"Your conference"}),N.jsx("p",{children:t.shortName||"A modern event platform"}),N.jsxs("div",{className:"badge",style:{background:t.themeColor},children:["Theme: ",t.themeColor]}),N.jsxs("div",{className:"links-grid",children:[N.jsxs("div",{children:[N.jsx("label",{children:"Admin panel"}),N.jsx("p",{children:`https://admin.elmoultaqa.com/${t.shortName.toLowerCase().replace(/\s+/g,"-")||"conference"}`})]}),N.jsxs("div",{children:[N.jsx("label",{children:"Webapp"}),N.jsx("p",{children:`https://web.elmoultaqa.com/${t.shortName.toLowerCase().replace(/\s+/g,"-")||"conference"}`})]})]}),N.jsxs("div",{className:"qr-placeholder",children:[N.jsx("div",{children:"QR CODE"}),N.jsx("p",{children:"Scan to download the mobile app or open the conference portal."})]})]})]}),i&&N.jsx("div",{className:"auth-error",children:i}),N.jsxs("footer",{className:"builder-actions",children:[N.jsx("div",{children:a>1&&N.jsx("button",{type:"button",className:"secondary-button",onClick:h,children:"Previous"})}),N.jsx("div",{children:a<4?N.jsx("button",{type:"button",className:"hero-button",onClick:u,children:"Continue"}):N.jsx("button",{type:"button",className:"hero-button",onClick:r,disabled:s,children:s?"Launching...":"Launch conference"})})]})]})]})}function hk({authMode:t,authEmail:e,authPassword:n,authError:r,onEmailChange:i,onPasswordChange:s,onModeToggle:a,onSubmit:l,onGoogleSignIn:u}){return N.jsx("main",{className:"landing-main auth-shell",children:N.jsxs("div",{className:"auth-card",children:[N.jsx("h2",{children:t==="register"?"Create your account":"Sign in to El Moultaqa"}),N.jsx("p",{children:"Authenticate to build and publish your custom conference system."}),N.jsx("div",{className:"auth-social-row",children:N.jsx("button",{type:"button",className:"secondary-button",onClick:u,children:"Continue with Google"})}),N.jsxs("form",{className:"auth-form",onSubmit:l,children:[N.jsxs("label",{children:["Email",N.jsx("input",{type:"email",value:e,onChange:h=>i(h.target.value),placeholder:"your@email.com"})]}),N.jsxs("label",{children:["Password",N.jsx("input",{type:"password",value:n,onChange:h=>s(h.target.value),placeholder:"Choose a strong password"})]}),r&&N.jsx("div",{className:"auth-error",children:r}),N.jsxs("div",{className:"auth-actions",children:[N.jsx("button",{type:"submit",className:"hero-button",children:t==="register"?"Create account":"Sign in"}),N.jsx("button",{type:"button",className:"secondary-button",onClick:a,children:t==="register"?"Already have an account?":"Create a new account"})]})]})]})})}const dk={name:"",shortName:"",themeColor:"#0d7e52",logo:"",startDate:"2026-12-12",endDate:"2026-12-14",collaborators:[""],sponsors:[""],attendees:[""],offer:"starter"};function fk({user:t,conference:e,setConference:n,authMode:r,setAuthMode:i,authEmail:s,setAuthEmail:a,authPassword:l,setAuthPassword:u,authError:h,setAuthError:f,saveError:m,saving:v,handleAuthSubmit:S,handleGoogleSignIn:P,handleLogout:x,handleFinish:D}){const w=ky(),y=async F=>{await S(F)&&w("/builder")},A=async()=>{await P()&&w("/builder")},L=async()=>{await x(),w("/")};return N.jsxs("div",{className:"landing-shell",children:[N.jsxs("header",{className:"landing-nav",children:[N.jsxs("div",{className:"brand",children:[N.jsx("img",{className:"logo-image",src:AT,alt:"El Moultaqa icon"}),N.jsxs("div",{children:[N.jsx("strong",{className:"brand-title",children:"El Moultaqa"}),N.jsx("span",{className:"brand-subtitle",children:"الملتقى"})]})]}),N.jsx("div",{className:"nav-actions",children:t?N.jsxs(N.Fragment,{children:[N.jsx("span",{className:"nav-user-email",children:t.email}),N.jsx("button",{className:"secondary-button",onClick:L,children:"Sign out"}),N.jsx("button",{className:"landing-cta",onClick:()=>w("/builder"),children:"Create your conference"})]}):N.jsx("button",{className:"landing-cta",onClick:()=>w("/auth"),children:"Sign in to create"})})]}),N.jsxs(wT,{children:[N.jsx(as,{path:"/",element:N.jsx(lk,{user:t,onCreate:()=>w(t?"/builder":"/auth"),onAuth:()=>w("/auth")})}),N.jsx(as,{path:"/builder",element:t?N.jsx(ck,{config:e,onChange:n,onBack:()=>w("/"),onFinish:D,saveError:m,saving:v}):N.jsx(Zp,{to:"/auth",replace:!0})}),N.jsx(as,{path:"/auth",element:N.jsx(hk,{authMode:r,authEmail:s,authPassword:l,authError:h,onEmailChange:a,onPasswordChange:u,onModeToggle:()=>i(F=>F==="register"?"login":"register"),onSubmit:y,onGoogleSignIn:A})}),N.jsx(as,{path:"*",element:N.jsx(Zp,{to:"/",replace:!0})})]}),N.jsx("footer",{className:"landing-footer",children:N.jsx("p",{children:"ElMoultaqa — conference software for modern events."})})]})}function pk(){const[t,e]=z.useState(dk),[n,r]=z.useState(null),[i,s]=z.useState(!0),[a,l]=z.useState("login"),[u,h]=z.useState(""),[f,m]=z.useState(""),[v,S]=z.useState(""),[P,x]=z.useState(""),[D,w]=z.useState(!1);z.useEffect(()=>Z1(E=>{r(E),s(!1)}),[]);const y=async U=>{if(U.preventDefault(),S(""),!u||!f)return S("Please enter email and password."),!1;try{return a==="register"?await ek(u,f):await tk(u,f),!0}catch(E){return S(E.message||"Authentication failed. Please try again."),!1}},A=async()=>{S("");try{return await rk(),!0}catch(U){return S(U.message||"Google authentication failed."),!1}},L=async()=>{await ik()},F=async()=>{x(""),w(!0);try{const U=await sk({...t,ownerId:n==null?void 0:n.uid,ownerEmail:n==null?void 0:n.email});return e({...t,id:U}),!0}catch(U){return x(U.message||"Unable to save conference configuration."),!1}finally{w(!1)}};return N.jsx(ST,{children:N.jsx(fk,{user:n,conference:t,setConference:e,authMode:a,setAuthMode:l,authEmail:u,setAuthEmail:h,authPassword:f,setAuthPassword:m,authError:v,setAuthError:S,saveError:P,saving:D,handleAuthSubmit:y,handleGoogleSignIn:A,handleLogout:L,handleFinish:F})})}Qu.createRoot(document.getElementById("root")).render(N.jsx(vg.StrictMode,{children:N.jsx(pk,{})}));
