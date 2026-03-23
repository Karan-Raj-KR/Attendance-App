export default function Card({ children, title, subtitle, action, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white/5 backdrop-blur-xl border border-white/10
        rounded-2xl overflow-hidden
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <div>
            {title && <h3 className="text-white font-semibold text-base">{title}</h3>}
            {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
