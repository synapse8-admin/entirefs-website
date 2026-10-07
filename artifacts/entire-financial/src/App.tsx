import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const Complaints = lazy(() => import("@/pages/complaints"));
const FinancialServicesGuide = lazy(() => import("@/pages/financial-services-guide"));
const Superannuation = lazy(() => import("@/pages/superannuation"));
const RetirementPlanning = lazy(() => import("@/pages/retirement-planning"));
const TransitionToRetirement = lazy(() => import("@/pages/transition-to-retirement"));
const AgedCare = lazy(() => import("@/pages/aged-care"));

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageMetadata } from "@/components/PageMetadata";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/** Scrolls to the hash anchor after each route change, with a short delay to let the page render. */
function ScrollToHash() {
  const [location] = useLocation();
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tryScroll = (attempts = 0) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      } else if (attempts < 10) {
        timer = setTimeout(() => tryScroll(attempts + 1), 80);
      }
    };
    tryScroll();
    return () => clearTimeout(timer);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/complaints" component={Complaints} />
      <Route path="/financial-services-guide" component={FinancialServicesGuide} />
      <Route path="/services/superannuation" component={Superannuation} />
      <Route path="/retirement-planning" component={RetirementPlanning} />
      <Route path="/transition-to-retirement" component={TransitionToRetirement} />
      <Route path="/aged-care" component={AgedCare} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App({ ssrPath }: { ssrPath?: string } = {}) {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} ssrPath={ssrPath}>
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <PageMetadata />
            <ScrollToHash />
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-1">
              <Suspense fallback={<div className="min-h-[60vh] pt-36 text-center" role="status">Loading page…</div>}>
                <Router />
              </Suspense>
            </main>
            <Footer />
          </div>
        </WouterRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
