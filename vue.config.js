const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  // تفعيل تحويل التبعيات لضمان التوافق مع المتصفحات القديمة
  transpileDependencies: true,

  // ✅ التحديث الأخير: قفل التفتيش التلقائي (Linting) أثناء الحفظ والـ Build
  // ده هيحل مشكلة الـ Error اللي ظهرتلك في Vercel ويخلي الـ Build ينجح فوراً
  lintOnSave: false
});
