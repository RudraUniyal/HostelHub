import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = "", width = "100%", height = "1rem" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{
        width,
        height,
        background: 'var(--color-bg-tertiary)',
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="dark-card p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton width="3rem" height="3rem" className="rounded-full" />
        <div className="flex-1">
          <Skeleton height="1.5rem" className="mb-2" />
          <Skeleton height="1rem" width="60%" />
        </div>
      </div>
      <Skeleton height="1rem" className="mb-2" />
      <Skeleton height="1rem" width="80%" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Skeleton */}
      <div className="dark-card p-8 text-center">
        <Skeleton width="6rem" height="6rem" className="rounded-full mx-auto mb-6" />
        <Skeleton height="2rem" width="200px" className="mx-auto mb-2" />
        <Skeleton height="1.5rem" width="150px" className="mx-auto" />
      </div>

      {/* Profile Information Skeleton */}
      <div className="dark-card p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton height="2rem" width="200px" />
          <Skeleton height="2.5rem" width="120px" className="rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton height="1rem" width="100px" className="mb-2" />
              <Skeleton height="1.5rem" />
            </div>
          ))}
        </div>
      </div>

      {/* Account Statistics Skeleton */}
      <div className="dark-card p-8">
        <Skeleton height="2rem" width="200px" className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton width="4rem" height="4rem" className="rounded-full mx-auto mb-4" />
              <Skeleton height="1.5rem" width="50px" className="mx-auto mb-2" />
              <Skeleton height="1rem" width="100px" className="mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="text-center">
        <Skeleton height="3rem" width="400px" className="mx-auto mb-2" />
        <Skeleton height="1.5rem" width="300px" className="mx-auto" />
      </div>

      {/* Analytics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Issues List Skeleton */}
      <div className="dark-card p-6">
        <Skeleton height="2rem" width="150px" className="mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen p-6">
      {/* Hero Section Skeleton */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Skeleton height="3rem" width="300px" className="mx-auto mb-4" />
            <Skeleton height="1.5rem" width="250px" className="mx-auto" />
          </div>
          <div className="glass rounded-2xl p-8">
            <Skeleton height="3rem" className="mb-4" />
            <Skeleton height="3rem" className="mb-4" />
            <Skeleton height="3rem" className="mb-4" />
            <Skeleton height="2rem" width="100px" className="mx-auto" />
          </div>
        </div>
      </div>

      {/* How it Works Section Skeleton */}
      <div className="max-w-6xl mx-auto py-16">
        <div className="text-center mb-16">
          <Skeleton height="2.5rem" width="200px" className="mx-auto mb-4" />
          <Skeleton height="1.5rem" width="300px" className="mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        {/* Features Section Skeleton */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <Skeleton height="2.5rem" width="150px" className="mx-auto mb-4" />
            <Skeleton height="1.5rem" width="250px" className="mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="dark-card p-6 text-center">
                <Skeleton width="4rem" height="4rem" className="rounded-full mx-auto mb-4" />
                <Skeleton height="1.5rem" width="100px" className="mx-auto mb-2" />
                <Skeleton height="1rem" width="120px" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
