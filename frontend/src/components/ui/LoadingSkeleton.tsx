interface LoadingSkeletonProps {
  count?: number;
  height?: string;
}

export const LoadingSkeleton = ({ count = 3, height = 'h-20' }: LoadingSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-dark-skeleton rounded-xl animate-pulse border border-dark-border`}
        />
      ))}
    </div>
  );
};
