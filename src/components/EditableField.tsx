"use client";

import { useState } from "react";

type Props = {
    value: string;
    onSave: (value: string) => Promise<void>;
    textarea?: boolean;
};

export default function EditableField({
    value,
    onSave,
    textarea = false,
}: Props) {
    const [editing, setEditing] =
        useState(false);
    const [text, setText] = useState(value);
    const [loading, setLoading] =
        useState(false);

    const handleSave = async () => {
        setLoading(true);
        await onSave(text);
        setEditing(false);
        setLoading(false);
    };

    if (editing) {
        return (
            <div>
                {textarea ? (
                    <textarea
                        className="form-control"
                        value={text}
                        onChange={(e) =>
                            setText(e.target.value)
                        }
                    />
                ) : (
                    <input
                        className="form-control"
                        value={text}
                        onChange={(e) =>
                            setText(e.target.value)
                        }
                    />
                )}

                <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={handleSave}
                    disabled={loading}
                >
                    Save
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={() => setEditing(true)}
            style={{ cursor: "pointer" }}
        >
            {value}
        </div>
    );
}
