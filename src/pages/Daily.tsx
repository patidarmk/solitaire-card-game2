import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { MadeWithApplaa } from '@/components/made-with-applaa';

const Daily: React.FC = () => {
  return (
    <>
      <Header />
      <Navigate to="/klondike/$" search={{ daily: true }} replace />
      <MadeWithApplaa />
    </>
  );
};

export default Daily;