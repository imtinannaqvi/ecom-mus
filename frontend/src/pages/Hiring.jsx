import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiMapPin, FiClock } from "react-icons/fi";
import Api from "../api/api";

function Hiring() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await Api.get("/jobs");
        if (data.success) setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const groupedJobs = jobs.reduce((acc, job) => {
    const cat = job.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(job);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold italic">We Are Hiring</h1>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Join our team. Explore open positions below and apply directly online.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No open positions right now — check back soon.</p>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedJobs).map(([category, categoryJobs]) => (
              <div key={category}>
                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4 border-b pb-2">
                  {category}
                </h2>
                <div className="space-y-3">
                  {categoryJobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/careers/${job._id}`}
                      className="block p-5 border border-gray-100 rounded-xl hover:border-black transition-colors group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-base ">{job.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5">
                            <span className="flex items-center gap-1"><FiMapPin size={12} /> {job.location}</span>
                            <span className="flex items-center gap-1"><FiClock size={12} /> {job.type}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest underline shrink-0">
                          View & Apply
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Hiring;