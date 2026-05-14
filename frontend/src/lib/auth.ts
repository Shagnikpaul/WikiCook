const API = import.meta.env.VITE_API_URL

type LoginInput = {
    email: string
    password: string
}

type RegisterInput = {
    name: string
    email: string
    password: string
}

export async function login(data: LoginInput) {
    const res = await fetch(`${API}/auth/jwt/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error("Invalid credentials")
    }

    return res.json()
}

export async function register(data: RegisterInput) {
    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error("Registration failed")
    }

    return res.json()
}

export async function getMe() {
    const res = await fetch(`${API}/users/me`, {
        credentials: "include",
    })

    if (!res.ok) {
        return null
    }

    return res.json()
}

export async function logout() {
    await fetch(`${API}/auth/jwt/logout`, {
        method: "POST",
        credentials: "include",
    })
}