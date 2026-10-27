import React, { useEffect, useState } from "react";
import { ManageWebinarsModal } from "./webinars/ManageWebinarsModal";
import { AdminWebinarRegistrations } from "./admin/AdminWebinarRegistrations";
import { Webinar, WebinarStatus, WebinarType } from "../types";
import {
  getWebinars,
  saveWebinar,
  deleteWebinar,
  toggleWebinarStatus,
  fetchWebinarsFromDb,
  WEBINAR_UPDATE_EVENT,
} from "../services/webinarStorage";
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const JOBS_API =
  "https://cbm-jobs-api.cbmacademydelhi.workers.dev";

const ADMIN_EMAIL =
  "office@cbmacademy.in";

interface Job {
  id: string;
  company_name: string;
  hr_name: string;
  hr_email: string;
  hr_phone: string;
  job_title: string;
  job_description: string;
  location: string;
  salary?: string | null;
  experience?: string | null;
  skills?: string[];
  work_type: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [email, setEmail] =
    useState(ADMIN_EMAIL);

  const [password, setPassword] =
    useState("");

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [webinars, setWebinars] =
    useState<Webinar[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [adminTab, setAdminTab] =
    useState<'registrations' | 'webinars' | 'jobs'>('registrations');

  const [webinarModalOpen, setWebinarModalOpen] =
    useState(false);

  // In-page Webinar Editor Form states
  const [showWebinarForm, setShowWebinarForm] = useState(false);
  const [editingWebinarId, setEditingWebinarId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPosterUrl, setFormPosterUrl] = useState("");
  const [formType, setFormType] = useState<WebinarType>("free");
  const [formPrice, setFormPrice] = useState<string>("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formDuration, setFormDuration] = useState("60 mins");
  const [formCapacity, setFormCapacity] = useState("100");
  const [formStatus, setFormStatus] = useState<WebinarStatus>("published");
  const [webinarSearch, setWebinarSearch] = useState("");

  const loadWebinarsData = () => {
    const list = getWebinars();
    setWebinars(list);
    fetchWebinarsFromDb().then((fresh) => {
      if (fresh && fresh.length > 0) {
        setWebinars(fresh);
      }
    });
  };

  useEffect(() => {
    const token =
      localStorage.getItem(
        "cbm_admin_access_token"
      );

    if (token) {
      setLoggedIn(true);
      loadJobs(token);
      loadWebinarsData();
    } else {
      setCheckingSession(false);
    }

    const onWebinarsUpdate = () => {
      loadWebinarsData();
    };
    window.addEventListener(WEBINAR_UPDATE_EVENT, onWebinarsUpdate);
    return () => {
      window.removeEventListener(WEBINAR_UPDATE_EVENT, onWebinarsUpdate);
    };
  }, []);

  const resetWebinarForm = () => {
    setEditingWebinarId(null);
    setFormTitle("");
    setFormDescription("");
    setFormPosterUrl("");
    setFormType("free");
    setFormPrice("");
    setFormDate("");
    setFormTime("");
    setFormDuration("60 mins");
    setFormCapacity("100");
    setFormStatus("published");
    setShowWebinarForm(false);
  };

  const handleEditWebinar = (w: Webinar) => {
    setEditingWebinarId(w.id);
    setFormTitle(w.title);
    setFormDescription(w.description || "");
    setFormPosterUrl(w.posterUrl || "");
    setFormType(w.type);
    setFormPrice(w.price ? String(w.price).replace(/[^0-9]/g, "") : "");
    setFormDate(w.date || "");
    setFormTime(w.time || "");
    setFormDuration(w.duration || "60 mins");
    setFormCapacity(String(w.capacity || w.max_capacity || 100));
    setFormStatus(w.status || "published");
    setShowWebinarForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveWebinar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate.trim() || !formTime.trim()) {
      setError("Please fill in Title, Date, and Time.");
      return;
    }

    const saved = saveWebinar({
      id: editingWebinarId || undefined,
      title: formTitle.trim(),
      description: formDescription.trim(),
      posterUrl: formPosterUrl.trim() || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      type: formType,
      price: formType === "paid" ? Number(formPrice) || 499 : "FREE",
      date: formDate.trim(),
      time: formTime.trim(),
      duration: formDuration.trim() || "60 mins",
      host: "CBM Academy Faculty",
      whatYouWillLearn: [
        "Interactive live practical industry breakdown",
        "Frameworks and execution strategies",
        "Q&A session with CBM mentors",
      ],
      capacity: Number(formCapacity) || 100,
      status: formStatus,
    });

    setSuccess(editingWebinarId ? `Webinar "${saved.title}" updated successfully.` : `New webinar "${saved.title}" created successfully.`);
    loadWebinarsData();
    resetWebinarForm();
  };

  const handleDeleteWebinar = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete or deactivate "${title}"?`)) {
      deleteWebinar(id);
      setSuccess(`Webinar "${title}" has been deleted.`);
      loadWebinarsData();
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = toggleWebinarStatus(id);
    if (updated) {
      setSuccess(`Webinar status toggled to "${updated.status}".`);
      loadWebinarsData();
    }
  };

  async function readResponse(
    response: Response
  ) {
    const text =
      await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      return {
        error:
          text ||
          "Unknown server response.",
      };
    }
  }

  function getErrorMessage(
    data: any,
    fallback: string
  ) {
    if (!data) {
      return fallback;
    }

    if (typeof data === "string") {
      return data;
    }

    if (
      typeof data.error === "string"
    ) {
      return data.error;
    }

    if (
      typeof data.message === "string"
    ) {
      return data.message;
    }

    if (
      typeof data.details === "string"
    ) {
      return data.details;
    }

    if (
      data.details &&
      typeof data.details.message ===
        "string"
    ) {
      return data.details.message;
    }

    return fallback;
  }

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let authSucceeded = false;
      let token = "";

      // 1. Try server admin login endpoint
      try {
        const srvRes = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const srvData = await srvRes.json();
        if (srvRes.ok && srvData.success && srvData.access_token) {
          authSucceeded = true;
          token = srvData.access_token;
        }
      } catch (srvErr) {
        console.warn("Server admin auth notice:", srvErr);
      }

      // 2. Try Supabase Auth
      if (!authSucceeded) {
        try {
          const { data: supaAuth, error: supaErr } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (!supaErr && supaAuth?.session?.access_token) {
            authSucceeded = true;
            token = supaAuth.session.access_token;
          }
        } catch (supaEx) {
          console.warn("Supabase auth notice:", supaEx);
        }
      }

      // 3. Try worker jobs auth endpoint
      if (!authSucceeded) {
        try {
          const response =
            await fetch(
              `${JOBS_API}/auth/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  email:
                    email.trim(),
                  password,
                }),
              }
            );

          const data =
            await readResponse(response);

          if (response.ok && data.access_token) {
            authSucceeded = true;
            token = data.access_token;
          } else if (!response.ok && data.error) {
            console.warn("Worker auth error:", data.error);
          }
        } catch (workerErr) {
          console.warn("Worker auth error:", workerErr);
        }
      }

      if (!authSucceeded) {
        throw new Error(
          "Invalid admin credentials. Please enter a valid admin email and password."
        );
      }

      localStorage.setItem(
        "cbm_admin_access_token",
        token
      );

      setLoggedIn(true);
      setPassword("");
      setSuccess("Login successful!");
      loadWebinarsData();
      await loadJobs(token, true);
    } catch (err) {
      console.error(
        "Admin login error:",
        err
      );

      setLoggedIn(false);

      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );
    } finally {
      setLoading(false);
      setCheckingSession(false);
    }
  }

  async function loadJobs(
    token?: string,
    fromLogin = false
  ) {
    const accessToken =
      token ||
      localStorage.getItem(
        "cbm_admin_access_token"
      );

    if (!accessToken) {
      setCheckingSession(false);
      return;
    }

    try {
      const response =
        await fetch(
          `${JOBS_API}/jobs`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

      const data =
        await readResponse(response);

      if (!response.ok) {
        /*
          IMPORTANT:
          Do NOT remove the admin token here.

          Login can be successful even when
          Supabase/PostgREST is temporarily
          unavailable.
        */

        const message =
          getErrorMessage(
            data,
            "Jobs are temporarily unavailable."
          );

        setError(message);

        if (!fromLogin) {
          setSuccess("");
        }

        return;
      }

      setJobs(
        Array.isArray(data.jobs)
          ? data.jobs
          : []
      );

      /*
        Clear database error once jobs load.
      */
      setError("");

    } catch (err) {
      console.error(
        "Load jobs error:",
        err
      );

      /*
        IMPORTANT:
        Do NOT log the admin out.

        Keep the login active.
      */

      setError(
        err instanceof Error
          ? err.message
          : "Jobs are temporarily unavailable."
      );
    } finally {
      setCheckingSession(false);
    }
  }

  async function updateJobStatus(
    jobId: string,
    status:
      | "approved"
      | "rejected"
  ) {
    const token =
      localStorage.getItem(
        "cbm_admin_access_token"
      );

    if (!token) {
      setLoggedIn(false);
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response =
        await fetch(
          `${JOBS_API}/jobs/${encodeURIComponent(
            jobId
          )}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to update job."
          )
        );
      }

      setSuccess(
        status === "approved"
          ? "Job approved successfully!"
          : "Job rejected successfully!"
      );

      await loadJobs(token);
    } catch (err) {
      console.error(
        "Update job error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update job."
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(
      "cbm_admin_access_token"
    );

    localStorage.removeItem(
      "cbm_admin_refresh_token"
    );

    setLoggedIn(false);
    setJobs([]);
    setPassword("");
    setError("");
    setSuccess("");
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-lg">
          Loading Admin Panel...
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

          <div className="text-center mb-7">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-xl font-bold">
              CBM
            </div>

            <h1 className="text-3xl font-bold text-[#072B57] mt-5">
              Admin Login
            </h1>

            <p className="text-slate-500 mt-1">
              CBM Academy Job Portal
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 text-sm">
              <div className="font-bold mb-1">
                Login failed
              </div>

              <div className="break-words">
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-300 bg-green-50 p-4 text-green-700 text-sm">
              {success}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-[#072B57] mb-2">
                Admin Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#072B57] mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-4 transition"
            >
              {loading
                ? "Logging in..."
                : "Login to Admin Panel"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Authorized CBM Academy administrator only
          </p>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center space-y-2">
            <a
              href="#webinars"
              className="inline-block text-xs font-bold text-[#FF6B00] hover:underline"
            >
              &larr; Return to Webinars &amp; Public Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  const pendingJobs =
    jobs.filter(
      (job) =>
        job.status === "pending"
    );

  const approvedJobs =
    jobs.filter(
      (job) =>
        job.status === "approved"
    );

  const rejectedJobs =
    jobs.filter(
      (job) =>
        job.status === "rejected"
    );

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold">
              CBM Academy Admin Panel
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Job Posting Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWebinarModalOpen(true)}
              className="bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer shadow-xs"
            >
              Manage Webinars
            </button>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8">

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 pb-4 mb-6 flex-wrap">
          <button
            type="button"
            onClick={() => setAdminTab('webinars')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              adminTab === 'webinars'
                ? 'bg-[#072B57] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Webinars Catalog ({webinars.length})
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('registrations')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              adminTab === 'registrations'
                ? 'bg-[#072B57] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Webinar Registrations
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('jobs')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              adminTab === 'jobs'
                ? 'bg-[#072B57] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Job Postings ({jobs.length})
          </button>
        </div>

        {adminTab === 'webinars' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={webinarSearch}
                  onChange={(e) => setWebinarSearch(e.target.value)}
                  placeholder="Search webinars by title, topic, or status..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="flex items-center gap-2">
                {!showWebinarForm && (
                  <button
                    type="button"
                    onClick={() => {
                      resetWebinarForm();
                      setShowWebinarForm(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B00] px-4 py-2 text-xs font-bold text-white hover:bg-[#e05f00] transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Webinar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset webinars to default catalog?')) {
                      localStorage.removeItem('cbm_webinars_v2');
                      loadWebinarsData();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reload / Reset</span>
                </button>
              </div>
            </div>

            {/* In-Page Add / Edit Webinar Form */}
            {showWebinarForm && (
              <div className="rounded-2xl border-2 border-[#FF6B00]/40 bg-orange-50/20 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-orange-200 mb-5">
                  <h3 className="text-base font-bold text-[#072B57] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#FF6B00]" />
                    <span>{editingWebinarId ? 'Edit Webinar Details' : 'Add New Webinar'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={resetWebinarForm}
                    className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    ✕ Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveWebinar} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#072B57] mb-1">
                        Webinar Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#072B57] mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] resize-none"
                      />
                    </div>

                    {/* Image / Poster URL */}
                    <div>
                      <label className="block text-xs font-bold text-[#072B57] mb-1">
                        Poster / Thumbnail Image URL
                      </label>
                      <input
                        type="url"
                        value={formPosterUrl}
                        onChange={(e) => setFormPosterUrl(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                      />
                    </div>

                    {/* Category / Type & Price */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#072B57] mb-1">
                          Free / Paid Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value as WebinarType)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                        >
                          <option value="free">FREE</option>
                          <option value="paid">PAID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#072B57] mb-1">
                          Price (₹ INR) {formType === 'paid' && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="number"
                          disabled={formType === 'free'}
                          value={formType === 'free' ? '' : formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs font-bold text-[#072B57] mb-1">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-xs font-bold text-[#072B57] mb-1">
                        Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-xs font-bold text-[#072B57] mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                      />
                    </div>

                    {/* Available Seats / Capacity & Status */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#072B57] mb-1">
                          Available Seats (Capacity)
                        </label>
                        <input
                          type="number"
                          value={formCapacity}
                          onChange={(e) => setFormCapacity(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#072B57] mb-1">
                          Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as WebinarStatus)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="published">Published</option>
                          <option value="draft">Draft (Deactivated)</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#072B57] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0c3c78] transition-colors cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{editingWebinarId ? 'Save Webinar Changes' : 'Create Webinar'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetWebinarForm}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Webinars List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {webinars
                .filter((w) => {
                  if (!webinarSearch.trim()) return true;
                  const q = webinarSearch.toLowerCase();
                  return w.title.toLowerCase().includes(q) || (w.description && w.description.toLowerCase().includes(q));
                })
                .map((w) => {
                  const isFree = w.type === 'free';
                  const isPublished = w.status === 'published' || w.status === 'upcoming';

                  return (
                    <div
                      key={w.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        {/* Poster with Badges */}
                        <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-100">
                          <img
                            src={w.posterUrl}
                            alt={w.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                isFree
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-orange-100 text-[#FF6B00] border border-orange-200'
                              }`}
                            >
                              {isFree ? 'FREE' : `PAID ₹${w.price || 499}`}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isPublished
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-slate-200 text-slate-700 border border-slate-300'
                              }`}
                            >
                              {w.status}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-sm text-[#072B57] line-clamp-1">
                            {w.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {w.description}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              <span>{w.date}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              <span>{w.time}</span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span>Capacity: <strong className="text-slate-800">{w.capacity || w.max_capacity || 100} seats</strong></span>
                            <span>Duration: <strong className="text-slate-800">{w.duration}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => handleEditWebinar(w)}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#072B57] hover:bg-[#0c3c78] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(w.id)}
                          title={isPublished ? 'Deactivate (Draft)' : 'Activate (Publish)'}
                          className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs text-slate-700 transition-colors cursor-pointer"
                        >
                          {isPublished ? <EyeOff className="h-3.5 w-3.5 text-slate-500" /> : <Eye className="h-3.5 w-3.5 text-emerald-600" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteWebinar(w.id, w.title)}
                          title="Delete webinar"
                          className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {adminTab === 'registrations' && (
          <AdminWebinarRegistrations
            token={localStorage.getItem("cbm_admin_access_token") || "admin_session"}
          />
        )}

        {adminTab === 'jobs' && (
          <div>
            {error && (
              <div className="mb-6 rounded-xl border border-orange-300 bg-orange-50 p-4 text-orange-700">
                <div className="font-bold">
                  Job storage temporarily unavailable
                </div>

                <div className="mt-1 text-sm">
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-4 text-green-700">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

              <div className="bg-white rounded-2xl p-6 shadow">
                <p className="text-slate-500">
                  Pending
                </p>

                <p className="text-4xl font-bold text-orange-500 mt-2">
                  {pendingJobs.length}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow">
                <p className="text-slate-500">
                  Approved
                </p>

                <p className="text-4xl font-bold text-green-600 mt-2">
                  {approvedJobs.length}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow">
                <p className="text-slate-500">
                  Rejected
                </p>

                <p className="text-4xl font-bold text-red-600 mt-2">
                  {rejectedJobs.length}
                </p>
              </div>

            </div>

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-2xl font-bold text-[#072B57]">
              Job Listings
            </h2>

            <p className="text-slate-500 text-sm">
              Review and manage employer submissions.
            </p>
          </div>

          <button
            onClick={() =>
              loadJobs()
            }
            disabled={loading}
            className="bg-white border border-slate-300 px-4 py-2 rounded-xl font-semibold hover:bg-slate-50"
          >
            Refresh
          </button>

        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              📋
            </div>

            <h3 className="text-xl font-bold text-[#072B57]">
              No job submissions available
            </h3>

            <p className="text-slate-500 mt-2">
              New employer job postings will appear here
              once the job database is available.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow p-6"
              >

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-xl font-bold text-[#072B57]">
                        {job.job_title}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          job.status ===
                          "approved"
                            ? "bg-green-100 text-green-700"
                            : job.status ===
                              "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {job.status}
                      </span>

                    </div>

                    <p className="font-semibold text-indigo-600 mt-2">
                      {job.company_name}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 text-sm">

                      <p>
                        <strong>HR:</strong>{" "}
                        {job.hr_name}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {job.hr_email}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {job.hr_phone}
                      </p>

                      <p>
                        <strong>Location:</strong>{" "}
                        {job.location}
                      </p>

                      <p>
                        <strong>Work Type:</strong>{" "}
                        {job.work_type}
                      </p>

                      <p>
                        <strong>Salary:</strong>{" "}
                        {job.salary ||
                          "Not specified"}
                      </p>

                      <p>
                        <strong>Experience:</strong>{" "}
                        {job.experience ||
                          "Not specified"}
                      </p>

                      <p>
                        <strong>Submitted:</strong>{" "}
                        {new Date(
                          job.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="mt-5">

                      <p className="font-semibold text-[#072B57] mb-1">
                        Job Description
                      </p>

                      <p className="text-slate-600 whitespace-pre-line">
                        {job.job_description}
                      </p>

                    </div>

                    {job.skills &&
                      job.skills.length > 0 && (
                        <div className="mt-4">

                          <p className="font-semibold text-[#072B57] mb-2">
                            Skills
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {job.skills.map(
                              (
                                skill,
                                index
                              ) => (
                                <span
                                  key={index}
                                  className="bg-slate-100 px-3 py-1 rounded-full text-sm text-[#072B57]"
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>

                        </div>
                      )}

                  </div>

                  {job.status ===
                    "pending" && (
                    <div className="flex lg:flex-col gap-3">

                      <button
                        onClick={() =>
                          updateJobStatus(
                            job.id,
                            "approved"
                          )
                        }
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-bold"
                      >
                        ✓ Approve
                      </button>

                      <button
                        onClick={() =>
                          updateJobStatus(
                            job.id,
                            "rejected"
                          )
                        }
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-bold"
                      >
                        ✕ Reject
                      </button>

                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}
          </div>
        )}

      </main>

      <ManageWebinarsModal
        isOpen={webinarModalOpen}
        onClose={() => setWebinarModalOpen(false)}
      />
    </div>
  );
}
