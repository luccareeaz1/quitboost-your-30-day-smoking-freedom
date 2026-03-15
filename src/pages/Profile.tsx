import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";

export default function Profile() {
  return (
    <div className="min-h-screen pt-28 pb-32 px-4 max-w-3xl mx-auto space-y-12 animate-fade-in">
      <header className="mb-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter">Profile</h1>
        <p className="text-muted-foreground mt-4 text-lg">Manage your quitting journey data.</p>
      </header>

      <AppleCard className="p-8 sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-8">Personal Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Display Name</label>
            <input 
              type="text" 
              defaultValue="John Doe" 
              className="w-full text-lg p-4 rounded-2xl bg-secondary border-none outline-none focus:ring-2 focus:ring-foreground transition-all"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Cigarettes per Day Before</label>
              <input 
                type="number" 
                defaultValue={20} 
                className="w-full text-lg p-4 rounded-2xl bg-secondary border-none outline-none focus:ring-2 focus:ring-foreground transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Price per Cigarette ($)</label>
              <input 
                type="number" 
                step="0.10"
                defaultValue={0.5} 
                className="w-full text-lg p-4 rounded-2xl bg-secondary border-none outline-none focus:ring-2 focus:ring-foreground transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Quit Date</label>
            <input 
              type="date" 
              defaultValue="2024-05-01" 
              className="w-full text-lg p-4 rounded-2xl bg-secondary border-none outline-none focus:ring-2 focus:ring-foreground transition-all"
            />
          </div>

          <Button className="w-full h-14 text-lg rounded-2xl bg-foreground text-background mt-6">
            Save Changes
          </Button>
        </div>
      </AppleCard>

      <div className="text-center">
        <Button variant="outline" className="text-destructive border-none hover:bg-destructive/10 rounded-full">
          Reset All Progress
        </Button>
      </div>
    </div>
  );
}
