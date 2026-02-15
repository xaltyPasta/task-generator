"use client";

import { useRouter } from "next/navigation";
import EditableField from "./EditableField";
import { useState } from "react";

type Props = {
    spec: any;
};

export default function SpecDetailClient({
    spec,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] =
        useState(false);

    const refresh = () => router.refresh();

    const copyMarkdown = async () => {
        const res = await fetch(
            `/api/specs/${spec.id}/export`
        );
        const text = await res.text();
        await navigator.clipboard.writeText(
            text
        );
        alert("Markdown copied to clipboard");
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold">
                        <EditableField
                            value={spec.title}
                            onSave={async (
                                newValue
                            ) => {
                                await fetch(
                                    `/api/specs/${spec.id}`,
                                    {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type":
                                                "application/json",
                                        },
                                        body: JSON.stringify({
                                            title: newValue,
                                        }),
                                    }
                                );
                                refresh();
                            }}
                        />
                    </h2>

                    <span className="badge bg-secondary">
                        {spec.templateType}
                    </span>
                </div>

                {/* Export Controls */}
                <div className="d-flex gap-2">
                    <a
                        href={`/api/specs/${spec.id}/export`}
                        className="btn btn-outline-dark btn-sm"
                    >
                        Download Markdown
                    </a>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={copyMarkdown}
                    >
                        Copy Markdown
                    </button>

                    <button
                        className="btn btn-success btn-sm"
                        disabled={loading}
                        onClick={async () => {
                            if (
                                !confirm(
                                    "Regenerate stories? Existing stories will be deleted."
                                )
                            )
                                return;

                            setLoading(true);

                            await fetch(
                                `/api/specs/${spec.id}/generate`,
                                { method: "POST" }
                            );

                            setLoading(false);
                            refresh();
                        }}
                    >
                        {loading
                            ? "Generating..."
                            : "Regenerate AI"}
                    </button>
                </div>
            </div>

            {/* Add Story */}
            <button
                className="btn btn-primary mb-3"
                onClick={async () => {
                    const title =
                        prompt("Enter story title");
                    if (!title) return;

                    await fetch("/api/stories", {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            specId: spec.id,
                            title,
                        }),
                    });

                    refresh();
                }}
            >
                + Add Story
            </button>

            {/* Stories */}
            {spec.stories.map((story: any) => (
                <div
                    key={story.id}
                    className="card shadow-sm mb-4"
                >
                    <div className="card-body">
                        {/* Story Title */}
                        <EditableField
                            value={story.title}
                            onSave={async (
                                newValue
                            ) => {
                                await fetch(
                                    `/api/stories/${story.id}`,
                                    {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type":
                                                "application/json",
                                        },
                                        body: JSON.stringify({
                                            title: newValue,
                                        }),
                                    }
                                );
                                refresh();
                            }}
                        />

                        {/* Story Controls */}
                        <div className="d-flex gap-2 mt-2">
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={async () => {
                                    if (
                                        confirm(
                                            "Delete this story?"
                                        )
                                    ) {
                                        await fetch(
                                            `/api/stories/${story.id}`,
                                            {
                                                method:
                                                    "DELETE",
                                            }
                                        );
                                        refresh();
                                    }
                                }}
                            >
                                Delete Story
                            </button>

                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={async () => {
                                    const title =
                                        prompt(
                                            "New task title"
                                        );
                                    if (!title) return;

                                    await fetch(
                                        "/api/tasks",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify(
                                                {
                                                    storyId:
                                                        story.id,
                                                    title,
                                                }
                                            ),
                                        }
                                    );

                                    refresh();
                                }}
                            >
                                + Add Task
                            </button>
                        </div>

                        {/* Tasks */}
                        <ul className="list-group mt-3">
                            {story.tasks.map(
                                (task: any) => (
                                    <li
                                        key={task.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <EditableField
                                            value={task.title}
                                            onSave={async (
                                                newValue
                                            ) => {
                                                await fetch(
                                                    `/api/tasks/${task.id}`,
                                                    {
                                                        method:
                                                            "PATCH",
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                        body: JSON.stringify(
                                                            {
                                                                title:
                                                                    newValue,
                                                            }
                                                        ),
                                                    }
                                                );
                                                refresh();
                                            }}
                                        />

                                        <div className="d-flex gap-2 align-items-center">
                                            <select
                                                className="form-select form-select-sm"
                                                style={{
                                                    width: 140,
                                                }}
                                                defaultValue={
                                                    task.status
                                                }
                                                onChange={async (
                                                    e
                                                ) => {
                                                    await fetch(
                                                        `/api/tasks/${task.id}`,
                                                        {
                                                            method:
                                                                "PATCH",
                                                            headers: {
                                                                "Content-Type":
                                                                    "application/json",
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    status:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            ),
                                                        }
                                                    );
                                                    refresh();
                                                }}
                                            >
                                                <option value="TODO">
                                                    TODO
                                                </option>
                                                <option value="IN_PROGRESS">
                                                    IN_PROGRESS
                                                </option>
                                                <option value="DONE">
                                                    DONE
                                                </option>
                                            </select>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={async () => {
                                                    if (
                                                        confirm(
                                                            "Delete this task?"
                                                        )
                                                    ) {
                                                        await fetch(
                                                            `/api/tasks/${task.id}`,
                                                            {
                                                                method:
                                                                    "DELETE",
                                                            }
                                                        );
                                                        refresh();
                                                    }
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}
