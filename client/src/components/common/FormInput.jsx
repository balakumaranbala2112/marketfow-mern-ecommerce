function FormInput({ label, id, type = "text", register, error, ...rest }) {
  return (
    <div className="space-y-1.5">

      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 ${error
            ? "border-red-300 focus:border-red-400"
            : "border-slate-200 focus:border-emerald-500"
          }`}

        {...(register || {})}

        {...rest}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FormInput;
