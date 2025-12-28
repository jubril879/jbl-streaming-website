import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { Lock, Save, ArrowLeft, Trash2 } from "lucide-react"

export default function Settings({ isAuthenticated, currentUser, onUpdateUser, onLogout, onDeleteAccount }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    autoplay: false,
    privateProfile: false,
    theme: "system",
  })
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/")
      return
    }
    if (currentUser) {
      const prefs = currentUser.preferences || {}
      setForm((f) => ({
        ...f,
        name: currentUser.name || "",
        email: currentUser.email || "",
        emailNotifications: prefs.emailNotifications ?? true,
        autoplay: prefs.autoplay ?? false,
        privateProfile: prefs.privateProfile ?? false,
        theme: prefs.theme || "system",
      }))
    }
  }, [isAuthenticated, currentUser, navigate])

  const handleSave = () => {
    // basic validation
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setSaving(true)
    const updates = {
      name: form.name,
      preferences: {
        emailNotifications: form.emailNotifications,
        autoplay: form.autoplay,
        privateProfile: form.privateProfile,
        theme: form.theme,
      },
    }
    if (form.newPassword) updates.password = form.newPassword

    try {
      if (onUpdateUser) onUpdateUser(updates)
      setSaving(false)
      navigate("/profile")
    } catch (err) {
      setSaving(false)
      console.error(err)
      alert("Failed to save settings")
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation isAuthenticated={isAuthenticated} />

      <div className="flex-1 pt-8 px-4 max-w-5xl mx-auto pb-16">
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-md bg-background/20">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-secondary rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Account</h3>
            <p className="text-sm text-foreground/60">Update your account details and preferences.</p>
            <div className="mt-6 space-y-4">
              <div>
                <div className="text-xs text-foreground/60">Signed in as</div>
                <div className="text-foreground font-medium">{form.email}</div>
              </div>
              <button onClick={() => { onLogout && onLogout(); navigate('/') }} className="w-full mt-2 py-2 rounded bg-primary text-white">Sign out</button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-secondary rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground" placeholder="Full name" />
                <input value={form.email} disabled className="w-full px-3 py-2 bg-background/10 rounded border border-border text-foreground/60" />
                <input type="text" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground" placeholder="Theme (light/dark/system)" />
                <div className="col-span-1 md:col-span-2">
                  <label className="text-sm text-foreground/60">New password</label>
                  <div className="mt-2 flex gap-2">
                    <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground" placeholder="New password" />
                    <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground" placeholder="Confirm password" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between gap-3">
                  <span className="text-foreground">Email notifications</span>
                  <input type="checkbox" checked={form.emailNotifications} onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between gap-3">
                  <span className="text-foreground">Autoplay trailers</span>
                  <input type="checkbox" checked={form.autoplay} onChange={(e) => setForm({ ...form, autoplay: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between gap-3">
                  <span className="text-foreground">Private profile</span>
                  <input type="checkbox" checked={form.privateProfile} onChange={(e) => setForm({ ...form, privateProfile: e.target.checked })} />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded">
                <Save size={16} /> {saving ? 'Saving...' : 'Save settings'}
              </button>
              <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded bg-background/60 border border-border">Cancel</button>
            </div>

            <div className="bg-secondary rounded-2xl p-6 border border-red-500/30">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
              <p className="text-foreground/70 text-sm mb-4">Delete your account permanently. This action cannot be undone.</p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-secondary rounded-2xl p-8 border border-red-500/50 max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Delete Account?</h2>
            <p className="text-foreground/70 mb-6">This will permanently delete your account and all associated data including your profile and watch history. This action cannot be undone.</p>
            
            <div className="mb-6">
              <label className="block text-sm text-foreground/60 mb-2">Type your email to confirm:</label>
              <input
                type="email"
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                placeholder={currentUser?.email}
                className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (deleteConfirmEmail === currentUser?.email) {
                    onDeleteAccount()
                    navigate('/')
                  } else {
                    alert('Email does not match. Account deletion cancelled.')
                    setShowDeleteModal(false)
                    setDeleteConfirmEmail('')
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
              >
                Delete Account
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmEmail('')
                }}
                className="flex-1 px-4 py-2 bg-background/60 border border-border rounded font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
