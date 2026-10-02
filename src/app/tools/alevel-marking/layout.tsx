import type { Metadata } from 'next';
import RevisionNav from '@/components/RevisionNav';
import './globals.css';
export const metadata: Metadata = {title: 'Revision · A-level marking'};
export default function Layout({children}: {children: React.ReactNode}) {return <><RevisionNav active="alevel" />{children}</>;}
