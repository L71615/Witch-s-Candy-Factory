// Generates editable RML. The generated scene, rather than this helper, is the
// source of truth once an artist starts refining it in the Rive Editor.
import { writeFileSync } from 'node:fs';
let next = 1000;
const id = () => `0:${next++}`;
const esc = v => String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const props = {};
const values = [];
function prop(name,value) { const n=id(); props[name]=n; const type=typeof value==='string'?'String':'Number'; values.push({name,value,type,id:n}); return n; }
const defaults={order:1,phase:0,action:0,progress:0,magicLevel:0.15,corruption:0,mix:0,elapsed:0,endingChoice:0,eyeX:0,eyeY:0,stirRotation:0,choiceOpacity:0,gameOpacity:1,dawnOpacity:0,witchBob:0,tailRotation:0,jar1X:205,jar1Y:335,jar2X:205,jar2Y:480,jar3X:205,jar3Y:625,jar1Opacity:1,jar2Opacity:1,jar3Opacity:1,progressWidth:0,orderLabel:'ORDER 01 / 03',recipe:'Pumpkin Pop',recipeNote:'A little autumn. A little magic.',ingredient1:'Moon sugar',ingredient2:'Pumpkin spice',status:'Drag the two ingredients into the glowing cauldron.',button:'BREW THE BATCH',dialogue:'MIRA  /  Welcome, apprentice. We have a sweet night ahead.',clock:'11:51 PM',endingTitle:'The last batch',endingText:'The town has given us its sweetest memories. Should Halloween last forever?',jar2Label:'Pumpkin spice',jar3Label:'Ghost cream'};
Object.assign(defaults,{witchBob:436,blinkScale:1,spoonX:755,spoonY:545,spoonRotation:-0.55,batchX:810,batchY:485,batchScale:0,batchScaleY:0,batchOpacity:0,pumpkinOpacity:1,eyeOpacity:0,ghostOpacity:0,choiceButtonsOpacity:1,endingBadgeOpacity:0,endingHint:'',soundEnabled:0,soundLabel:'SOUND OFF',addedCount:0});
for(let i=0;i<11;i++) defaults[`belt${i}X`]=578+i*48;
for(let i=0;i<12;i++){defaults[`spark${i}X`]=810; defaults[`spark${i}Y`]=510; defaults[`spark${i}Opacity`]=0;}
for(const [k,v] of Object.entries(defaults)) prop(k,v);
const bind=(p,key)=>`<DataBindContext sourcePathIds="0:40-${props[p]}" propertyKey="${key}"/>`;
const solid=c=>c?`<Fill><SolidColor colorValue="${c}"/></Fill>`:'';
const stroke=(c,w=2)=>`<Stroke thickness="${w}" cap="round" join="round"><SolidColor colorValue="${c}"/></Stroke>`;
const grad=(c,d,h=100)=>`<Fill><LinearGradient startX="0" startY="0" endX="0" endY="${h}"><GradientStop colorValue="${c}" position="0"/><GradientStop colorValue="${d}" position="1"/></LinearGradient></Fill>`;
function rect(name,x,y,w,h,c,r=0,s='',extra=''){return `<Shape name="${name}" x="${x}" y="${y}" ${extra}><Rectangle width="${w}" height="${h}" originX="0" originY="0" cornerRadiusTL="${r}"/>${c.startsWith('<')?c:solid(c)}${s}</Shape>`;}
function ellipse(name,x,y,w,h,c,s='',extra=''){return `<Shape name="${name}" x="${x}" y="${y}" ${extra}><Ellipse width="${w}" height="${h}" originX="0.5" originY="0.5"/>${c.startsWith('<')?c:solid(c)}${s}</Shape>`;}
function poly(name,pts,c,s='',extra=''){return `<Shape name="${name}" ${extra}><PointsPath isClosed="true">${pts.map(p=>`<StraightVertex x="${p[0]}" y="${p[1]}" radius="${p[2]||0}"/>`).join('')}</PointsPath>${c.startsWith('<')?c:solid(c)}${s}</Shape>`;}
function line(name,pts,color,w=2){return `<Shape name="${name}"><PointsPath isClosed="false">${pts.map(p=>`<StraightVertex x="${p[0]}" y="${p[1]}" radius="${p[2]||0}"/>`).join('')}</PointsPath>${stroke(color,w)}</Shape>`;}
function label(name,text,x,y,size=20,color='FFF3DCB7',font='0:91',width=0,property='',extra='') {const sid=id(); return `<Text name="${name}" x="${x}" y="${y}" ${width?`width="${width}" sizingValue="autoHeight" wrapValue="wrap"`:'sizingValue="autoWidth"'} ${extra}><TextStylePaint id="${sid}" fontAssetId="${font}" fontSize="${size}" lineHeight="${size*1.3}">${solid(color)}</TextStylePaint><TextValueRun styleId="${sid}" text="${esc(text)}">${property?bind(property,268):''}</TextValueRun></Text>`;}
const group=(name,items,extra='')=>`<Node name="${name}"${extra?' '+extra:''}>${items.join('')}</Node>`;
const boundGroup=(name,items,bindings,extra='')=>group(name,items,extra).replace(/^(<Node[^>]*>)/,`$1${Object.entries(bindings).map(([p,k])=>bind(p,k)).join('')}`);
function pumpkin(){return [poly('Pumpkin grin',[[-20,7],[-8,13],[0,8],[8,13],[20,7],[13,22],[-12,22]],'FF482338'),poly('Pumpkin left eye',[[-23,-13],[-8,-9],[-17,-2]],'FF482338'),poly('Pumpkin right eye',[[8,-9],[23,-13],[17,-2]],'FF482338'),rect('Pumpkin stem',-4,-41,9,18,'FF9CB46C',3),ellipse('Pumpkin stripe',0,0,37,65,grad('FFFFCB68','FFEB813A',36)),ellipse('Pumpkin body',0,0,79,61,grad('FFFFAF54','FFD65838',36),stroke('FFF9C17F',2))];}
function ghost(){return [ellipse('Ghost eye left',-12,-5,5,10,'FF3F2751'),ellipse('Ghost eye right',12,-5,5,10,'FF3F2751'),ellipse('Ghost smile',0,12,9,9,'FFAE75A0'),ellipse('Ghost cheek left',-21,6,10,5,'66D591BE'),ellipse('Ghost cheek right',21,6,10,5,'66D591BE'),poly('Ghost body',[[-31,30,7],[-32,-14,20],[-17,-37,13],[14,-38,15],[32,-14,18],[35,32,5],[20,22,3],[5,33,3],[-8,23,3],[-20,32,3]],grad('FFFFF3E6','FFB6C4EC',35),stroke('FFF5DCFE',2))];}
function star(x,y,r=8,color='FFFFD788') { return `<Shape x="${x}" y="${y}"><Star width="${r*2}" height="${r*2}" points="4" innerRadius="0.2" originX="0.5" originY="0.5"/>${solid(color)}</Shape>`; }
function eye(x,y,scale=1) { return group('Watchful eye',[
 group('Following pupil',[ellipse('Catchlight',-3,-4,5,5,'FFFFFFFF'),ellipse('Pupil',0,0,10,19,'FF211229'),ellipse('Iris',0,0,26,28,'FFB4CF68')],`x="${x}" y="${y}"`),
 ellipse('Sugar white',x,y,55,40,grad('FFFFF0DF','FFD6B5CB',30),stroke('FFB77F9E',2))],`scaleX="${scale}" scaleY="${scale}"`); }
function candyEye(x,y,i){return group(`Eye Candy ${i}`,[group('Gaze',[ellipse('Spark',-3,-4,4,4,'FFFFFFFF'),ellipse('Pupil',0,0,8,17,'FF1D102A'),ellipse('Iris',0,0,24,27,i%2?'FFB3D469':'FFD999ED')],`x="0" y="0"` ).replace('<Node name="Gaze" x="0" y="0">',`<Node name="Gaze">${bind('eyeX',13)}${bind('eyeY',14)}`),ellipse('Mallow',0,0,51,39,grad('FFFFF1DA','FFC69FC4',30),stroke('FFDDB7B0',2))],`x="${x}" y="${y}" rotation="${Math.sin(i)*.14}"`);}
function jar(n,y,color,inside,title,property='') {const content=[label('Ingredient name',title,0,51,17,'FFF4DBB7','0:91',0,property,'originX="0.5"'),label('Pick up','DRAG TO CAULDRON',0,77,9,'FFBA9EBC','0:91',0,'','originX="0.5"'),ellipse('Glass shine',-35,-2,8,57,'50FFFFFF'),...inside,rect('Cork',-33,-67,66,18,grad('FFD7AC6A','FF885128',20),5,stroke('FFECC27C',2)),rect('Glass vessel',-55,-47,110,84,grad('55362353','A531203F',85),20,stroke(color,2)),ellipse('Jar base',0,39,102,12,'FF21182C',stroke('887F5B69'))]; return group(`Ingredient ${n}`,content).replace('<Node name="Ingredient '+n+'">',`<Node name="Ingredient ${n}">${bind('jar'+n+'X',13)}${bind('jar'+n+'Y',14)}${bind('jar'+n+'Opacity',18)}`);}
const ui=[];
// Front-to-back ordering: interactive UI goes before the environment.
ui.push(`<LayoutComponent width="1600" height="900" styleId="0:11" name="Pointer and recipe controller" id="0:10"><LayoutComponentStyle id="0:11" positionTypeValue="absolute" positionLeft="0" positionTop="0" positionLeftUnitsValue="points" positionTopUnitsValue="points" layoutWidthScaleType="fill" layoutHeightScaleType="fill" widthUnitsValue="auto" heightUnitsValue="auto"/><ScriptedLayout scriptAssetId="0:80" name="Game" id="0:13"/></LayoutComponent>`);
const ending=[label('Ending title','The last batch',800,279,54,'FFF9DEAD','0:90',0,'endingTitle','originX="0.5"'),label('Ending story','',530,364,23,'FFE7CBDC','0:91',540,'endingText','alignValue="center"'),boundGroup('Decision buttons',[label('Finish','KEEP HALLOWEEN',632,567,17,'FF271A37','0:91',0,'','originX="0.5"'),rect('Finish choice',491,541,284,60,'FFE6AD65',15,'','id="0:202"'),label('Break','RELEASE THE MEMORIES',973,567,16,'FFF6DCAF','0:91',0,'','originX="0.5"'),rect('Break choice',808,541,332,60,'FF443556',15,stroke('FFBF92AE'), 'id="0:203"')],{choiceButtonsOpacity:18}),boundGroup('Ending signature',[label('Ending hint','',800,547,17,'FFFFD697','0:91',0,'endingHint','originX="0.5"'),label('Replay label','PLAY AGAIN',800,601,14,'FF251C34','0:91',0,'','originX="0.5"'),rect('Replay',701,579,198,50,'FFEAC58E',12,'','id="0:206"')],{endingBadgeOpacity:18}),rect('Ending panel',415,236,770,416,'F51C142B',28,stroke('FFC2946D',2)),rect('Ending veil',0,0,1600,900,'B8110B22')];
ui.push(group('Ending and choice overlay',ending).replace('<Node name="Ending and choice overlay">',`<Node name="Ending and choice overlay">${bind('choiceOpacity',18)}`));
ui.push(label('Title','Witch’s',67,39,53,'FFFFD792','0:90'));
ui.push(label('Title second line','CANDY FACTORY',72,104,19,'FFF5C696','0:91'));
ui.push(label('Chapter tagline','A LITTLE SWEET. A LITTLE SINISTER.',73,139,10,'FFD2ABC8','0:91'));
ui.push(label('Time','',1450,66,28,'FFFFD995','0:90',0,'clock','originX="0.5"'));
ui.push(label('Time subtitle','BEFORE THE LAST BELL',1450,103,10,'FFD4B4C9','0:91',0,'','originX="0.5"'));
ui.push(label('Restart label','RESTART',1500,164,12,'FFFFD7A4','0:91',0,'','originX="0.5"'));
ui.push(rect('Restart',1454,151,92,38,'B522182C',10,stroke('80775377'), 'id="0:204"'));
ui.push(label('Sound label','SOUND OFF',1387,164,11,'FFFFD7A4','0:91',0,'soundLabel','originX="0.5"'));
ui.push(rect('Sound toggle',1328,151,119,38,'B522182C',10,stroke('80775377'), 'id="0:205"'));
ui.push(rect('Clock plate',1343,42,213,88,'C61C1429',18,stroke('FF806076')));
ui.push(label('Order number','',1210,249,12,'FFDAAA72','0:91',0,'orderLabel'));
ui.push(label('Recipe title','',1210,282,30,'FFFFE7C2','0:90',274,'recipe'));
ui.push(label('Recipe note','',1210,333,15,'FFD1AFC4','0:91',265,'recipeNote'));
ui.push(rect('Divider',1210,392,264,1,'FF72516A'));
ui.push(label('Recipe subhead','THE RECIPE',1210,411,10,'FFCA9B73'));
ui.push(label('Recipe ingredient one','',1239,447,19,'FFFFDFC2','0:91',236,'ingredient1'));
ui.push(label('Recipe ingredient two','',1239,489,19,'FFFFDFC2','0:91',236,'ingredient2'));
ui.push(star(1217,460,5),star(1217,502,5));
ui.push(label('Mix subhead','STIR TO AWAKEN THE MAGIC',1210,552,10,'FFD5A2BC'));
ui.push(`<Shape x="1210" y="581" name="Mix progress"><Rectangle height="7" cornerRadiusTL="3" originX="0" originY="0">${bind('progressWidth',20)}</Rectangle>${solid('FFFFC976')}</Shape>`);
ui.push(rect('Mix track',1210,581,264,7,'FF503044',3));
ui.push(label('Action text','',1342,636,15,'FF2E1A35','0:91',0,'button','originX="0.5"'));
ui.push(rect('Action button',1208,613,268,55,grad('FFFFD694','FFEBA65B',55),12,stroke('FFFFE0B0',1),'id="0:201"'));
ui.push(label('Hint','',1208,690,13,'FFCDB2C9','0:91',274,'status'));
ui.push(rect('Recipe board',1172,215,344,557,grad('F3271C34','F6191426',557),23,stroke('FFA17668',2)));
ui.push(star(1195,235,6),star(1491,751,6));
ui.push(label('Dialogue','',469,821,17,'FFFFE6C4','0:91',622,'dialogue'));
ui.push(rect('Dialogue ribbon',440,801,697,73,'E621162D',17,stroke('FF94696E',1)));
ui.push(label('Ingredients header','THE PANTRY',205,224,15,'FFFFD998','0:91',0,'','originX="0.5"'));
ui.push(jar(1,335,'FFC99DED',[star(-24,-12,14,'FFEFC9FE'),star(16,8,18,'FFF7E3AF'),star(22,-18,9,'FFD59DF1')],'Moon sugar'));
ui.push(jar(2,480,'FFEDAA6D',[group('Pumpkin spice',pumpkin(),'scaleX="0.74" scaleY="0.74"')],'Pumpkin spice','jar2Label'));
ui.push(jar(3,625,'FFA6CFCE',[group('Ghost cream',ghost(),'scaleX="0.7" scaleY="0.7"')],'Ghost cream','jar3Label'));
ui.push(rect('Pantry shadow',116,211,178,555,'B322162B',22,stroke('7879575B')));
// Warm motes rise off the actual cauldron; they become violet as memories awaken.
for(let i=0;i<12;i++) ui.push(boundGroup(`Sugar spark ${i}`,[star(0,0,3+i%3,i%3?'FFFFD891':'FFEAB8F9')],{[`spark${i}X`]:13,[`spark${i}Y`]:14,[`spark${i}Opacity`]:18}));
ui.push(boundGroup('Fresh batch',[
 boundGroup('Pumpkin batch',pumpkin(),{pumpkinOpacity:18}),
 boundGroup('Watching batch',[candyEye(0,0,0)],{eyeOpacity:18}),
 boundGroup('Memory batch',ghost(),{ghostOpacity:18}),
 ...[[-50,-24],[48,14],[35,-43],[-27,42]].map(([x,y])=>star(x,y,5))
],{batchX:13,batchY:14,batchScale:16,batchScaleY:17,batchOpacity:18}));
// Cauldron: editable geometry and a keyed liquid layer.
ui.push(label('Pot label','MIDNIGHT',810,647,22,'FFFFCB76','0:90',0,'','originX="0.5"'),label('Pot small label','CONFECTIONS',810,681,10,'FFDB9D6A','0:91',0,'','originX="0.5"'));
ui.push(ellipse('Pot medallion',810,671,119,95,'FF39223C',stroke('FFB37B48',3)));
ui.push(ellipse('Brass rim front',810,566,413,119,'',stroke('FFFFC167',9)));
ui.push(boundGroup('Stirring ladle',[ellipse('Hand holding ladle',0,-131,23,29,'FFF5BB8C',stroke('FFB97867',2)),ellipse('Ladle tip',0,4,29,14,'FFFAC96D'),rect('Ladle handle',-6,-189,12,193,grad('FFFFD288','FF946147',190),5,stroke('FFB98458',2)),ellipse('Handle jewel',0,-185,22,25,'FFDAA25B',stroke('FFFFD592',2)),star(0,-185,8)],{spoonX:13,spoonY:14,spoonRotation:15}));
// GPU syrup is kept as a standalone source asset while the native preview uses
// the vector fallback below. It will be re-enabled for the signed submission.
ui.push(group('Syrup swirl',[ellipse('Golden swirl',0,0,255,58,'',stroke('FFFFEB99',5)),ellipse('Inner swirl',20,0,157,35,'',stroke('FFFFD36B',4)),ellipse('Core',0,0,40,15,'FFFFE5AE')],`x="810" y="552"`).replace('<Node name="Syrup swirl" x="810" y="552">',`<Node name="Syrup swirl" x="810" y="552">${bind('stirRotation',15)}`));
ui.push(ellipse('Hot liquid',810,554,390,108,grad('FFFFBD49','FFE97135',62),stroke('FFFFD57D',3)));
ui.push(ellipse('Rim shadow',810,565,422,131,'FF452437',stroke('FFCA8E50',7)));
ui.push(rect('Pot body',619,551,382,197,grad('FF875535','FF342238',195),87,stroke('FFBC7F4D',4)));
ui.push(ellipse('Handle left',610,625,68,69,'',stroke('FFB57B48',12)),ellipse('Handle right',1010,625,68,69,'',stroke('FFB57B48',12)));
ui.push(poly('Foot left',[[660,730],[709,730],[691,768],[644,768]],'FF402838',stroke('FFA97646',3)),poly('Foot right',[[911,730],[955,730],[975,768],[930,768]],'FF402838',stroke('FFA97646',3)));
// A small familiar, all Rive vectors.
ui.push(group('Black cat',[
 ellipse('Glint left',-14,-35,4,4,'FFFFF4BC'),ellipse('Glint right',20,-35,4,4,'FFFFF4BC'),
 ellipse('Pupil left',-12,-33,5,19,'FF161322'),ellipse('Pupil right',22,-33,5,19,'FF161322'),
 ellipse('Eye left',-12,-33,21,21,'FFFFBE4F'),ellipse('Eye right',22,-33,21,21,'FFFFBE4F'),
 poly('Nose',[[2,-18],[11,-18],[7,-12]],'FFD9969E'),
 poly('Ear L',[[-41,-43],[-43,-91],[-11,-59]],'FF1B1728',stroke('FF513448',3)),poly('Ear R',[[26,-57],[53,-90],[48,-30]],'FF1B1728',stroke('FF513448',3)),
 ellipse('Head',4,-32,96,80,'FF211A2C',stroke('FF60404F',2)),
 poly('Scarf',[[-31,8],[40,8],[12,31],[-11,22]],'FFFFB84E'),
 ellipse('Body',5,53,83,117,'FF211A2C',stroke('FF60404F',2)),
 ellipse('Paw',-21,102,45,19,'FF372139'),ellipse('Paw',30,102,40,19,'FF372139'),
 boundGroup('Swaying tail',[ellipse('Tail',29,-40,56,91,'',stroke('FF362238',18))],{tailRotation:15},'x="40" y="92"')],`x="460" y="661"`));
// Mira silhouette and face, broken into separately editable shapes.
ui.push(boundGroup('Mira',[
 group('Hat',[
  rect('Buckle hollow',-5,-94,22,15,'FF49334D',2),rect('Hat buckle',-13,-102,39,31,'FFE7B265',5,stroke('FFFFD793',2)),
  star(-49,-105,9),star(44,-139,5),ellipse('Hat pearl',-61,-117,7,7,'FFE0B377'),
  poly('Silk hatband',[[-83,-113,4],[66,-112,5],[79,-77],[-91,-77]],'FFA26371',stroke('FFCB8690',2)),
  line('Hat seam',[[-63,-123],[-38,-190,20],[6,-228,15],[48,-221]],'FF876281',3),
  poly('Crooked crown',[[-89,-73,12],[-44,-203,17],[16,-250,8],[82,-224,4],[107,-191,3],[59,-208,12],[26,-198,10],[39,-129,9],[85,-73,10]],grad('FF4B3057','FF241D35',90),stroke('FFAE7688',3)),
  ellipse('Hat brim highlight',-4,-66,250,49,'FF50304B',stroke('FFDB9D85',3)),ellipse('Hat brim shadow',-1,-57,239,39,'FF291E37')]),
 poly('Swept fringe',[[-55,-57,13],[-8,-74,13],[45,-55,10],[15,-47,8],[-9,-26,9],[-19,-45,7],[-45,-14,7]],'FF794257',stroke('FFB66E76',2)),
 boundGroup('Mira blinking eyes',[
  ellipse('Eye sparkle left',-18,-22,4,5,'FFFFF7E6'),ellipse('Eye sparkle right',28,-21,4,5,'FFFFF7E6'),
  ellipse('Iris left',-16,-18,8,16,'FF5E3040'),ellipse('Iris right',30,-17,8,16,'FF5E3040'),
  ellipse('Eye left',-17,-19,17,21,'FFFFEBCB'),ellipse('Eye right',29,-18,17,21,'FFFFEBCB'),
  line('Lash left',[[-30,-28],[-26,-31],[-11,-31,6],[-7,-26]],'FF4D273B',3),line('Lash right',[[17,-26],[21,-30],[34,-29,5],[40,-26]],'FF4D273B',3)
 ],{blinkScale:17}),
 line('Knowing smile',[[-5,16],[4,21,7],[15,16]],'FF9F4F5D',3),line('Nose',[[7,-7],[12,3],[7,5]],'FFC7836C',2),
 ellipse('Blush left',-32,3,24,10,'55D66B75'),ellipse('Blush right',41,4,20,10,'55D66B75'),
 ellipse('Earring',-48,19,13,20,'',stroke('FFFFCB74',4)),
 poly('Face',[[-51,-48,16],[-24,-66,17],[29,-58,17],[53,-26,20],[47,16,16],[12,46,21],[-26,30,18],[-49,3,15]],grad('FFFFD7A8','FFECA077',60),stroke('FFD69B82',2)),
 line('Curl highlight left',[[-71,-14],[-81,24,20],[-64,68,17],[-84,107,16],[-64,140]],'FFA66777',3),
 line('Curl highlight right',[[68,-15],[81,32,20],[67,70,16],[81,109,12],[63,143]],'FFAB6D7E',3),
 poly('Long hair left',[[-52,-55,18],[-84,-23,24],[-83,29,20],[-99,76,21],[-80,105,12],[-93,134,12],[-68,170,9],[-45,119,20],[-50,53,20]],grad('FF814858','FF40263E',165),stroke('FFAE7781',2)),
 poly('Long hair right',[[40,-59,16],[84,-17,20],[77,36,22],[93,79,22],[77,106,13],[84,134,14],[61,165,9],[49,104,20],[51,38,20]],grad('FF6F3D54','FF38263D',155),stroke('FF926474',2)),
 group('Raised sleeve',[line('Forearm',[[53,113],[98,83,13],[141,11]],'FFC68A72',22),line('Forearm light',[[55,111],[97,81,13],[140,11]],'FFF0B58E',17),ellipse('Sleeve puff',55,90,59,72,grad('FF604054','FF302039',55),stroke('FFA4737B',2)),rect('Ivory cuff',57,100,36,15,'FFE8C2A0',6)],'rotation="0.1"'),
 ellipse('Apron crescent',3,144,34,36,'FFC08A58'),ellipse('Crescent cutout',12,136,31,33,'FFF4D2A4'),
 line('Apron seam',[[-37,180],[-45,221,3],[51,221,3],[41,180]],'FFCF9C76',2),
 rect('Apron pocket',-21,182,43,27,'FFE6B888',7,stroke('FFBE8C6C',2)),
 poly('Apron',[[ -31,83,3],[36,83,3],[63,235,11],[-66,235,11]],grad('FFF4D2A4','FFD7A983',230),stroke('FFF7DBB4',3)),
 poly('Collar left',[[-37,56],[-5,79],[-24,94]],'FFE9C8A4'),poly('Collar right',[[35,56],[-5,79],[19,94]],'FFE9C8A4'),
 ellipse('Brooch',-3,81,13,15,'FFFFCD78',stroke('FFB67C5F',2)),
 ellipse('Left puff sleeve',-48,99,59,72,grad('FF624258','FF332239',55),stroke('FF9C6E7C',2)),
 poly('Dress',[[-45,52,8],[47,51,9],[83,153,18],[103,253,8],[-105,253,8],[-78,153,18]],grad('FF49304C','FF211B30',253),stroke('FFA87885',3)),
 ellipse('Hair shadow',0,27,175,224,'FF392238')],{witchBob:14},`x="529"`));
for(let i=0;i<11;i++) ui.push(candyEye(0,780+Math.sin(i)*4,i).replace(`<Node name="Eye Candy ${i}" x="0"`, `<Node name="Eye Candy ${i}" x="${578+i*48}"`).replace(/^(<Node[^>]*>)/,`$1${bind(`belt${i}X`,13)}`));
ui.push(rect('Conveyor edge',526,801,573,8,'FFB88058',4),rect('Conveyor',506,759,608,43,'FF432C41',20,stroke('FFB58660',3)));
ui.push(`<Shape name="Dawn" x="0" y="0">${bind('dawnOpacity',18)}<Rectangle width="1600" height="900" originX="0" originY="0"/>${solid('FFD0A8B7')}</Shape>`);
ui.push(rect('Title vignette',38,26,372,151,'BE211529',23));
ui.push(`<Image name="Painted workshop" assetId="0:92" originX="0" originY="0" scaleX="0.9569378" scaleY="0.9564293"/>`);
const listeners=[[201,1],[202,2],[203,3],[204,4],[205,5],[206,6]].map(([target,v])=>`<StateMachineListenerSingle targetId="0:${target}" listenerTypeValue="click" name="Action ${v}"><ListenerViewModelChange><BindablePropertyNumber propertyValue="${v}">${bind('action',636).replace('/>',' direction="true"/>')}</BindablePropertyNumber></ListenerViewModelChange></StateMachineListenerSingle>`).join('');
const view=`<ViewModel name="GameState" id="0:40" defaultInstanceId="0:41">${values.map(p=>`<ViewModelProperty${p.type} name="${p.name}" id="${p.id}"/>`).join('')}<ViewModelInstance name="Default" id="0:41" exports="true">${values.map(p=>`<ViewModelInstance${p.type} propertyValue="${esc(p.value)}" viewModelPropertyId="${p.id}"/>`).join('')}</ViewModelInstance></ViewModel>`;
const rml=`<Rive version="1" kind="fragment"><Artboard name="Factory" id="0:2" width="1600" height="900" styleId="0:5" viewModelId="0:40" defaultStateMachineId="0:7" clip="true"><LayoutComponentStyle id="0:5"/>${ui.join('\n')}<StateMachine name="Factory Story" id="0:7">${listeners}<StateMachineLayer name="Atmosphere" id="0:8"><AnyState x="180" y="-160"/><ExitState x="380" y="-160"/><EntryState><StateTransition stateToId="0:12"/></EntryState><AnimationState x="220" animationId="0:6" id="0:12"/></StateMachineLayer></StateMachine><LinearAnimation name="Factory awake" id="0:6" loopValue="loop" duration="180"/></Artboard>${view}<ScriptAsset file="game.luau" name="game" id="0:80"/><FontAsset file="assets/fonts/Lora.ttf" name="Lora" id="0:90"/><FontAsset file="assets/fonts/Inter.ttf" name="Inter" id="0:91"/><ImageAsset file="assets/art/workshop.png" name="Workshop" id="0:92"/></Rive>`;
const assets=``;
// Stable, distinct asset IDs keep script and shader sources unambiguous.
const output=rml.replace('</Rive>',assets+'</Rive>');
writeFileSync(new URL('../factory/scene.rml',import.meta.url),output.replaceAll('><','>\n<'));
console.log(`Scene generated with ${values.length} bound game properties.`);
