function AuthCard({ icon: Icon, iconTone = "primary", title, subtitle, children, footer }) {
  const iconTones = {
    primary: "bg-primary-50 text-primary-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="animate-fade-in w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-900/5 sm:p-10">
          <div className="mb-8">
            {Icon ? (
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconTones[iconTone] || iconTones.primary}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            ) : null}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
            ) : null}
          </div>

          {children}

          {footer ? <div className="mt-8">{footer}</div> : null}
        </div>
      </div>
    </main>
  );
}

export default AuthCard;
