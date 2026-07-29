import { Loader2 } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
        <span className="text-sm font-medium text-gray-500">Loading…</span>
      </div>
    </div>
  );
}

export default PageLoader;
