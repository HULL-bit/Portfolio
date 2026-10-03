/**
 * Pose la classe `motion` sur <html> avant le premier rendu (sauf prefers-reduced-motion).
 * Première visite sur la page d'accueil uniquement : pose aussi `booting` (boot sequence), jamais sur un lien direct
 * vers un projet ou la vue express. Garde-fou : si le moteur d'animation n'est pas prêt après 5 s, la classe est retirée
 * et tout le contenu redevient visible.
 */
const SCRIPT = String.raw`(function(){try{var d=document.documentElement;if(localStorage.getItem('diaw:theme')==='light')d.dataset.theme='light';if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');var p=location.pathname.replace(/\/+$/,'');if(/\/(fr|en)$/.test(p)&&!localStorage.getItem('diaw:booted')&&location.search.indexOf('noboot')<0){d.classList.add('booting');window.__bootT0=performance.now();setTimeout(function(){d.classList.remove('booting')},3500)}setTimeout(function(){if(!window.__motionReady)d.classList.remove('motion')},5000)}catch(e){}})()`;

export function HeadScripts() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
