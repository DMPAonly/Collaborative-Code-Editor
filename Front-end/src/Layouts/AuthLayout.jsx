function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>

          {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
