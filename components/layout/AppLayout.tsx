interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen w-full">
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </div>
  )
}
