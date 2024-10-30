'use client';

import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/auth-js";


const SignInWith = (props: { provider: Provider }) => {
    const supabase = createClient();

    const handleSignIn = async (provider: Provider) => {
        const { error } = await supabase.auth.signInWithOAuth({provider: provider})
        if (error) console.error('Error: ', error.message)
    }

    return (
        <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => handleSignIn("google")}>Google</button>
    )
}

export {
    SignInWith
}