// app/api/contact/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // الكود يقرأ رابط موقع ووردبريس تلقائياً من ملف .env.local
  const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  // تم استخدام المعرّف الرقمي الصحيح الذي وجدته
  const CONTACT_FORM_ID = "968"; 

  // يتم التحقق من وجود الرابط في ملف .env.local
  if (!WORDPRESS_API_URL) {
    console.error('خطأ فادح: المتغير NEXT_PUBLIC_WORDPRESS_URL غير موجود في ملف .env.local');
    return NextResponse.json(
      { success: false, error: 'خطأ في إعدادات الخادم.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    
    // بناء الرابط الصحيح لواجهة برمجة التطبيقات الخاصة بـ Contact Form 7
    const endpoint = `${WORDPRESS_API_URL}/wp-json/contact-form-7/v1/contact-forms/${CONTACT_FORM_ID}/feedback`;

    // إعادة توجيه البيانات المستلمة من النموذج إلى ووردبريس
    const wpResponse = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    // استلام الرد من ووردبريس
    const result = await wpResponse.json();

    // التحقق مما إذا كان ووردبريس قد أرسل البريد بنجاح
    if (result.status === 'mail_sent') {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      // في حال وجود خطأ من ووردبريس، يتم إظهاره
      console.error('خطأ من ووردبريس:', result.message);
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('خطأ في مسار الواجهة البرمجية:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع.' },
      { status: 500 }
    );
  }
}