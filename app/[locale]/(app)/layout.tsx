'use client';

import { LayoutDashboard, PlusCircle, Settings, LogOut, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../../src/navigation';
import React, { useState } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations('App');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'New Analysis', icon: PlusCircle, href: '/analyze' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F5EDD9]">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#2C1503] text-white">
        <div className="flex items-center gap-2">
          <span className="font-serif text-[#F5EDD9]">Athar</span>
          <span className="text-[#C84B31] font-arabic">أثر</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-[#2C1503] min-h-screen flex flex-col p-6 text-[#E8A87C] pt-12 fixed md:sticky top-0 z-[100]`}
      >
        <div className="flex items-center gap-3 mb-12">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#C84B31"/>
            <path d="M12 6L6 18H18L12 6Z" fill="#F5EDD9"/>
            <circle cx="12" cy="14" r="2" fill="#C84B31"/>
          </svg>
          <span className="font-serif text-2xl text-[#F5EDD9]">Athar</span>
          <span className="text-xl text-[#C84B31] font-arabic">أثر</span>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-sans text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Footer */}
        <div className="pt-6 border-t border-[#E8A87C]/20 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C84B31] flex items-center justify-center font-bold text-white text-xs">
              ME
            </div>
            <div>
              <div className="text-xs font-bold text-[#F5EDD9]">MEAL Pro</div>
              <div className="text-[10px] opacity-70">Institutional User</div>
            </div>
          </div>
          <button 
            className="flex items-center gap-2 hover:text-white transition-colors text-xs font-medium"
            onClick={() => {/* logout logic */}}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-[#F5EDD9] p-4 md:p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
