import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Pricing from "../components/home/Pricing";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";

const Home = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    <Hero />
    <Features />
    <Pricing />
    <Testimonials />
    <CallToAction />
    <Footer />
  </div>
);

export default Home;
