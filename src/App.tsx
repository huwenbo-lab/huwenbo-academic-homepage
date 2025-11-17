import React from 'react'
import Navigation from './components/Navigation'
import LanguageToggle from './components/LanguageToggle'
import Hero from './components/Hero'
import Research from './components/Research'
import Publications from './components/Publications'
import Conference from './components/Conference'
import Education from './components/Education'
import Contact from './components/Contact'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <LanguageToggle />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="research">
          <Research />
        </section>
        <section id="publications">
          <Publications />
        </section>
        <section id="conference">
          <Conference />
        </section>
        <section id="education">
          <Education />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
    </div>
  )
}

export default App
