import { createSignal } from "solid-js";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "@solidjs/router"; 
import SignOut from "./SignOut";

export default function Home(props) {
    const session = useAuth(); 
    const [showSignOut, setShowSignOut] = createSignal(false); 
    const navigate = useNavigate(); 

    const handleSignOutClick = () => {
        setShowSignOut(true);
    };

    const redirectToHome = () => {
        navigate("/"); 
    };

    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-800">
            <div class="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                <h1 class="text-3xl font-semibold text-center mb-4 text-white">Praćenje navika</h1>
                {session() ? (
                    <div class="text-center">
                        <p class="text-lg text-gray-400 mb-4">Dobrodošli, <span class="font-bold">{session().user.email}</span>!</p>
                        <div class="flex flex-col gap-4">
                            <a href="/Navike">
                                <button className="bg-yellow-500 text-black p-3 rounded-lg w-full hover:bg-yellow-600 transition duration-300">
                                    Stvori naviku
                                </button>
                            </a>
                            <a href="/Pregled">
                                <button className="bg-yellow-500 text-black p-3 rounded-lg w-full hover:bg-yellow-600 transition duration-300">
                                    Pregled navika
                                </button>
                            </a>
                        </div>
                        <button
                            onClick={handleSignOutClick}
                            class="bg-red-500 text-white p-2 rounded-lg w-full hover:bg-red-600 transition duration-300 mt-4">
                            Odjavi se
                        </button>
                        {showSignOut() && <SignOut />}
                    </div>
                ) : (
                    <div class="text-center">
                        <p class="text-gray-500 mb-4">Uspješno ste se odjavili!</p>
                        <button
                            onClick={redirectToHome}
                            class="bg-yellow-500 text-black p-2 rounded-lg w-full hover:bg-yellow-600 transition duration-300">
                            Vratite se na registaciju
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
