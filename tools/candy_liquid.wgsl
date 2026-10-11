struct Uniforms { time: f32, magic: f32, corruption: f32, stirring: f32 }
@group(0) @binding(0) var<uniform> u: Uniforms;
struct VertexOut { @builtin(position) position: vec4<f32>, @location(0) uv: vec2<f32> }
@vertex fn vs_main(@builtin(vertex_index) i:u32) -> VertexOut {
    var p=array<vec2<f32>,3>(vec2<f32>(-1.,-1.),vec2<f32>(3.,-1.),vec2<f32>(-1.,3.));
    var o:VertexOut; o.position=vec4<f32>(p[i],0.,1.); o.uv=p[i]*.5+vec2<f32>(.5); return o;
}
@fragment fn fs_main(v:VertexOut) -> @location(0) vec4<f32> {
    let p=(v.uv-vec2<f32>(.5))*2.;
    let r=length(p); let a=atan2(p.y,p.x);
    let t=u.time*(.5+u.stirring*.6);
    let flow=sin(r*27.-a*3.+t*2.+sin(a*5.+t)*.6);
    let ribbons=pow(max(0.,flow),5.);
    let base=mix(vec3<f32>(.95,.25,.07),vec3<f32>(.31,.07,.51),u.corruption);
    let hot=mix(vec3<f32>(1.,.79,.22),vec3<f32>(.91,.27,.82),u.corruption);
    var color=mix(base,hot,.5+.3*sin(r*12.+a-t));
    color+=ribbons*vec3<f32>(.55,.4,.19)*(.45+u.magic*.6);
    color+=pow(max(0.,1.-r),7.)*vec3<f32>(.65,.4,.2);
    let edge=1.-smoothstep(.94,1.,r);
    return vec4<f32>(color*edge,edge);
}
