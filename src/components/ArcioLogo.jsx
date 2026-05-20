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
      {/* Microscope Icon in Blue Circle */}
      <div
        className="rounded-full flex items-center justify-center shrink-0 shadow-md"
        style={{
          width: s.icon,
          height: s.icon,
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: s.icon * 0.55, height: s.icon * 0.55 }}
        >
          {/* Microscope SVG */}
          <path d="M6 18h8" />
          <path d="M3 22h18" />
          <path d="M14 22a7 7 0 1 0 0-14h-1" />
          <path d="M9 14h2" />
          <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
          <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
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
