"use client";

import { useRouter } from "next/navigation";
import EditableField from "./EditableField";
import { useState, useEffect } from "react";

import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    spec: any;
};

function SortableTask({
    task,
    children,
}: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(
            transform
        ),
        transition,
        cursor: "grab",
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="list-group-item d-flex justify-content-between align-items-center"
        >
            {children}
        </li>
    );
}

export default function SpecDetailClient({
    spec,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] =
        useState(false);

    // ✅ Hydration fix
    const [mounted, setMounted] =
        useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

                        {/* 🔥 Drag & Drop Tasks (Hydration Safe) */}
                        {mounted && (
                            <DndContext
                                collisionDetection={
                                    closestCenter
                                }
                                onDragEnd={async (
                                    event
                                ) => {
                                    const {
                                        active,
                                        over,
                                    } = event;

                                    if (
                                        !over ||
                                        active.id === over.id
                                    )
                                        return;

                                    const oldIndex =
                                        story.tasks.findIndex(
                                            (t: any) =>
                                                t.id === active.id
                                        );

                                    const newIndex =
                                        story.tasks.findIndex(
                                            (t: any) =>
                                                t.id === over.id
                                        );

                                    const newTasks =
                                        arrayMove(
                                            story.tasks,
                                            oldIndex,
                                            newIndex
                                        );

                                    const updates =
                                        newTasks.map(
                                            (
                                                task: any,
                                                index: number
                                            ) => ({
                                                taskId:
                                                    task.id,
                                                storyId:
                                                    story.id,
                                                order:
                                                    index + 1,
                                            })
                                        );

                                    await fetch(
                                        "/api/tasks/reorder",
                                        {
                                            method:
                                                "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify(
                                                updates
                                            ),
                                        }
                                    );

                                    refresh();
                                }}
                            >
                                <SortableContext
                                    items={story.tasks.map(
                                        (t: any) => t.id
                                    )}
                                    strategy={
                                        verticalListSortingStrategy
                                    }
                                >
                                    <ul className="list-group mt-3">
                                        {story.tasks.map(
                                            (task: any) => (
                                                <SortableTask
                                                    key={task.id}
                                                    task={task}
                                                >
                                                    <>
                                                        <EditableField
                                                            value={
                                                                task.title
                                                            }
                                                            onSave={async (
                                                                newValue
                                                            ) => {
                                                                await fetch(
                                                                    `/api/tasks/${task.id}`,
                                                                    {
                                                                        method:
                                                                            "PATCH",
                                                                        headers:
                                                                        {
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
                                                                value={task.status}
                                                                onChange={async (
                                                                    e
                                                                ) => {
                                                                    await fetch(
                                                                        `/api/tasks/${task.id}`,
                                                                        {
                                                                            method:
                                                                                "PATCH",
                                                                            headers:
                                                                            {
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
                                                    </>
                                                </SortableTask>
                                            )
                                        )}
                                    </ul>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
