import React from 'react'

const About = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About FlatBuddy</h1>
          <p className="mt-4 text-neutral-600 dark:text-neutral-300 max-w-prose">
            FlatBuddy is an innovative web platform designed to simplify the process of finding rental accommodations such as flats, PGs, rooms, and hostels. The platform primarily focuses on assisting students and young professionals who often face difficulties in securing safe, affordable, and convenient housing after leaving hostels or moving to new cities. FlatBuddy connects seekers directly with verified property owners, reducing the dependency on brokers and minimizing the chances of misinformation or fraud. With its clean interface, advanced search filters, and location-based recommendations, it ensures a seamless and trustworthy experience for users. By combining modern technology with a user-centric approach, FlatBuddy strives to make home-finding effortless and transparent while promoting a sense of comfort, community, and trust among its users.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#mission" className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 transition">Our Mission</a>
            <a href="#how-it-works" className="inline-flex items-center rounded-md bg-teal-100 text-teal-800 px-4 py-2 hover:bg-teal-200 transition dark:bg-white dark:text-teal-800 dark:hover:bg-neutral-100">How it works</a>
          </div>
        </div>
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 dark:border-white/10 dark:bg-white/5">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop"
            alt="About FlatBuddy"
            className="aspect-[4/3] w-full rounded-xl object-cover object-center"
          />
        </div>
      </section>

      {/* Pillars */}
      <section id="mission" className="mt-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[{ title: 'Mission', desc: 'At FlatBuddy, our mission is to make the process of finding rental accommodations simple, transparent, and stress-free. We aim to help students and working individuals discover affordable and reliable flats, PGs, rooms, and hostels near their preferred locations. Recognizing the challenges people face while relocating — from budget constraints to safety concerns — we strive to build a platform that acts as a trustworthy companion throughout their housing journey. By combining technology with empathy, FlatBuddy connects seekers directly with verified property owners and provides a smooth, user-friendly experience that ensures comfort, security, and peace of mind.' }, { title: 'Vision', desc: 'Our vision is to become the most trusted and student-friendly rental platform in India, revolutionizing the way people search for their next home. We aspire to create a nationwide network that promotes transparency, community trust, and convenience. Through innovation and continuous improvement, FlatBuddy envisions a future where no one struggles to find a place they can proudly call “home away from home.”' }, { title: 'Values', desc: 'Trust, transparency, empathy, innovation, and community form the foundation of FlatBuddy. We aim to build genuine connections, ensure clarity in every listing, support users through their housing journey, innovate for better experiences, and foster a safe, reliable rental ecosystem.' }].map((c) => (
            <div key={c.title} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">{c.title}</div>
              <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mt-14 rounded-2xl border border-teal-200 bg-teal-50 p-6 dark:border-white/10 dark:bg-white/5">
        <dl className="grid gap-6 sm:grid-cols-3">
          {[{ k: 'Verified listings', v: '2,500+' }, { k: 'Active users', v: '18,000+' }, { k: 'Cities covered', v: '25' }].map(s => (
            <div key={s.k} className="rounded-lg bg-white/60 p-4 text-center dark:bg-white/10">
              <dt className="text-sm text-teal-700 dark:text-teal-200">{s.k}</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: 'Browse', d: 'Explore curated listings with rich details and neighborhood insights.' },
            { t: 'Shortlist', d: 'Save favorites, compare options, and get real-time availability.' },
            { t: 'Connect', d: 'Chat with verified owners or agents right inside the app.' },
            { t: 'Move-in', d: 'Seal the deal with confidence and start your next chapter.' },
          ].map((step, i) => (
            <li key={step.t} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">Step {i + 1}</div>
              <div className="mt-1 font-medium">{step.t}</div>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Team */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">The team</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { n: 'Ashutosh', r: 'Founder & Engineer' },
            { n: 'Ananya', r: 'Product & Research' },
            { n: 'Anshika', r: 'Design & Brand' },
            // { n: 'Sunil', r: 'Finance & Strategy' },
          ].map((m) => (
            <div key={m.n} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-white/10" />
              <div className="mt-3 font-semibold">{m.n}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">{m.r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">FAQs</h2>
        <div className="mt-6 space-y-4">
          {[
            { q: 'Is FlatBuddy free to use?', a: 'Yes. Basic browsing and saving listings is free.' },
            { q: 'Are listings verified?', a: 'We prioritize verified listings and highlight trust signals.' },
            { q: 'Do you support dark mode?', a: 'Absolutely — FlatBuddy has a first-class dark theme.' },
          ].map((f) => (
            <div key={f.q} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="font-medium">{f.q}</div>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center dark:border-white/10 dark:bg-white/5">
        <h2 className="text-2xl font-bold tracking-tight">Ready to find your next place?</h2>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300">Browse listings, build your wishlist, and connect with verified owners.</p>
        <a href="/listings" className="mt-5 inline-flex items-center rounded-md bg-teal-600 px-5 py-2.5 text-white hover:bg-teal-700 transition">Explore listings</a>
      </section>
    </main>
  )
}

export default About
