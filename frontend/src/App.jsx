import "./App.css"
import NewsletterSection from './componantes/NewsletterSection'
import About from './componantes/About'
import AboutSection from './componantes/AboutSection'
import Categories from './componantes/Categories'
import Hero from './componantes/Hero'
import Nav from './componantes/Nav'
import Footer from './componantes/Footer'


function App() {
 
  return (
    <>
      <Nav />
      <About />
      <Categories />
      <Hero />
      <AboutSection />
      <NewsletterSection />
      <Footer />
    </>
  )
}

export default App