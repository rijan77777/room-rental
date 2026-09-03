import Hero from "../components/Hero";
import Features from "../components/Features";
import DonationQR from "../components/DonationQR";

function Home() {
  return (
    <>
      <Hero />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <DonationQR />
      </div>
      
      <Features />
    </>
  );
}

export default Home;