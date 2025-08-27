export default function SkeletonCard() {
  return (
    <article className="w-full bg-white rounded-lg shadow p-4 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left block */}
        <div className="flex flex-col gap-3 min-w-0">
          {/* identity row */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm shimmer" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-40 rounded shimmer" />
              <div className="mt-1 h-3 w-24 rounded shimmer" />
            </div>
          </div>

          <div className="h-3 w-32 rounded shimmer" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="h-3 w-20 rounded shimmer" />
              <div className="h-4 w-24 rounded shimmer" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-24 rounded shimmer" />
              <div className="h-4 w-28 rounded shimmer" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-16 rounded shimmer" />
              <div className="h-4 w-36 rounded shimmer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div className="space-y-1">
              <div className="h-3 w-10 rounded shimmer" />
              <div className="h-4 w-20 rounded shimmer" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-10 rounded shimmer" />
              <div className="h-4 w-20 rounded shimmer" />
            </div>
          </div>
        </div>

        {/* Right block */}
        <div className="flex flex-col items-end gap-3 lg:w-64">
          <div className="w-full">
            <div className="h-6 w-36 rounded shimmer ml-auto" />
            <div className="mt-1 h-3 w-28 rounded shimmer ml-auto" />
            <div className="mt-1 h-3 w-24 rounded shimmer ml-auto" />
          </div>
          <div className="w-full">
            <div className="h-16 w-full rounded shimmer" />
          </div>
        </div>
      </div>
    </article>
  );
}
