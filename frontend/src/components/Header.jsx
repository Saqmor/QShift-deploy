function Header({ title, icon: Icon, children }) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={32} className="text-blue-400" />}
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        {children}
      </div>
      <div className="border-b border-slate-700"></div>
    </div>
  );
}

export default Header;
