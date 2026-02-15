"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSpecPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    goal: "",
    targetUsers: "",
    constraints: "",
    templateType: "WEB",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/specs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to create spec");
      }

      const data = await res.json();

      router.push(`/dashboard/${data.id}`);
    } catch (error) {
      alert("Error creating spec");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h3 className="mb-4 fw-bold">
        Create New Feature Spec
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Goal */}
        <div className="mb-3">
          <label className="form-label">
            Goal
          </label>
          <textarea
            className="form-control"
            rows={3}
            name="goal"
            value={form.goal}
            onChange={handleChange}
            required
          />
        </div>

        {/* Target Users */}
        <div className="mb-3">
          <label className="form-label">
            Target Users
          </label>
          <textarea
            className="form-control"
            rows={2}
            name="targetUsers"
            value={form.targetUsers}
            onChange={handleChange}
            required
          />
        </div>

        {/* Constraints */}
        <div className="mb-3">
          <label className="form-label">
            Constraints
          </label>
          <textarea
            className="form-control"
            rows={2}
            name="constraints"
            value={form.constraints}
            onChange={handleChange}
          />
        </div>

        {/* Template */}
        <div className="mb-4">
          <label className="form-label">
            Template Type
          </label>
          <select
            className="form-select"
            name="templateType"
            value={form.templateType}
            onChange={handleChange}
          >
            <option value="WEB">Web App</option>
            <option value="MOBILE">Mobile App</option>
            <option value="INTERNAL_TOOL">
              Internal Tool
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Spec"}
        </button>
      </form>
    </div>
  );
}

