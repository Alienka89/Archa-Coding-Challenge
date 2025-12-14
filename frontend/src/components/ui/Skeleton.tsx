import type { HTMLAttributes } from 'react';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className = '', ...props }: SkeletonProps) => {
  return (
    <div className={`animate-pulse bg-dark-skeleton rounded ${className}`} {...props} />
  );
};
