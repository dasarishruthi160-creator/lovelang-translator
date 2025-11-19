import { ChatInterface } from "@/components/ChatInterface";
import { Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-2 rounded-xl backdrop-blur-sm">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">LoveLang</h1>
              <p className="text-sm text-primary-foreground/80">Your AI Translation Companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 container mx-auto p-4 max-w-4xl">
        <div className="h-[calc(100vh-200px)] bg-card/50 backdrop-blur-sm rounded-3xl shadow-lg border border-border/50 overflow-hidden">
          <ChatInterface />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>Powered by Lovable AI • Breaking language barriers with AI 🌐💬</p>
      </footer>
    </div>
  );
};

export default Index;