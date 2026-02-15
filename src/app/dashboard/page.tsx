import Link from "next/link";
import { requireAuth } from "@/lib/services/auth.service";
import { getUserRecentSpecs } from "@/lib/services/dashboard.service";


export default async function DashboardPage() {
  const userId = await requireAuth();

  if (!userId) {
    return (
      <div className="text-center py-5">
        <h4>You must be logged in to view dashboard.</h4>
        <Link href="/login" className="btn btn-primary mt-3">
          Go to Login
        </Link>
      </div>
    );
  }

  const specs = await getUserRecentSpecs(userId);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="fw-bold mb-0">Your Recent Specs</h2>

        <Link
          href="/dashboard/new"
          className="btn btn-primary"
        >
          + Create New Spec
        </Link>
      </div>

      {specs.length === 0 && (
        <div className="card shadow-sm p-4 text-center">
          <h5>No specs yet</h5>
          <p className="text-muted">
            Start by creating your first feature plan.
          </p>
          <Link
            href="/dashboard/new"
            className="btn btn-dark"
          >
            Create First Spec
          </Link>
        </div>
      )}

      {specs.length > 0 && (
        <div className="row g-4">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className="col-12 col-md-6 col-lg-4"
            >
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    {spec.title}
                  </h5>

                  <p className="text-muted small mb-2">
                    {spec.templateType}
                  </p>

                  <p className="text-muted small">
                    Created on{" "}
                    {new Date(
                      spec.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={`/dashboard/${spec.id}`}
                      className="btn btn-outline-primary btn-sm w-100"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
