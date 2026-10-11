import {spawnSync} from 'node:child_process';
import {readFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const rive=process.env.RIVE_BIN || path.join(process.env.USERPROFILE,'.rive','bin','rive.exe');
const out=path.join(root,'factory','build'); mkdirSync(out,{recursive:true});
const args=['factory','--advance=2'];
const drag=i=>args.push(`--pointer=drag@205,${190+i*145}>810,554:12`,'--advance=2');
const stir=()=>{
    args.push('--pointer=down@940,554');
    for(let n=1;n<=80;n++){const a=n*Math.PI*6/80;args.push(`--pointer=move@${(810+Math.cos(a)*130).toFixed(1)},${(554+Math.sin(a)*39).toFixed(1)}`);}
    args.push('--pointer=up@940,554','--advance=2');
};
function check(name,expected,sequence=args){
    const file=path.join(out,`${name}.json`); const image=path.join(out,`${name}.png`);
    const r=spawnSync(rive,[...sequence,`--data-dump=${file}`,`--screenshot=${image}`],{cwd:root,encoding:'utf8'});
    if(r.status!==0)throw new Error(r.stdout+r.stderr);
    const state=JSON.parse(readFileSync(file,'utf8')).viewModel.properties;
    for(const[k,v]of Object.entries(expected))assert.equal(state.find(p=>p.name===k)?.value,v,`${name}: ${k}`);
    console.log(`PASS ${name}: ${JSON.stringify(expected)}`);
}
check('initial',{order:1,phase:0});
const invalid=[...args,'--pointer=drag@205,625>810,554:12','--advance=2'];
check('wrong-ingredient',{phase:0,jar3Opacity:1},invalid);
for(const [index,recipe] of [[1,[1,2]],[2,[1,3]],[3,[2,3]]]){
    recipe.forEach(drag); check(`order-${index}-loaded`,{order:index,phase:1});
    stir(); check(`order-${index}-ready`,{order:index,phase:2,mix:1});
    args.push('--pointer=click@1340,640','--advance=3');
}
check('choice',{order:3,phase:3,choiceOpacity:1});
check('ending-forever',{phase:4,endingChoice:1},[...args,'--pointer=click@630,565','--advance=3']);
const release=[...args,'--pointer=click@973,565','--advance=3'];
check('ending-release',{phase:4,endingChoice:2},release);
check('restart',{order:1,phase:0,mix:0,choiceOpacity:0},[...release,'--pointer=click@1500,169','--advance=3']);
