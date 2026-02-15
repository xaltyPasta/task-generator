// app/page.tsx

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          Generate User Stories & Engineering Tasks in Seconds
        </h1>
        <p className="lead text-muted mb-4">
          Turn feature ideas into structured product specs with stories,
          tasks, and risks — instantly.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <a href="/dashboard/new" className="btn btn-primary btn-lg">
            Create New Spec
          </a>
          <a href="/dashboard" className="btn btn-outline-secondary btn-lg">
            View Dashboard
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="row g-4">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Structured Output</h5>
              <p className="card-text text-muted">
                Automatically generate user stories, engineering tasks, and
                risk analysis from your feature idea.
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Editable & Reorderable</h5>
              <p className="card-text text-muted">
                Edit tasks inline, reorder with drag-and-drop, and group them
                by stories.
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Export Ready</h5>
              <p className="card-text text-muted">
                Copy or download your spec as Markdown for sharing with your
                team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Section */}
      <div className="mt-5">
        <h2 className="text-center mb-4">Built-in Templates</h2>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card border-primary h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Web App</h5>
                <p className="card-text text-muted">
                  Standard web-based product features and workflows.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-success h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Mobile App</h5>
                <p className="card-text text-muted">
                  Includes offline support, device features, and push flows.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-warning h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Internal Tool</h5>
                <p className="card-text text-muted">
                  Admin roles, dashboards, and operational workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center mt-5">
        <a href="/dashboard/new" className="btn btn-dark btn-lg px-5">
          Start Planning Now
        </a>
      </div>
    </div>
  )
}
