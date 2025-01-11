"use client";

import { NoteType } from "@cosmic-dolphin/api";
import { MouseEvent, useEffect, useState } from "react";

const ToggleButtonGroup = () => {
    const [selected, setSelected] = useState<NoteType>(NoteType.Chatter);

    const handleSelect = (e: MouseEvent, value: NoteType) => {
        e.preventDefault();
        setSelected(value);
    };

    return (
        <div className="flex gap-2">
            <input hidden type="text" name="type" onChange={() => {}} value={selected} />
            {[NoteType.Chatter, NoteType.Knowledge].map((type) => (
                <button
                    key={type}
                    onClick={(e) => handleSelect(e, type)}
                    className={`px-4 py-2 rounded ${selected === type ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                >
                    {type}
                </button>
            ))}
        </div>
    );
};

export default ToggleButtonGroup;
