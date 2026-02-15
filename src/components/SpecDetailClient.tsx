"use client";

import { useRouter } from "next/navigation";
import EditableField from "./EditableField";

type Props = {
    spec: any;
};

export default function SpecDetailClient({
    spec,
}: Props) {
    const router = useRouter();

    const refresh = () => router.refresh();

    return (
        <div>
            {/* Header */}
            <div className="mb-4">
                <h2 className="fw-bold">
                    <EditableField
                        value={spec.title}
                        onSave={async (newValue) => {
                            await fetch(`/api/specs/${spec.id}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    title: newValue,
                                }),
                            });
                            refresh();
                        }}
                    />
                </h2>

                <span className="badge bg-secondary">
                    {spec.templateType}
                </span>
            </div>

            {/* Add Story Button */}
            <button
                className="btn btn-primary mb-3"
                onClick={async () => {
                    const title = prompt("Enter story title");
                    if (!title) return;

                    await fetch("/api/stories", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
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
                        {/* Editable Story Title */}
                        <EditableField
                            value={story.title}
                            onSave={async (newValue) => {
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

                        {/* Delete Story */}
                        <button
                            className="btn btn-sm btn-danger mt-2"
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
