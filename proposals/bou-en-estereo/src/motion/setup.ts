import {gsap} from 'gsap';
import {onPage, onScroll, prefersReducedMotion, setTransition} from '@/engine';
export function setupMotion(){
  setTransition({leave:c=>gsap.timeline().set(c,{autoAlpha:1}).fromTo(c.querySelector('.curtain__panel'),{scaleX:0,transformOrigin:'left'},{scaleX:1,duration:.35,ease:'expo.inOut'}),enter:c=>gsap.timeline().to(c.querySelector('.curtain__panel'),{scaleX:0,transformOrigin:'right',duration:.4,ease:'expo.inOut'}).set(c,{autoAlpha:0})});
  onPage(()=>{
    if(prefersReducedMotion())return;
    const scene=document.querySelector<HTMLElement>('.hero-scene');
    if(!scene)return;
    const state={progress:0,pointer:0};
    let visible=true;
    const left=scene.querySelector('.stereo-left');
    const right=scene.querySelector('.stereo-right');
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});
    observer.observe(scene);
    const off=onScroll(({y})=>{state.progress=Math.min(1,y/650);});
    const pointer=(e:PointerEvent)=>{const r=scene.getBoundingClientRect();state.pointer=(e.clientX-r.left)/r.width-.5;};
    const reset=()=>{state.pointer=0;};
    scene.addEventListener('pointermove',pointer);
    scene.addEventListener('pointerleave',reset);
    const tick=(time:number)=>{if(!visible||document.hidden)return;const open=state.progress*14+state.pointer*12+Math.sin(time*.65)*4;gsap.set(left,{x:-open,y:-open*.25});gsap.set(right,{x:open,y:open*.25});};
    gsap.ticker.add(tick);
    return ()=>{off();observer.disconnect();gsap.ticker.remove(tick);scene.removeEventListener('pointermove',pointer);scene.removeEventListener('pointerleave',reset);};
  });
}
