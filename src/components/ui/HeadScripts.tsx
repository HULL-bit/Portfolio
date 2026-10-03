/**
 * Pose la classe `motion` sur <html> avant le premier rendu (sauf prefers-reduced-motion).
 * Garde-fou : si le moteur d'animation n'est pas prêt après 5 s, la classe est retirée
 * et tout le contenu redevient visible.
 */
const SCRIPT = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');setTimeout(function(){if(!window.__motionReady)d.classList.remove('motion')},5000)}catch(e){}})()`;

export function HeadScripts() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
