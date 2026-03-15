import AppToolbar from "@/components/app/AppToolbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppToolbar />
      <div className="pt-20 pb-12">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
