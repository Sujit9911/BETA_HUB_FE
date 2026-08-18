import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/ui/Modal";
import MemberCard from "../../components/team/MemberCard";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const passingYears = Array.from(
  { length: 29 },
  (_, index) => 2007 + index
);

const studyYears = ["FY", "SY", "TY", "BE", "PassOut"];

const academicYears = [
  "2026-27",
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
  "2018-19",
];

export default function Team() {
  const { isAdmin } = useAuth();

  const [years, setYears] = useState([]);
  const [activeYear, setActiveYear] = useState(null);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    designation: "",
    branch: "",
    year: "",
    passingYear: "",
    academicYearLabel: "",
  });

  const fetchYears = async () => {
    try {
      const res = await axiosInstance.get("/team/years");

      const backendYears = Array.isArray(res.data)
        ? res.data
        : [];

      const sortedYears = [...new Set(backendYears)]
        .filter(Boolean)
        .sort((a, b) => {
          const yearA = parseInt(a.split("-")[0], 10);
          const yearB = parseInt(b.split("-")[0], 10);

          return yearB - yearA;
        });

      setYears(sortedYears);

      if (sortedYears.length === 0) {
        setActiveYear(null);
        setMembers([]);
        setLoading(false);
        return;
      }

      if (!activeYear || !sortedYears.includes(activeYear)) {
        setActiveYear(sortedYears[0]);
      }
    } catch (err) {
      console.error(err);
      setYears([]);
      setActiveYear(null);
      setMembers([]);
      setLoading(false);
    }
  };

  const fetchMembers = async (year) => {
    if (!year) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.get(
        `/team/year/${encodeURIComponent(year)}`
      );

      setMembers(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (activeYear) {
      fetchMembers(activeYear);
    } else {
      setMembers([]);
      setLoading(false);
    }
  }, [activeYear]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      designation: "",
      branch: "",
      year: "",
      passingYear: "",
      academicYearLabel: "",
    });

    setPhoto(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      return;
    }

    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.designation ||
      !form.year ||
      !form.passingYear ||
      !form.academicYearLabel
    ) {
      setError(
        "Name, email, designation, current year, passing year, and academic year are required"
      );
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append(
        "data",
        new Blob(
          [JSON.stringify(form)],
          {
            type: "application/json",
          }
        )
      );

      if (photo) {
        formData.append("photo", photo);
      }

      await axiosInstance.post(
        "/team",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newAcademicYear =
        form.academicYearLabel;

      setModalOpen(false);
      resetForm();

      await fetchYears();

      setActiveYear(newAcademicYear);

      await fetchMembers(newAcademicYear);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to add member"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      return;
    }

    if (!confirm("Remove this team member?")) {
      return;
    }

    setError("");

    try {
      await axiosInstance.delete(
        `/team/${id}`
      );

      const updatedMembers =
        members.filter(
          (member) => member.id !== id
        );

      setMembers(updatedMembers);

      if (updatedMembers.length === 0) {
        const deletedYear = activeYear;

        const updatedYears =
          years.filter(
            (year) => year !== deletedYear
          );

        setYears(updatedYears);

        if (updatedYears.length > 0) {
          setActiveYear(updatedYears[0]);
        } else {
          setActiveYear(null);
        }
      } else {
        await fetchMembers(activeYear);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to remove team member"
      );
    }
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            BETA Team
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Core committee across academic years
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setError("");
              resetForm();
              setModalOpen(true);
            }}
            className="self-start sm:self-auto bg-blue-800 hover:bg-blue-700 hover:-translate-y-0.5 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            + Add member
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {years.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Academic Years
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() =>
                  setActiveYear(year)
                }
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  activeYear === year
                    ? "bg-blue-800 text-white border-blue-800 shadow-md shadow-blue-800/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:text-blue-700 dark:hover:border-blue-700 dark:hover:text-blue-400"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeYear &&
        !loading &&
        members.length > 0 && (
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {activeYear} Committee
              </p>

              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                {members.length}{" "}
                {members.length === 1
                  ? "member"
                  : "members"}{" "}
                in the core team
              </p>
            </div>
          </div>
        )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-14 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-3xl mb-4">
            👥
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white">
            No team members yet
          </h3>

          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            No team members have been added for this academic year.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isAdmin && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add team member"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="member@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Designation
              </label>

              <input
                type="text"
                value={form.designation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    designation: e.target.value,
                  })
                }
                placeholder="President, Secretary..."
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                  Branch
                </label>

                <input
                  type="text"
                  value={form.branch}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      branch: e.target.value,
                    })
                  }
                  placeholder="ENTC"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Year
                </label>

                <select
                  value={form.year}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      year: e.target.value,
                    })
                  }
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">
                    Select current year
                  </option>

                  {studyYears.map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Passing Year
              </label>

              <select
                value={form.passingYear}
                onChange={(e) =>
                  setForm({
                    ...form,
                    passingYear: e.target.value,
                  })
                }
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">
                  Select passing year
                </option>

                {passingYears.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Year
              </label>

              <select
                value={form.academicYearLabel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    academicYearLabel:
                      e.target.value,
                  })
                }
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">
                  Select academic year
                </option>

                {academicYears.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">
                Photo (optional)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhoto(e.target.files[0])
                }
                className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-950/50 file:text-blue-800 dark:file:text-blue-300 file:text-sm file:font-medium"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
            >
              {submitting
                ? "Adding..."
                : "Add member"}
            </button>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}