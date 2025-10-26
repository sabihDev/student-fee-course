'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import existing App component (the main SPA) as a client component
const AppClient = dynamic(() => import('../src/App'), { ssr: false });

export default function Page() {
  return <AppClient />;
}
