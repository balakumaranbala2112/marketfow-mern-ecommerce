import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

function SectionHeading({ title, subtitle, linkText, linkTo }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        ) : null}
      </div>
      {linkText && linkTo ? (
        <Link
          to={linkTo}
          className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          {linkText}
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  );
}

export default SectionHeading;
