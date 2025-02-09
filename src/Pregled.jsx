import { createSignal, createEffect, For } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "./AuthProvider";
import { supabase } from "./supabase";

export default function Pregled() {
    const session = useAuth();
    const [navike, setNavike] = createSignal([]);

    // Učitavanje navika
    createEffect(async () => {
        await loadNavike();
    });

    // Funkcija za učitavanje navika
    async function loadNavike() {
        if (session()) {
            const { data, error } = await supabase
                .from("navike")
                .select("*")
                .eq("author_id", session().user.id);
            if (!error) {
                setNavike(data);
            }
            else {
                console.error("Greška pri učitavanju navika: ", error.message);
                alert("Učitavanje navika nije uspjelo.");
                return;
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

    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-900">
            <div class="p-8 mt-5 mb-5 bg-gray-800 rounded-2xl shadow-lg max-w-md w-full">
                <h2 class="text-3xl font-semibold text-center text-white mb-6">Vaše navike</h2>
                <ul>
                    <Show when={session() && navike()}>
                        <For each={navike()} fallback={<div class="text-gray-400 text-center">Nema navika.</div>}>
                            {(item) => (
                                <li class="flex flex-col gap-2 items-start bg-gray-700 text-white p-4 rounded-lg mb-4">
                                    <div class="font-bold text-lg">{item.naziv}</div>
                                    <div>{item.opis}</div>
                                    <button class="bg-red-500 text-white p-2 rounded text-sm" onClick={() => deleteProject(item.id)}>Briši</button>
                                </li>
                            )}
                        </For>
                    </Show>
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
