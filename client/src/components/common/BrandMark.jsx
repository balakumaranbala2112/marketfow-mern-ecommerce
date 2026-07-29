import { Link } from "react-router";
import routePaths from "../../routes/routePaths.js";

function BrandMark({ showName = true, className = "" }) {
  return (
    <Link
      to={routePaths.home}
      className={`flex items-center gap-2.5 font-bold tracking-tight text-gray-900 hover:opacity-90 transition-opacity shrink-0 ${className}`}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-black text-white shadow-sm shadow-primary-600/25"
        aria-hidden
      >
        M
      </span>
      {showName !== false ? (
        <span className="hidden text-lg font-extrabold sm:inline">MarketFlow</span>
      ) : (
        <span className="sr-only">MarketFlow</span>
      )}
    </Link>
  );
}

export default BrandMark;
