import { useState, useEffect } from "react"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { LogOut, Edit2, Star, Clock, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { userAPI } from "../lib/api"

export default function Profile({ isAuthenticated, currentUser, onLogout }) {
  const navigate = useNavigate()
  const [watchHistory, setWatchHistory] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    bio: "",
    phone: "",
    profileImage: "",
  })

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate("/")
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const [history, profile] = await Promise.all([
          userAPI.getWatchHistory(),
          userAPI.getProfile(),
        ])
        setWatchHistory(history || [])
        if (profile) {
          setProfileData({
            name: profile.name || currentUser.name,
            email: profile.email || currentUser.email,
            bio: profile.bio || "",
            phone: profile.phone || "",
            profileImage: profile.profileImage || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, currentUser, navigate])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navigation isAuthenticated={isAuthenticated} onLogout={onLogout} />

  <div className="flex-1 pt-8 px-4 max-w-6xl mx-auto pb-16">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground">My Profile</h1>
            <p className="text-foreground/60 mt-2">Manage your account, view watch history and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-secondary rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-pink-500 to-yellow-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {profileData?.name ? profileData.name.split(" ").map(n => n[0]).slice(0,2).join("") : (profileData?.email || "U").slice(0,2).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">{profileData?.name || "User"}</h3>
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded">Premium</span>
                  </div>
                  <p className="text-foreground/60 text-sm">{profileData?.email}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-foreground font-bold">{watchHistory.length}</div>
                  <div className="text-foreground/60 text-xs">Watched</div>
                </div>
                <div>
                  <div className="text-foreground font-bold">{Math.max(0, Math.round((watchHistory.reduce((s, i) => s + (i.progress || 0), 0) / 60)))}</div>
                  <div className="text-foreground/60 text-xs">Minutes</div>
                </div>
                <div>
                  <div className="text-foreground font-bold">{profileData.favoriteGenres?.length || 0}</div>
                  <div className="text-foreground/60 text-xs">Favorites</div>
                </div>
              </div>

              <div className="mt-6">
                {!editMode ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 py-2 px-3 rounded-lg bg-background/60 hover:bg-background/75 border border-border text-foreground font-medium flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} /> Edit Profile
                    </button>
                    <button className="py-2 px-3 rounded-lg bg-primary text-white font-medium" onClick={() => navigate('/settings')}>
                      Settings
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground"
                        placeholder="Full name"
                      />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground"
                        placeholder="Location"
                      />
                      <input
                        type="text"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground"
                        placeholder="Website (optional)"
                      />
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 bg-background/5 rounded border border-border text-foreground"
                        placeholder="Short bio"
                      />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {['Action','Drama','Sci-Fi','Thriller','Adventure','Mystery'].map(g => (
                        <button
                          key={g}
                          onClick={() => {
                            const exists = profileData.favoriteGenres?.includes(g)
                            setProfileData({ ...profileData, favoriteGenres: exists ? profileData.favoriteGenres.filter(x => x !== g) : [...(profileData.favoriteGenres||[]), g] })
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${profileData.favoriteGenres?.includes(g) ? 'bg-primary text-white' : 'bg-background/30 text-foreground/80'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          try {
                            await userAPI.updateProfile(profileData)
                            setEditMode(false)
                          } catch (error) {
                            console.error("Failed to save profile:", error)
                          }
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-primary text-white font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setProfileData({
                            name: currentUser.name,
                            email: currentUser.email,
                            bio: "",
                            phone: "",
                            profileImage: "",
                          })
                          setEditMode(false)
                        }}
                        className="py-2 px-3 rounded-lg bg-background/60 hover:bg-background/75 border border-border text-foreground font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-secondary rounded-2xl p-6 shadow border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
              <div className="text-foreground/70">
                <p className="mb-2">{profileData.bio || "No bio yet. Click Edit Profile to add one."}</p>
                <p className="text-sm text-foreground/60">{profileData.location ? `Location: ${profileData.location}` : ''} {profileData.website ? <span>• <a className="text-primary" href={profileData.website} target="_blank" rel="noreferrer">{profileData.website}</a></span> : ''}</p>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-6 shadow border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
              {watchHistory.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchHistory.slice(0,9).map((item, idx) => (
                    <div key={idx} className="bg-background/40 rounded-lg overflow-hidden">
                      <div className="h-40 bg-gradient-to-br from-black/30 to-black/10 flex items-end p-3">
                        <div>
                          <div className="text-sm text-foreground/60">{new Date(item.watchedAt).toLocaleDateString()}</div>
                          <div className="text-lg font-semibold text-foreground">{item.title}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-foreground/60">No recent activity — start watching something!</div>
              )}
            </div>

            <div className="bg-secondary rounded-2xl p-6 shadow border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-background/30 text-foreground/80 rounded-full text-sm flex items-center gap-2"><Star size={14} /> Action</span>
                <span className="px-3 py-1 bg-background/30 text-foreground/80 rounded-full text-sm flex items-center gap-2"><Star size={14} /> Drama</span>
                <span className="px-3 py-1 bg-background/30 text-foreground/80 rounded-full text-sm flex items-center gap-2"><Star size={14} /> Sci-Fi</span>
                <span className="px-3 py-1 bg-background/30 text-foreground/80 rounded-full text-sm flex items-center gap-2"><Heart size={14} /> My List</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
