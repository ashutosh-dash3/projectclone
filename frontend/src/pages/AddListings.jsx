import React from 'react'
import { useState } from 'react'
import { useListings } from '../context/ListingsContext'
import { useAuth } from '../context/AuthContext'

const AddListings = () => {
  const { currentUser } = useAuth()
  const { addListing } = useListings()
  const [form, setForm] = useState({ 
    title: '', city: '', rent: '', size: '',
    type: 'pg',
    // PG
    pgFood: 'no', pgWifi: 'no', pgCharges: '', pgDescription: '',
    // Bed
    bedPrice: '',
    // Room
    roomCount: 1, roomBeds: 1, roomBaths: 1, roomOwnBed: 'yes', roomDescription: '',
    // Flat
    flatBhk: 1, flatFacilities: '', flatRooms: 2, flatBaths: 1, flatDescription: '', flatPrice: '',
    // Media
    photos: [],
    preview: ''
  })

  const onSubmit = (e) => {
    e.preventDefault()
    if (!currentUser || currentUser.role !== 'owner') return alert('Login as Owner to add a listing')
    const payload = { ...form, rent: Number(form.rent), ownerId: currentUser.id }
    addListing(payload)
    setForm({ 
      title: '', city: '', rent: '', size: '', type: 'pg',
      pgFood: 'no', pgWifi: 'no', pgCharges: '', pgDescription: '',
      bedPrice: '', roomCount: 1, roomBeds: 1, roomBaths: 1, roomOwnBed: 'yes', roomDescription: '',
      flatBhk: 1, flatFacilities: '', flatRooms: 2, flatBaths: 1, flatDescription: '', flatPrice: '',
      photos: [], preview: ''
    })
    alert('Listing added (demo)')
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Add a Listing</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">This is a demo form for the minor project.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Type of shelter</label>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['pg','bed','room','flat'].map(t => (
              <label key={t} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm dark:bg-neutral-900 ${form.type===t?'border-teal-500':'border-neutral-300 dark:border-neutral-700'}`}>
                <input type="radio" name="type" value={t} checked={form.type===t} onChange={e=>setForm({...form,type:e.target.value})} />
                <span className="capitalize">{t}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm">Title</label>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm">Price</label>
            <input value={form.rent} onChange={e=>setForm({...form,rent:e.target.value})} type="number" className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm">City</label>
            <input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
        </div>
        <div>
          <label className="text-sm">Description</label>
          <textarea value={form.size} onChange={e=>setForm({...form,size:e.target.value})} rows="3" placeholder="Describe the property..." className="mt-1 w-full resize-none rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900"></textarea>
        </div>
        {/* Photo upload */}
        <div>
          <label className="text-sm">Photos</label>
          <input type="file" multiple accept="image/*" onChange={(e)=>{
            const files = Array.from(e.target.files || [])
            const previews = files.map(f => URL.createObjectURL(f))
            setForm(prev => ({ ...prev, photos: files, preview: previews[0] || '' }))
          }} className="mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-white hover:file:bg-teal-500" />
          {form.preview && <img src={form.preview} alt="Preview" className="mt-2 h-32 w-48 rounded-md object-cover" />}
        </div>

        {/* Conditional: PG */}
        {form.type === 'pg' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">Food Provided</label>
              <select value={form.pgFood} onChange={e=>setForm({...form,pgFood:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="text-sm">WiFi Available</label>
              <select value={form.pgWifi} onChange={e=>setForm({...form,pgWifi:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Charges per month</label>
              <input type="number" value={form.pgCharges} onChange={e=>setForm({...form,pgCharges:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
          </div>
        )}

        {/* Conditional: Bed */}
        {form.type === 'bed' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">Price per month</label>
              <input type="number" value={form.bedPrice} onChange={e=>setForm({...form,bedPrice:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
          </div>
        )}

        {/* Conditional: Room */}
        {form.type === 'room' && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm">Rooms</label>
              <input type="number" value={form.roomCount} onChange={e=>setForm({...form,roomCount:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
            <div>
              <label className="text-sm">Beds</label>
              <input type="number" value={form.roomBeds} onChange={e=>setForm({...form,roomBeds:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
            <div>
              <label className="text-sm">Bathrooms</label>
              <input type="number" value={form.roomBaths} onChange={e=>setForm({...form,roomBaths:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
            <div className="sm:col-span-3">
              <label className="text-sm">Own bed</label>
              <select value={form.roomOwnBed} onChange={e=>setForm({...form,roomOwnBed:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        )}

        {/* Conditional: Flat */}
        {form.type === 'flat' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">BHK</label>
              <input type="number" value={form.flatBhk} onChange={e=>setForm({...form,flatBhk:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
            <div>
              <label className="text-sm">Facilities</label>
              <input value={form.flatFacilities} onChange={e=>setForm({...form,flatFacilities:e.target.value})} placeholder="e.g., lift, parking, gym" className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
            <div>
              <label className="text-sm">Rooms</label>
              <input type="number" value={form.flatRooms} onChange={e=>setForm({...form,flatRooms:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
            <div>
              <label className="text-sm">Bathrooms</label>
              <input type="number" value={form.flatBaths} onChange={e=>setForm({...form,flatBaths:e.target.value})} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
          </div>
        )}

        <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500">Save</button>
      </form>
    </section>
  )
}

export default AddListings
