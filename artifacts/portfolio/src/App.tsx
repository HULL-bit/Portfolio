import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CVPage from "@/pages/cv";

import { Loader } from "./components/Loader";
import { Cursor } from "./components/Cursor";
import { ProgressBar } from "./components/ProgressBar";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Education } from "./components/Education";
import { Certifications } from "./components/Certifications";
import { Memoir } from "./components/Memoir";
import { Contact } from "./components/Contact";
import { BackToTop } from "./components/BackToTop";

const queryClient = new QueryClient();

function Portfolio() {
  return (
    <div className="bg-[#050B1F] min-h-screen text-white selection:bg-[#00D4FF] selection:text-[#050B1F]">
      <Loader />
      <Cursor />
      <ProgressBar />
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <Memoir />
        <Contact />
      </main>

      <footer className="py-8 bg-[#030614] border-t border-white/5 text-center">
        <p className="font-mono text-sm text-gray-500">
          © {new Date().getFullYear()} Souleymane DIAW. Construit avec React & Framer Motion.
        </p>
      </footer>
      
      <BackToTop />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/cv" component={CVPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
