import { createSignal, createEffect, For } from "solid-js";
import { useAuth } from "./AuthProvider";
import { supabase } from "./supabase";

export default function Pregled() {
    const session = useAuth();
    const [navike, setNavike] = createSignal([]);
    const [completed, setCompleted] = createSignal({});

    createEffect(async () => {
        await loadNavike();
    });

    async function loadNavike() {
        if (session()) {
            const { data, error } = await supabase
                .from("navike")
                .select("*")
                .eq("author_id", session().user.id);
            if (!error) {
                setNavike(data);
                const initialCompleted = data.reduce((acc, item) => {
                    acc[item.id] = false;
                    return acc;
                }, {});
                setCompleted(initialCompleted);
            } else {
                console.error("Greška pri učitavanju navika: ", error.message);
                alert("Učitavanje navika nije uspjelo.");
            }
        }
    }

    async function deleteProject(projectId) {
        const { error } = await supabase
            .from("navike")
            .delete()
            .eq("id", projectId);
        if (error) {
            alert("Operacija nije uspjela.");
        } else {
            await loadNavike();
        }
    }

    function markCompleted(id) {
        setCompleted(prev => ({ ...prev, [id]: true }));
    }

    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-900">
            <div class="p-8 mt-5 mb-5 bg-gray-800 rounded-2xl shadow-lg max-w-md w-full">
                <h2 class="text-3xl font-semibold text-center text-white mb-6">Vaše navike</h2>
                <ul>
                    <For each={navike()} fallback={<div class="text-gray-400 text-center">Nema navika.</div>}>
                        {(item) => (
                            <li 
                                class="flex flex-col gap-2 items-start p-4 rounded-lg mb-4"
                                classList={{
                                    "bg-gray-700": !completed()[item.id],
                                    "bg-green-500": completed()[item.id]
                                }}
                            >
                                <div class="font-bold text-lg">{item.naziv}</div>
                                <div>{item.opis}</div>
                                <div class="flex gap-2 mt-2">
                                    <button 
                                        class="bg-red-500 text-white p-2 rounded text-sm"
                                        onClick={() => deleteProject(item.id)}
                                    >
                                        Briši
                                    </button>
                                    <button 
                                        class="bg-blue-500 text-white p-2 rounded text-sm"
                                        onClick={() => markCompleted(item.id)}
                                    >
                                        Dovršeno
                                    </button>
                                </div>
                            </li>
                        )}
                    </For>
                </ul>
                <a href="/Home">
                    <button class="bg-red-600 text-white p-3 rounded-lg w-full hover:bg-red-700 transition duration-300 mt-4">
                        Vrati se na početnu
                    </button>
                </a>
            </div>
        </div>
    );
}