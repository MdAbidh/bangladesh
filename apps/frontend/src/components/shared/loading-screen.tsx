'use client';

import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
  lottieAnimation?: object;
}

export function LoadingScreen({
  text = 'Loading...',
  fullScreen = true,
  className,
  lottieAnimation,
}: LoadingScreenProps) {
  const defaultAnimation = {
    v: '5.5.2',
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: 'Loading',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Circle',
        sr: 1,
        ks: {
          o: { a: 1, k: [{ t: 0, s: [100] }, { t: 30, s: [30] }, { t: 60, s: [100] }] },
          r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [
          {
            ty: 'el',
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [40, 40] },
            r: { a: 0, k: 0 },
            ls: { a: 0, k: 0 },
            lc: 1,
            lj: 1,
            ml: 4,
            bm: 0,
            fill: { a: 0, k: [0.231, 0.498, 0.965, 1] },
          },
        ],
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: 'Circle 2',
        sr: 1,
        ks: {
          o: { a: 1, k: [{ t: 0, s: [30] }, { t: 30, s: [100] }, { t: 60, s: [30] }] },
          r: { a: 1, k: [{ t: 0, s: [360] }, { t: 60, s: [0] }] },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [
          {
            ty: 'el',
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [20, 20] },
            r: { a: 0, k: 0 },
            ls: { a: 0, k: 0 },
            lc: 1,
            lj: 1,
            ml: 4,
            bm: 0,
            fill: { a: 0, k: [0.545, 0.365, 0.965, 1] },
          },
        ],
      },
    ],
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen && 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm dark:bg-gray-950/80',
        className,
      )}
    >
      <div className="h-32 w-32">
        <Lottie
          animationData={lottieAnimation || defaultAnimation}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
        {text}
      </p>
    </div>
  );
}
