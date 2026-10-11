-- Interactive recipe controller. All presentation stays editable in RML.
type Game = {
    numbers: {[string]: Property<number>}, strings: {[string]: Property<string>},
    elapsed: number, order: number, phase: number, dragging: number,
    added: {boolean}, stirring: boolean, angle: number, turn: number,
    mix: number, pointer: Vector, size: Vector,
}
local names = {'order','phase','action','progress','magicLevel','corruption','mix','elapsed','endingChoice','eyeX','eyeY','stirRotation','choiceOpacity','gameOpacity','dawnOpacity','witchBob','tailRotation','jar1X','jar1Y','jar2X','jar2Y','jar3X','jar3Y','jar1Opacity','jar2Opacity','jar3Opacity','progressWidth'}
local texts = {'orderLabel','recipe','recipeNote','ingredient1','ingredient2','status','button','dialogue','clock','endingTitle','endingText','jar2Label','jar3Label'}
local recipes = {{1,2},{1,3},{2,3}}
local function put(self: Game, name: string, value: number)
    local p=self.numbers[name]; if p then p.value=value end
end
local function say(self: Game, name: string, value: string)
    local p=self.strings[name]; if p then p.value=value end
end
local function setupOrder(self: Game)
    self.added={false,false,false}; self.mix=0; self.phase=0; self.dragging=0; self.stirring=false
    for i=1,3 do put(self,'jar'..i..'X',205); put(self,'jar'..i..'Y',190+i*145); put(self,'jar'..i..'Opacity',1) end
    put(self,'order',self.order); put(self,'choiceOpacity',0); put(self,'endingChoice',0); put(self,'dawnOpacity',0)
    put(self,'corruption',(self.order-1)*0.34)
    say(self,'orderLabel','ORDER 0'..self.order..' / 03')
    say(self,'recipe',({'Pumpkin Pop','Eye Candy','Memory Candy'})[self.order])
    say(self,'recipeNote',({'A little autumn. A little magic.','Funny. They seem to be watching you.','One happy memory. That is all it takes.'})[self.order])
    say(self,'ingredient1',({'Moon sugar','Moon sugar','One happy memory'})[self.order])
    say(self,'ingredient2',({'Pumpkin spice','Ghost cream','Ghost cream'})[self.order])
    say(self,'jar2Label',if self.order==3 then 'Happy memory' else 'Pumpkin spice')
    say(self,'status','Drag the two recipe ingredients into the cauldron.')
    say(self,'dialogue',({'MIRA  /  Welcome, apprentice. Let’s make a little magic.','MIRA  /  Don’t mind the eyes. They’re just curious.','FAMILIAR  /  These memories belong to the children...'})[self.order])
    say(self,'button','ADD INGREDIENTS'); say(self,'clock',({'11:51 PM','11:55 PM','11:59 PM'})[self.order])
end
local function init(self: Game, context: Context): boolean
    local vm=context:viewModel(); if not vm then return true end
    for _,n in names do local p=vm:getNumber(n); if p then self.numbers[n]=p end end
    for _,n in texts do local p=vm:getString(n); if p then self.strings[n]=p end end
    setupOrder(self); return true
end
local function inPot(p: Vector): boolean
    return ((p.x-810)/192)^2+((p.y-554)/65)^2<1.4
end
local function pointerDown(self: Game, event: PointerEvent)
    if self.phase>=2 then return end
    local p=event.position; self.pointer=p
    for i=1,3 do
        if not self.added[i] and math.abs(p.x-205)<68 and math.abs(p.y-(190+i*145))<67 then
            self.dragging=i; event:hit(); return
        end
    end
    if self.phase==1 and inPot(p) then
        self.stirring=true; self.angle=math.atan2((p.y-554)*2.9,p.x-810); event:hit()
    end
end
local function pointerMove(self: Game, event: PointerEvent)
    self.pointer=event.position
    if self.dragging>0 then
        put(self,'jar'..self.dragging..'X',event.position.x); put(self,'jar'..self.dragging..'Y',event.position.y); event:hit()
    elseif self.stirring then
        local p=event.position
        if inPot(p) and math.abs(p.x-810)+math.abs(p.y-554)>25 then
            local a=math.atan2((p.y-554)*2.9,p.x-810)
            local delta=math.atan2(math.sin(a-self.angle),math.cos(a-self.angle))
            self.mix=math.min(1,self.mix+math.min(math.abs(delta),0.7)/(math.pi*5)); self.turn+=delta
            self.angle=a
        end
        event:hit()
    end
end
local function release(self: Game, event: PointerEvent)
    local i=self.dragging
    if i>0 then
        if inPot(event.position) then
            local recipe=recipes[self.order]
            if i==recipe[1] or i==recipe[2] then
                self.added[i]=true; put(self,'jar'..i..'Opacity',0.35)
                say(self,'status','Lovely. Add the other ingredient.')
            else say(self,'status','That ingredient is not on this recipe. Try another.') end
            if self.added[recipe[1]] and self.added[recipe[2]] then
                self.phase=1; say(self,'status','Hold inside the syrup and draw circles. About three turns!'); say(self,'button','STIR THE CAULDRON')
            end
        end
        put(self,'jar'..i..'X',205); put(self,'jar'..i..'Y',190+i*145); event:hit()
    end
    if self.stirring then event:hit() end
    self.dragging=0; self.stirring=false
end
local function pointerExit(self: Game, event: PointerEvent)
    if self.dragging>0 then local i=self.dragging; put(self,'jar'..i..'X',205); put(self,'jar'..i..'Y',190+i*145) end
    self.dragging=0; self.stirring=false
end
local function advance(self: Game, dt: number): boolean
    self.elapsed+=dt
    local action=self.numbers.action
    if action and action.value>0 then
        local a=action.value; action.value=0
        if a==4 or (a==6 and self.phase==4) then self.order=1; setupOrder(self)
        elseif a==1 and self.phase==2 then
            if self.order<3 then self.order+=1; setupOrder(self)
            else self.phase=3; put(self,'choiceOpacity',1); say(self,'endingTitle','The last batch'); say(self,'endingText','Mira is stealing the children’s memories to make Halloween last forever. Will you finish her spell, or let the magic go?') end
        elseif a==1 and self.phase==1 then
            say(self,'status','Hold the syrup and trace a circle. The magic follows your hand.')
        elseif (a==2 or a==3) and self.phase==3 then
            self.phase=4; put(self,'endingChoice',a-1)
            if a==2 then say(self,'endingTitle','Forever Halloween'); say(self,'endingText','The factory shines brighter than ever. Outside, the town fades to grey. “Halloween will never end,” Mira whispers.'); put(self,'corruption',1)
            else say(self,'endingTitle','Let the morning in'); say(self,'endingText','The memories float home. The children remember. “Maybe Halloween is special because it ends.” A new morning begins.'); put(self,'dawnOpacity',0.52); put(self,'corruption',0) end
            say(self,'clock','12:00 AM')
        end
    end
    if self.phase==1 and self.mix>=1 then
        self.phase=2; self.stirring=false; say(self,'button',if self.order==3 then 'THE FINAL ORDER' else 'SEND THE BATCH'); say(self,'status','Your candy is ready. Send it down the conveyor!'); say(self,'dialogue',if self.order==3 then 'MIRA  /  If they never forget, Halloween never has to end.' else 'MIRA  /  Perfect. Sweetness with just a hint of mischief.')
    end
    put(self,'phase',self.phase); put(self,'mix',self.mix); put(self,'progressWidth',264*self.mix)
    put(self,'magicLevel',0.15+self.mix*0.65+(self.order-1)*0.1); put(self,'elapsed',self.elapsed)
    put(self,'stirRotation',math.sin(self.elapsed*1.5+self.turn)*0.10)
    put(self,'eyeX',math.clamp((self.pointer.x-810)/85,-9,9)); put(self,'eyeY',math.clamp((self.pointer.y-780)/55,-7,7))
    return true
end
return function(_context: Context): Layout<Game>
    return {numbers={},strings={},elapsed=0,order=1,phase=0,dragging=0,added={false,false,false},stirring=false,angle=0,turn=0,mix=0,pointer=Vector.xy(810,554),size=Vector.xy(1600,900),init=init,advance=advance,pointerDown=pointerDown,pointerMove=pointerMove,pointerUp=release,pointerExit=pointerExit}
end
