// Calcula el contraste WCAG entre los tokens de la paleta. Uso: node scripts/contraste.mjs
const c={tortilla:'#F3E6C6',humo:'#16110F',verde:'#1F6B3A',roja:'#B3261E',habanero:'#F28C1B',morita:'#5A3220',cebolla:'#8B3A7C',limon:'#D8E24A'};
const L=h=>{const v=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2]};
const r=(a,b)=>{const [x,y]=[L(a),L(b)].sort((p,q)=>q-p);return ((x+.05)/(y+.05)).toFixed(2)};
for(const f of ['tortilla','humo','habanero','limon','roja'])for(const b of Object.keys(c))if(f!==b)console.log(f.padEnd(9),'on',b.padEnd(9),r(c[f],c[b]));
