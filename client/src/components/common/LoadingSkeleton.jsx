export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-6 w-16 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="skeleton h-4 w-24 rounded mb-3" />
            <div className="skeleton h-8 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-6">
        <div className="skeleton h-6 w-40 rounded mb-4" />
        <div className="skeleton h-64 w-full rounded" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
