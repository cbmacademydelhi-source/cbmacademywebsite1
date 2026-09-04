import React, { useEffect, useState } from "react";

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

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [checkingSession, setCheckingSession] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "cbm_admin_access_token"
      );

    if (token) {
      setLoggedIn(true);
      loadJobs(token);
    } else {
      setCheckingSession(false);
    }
  }, []);

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

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            `Login failed (${response.status}).`
          )
        );
      }

      if (
        !data.access_token
      ) {
        throw new Error(
          "Login response did not contain an access token."
        );
      }

      localStorage.setItem(
        "cbm_admin_access_token",
        data.access_token
      );

      setLoggedIn(true);
      setPassword("");

      /*
        Login itself succeeded.
      */
      setSuccess(
        "Login successful!"
      );

      /*
        Loading jobs is a separate operation.
        If it fails, DO NOT log the admin out.
      */
      await loadJobs(
        data.access_token,
        true
      );
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

            <h1 className="text-3xl font-bold text-slate-900 mt-5">
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                placeholder="office@cbmacademy.in"
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
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter admin password"
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

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-xl font-semibold"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8">

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
            <h2 className="text-2xl font-bold text-slate-900">
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

            <h3 className="text-xl font-bold text-slate-800">
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

                      <h3 className="text-xl font-bold text-slate-900">
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

                      <p className="font-semibold text-slate-800 mb-1">
                        Job Description
                      </p>

                      <p className="text-slate-600 whitespace-pre-line">
                        {job.job_description}
                      </p>

                    </div>

                    {job.skills &&
                      job.skills.length > 0 && (
                        <div className="mt-4">

                          <p className="font-semibold text-slate-800 mb-2">
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
                                  className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700"
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

      </main>
    </div>
  );
}
