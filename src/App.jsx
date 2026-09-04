import { useState, useEffect, useCallback } from "react";
import Home from "./screens/Home";
import AddChandha from "./screens/AddChandha";
import ChandhaList from "./screens/ChandhaList";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [screen, setScreen] = useState("home"); // "home" | "add" | "list"
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chandhas")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) setEntries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  if (screen === "home") {
    return (
      <Home
        onAdd={() => setScreen("add")}
        onViewList={() => setScreen("list")}
      />
    );
  }

  if (screen === "add") {
    return (
      <AddChandha
        onHome={() => setScreen("home")}
        onViewList={() => setScreen("list")}
        onAdded={() => {
          fetchEntries();
          setScreen("list");
        }}
        entryCount={entries.length}
      />
    );
  }

  return (
    <ChandhaList
      entries={entries}
      loading={loading}
      onHome={() => setScreen("home")}
      onAdd={() => setScreen("add")}
    />
  );
}
