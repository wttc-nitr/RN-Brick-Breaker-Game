- `useAnimatedStyle` -> for complex styles. (if styles have some calculations rather than just values)
```typescript
const x = useSharedValue(0);
const ballStyle = useAnimatedStyle(() => {
  return {
    left: x.value * 2, // we can't multiply directly in useSharedValue but here we can.
  }
})
```
- `bridge` was asynchronous, but `JSI` is sync.
- `useSharedValue` declares variables on UI thread (kind of).
- `useSharedValue` when updated doesn't re-render the component. But, `useAnimatedStyle` style updates.
- it happens directly on UI thread.

```typescript
// change the value OVER TIME to this value
x.value = withTiming(x.value + 100);
```
## UI thread v/s JS thread
- running animations on UI thread is more performant.
- UI thread -> manages touch events, styling, positioning of elements
- previously, UI & JS thread used to communicate using a bridge (asynchronous) using JSON (serialization & deserialization)
- currently, no bridge & using JSI (sync)

- if we run animations on JS thread, then let's say there's a heavy operation happens on JS thread, then animations will be also blocked. So, we run animations on UI thread.

- `useState` re-renders the component but `useSharedValue` doesn't

- `runOnJS` -> to call a function (defined on JS thread) from UI thread (runs on JS thread **as the name says**)
- `runOnUI` -> opposite of above
- `worklet` -> to define a function on UI thread
```typescript
const foo = () => {
  'worklet';
  // logic
}
```
- `useAnimatedStyle` is already a worklet
- you can merge static styles & animated styles in `useAnimatedStyle`

#
- `useFrameCallback` -> provides a way to do something at each frame update.
```typescript
// if a frame takes longer/less time to render, then movement should be accordingly
useFrameCallback(() => {
  const delta = (frameInfo.timeSincePreviousFrame || 0) / 1000;

  let { x, y, dx, dy } = ball.value;

  x += dx * delta;
  y += dy * delta;
})
```
### Ball Boundary Trapping Issue
1. **Slow Frame Timing**
   - Ball starts below boundary
   - Long render delay → ball jumps above boundary
   - Collision detected → direction reversed (now moving down)

2. **Fast Frame Timing**
   - Short render delay → small downward movement
   - Ball remains above boundary
   - Collision detected again → direction reversed (now moving up)

3. **Resulting Loop**
   - Continuous boundary oscillation
   - Ball never escapes collision zone
   - Full board traversal prevented

- solution:
```typescript
if (y < r) {
  y = r; // Solution
  dy *= -1;
}
```
#
- side effects on JS thread -> `useEffect`
- side effects on UI thread -> `useAnimatedReaction`
#
- normal props v/s sharedValue props
```typescript
export default function Block({ block }: { block: BlockData }) {
  // props of this component aren't shared values
  // so, when a sharedValue change, this component won't reflect the latest props-data.
  // it'll only reflect when its parents will re-render (which will trigger this component to re-render)
  return <Animated.View style={styles} />;
}
```
```typescript
// now it will reflect when any sharedValue data changes
export default function Block ({blocks}: {blocks: SharedValue<BlockData[]>}) {
  //
  return <Animated.View style={styles} />
}
```
#
- `flatmap` -> map then flat with depth 1
