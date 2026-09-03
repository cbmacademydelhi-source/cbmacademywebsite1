import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Job {
  id: string;
  company_name: string;
  hr_name: string;
  hr_email: string;
  hr_phone: string;
  job_title: string;
  job_description: string;
  location: string;
  salary: string | null;
  experience: string | null;
  skills: string[] | null;
  work_type: string;
  status: string;
  created_at: string;
}

const ADMIN_EMAIL = "office@cbmacademy.in";

const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);

      if (currentSession) {
        loadJobs();
      } else {
        setJobs([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    setSession(currentSession);

    if (currentSession) {
      const userEmail = currentSession.user.email?.toLowerCase();

      if (userEmail !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        setError("You are not authorized to access the admin panel.");
        return;
      }

      loadJobs();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("Only the CBM Academy admin account can login here.");
      setLoading(false);
      return;
    }

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    setSession(data.session);
    setPassword("");
    setLoading(false);

    await loadJobs();
  };

  const loadJobs = async () => {
    setJobsLoading(true);
    setError("");

    const { data, error: jobsError } = await supabase
      .from("job_listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (jobsError) {
      setError(jobsError.message);
      setJobsLoading(false);
      return;
    }

    setJobs(data || []);
    setJobsLoading(false);
  };

  const updateJobStatus = async (
    jobId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setError("");
    setMessage("");

    const { error: updateError } = await supabase
      .from("job_listings")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(
      newStatus === "approved"
        ? "Job approved successfully."
        : "Job rejected successfully."
    );

    await loadJobs();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setJobs([]);
    setMessage("");
  };

  const pendingJobs = jobs.filter(
    (job) => job.status === "pending"
  );

  const approvedJobs = jobs.filter(
    (job) => job.status === "approved"
  );

  const rejectedJobs = jobs.filter(
    (job) => job.status === "rejected"
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                CBM
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                Admin Login
              </h1>

              <p className="text-slate-500 mt-2">
                CBM Academy Job Portal
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Admin Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="office@cbmacademy.in"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 transition"
              >
                {loading ? "Logging in..." : "Login to Admin Panel"}
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-6">
              Authorized CBM Academy administrator only
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-400 text-sm font-semibold">
              CBM ACADEMY
            </p>

            <h1 className="text-2xl font-bold">
              Job Admin Dashboard
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Manage employer job postings
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2.5 font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">
              Pending Review
            </p>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              {pendingJobs.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">
              Approved Jobs
            </p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {approvedJobs.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">
              Rejected Jobs
            </p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {rejectedJobs.length}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Job Postings
            </h2>
            <p className="text-slate-500 mt-1">
              Review and manage employer submissions.
            </p>
          </div>

          <button
            onClick={loadJobs}
            disabled={jobsLoading}
            className="rounded-xl bg-white border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {jobsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {jobsLoading ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-slate-500">
              Loading job postings...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-200">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold text-slate-900">
              No job postings yet
            </h3>
            <p className="text-slate-500 mt-2">
              New employer submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            job.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : job.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.status.toUpperCase()}
                        </span>

                        <span className="text-xs text-slate-400">
                          {new Date(job.created_at).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">
                        {job.job_title}
                      </h3>

                      <p className="text-blue-600 font-semibold mt-1">
                        {job.company_name}
                      </p>
                    </div>

                    {job.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            updateJobStatus(job.id, "approved")
                          }
                          className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 font-bold transition"
                        >
                          ✓ Approve
                        </button>

                        <button
                          onClick={() =>
                            updateJobStatus(job.id, "rejected")
                          }
                          className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 font-bold transition"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        HR Name
                      </p>
                      <p className="text-slate-800 font-medium mt-1">
                        {job.hr_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        HR Email
                      </p>
                      <p className="text-slate-800 font-medium mt-1 break-all">
                        {job.hr_email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        HR Phone
                      </p>
                      <p className="text-slate-800 font-medium mt-1">
                        {job.hr_phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Location
                      </p>
                      <p className="text-slate-800 font-medium mt-1">
                        {job.location}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Salary
                      </p>
                      <p className="text-slate-800 font-medium mt-1">
                        {job.salary || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Experience
                      </p>
                      <p className="text-slate-800 font-medium mt-1">
                        {job.experience || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Work Type
                      </p>
                      <p className="text-slate-800 font-medium mt-1">
                        {job.work_type}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Skills
                      </p>
                      <p className="text-slate-800 font-medium mt-1">
                        {job.skills?.length
                          ? job.skills.join(", ")
                          : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-2">
                      Job Description
                    </p>

                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {job.job_description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
