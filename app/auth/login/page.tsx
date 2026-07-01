import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-semibold mb-1">TA Tool</h1>
        <p className="text-gray-400 text-sm mb-6">Crossian Talent Acquisition</p>
        <form action={async () => { 'use server'; await signIn('google') }}>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Sign in with Google
          </button>
        </form>
        <p className="text-xs text-gray-300 mt-4">@crossian.com accounts only</p>
      </div>
    </div>
  )
}
