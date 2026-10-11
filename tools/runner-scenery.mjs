// Airy, layered Rive scenery. Gameplay geometry stays in world coordinates;
// the scene places the bridge 26 px below its collision coordinate.
export function buildScenery({rect, ellipse, poly, line, star, group, gradient}) {
  const backdrop = rect('Twilight sky', 640, 360, 1280, 720,
    gradient('FF29263F', 'FFCAA59E', 720));

  const atmosphere = group('Quiet moon and drifting haze', [
    ellipse('Moon outer halo', 995, 173, 210, 210, '04F9DEBA'),
    ellipse('Moon inner halo', 995, 173, 142, 142, '08F9DEBA'),
    ellipse('Autumn moon', 995, 173, 91, 91, 'FFEED0AC'),
    ellipse('Moon wash one', 1009, 153, 22, 17, '15AF8D93'),
    ellipse('Moon wash two', 975, 179, 14, 21, '10AF8D93'),
    poly('Thin moon veil', [[900,194],[959,186,40],[1022,191,40],[1085,198,40],[995,198,40]], '114F455D'),
    ...[[158,117,2],[446,151,1.6],[754,116,1.7],[1141,105,2],[661,213,1.4],[1069,294,1.3]].map(([x,y,s],i) =>
      star(`Distant star ${i}`,x,y,s*2,'889C9AAD')),
    line('High wind', [[73,179],[172,179]], '186F607D', 1),
    line('High wind east', [[1050,266],[1205,266]], '187E6C85', 1)
  ]);

  function bat(name, x, y, scale=1) {
    return group(name, [
      group('Left wing', [
        poly('Left wing membrane', [[0,0],[-16,-9],[-29,-3],[-18,2],[-27,10],[-11,6]], '88665368')
      ], {}, {batWingL:15}),
      group('Right wing', [
        poly('Right wing membrane', [[0,0],[16,-9],[29,-3],[18,2],[27,10],[11,6]], '88665368')
      ], {}, {batWingR:15}),
      ellipse('Bat body',0,2,7,13,'AA3B3148'),
      poly('Bat ears',[[-3,-5],[-2,-10],[0,-6],[3,-10],[3,-4]],'AA3B3148')
    ], {x,y,scaleX:scale,scaleY:scale});
  }

  const skyLife = group('Slow crossing bat silhouettes', [
    ...[0,1280].flatMap(offset=>[
      group('High bat flight', [bat('Lead bat',180,0,0.78),bat('High follower',226,14,0.48)], {x:offset,y:148}, {batY1:14}),
      group('Middle bat flight', [bat('Middle lead',710,0,0.6),bat('Middle follower',750,-18,0.38)], {x:offset,y:244}, {batY2:14}),
      group('Low bat flight', [bat('Low solitary bat',1060,0,0.52)], {x:offset,y:328}, {batY3:14})
    ])
  ], {}, {skyX:13});

  function farLayer(offset) {
    return group(`Distant valley ${offset}`, [
      poly('Long mist ridge', [[offset,472],[offset+117,424,42],[offset+206,445,38],[offset+344,402,55],[offset+491,456,48],[offset+629,411,45],[offset+735,437,38],[offset+867,396,48],[offset+1016,445,42],[offset+1152,416,50],[offset+1280,472],[offset+1280,720],[offset,720]], 'FF82768B'),
      poly('Distant factory ridge', [[offset,529],[offset+86,490,32],[offset+197,509,28],[offset+337,478,40],[offset+439,512,35],[offset+598,481,40],[offset+724,527,40],[offset+883,478,35],[offset+1022,510,44],[offset+1174,494,42],[offset+1280,529],[offset+1280,720],[offset,720]], 'FF776C82'),
      ...[145,406,807,1118].map((x,i) => group(`Far turret ${i}`, [
        poly('Distant spire', [[-13,20],[-10,-39],[0,-69],[11,-36],[13,20]], 'FF797086'),
        line('Spire needle', [[0,-66],[1,-83]], 'FF797086', 1),
        rect('Far window',0,-21,3,6,'668F8090',1)
      ], {x:offset+x,y:478-(i%2)*20})),
      poly('Valley haze', [[offset,589],[offset+254,541,60],[offset+492,573,60],[offset+701,534,60],[offset+1001,561,60],[offset+1280,589],[offset+1280,720],[offset,720]], gradient('007F7088','778D7D90',140))
    ]);
  }
  const farWorld = group('Slow distant valley', [farLayer(0),farLayer(1280)], {}, {farX:13});

  function tower(x,y,w,h,name) {
    return group(name, [
      poly('Leaning tower wall', [[-w/2,0],[-w*.39,-h],[w*.38,-h+4],[w/2,0]], 'FF51495F'),
      poly('Crooked tower roof', [[-w*.68,-h+3],[w*.07,-h-43],[w*.25,-h-37],[w*.63,-h+7]], 'FF494358'),
      line('Roof finial', [[w*.07,-h-42],[w*.1,-h-57]], 'FF51495F',1.2),
      rect('Single amber window',w*.07,-h+24,5,11,'FFBB9385',2),
      line('Tower cornice', [[-w*.44,-h+7],[w*.46,-h+9]], 'FF62546C',2)
    ], {x,y});
  }
  function village(offset) {
    return group(`Sleeping witch village ${offset}`, [
      poly('Near valley slope', [[offset,650],[offset+92,582,25],[offset+212,595,25],[offset+386,560,30],[offset+541,610,35],[offset+713,575,30],[offset+915,601,40],[offset+1060,556,35],[offset+1193,607,45],[offset+1280,650],[offset+1280,800],[offset,800]], 'FF61566F'),
      tower(offset+87,634,40,137,'West bell tower'),
      tower(offset+1128,639,43,181,'Candy clock tower'),
      tower(offset+438,674,28,96,'Distant apothecary'),
      poly('Village crooked roofs', [[offset+106,647],[offset+174,579],[offset+195,588],[offset+259,655],[offset+339,618],[offset+411,674],[offset+560,641],[offset+679,598],[offset+703,607],[offset+760,672],[offset+915,629],[offset+969,662],[offset+1076,609],[offset+1202,675],[offset+1202,800],[offset+106,800]], 'FF51485F'),
      line('Bridge in the mist', [[offset+447,603],[offset+698,603]],'66574C64',2),
      ...[188,361,677,947,1069].map((x,i)=>rect(`Distant lit window ${i}`,offset+x,650+(i%2)*27,4,9,'66D1A280',1)),
      poly('Low mist', [[offset,702],[offset+191,669,45],[offset+384,683,55],[offset+661,657,75],[offset+906,691,70],[offset+1121,674,50],[offset+1280,702],[offset+1280,800],[offset,800]],'446E6079')
    ]);
  }
  const midWorld=group('Middle village parallax',[village(0),village(1280)],{}, {midX:13});

  const nearDecor=group('Low passing silhouettes',[0,1280].flatMap(offset=>[
    poly('Low west roof',[[offset-130,760],[offset+8,650],[offset+42,643],[offset+135,716],[offset+200,760]],'FF352E45'),
    line('Low bare branch',[[offset+810,760],[offset+837,667],[offset+878,629]],'FF3C334C',4),
    line('Branch fork',[[offset+837,667],[offset+808,637]],'FF3C334C',2),
    poly('Low east roof',[[offset+931,760],[offset+1063,678],[offset+1092,671],[offset+1194,742],[offset+1280,760]],'FF3B324A')
  ]),{}, {nearX:13});

  function bridge(offset) {
    return group(`Narrow roof bridge ${offset}`,[
      line('Hanging suspension', [[offset,545],[offset+158,600,90],[offset+320,545],[offset+478,601,90],[offset+640,545],[offset+798,600,90],[offset+960,545],[offset+1118,601,90],[offset+1280,545]],'7754485C',1.3),
      ...Array.from({length:8},(_,i)=>line(`Fine suspension ${i}`,[[offset+i*160+80,541],[offset+i*160+80,579]],'5552475A',1)),
      rect('Slim dark deck',offset+640,538,1280,8,'FF2F283D'),
      line('Worn upper edge',[[offset,534],[offset+1280,534]],'FFC39B8B',1.5),
      line('Deck underside',[[offset,543],[offset+1280,543]],'FF4F3F54',1),
      ...Array.from({length:40},(_,i)=>line(`Plank tick ${i}`,[[offset+i*32+7,535],[offset+i*32+5,541]],i%3?'FF624B5D':'FF957063',1))
    ]);
  }
  const ground=group('Infinite high bridge',[bridge(0),bridge(1280)],{}, {groundX:13});
  return {backdrop,atmosphere,skyLife,farWorld,midWorld,nearDecor,ground};
}
