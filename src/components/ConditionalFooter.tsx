'use client';

import { useAuth } from '@/hooks/useAuth';
import Footer from './Footer';

export default function ConditionalFooter() {
  const { isAuthenticated, loading } = useAuth();

  // Don't show footer while loading or if user is authenticated
  if (loading || isAuthenticated) {
    return null;
  }

  return <Footer />;
}
