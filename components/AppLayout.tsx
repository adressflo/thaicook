interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}