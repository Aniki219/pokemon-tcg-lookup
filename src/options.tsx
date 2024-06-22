import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Options = () => {
    const [apiKey, setAPIKey] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        // Restores select box and checkbox state using the preferences
        // stored in chrome.storage.
        chrome.storage.sync.get(
            "apiKey",
            (data) => {
                setAPIKey(data.apiKey);
            }
        );
    }, []);

    const saveOptions = () => {
        // Saves options to chrome.storage.sync.
        chrome.storage.sync.set(
            {
                apiKey: apiKey,
            },
            () => {
                // Update status to let user know options were saved.
                setStatus("API Key saved.");
                const id = setTimeout(() => {
                    setStatus("");
                }, 1000);
                return () => clearTimeout(id);
            }
        );
    };

    return (
        <>
            <div>
                <label>
                    <input
                        type="text"
                        onChange={(event) => setAPIKey(event.target.value)}
                    />
                    API Key
                </label>
            </div>
            <div>{status}</div>
            <button onClick={saveOptions}>Save</button>
        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>
);
