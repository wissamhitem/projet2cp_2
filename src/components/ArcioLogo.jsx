export function ArcioLogo({ size = 'md', subtitle = '', collapsed = false }) {
  const sizes = {
    sm: { icon: 32, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 56, text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-4xl', sub: 'text-sm' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
      {/* Logo Icon */}
      <div
        className="rounded-full flex items-center justify-center shrink-0 border-[2.5px] border-[#006591] bg-white shadow-sm"
        style={{
          width: s.icon,
          height: s.icon,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#006591"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: s.icon * 0.65, height: s.icon * 0.65 }}
        >
          {/* Nurse figure */}
          <circle cx="7" cy="8" r="2.5" fill="#006591" stroke="none" />
          <path d="M4.5 4h5v2.5h-5z" fill="#006591" stroke="none" />
          {/* Cross on hat */}
          <path d="M6 5.25h2M7 4.25v2" stroke="white" strokeWidth="0.8" />
          {/* Nurse body */}
          <path d="M3 18.5v-1c0-1.5 1.5-2.5 3-2.5h1" />
          
          {/* Baby/wrapped figure */}
          <circle cx="10" cy="14" r="1.5" fill="#006591" stroke="none" />
          <path d="M8 18.5v-1.5c0-.5.5-1 1-1h2c.5 0 1 .5 1 1v1.5" />
          
          {/* Chart with ECG */}
          <rect x="13" y="4" width="8" height="14.5" rx="1.5" />
          <path d="M14.5 11.5h1l1-2 1.5 4 1-2h1" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Text */}
      {!collapsed && (
        <div className="flex flex-col">
          <span className={`${s.text} font-extrabold text-[#0f172a] tracking-tight leading-tight`}>
            Arcio Clinical
          </span>
          {subtitle && (
            <span className={`${s.sub} font-bold text-[#94a3b8] uppercase tracking-[0.15em] leading-tight`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
