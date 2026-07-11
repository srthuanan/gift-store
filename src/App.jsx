import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import DemoShowcase from './components/DemoShowcase'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <DemoShowcase />
      <HowItWorks />
      <Pricing />
      <Footer />
    </>
  )
}

export default App
