/* 旅誌 app：資料透過 adapter.js 提供的 claude.use('db') 介面讀寫（實際存在 Cloudflare D1）。 */

/* ---------- 可自訂的選項 ---------- */
const PALETTES={
  bangkok:{name:'曼谷',colors:['#C8963E','#536E40','#5E3A57','#9C5B2C','#2F4E6E'],art:[null,null,'#E3B866',null,'#C8A15A']},
  kyoto:{name:'京都',colors:['#6B7F3A','#A64B36','#2E4A6B','#5B4A72','#B8893B','#3B3A36']},
  tokyo:{name:'東京',colors:['#3A4A6B','#C24B3D','#5E6F7E','#C99A35','#4D5D3F']},
  seoul:{name:'首爾',colors:['#2F6F73','#A33E3A','#C9A13B','#23395B','#9E5A6C']},
  island:{name:'海島',colors:['#2C7A86','#D29A55','#3A5A8C','#C26A4A','#5E8C5A']},
  europe:{name:'歐洲小鎮',colors:['#8C3B3B','#4B6B8A','#C49A4A','#5F7254','#6C4A63']},
};
const LANGS={
  th:{name:'泰語',script:'泰文',en:'Thai',tts:'th-TH'},
  ja:{name:'日語',script:'日文',en:'Japanese',tts:'ja-JP'},
  ko:{name:'韓語',script:'韓文',en:'Korean',tts:'ko-KR'},
  en:{name:'英語',script:'英文',en:'English',tts:'en-US'},
};
const CURS={
  THB:{sym:'฿',name:'泰銖',rate:0.95},JPY:{sym:'¥',name:'日圓',rate:0.21},KRW:{sym:'₩',name:'韓元',rate:0.023},
  USD:{sym:'US$',name:'美元',rate:32},EUR:{sym:'€',name:'歐元',rate:35},GBP:{sym:'£',name:'英鎊',rate:41},
  HKD:{sym:'HK$',name:'港幣',rate:4.1},SGD:{sym:'S$',name:'新加坡幣',rate:24},MYR:{sym:'RM',name:'令吉',rate:7},
  VND:{sym:'₫',name:'越南盾',rate:0.0013},CNY:{sym:'CN¥',name:'人民幣',rate:4.5},AUD:{sym:'A$',name:'澳幣',rate:21},
};
const ART={
shrine:['神壇',`<circle cx="128" cy="78" r="56" fill="currentColor" opacity=".16"/><g fill="currentColor"><rect x="50" y="176" width="120" height="10"/><rect x="60" y="166" width="100" height="10"/><rect x="70" y="122" width="7" height="44"/><rect x="143" y="122" width="7" height="44"/><rect x="96" y="132" width="28" height="34" opacity=".55"/><polygon points="56,124 110,94 164,124"/><polygon points="70,98 110,74 150,98"/><polygon points="86,78 110,58 134,78"/><rect x="107" y="30" width="6" height="30"/><circle cx="110" cy="27" r="5"/></g><g fill="none" stroke="currentColor" stroke-width="3" opacity=".7"><path d="M64 150 q46 26 92 0"/></g><g fill="currentColor" opacity=".8"><circle cx="70" cy="152" r="4"/><circle cx="88" cy="160" r="4"/><circle cx="110" cy="163" r="4"/><circle cx="132" cy="160" r="4"/><circle cx="150" cy="152" r="4"/></g>`],
prang:['寺塔',`<g fill="currentColor"><rect x="44" y="180" width="112" height="10"/><rect x="56" y="168" width="88" height="12"/><polygon points="66,168 134,168 124,118 76,118"/><rect x="72" y="110" width="56" height="8"/><polygon points="80,110 120,110 112,74 88,74"/><rect x="85" y="67" width="30" height="7"/><polygon points="89,67 111,67 105,40 95,40"/><rect x="98.5" y="10" width="3" height="32"/></g><g fill="currentColor" opacity=".5"><rect x="14" y="180" width="30" height="10"/><polygon points="18,180 40,180 35,146 23,146"/><rect x="28" y="124" width="2" height="22"/><rect x="156" y="180" width="30" height="10"/><polygon points="160,180 182,180 177,146 165,146"/><rect x="170" y="124" width="2" height="22"/></g><g fill="none" stroke="currentColor" stroke-width="2" opacity=".55"><path d="M78 140h44M82 128h36M88 96h24M92 86h16"/></g>`],
torii:['鳥居',`<circle cx="100" cy="112" r="50" fill="currentColor" opacity=".16"/><g fill="currentColor"><path d="M18 42 Q100 26 182 42 L176 56 Q100 42 24 56 Z"/><rect x="34" y="60" width="132" height="11" rx="2"/><rect x="50" y="56" width="13" height="134"/><rect x="137" y="56" width="13" height="134"/><rect x="58" y="92" width="84" height="9"/><rect x="94" y="71" width="12" height="21"/><rect x="42" y="182" width="29" height="8"/><rect x="129" y="182" width="29" height="8"/></g>`],
palace:['宮殿',`<g fill="currentColor"><path d="M44 60 Q100 46 156 60 L164 54 L160 70 Q100 58 40 70 L36 54 Z"/><rect x="62" y="70" width="76" height="22" opacity=".55"/><path d="M12 100 Q100 80 188 100 L196 92 L190 112 Q100 96 10 112 L4 92 Z"/><rect x="34" y="112" width="132" height="56" opacity=".55"/><rect x="40" y="112" width="8" height="56"/><rect x="152" y="112" width="8" height="56"/><rect x="74" y="112" width="8" height="56"/><rect x="118" y="112" width="8" height="56"/><rect x="22" y="168" width="156" height="10"/><rect x="12" y="178" width="176" height="12"/></g>`],
castle:['城堡',`<g fill="currentColor"><rect x="42" y="104" width="116" height="86"/><rect x="26" y="74" width="32" height="116"/><rect x="142" y="74" width="32" height="116"/><polygon points="22,76 42,28 62,76"/><polygon points="138,76 158,28 178,76"/><rect x="82" y="64" width="36" height="40"/><polygon points="78,66 100,22 122,66"/><rect x="42" y="96" width="10" height="10"/><rect x="62" y="96" width="10" height="10"/><rect x="128" y="96" width="10" height="10"/><rect x="148" y="96" width="10" height="10"/></g><path d="M100 22V8l14 5-14 5" fill="currentColor" opacity=".6"/>`],
tower:['高塔',`<circle cx="60" cy="60" r="24" fill="currentColor" opacity=".16"/><g fill="currentColor"><polygon points="100,12 106,12 116,96 124,96 146,190 126,190 110,140 96,140 80,190 60,190 82,96 90,96"/><rect x="78" y="94" width="50" height="8"/><rect x="66" y="136" width="74" height="7"/><rect x="101" y="0" width="4" height="14"/></g>`],
mountain:['山景',`<circle cx="146" cy="56" r="22" fill="currentColor" opacity=".2"/><polygon points="0,190 72,78 144,190" fill="currentColor" opacity=".55"/><polygon points="56,190 132,58 200,170 200,190" fill="currentColor"/><polygon points="116,86 132,58 148,86 140,80 132,90 124,80" fill="currentColor" opacity=".45"/>`],
beach:['海灘',`<circle cx="54" cy="64" r="26" fill="currentColor" opacity=".2"/><path d="M128 186 Q118 132 138 84" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><g fill="currentColor"><path d="M138 84q-30-20-60 0q32-6 60 4z"/><path d="M138 84q30-26 60-6q-32-2-60 10z"/><path d="M138 84q-6-30 18-50q-6 26-14 52z"/><path d="M138 84q-34 6-44 34q20-24 46-30z"/><path d="M138 84q36 4 46 32q-22-22-48-28z"/></g><path d="M0 176q25-10 50 0t50 0 50 0 50 0V200H0z" fill="currentColor" opacity=".5"/>`],
city:['城市',`<circle cx="150" cy="44" r="16" fill="currentColor" opacity=".2"/><g fill="currentColor"><rect x="8" y="124" width="34" height="66"/><rect x="46" y="86" width="30" height="104"/><rect x="80" y="46" width="28" height="144"/><polygon points="80,46 94,20 108,46"/><rect x="112" y="100" width="36" height="90"/><rect x="152" y="134" width="40" height="56"/></g><g fill="currentColor" opacity=".45"><rect x="52" y="96" width="6" height="8"/><rect x="64" y="96" width="6" height="8"/><rect x="52" y="112" width="6" height="8"/><rect x="64" y="112" width="6" height="8"/><rect x="118" y="110" width="6" height="8"/><rect x="132" y="110" width="6" height="8"/><rect x="86" y="60" width="6" height="8"/><rect x="96" y="60" width="6" height="8"/></g>`],
bowl:['料理',`<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M78 92c-8-12 8-18 0-32"/><path d="M100 86c-8-12 8-18 0-32"/><path d="M122 92c-8-12 8-18 0-32"/></g><g fill="currentColor"><path d="M34 112h132a66 52 0 0 1-132 0z"/><rect x="76" y="166" width="48" height="12" rx="3"/><rect x="132" y="56" width="14" height="78" rx="7" transform="rotate(32 139 95)"/></g><g fill="currentColor" opacity=".45"><path d="M40 112c10-40 18-58 30-74-6 22-10 46-12 74z"/><path d="M52 112c16-34 30-50 46-60-12 20-20 38-26 60z"/></g><path d="M150 168c14 2 26-6 30-20 2 12-8 28-28 26z" fill="currentColor" opacity=".8"/>`],
cup:['咖啡',`<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M82 84c-8-12 8-18 0-32"/><path d="M106 78c-8-12 8-18 0-32"/></g><g fill="currentColor"><path d="M46 98h112v34a48 48 0 0 1-48 48h-16a48 48 0 0 1-48-48z"/><rect x="30" y="182" width="144" height="8" rx="4"/></g><path d="M158 110h10a18 18 0 0 1 0 36h-12" fill="none" stroke="currentColor" stroke-width="9"/>`],
bag:['購物',`<path d="M120 116h64l6 74h-76z" fill="currentColor" opacity=".45"/><path d="M70 96V72a30 30 0 0 1 60 0v24" fill="none" stroke="currentColor" stroke-width="8"/><path d="M38 90h124l8 100H30z" fill="currentColor"/>`],
flower:['花',`<path d="M10 40 Q90 70 120 150 T180 196" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M80 66q20-22 40-18" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><g fill="currentColor"><g transform="translate(124 46)"><circle cy="-14" r="11"/><circle cx="13" cy="-4" r="11"/><circle cx="8" cy="12" r="11"/><circle cx="-8" cy="12" r="11"/><circle cx="-13" cy="-4" r="11"/></g><g transform="translate(150 118)" opacity=".8"><circle cy="-12" r="9"/><circle cx="11" cy="-4" r="9"/><circle cx="7" cy="10" r="9"/><circle cx="-7" cy="10" r="9"/><circle cx="-11" cy="-4" r="9"/></g><g transform="translate(58 92)" opacity=".6"><circle cy="-9" r="7"/><circle cx="8" cy="-3" r="7"/><circle cx="5" cy="8" r="7"/><circle cx="-5" cy="8" r="7"/><circle cx="-8" cy="-3" r="7"/></g></g>`],
elephant:['大象',`<g fill="currentColor" opacity=".38"><path d="M22 186V150c0-22 14-34 22-48 8 14 22 26 22 48v36z"/><rect x="42" y="74" width="4" height="30"/><circle cx="44" cy="72" r="3"/></g><g fill="currentColor"><ellipse cx="120" cy="138" rx="50" ry="32"/><circle cx="160" cy="116" r="24"/><rect x="82" y="150" width="14" height="38" rx="5"/><rect x="104" y="156" width="14" height="32" rx="5"/><rect x="132" y="154" width="14" height="34" rx="5"/></g><path d="M178 122c8 16 8 34 0 48" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round"/><ellipse cx="146" cy="120" rx="15" ry="20" fill="currentColor" opacity=".6"/><path d="M72 128c-8 6-10 16-8 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`],
boat:['船',`<circle cx="150" cy="54" r="26" fill="currentColor" opacity=".2"/><g fill="currentColor"><path d="M14 140q90 22 180-14l-6 14q-86 40-170 12z"/><polygon points="84,96 108,82 132,96"/><rect x="100" y="96" width="16" height="34" rx="6"/><circle cx="60" cy="130" r="9" opacity=".75"/><circle cx="76" cy="132" r="7" opacity=".6"/><circle cx="142" cy="128" r="8" opacity=".75"/></g><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".6"><path d="M8 172q16-8 32 0t32 0 32 0 32 0 32 0 32 0"/><path d="M28 188q16-8 32 0t32 0 32 0 32 0 32 0"/></g><path d="M116 106l40 34" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`],
plane:['飛機',`<path d="M24 170 Q96 140 146 76" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" opacity=".6"/><g fill="currentColor" transform="translate(150 70) rotate(-40)"><path d="M-44 -7H30Q48 0 30 7H-44Q-50 0-44-7z"/><path d="M-6-7L-26-46H-12L16-7z"/><path d="M-6 7L-26 46H-12L16 7z"/><path d="M-38-6L-50-24H-41L-28-6z"/><path d="M-38 6L-50 24H-41L-28 6z"/></g>`],
};
const svgArt=k=>`<svg viewBox="0 0 200 200" aria-hidden="true">${(ART[k]||ART.plane)[1]}</svg>`;
const DEFAULT_TRIP={title:'我的旅程',en:'Trip Notes',code:'',start:'',lang:'none',currency:'JPY',palette:'kyoto',example:false,
  days:[{word:'出發',en:'Day One',sub:'',color:'#6B7F3A',art:'plane'},{word:'漫遊',en:'Day Two',sub:'',color:'#A64B36',art:'city'},{word:'回程',en:'Day Three',sub:'',color:'#2E4A6B',art:'plane'}]};

/* ---------- 顏色計算：依主色自動決定文字與插畫顏色 ---------- */
const hex2rgb=h=>{const m=/^#?([0-9a-f]{6})$/i.exec(h||'');const n=m?parseInt(m[1],16):0x888888;return [n>>16&255,n>>8&255,n&255]};
const rgb2hex=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>{const x=hex2rgb(a),y=hex2rgb(b);return rgb2hex(x.map((v,i)=>v+(y[i]-v)*t))};
const lum=h=>{const c=hex2rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const CREAM='#F7F0E3',DARKINK='#2B1D12';
function dayTokens(d){
  const c=d.color||'#888888',on=contrast(c,CREAM)>=contrast(c,DARKINK)?CREAM:DARKINK;
  const art=d.artColor||(on===CREAM?mix(c,'#000000',.55):mix(c,'#FFFFFF',.68));
  const cd=mix(c,'#120E0B',.42),artD=d.artColor&&lum(d.artColor)>.3?d.artColor:mix(c,'#FFFFFF',.5);
  return {c,on,art,cd,onD:CREAM,artD};
}
function applyDayStyles(){
  const L=[],D=[];
  DAYS.forEach(d=>{const t=dayTokens(d);L.push(`--d${d.n}:${t.c};--d${d.n}-on:${t.on};--d${d.n}-art:${t.art}`);D.push(`--d${d.n}:${t.cd};--d${d.n}-on:${t.onD};--d${d.n}-art:${t.artD}`)});
  const css=`:root{${L.join(';')}}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${D.join(';')}}}:root[data-theme="dark"]{${D.join(';')}}`;
  let el=document.getElementById('day-tokens');if(!el){el=document.createElement('style');el.id='day-tokens';document.head.appendChild(el)}
  if(el.textContent!==css)el.textContent=css;
}

/* ---------- 狀態 ---------- */
const S={tab:'plan',day:1,trip:null,items:[],bookings:[],expenses:[],tips:[],phrases:[],settings:{},loaded:false,db:null,user:null,me:null,canWrite:false,dragging:false,anim:true,conv:{loc:'100'},moneyDay:null,welcomed:false};
let DAYS=[];
const WD='日一二三四五六';
function buildDays(){
  const t=S.trip||DEFAULT_TRIP;const base=/^\d{4}-\d{2}-\d{2}$/.test(t.start||'')?new Date(t.start+'T00:00:00'):null;
  DAYS=(t.days&&t.days.length?t.days:DEFAULT_TRIP.days).map((d,i)=>{
    let iso='',date='',dow='';
    if(base){const x=new Date(base);x.setDate(x.getDate()+i);iso=`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;date=`${x.getMonth()+1}/${x.getDate()}`;dow='週'+WD[x.getDay()]}
    return {...d,n:i+1,iso,date:date||`Day ${i+1}`,dow,word:d.word||`D${i+1}`};
  });
  if(S.day>DAYS.length)S.day=1;
  applyDayStyles();
}
const trip=()=>S.trip||DEFAULT_TRIP;
const L=()=>LANGS[trip().lang]||null;
const CUR=()=>CURS[trip().currency]||CURS.THB;
const curCode=()=>CURS[trip().currency]?trip().currency:'THB';

const dc=n=>n?`--c:var(--d${n});--on:var(--d${n}-on);--art:var(--d${n}-art)`:'--c:var(--ink);--on:var(--paper)';
const IC={map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Z"/><circle cx="12" cy="10" r="2"/></svg>',
grip:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>',
spk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 12 5 5 9-10"/></svg>',
link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/></svg>'};

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mins=t=>{const m=/^(\d{1,2}):(\d{2})/.exec(t||'');return m?(+m[1])*60+(+m[2]):null};
const rate=()=>+S.settings.rate>0?+S.settings.rate:CUR().rate;
const members=()=>Array.isArray(S.settings.members)?S.settings.members:[];
const fmtLoc=n=>CUR().sym+Math.round(n).toLocaleString('en-US');
const fmtTWD=n=>'NT$'+Math.round(n).toLocaleString('en-US');
const byOrder=(a,b)=>(a.order??0)-(b.order??0)||(mins(a.start)??9999)-(mins(b.start)??9999);
const dayItems=n=>S.items.filter(i=>+i.day===n).sort(byOrder);
const mapUrl=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const safeUrl=u=>/^https?:\/\//i.test(u||'')?u:'';
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const nextOrder=list=>{const o=list.map(x=>x.order??0);return (o.length?Math.max(...o):0)+1000};

function toast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,2400)}
function setSync(s,label){const el=$('#sync');el.dataset.s=s;el.querySelector('span').textContent=label}

/* ---------- 寫入 ---------- */
const queues={};
function write(path,fn){const q=(queues[path]||Promise.resolve()).then(fn).catch(onWriteErr);queues[path]=q;return q}
function clean(o){const c={...o};delete c.id;return c}
function stamp(o){o.updatedAt=Date.now();if(S.me)o.updatedBy=S.me;return o}
function saveDoc(col,id,data){if(!S.db)return;const ref=id?S.db.collection(col).doc(id):S.db.collection(col).doc();return write(ref.path,()=>ref.set(stamp({...data})))}
function patchDoc(col,id,data){if(!S.db)return;const ref=S.db.collection(col).doc(id);return write(ref.path,()=>ref.update(stamp({...data})))}
function delDoc(col,id){if(!S.db)return;const ref=S.db.collection(col).doc(id);return write(ref.path,()=>ref.delete())}
function batch(ops){if(!S.db)return;return write('batch',()=>S.db.batch(ops))}
function onWriteErr(e){
  if(e&&e.code==='quota_exceeded'){toast('資料已達上限，請刪除一些舊項目');return}
  toast('沒存到，請檢查網路後再試一次')}

/* ---------- 畫面 ---------- */
let rq=0;function renderSoon(){if(rq)return;rq=requestAnimationFrame(()=>{rq=0;render()})}
function renderHeader(){
  const t=trip(),first=DAYS[0],last=DAYS[DAYS.length-1];
  const yr=first&&first.iso?first.iso.slice(0,4):'';
  const range=first&&first.iso?`${first.date}–${last.date}`:`${DAYS.length} 天`;
  $('#brand-t').textContent=t.title||'旅誌';
  $('#brand-s').textContent=[yr,range,t.code].filter(Boolean).join(' · ');
  document.title=t.title||'旅誌';
  const lang=L(),tb=$('#tab-lang');tb.hidden=!lang;
  if(lang)tb.querySelector('span').textContent=lang.name;
  document.documentElement.style.setProperty('--tabs',lang?5:4);
}
function renderChips(){
  $('#chips').hidden=S.tab!=='plan';
  $('#chips').innerHTML=DAYS.map(d=>`<button class="chip" style="${dc(d.n)}" data-day="${d.n}" aria-pressed="${S.day===d.n}"><i></i><b>D${d.n}</b>${esc(d.date)} ${d.dow}</button>`).join('');
}
function paint(){const r=document.documentElement.style,n=S.day,plan=S.tab==='plan';
  r.setProperty('--c',plan?`var(--d${n})`:'var(--paper)');r.setProperty('--on',plan?`var(--d${n}-on)`:'var(--ink)');r.setProperty('--art',`var(--d${n}-art)`);r.setProperty('--accent',plan?`var(--d${n}-on)`:'var(--gold)')}
function render(){
  if(S.tab==='lang'&&!L())S.tab='plan';
  paint();renderHeader();renderChips();
  document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===S.tab));
  const m=$('#main');
  if(S.tab==='plan'){if(S.dragging)return;m.innerHTML=planView();bindSortable();S.anim=false}
  else if(S.tab==='book')m.innerHTML=bookView();
  else if(S.tab==='money')m.innerHTML=moneyView();
  else if(S.tab==='tips')m.innerHTML=tipsView();
  else m.innerHTML=langView();
}
function stateNote(){
  if(S.loaded===null)return `<div class="notice">連不上資料庫。請確認網址包含完整的分享密鑰（#k=…），再重新整理一次。</div>`;
  if(!S.loaded)return `<p class="empty">正在讀取大家共用的資料…</p>`;
  return '';
}
function planView(){
  const d=DAYS[S.day-1],list=dayItems(S.day);
  const starts=list.map(i=>i.start).filter(Boolean),ends=list.map(i=>i.end||i.start).filter(Boolean);
  const span=starts.length?`${starts[0]} – ${ends[ends.length-1]}`:'';
  let prev=null;
  const rows=list.map(it=>{
    let warn='';const s=mins(it.start);
    if(prev&&s!=null){const ps=mins(prev.start),pe=mins(prev.end);
      if(ps!=null&&s<ps)warn='時間比上一項早';else if(pe!=null&&s<pe)warn='和上一項時間重疊';}
    if(s!=null)prev=it;
    const leg=[it.moveMode,it.moveTime].filter(Boolean).map(esc).join(' · ');
    return `<li class="row" data-id="${esc(it.id)}">${leg?`<div class="leg"><span>${leg}</span></div>`:''}
      <div class="time ${it.start?'':'none'}">${it.start?esc(it.start):'未定'}${it.end?`<small>– ${esc(it.end)}</small>`:''}</div>
      <div class="body" data-edit="item" data-id="${esc(it.id)}">
        <div class="title">${esc(it.title)}</div>
        ${it.note?`<div class="note">${esc(it.note)}</div>`:''}
        ${(it.place||warn)?`<div class="meta">${warn?`<span class="pill warn">${warn}</span>`:''}${it.place?`<a class="pill" href="${mapUrl(it.place)}" target="_blank" rel="noopener">${IC.map}地圖</a>`:''}</div>`:''}
      </div>
      <button type="button" class="grip" aria-label="拖曳排序">${IC.grip}</button>
    </li>`}).join('');
  const tips=S.tips.filter(t=>+t.scope===S.day).sort(byOrder);
  return `<section class="hero ${S.anim?'anim':''}" id="hero" style="${dc(d.n)}">
      <div class="eyebrow">${esc(trip().en||'Trip Notes')} · ${String(d.n).padStart(2,'0')}</div>
      <div class="en latin-it">${esc(d.en||'')}</div>
      <div class="vert">${esc(d.date)}${d.dow?'　'+d.dow:''}</div>
      ${svgArt(d.art)}
      <div class="big">${esc(d.word)}</div>
    </section>
    <div class="gutter">
      <div class="daymeta"><h2>${esc(d.sub||'')}</h2><span class="sum tnum">${list.length} 項${span?' · '+span:''}</span></div>
      ${stateNote()}
      <ul class="list" id="list">${rows}</ul>
      ${S.loaded&&!list.length?`<p class="empty">這天還沒有行程，點下方新增第一個。</p>`:''}
      ${S.db?`<button class="add" type="button" data-new="item">＋ 新增行程到 Day ${d.n}</button>`:''}
      ${tips.length?`<div class="daytips"><h3>這天的提醒</h3>${tips.map(t=>`<p><b>${esc(t.title)}</b>${esc(t.body)}</p>`).join('')}</div>`:''}
    </div>`;
}
let sortable=null;
function bindSortable(){
  sortable?.destroy();sortable=null;const el=$('#list');if(!el||!window.Sortable||!S.canWrite)return;
  sortable=Sortable.create(el,{handle:'.grip',animation:180,forceFallback:true,fallbackTolerance:3,ghostClass:'ghost',chosenClass:'chosen',
    onStart(){S.dragging=true},
    onEnd(ev){
      S.dragging=false;
      if(ev.oldIndex===ev.newIndex){render();return}
      const ids=[...el.children].map(li=>li.dataset.id),id=ev.item.dataset.id,i=ids.indexOf(id);
      const find=x=>S.items.find(t=>t.id===x);
      const a=i>0?find(ids[i-1]).order??0:null,b=i<ids.length-1?find(ids[i+1]).order??0:null;
      const order=a==null?b-1000:b==null?a+1000:(a+b)/2;
      const it=find(id);it.order=order;render();
      patchDoc('items',id,{order});
    }});
}
function bookView(){
  const list=[...S.bookings].sort((x,y)=>(!!x.done-!!y.done)||((+x.day||0)-(+y.day||0))||byOrder(x,y));
  const done=list.filter(b=>b.done).length;
  return `<div class="gutter"><div class="page-h"><div class="eyebrow">Reservations</div><h1>待預約</h1>
    <p class="tnum">已完成 ${done} / ${list.length}　出發前逐項確認</p><div class="bar"><i style="width:${list.length?done/list.length*100:0}%"></i></div></div>
    ${stateNote()}
    ${list.map(b=>`<div class="bk ${b.done?'done':''}">
      <button type="button" class="check" data-toggle="${esc(b.id)}" aria-label="${b.done?'標記為未完成':'標記為已完成'}">${IC.ok}</button>
      <div class="body" data-edit="booking" data-id="${esc(b.id)}">
        <div class="title"><span class="daytag" style="${dc(+b.day)}">${+b.day?'D'+b.day:'全程'}</span>${esc(b.title)}</div>
        ${b.note?`<div class="note" style="color:var(--mut);font-size:13px;white-space:pre-line">${esc(b.note)}</div>`:''}
        ${safeUrl(b.link)?`<div class="meta" style="margin-top:6px"><a class="pill" href="${esc(safeUrl(b.link))}" target="_blank" rel="noopener">${IC.link}開啟連結</a></div>`:''}
      </div></div>`).join('')}
    ${S.loaded&&!list.length?`<p class="empty">還沒有待預約項目。</p>`:''}
    ${S.db?`<button class="add" type="button" data-new="booking">＋ 新增待預約</button>`:''}</div>`;
}
const locOf=e=>e.currency==='TWD'?(+e.amount||0)/rate():(+e.amount||0);
function balances(){
  const ms=members(),bal=Object.fromEntries(ms.map(m=>[m,0]));
  for(const e of S.expenses){
    const v=locOf(e),split=(e.split||[]).filter(m=>m in bal);if(!split.length)continue;
    if(e.payer in bal)bal[e.payer]+=v;
    split.forEach(m=>bal[m]-=v/split.length);
  }
  const cr=[],db=[];for(const [m,v] of Object.entries(bal)){if(v>0.5)cr.push([m,v]);else if(v<-0.5)db.push([m,-v])}
  cr.sort((a,b)=>b[1]-a[1]);db.sort((a,b)=>b[1]-a[1]);const xs=[];let i=0,j=0;
  while(i<db.length&&j<cr.length){const v=Math.min(db[i][1],cr[j][1]);xs.push([db[i][0],cr[j][0],v]);db[i][1]-=v;cr[j][1]-=v;if(db[i][1]<0.5)i++;if(cr[j][1]<0.5)j++}
  return {bal,xs};
}
function moneyView(){
  const r=rate(),ms=members(),{bal,xs}=balances(),C=CUR(),code=curCode();
  const total=S.expenses.reduce((s,e)=>s+locOf(e),0);
  const per=[0,...DAYS.map(d=>d.n)].map(n=>S.expenses.filter(e=>(+e.day||0)===n).reduce((s,e)=>s+locOf(e),0)),peak=Math.max(...per,1);
  const md=S.moneyDay;
  const list=[...S.expenses].filter(e=>md==null||(+e.day||0)===md).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  const loc=S.conv.loc,twd=loc===''?'':(Math.round(+loc*r*100)/100);
  return `<div class="gutter"><div class="page-h"><div class="eyebrow">Money &amp; Bills</div><h1>記帳</h1>
    <p class="tnum">共 ${list.length} 筆 · ${fmtLoc(total)} ≈ ${fmtTWD(total*r)}</p></div>
    <div class="stack">
    <div class="card"><div class="conv">
      <div><label for="cv-loc">${C.name} ${code}</label><input id="cv-loc" inputmode="decimal" value="${esc(loc)}"></div><span>=</span>
      <div><label for="cv-twd">台幣 TWD</label><input id="cv-twd" inputmode="decimal" value="${esc(twd)}"></div></div>
      <div class="rate-note tnum">匯率 1 ${code} = ${r} TWD（在下方設定修改，出發前請更新）</div></div>
    ${stateNote()}
    ${ms.length?`<div class="card"><h3 class="h3">誰該收、誰該付（台幣）</h3><div class="bal">${ms.map(m=>`<div>${esc(m)}</div><div>${bal[m]>0.5?'<small>應收</small>':bal[m]<-0.5?'<small>應付</small>':''}${fmtTWD(Math.abs(bal[m])*r)}</div>`).join('')}</div>
      ${xs.length?`<h3 class="h3" style="margin-top:16px">建議轉帳</h3>${xs.map(([a,b,v])=>`<div class="xfer">${esc(a)} → ${esc(b)}　<b class="tnum">${fmtTWD(v*r)}</b> <span style="color:var(--mut)">(${fmtLoc(v)})</span></div>`).join('')}`:''}</div>`:''}
    ${S.expenses.length?`<div class="card"><h3 class="h3">每天花了多少（台幣，點一天篩選）</h3><div class="days">
      ${[...DAYS.map(d=>d.n),0].filter(n=>n||per[0]>0).map(n=>`<button type="button" class="dbar ${md!=null&&md!==n?'dim':''}" style="${dc(n)}" data-mday="${n}" aria-pressed="${md===n}"><b>${n?'D'+n:'全程'}</b><span class="track"><i style="width:${per[n]/peak*100}%"></i></span><span class="v">${per[n]?fmtTWD(per[n]*r):'—'}</span></button>`).join('')}
      </div></div>`:''}
    <div>
      ${S.db?`<button class="add" style="margin-top:0" type="button" data-new="expense">＋ 記一筆</button>`:''}
      ${md!=null?`<div class="filter-note"><span>只顯示 ${md?'Day '+md:'全程'} 的 ${list.length} 筆 · ${fmtTWD(per[md]*r)}</span><button type="button" data-mday="clear">顯示全部</button></div>`:''}
      ${list.map(e=>{const amt=+e.amount||0,isT=e.currency==='TWD';return `<div class="ex" data-edit="expense" data-id="${esc(e.id)}">
        <div><b>${esc(e.title)}</b><br><small>${+e.day?'D'+e.day+' · ':''}${esc(e.payer||'?')} 付 · ${(e.split||[]).length===ms.length?'全員':esc((e.split||[]).join('、'))}分</small></div>
        <div class="amt">${isT?fmtTWD(amt):fmtLoc(amt)}<br><small>${isT?fmtLoc(amt/r):'≈ '+fmtTWD(amt*r)}</small></div></div>`}).join('')}
      ${S.loaded&&!list.length?`<p class="empty">還沒有支出。點「記一筆」開始記錄。</p>`:''}
    </div>
    ${S.db?`<details class="card edit-only"><summary>設定：匯率與成員</summary>
      <div class="field"><label for="set-rate">1 ${C.name} = ? 台幣</label><input id="set-rate" inputmode="decimal" value="${esc(S.settings.rate??'')}" placeholder="${C.rate}"></div>
      <div class="field"><label for="set-mem">成員（用頓號或逗號分開）</label><input id="set-mem" value="${esc(ms.join('、'))}"></div></details>`:''}
    </div></div>`;
}
function tipsView(){
  const groups=[0,...DAYS.map(d=>d.n)].map(n=>({n,list:S.tips.filter(t=>(+t.scope||0)===n).sort(byOrder)})).filter(g=>g.list.length);
  return `<div class="gutter"><div class="page-h"><div class="eyebrow">Field Notes</div><h1>提醒</h1><p>營業時間、服裝規定、交通細節，出發前再確認一次。</p></div>
    ${stateNote()}
    ${groups.map(g=>`<div class="group-h" style="${dc(g.n)}"><i></i>${g.n?`Day ${g.n}　${esc(DAYS[g.n-1].word)}`:'全程'}</div>
      ${g.list.map(t=>`<div class="tip" data-edit="tip" data-id="${esc(t.id)}"><b>${esc(t.title)}</b><p>${esc(t.body)}</p></div>`).join('')}`).join('')}
    ${S.loaded&&!groups.length?`<p class="empty">還沒有提醒。</p>`:''}
    ${S.db?`<button class="add" type="button" data-new="tip">＋ 新增提醒</button>`:''}</div>`;
}

/* ---------- 當地語言 ---------- */
const CATS=['禮貌','餐廳','按摩','購物','交通','求助'];
const langPhrases=()=>{const l=trip().lang;return S.phrases.filter(p=>(p.lang||'th')===l)};
function langView(){
  const lang=L(),ps=langPhrases();
  const cats=[...new Set([...CATS,...ps.map(p=>p.cat||'其他')])];
  const groups=cats.map(c=>({c,list:ps.filter(p=>(p.cat||'其他')===c).sort(byOrder)})).filter(g=>g.list.length);
  return `<div class="gutter"><div class="page-h"><div class="eyebrow">Speak a Little ${esc(lang.en)}</div><h1>${lang.name}</h1><p>點喇叭聽發音；點句子放大，直接拿給店家或司機看。</p></div>
    ${stateNote()}
    ${groups.map(g=>`<div class="group-h">${esc(g.c)}</div>${g.list.map(p=>`<div class="ph"><button type="button" class="ph-main" data-ph="${esc(p.id)}"><b>${esc(p.zh)}</b><span class="th" lang="${trip().lang}">${esc(p.th)}</span><small>${esc([p.say,p.roman].filter(Boolean).join(' · '))}</small></button><button type="button" class="say-btn" data-say="${esc(p.id)}" aria-label="播放「${esc(p.zh)}」的${lang.name}發音">${IC.spk}</button></div>`).join('')}`).join('')}
    ${S.loaded&&!groups.length?`<p class="empty">還沒有句子，點下方新增。</p>`:''}
    ${S.db?`<button class="add" type="button" data-new="phrase">＋ 新增句子</button>`:''}</div>`;
}
/* 發音：用手機內建的語音朗讀（Web Speech API） */
const tts=window.speechSynthesis||null;let ttsHinted=false;
function voiceFor(tag){if(!tts)return null;const p=tag.slice(0,2).toLowerCase(),vs=tts.getVoices().filter(v=>v.lang.toLowerCase().replace('_','-').startsWith(p));return vs.find(v=>v.localService)||vs[0]||null}
if(tts)tts.addEventListener?.('voiceschanged',()=>{});else document.documentElement.classList.add('no-tts');
function speak(id,r,btn){
  const p=S.phrases.find(x=>x.id===id),lang=L();if(!p||!tts||!lang)return;
  tts.cancel();document.querySelectorAll('[data-say].on').forEach(b=>b.classList.remove('on'));
  const u=new SpeechSynthesisUtterance(p.th.replace(/[／/]/g,' , ')),v=voiceFor(lang.tts);
  u.lang=lang.tts;if(v)u.voice=v;u.rate=r||0.85;
  u.onend=u.onerror=()=>btn&&btn.classList.remove('on');
  if(btn)btn.classList.add('on');
  tts.speak(u);
  if(!v&&!ttsHinted&&tts.getVoices().length){ttsHinted=true;toast(`沒聲音的話，到手機設定下載「${lang.script}」語音`)}
}
function openBig(id){const p=S.phrases.find(x=>x.id===id);if(!p)return;const b=$('#big');
  b.innerHTML=`<div class="th" lang="${trip().lang}">${esc(p.th)}</div><div class="zh">${esc(p.zh)}</div><div class="say">${esc([p.say,p.roman].filter(Boolean).join(' · '))}</div>
  <div class="acts"><button type="button" data-say="${esc(p.id)}">${IC.spk}播放</button><button type="button" data-say="${esc(p.id)}" data-rate="0.55">慢速</button><button type="button" data-bigclose>關閉</button>${S.canWrite?`<button type="button" data-edit="phrase" data-id="${esc(p.id)}">編輯</button>`:''}</div>`;
  b.hidden=false}

/* ---------- 編輯表單 ---------- */
const dayOpts=(sel,withAll)=>(withAll?[`<option value="0" ${+sel===0?'selected':''}>全程</option>`]:[]).concat(DAYS.map(d=>`<option value="${d.n}" ${+sel===d.n?'selected':''}>Day ${d.n}　${esc(d.date)} ${esc(d.word)}</option>`)).join('');
let cur=null;
function showPanel(h){$('#panel').innerHTML=h;$('#sheet').hidden=false}
async function openSheet(kind,id){
  if(!S.canWrite)return;
  if(kind==='trip')return openSetup();
  const col={item:'items',booking:'bookings',expense:'expenses',tip:'tips',phrase:'phrases'}[kind];
  const doc=id?S[col].find(x=>x.id===id):null;if(id&&!doc)return;
  cur={kind,col,id,doc:doc||{}};const d=cur.doc,ms=members(),code=curCode(),lang=L();
  let h=`<div class="handle"></div><h2>${id?'編輯':'新增'}${{item:'行程',booking:'待預約',expense:'支出',tip:'提醒',phrase:(lang?lang.name:'')+'句子'}[kind]}</h2><div class="who" id="who"></div>`;
  if(kind==='item')h+=`
    <div class="two"><div class="field"><label for="f-start">開始</label><input type="time" id="f-start" value="${esc(d.start||'')}"></div>
    <div class="field"><label for="f-end">結束（可留空）</label><input type="time" id="f-end" value="${esc(d.end||'')}"></div></div>
    <div class="field"><label for="f-title">行程</label><input id="f-title" required value="${esc(d.title||'')}" placeholder="例：逛夜市"></div>
    <div class="two"><div class="field"><label for="f-mode">交通（怎麼到這裡）</label><input id="f-mode" list="modes" value="${esc(d.moveMode||'')}" placeholder="地鐵、計程車…"></div>
    <div class="field"><label for="f-mtime">車程</label><input id="f-mtime" value="${esc(d.moveTime||'')}" placeholder="約 20 分"></div></div>
    <datalist id="modes"><option>地鐵</option><option>公車</option><option>計程車</option><option>Grab／Uber</option><option>包車</option><option>步行</option><option>火車</option><option>船</option><option>飛機</option></datalist>
    <div class="field"><label for="f-place">地點（Google 地圖搜尋用，可留空）</label><input id="f-place" value="${esc(d.place||'')}" placeholder="例：景點或店家名稱"></div>
    <div class="field"><label for="f-note">備註</label><textarea id="f-note">${esc(d.note||'')}</textarea></div>
    <div class="field"><label for="f-day">放在哪一天（選別天就會搬過去）</label><select id="f-day">${dayOpts(d.day||S.day)}</select></div>`;
  if(kind==='booking')h+=`
    <div class="field"><label for="f-title">項目</label><input id="f-title" value="${esc(d.title||'')}" placeholder="例：餐廳訂位"></div>
    <div class="field"><label for="f-day">哪一天</label><select id="f-day">${dayOpts(d.day??0,true)}</select></div>
    <div class="field"><label for="f-note">要確認的事</label><textarea id="f-note">${esc(d.note||'')}</textarea></div>
    <div class="field"><label for="f-link">預約連結（可留空）</label><input id="f-link" type="url" inputmode="url" value="${esc(d.link||'')}" placeholder="https://"></div>`;
  if(kind==='expense'){const split=id?(d.split||[]):ms,cc=d.currency==='TWD'?'TWD':code;h+=`
    <div class="field"><label for="f-title">項目</label><input id="f-title" value="${esc(d.title||'')}" placeholder="例：晚餐"></div>
    <div class="two"><div class="field"><label for="f-amt">金額</label><input id="f-amt" inputmode="decimal" value="${esc(d.amount??'')}"></div>
    <div class="field"><span>幣別</span><div class="seg" id="f-cur">${[code,'TWD'].map(c=>`<button type="button" data-v="${c}" aria-pressed="${cc===c}">${c==='TWD'?'台幣':CUR().name}</button>`).join('')}</div></div></div>
    <div class="field"><label for="f-payer">誰付的</label><select id="f-payer">${ms.map(m=>`<option ${d.payer===m?'selected':''}>${esc(m)}</option>`).join('')}</select></div>
    <div class="field"><span>誰要分（預設全員）</span><div class="seg" id="f-split">${ms.map(m=>`<button type="button" data-v="${esc(m)}" aria-pressed="${split.includes(m)}">${esc(m)}</button>`).join('')}</div></div>
    <div class="field"><label for="f-day">哪一天</label><select id="f-day">${dayOpts(d.day??(S.day||0),true)}</select></div>`}
  if(kind==='phrase')h+=`
    <div class="field"><label for="f-cat">分類</label><input id="f-cat" list="cats" value="${esc(d.cat||'')}" placeholder="餐廳"><datalist id="cats">${CATS.map(c=>`<option>${c}</option>`).join('')}</datalist></div>
    <div class="field"><label for="f-title">中文</label><input id="f-title" value="${esc(d.zh||'')}" placeholder="例：不要辣"></div>
    <div class="field"><label for="f-th">${lang?lang.script:'外文'}</label><input id="f-th" lang="${trip().lang}" value="${esc(d.th||'')}"></div>
    <div class="two"><div class="field"><label for="f-say">中文諧音</label><input id="f-say" value="${esc(d.say||'')}"></div>
    <div class="field"><label for="f-roman">羅馬拼音</label><input id="f-roman" value="${esc(d.roman||'')}"></div></div>`;
  if(kind==='tip')h+=`
    <div class="field"><label for="f-day">適用</label><select id="f-day">${dayOpts(d.scope??S.day,true)}</select></div>
    <div class="field"><label for="f-title">標題</label><input id="f-title" value="${esc(d.title||'')}"></div>
    <div class="field"><label for="f-note">內容</label><textarea id="f-note">${esc(d.body||'')}</textarea></div>`;
  h+=`<div class="actions"><button class="btn primary" type="submit">儲存</button><button class="btn" type="button" data-close>取消</button>${id?`<button class="btn danger" type="button" id="f-del">刪除</button>`:''}</div>`;
  showPanel(h);
  if(!id)setTimeout(()=>$('#f-title')?.focus(),50);
  if(d.updatedBy){const t=d.updatedAt?new Date(d.updatedAt).toLocaleString('zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';const w=$('#who');if(w)w.textContent=`最後由 ${d.updatedBy} 修改${t?' · '+t:''}`}
}
function closeSheet(){$('#sheet').hidden=true;cur=null}
function val(id){return ($(id)?.value??'').trim()}
function submitSheet(){
  if(!cur)return;
  if(cur.kind==='trip')return saveSetup();
  const {kind,col,id,doc}=cur;const title=val('#f-title');
  if(!title){toast('請先填寫名稱');$('#f-title')?.focus();return}
  if(kind==='item'){
    const day=+val('#f-day');let order=doc.order;
    if(!id||+doc.day!==day)order=nextOrder(dayItems(day).filter(i=>i.id!==id));
    saveDoc(col,id,{...clean(doc),day,order,start:val('#f-start'),end:val('#f-end'),title,place:val('#f-place'),note:val('#f-note'),moveMode:val('#f-mode'),moveTime:val('#f-mtime')});
    if(day!==S.day&&id)toast(`已搬到 Day ${day}`);
  }
  if(kind==='booking')saveDoc(col,id,{...clean(doc),title,day:+val('#f-day'),note:val('#f-note'),link:val('#f-link'),done:!!doc.done,order:doc.order??nextOrder(S.bookings)});
  if(kind==='expense'){
    const amount=parseFloat(val('#f-amt').replace(/,/g,''));if(!(amount>0)){toast('金額要大於 0');$('#f-amt').focus();return}
    const currency=$('#f-cur [aria-pressed="true"]')?.dataset.v||curCode();
    const split=[...document.querySelectorAll('#f-split [aria-pressed="true"]')].map(b=>b.dataset.v);
    if(!split.length){toast('至少選一個人分攤');return}
    saveDoc(col,id,{...clean(doc),title,amount,currency,payer:val('#f-payer'),split,day:+val('#f-day'),createdAt:doc.createdAt||Date.now()});
  }
  if(kind==='phrase'){if(!val('#f-th')){toast('請填外文句子');$('#f-th').focus();return}
    saveDoc(col,id,{...clean(doc),lang:doc.lang||trip().lang,cat:val('#f-cat')||'其他',zh:title,th:val('#f-th'),say:val('#f-say'),roman:val('#f-roman'),order:doc.order??nextOrder(langPhrases())})}
  if(kind==='tip')saveDoc(col,id,{...clean(doc),scope:+val('#f-day'),title,body:val('#f-note'),order:doc.order??nextOrder(S.tips)});
  closeSheet();toast('已儲存，大家都看得到');
}

/* ---------- 旅程設定 ---------- */
function openSetup(){
  const t=JSON.parse(JSON.stringify(trip()));
  t.days=(t.days||[]).map((d,i)=>({...d,from:i+1}));
  if(!t.days.length)t.days=DEFAULT_TRIP.days.map(d=>({...d}));
  cur={kind:'trip',draft:t,members:members().join('、')};
  renderSetup();
}
function renderSetup(){
  const t=cur.draft,pal=PALETTES[t.palette]||null,sw=pal?pal.colors:Object.values(PALETTES).flatMap(p=>p.colors).slice(0,8);
  const h=`<div class="handle"></div><h2>旅程設定</h2><div class="who">這裡的修改，所有拿到連結的旅伴都會看到。</div>
    <div class="field"><label for="t-title">旅程名稱</label><input id="t-title" data-k="title" value="${esc(t.title)}" placeholder="例：京都三日遊"></div>
    <div class="two"><div class="field"><label for="t-en">英文小標</label><input id="t-en" data-k="en" value="${esc(t.en)}" placeholder="Kyoto Notes"></div>
    <div class="field"><label for="t-code">城市代碼（可留空）</label><input id="t-code" data-k="code" value="${esc(t.code)}" placeholder="KIX"></div></div>
    <div class="field"><label for="t-start">出發日期</label><input id="t-start" type="date" data-k="start" value="${esc(t.start)}"></div>
    <div class="two"><div class="field"><label for="t-lang">當地語言分頁</label><select id="t-lang" data-k="lang">${[['none','不需要'],...Object.entries(LANGS).map(([k,v])=>[k,v.name])].map(([k,n])=>`<option value="${k}" ${t.lang===k?'selected':''}>${n}</option>`).join('')}</select></div>
    <div class="field"><label for="t-cur">當地貨幣</label><select id="t-cur" data-k="currency">${Object.entries(CURS).map(([k,v])=>`<option value="${k}" ${t.currency===k?'selected':''}>${v.name} ${k}</option>`).join('')}</select></div></div>
    <div class="field"><label for="t-mem">旅伴（用頓號或逗號分開，記帳與「你是誰」會用到）</label><input id="t-mem" value="${esc(cur.members)}" placeholder="小明、小美"></div>
    <h3 class="sec">配色組（一鍵套用到每一天）</h3>
    <div class="pals">${Object.entries(PALETTES).map(([k,p])=>`<button type="button" class="pal" data-pal="${k}" aria-pressed="${t.palette===k}"><b>${p.name}</b><span>${p.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span></button>`).join('')}</div>
    <h3 class="sec">每一天</h3>
    ${t.days.map((d,i)=>`<div class="dayrow">
      <div class="dayrow-h"><b><i style="background:${esc(d.color)}"></i>Day ${i+1}</b>${t.days.length>1?`<button type="button" data-delday="${i}">刪除這天</button>`:''}</div>
      <div class="two"><div class="field"><label for="dw-${i}">封面大字（2 字最好看）</label><input id="dw-${i}" data-k="days.${i}.word" maxlength="4" value="${esc(d.word)}"></div>
      <div class="field"><label for="de-${i}">英文副標</label><input id="de-${i}" data-k="days.${i}.en" value="${esc(d.en||'')}"></div></div>
      <div class="field"><label for="ds-${i}">當天主題</label><input id="ds-${i}" data-k="days.${i}.sub" value="${esc(d.sub||'')}" placeholder="例：抵達、逛市區"></div>
      <div class="field"><span>顏色</span><div class="swatches">${sw.map(c=>`<button type="button" data-swatch="${i}" data-c="${c}" style="background:${c}" aria-label="顏色 ${c}" aria-pressed="${(d.color||'').toLowerCase()===c.toLowerCase()}"></button>`).join('')}<input type="color" id="dc-${i}" data-k="days.${i}.color" value="${esc(d.color||'#888888')}" aria-label="自訂顏色"></div></div>
      <div class="field"><span>插畫</span><div class="artpick">${Object.entries(ART).map(([k,a])=>`<button type="button" data-art="${i}" data-a="${k}" aria-pressed="${d.art===k}">${svgArt(k)}${a[0]}</button>`).join('')}</div></div>
    </div>`).join('')}
    ${t.days.length<14?`<button type="button" class="adddays" data-addday>＋ 加一天</button>`:''}
    ${t.example?`<h3 class="sec">範例資料</h3><button type="button" class="btn danger" id="t-clear" style="width:100%">清空範例行程、預約、提醒與記帳</button>`:''}
    <div class="actions"><button class="btn primary" type="submit">儲存設定</button><button class="btn" type="button" data-close>取消</button></div>`;
  const sc=$('#panel').scrollTop;showPanel(h);$('#panel').scrollTop=sc;
}
function setDraft(k,v){const ks=k.split('.');let o=cur.draft;for(let i=0;i<ks.length-1;i++)o=o[ks[i]];o[ks[ks.length-1]]=v}
function saveSetup(){
  const t=cur.draft;
  if(!t.title.trim()){toast('請填旅程名稱');$('#t-title').focus();return}
  if(!t.days.length){toast('至少要有一天');return}
  // 刪掉的天：行程必須先搬走；預約、提醒、支出改成「全程」。保留的天依新位置重新編號。
  const map={};t.days.forEach((d,i)=>{if(d.from)map[d.from]=i+1});
  for(const n of DAYS.map(d=>d.n))if(!map[n]&&dayItems(n).length){toast(`Day ${n} 還有 ${dayItems(n).length} 個行程，請先搬到別天或刪除`);return}
  const ops=[];
  const remap=(col,f)=>S[col].forEach(x=>{const o=+x[f]||0;if(!o)return;const nn=map[o]||0;if(nn!==o)ops.push({op:'patch',col,id:x.id,data:{[f]:nn}})});
  remap('items','day');remap('bookings','day');remap('tips','scope');remap('expenses','day');
  const days=t.days.map(({from,...d})=>({...d,word:(d.word||'').trim()||'Day',en:(d.en||'').trim(),sub:(d.sub||'').trim()}));
  const tripDoc={...clean(trip()),...t,days,title:t.title.trim(),en:(t.en||'').trim()||'Trip Notes',code:(t.code||'').trim()};
  ops.push({op:'put',col:'meta',id:'trip',data:stamp(tripDoc)});
  const ms=[...new Set(val('#t-mem').split(/[、,，\s]+/).map(s=>s.trim()).filter(Boolean))];
  const curChanged=t.currency!==trip().currency;
  const settings={...S.settings,members:ms,...(curChanged?{rate:CURS[t.currency]?.rate}:{})};
  ops.push({op:'put',col:'meta',id:'settings',data:stamp(settings)});
  batch(ops);closeSheet();S.day=Math.min(S.day,days.length);S.anim=true;
  toast(curChanged?'已儲存。貨幣換了，記得到「記帳」更新匯率':'旅程設定已儲存');
}
function clearExample(){
  const ops=[];
  for(const col of ['items','bookings','tips','expenses'])S[col].forEach(x=>ops.push({op:'delete',col,id:x.id}));
  const t={...clean(trip()),example:false};
  ops.push({op:'put',col:'meta',id:'trip',data:stamp(t)});
  return batch(ops);
}
function showWelcome(){
  cur={kind:'welcome'};
  showPanel(`<div class="handle"></div><div class="welcome"><h2>歡迎使用旅誌</h2>
    <p>現在看到的是<b>曼谷五天四夜</b>的範例行程，可以先逛逛每個分頁，了解怎麼用。</p>
    <p>準備好之後，清空範例，再填上你自己的旅程名稱、日期與每天的主題。之後隨時可以點右上角的齒輪修改。</p>
    <div class="actions"><button class="btn primary" type="button" id="w-start">清空範例，建立我的旅程</button><button class="btn" type="button" id="w-later">先看看範例</button></div></div>`);
}

/* ---------- 事件 ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-day],[data-tab],[data-edit],[data-new],[data-toggle],[data-close],[data-ph],[data-say],[data-mday],[data-bigclose],[data-pal],[data-swatch],[data-art],[data-addday],[data-delday],#gear,#f-del,#t-clear,#w-start,#w-later,.seg button');
  if(!t)return;
  if(t.dataset.day){S.day=+t.dataset.day;S.anim=true;store.set('trip.day',S.day);render();window.scrollTo({top:0});return}
  if(t.dataset.tab){S.tab=t.dataset.tab;store.set('trip.tab',S.tab);render();window.scrollTo({top:0});return}
  if(e.target.closest('a'))return;
  if(t.id==='gear'){openSetup();return}
  if(t.dataset.ph){openBig(t.dataset.ph);return}
  if(t.dataset.say){speak(t.dataset.say,+t.dataset.rate||0,t);return}
  if(t.hasAttribute('data-bigclose')){$('#big').hidden=true;tts&&tts.cancel();return}
  if(t.dataset.mday){const v=t.dataset.mday==='clear'?null:+t.dataset.mday;S.moneyDay=S.moneyDay===v?null:v;render();return}
  if(t.dataset.edit){$('#big').hidden=true;openSheet(t.dataset.edit,t.dataset.id);return}
  if(t.dataset.new){openSheet(t.dataset.new);return}
  if(t.dataset.toggle){const b=S.bookings.find(x=>x.id===t.dataset.toggle);if(b){b.done=!b.done;render();patchDoc('bookings',b.id,{done:b.done})}return}
  if(t.hasAttribute('data-close')){closeSheet();return}
  if(t.id==='f-del'){if(!t.classList.contains('armed')){t.classList.add('armed');t.textContent='確定刪除？';return}
    delDoc(cur.col,cur.id);closeSheet();toast('已刪除');return}
  if(t.dataset.pal){const p=PALETTES[t.dataset.pal],d=cur.draft;d.palette=t.dataset.pal;d.days.forEach((x,i)=>{x.color=p.colors[i%p.colors.length];const a=p.art&&p.art[i%p.colors.length];if(a)x.artColor=a;else delete x.artColor});renderSetup();return}
  if(t.dataset.swatch){const x=cur.draft.days[+t.dataset.swatch];x.color=t.dataset.c;delete x.artColor;renderSetup();return}
  if(t.dataset.art){cur.draft.days[+t.dataset.art].art=t.dataset.a;renderSetup();return}
  if(t.hasAttribute('data-addday')){const d=cur.draft,p=PALETTES[d.palette],i=d.days.length;d.days.push({word:'',en:'',sub:'',color:p?p.colors[i%p.colors.length]:'#6B7F3A',art:'city'});renderSetup();return}
  if(t.dataset.delday){const i=+t.dataset.delday,d=cur.draft.days[i];if(d.from&&dayItems(d.from).length){toast(`這天還有 ${dayItems(d.from).length} 個行程，請先搬到別天或刪除`);return}cur.draft.days.splice(i,1);renderSetup();return}
  if(t.id==='t-clear'){if(!t.classList.contains('armed')){t.classList.add('armed');t.textContent='確定清空？清掉就救不回來';return}
    clearExample();cur.draft.example=false;cur.draft.days.forEach(d=>delete d.from);toast('範例已清空');renderSetup();return}
  if(t.id==='w-start'){store.set('trip.welcomed','1');clearExample();cur={kind:'trip',draft:JSON.parse(JSON.stringify(DEFAULT_TRIP)),members:''};renderSetup();return}
  if(t.id==='w-later'){store.set('trip.welcomed','1');closeSheet();return}
  if(t.closest('.seg')){const seg=t.closest('.seg');if(seg.id==='f-cur')seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===t));else t.setAttribute('aria-pressed',t.getAttribute('aria-pressed')!=='true')}
});
$('#panel').addEventListener('submit',e=>{e.preventDefault();submitSheet()});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!$('#sheet').hidden)closeSheet();else $('#big').hidden=true});
document.addEventListener('input',e=>{
  if(cur&&cur.kind==='trip'&&e.target.dataset.k){setDraft(e.target.dataset.k,e.target.value);if(e.target.type==='color'){const m=/^days\.(\d+)/.exec(e.target.dataset.k);if(m)delete cur.draft.days[+m[1]].artColor}return}
  if(cur&&cur.kind==='trip'&&e.target.id==='t-mem'){cur.members=e.target.value;return}
  const r=rate();
  if(e.target.id==='cv-loc'){S.conv.loc=e.target.value;const v=parseFloat(e.target.value);$('#cv-twd').value=isNaN(v)?'':Math.round(v*r*100)/100}
  if(e.target.id==='cv-twd'){const v=parseFloat(e.target.value);S.conv.loc=isNaN(v)?'':String(Math.round(v/r*100)/100);$('#cv-loc').value=S.conv.loc}
});
document.addEventListener('change',e=>{
  if(cur&&cur.kind==='trip'){if(e.target.type==='color')renderSetup();return}
  if(!S.db||!S.canWrite)return;
  const ref=S.db.doc('meta/settings');
  if(e.target.id==='set-rate'){const v=parseFloat(e.target.value);if(!(v>0)){toast('匯率要是大於 0 的數字');return}
    S.settings={...S.settings,rate:v};write(ref.path,()=>ref.set(stamp({...S.settings}))).then(()=>toast('匯率已更新'));render()}
  if(e.target.id==='set-mem'){const ms=e.target.value.split(/[、,，\s]+/).map(s=>s.trim()).filter(Boolean);
    S.settings={...S.settings,members:[...new Set(ms)]};write(ref.path,()=>ref.set(stamp({...S.settings}))).then(()=>toast('成員已更新'));render()}
});
let tx=null,ty=null;
document.addEventListener('touchstart',e=>{if(e.target.closest('#hero')){tx=e.touches[0].clientX;ty=e.touches[0].clientY}else tx=null},{passive:true});
document.addEventListener('touchend',e=>{if(tx==null)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=null;
  if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){const n=S.day+(dx<0?1:-1);if(n>=1&&n<=DAYS.length){S.day=n;S.anim=true;store.set('trip.day',n);render()}}},{passive:true});

/* ---------- 啟動 ---------- */
(function init(){
  buildDays();
  S.day=+store.get('trip.day')||1;
  const tb=store.get('trip.tab');if(['plan','book','money','tips','lang'].includes(tb))S.tab=tb;
  S.welcomed=!!store.get('trip.welcomed');
  document.body.classList.add('ro');render();
})();
function pickToday(){
  const now=new Date(),iso=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const td=DAYS.find(d=>d.iso===iso);if(td)S.day=td.n;if(S.day<1||S.day>DAYS.length)S.day=1;
}
(async function connect(){
  if(!window.claude||!window.claude.use){S.loaded=null;setSync('off','未連線');render();return}
  const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);
  S.user=user;
  if(!db){S.loaded=null;setSync('off','未連線');render();return}
  S.db=db;
  if(user){try{S.me=await user.id()}catch(e){}}
  S.canWrite=true;setSync('live','即時同步');document.body.classList.remove('ro');
  const got=new Set();const need=['items','bookings','expenses','tips','phrases','settings','trip'];let first=true;
  const mark=k=>{got.add(k);if(need.every(n=>got.has(n))){S.loaded=true;if(first){first=false;pickToday();if(S.trip&&S.trip.example&&!S.welcomed&&$('#sheet').hidden)showWelcome()}}renderSoon()};
  const fail=()=>setSync('off','連線中斷，請重新整理');
  for(const c of ['items','bookings','expenses','tips','phrases'])
    db.collection(c).onSnapshot(s=>{S[c]=s.docs.map(d=>({...d.data(),id:d.id}));mark(c)},fail);
  db.doc('meta/settings').onSnapshot(d=>{S.settings=d.exists?{...d.data()}:{};mark('settings')},fail);
  db.doc('meta/trip').onSnapshot(d=>{S.trip=d.exists?{...d.data()}:null;buildDays();mark('trip')},fail);
})();
