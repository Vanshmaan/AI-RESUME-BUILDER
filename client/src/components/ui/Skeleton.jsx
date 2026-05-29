export const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

export const ResumeCardSkeleton = () => (
  <div className="glass-card p-4 space-y-3">
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <ResumeCardSkeleton key={i} />
    ))}
  </div>
);
