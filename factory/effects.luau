type Effects = {
    canvas: GPUCanvas?, pipeline: GPUPipeline?, uniforms: GPUBuffer?, group: GPUBindGroup?,
    data: buffer, time: number, magic: Property<number>?, corruption: Property<number>?, mix: Property<number>?,
    scale: number, context: Context?, sampler: ImageSampler,
}
local function init(self: Effects, context: Context): boolean
    self.context=context
    local vm=context:viewModel()
    if vm then self.magic=vm:getNumber('magicLevel'); self.corruption=vm:getNumber('corruption'); self.mix=vm:getNumber('mix') end
    if not self.canvas then
        self.canvas=context:gpuCanvas({width=512,height=160})
        local shader=context:shader('candy_liquid')
        if shader and self.canvas then
            self.pipeline=GPUPipeline.new({vertex=shader,fragment=shader,vertexLayout={},colorTargets={{format=self.canvas.format}}})
            self.uniforms=GPUBuffer.new({size=16,usage='uniform'})
            self.group=GPUBindGroup.new({layout=self.pipeline:getBindGroupLayout(0),ubos={{slot=0,buffer=self.uniforms}}})
        end
    end
    return true
end
local function advance(self: Effects, dt: number): boolean self.time+=dt; return true end
local function resize(self: Effects, _size: Vector, scale: number)
    -- GPU surfaces use device pixels; the final transform remains artboard units.
    local context=self.context; if not context then return end
    self.scale=math.clamp(scale,1,3)
    local width=math.ceil(390*self.scale); local height=math.ceil(108*self.scale)
    local canvas=self.canvas
    if not canvas or canvas.width~=width or canvas.height~=height then self.canvas=context:gpuCanvas({width=width,height=height}) end
end
local function draw(self: Effects, renderer: Renderer)
    local canvas=self.canvas; local pipeline=self.pipeline; local uniforms=self.uniforms; local group=self.group
    if not canvas or not pipeline or not uniforms or not group then return end
    buffer.writef32(self.data,0,self.time)
    buffer.writef32(self.data,4,if self.magic then self.magic.value else 0.2)
    buffer.writef32(self.data,8,if self.corruption then self.corruption.value else 0)
    buffer.writef32(self.data,12,if self.mix then self.mix.value else 0)
    uniforms:write(self.data)
    local pass=canvas:beginRenderPass({color={{loadOp='clear',storeOp='store',clearColor={0,0,0,0}}}})
    pass:setPipeline(pipeline); pass:setBindGroup(0,group); pass:draw(3); pass:finish()
    renderer:save()
    renderer:transform(Mat2D.withScaleAndTranslation(390/canvas.width,108/canvas.height,615,500))
    renderer:drawImage(canvas.image,self.sampler,'srcOver',1)
    renderer:restore()
end
return function(): Layout<Effects>
    return {canvas=nil,pipeline=nil,uniforms=nil,group=nil,data=buffer.create(16),time=0,magic=nil,corruption=nil,mix=nil,scale=1,context=nil,sampler=ImageSampler('clamp','clamp','bilinear'),init=init,resize=resize,advance=advance,draw=draw}
end
