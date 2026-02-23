import Navbar from './Navbar';
import Footer from './Footer';
import './PublicLayout.css';

// fullWidthHero=true → page manages its own navbar offset (e.g. HomePage with banner)
// fullWidthHero=false (default) → layout adds 68px top padding automatically
export default function PublicLayout({ children, fullWidthHero = false }) {
  return (
    <div className="public-layout">
      <Navbar />
      <main className={`public-main${fullWidthHero ? '' : ' public-main-offset'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
