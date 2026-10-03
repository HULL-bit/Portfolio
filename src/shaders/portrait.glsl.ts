/**
 * Portrait en particules : un seul « place() » partagé par les points, les nœuds et les lignes du réseau,
 * pour que les trois couches restent parfaitement alignées pendant la désagrégation.
 *  - uProgress : nuage chaotique → portrait (staggeré par particule)
 *  - uDisperse : portrait → réseau de nœuds connectés (scroll)
 *  - uMouse / uPush / uRadius : répulsion à la souris
 */
const PLACE = /* glsl */ `
uniform float uTime, uProgress, uDisperse, uScale, uPush, uRadius;
uniform vec3 uOffset, uNetScale;
uniform vec2 uMouse;
attribute vec3 aTarget, aChaos, aNet;
attribute vec4 aRand;
attribute float aLum;

// champ de flux pseudo-curl (peu coûteux) : mouvement permanent léger
vec3 flow(vec3 p, float t) {
  return vec3(
    sin(p.y * 2.7 + t * 0.9) + sin(p.z * 4.1 - t * 0.6),
    sin(p.z * 2.3 + t * 0.7) + sin(p.x * 3.9 + t * 0.8),
    sin(p.x * 2.1 + t * 1.1) + sin(p.y * 4.3 - t * 0.5));
}

vec3 place(out float disperse) {
  float pr = clamp(uProgress * 1.45 - aRand.x * 0.45, 0.0, 1.0);
  pr = 1.0 - pow(1.0 - pr, 4.0);
  vec3 portrait = aTarget * uScale + uOffset;
  vec3 pos = mix(aChaos, portrait, pr);
  pos += flow(portrait * 1.4, uTime) * (0.006 + (1.0 - pr) * 0.04) * uScale;

  float d = clamp(uDisperse * 1.3 - aRand.y * 0.3, 0.0, 1.0);
  d = d * d * (3.0 - 2.0 * d);
  vec3 net = aNet * uNetScale + flow(aNet * 2.0, uTime * 0.4) * 0.045;
  pos = mix(pos, net, d);

  vec2 diff = pos.xy - uMouse;
  float dist = length(diff);
  float f = smoothstep(uRadius, 0.0, dist);
  pos.xy += (diff / (dist + 1e-4)) * f * uPush * (1.0 - d);
  disperse = d;
  return pos;
}`;

export const POINTS_VERTEX = /* glsl */ `
${PLACE}
uniform float uSize, uDpr, uAlpha;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d;
  vec3 pos = place(d);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  float gold = step(0.95, aRand.z);                       // ~5 % de points or
  vec3 base = mix(vec3(0.239, 0.353, 0.996), vec3(0.0, 0.898, 1.0), smoothstep(0.1, 0.95, aLum));
  vColor = mix(base, vec3(1.0, 0.72, 0.0), gold);
  float spark = mix(1.0, 0.6 + 0.4 * sin(uTime * 4.0 + aRand.w * 40.0), gold);   // scintillement
  vAlpha = uAlpha * mix(1.0, 0.08, d) * (0.4 + 0.6 * aLum) * spark;
  gl_PointSize = uSize * uDpr * (0.45 + aLum * 1.1) * (1.0 - d * 0.5) * (1.0 + gold * 0.6);
}`;

export const POINTS_FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, r);
  gl_FragColor = vec4(vColor, a * vAlpha);
}`;

export const NODES_VERTEX = /* glsl */ `
${PLACE}
uniform float uDpr, uAlpha;
varying float vAlpha;
varying vec3 vColor;
void main() {
  float d;
  vec3 pos = place(d);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vColor = mix(vec3(0.0, 0.898, 1.0), vec3(1.0, 0.72, 0.0), step(0.9, aRand.z));
  vAlpha = uAlpha * smoothstep(0.05, 0.6, d);
  gl_PointSize = (3.2 + aRand.w * 3.0) * uDpr;
}`;

export const LINES_VERTEX = /* glsl */ `
${PLACE}
uniform float uAlpha;
varying float vAlpha;
varying vec3 vColor;
void main() {
  float d;
  vec3 pos = place(d);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vColor = mix(vec3(0.239, 0.353, 0.996), vec3(0.0, 0.898, 1.0), aLum);
  vAlpha = uAlpha * smoothstep(0.15, 0.9, d) * 0.5;
}`;

export const LINES_FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() { gl_FragColor = vec4(vColor, vAlpha); }`;
