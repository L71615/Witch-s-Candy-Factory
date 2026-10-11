import {readFileSync, writeFileSync} from 'node:fs';
import {buildScenery} from './runner-scenery.mjs';

const contract = JSON.parse(readFileSync(new URL('./runner-contract.json', import.meta.url), 'utf8'));
let serial = 1000;
const uid = () => `0:${serial++}`;
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const propertyIds = {};
const propertyEntries = [];
for (const [name, value] of [...Object.entries(contract.numbers), ...Object.entries(contract.strings)]) {
  const id = uid();
  propertyIds[name] = id;
  propertyEntries.push({name, value, id, type: typeof value === 'string' ? 'String' : 'Number'});
}

const bind = (name, key) => `<DataBindContext sourcePathIds="0:40-${propertyIds[name]}" propertyKey="${key}"/>`;
const keyboardActionListener = (name, keys, action, phase=1) => `<StateMachineListener targetId="0:2" name="${esc(name)}" id="${uid()}"><ListenerInputTypeKeyboard listenerTypeValue="keyboard">${keys.map(key=>`<KeyboardInput keyType="${key}" keyPhase="${phase}"/>`).join('')}</ListenerInputTypeKeyboard><ListenerViewModelChange><BindablePropertyNumber propertyValue="${action}"><DataBindContext sourcePathIds="0:40-${propertyIds.action}" propertyKey="636" direction="true"/></BindablePropertyNumber></ListenerViewModelChange></StateMachineListener>`;
const attrs = extra => Object.entries(extra ?? {}).map(([key, value]) => ` ${key}="${esc(value)}"`).join('');
const fill = color => `<Fill><SolidColor colorValue="${color}"/></Fill>`;
const stroke = (color, width=2) => `<Stroke thickness="${width}" cap="round" join="round"><SolidColor colorValue="${color}"/></Stroke>`;
const gradient = (top, bottom, height=100) => `<Fill><LinearGradient startX="0" startY="${-height/2}" endX="0" endY="${height/2}"><GradientStop colorValue="${top}" position="0"/><GradientStop colorValue="${bottom}" position="1"/></LinearGradient></Fill>`;
const bindings = map => Object.entries(map ?? {}).map(([name, key]) => bind(name, key)).join('');

function rect(name, x, y, width, height, color, radius=0, extra={}, outline='') {
  return `<Shape name="${esc(name)}" x="${x}" y="${y}"${attrs(extra)}><Rectangle width="${width}" height="${height}" originX="0.5" originY="0.5" cornerRadiusTL="${radius}"/>${color.startsWith('<') ? color : fill(color)}${outline}</Shape>`;
}
function ellipse(name, x, y, width, height, color, extra={}, outline='') {
  return `<Shape name="${esc(name)}" x="${x}" y="${y}"${attrs(extra)}><Ellipse width="${width}" height="${height}" originX="0.5" originY="0.5"/>${color.startsWith('<') ? color : fill(color)}${outline}</Shape>`;
}
function poly(name, points, color, extra={}, outline='') {
  return `<Shape name="${esc(name)}"${attrs(extra)}><PointsPath isClosed="true">${points.map(([x,y,r=0])=>`<StraightVertex x="${x}" y="${y}" radius="${r}"/>`).join('')}</PointsPath>${color.startsWith('<') ? color : fill(color)}${outline}</Shape>`;
}
function line(name, points, color, width=2, extra={}) {
  return `<Shape name="${esc(name)}"${attrs(extra)}><PointsPath isClosed="false">${points.map(([x,y,r=0])=>`<StraightVertex x="${x}" y="${y}" radius="${r}"/>`).join('')}</PointsPath>${stroke(color,width)}</Shape>`;
}
function star(name, x, y, size, color, extra={}, outline='') {
  return `<Shape name="${esc(name)}" x="${x}" y="${y}"${attrs(extra)}><Star width="${size}" height="${size}" points="4" innerRadius="0.24" cornerRadius="2" originX="0.5" originY="0.5"/>${fill(color)}${outline}</Shape>`;
}
function group(name, children, extra={}, bindMap={}) {
  return `<Node name="${esc(name)}"${attrs(extra)}>${bindings(bindMap)}${[...children].reverse().join('')}</Node>`;
}
function text(name, value, x, y, size, color, options={}) {
  const styleId=uid();
  const width=options.width ? ` width="${options.width}" sizingValue="autoHeight" wrapValue="wrap"` : ` sizingValue="autoWidth"`;
  const origin=options.center ? ` originX="0.5" alignValue="center"` : '';
  const weight=options.font ?? '0:91';
  const binding=options.binding ? bind(options.binding,268) : '';
  return `<Text name="${esc(name)}" x="${x}" y="${y}"${width}${origin}${attrs(options.extra)}><TextStylePaint id="${styleId}" fontAssetId="${weight}" fontSize="${size}" lineHeight="${size*1.25}">${fill(color)}</TextStylePaint><TextValueRun styleId="${styleId}" text="${esc(value)}">${binding}</TextValueRun></Text>`;
}

const leg = (name, x, back=false) => group(name, [
  line('Upper leg', [[0,0],[0,24]], back?'FF292339':'FF252032', back?8:10),
  group('Knee joint', [
    line('Lower leg', [[0,0],[1,21]], back?'FF423448':'FF30283B', back?6:7),
    poly('Pointed running boot', [[-4,18,2],[5,18,2],[19,24,2],[5,28,2],[-5,26,2]], 'FF201D2C', {}, stroke(back?'FF5A4857':'FFC88F80',1.2)),
    line('Boot flash', [[3,22],[12,24]], back?'FF705365':'FFFFC89B', 1.2)
  ], {x:0,y:24}, {[back?'kneeBack':'kneeFront']:15})
], {x,y:-48}, {[back?'legBack':'legFront']:15});

const arm = (name, x, back=false) => group(name, [
  ellipse('Fitted shoulder', 0, 3, 12, 15, back?'FF2A2437':'FF32273D'),
  line('Upper arm', [[0,5],[2,20]], back?'FF2A2437':'FF33293D', back?6:7),
  group('Elbow joint', [
    line('Forearm', [[0,0],[3,17]], back?'FFAB7874':'FFE9B49A', back?4.5:5.5),
    ellipse('Magic glove', 4, 18, 7, 7, back?'FFC59784':'FFFFD2A9')
  ], {x:2,y:20}, {[back?'elbowBack':'elbowFront']:15})
], {x,y:-43}, {[back?'armBack':'armFront']:15});

const playerRig = group('Mira articulated rig', [
  group('Split flying coat tail', [
    poly('Tail root', [[3,-13,2],[-15,-9,2],[-25,8,2],[-4,4,2],[6,0,2]], 'FF2D233B'),
    group('Coat tail follow through', [
      poly('Tapered tail', [[2,-5],[-23,9],[-10,-3],[-19,-9],[3,-12]], 'FF38293F'),
      line('Tail piping', [[-2,-6],[-18,6]], 'FFB97873', 1)
    ], {x:-20,y:6}, {capeTipRotation:15})
  ], {x:-7,y:-47}, {capeRotation:15}),
  group('Courier broom', [
    line('Broom handle', [[-42,5],[37,-4]], 'FFD3A17A', 3),
    poly('Broom bristles', [[-63,1],[-42,-2],[-37,6],[-62,11],[-55,5]], 'FFC47C57'),
    line('Broom binding', [[-43,-1],[-42,8]], 'FFFFD69F', 2)
  ], {x:-2,y:-26}, {broomRotation:15,dashOpacity:18}),
  leg('Back leg', -7, true),
  leg('Front leg', 7, false),
  group('Animated torso', [
    arm('Back arm', -5, true),
    group('Flowing back hair', [
      poly('Hair ribbon', [[3,-12,4],[-12,-14,4],[-20,-4,4],[-31,2,3],[-12,3,3],[2,-2,3]], 'FF75475F'),
      line('Hair highlight', [[-6,-10],[-20,-1]], 'FFAC6978', 1.2)
    ], {x:-4,y:-56}, {hairRotation:15}),
    poly('Short split coat', [[-13,-13],[10,-15],[16,12],[4,5],[-4,13],[-16,6]], 'FF272236', {}, stroke('FF836171',1)),
    poly('Fitted runner jacket', [[-11,-45,4],[7,-47,4],[17,-33,4],[9,0,3],[-12,-1,3],[-18,-22,4]], gradient('FF443149','FF231E31',48), {}, stroke('FFB67F79',1.1)),
    line('Warm collar', [[-8,-42],[6,-43],[12,-35]], 'FFE5B589', 1.6),
    line('Waist sash', [[-12,-5],[10,-6]], 'FFE1A67D', 3),
    rect('Candy pouch', -14, -9, 12, 14, 'FFC5805C', 3, {rotation:-0.12}),
    arm('Front arm', 9, false),
    group('Side profile head', [
      ellipse('Face', 5, 0, 23, 26, 'FFFFCEA6', {rotation:-0.1}),
      poly('Side fringe', [[-8,-11,3],[9,-14,3],[18,-6,2],[5,-6],[-1,4],[-9,2]], 'FF503349'),
      line('Focused eye', [[12,-3],[16,-3]], 'FF2C2237', 2.3),
      poly('Face profile', [[15,-2],[21,3],[15,5]], 'FFFFCEA6'),
      group('Runner hat', [
        poly('Swept hat brim', [[-24,0],[-7,-5],[18,-4],[30,1],[5,5]], 'FF282235', {}, stroke('FFB68178',1.1)),
        poly('Short wind bent crown', [[-13,-3],[-8,-23],[4,-39],[22,-33],[8,-28],[15,-3]], 'FF30273F', {}, stroke('FF997082',1)),
        line('Hat ribbon', [[-11,-7],[13,-7]], 'FFE29965', 4),
        star('Hat charm', 11, -7, 6, 'FFFFD895')
      ], {x:0,y:-14}, {hatRotation:15})
    ], {x:5,y:-60}, {headRotation:15}),
    group('Two-stage scarf', [
      poly('Scarf first fold', [[4,-3],[-18,-6],[-39,-4],[-18,0],[4,2]], 'FFEA9568'),
      group('Scarf delayed tail', [poly('Tapered scarf', [[2,-3],[-17,-7],[-43,-2],[-20,-1],[2,2]], 'FFF3AF79')], {x:-36,y:-3}, {scarfTipRotation:15})
    ], {x:-3,y:-48}, {scarfRotation:15})
  ], {x:0,y:-38}, {bodyY:14,bodyRotation:15,bodyScaleX:16,bodyScaleY:17})
], {x:0,y:52,scaleX:0.9,scaleY:0.9});

// Rotate the complete rig around the torso instead of the planted foot. This
// keeps the double-jump somersault compact while playerY remains the collision
// and contact coordinate used by gameplay effects.
const player = group('Mira the midnight courier', [playerRig],
  {x:260,y:482},
  {playerX:13,playerPivotY:14,playerRotation:15,playerScaleX:16,playerScaleY:17,playerOpacity:18});

const obstacle = group('Cursed sugar spikes', [
  ellipse('Warning glow',0,-13,82,34,'337E4A61'),
  poly('Glass thorns',[[-34,0],[-24,-43],[-9,-11],[4,-64],[17,-18],[32,-49],[38,0]],gradient('FFE58B70','FF613951',64),{},stroke('FFE8B57F',3)),
  star('Spark',3,-47,11,'FFEED29B')
], {x:1020,y:534,scaleX:0.68,scaleY:0.68}, {obstacleX:13,obstacleY:14});

const pumpkin = group('Runaway pumpkin bomb', [
  ellipse('Bomb glow',0,-24,85,71,'33764A55'),
  ellipse('Pumpkin body',0,-28,66,58,gradient('FFE9A05B','FF9B5055',58),{},stroke('FFECC382',3)),
  line('Pumpkin ribs',[[-18,-50],[-23,-29],[-18,-7],[0,-57],[0,-2],[18,-50],[23,-29],[18,-7]],'FF8C4754',2),
  poly('Angry eye',[[-22,-35],[-8,-30],[-19,-23]],'FFFFE071'),
  poly('Angry eye',[[7,-30],[22,-35],[18,-23]],'FFFFE071'),
  line('Fuse',[[6,-59],[15,-71],[24,-68]],'FF78A25A',5),
  star('Fuse fire',29,-70,14,'FFFFD35B')
], {x:1780,y:534,scaleX:0.68,scaleY:0.68}, {pumpkinX:13,pumpkinY:14});

const ghost = group('Flying marshmallow specter', [
  ellipse('Spectral halo',0,0,87,87,'33D6B8FF'),
  poly('Ghost body',[[-30,23,7],[-31,-12,17],[-17,-32,12],[16,-34,12],[31,-12,17],[35,27,5],[20,18,4],[7,30,4],[-7,20,4],[-20,30,4]],gradient('FFFFF2DE','FFA897CC',67),{},stroke('FFFFCFFA',2)),
  ellipse('Eye left',-11,-7,6,12,'FF3C214F'),
  ellipse('Eye right',13,-7,6,12,'FF3C214F'),
  ellipse('Open mouth',2,10,10,12,'FF7C3D70')
], {x:1450,y:400,scaleX:0.6,scaleY:0.6}, {ghostX:13,ghostY:14,ghostOpacity:18});

const underObstacle = group('Hanging cursed candy bell',[
  line('Taut hanging thread',[[0,-44],[0,-14]],'AA4B3D54',1.5),
  poly('Bell shell',[[-17,-15,4],[-22,6,4],[-9,18,3],[0,10,3],[10,19,3],[22,5,4],[16,-15,4]],gradient('FF7D4964','FF35283F',34),{},stroke('FFE0A078',1.5)),
  poly('Lower fangs',[[-16,8],[-9,28],[-2,12],[8,30],[16,8]],'FF30253A',{},stroke('FFC47B6F',1)),
  star('Warning glint',0,-4,7,'FFF4CE91')
],{x:1320,y:604,scaleX:0.78,scaleY:0.78},{underObstacleX:13,underObstacleY:14,underObstacleOpacity:18});

const knight = group('Shielded candy knight',[
  ellipse('Guard aura',-3,-41,104,118,'226F5D7D'),
  group('Crystal shield',[
    poly('Shield face',[[-28,-34,5],[27,-34,5],[34,-7,4],[20,27,6],[0,42,5],[-22,27,6],[-35,-7,4]],gradient('AAAFA0BE','66584672',76),{},stroke('FFE9C9B2',2.4)),
    star('Shield seal',0,-4,24,'FFE9B978',{},stroke('FFFFE5C4',1))
  ],{x:-22,y:-43},{knightGuard:18}),
  ellipse('Wrapped candy body',13,-45,52,70,gradient('FFE58A70','FF75405E',70),{},stroke('FFEBC28E',2)),
  poly('Knight helm',[[-16,-70],[7,-88],[31,-70],[25,-43],[-12,-43]],'FF302942',{},stroke('FFC98783',2)),
  line('Helm slit',[[-5,-61],[20,-61]],'FFFFC86E',3),
  poly('Sugar spear',[[15,-54],[70,-78],[76,-74],[20,-45]],'FFEAB17D'),
  poly('Spear tip',[[69,-80],[91,-87],[77,-70]],'FFFFE1A4'),
  line('Boots',[[-1,-12],[-8,0],[22,-12],[28,0]],'FF2A2336',7)
],{x:2200,y:534,scaleX:0.72,scaleY:0.72},{knightX:13,knightY:14,knightOpacity:18});

const enemyShot = group('Spinning cursed candy shot',[
  ellipse('Shot warning halo',0,0,55,55,'338D5877'),
  star('Twisted candy core',0,0,32,'FFD97978',{rotation:0.785},stroke('FFE9C89C',2)),
  ellipse('Dark seed',0,0,8,8,'FF462345'),
  line('Shot wake',[[-48,-4],[-19,-2]],'88FF8C8C',2),
  line('Shot wake',[[-39,8],[-18,5]],'55FFD39B',1.3)
],{x:1400,y:470,scaleX:0.72,scaleY:0.72},{enemyShotX:13,enemyShotY:14,enemyShotRotation:15,enemyShotOpacity:18});

const boss = group('The Sugar Devourer',[
  ellipse('Boss shadow aura',12,36,315,238,'25200D32'),
  ellipse('Low drifting sugar smoke',16,95,290,74,'333B2349'),
  poly('Left violet steam',[[-69,-51,14],[-90,-91,15],[-76,-124,15],[-88,-159,14],[-51,-129,15],[-57,-103,15],[-36,-54,14]],gradient('445E426F','88694162',120)),
  poly('Right violet steam',[[43,-49,14],[64,-88,15],[49,-117,15],[73,-148,12],[88,-118,16],[79,-97,14],[91,-55,13]],gradient('335E426F','88694162',110)),
  poly('Left cast iron foot',[[-79,77,5],[-69,104,5],[-85,122,4],[-108,122,4],[-92,92,5]],'FF302235',{},stroke('FF9E6663',2)),
  poly('Right cast iron foot',[[79,77,5],[69,104,5],[85,122,4],[108,122,4],[92,92,5]],'FF302235',{},stroke('FF9E6663',2)),
  ...[-1,1].flatMap(side=>[
    ellipse('Forged side handle',side*124,-19,61,68,'001D1728',{},stroke('FF352638',16)),
    ellipse('Copper handle edge',side*124,-20,61,68,'001D1728',{},stroke('FFC48870',3)),
    ellipse('Handle hinge',side*109,-12,18,23,'FFB57564',{},stroke('FFFFCF92',2)),
    ellipse('Hinge pin',side*109,-12,6,8,'FF342237')
  ]),
  poly('Tapered copper vessel',[[-121,-48,14],[-114,25,27],[-90,87,25],[-48,108,17],[48,108,17],[90,87,25],[114,25,27],[121,-48,14]],gradient('FF8B5665','FF241A2D',182),{},stroke('FFDBA078',3.5)),
  poly('Left copper shoulder',[[-117,-43,9],[-103,-37,9],[-91,24,15],[-71,82,12],[-92,74,12],[-111,23,18]],gradient('FFC28777','FF593246',130)),
  poly('Right copper shoulder',[[117,-43,9],[103,-37,9],[91,24,15],[71,82,12],[92,74,12],[111,23,18]],gradient('FFA76E69','FF42273E',130)),
  poly('Dark enamel face panel',[[-91,-32,15],[-83,38,20],[-64,74,15],[0,87,13],[64,74,15],[83,38,20],[91,-32,15]],gradient('FF48334E','FF21192D',120),{},stroke('FF9D6871',1.4)),
  line('Left vessel seam',[[-81,-34],[-73,27,10],[-55,82]],'77673E53',2),
  line('Right vessel seam',[[81,-34],[73,27,10],[55,82]],'77673E53',2),
  line('Lower copper hoop',[[-98,64],[-77,86,15],[-40,96,10],[40,96,10],[77,86,15],[98,64]],'FFB97E65',9),
  line('Lower hoop gold edge',[[-95,60],[-75,81,15],[-39,91,10],[39,91,10],[75,81,15],[95,60]],'FFF0BA85',1.7),
  ...[-72,-37,0,37,72].map(x=>ellipse('Hand hammered copper rivet',x,92-Math.abs(x)*0.13,5,5,'FFFFD299',{},stroke('FF563449',1))),
  ellipse('Heavy cauldron rim',0,-49,262,48,'FF4A2C40',{},stroke('FFCE8D72',4)),
  ellipse('Molten sugar surface',0,-53,241,29,gradient('FFF5AC62','FFCF6555',29),{},stroke('FFFFDEA0',2)),
  ellipse('Sugar whirlpool',8,-54,133,14,'00FFBF71',{},stroke('FFFFD893',2)),
  ellipse('Sugar whirlpool heart',17,-54,58,7,'FFFFF0BD'),
  line('Front lip copper shine',[[-120,-43],[-79,-31,9],[0,-28,13],[79,-31,9],[120,-43]],'FFE6AF83',4),
  poly('Molten sugar drip',[[-94,-39,4],[-83,-35,4],[-83,-14,5],[-91,-12,5]],'FFF7BB76'),
  poly('Small sugar drip',[[70,-34,3],[78,-36,3],[77,-22,4],[70,-24,3]],'FFF7BB76'),
  group('Levitating engraved lid',[
    poly('Domed copper lid',[[-104,-2,5],[-83,-18,9],[-57,-34,11],[57,-34,11],[83,-18,9],[104,-2,5]],gradient('FFAF7878','FF513349',40),{},stroke('FFE4AE85',2)),
    line('Lid center seam',[[0,-32],[0,-5]],'FF6F4658',2),
    line('Lid left engraving',[[-63,-26],[-77,-10],[-36,-8]],'FFC58D7A',1.5),
    line('Lid right engraving',[[63,-26],[77,-10],[36,-8]],'FFC58D7A',1.5),
    ellipse('Lid rolled edge',0,0,227,19,'FF654056',{},stroke('FFE4AB7C',2.5)),
    line('Lid glint',[[-90,-3],[-48,-6],[30,-6]],'FFFFD69D',1.5),
    ellipse('Lid handle stem',0,-36,13,13,'FF6A3C52',{},stroke('FFCA8F75',2)),
    ellipse('Lid finial',0,-44,27,13,'FFCA8E72',{},stroke('FFFFDCA0',2)),
    star('Engraved moon seal',0,-19,14,'FFFFD79A',{rotation:0.785})
  ],{x:9,y:-105,rotation:0.075}),
  ellipse('Rising sugar bubble',-43,-77,10,10,'88FFD08A',{},stroke('FFFFDBA0',1)),
  ellipse('Rising sugar bubble',79,-85,6,6,'AAFFD08A'),
  star('Forehead curse rune',0,-16,21,'FFFFBB72',{rotation:0.785},stroke('FFFFE0A3',1.2)),
  group('Glowing boss eyes',[
    poly('Left molten eye',[[-73,-9],[-27,2],[-58,12]],'FFFFC873',{},stroke('FFE68B65',1)),
    poly('Right molten eye',[[27,2],[73,-9],[58,12]],'FFFFC873',{},stroke('FFE68B65',1)),
    line('Left copper brow',[[-75,-14],[-27,-2]],'FFAC736B',3.5),
    line('Right copper brow',[[27,-2],[75,-14]],'FFAC736B',3.5),
    line('Left hot pupil',[[-53,0],[-51,7]],'FFFFF2C9',3),
    line('Right hot pupil',[[53,0],[51,7]],'FFFFF2C9',3)
  ],{}, {bossEyeOpacity:18}),
  group('Animated devourer mouth',[
    poly('Carved furnace grin',[[-52,34],[-24,42],[0,37],[25,42],[52,34],[35,61],[0,68],[-35,61]],'FF110E1B',{},stroke('FFCC865F',2)),
    poly('Left caramel fang',[[-31,41],[-20,43],[-26,54]],'FFFFD19A'),
    poly('Right caramel fang',[[20,43],[31,41],[26,54]],'FFFFD19A'),
    line('Furnace heat',[[-23,59],[0,63],[23,59]],'FFDE835E',2)
  ],{}, {bossMouthScale:17}),
  group('Phase two cauldron shield',[
    ellipse('Shield glass',0,13,282,226,'115D4B70',{},stroke('AACCABC5',2.5)),
    ellipse('Shield inner ring',0,13,266,210,'001D2038',{},stroke('55F6D6B7',1)),
    star('Shield rune top',0,-99,15,'FFFFE4C7'),
    star('Shield rune left',-140,13,12,'FFE6B875'),
    star('Shield rune right',140,13,12,'FFE6B875'),
    star('Shield rune base',0,125,12,'FFE6B875')
  ],{}, {bossShieldOpacity:18}),
  group('Exposed sugar core',[
    ellipse('Core copper socket',0,30,98,98,'FF322032',{},stroke('FFDC996C',4)),
    ellipse('Core outer flare',0,30,85,85,'997B244B',{},stroke('CCFF805A',3)),
    ellipse('Molten core glass',0,30,70,70,gradient('FFFFD185','FFDA634C',70)),
    star('Cracked core',0,30,56,'FFFFDCA0',{rotation:0.785},stroke('FFFFEFC6',1.7)),
    poly('Core crack',[[-7,-1],[5,15],[-4,31],[9,58],[1,38],[8,25]],'FF752540'),
    star('Core hot center',2,30,17,'FFFFFFFF')
  ],{}, {bossCoreOpacity:18}),
  group('Boss damage flash',[poly('White impact wash',[[-118,-44,14],[-109,25,27],[-85,84,25],[-46,104,17],[46,104,17],[85,84,25],[109,25,27],[118,-44,14]],'99FFFFFF')],{}, {bossHitOpacity:18}),
  ...[-1,1].map(side=>group(side<0?'Left striking chain':'Right striking chain',[
    ellipse('Chain shoulder swivel',side*116,15,18,18,'FF3D283B',{},stroke('FFC18A72',3)),
    ...Array.from({length:5},(_,i)=>ellipse('Interlocking forged link',side*(128+i*13),24+i*5,20,i%2===0?12:8,'001D1728',{rotation:side*0.36},stroke(i%2===0?'FFAD7971':'FF5C4053',3.5))),
    ellipse('Hook swivel',side*189,47,13,13,'FF523749',{},stroke('FFC18A72',2)),
    line('Articulated candy hook',[[side*190,49],[side*205,63,8],[side*220,61,8],[side*225,49,5],[side*219,41]],'FF332438',10),
    line('Hook copper cutting edge',[[side*191,49],[side*205,59,8],[side*218,58,7],[side*222,49]],'FFD29A79',2),
    poly('Hook sharpened point',[[side*223,47],[side*211,37],[side*219,55]],'FFF0BC8A')
  ],{}, {bossArmRotation:15}))
],{x:1480,y:442,scaleX:1,scaleY:1},{bossX:13,bossY:14,bossScale:16,bossOpacity:18});

const factoryGate = group('Candy factory destination',[
  poly('Factory tower',[[-178,122],[-165,-108],[-126,-165],[-82,-117],[-58,-224],[-14,-161],[18,-246],[53,-154],[92,-197],[121,-119],[169,-92],[183,122]],gradient('FF4A3151','FF221D34',360),{},stroke('FF926376',2)),
  ellipse('Factory moon window',17,-131,58,58,'FFFFD58F',{},stroke('FFFFF0C5',3)),
  line('Window cross',[[-12,-131],[46,-131],[17,-160],[17,-102]],'FF6E4059',3),
  rect('Factory door',8,65,92,114,'FF171526',8,{},stroke('FFC77B68',3)),
  group('Opening furnace light',[
    rect('Door light',8,65,74,98,gradient('FFFFE08C','FFFF7651',98),5),
    line('Light ray left',[[-28,109],[-95,152]],'55FFD886',3),
    line('Light ray right',[[44,109],[110,155]],'55FFD886',3)
  ],{}, {factoryDoorOpen:18}),
  group('Factory warm windows',[
    rect('Window one',-115,-61,27,46,'FFFFB65E',3),
    rect('Window two',93,-36,27,46,'FFFFB65E',3),
    rect('Window three',-52,-117,22,35,'FFFFD272',3)
  ],{}, {factoryGlowOpacity:18}),
  line('Copper pipe',[[-145,-78],[-211,-78],[-211,43],[-177,43]],'FF9B5B55',10),
  line('Copper pipe highlight',[[-145,-81],[-207,-81],[-207,40]],'FFE29A6C',2)
],{x:1165,y:445,scaleX:0.62,scaleY:0.62},{factoryOpacity:18});

const bridgeCollapse = group('Breaking bridge set piece',[
  group('Falling bridge slab',[
    line('Broken rail',[[-116,0],[104,0]],'FF2F293C',7),
    line('Rail glint',[[-114,-3],[101,-3]],'FFC89A83',1.5),
    poly('Jagged break',[[96,-8],[124,1],[101,12],[131,24],[91,21]],'FF32273B')
  ],{x:0,y:0},{bridgeShardRotation:15}),
  poly('Falling shard one',[[143,8],[166,15],[151,38]],'FF33283E',{rotation:0.18}),
  poly('Falling shard two',[[176,-3],[194,8],[181,27]],'FF4D3546',{rotation:-0.22}),
  star('Break spark',122,-8,17,'FFFFD28B')
],{x:700,y:534},{bridgeBreakOpacity:18});

const candy = (name,x,y,prefix,pink=false)=>group(name,[
  star('Candy shine',0,-2,35,pink?'FFFF77B7':'FFFFD45E',{},stroke('FFFFF1B0',2)),
  poly('Wrapper left',[[-14,-9],[-31,-18],[-29,7],[-14,5]],pink?'FF9651B5':'FFFF8C4C'),
  poly('Wrapper right',[[14,-9],[31,-18],[29,7],[14,5]],pink?'FF9651B5':'FFFF8C4C'),
  star('Tiny glint',-5,-8,7,'FFFFFFFF')
],{x,y,scaleX:0.5,scaleY:0.5},{[`${prefix}X`]:13,[`${prefix}Y`]:14,[`${prefix}Opacity`]:18});

const platform = group('Suspended candy rail',[
  line('Platform rope',[[-126,1],[126,1]],'FF2F293C',5),
  line('Platform glint',[[-124,-1],[124,-1]],'FFC59A88',1.3),
  line('Left loose rope',[[-100,4],[-93,37,10],[-99,49]],'AA534459',1.5),
  line('Right loose rope',[[102,4],[96,28,6]],'AA534459',1.5),
  star('Rail light left',-119,-3,5,'FFEFC693'),
  star('Rail light right',119,-3,5,'FFEFC693')
],{x:1190,y:418},{platformX:13,platformY:14,platformOpacity:18});

const dashTrail = group('Broom dash trail',[
  poly('Fine tapered speed trail',[[-190,-48],[-20,-52],[-26,-47]],'88F6AF74'),
  line('Gold slash',[[-145,-34],[-27,-36]],'AAF8C08A',1.7),
  line('High slash',[[-94,-62],[-28,-63]],'66FFE1AF',1),
  star('Dash spark',-26,-49,8,'FFFFDE9C')
],{x:260,y:482},{playerX:13,afterY:14,afterRotation:15,dashOpacity:18});

const afterImage = (name,xName,opacityName)=>group(name,[
  line('Ghost spine',[[0,-37],[1,16]],'FFDE9B86',7),
  line('Ghost stride',[[-1,11],[-12,31],[12,22]],'FFDE9B86',4),
  poly('Ghost hat',[[-18,-35],[2,-56],[20,-39],[7,-38]],'FFDE9B86'),
  line('Ghost scarf',[[-4,-28],[-31,-25],[-49,-18]],'FFDE9B86',3)
],{x:220,y:482,scaleX:0.78,scaleY:0.78},{[xName]:13,afterY:14,afterRotation:15,[opacityName]:18});

const flipFx = group('Bridge flip orbit',[
  ellipse('Thin orbit',0,0,92,92,'00100918',{},stroke('99F0C49B',1.3)),
  line('Orbit break left',[[-45,0],[-31,-27]],'AAF7D4A9',2),
  line('Orbit break right',[[45,0],[31,27]],'AAF7D4A9',2),
  star('Orbit spark',35,-30,7,'FFFFDEA8')
],{x:260,y:482},{flipFxX:13,flipFxY:14,flipFxRotation:15,flipFxScale:16,flipFxOpacity:18});

const cancelFx = group('Action cancel accent',[
  ellipse('Cancel ring',0,0,102,102,'00100918',{},stroke('99E8B88E',1.5)),
  line('Cancel slash one',[[-48,23],[-29,9]],'88F1C99E',2),
  line('Cancel slash two',[[34,-31],[51,-43]],'88D49A91',2),
  star('Cancel spark',42,-37,8,'FFFFE0B0')
],{x:260,y:482,scaleX:0.86,scaleY:0.86},{playerX:13,playerPivotY:14,cancelOpacity:18});

const attackSlash = group('Sugar blade close slash',[
  poly('Wide translucent cut',[[-8,-47],[18,-31],[49,0],[19,31],[-7,48],[13,17],[27,0],[13,-17]],'55FFF2D0'),
  line('Bright blade edge',[[-7,-45],[19,-29],[47,0],[19,29],[-7,45]],'FFFFD59B',3),
  line('Pink inner edge',[[4,-31],[27,0],[5,31]],'CCF18A9E',1.5),
  star('Slash glint',45,0,8,'FFFFFFFF')
],{x:302,y:482},{slashX:13,slashY:14,slashRotation:15,slashScale:16,slashOpacity:18});

const projectile = group('Flying sugar crescent',[
  poly('Crescent body',[[-26,-18],[-5,-10],[20,0],[-5,10],[-26,18],[-12,0]],gradient('FFFFE8C8','FFDB9A83',36),{},stroke('FFFFF0D9',1.2)),
  line('Crescent wake',[[-38,-10],[-17,-4]],'99D8AA8C',1.5),
  line('Crescent wake',[[-45,6],[-17,4]],'66C78F83',1)
],{x:300,y:482},{projectileX:13,projectileY:14,projectileRotation:15,projectileOpacity:18});

const impactFx = group('Sugar blade impact',[
  star('Impact core',0,0,30,'FFFFF0DB'),
  star('Impact amber',-15,-12,18,'FFE8B879'),
  star('Impact pink',18,8,14,'FFD58B9B'),
  line('Impact ray left',[[-11,0],[-42,-4]],'FFFFE2AF',2),
  line('Impact ray high',[[0,-10],[7,-39]],'FFFFE2AF',2),
  line('Impact ray low',[[8,10],[27,34]],'FFFFA78D',2)
],{x:600,y:482},{impactX:13,impactY:14,impactScale:16,impactOpacity:18});

const dangerWarning = group('Incoming danger telegraph',[
  poly('Warning chevron',[[-18,-5],[0,13],[18,-5],[11,-12],[0,-1],[-11,-12]],'FFE4B779',{},stroke('FFFFE9D2',1.2)),
  line('Warning ray left',[[-28,-18],[-19,-11]],'AAFF9A79',2),
  line('Warning ray right',[[28,-18],[19,-11]],'AAFF9A79',2)
],{x:900,y:450},{warningX:13,warningY:14,warningScale:16,warningOpacity:18});

const bossTelegraph = group('Boss attack telegraph',[
  ellipse('Telegraph wash',0,0,338,292,'44356B91',{},stroke('FF62F3FF',5)),
  ellipse('Telegraph broken ring',0,0,294,250,'22234970',{},stroke('EEB7FAFF',3)),
  star('Telegraph crown',0,-139,25,'FFFFFFFF'),
  line('Telegraph ray left',[[-155,-78],[-201,-107]],'FF63E9FF',5),
  line('Telegraph ray right',[[155,-78],[201,-107]],'FF63E9FF',5)
],{x:1070,y:442},{bossX:13,bossY:14,bossTelegraphScale:16,bossTelegraphOpacity:18});

const bossShockwave = group('Boss bridge shockwave',[
  ellipse('Tall rolling ring',0,-18,88,96,'AA194866',{},stroke('FF5CF4FF',8)),
  ellipse('Ring watercolor echo',-10,-18,116,124,'55365C87',{},stroke('EEB8FAFF',4)),
  poly('Wave foot',[[-48,15],[-28,-2],[-9,13],[9,-4],[27,13],[49,4],[55,20],[-52,20]],gradient('EE52D5ED','DD263B73',26),{},stroke('FFFFFFFF',4)),
  ellipse('Wave ground wash',0,18,142,26,'AA194566'),
  star('Wave spark',27,-49,16,'FFFFFFFF')
],{x:1200,y:520},{shockwaveX:13,shockwaveY:14,shockwaveScale:16,shockwaveOpacity:18});

const bossShockwaveEcho = group('Boss enraged echo shockwave',[
  group('Delayed echo body',[
    ellipse('Echo rolling ring',0,-18,76,84,'88452A7A',{},stroke('EEB16CFF',7)),
    poly('Echo wave foot',[[-42,15],[-25,0],[-7,13],[10,-2],[29,14],[45,7],[50,20],[-46,20]],gradient('CC9D62FF','BB35245F',24),{},stroke('FFF2D9FF',3.5)),
    star('Echo spark',23,-42,13,'FFFFFFFF')
  ],{x:142})
],{x:1200,y:520},{shockwaveX:13,shockwaveY:14,shockwaveScale:16,shockwaveEchoOpacity:18});

const bossSweep = group('Boss upper sweep',[
  poly('Wide watercolor sweep',[[-90,-23],[1080,-10],[1080,25],[-90,17]],gradient('DD3FCFE7','BB293467',48)),
  line('Sweep cutting edge',[[-80,-17],[1090,-5]],'FF65F5FF',8),
  line('Sweep hot inner edge',[[-45,-8],[1050,4]],'FFFFFFFF',3),
  line('Sweep dry brush echo',[[-30,20],[1010,29]],'AA704AA0',10),
  star('Sweep leading spark',30,1,28,'FFFFFFFF')
],{x:0,y:455},{sweepY:14,sweepOpacity:18});

const bossMeteorTarget = group('Sugar press target',[
  ellipse('Target outer ring',0,0,118,32,'66325B83',{},stroke('FF5EF3FF',6)),
  ellipse('Target inner ring',0,0,72,20,'88442A71',{},stroke('FFB67AFF',3)),
  line('Target cross horizontal',[[-50,0],[50,0]],'FFFFFFFF',3),
  line('Target cross vertical',[[0,-24],[0,24]],'FFFFFFFF',3),
  star('Target warning spark',0,-38,17,'FF66F4FF')
],{x:260,y:523},{meteorX:13,meteorTargetOpacity:18});

const bossMeteor = group('Falling sugar press',[
  ellipse('Press shadow',0,24,88,28,'AA0A1830'),
  poly('Heavy candy seal',[[-42,-26,8],[42,-26,8],[50,15,8],[30,34,8],[-30,34,8],[-50,15,8]],gradient('FF8C73FF','FF243A70',64),{},stroke('FF69F4FF',5)),
  ellipse('Stamped moon',0,2,36,36,'FF131F4A',{},stroke('FFFFFFFF',3)),
  star('Moon spark seal',3,-1,18,'FFFFFFFF'),
  line('Falling trail left',[[-27,-38],[-18,-78]],'AA66F4FF',4),
  line('Falling trail right',[[27,-38],[18,-91]],'99B16CFF',5)
],{x:260,y:78},{meteorX:13,meteorY:14,meteorScale:16,meteorOpacity:18});

const bossImpact = group('Boss attack impact beat',[
  star('Boss impact flash',1050,470,82,'FFFFFFFF'),
  line('Boss impact ray one',[[990,430],[940,386]],'FF64F4FF',6),
  line('Boss impact ray two',[[1000,492],[938,518]],'EEA66CFF',6)
],{}, {bossImpactOpacity:18});

const foregroundRush = group('Fast foreground silhouettes',[
  poly('Near branch left',[[-80,720],[-35,615],[-6,672],[42,566],[29,720]],'B532293F'),
  poly('Near leaves left',[[-37,621],[-92,583],[-56,654],[-122,642],[-61,681]],'88453651'),
  poly('Near branch middle',[[610,720],[654,605],[680,642],[726,548],[711,720]],'A832293F'),
  poly('Near leaves middle',[[655,610],[605,578],[647,659],[584,641]],'774A3852'),
  poly('Near branch repeat',[[1420,720],[1463,602],[1492,650],[1530,572],[1522,720]],'B532293F')
],{x:0,y:0},{foregroundX:13});

const speedLines = group('Chase speed lines',[
  line('Fast line 1',[[80,158],[335,139]],'55FFE1B0',1.2),
  line('Fast line 2',[[780,246],[1160,221]],'44FFE1B0',1),
  line('Fast line 3',[[55,414],[420,399]],'33FFFFFF',1),
  line('Fast line 4',[[850,520],[1238,494]],'44FFB893',1.3),
  line('Fast line 5',[[338,310],[573,298]],'33FFFFFF',0.8)
],{}, {speedLineOpacity:18});

const perfectDodgeFx = group('Perfect dodge freeze frame',[
  rect('Cool slow motion tint',640,360,1280,720,'2256C8FF'),
  line('Perfect cut top',[[390,318],[890,318]],'AAFFFFFF',1),
  line('Perfect cut bottom',[[450,404],[830,404]],'66FFD8A2',1),
  text('Perfect dodge title','PERFECT DODGE',640,335,31,'FFFFFFFF',{center:true,binding:'perfectText',font:'0:90'}),
  text('Perfect bonus','TIME FRACTURE  ·  +140',640,379,10,'FFFFD39D',{center:true})
],{x:0,y:0},{perfectOpacity:18});

const chapterCard = group('Chapter announcement',[
  rect('Chapter title plate',640,211,548,66,'CC171522',14,{},stroke('99E8B789',1.5)),
  line('Chapter rule left',[[382,211],[448,211]],'AAE8C7A5',1),
  line('Chapter rule right',[[832,211],[898,211]],'AAE8C7A5',1),
  text('Chapter name','I · THE LAST SPARK',640,190,20,'FFFFE1B8',{center:true,binding:'chapterText',font:'0:90'}),
  text('Chapter objective','CARRY THE MOON SUGAR ACROSS THE ROOFTOPS',640,219,9,'FFE4CDD0',{center:true,binding:'objectiveText'})
],{}, {chapterOpacity:18});

const chaseVignette = group('Final chase vignette',[
  rect('Top chase shade',640,28,1280,56,gradient('991B1529','001B1529',56)),
  rect('Bottom chase shade',640,692,1280,56,gradient('001B1529','AA1B1529',56)),
  rect('Left pressure',24,360,48,720,gradient('991B1529','001B1529',48))
],{}, {vignetteOpacity:18});

const factoryChapterAtmosphere = group('Cursed factory chapter atmosphere',[
  rect('Factory cool wash',640,360,1280,720,'1022A09A'),
  poly('Left pipe silhouette',[[0,478],[118,478],[118,393],[151,393],[151,478],[245,478],[245,720],[0,720]],'55304A4C'),
  poly('Right pipe silhouette',[[1015,504],[1015,369],[1042,369],[1042,442],[1128,442],[1128,335],[1161,335],[1161,720],[1015,720]],'66304A4C'),
  line('Copper pipe glow left',[[0,473],[113,473],[113,388],[151,388]],'DDF0A35E',4),
  line('Copper pipe glow right',[[1020,500],[1020,374],[1047,374],[1047,447],[1133,447],[1133,340]],'DDF0A35E',4),
  ellipse('Factory smoke bank',310,304,420,138,'22346E6A'),
  ellipse('Factory smoke bank right',945,274,510,166,'22346E6A')
],{}, {factoryOpacity:18});

const bossChapterAtmosphere = group('Boss chapter furnace pressure',[
  rect('Boss ember wash',640,360,1280,720,'142A0712'),
  line('Boss red horizon',[[0,510],[1280,510]],'AAFF493E',4),
  ...[[90,212],[178,390],[354,166],[487,307],[702,238],[849,405],[998,191],[1180,342]].map(([x,y],i)=>star(`Boss ember ${i}`,x,y,5+(i%3)*2,i%2?'DDFFD05F':'DDFF493E'))
],{}, {chaseOpacity:18});

// These are complete chapter sets, not translucent decorations. They sit
// behind the playable actors but in front of the opening valley, so reaching
// the factory genuinely replaces the exterior skyline and the boss room then
// replaces the factory hall.
const factoryInteriorBackground = group('Cursed factory interior background',[
  rect('Factory interior wall',640,360,1280,720,gradient('FF102C33','FF244C4B',720)),
  rect('Factory ceiling darkness',640,74,1280,148,gradient('FF081A21','00102C33',148)),
  ...Array.from({length:9},(_,i)=>line(`Factory brick course ${i}`,[[0,126+i*48],[1280,126+i*48]],i%2?'33456F6B':'44588B80',1)),
  ...[94,332,570,808,1046,1278].map((x,i)=>group(`Factory iron pier ${i}`,[
    rect('Pier body',x,356,34,560,gradient('FF0A2229','FF244447',560),4,{},stroke('88998575',2)),
    rect('Pier cap',x,98,62,20,'FF07191F',3,{},stroke('88E5A368',2)),
    rect('Pier foot',x,632,72,26,'FF07191F',3,{},stroke('88E5A368',2))
  ])),
  ...[224,640,1056].map((x,i)=>group(`Factory furnace window ${i}`,[
    ellipse('Window halo',x,284,188,252,'5549D9C2'),
    poly('Tall arched window',[[x-70,414],[x-70,270,34],[x-55,211,42],[x,178,44],[x+55,211,42],[x+70,270,34],[x+70,414]],gradient('FF8FF0D3','FF2E8F88',236),{},stroke('FF06191F',12)),
    line('Window spine',[[x,186],[x,410]],'CC123D42',7),
    line('Window cross',[[x-65,300],[x+65,300]],'CC123D42',7)
  ])),
  line('Ceiling copper main',[[0,132],[188,132],[188,82],[502,82],[502,132],[844,132],[844,82],[1120,82],[1120,132],[1280,132]],'FF8D534E',20),
  line('Ceiling copper highlight',[[0,125],[181,125],[181,75],[509,75],[509,125],[837,125],[837,75],[1127,75],[1127,125],[1280,125]],'FFD98B68',3),
  ...[152,456,760,1064].map((x,i)=>group(`Hanging candy boiler ${i}`,[
    line('Boiler chain',[[x,0],[x,126]],'FF24192A',7),
    ellipse('Boiler tank',x,178,116,148,gradient('FFC77A50','FF57362F',148),{},stroke('FFFFCA7A',3)),
    ellipse('Boiler glass',x,174,72,91,gradient(i%2?'AA65D9C4':'AAF0B35A','22102428',91),{},stroke('AAE8FFF0',2)),
    rect('Boiler valve',x+54,174,25,15,'FFDB9A68',3)
  ])),
  ...[286,918].map((x,i)=>group(`Factory gear cluster ${i}`,[
    ellipse('Gear outer',x,515,154,154,'00102027',{},stroke('DDE09A58',12)),
    ellipse('Gear inner',x,515,64,64,'FF0D2930',{},stroke('FFFFC36B',7)),
    ...Array.from({length:8},(_,j)=>rect(`Gear tooth ${j}`,x+Math.cos(j*Math.PI/4)*81,515+Math.sin(j*Math.PI/4)*81,25,13,'FFC77A50',2,{rotation:j*Math.PI/4}))
  ])),
  rect('Factory lane contrast',640,526,1280,170,'44112027'),
  rect('Factory floor glow',640,570,1280,128,gradient('00FFD57A','5540B5A2',128)),
  line('Factory floor horizon',[[0,559],[1280,559]],'FFFFC36B',4)
],{}, {factoryOpacity:18});

const cauldronCoreBackground = group('Hungry cauldron core chamber background',[
  rect('Core chamber void',640,360,1280,720,gradient('FF08060C','FF280812',720)),
  ellipse('Furnace halo',640,318,930,700,'443D0C25'),
  poly('Furnace cathedral arch',[[-40,720],[-40,236,90],[54,94,80],[180,28,70],[320,0],[960,0],[1100,28,70],[1226,94,80],[1320,236,90],[1320,720]],'AA160D1C',{},stroke('AA6A3040',24)),
  ellipse('Molten core portal',640,324,520,520,gradient('CCFFC04F','CC9B1830',520),{},stroke('FF1B0811',28)),
  ellipse('Portal inner void',640,324,390,390,gradient('FF1D0711','FF020204',390),{},stroke('DDFF573E',7)),
  ...Array.from({length:12},(_,i)=>line(`Core radial conduit ${i}`,[[640+Math.cos(i*Math.PI/6)*210,324+Math.sin(i*Math.PI/6)*210],[640+Math.cos(i*Math.PI/6)*410,324+Math.sin(i*Math.PI/6)*410]],i%2?'AA7D3546':'AAE16D4F',i%2?7:4)),
  ...[112,1168].map((x,i)=>group(`Core pressure column ${i}`,[
    rect('Obsidian column',x,358,154,612,gradient('FF160E1E','FF3D1A2B',612),18,{},stroke('AA8A4248',5)),
    ellipse('Column gauge',x,205,74,74,'FF211126',{},stroke('FFFF9B63',5)),
    line('Gauge needle',[[x,205],[x+(i?24:-24),188]],'FFFFD08A',4),
    line('Column pipe',[[x+(i?-70:70),80],[x+(i?-70:70),564],[x+(i?-24:24),564]],'FF8C4748',16)
  ])),
  ...[250,420,860,1030].map((x,i)=>group(`Core chain ${i}`,[
    line('Chain cable',[[x,0],[x+(i%2?56:-42),470]],'FF24101F',13),
    ...Array.from({length:7},(_,j)=>ellipse(`Chain link ${j}`,x+(i%2?8:-6)*j,58+j*58,20,34,'00100918',{rotation:i%2?0.22:-0.18},stroke('FF87434B',5)))
  ])),
  rect('Boss lane contrast',640,526,1280,170,'66050308'),
  rect('Molten channel',640,611,1280,134,gradient('00FF4E3C','AA720819',134)),
  line('Molten rail',[[0,559],[1280,559]],'FFFF6A4F',5),
  ...[[174,182],[345,412],[518,238],[744,169],[906,382],[1098,244],[1214,458]].map(([x,y],i)=>star(`Core floating ember ${i}`,x,y,8+(i%3)*4,i%2?'CCFFB157':'CCFF5A4B'))
],{}, {chaseOpacity:18});

const finaleFx = group('Final sugar cut celebration',[
  rect('Final warm flash',640,360,1280,720,'88FFE2A0'),
  line('Final diagonal cut',[[-80,690],[1360,20]],'FFFFFFFF',6),
  line('Final amber echo',[[-120,714],[1320,44]],'AAFF8D75',18),
  star('Final impact star',1040,188,150,'FFFFE8B1',{},stroke('FFFFFFFF',4))
],{}, {finalFlashOpacity:18});

const dust = group('Running dust',[
  ellipse('Dust one',-7,-2,16,4,'66F3CEAA'),
  ellipse('Dust two',-29,-4,9,3,'44E8B893')
],{x:240,y:534},{dustPhase:13,dustOpacity:18});

const collectFx = group('Candy collected burst',[
  star('Burst 1',0,0,38,'FFFFD862'),star('Burst 2',-31,-19,14,'FFFF8EBE'),star('Burst 3',28,-24,11,'FFFFFFFF'),star('Burst 4',34,18,15,'FFC58CFF')
],{x:260,y:440,scaleX:0.45,scaleY:0.45},{collectX:13,collectY:14,collectOpacity:18});

const sugarRushFx = group('Sugar rush player aura',[
  ellipse('Warm rush wash',0,0,126,142,'226A3B63'),
  ellipse('Outer sugar ring',0,0,112,132,'00100918',{},stroke('BBFFD58B',2.2)),
  ellipse('Inner sugar ring',0,0,88,106,'00100918',{},stroke('66FF9D83',1.4)),
  star('Rush spark top',14,-66,13,'FFFFE5A8'),
  star('Rush spark left',-52,-18,9,'FFFFA38B'),
  star('Rush spark right',54,22,8,'FFFFD980'),
  line('Rush tail high',[[-116,-28],[-54,-21]],'88FFD592',2),
  line('Rush tail low',[[-135,28],[-48,17]],'66FF9B83',3)
],{x:260,y:482},{playerX:13,playerPivotY:14,sugarRushScale:16,sugarRushOpacity:18});

const characterShadow = group('Runner contact shadow',[
  ellipse('Soft contact',0,0,34,5,'33221C30'),
  ellipse('Core contact',0,0,18,3,'66221C30')
],{x:260,y:535},{shadowX:13,shadowY:14,shadowScaleX:16,shadowOpacity:18});

const landingFx = group('Landing ink burst',[
  ellipse('Landing ring',0,0,44,7,'00100918',{},stroke('BBFCD4A0',1.2)),
  line('Landing slash left',[[-8,-2],[-22,-9]],'BBD8A486',1.2),
  line('Landing slash right',[[8,-2],[22,-9]],'BBD8A486',1.2)
],{x:260,y:534},{shadowX:13,shadowY:14,landingScale:16,landingOpacity:18});

const jumpFx = group('Jump magic ring',[
  ellipse('Jump circle',0,0,36,12,'00100918',{},stroke('99EDD0B0',1.3)),
  line('Jump slash',[[-10,2],[-21,16]],'88FFC694',1),
  star('Jump spark',19,8,5,'FFEFCD9D')
],{x:260,y:534},{playerX:13,playerY:14,jumpFxScale:16,jumpFxOpacity:18});

const {backdrop,atmosphere,skyLife,midWorld,nearDecor,ground} =
  buildScenery({rect,ellipse,poly,line,star,group,gradient});

const hud = group('Gameplay HUD',[
  rect('Top HUD watercolor shade',640,49,1280,98,gradient('77231E36','00231E36',98)),
  rect('Night route rail',640,13,1214,2,'334E465F',1),
  rect('Night route progress',640,13,1214,2,'AAE8B58A',1).replace('><Rectangle',`>${bind('chapterProgress',16)}<Rectangle`),
  rect('Dash rail',1090,57,84,2,'44645B75',1),
  rect('Dash charge',1090,57,84,2,'FFE8B88B',1).replace('><Rectangle',`>${bind('dashReady',16)}<Rectangle`),
  rect('Blade rail',1170,57,58,2,'44645B75',1),
  rect('Blade charge',1170,57,58,2,'FFF1A58D',1).replace('><Rectangle',`>${bind('attackReady',16)}<Rectangle`),
  group('Hearts',[
    group('Heart one',[text('Heart glyph','♥',0,0,14,'FFE3AE9A')],{x:0,y:0},{heart1:18}),
    group('Heart two',[text('Heart glyph','♥',0,0,14,'FFE3AE9A')],{x:21,y:0},{heart2:18}),
    group('Heart three',[text('Heart glyph','♥',0,0,14,'FFE3AE9A')],{x:42,y:0},{heart3:18})
  ],{x:33,y:56}),
  text('Sugar label','SUGAR',33,76,8,'FFD8B9B5'),
  rect('Sugar meter back',118,82,138,4,'66463855',2),
  rect('Sugar meter fill',118,82,138,4,gradient('FFFFD37C','FFFF8B73',4),2).replace('><Rectangle',`>${bind('sugarMeter',16)}<Rectangle`),
  text('Run title','I  ROOFTOP DELIVERY',32,28,15,'FFF0D7C7',{font:'0:90',binding:'statusText'}),
  line('HUD separator',[[216,31],[216,49]],'446B5D77',1),
  text('Distance','0000 m',234,30,17,'FFEBD0AC',{binding:'distanceText',font:'0:90'}),
  text('Trial rank','TRIAL RANK  C',735,28,12,'FFFFD49B',{binding:'rankText',font:'0:90'}),
  text('Guild pace','GUILD PACE  +000',735,47,8,'FFD5BCC6',{binding:'rivalText'}),
  text('Score','000000',924,29,20,'FFE7D5CB',{binding:'scoreText',font:'0:90'}),
  star('Candy icon',1027,41,11,'FFE5BA85'),
  text('Candy count','00',1042,30,16,'FFE5BA85',{binding:'candyText',font:'0:90'}),
  text('Dash','READY',1090,66,9,'FFE0C9C5',{center:true,binding:'dashText'}),
  text('Blade','BLADE READY',1170,66,8,'FFE4C2BD',{center:true,binding:'attackText'}),
  group('Boss health plate',[
    text('Boss name','THE HUNGRY CAULDRON',640,94,12,'FFFFD1AA',{center:true,font:'0:90'}),
    text('Boss phase','PHASE I · SUGAR VOLLEY',640,111,9,'FFF0CED0',{center:true,binding:'bossPhaseText'}),
    rect('Boss health back',640,128,310,7,'88402D48',3),
    rect('Boss health fill',640,128,310,7,'FFFF805F',3).replace('><Rectangle',`>${bind('bossHp',16)}<Rectangle`)
  ],{}, {chaseOpacity:18}),
  group('Boss attack instruction',[
    rect('Boss cue ink wash',640,154,286,30,'AA102A42',8,{},stroke('AA5CF4FF',1.5)),
    line('Boss cue left flourish',[[462,154],[505,154]],'AA5CF4FF',2),
    line('Boss cue right flourish',[[775,154],[818,154]],'AA5CF4FF',2),
    text('Boss attack cue','READ THE ATTACK',640,146,13,'FFBDFBFF',{center:true,binding:'bossAttackText',font:'0:90'})
  ],{}, {chaseOpacity:18}),
  line('Pause left',[[1244,33],[1244,47]],'FFDDD0CB',2),
  line('Pause right',[[1251,33],[1251,47]],'FFDDD0CB',2),
  text('Combo','',640,76,14,'FFE9C6A1',{center:true,binding:'comboText',font:'0:90'}),
  group('Sugar rush announcement',[
    line('Rush callout left',[[446,210],[542,210]],'77F4BA86',2),
    line('Rush callout right',[[738,210],[834,210]],'77F4BA86',2),
    text('Rush callout','SUGAR RUSH  ×2',640,192,28,'FFFFDB94',{center:true,font:'0:90'})
  ],{}, {sugarBurstOpacity:18}),
  group('Explicit touch controls',[
    group('Jump button',[
      rect('Jump plate',90,672,130,40,'66302843',12,{},stroke('88E7C395',1)),
      text('Jump label','SPACE  JUMP',90,663,11,'FFF0D8C0',{center:true})
    ]),
    group('Flip button',[
      rect('Flip plate',235,672,130,40,'66302843',12,{},stroke('88E7C395',1)),
      text('Flip label','S  FLIP',235,663,11,'FFF0D8C0',{center:true})
    ]),
    group('Attack button',[
      rect('Attack plate',1045,672,130,40,'66302843',12,{},stroke('88F0B083',1)),
      text('Attack label','J  ATTACK',1045,663,11,'FFFFD0AE',{center:true})
    ]),
    group('Dodge button',[
      rect('Dodge plate',1190,672,130,40,'66302843',12,{},stroke('88F0B083',1)),
      text('Dodge label','K  DODGE',1190,663,11,'FFFFD0AE',{center:true})
    ])
  ])
],{}, {playOpacity:18});

const menu = group('Start and result menu',[
  rect('Menu veil',640,360,1280,720,'331E1930'),
  text('Collection label',"W I T C H ' S   C A N D Y   F A C T O R Y",640,197,10,'FFC5AFB9',{center:true}),
  text('Menu title','MIDNIGHT DELIVERY',640,231,47,'FFF1D5B4',{center:true,binding:'menuTitle',font:'0:90'}),
  text('Menu subtitle','The Sugar Moon is dying. Carry its last spark to the factory before the thirteenth bell.',640,298,13,'FFCFB9BB',{center:true,binding:'menuSubtitle'}),
  rect('Menu button',640,370,196,44,'FFDBAF88',3),
  text('Menu button label','BEGIN THE RUN',640,362,12,'FF35293D',{center:true,binding:'menuButton'}),
  text('Result','One courier. One furnace. One last batch.',640,415,11,'FFBCA9B6',{center:true,binding:'resultText'}),
  group('Result grade',[text('Night rank','NIGHT RANK  A',640,445,18,'FFFFD49B',{center:true,binding:'gradeText',font:'0:90'})],{}, {finishOpacity:18}),
  text('Menu controls','SPACE  JUMP      S  FLIP      J  ATTACK      K  DODGE      P  PAUSE',640,654,10,'FFB9A6B3',{center:true})
],{}, {menuOpacity:18});

const pause = group('Pause plate',[
  rect('Pause veil',640,360,1280,720,'B329233C'),
  text('Paused','PAUSED',640,307,38,'FFEBD0B0',{center:true,font:'0:90'}),
  text('Resume','Tap anywhere or press P to continue',640,369,13,'FFBFB0BD',{center:true})
],{}, {pauseOpacity:18});

const hitFlash = group('Damage flash',[
  rect('Damage tint',640,360,1280,720,'22FF786B'),
  rect('Top edge',640,2,1280,4,'88E79585'),rect('Bottom edge',640,718,1280,4,'88E79585')
],{}, {hitOpacity:18});

const controller=`<LayoutComponent width="1280" height="720" styleId="0:11" id="0:10"><LayoutComponentStyle id="0:11" positionTypeValue="absolute" positionLeft="0" positionTop="0" positionLeftUnitsValue="points" positionTopUnitsValue="points" layoutWidthScaleType="fill" layoutHeightScaleType="fill" widthUnitsValue="auto" heightUnitsValue="auto"/><ScriptedLayout scriptAssetId="0:80" id="0:12" name="Runner controller"/></LayoutComponent>`;
const world=group('Open bridge playfield',[
  bossImpact,bossMeteor,bossMeteorTarget,bossSweep,bridgeCollapse,nearDecor,ground,factoryGate,boss,bossTelegraph,platform,underObstacle,ghost,pumpkin,knight,obstacle,enemyShot,bossShockwave,bossShockwaveEcho,
  candy('Golden candy',680,455,'candy'),candy('Wrapped candy',980,360,'candy2',true),
  characterShadow,dust,landingFx,jumpFx,dashTrail,sugarRushFx,
  afterImage('Dodge echo far','afterX2','afterOpacity2'),
  afterImage('Dodge echo near','afterX1','afterOpacity1'),
  player,flipFx,cancelFx,attackSlash,projectile,impactFx,dangerWarning,collectFx
],{x:0,y:26},{cameraX:13,cameraY:14});
const paintedValley=`<Image name="Quiet ink wash valley" assetId="0:92" originX="0" originY="0" scaleX="0.76555024" scaleY="0.76514346"/>`;
const watercolorAtmosphere=group('Watercolor paper atmosphere',[
  `<Image name="Transparent watercolor grain" assetId="0:98" originX="0" originY="0" scaleX="0.76555024" scaleY="0.76514346"/>`
],{opacity:0.14});
const skyShade=rect('Quiet upper sky',640,190,1280,380,gradient('66272340','00272340',380));
const lowParallax=group('Low village parallax',[midWorld],{y:74,opacity:0.24});
const roots=[controller,perfectDodgeFx,chapterCard,hitFlash,pause,menu,finaleFx,hud,watercolorAtmosphere,chaseVignette,bossChapterAtmosphere,factoryChapterAtmosphere,speedLines,foregroundRush,world,cauldronCoreBackground,factoryInteriorBackground,lowParallax,skyLife,atmosphere,skyShade,paintedValley,backdrop];
const viewModel=`<ViewModel name="RunnerData" id="0:40" defaultInstanceId="0:41">${propertyEntries.map(p=>`<ViewModelProperty${p.type} name="${p.name}" id="${p.id}"/>`).join('')}<ViewModelInstance name="Default" id="0:41" exports="true">${propertyEntries.map(p=>`<ViewModelInstance${p.type} propertyValue="${esc(p.value)}" viewModelPropertyId="${p.id}"/>`).join('')}</ViewModelInstance></ViewModel>`;
const keyboardListeners=[
  keyboardActionListener('Jump keys',['space','w','up'],1),
  keyboardActionListener('Jump release',['space','w','up'],7,4),
  keyboardActionListener('Flip keys',['s','down'],5),
  keyboardActionListener('Attack keys',['j','z'],6),
  keyboardActionListener('Dodge keys',['k','x','right','leftShift','rightShift'],2),
  keyboardActionListener('Pause keys',['p','escape'],4),
  keyboardActionListener('Start key',['enter','kpEnter'],3),
].join('');
const scene=`<Rive version="1" kind="fragment"><Artboard name="Midnight Run" id="0:2" width="1280" height="720" styleId="0:5" viewModelId="0:40" defaultStateMachineId="0:7" clip="true"><FocusData id="0:15" canTraverse="false"/><LayoutComponentStyle id="0:5"/>${roots.join('')}<StateMachine name="Runner State" id="0:7">${keyboardListeners}<StateMachineLayer name="Main" id="0:8"><AnyState x="180" y="-140"/><ExitState x="400" y="-140"/><EntryState x="0" y="0"><StateTransition stateToId="0:14"/></EntryState><AnimationState x="220" y="0" animationId="0:6" id="0:14"><FocusActionTarget targetId="0:2"/></AnimationState></StateMachineLayer></StateMachine><LinearAnimation name="Runtime" id="0:6" duration="120" loopValue="loop"/></Artboard>${viewModel}<ScriptAsset file="runner.luau" name="runner" id="0:80"/><FontAsset file="assets/fonts/Lora.ttf" name="Lora" id="0:90"/><FontAsset file="assets/fonts/Inter.ttf" name="Inter" id="0:91"/><ImageAsset file="assets/art/twilight-valley-v2.png" name="Twilight Valley" id="0:92"/><AudioAsset file="assets/audio/jump.wav" name="jump" id="0:93"/><AudioAsset file="assets/audio/slash.wav" name="slash" id="0:94"/><AudioAsset file="assets/audio/perfect.wav" name="perfect" id="0:95"/><AudioAsset file="assets/audio/impact.wav" name="impact" id="0:96"/><AudioAsset file="assets/audio/boss.wav" name="boss" id="0:97"/><ImageAsset file="assets/art/watercolor-atmosphere-v1.png" name="Watercolor Atmosphere" id="0:98"/><AudioAsset file="assets/audio/music-rooftop.wav" name="music-rooftop" id="0:99"/><AudioAsset file="assets/audio/music-chase.wav" name="music-chase" id="0:100"/><AudioAsset file="assets/audio/music-boss-loop.wav" name="music-boss-loop" id="0:101"/></Rive>`;

writeFileSync(new URL('../runner/scene.rml', import.meta.url), scene.replaceAll('><','>\n<'));
console.log(`Runner scene generated with ${propertyEntries.length} bound properties.`);
