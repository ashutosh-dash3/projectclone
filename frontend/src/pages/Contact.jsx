import React, { useState } from 'react'
import apiService from '../services/api'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', rating: 5 })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await apiService.submitFeedback(form)
      setMessage('Thank you for your feedback! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '', rating: 5 })
    } catch (error) {
      setMessage('Failed to submit feedback. Please try again.')
      console.error('Feedback submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Contact Us</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Send us your feedback, questions, or suggestions.</p>
      
      {message && (
        <div className={`mt-4 rounded-md px-3 py-2 text-sm ${
          message.includes('Thank you') 
            ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
            : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Name *</label>
          <input 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-900" 
          />
        </div>
        <div>
          <label className="text-sm">Email *</label>
          <input 
            type="email" 
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" 
          />
        </div>
        <div>
          <label className="text-sm">Subject *</label>
          <input 
            value={form.subject}
            onChange={e => setForm({...form, subject: e.target.value})}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900" 
          />
        </div>
        <div>
          <label className="text-sm">Rating</label>
          <select 
            value={form.rating}
            onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
            <option value={4}>⭐⭐⭐⭐ Good</option>
            <option value={3}>⭐⭐⭐ Average</option>
            <option value={2}>⭐⭐ Poor</option>
            <option value={1}>⭐ Very Poor</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Message *</label>
          <textarea 
            rows="5" 
            value={form.message}
            onChange={e => setForm({...form, message: e.target.value})}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900"
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Feedback'}
        </button>
      </form>
    </section>
  )
}

export default Contact
