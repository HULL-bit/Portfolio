/** Mini-carte du trajet Touba / Mbacké → Dakar, en traits de circuit (schématique, sans valeur cartographique). */
export function JourneyMap({ from, to, label }: { from: string; to: string; label: string }) {
  const d = 'M 232 84 H 196 V 118 H 150 V 142 H 96 V 120 H 74';
  return (
    <svg className="jmap" viewBox="0 0 320 210" role="img" aria-label={label} focusable="false">
      <g stroke="#3D5AFE" strokeOpacity=".16">{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${i * 40} 0 V 210`} />)}{Array.from({ length: 6 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 40} H 320`} />)}</g>
      <path d={d} fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinejoin="round" />
      <circle r="3.6" className="jmap-packet" fill="#FFB800" style={{ offsetPath: `path('${d}')` }} />
      {[[232, 84], [196, 118], [150, 142], [74, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill="#05060A" stroke={i === 0 || i === 3 ? '#FFB800' : '#3D5AFE'} strokeWidth="2" />)}
      <g fontFamily="var(--font-mono)" fontSize="11" fill="currentColor">
        <text x="232" y="68" textAnchor="middle">{from}</text>
        <text x="74" y="146" textAnchor="middle">{to}</text>
      </g>
    </svg>
  );
}
