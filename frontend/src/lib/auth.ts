const API = import.meta.env.VITE_API_URL

type LoginInput = {
    username: string
    password: string
}

type RegisterInput = {
    name: string
    email: string
    password: string
}

export async function login(data: LoginInput) {
    const body = new URLSearchParams()

    body.append("grant_type", "password")
    body.append("username", data.username)
    body.append("password", data.password)

    const res = await fetch(`${API}/auth/jwt/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        credentials: "include",
        body,
    })

    if (!res.ok) {
        console.log(await res.text())
        throw new Error("Invalid credentials")
    }
    console.log('Login status : ', res.status);

    return true
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