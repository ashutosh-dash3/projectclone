import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Users, Zap, MessageCircle, Star, BedDouble, Bath, Ruler, Heart } from 'lucide-react'
import { useListings } from '../context/ListingsContext'
import apiService from '../services/api'

const features = [
  {
    id: 'f1',
    title: 'Modern Family Home',
    price: '$750,000',
    beds: 4,
    baths: 3,
    size: '2800 sqft',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'f2',
    title: 'Charming Forest Cabin',
    price: '$420,000',
    beds: 2,
    baths: 2,
    size: '1500 sqft',
    image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'f3',
    title: 'Downtown Loft Apartment',
    price: '$580,000',
    beds: 1,
    baths: 1,
    size: '950 sqft',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'f4',
    title: 'Luxury Penthouse',
    price: '$1,200,000',
    beds: 3,
    baths: 2,
    size: '2200 sqft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'f5',
    title: 'Cozy Studio Apartment',
    price: '$320,000',
    beds: 1,
    baths: 1,
    size: '600 sqft',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'f6',
    title: 'Suburban Villa',
    price: '$850,000',
    beds: 5,
    baths: 4,
    size: '3200 sqft',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop',
  },
]

const Home = () => {
  const navigate = useNavigate()
  const { wishlist, toggleWishlist, listings, loading } = useListings()
  const [feedbacks, setFeedbacks] = useState([])
  
  // Use API listings if available, otherwise fallback to hardcoded features
  const displayListings = listings.length > 0 ? listings.slice(0, 6) : features

  // Load feedbacks from API
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const response = await apiService.getPublicFeedbacks(3)
        setFeedbacks(response.feedbacks || [])
      } catch (error) {
        console.log('Using default feedbacks')
      }
    }
    loadFeedbacks()
  }, [])

  // Default feedbacks if API is not available
  const defaultFeedbacks = [
    { name: 'Sarah J.', message: 'FlatBuddy made finding our dream home incredibly easy and stress‑free.', rating: 5 },
    { name: 'David L.', message: 'The platform is user‑friendly and the selection is vast.', rating: 5 },
    { name: 'Maria P.', message: 'Exceptional service and outstanding support—FlatBuddy truly understands the market.', rating: 5 }
  ]

  const displayFeedbacks = feedbacks.length > 0 ? feedbacks : defaultFeedbacks
  
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              No <span className="text-teal-400">Broker,</span> Perfect <span className="text-teal-400">Corner!</span>
            </h1>
            <p className="mt-4 max-w-prose text-neutral-300">
              Discover the perfect place to live, invest, or settle down with FlatBuddy, your trusted partner in student accommodation.
            </p>
            <div className="mt-6 flex w-full max-w-xl gap-3">
              <input className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm placeholder-neutral-500 outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-800" placeholder="Search by location, property type, or keywords..." />
              <button onClick={()=>navigate('/listings')} className="rounded-md bg-teal-500 px-4 py-3 text-sm font-medium text-neutral-900 transition hover:-translate-y-0.5 hover:bg-teal-400 focus:ring-2 focus:ring-teal-400">Find Your Home</button>
            </div>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-800/50">
              <img src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs=srgb&dl=pexels-binyamin-mellish-106399.jpg&fm=jpg" alt="Hero" className="h-full w-full object-cover object-center aspect-[4/3]" />
            </div>
          </div>
        </div>
      </section>

      <section id="listings" className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Featured Listings</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayListings.map((card) => (
            <div key={card.id} className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
              <div className="relative">
                <img src={card.image} alt={card.title} className="h-48 w-full object-cover object-center" />
                <button
                  onClick={() => toggleWishlist(card.id)}
                  className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                  aria-label={wishlist.includes(card.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart 
                    size={18} 
                    className={wishlist.includes(card.id) ? "fill-red-500 text-red-500" : ""} 
                  />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 transition-colors group-hover:text-teal-600 dark:text-neutral-100 dark:group-hover:text-teal-400">{card.title}</h3>
                <p className="mt-1 font-semibold text-teal-400">
                  {card.price ? `$${card.price.toLocaleString()}` : card.rent ? `₹${card.rent.toLocaleString()}` : 'Price on request'}
                </p>
                <p className="mt-1 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="inline-flex items-center gap-1"><BedDouble size={14}/> {card.beds || card.bedrooms} Beds</span>
                  <span className="inline-flex items-center gap-1"><Bath size={14}/> {card.baths || card.bathrooms} Baths</span>
                  <span className="inline-flex items-center gap-1"><Ruler size={14}/> {card.size}</span>
                </p>
                <div className="mt-4 flex gap-2">
                  <button onClick={()=>navigate('/listings')} className="inline-flex items-center rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">Details</button>
                  <button onClick={()=>navigate('/listings')} className="inline-flex items-center rounded-md bg-teal-500 px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-teal-400">Explore Listings</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-neutral-50 py-16 dark:bg-neutral-950/40">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-extrabold tracking-tight">How It Works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Explore Listings', desc: 'Browse thousands of verified properties worldwide.' },
              { title: 'Connect & View', desc: 'Schedule visits and talk to trusted agents easily.' },
              { title: 'Secure Your Home', desc: 'Navigate the buying process with expert guidance.' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-teal-500 dark:text-teal-400">●</div>
                <h3 className="mt-2 font-semibold text-neutral-900 dark:text-neutral-100">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-extrabold tracking-tight">What Our Clients Say</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayFeedbacks.map((feedback, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="text-sm">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{feedback.name}</div>
                    <div className="flex gap-0.5 text-teal-500 dark:text-teal-400">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star 
                          key={starIndex} 
                          size={14} 
                          className={starIndex < feedback.rating ? 'fill-current' : ''} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">"{feedback.message}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 dark:bg-neutral-950/40">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-extrabold tracking-tight">Why Choose FlatBuddy?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[{icon:ShieldCheck,title:'Trusted Agents',desc:'Certified professionals who prioritize your needs.'},
              {icon:Users,title:'Wide Selection',desc:'Extensive database from cozy apartments to family homes.'},
              {icon:Zap,title:'Seamless Process',desc:'Streamlined buying and selling with our intuitive platform.'},
              {icon:MessageCircle,title:'24/7 Support',desc:'We are here day or night for any questions.'}].map((f) => (
              <div key={f.title} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-teal-500 dark:text-teal-400">{React.createElement(f.icon, {size:22})}</div>
                <h3 className="mt-3 font-semibold text-neutral-900 dark:text-neutral-100">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[{label:'Happy Clients',value:'250K+'},{label:'Properties Sold',value:'15K+'},{label:'In Business',value:'10 Years'}].map((s)=> (
              <div key={s.label} className="rounded-xl border border-teal-200 bg-teal-50 p-6 text-center dark:border-teal-900 dark:bg-teal-700/10">
                <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">{s.value}</div>
                <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
