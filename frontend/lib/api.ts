const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

async function request(path: string, opts: RequestInit = {}) {
  const url = path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...opts,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed ${res.status}: ${text}`)
  }
  return res.json()
}

export const api = {
  get: (p: string) => request(p, { method: "GET" }),
  post: (p: string, body: any) => request(p, { method: "POST", body: JSON.stringify(body) }),
  put: (p: string, body: any) => request(p, { method: "PUT", body: JSON.stringify(body) }),
  del: (p: string) => request(p, { method: "DELETE" }),
}

export default api
