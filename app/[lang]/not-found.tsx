'use client'

// صفحة خطأ بسيطة لا تستخدم أي مكونات تفاعلية
export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">الصفحة غير موجودة</h2>
        <p className="text-zinc-400">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
        </p>
      </div>
    </div>
  )
}