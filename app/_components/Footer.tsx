"use client";
import { HeartPulseIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-t border-blue-100 dark:border-blue-900 z-10">
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-right order-2 md:order-1">
            <div className="flex items-center justify-center md:justify-end gap-2 text-blue-700 dark:text-blue-300 mb-2">
              <span className="font-bold">نظام المرضى</span>
              <HeartPulseIcon className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              منصة متكاملة لإدارة المرضى والمواعيد الطبية
            </p>
          </div>

          <div className="flex gap-6 order-1 md:order-2">
            <div className="text-right">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                المساعدة
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    الأسئلة الشائعة
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    اتصل بنا
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    الدعم الفني
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-right">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                روابط سريعة
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    عن النظام
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    خدماتنا
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-blue-100 dark:border-blue-900 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} نظام المرضى - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
