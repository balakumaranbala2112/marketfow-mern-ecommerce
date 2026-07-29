function FormTextarea({ label, id, register, error, rows = 4, ...rest }) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-[13px] font-semibold text-gray-600"
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        rows={rows}
        className={`w-full resize-none rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
            : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
        }`}
        {...(register || {})}
        {...rest}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

export default FormTextarea;
