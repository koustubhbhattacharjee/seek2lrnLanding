
// ─── SHARED STATE ──────────────────────────────────────────────────────────
let selectedShape = "tri"; // tri | sq | ci
let selectedLabel = "";
let hoveredLabel = "";

// ─── GLOBE ─────────────────────────────────────────────────────────────────
const gc     = document.getElementById("globe-c");
const gctx   = gc.getContext("2d");
const gHover = document.getElementById("globe-hover-overlay");
const ghctx  = gHover.getContext("2d");
let globeHovered = false;
const heroVisuals = document.getElementById("hero-visuals");
const atlasCard = document.getElementById("atlas-card");
const globeWrap = document.getElementById("globe-wrap");

function isSpiroRevealed(){
  return heroVisuals.classList.contains("spiro-revealed");
}

function revealSpirograph(){
  if(isSpiroRevealed()) return;
  heroVisuals.classList.add("spiro-revealed");
}

// Hint glow on hover only
gc.addEventListener("mouseenter",()=>{
  const h=document.getElementById("globe-hint");
  h.style.fontSize="19px"; h.style.opacity="1";
  if (isTeacher) {
    h.style.color="#ffffff";
    h.style.textShadow="0 0 12px rgba(255,255,255,0.6), 0 0 28px rgba(255,255,255,0.3)";
  } else {
    h.style.color="#E8622A";
    h.style.textShadow="0 0 12px rgba(232,98,42,0.5), 0 0 28px rgba(232,98,42,0.25)";
  }
  h.classList.add("glisten");
});
let atlasHideTimer=null;
gc.addEventListener("mouseleave",()=>{
  const h=document.getElementById("globe-hint");
  h.style.fontSize="11px"; h.style.textShadow="none";
  h.classList.remove("glisten");
  if (isTeacher) { h.style.color="#F0E6DC"; h.style.opacity="1"; }
  else { h.style.color="var(--mid)"; h.style.opacity="0.5"; }
  hoveredLabel="";
  atlasHideTimer=setTimeout(()=>hideAtlasCard(), 400);
});
atlasCard.addEventListener("mouseenter",()=>{
  clearTimeout(atlasHideTimer);
});
atlasCard.addEventListener("mouseleave",()=>{
  hideAtlasCard();
});

// Atlas card: hover teacher to show, leave globe to hide
let atlasCardVisible=false;
function showAtlasCard(){
  atlasCardVisible=true;
  positionAtlasCard();
  atlasCard.style.transition="opacity 0.35s ease";
  atlasCard.style.opacity="1";
}
function hideAtlasCard(){
  atlasCardVisible=false;
  atlasCard.style.transition="opacity 0.5s ease";
  atlasCard.style.opacity="0";
  ghctx.clearRect(0,0,gHover.width,gHover.height);
}

function isMobileAtlasLayout(){
  return window.innerWidth <= 768;
}

function positionAtlasCard(){
  if(isMobileAtlasLayout()) {
    atlasCard.style.left = "";
    atlasCard.style.top = "";
    return null;
  }

  const heroRect = heroVisuals.getBoundingClientRect();
  const globeRect = globeWrap.getBoundingClientRect();
  const gap = 40;
  const cardWidth = atlasCard.offsetWidth || 250;
  const cardHeight = atlasCard.offsetHeight || 220;
  const left = globeRect.left - heroRect.left - gap - cardWidth;
  const top = globeRect.top - heroRect.top + (globeRect.height - cardHeight) / 2;

  atlasCard.style.left = `${left}px`;
  atlasCard.style.top = `${Math.max(0, top)}px`;

  return { heroRect, globeRect, cardWidth, cardHeight };
}

window.addEventListener("resize",()=>{
  if(atlasCardVisible) drawDynamicConnector();
});

// Connector from card right edge to globe left rim, computed from live element bounds
function drawDynamicConnector(){
  ghctx.clearRect(0,0,gHover.width,gHover.height);
  if(isMobileAtlasLayout()) return;

  positionAtlasCard();

  const overlayRect = gHover.getBoundingClientRect();
  const cardRect = atlasCard.getBoundingClientRect();
  const globeRect = globeWrap.getBoundingClientRect();

  const A={x:cardRect.right-overlayRect.left,y:cardRect.top+cardRect.height/2-overlayRect.top};
  const D={x:globeRect.left-overlayRect.left,y:globeRect.top+globeRect.height/2-overlayRect.top};
  const elbowY=Math.min(A.y,D.y)-Math.min(76,Math.abs(D.x-A.x)*0.35);
  const B={x:A.x,y:elbowY};
  const C={x:D.x,y:elbowY};

  ghctx.save();
  ghctx.strokeStyle=connectorCol; ghctx.lineWidth=1.2; ghctx.setLineDash([4,3]);
  ghctx.beginPath();
  ghctx.moveTo(A.x,A.y);
  ghctx.lineTo(B.x,B.y);
  ghctx.lineTo(C.x,C.y);
  ghctx.lineTo(D.x,D.y);
  ghctx.stroke();
  ghctx.setLineDash([]);
  ghctx.beginPath(); ghctx.arc(D.x,D.y,3,0,Math.PI*2);
  ghctx.fillStyle=connectorCol; ghctx.fill();
  ghctx.restore();
}

// Spiro card hover
const sHover = document.getElementById("spiro-hover-overlay");
const shctx  = sHover.getContext("2d");
let spiroHovered=false, hoverAnimId3, hoverT2=0;

function drawSpiroConnector(t) {
  shctx.clearRect(0,0,760,380);
  if(t<=0) return;
  // Overlay: 760px wide, left=-330px from spiro canvas origin
  // hero-visuals = 800px (380+40+380); overlay left = 420-330 = 90px from hero-visuals left
  // Spiro right rim in overlay = 330+360 = 690
  // Card (right:-290px, width:250px): left edge = 800+290-250 = 840px from hero-visuals left
  //   → in overlay coords = 840-90 = 750px
  // 3-segment L: spiro right rim → up → right to card left → down
  //   A=(690,155)  spiro right rim
  //   B=(690, 80)  up
  //   C=(750, 80)  right to card left edge
  //   D=(750,155)  down to card mid
  const A={x:690,y:155};
  const B={x:690,y:80};
  const C={x:750,y:80};
  const D={x:750,y:155};

  const s1=A.y-B.y;
  const s2=C.x-B.x;
  const s3=D.y-C.y;
  const total=s1+s2+s3;
  const prog=t*total;

  shctx.save();
  shctx.strokeStyle="#1E1208";
  shctx.lineWidth=1.2;
  shctx.setLineDash([4,3]);
  shctx.beginPath();
  shctx.moveTo(A.x,A.y);
  if(prog<=s1){
    shctx.lineTo(A.x,A.y-prog);
  } else if(prog<=s1+s2){
    shctx.lineTo(B.x,B.y);
    shctx.lineTo(B.x+(prog-s1),B.y);
  } else {
    shctx.lineTo(B.x,B.y);
    shctx.lineTo(C.x,C.y);
    shctx.lineTo(C.x,C.y+(prog-s1-s2));
  }
  shctx.stroke();
  shctx.setLineDash([]);
  if(t>=1){
    shctx.beginPath();
    shctx.arc(D.x,D.y,3,0,Math.PI*2);
    shctx.fillStyle="#1E1208";
    shctx.fill();
  }
  shctx.restore();
}

function animateSpiroHover(dir){
  if(!isSpiroRevealed()) return;
  if(hoverAnimId3) cancelAnimationFrame(hoverAnimId3);
  const speed=0.06;
  function step(){
    hoverT2=Math.max(0,Math.min(1,hoverT2+dir*speed));
    drawSpiroConnector(hoverT2);
    document.getElementById("spiro-card").style.opacity=hoverT2;
    if((dir>0&&hoverT2<1)||(dir<0&&hoverT2>0))
      hoverAnimId3=requestAnimationFrame(step);
  }
  step();
}

const spiroCanvas=document.getElementById("spiro-c");
spiroCanvas.addEventListener("mouseenter",()=>{
  spiroHovered=true; animateSpiroHover(1);
  document.querySelectorAll('#recent-cities span[data-col]').forEach(chip=>{
    chip.style.fontSize='14px';
    chip.style.color=isTeacher?'#ffffff':'#E8622A';
    chip.style.textShadow=isTeacher
      ?'0 0 10px rgba(255,255,255,0.6),0 0 22px rgba(255,255,255,0.3)'
      :'0 0 10px rgba(232,98,42,0.5),0 0 22px rgba(232,98,42,0.25)';
  });
});
spiroCanvas.addEventListener("mouseleave",()=>{
  spiroHovered=false;
  setTimeout(()=>{
    const card=document.getElementById("spiro-card");
    if(!card.matches(":hover")) animateSpiroHover(-1);
  }, 50);
  document.querySelectorAll('#recent-cities span[data-col]').forEach(chip=>{
    chip.style.fontSize='10px';
    chip.style.color=chip.dataset.col;
    chip.style.textShadow='none';
  });
});
document.getElementById("spiro-card").addEventListener("mouseenter",()=>{ animateSpiroHover(1); });
document.getElementById("spiro-card").addEventListener("mouseleave",()=>{
  setTimeout(()=>{ if(!spiroCanvas.matches(":hover")) animateSpiroHover(-1); }, 50);
});
const GW=380, GCX=190, GCY=190, GR=170;
let GINК     = "#1a1208";
let globeFill   = "#ffffff";
let globeStroke = "rgba(26,18,8,0.1)";
let spiroFill   = "#fff";
let spiroRing   = "rgba(26,18,8,0.12)";
let mechRgb     = "26,18,8";
let connectorCol = "#E8622A";

let isTeacher = false;
function setTeacherMode(on) {
  isTeacher = on;
  if (on) {
    COLORS = {sq:"#F0E6DC", tri:"#E8622A", ci:"#F0E6DC"};
    GINК = "#F0E6DC"; globeFill = "#1E1208"; globeStroke = "rgba(240,230,220,0.15)";
    spiroFill = "#1E1208"; spiroRing = "rgba(240,230,220,0.18)";
    mechRgb = "240,230,220"; connectorCol = "#F0E6DC";
  } else {
    COLORS = {sq:"#E8622A", tri:"#8B4513", ci:"#1E1208"};
    GINК = "#1a1208"; globeFill = "#ffffff"; globeStroke = "rgba(26,18,8,0.1)";
    spiroFill = "#fff"; spiroRing = "rgba(26,18,8,0.12)";
    mechRgb = "26,18,8"; connectorCol = "#E8622A";
  }
  soctx.clearRect(0, 0, SW, SW);
  sPrev = null;
}

// scale: visual size multiplier. speed: spiro rotation speed. r,d: spiro params
const MARKERS = [
  {lat:40.71,lon:-74.01,type:"ci",label:"Marcus Webb",country:"USA",scale:0.8,speed:0.06,r:73,d:73},
  {lat:51.51,lon:-0.13,type:"sq",label:"Priya Sharma",country:"UK",scale:1.0,speed:0.12,r:67,d:67},
  {lat:35.68,lon:139.69,type:"ci",label:"Kenji Tanaka",country:"Japan",scale:0.9,speed:0.075,r:87,d:87},
  {lat:48.85,lon:2.35,type:"tri",label:"Léa Moreau",country:"France",scale:0.8,speed:0.045,r:67,d:67},
  {lat:19.08,lon:72.88,type:"sq",label:"Rohan Mehta",country:"India",scale:1.6,speed:0.12,r:87,d:87},
  {lat:-23.55,lon:-46.63,type:"sq",label:"Ana Oliveira",country:"Brazil",scale:1.1,speed:0.075,r:89,d:89},
  {lat:1.35,lon:103.82,type:"ci",label:"Wei Ling",country:"Singapore",scale:1.4,speed:0.075,r:71,d:71},
  {lat:55.75,lon:37.62,type:"tri",label:"Dmitri Volkov",country:"Russia",scale:1.2,speed:0.135,r:53,d:53},
  {lat:31.23,lon:121.47,type:"sq",label:"Mei Chen",country:"China",scale:1.3,speed:0.21,r:73,d:73},
  {lat:-33.87,lon:151.21,type:"sq",label:"Liam Foster",country:"Australia",scale:1.3,speed:0.12,r:67,d:67},
  {lat:30.04,lon:31.24,type:"sq",label:"Yasmine Nour",country:"Egypt",scale:0.9,speed:0.21,r:77,d:77},
  {lat:-26.2,lon:28.04,type:"tri",label:"Thabo Dlamini",country:"S. Africa",scale:1.2,speed:0.135,r:53,d:53},
  {lat:42.36,lon:-71.06,type:"ci",label:"Claire Osei",country:"USA",scale:1.6,speed:0.165,r:67,d:67},
  {lat:51.75,lon:-1.26,type:"tri",label:"James Aldridge",country:"UK",scale:1.6,speed:0.06,r:73,d:73},
  {lat:52.2,lon:0.12,type:"ci",label:"Sophia Grant",country:"UK",scale:1.3,speed:0.135,r:87,d:87},
  {lat:37.87,lon:-122.27,type:"sq",label:"Arjun Patel",country:"USA",scale:0.8,speed:0.06,r:89,d:89},
  {lat:13.08,lon:80.27,type:"sq",label:"Divya Nair",country:"India",scale:0.9,speed:0.15,r:71,d:71},
  {lat:37.57,lon:126.98,type:"sq",label:"Ji-ho Lim",country:"S. Korea",scale:1.2,speed:0.21,r:81,d:81},
  {lat:55.95,lon:-3.19,type:"ci",label:"Fiona MacLeod",country:"Scotland",scale:1.0,speed:0.18,r:77,d:77},
  {lat:-37.81,lon:144.96,type:"tri",label:"Emma Nguyen",country:"Australia",scale:2.0,speed:0.12,r:73,d:73},
  {lat:28.61,lon:77.21,type:"ci",label:"Vikram Singh",country:"India",scale:1.8,speed:0.06,r:89,d:89},
  {lat:64.13,lon:-21.82,type:"sq",label:"Sigrid Björk",country:"Iceland",scale:1.1,speed:0.075,r:69,d:69},
  {lat:-54.81,lon:-68.31,type:"tri",label:"Carlos Fuentes",country:"Argentina",scale:1.2,speed:0.21,r:89,d:89},
  {lat:78.22,lon:15.65,type:"ci",label:"Ingrid Larsen",country:"Norway",scale:1.1,speed:0.075,r:89,d:89},
  {lat:-17.53,lon:-149.57,type:"tri",label:"Tearii Mata",country:"Polynesia",scale:1.1,speed:0.045,r:53,d:53},
  {lat:27.99,lon:86.93,type:"tri",label:"Pasang Sherpa",country:"Nepal",scale:1.2,speed:0.21,r:67,d:67},
  {lat:-3.07,lon:37.35,type:"sq",label:"Amara Osei",country:"Tanzania",scale:1.3,speed:0.135,r:71,d:71},
  {lat:61.22,lon:-149.9,type:"ci",label:"Ray Nakamura",country:"USA",scale:1.4,speed:0.165,r:89,d:89},
  {lat:21.31,lon:-157.8,type:"tri",label:"Koa Akana",country:"Hawaii",scale:1.2,speed:0.09,r:69,d:69},
  {lat:68.44,lon:17.43,type:"sq",label:"Erik Solberg",country:"Norway",scale:1.6,speed:0.075,r:73,d:73}
];
let COLORS = {sq:"#E8622A",tri:"#8B4513",ci:"#1E1208"};

let rotY=0, globePaused=false;
let projectedMarkers=[];

function findNearestMarker(mx,my){
  let best=null,bestD=Infinity;
  projectedMarkers.forEach(m=>{
    const d=Math.hypot(m.sx-mx,m.sy-my);
    if(d<bestD){bestD=d;best=m;}
  });
  return best&&bestD<28 ? best : null;
}

function toRad(d){return d*Math.PI/180;}
function latLonTo3D(lat,lon){
  const φ=toRad(lat),λ=toRad(lon);
  return[Math.cos(φ)*Math.cos(λ),Math.sin(φ),Math.cos(φ)*Math.sin(λ)];
}
function rotateY(x,y,z,a){return[x*Math.cos(a)-z*Math.sin(a),y,x*Math.sin(a)+z*Math.cos(a)];}
function project(x,y,z){return[GCX+x*GR,GCY-y*GR];}

function drawMarkerG(sx,sy,type,depth,label,hit,scale,country){
  const alpha=0.25+depth*0.75;
  const size=(4+depth*5)*(scale||1);
  const col=COLORS[type];
  gctx.save();
  gctx.globalAlpha=alpha*(hit?1.4:1);
  gctx.strokeStyle=col;
  gctx.lineWidth=1+depth*0.6+(hit?1:0);
  if(hit){gctx.shadowColor=col;gctx.shadowBlur=8;}
  if(type==="sq"){
    gctx.strokeRect(sx-size/2,sy-size/2,size,size);
  }else if(type==="tri"){
    gctx.beginPath();
    gctx.moveTo(sx,sy-size*0.7);
    gctx.lineTo(sx+size*0.65,sy+size*0.5);
    gctx.lineTo(sx-size*0.65,sy+size*0.5);
    gctx.closePath();gctx.stroke();
  }else{
    gctx.beginPath();gctx.arc(sx,sy,size*0.55,0,Math.PI*2);gctx.stroke();
  }

  gctx.restore();
}

function globeLoop(){
  gctx.clearRect(0,0,GW,GW);
  gctx.beginPath();gctx.arc(GCX,GCY,GR,0,Math.PI*2);
  gctx.fillStyle=globeFill;gctx.fill();
  gctx.strokeStyle=globeStroke;gctx.lineWidth=1;gctx.stroke();

  // grid
  gctx.save();gctx.globalAlpha=0.18;gctx.strokeStyle=GINК;gctx.lineWidth=0.6;
  for(let lon=-180;lon<180;lon+=20){
    gctx.beginPath();let f=true;
    for(let lat=-90;lat<=90;lat+=3){
      let[x,y,z]=latLonTo3D(lat,lon);[x,y,z]=rotateY(x,y,z,rotY);
      if(z<0){f=true;continue;}
      const[sx,sy]=project(x,y,z);f?gctx.moveTo(sx,sy):gctx.lineTo(sx,sy);f=false;
    }gctx.stroke();
  }
  for(let lat=-80;lat<=80;lat+=20){
    gctx.beginPath();let f=true;
    for(let lon=-180;lon<=180;lon+=3){
      let[x,y,z]=latLonTo3D(lat,lon);[x,y,z]=rotateY(x,y,z,rotY);
      if(z<0){f=true;continue;}
      const[sx,sy]=project(x,y,z);f?gctx.moveTo(sx,sy):gctx.lineTo(sx,sy);f=false;
    }gctx.stroke();
  }
  gctx.restore();

  projectedMarkers=MARKERS.map(m=>{
    let[x,y,z]=latLonTo3D(m.lat,m.lon);[x,y,z]=rotateY(x,y,z,rotY);
    const[sx,sy]=project(x,y,z);
    return{...m,sx,sy,z,depth:(z+1)/2};
  }).filter(m=>m.z>0);
  projectedMarkers.sort((a,b)=>a.z-b.z);
  projectedMarkers.forEach(m=>drawMarkerG(m.sx,m.sy,m.type,m.depth,m.label,m.label===selectedLabel||m.label===hoveredLabel,m.scale,m.country));

  // Connector: fixed to rim, shown when any teacher is selected
  if(atlasCardVisible) drawDynamicConnector();
  else ghctx.clearRect(0,0,gHover.width,gHover.height);

  if(!globePaused)rotY+=0.004;
  requestAnimationFrame(globeLoop);
}

gc.addEventListener("mousemove",e=>{
  const rect=gc.getBoundingClientRect();
  const mx=e.clientX-rect.left, my=e.clientY-rect.top;
  const best=findNearestMarker(mx,my);
  gc.style.cursor=best ? "pointer" : "crosshair";
  if(best){
    hoveredLabel=best.label;
    showAtlasCard();
  }else{
    hoveredLabel="";
  }
});

// Click detection
gc.addEventListener("click",e=>{
  const rect=gc.getBoundingClientRect();
  const mx=e.clientX-rect.left, my=e.clientY-rect.top;
  const best=findNearestMarker(mx,my);
  if(best){
    selectedShape=best.type;
    selectedLabel=best.label;
    showAtlasCard();
    revealSpirograph();
    spiroStarted=true;
    spiroPaused=false;
    sR=best.r||67; sD=best.d||67; sSpeed=best.speed||0.09;
    sPrev=null; introT0=t_s;
    const sl=document.getElementById("pen-slider");
    if(sl){ sl.value=sD; }
    document.getElementById("spiro-pause").textContent="pause";
    recentCities=recentCities.filter(c=>c!==best.label);
    recentCities.unshift(best.label);
    if(recentCities.length>3) recentCities.pop();
    updateRecent();
    if(window.innerWidth<=768){
      setTimeout(()=>document.getElementById("spiro-wrap").scrollIntoView({behavior:"smooth",block:"start"}),120);
    }
  }
});

// ─── SPIROGRAPH ─────────────────────────────────────────────────────────────
const sc    = document.getElementById("spiro-c");
const sctx  = sc.getContext("2d");
const SW=380, SCX=190, SCY=190, SR=160;

const soff  = document.createElement("canvas");
soff.width=SW; soff.height=SW;
const soctx = soff.getContext("2d");

// Simple hypotrochoid: inner circle r rolls inside outer SR, pen at distance d
// r and d chosen per shape type
const SHAPE_PARAMS = {
  tri: { r:67, d:95 },   // irrational ratio → never closes
  sq:  { r:53, d:85 },   // irrational ratio → dense fill
  ci:  { r:79, d:110 },  // irrational ratio → flowing
};

let t_s=0, spiroPaused=false, spiroAnimId, sPrev=null;
let recentCities=[];
let sR=67, sD=67, sSpeed=0.09;
let introT0=0; // t_s value when current tutor's intro started
let spiroStarted=false;
const INTRO_SPAN = 0.25*2*Math.PI;  // 0.25 full orbits at full intensity
const FADE_SPAN  = 0.25*2*Math.PI;  // 0.25 orbits to full dissolve

function introAlpha(){
  // 0 = full intro (big pen, bold geometry), 1 = normal
  const e=t_s-introT0;
  if(e<INTRO_SPAN) return 0;
  return Math.min(1,(e-INTRO_SPAN)/FADE_SPAN);
}

function spiroInit(hard){
  if(hard){ t_s=0; sPrev=null; soctx.clearRect(0,0,SW,SW); introT0=0; }
}

function penPos(t){
  const x=SCX+(SR-sR)*Math.cos(t)+sD*Math.cos((SR-sR)/sR*t);
  const y=SCY+(SR-sR)*Math.sin(t)-sD*Math.sin((SR-sR)/sR*t);
  return[x,y];
}

function gearPos(t){
  return[SCX+(SR-sR)*Math.cos(t), SCY+(SR-sR)*Math.sin(t)];
}

function typeOut(el, text, delay, done){
  let i=0; el.textContent="";
  function tick(){ if(i<text.length){el.textContent+=text[i++];setTimeout(tick,30);}else if(done)done(); }
  setTimeout(tick, delay);
}

function updateRecent(){
  const el=document.getElementById("recent-cities");
  if(!el) return;
  el.innerHTML="";
  if(recentCities.length===0){
    el.innerHTML='<span style="opacity:0.4;font-size:10px;height:20px;display:flex;align-items:center;">no tutors yet</span>';
    return;
  }
  recentCities.forEach((c,i)=>{
    const m=MARKERS.find(x=>x.label===c);
    const col=COLORS[m?m.type:"sq"]||"#888";
    const chip=document.createElement("span");
    chip.dataset.col=col;
    chip.style.cssText=`font-size:10px;font-weight:bold;color:${col};opacity:0;transition:opacity 0.4s ease,font-size 0.3s ease,color 0.3s ease,text-shadow 0.3s ease;white-space:nowrap;height:20px;display:flex;align-items:center;justify-content:center;`;
    const country=m?` (${m.country})`:"";
    el.appendChild(chip);
    setTimeout(()=>{ chip.style.opacity="1"; }, i*120);
    typeOut(chip, c+country, i*120, null);
  });
}

function spiroLoop(){
  if(spiroStarted && !spiroPaused){
    t_s+=sSpeed;
    const pt=penPos(t_s);
    if(sPrev){
      soctx.beginPath();
      soctx.moveTo(sPrev[0],sPrev[1]);
      soctx.lineTo(pt[0],pt[1]);
      const tc = COLORS[selectedShape]||"#1E1208";
      const r2=parseInt(tc.slice(1,3),16), g2=parseInt(tc.slice(3,5),16), b2=parseInt(tc.slice(5,7),16);
      soctx.strokeStyle=`rgba(${r2},${g2},${b2},0.55)`;
      soctx.lineWidth=0.8;
      soctx.stroke();
    }
    sPrev=pt;
  }

  sctx.clearRect(0,0,SW,SW);

  // bg circle
  sctx.beginPath();sctx.arc(SCX,SCY,SR+2,0,Math.PI*2);
  sctx.fillStyle=spiroFill;sctx.fill();

  // blit permanent pattern
  sctx.save();
  sctx.beginPath();sctx.arc(SCX,SCY,SR,0,Math.PI*2);sctx.clip();
  sctx.drawImage(soff,0,0);
  sctx.restore();

  // outer ring
  sctx.beginPath();sctx.arc(SCX,SCY,SR,0,Math.PI*2);
  sctx.strokeStyle=spiroRing;sctx.lineWidth=1;sctx.stroke();

  if(!spiroStarted){
    spiroAnimId=requestAnimationFrame(spiroLoop);
    return;
  }

  // rolling gear circle
  const[gx,gy]=gearPos(t_s);
  const gRot=-(SR-sR)/sR*t_s;
  const col=COLORS[selectedShape]||"#C44A1A";
  const ia=introAlpha(); // 0=intro, 1=normal
  const iv=1-ia;         // 1=intro, 0=normal (convenience)

  sctx.beginPath();sctx.arc(gx,gy,sR,0,Math.PI*2);
  sctx.strokeStyle=`rgba(${mechRgb},${(0.04+iv*0.28).toFixed(2)})`;
  sctx.lineWidth=0.5+iv*1.5;sctx.stroke();

  // shape inside rolling gear — bold during intro, ghost after
  sctx.save();sctx.translate(gx,gy);sctx.rotate(gRot);
  const geomA=(0.13+iv*0.87).toFixed(2);
  sctx.strokeStyle=col;sctx.globalAlpha=Number(geomA);
  sctx.lineWidth=1+iv*2;
  if(iv>0.01){
    // glow ring during intro
    sctx.shadowColor=col;sctx.shadowBlur=12*iv;
  }
  if(selectedShape==="sq"){
    const hw=sR/Math.SQRT2;
    sctx.strokeRect(-hw,-hw,hw*2,hw*2);
  }else if(selectedShape==="tri"){
    sctx.beginPath();
    for(let k=0;k<3;k++){
      const a=k*2*Math.PI/3;
      k===0?sctx.moveTo(sR*Math.cos(a),sR*Math.sin(a)):sctx.lineTo(sR*Math.cos(a),sR*Math.sin(a));
    }
    sctx.closePath();sctx.stroke();
  }else{
    sctx.beginPath();sctx.arc(0,0,sR,0,Math.PI*2);sctx.stroke();
  }
  sctx.globalAlpha=1;sctx.shadowBlur=0;
  sctx.restore();

  // arm from gear center to pen
  const[px,py]=penPos(t_s);
  sctx.beginPath();sctx.moveTo(gx,gy);sctx.lineTo(px,py);
  sctx.strokeStyle=`rgba(${mechRgb},${(0.08+iv*0.22).toFixed(2)})`;
  sctx.lineWidth=0.4+iv*0.8;sctx.stroke();

  // pen dot — large + glowing during intro, tiny after
  const penR=1.5+iv*7.5;
  sctx.save();
  if(iv>0.01){sctx.shadowColor=col;sctx.shadowBlur=16*iv;}
  sctx.beginPath();sctx.arc(px,py,penR,0,Math.PI*2);
  sctx.fillStyle=col;sctx.globalAlpha=0.7+iv*0.3;sctx.fill();
  sctx.globalAlpha=1;sctx.shadowBlur=0;
  sctx.restore();

  // Keep connector redrawn every frame so it never goes stale
  if(hoverT2 > 0) drawSpiroConnector(hoverT2);

  spiroAnimId=requestAnimationFrame(spiroLoop);
}

document.getElementById("spiro-pause").onclick=()=>{
  if(!spiroStarted) return;
  spiroPaused=!spiroPaused;
  document.getElementById("spiro-pause").textContent=spiroPaused?"resume":"pause";
};
document.getElementById("spiro-clear").onclick=()=>{ spiroInit(true); };

document.getElementById("pen-slider").oninput=function(){
  sD=Number(this.value);
  sPrev=null; // just break the stroke so there's no jump line
};

// init
spiroInit();
spiroPaused=true;
globeLoop();
document.getElementById("globe-stop").onclick=()=>{
  globePaused=!globePaused;
  document.getElementById("globe-stop").textContent=globePaused?"resume rotation":"stop rotation";
};
spiroLoop();
