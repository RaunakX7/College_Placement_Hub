"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Users,
  Search,
  BookOpen,
  GraduationCap,
  FileText,
  Trash2,
  Edit,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  rollNumber: string;
  phone?: string | null;
  department?: string | null;
  graduationYear?: string | null;
  cgpa?: number | null;
  resume?: string | null;
}

const studentEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  rollNumber: z.string().min(1, "Roll number is required"),
  department: z.string().min(1, "Department is required"),
  graduationYear: z.string().min(4, "Graduation year must be at least 4 digits"),
  cgpa: z.string().refine((val) => {
    const parsed = parseFloat(val);
    return !isNaN(parsed) && parsed >= 0 && parsed <= 10;
  }, { message: "CGPA must be between 0.00 and 10.00" }),
});

type StudentEditValues = z.infer<typeof studentEditSchema>;

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentEditValues>({
    resolver: zodResolver(studentEditSchema),
  });

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      if (res.ok) {
        setStudents(await res.json());
      }
    } catch (err) {
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (editingStudent) {
      reset({
        name: editingStudent.name,
        email: editingStudent.email,
        rollNumber: editingStudent.rollNumber,
        department: editingStudent.department || "",
        graduationYear: editingStudent.graduationYear || "",
        cgpa: editingStudent.cgpa ? editingStudent.cgpa.toString() : "",
      });
    }
  }, [editingStudent, reset]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student account? This will permanently delete their profile, saved jobs, applications, and selection round timelines.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/students?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ text: "Student account deleted successfully.", type: "success" });
        await fetchStudents();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to delete student.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "An error occurred during student account deletion.", type: "error" });
    }
  };

  const handleEditSubmit = async (values: StudentEditValues) => {
    if (!editingStudent) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/students?id=${editingStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Student records updated successfully!", type: "success" });
        setEditingStudent(null);
        await fetchStudents();
      } else {
        setMessage({ text: data.error || "Failed to update records.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "A network error occurred. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.department && s.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 relative">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Students</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Review candidate eligibility criteria, resumes, academic departments, and roll numbers.
        </p>
      </div>

      {/* Message feedback banner */}
      {message && (
        <div
          className={`rounded-2xl border p-4 text-sm flex items-start gap-3 animate-fade-in ${
            message.type === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-rose-100 bg-rose-50 text-rose-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="shrink-0 mt-0.5" size={16} />
          ) : (
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
          )}
          <div className="flex-1 font-semibold">{message.text}</div>
          <button onClick={() => setMessage(null)} className="hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by student name, roll number, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Student List Grid */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-5">Student Information</th>
                  <th className="p-5">Department</th>
                  <th className="p-5">CGPA</th>
                  <th className="p-5">Graduation</th>
                  <th className="p-5">Resume Link</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="p-5">
                      <div>
                        <p className="font-extrabold text-slate-900">{student.name}</p>
                        <div className="flex gap-2 text-xs text-slate-400 font-semibold mt-0.5">
                          <span>{student.rollNumber}</span>
                          <span>•</span>
                          <span>{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-semibold text-slate-600">
                      {student.department || <span className="text-slate-400 italic">Not set</span>}
                    </td>
                    <td className="p-5">
                      {student.cgpa !== undefined && student.cgpa !== null ? (
                        <span className="font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                          {student.cgpa.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not set</span>
                      )}
                    </td>
                    <td className="p-5 font-semibold text-slate-500">
                      {student.graduationYear || <span className="text-slate-400 italic">Not set</span>}
                    </td>
                    <td className="p-5">
                      {student.resume ? (
                        <a
                          href={student.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <FileText size={14} /> Resume <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No resume</span>
                      )}
                    </td>
                    <td className="p-5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all inline-flex items-center justify-center"
                        title="Edit Student details"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 rounded-xl border border-slate-200 text-rose-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all inline-flex items-center justify-center"
                        title="Delete account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 text-center py-20">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No students matching search criteria</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search query to locate active student registrations.
          </p>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditingStudent(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Student Details</h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="h-8 w-8 rounded-full border hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4 mt-6">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Student Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.name && <p className="text-xs text-rose-600 font-semibold">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.email && <p className="text-xs text-rose-600 font-semibold">{errors.email.message}</p>}
              </div>

              {/* Roll Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Roll Number</label>
                <input
                  type="text"
                  {...register("rollNumber")}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.rollNumber ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.rollNumber && <p className="text-xs text-rose-600 font-semibold">{errors.rollNumber.message}</p>}
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Department</label>
                <input
                  type="text"
                  {...register("department")}
                  placeholder="e.g. Computer Science"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.department ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                  }`}
                />
                {errors.department && <p className="text-xs text-rose-600 font-semibold">{errors.department.message}</p>}
              </div>

              {/* Grid: CGPA & Graduation Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">CGPA (0 - 10)</label>
                  <input
                    type="text"
                    {...register("cgpa")}
                    placeholder="e.g. 9.10"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.cgpa ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                    }`}
                  />
                  {errors.cgpa && <p className="text-xs text-rose-600 font-semibold">{errors.cgpa.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Graduation Year</label>
                  <input
                    type="text"
                    {...register("graduationYear")}
                    placeholder="e.g. 2026"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.graduationYear ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-indigo-500/20"
                    }`}
                  />
                  {errors.graduationYear && (
                    <p className="text-xs text-rose-600 font-semibold">{errors.graduationYear.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 rounded-xl border border-slate-200 text-slate-600 font-bold py-3 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
