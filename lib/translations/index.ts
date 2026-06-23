export type Lang = 'en' | 'ar'

const en = {
  // Nav
  nav_products: 'Products', nav_brands: 'Brands', nav_cart: 'Cart',
  nav_orders: 'My Orders', nav_profile: 'Profile', nav_signin: 'Sign In',
  nav_register: 'Register', nav_signout: 'Sign Out', nav_admin: 'Admin',
  nav_salesman: 'Sales Portal', nav_search: 'Search products, brands...',
  // Home
  home_badge: 'Premium Automotive Products',
  home_title1: 'Professional Car Care', home_title2: 'Products for Saudi', home_title3: 'Market',
  home_desc: 'Browse our full catalogue of detailing chemicals, PPF tools, accessories, and more from world-class brands.',
  home_browse: 'Browse Catalogue', home_account: 'Create Account',
  home_brands_label: 'Premium Brands', home_certified: 'Certified Products', home_delivery: 'KSA Delivery',
  home_categories: 'Shop by Category', home_all: 'All Products',
  home_featured: 'Featured Products', home_view_all: 'View All',
  home_our_brands: 'Our Brands',
  home_cta_title: 'Ready to order?', home_cta_desc: 'Create a free account and start browsing our catalogue.',
  home_started: 'Get Started',
  // Products
  products_title: 'All Products', products_search: 'Search by name, code...',
  products_filters: 'Filters', products_brands: 'Brands', products_cats: 'Categories',
  products_all_brands: 'All Brands', products_all_cats: 'All Categories',
  products_count: 'products', products_none: 'No products found',
  products_none_desc: 'Try adjusting your filters or search.',
  products_rfq: 'Price on Request', products_featured: 'Featured',
  // Product detail
  prod_code: 'Code', prod_packing: 'Packing', prod_dilution: 'Dilution',
  prod_moq: 'Min. Order', prod_units: 'units', prod_about: 'About this product',
  prod_usage: 'How to use', prod_add: 'Add to Cart', prod_added: 'Added ✓',
  prod_related: 'More from', prod_in_stock: 'In Stock', prod_out: 'Out of Stock', prod_limited: 'Limited',
  // Cart
  cart_title: 'Order Request', cart_items: 'items', cart_empty: 'Your cart is empty',
  cart_empty_desc: 'Browse our catalogue and add products.',
  cart_browse: 'Browse Products', cart_notes: 'Order Notes (optional)',
  cart_notes_ph: 'Special requirements, delivery preferences...',
  cart_summary: 'Order Summary', cart_estimated: 'Estimated Total',
  cart_pending: 'Pricing confirmed in quotation',
  cart_submit: 'Submit Order Request', cart_disclaimer: 'A salesman will contact you to confirm.',
  cart_clear: 'Clear Cart',
  // Orders
  orders_title: 'My Orders', orders_none: 'No orders yet',
  orders_none_desc: 'Submit your first order from the catalogue.',
  orders_browse: 'Browse Products', orders_view: 'View details',
  // Auth
  auth_welcome: 'Welcome back', auth_sub: 'Sign in to your account',
  auth_email: 'Email', auth_password: 'Password', auth_signin: 'Sign In',
  auth_no_account: "Don't have an account?", auth_register: 'Register',
  auth_create: 'Create your account', auth_create_sub: 'Join ROCA CONNECT',
  auth_name: 'Full Name', auth_company: 'Company', auth_phone: 'Phone', auth_city: 'City',
  auth_confirm: 'Confirm Password', auth_create_btn: 'Create Account',
  auth_have: 'Already have an account?', auth_signin_link: 'Sign In',
  auth_success: 'Account created!', auth_success_desc: 'Check your email to confirm.',
  auth_go: 'Go to Sign In',
  // Admin
  admin_dash: 'Dashboard', admin_orders: 'Orders', admin_products: 'Products',
  admin_brands: 'Brands', admin_cats: 'Categories', admin_customers: 'Customers',
  admin_store: 'Back to Store', admin_signout: 'Sign Out',
  admin_total_orders: 'Total Orders', admin_revenue: 'Revenue', admin_customers_label: 'Customers',
  admin_pending: 'Pending Review',
  // Status
  status_new: 'New Order', status_review: 'Under Review', status_confirmed: 'Confirmed',
  status_quote: 'Quotation Sent', status_payment: 'Payment Pending',
  status_dispatch: 'Ready for Delivery', status_delivered: 'Delivered', status_cancelled: 'Cancelled',
  // Brands
  brands_title: 'Our Brands', brands_sub: 'World-class automotive care brands',
  brands_browse: 'Browse Products →',
}

const ar: typeof en = {
  nav_products: 'المنتجات', nav_brands: 'العلامات', nav_cart: 'السلة',
  nav_orders: 'طلباتي', nav_profile: 'الملف الشخصي', nav_signin: 'تسجيل الدخول',
  nav_register: 'إنشاء حساب', nav_signout: 'تسجيل الخروج', nav_admin: 'الإدارة',
  nav_salesman: 'بوابة المبيعات', nav_search: 'ابحث عن منتجات، علامات...',
  home_badge: 'منتجات سيارات احترافية',
  home_title1: 'منتجات عناية احترافية', home_title2: 'للسيارات في السوق', home_title3: 'السعودي',
  home_desc: 'تصفح كتالوجنا الكامل من كيماويات التنظيف والأدوات وأكسسوارات السيارات من أفضل العلامات العالمية.',
  home_browse: 'تصفح الكتالوج', home_account: 'إنشاء حساب',
  home_brands_label: 'علامات مميزة', home_certified: 'منتجات معتمدة', home_delivery: 'توصيل داخل المملكة',
  home_categories: 'تسوق حسب الفئة', home_all: 'جميع المنتجات',
  home_featured: 'منتجات مميزة', home_view_all: 'عرض الكل',
  home_our_brands: 'علاماتنا التجارية',
  home_cta_title: 'مستعد للطلب؟', home_cta_desc: 'أنشئ حسابًا مجانيًا وابدأ التسوق.',
  home_started: 'ابدأ الآن',
  products_title: 'جميع المنتجات', products_search: 'ابحث بالاسم أو الكود...',
  products_filters: 'الفلاتر', products_brands: 'العلامات', products_cats: 'الفئات',
  products_all_brands: 'جميع العلامات', products_all_cats: 'جميع الفئات',
  products_count: 'منتج', products_none: 'لا توجد منتجات',
  products_none_desc: 'حاول تغيير الفلاتر أو البحث.',
  products_rfq: 'السعر عند الطلب', products_featured: 'مميز',
  prod_code: 'الكود', prod_packing: 'التعبئة', prod_dilution: 'التخفيف',
  prod_moq: 'الحد الأدنى', prod_units: 'وحدة', prod_about: 'عن هذا المنتج',
  prod_usage: 'طريقة الاستخدام', prod_add: 'أضف للسلة', prod_added: 'تم الإضافة ✓',
  prod_related: 'المزيد من', prod_in_stock: 'متوفر', prod_out: 'غير متوفر', prod_limited: 'كمية محدودة',
  cart_title: 'طلب الشراء', cart_items: 'منتجات', cart_empty: 'سلتك فارغة',
  cart_empty_desc: 'تصفح الكتالوج وأضف المنتجات.',
  cart_browse: 'تصفح المنتجات', cart_notes: 'ملاحظات الطلب (اختياري)',
  cart_notes_ph: 'متطلبات خاصة، تفضيلات التوصيل...',
  cart_summary: 'ملخص الطلب', cart_estimated: 'الإجمالي التقديري',
  cart_pending: 'سيتم تأكيد الأسعار في عرض السعر',
  cart_submit: 'إرسال طلب الشراء', cart_disclaimer: 'سيتواصل معك مندوب لتأكيد الطلب.',
  cart_clear: 'إفراغ السلة',
  orders_title: 'طلباتي', orders_none: 'لا توجد طلبات بعد',
  orders_none_desc: 'قدم طلبك الأول من الكتالوج.',
  orders_browse: 'تصفح المنتجات', orders_view: 'عرض التفاصيل',
  auth_welcome: 'مرحبًا بك', auth_sub: 'سجل دخولك إلى حسابك',
  auth_email: 'البريد الإلكتروني', auth_password: 'كلمة المرور', auth_signin: 'تسجيل الدخول',
  auth_no_account: 'ليس لديك حساب؟', auth_register: 'إنشاء حساب',
  auth_create: 'إنشاء حسابك', auth_create_sub: 'انضم إلى روكا كونكت',
  auth_name: 'الاسم الكامل', auth_company: 'الشركة', auth_phone: 'الهاتف', auth_city: 'المدينة',
  auth_confirm: 'تأكيد كلمة المرور', auth_create_btn: 'إنشاء حساب',
  auth_have: 'لديك حساب بالفعل؟', auth_signin_link: 'تسجيل الدخول',
  auth_success: 'تم إنشاء الحساب!', auth_success_desc: 'تحقق من بريدك الإلكتروني للتأكيد.',
  auth_go: 'الذهاب لتسجيل الدخول',
  admin_dash: 'لوحة التحكم', admin_orders: 'الطلبات', admin_products: 'المنتجات',
  admin_brands: 'العلامات', admin_cats: 'الفئات', admin_customers: 'العملاء',
  admin_store: 'العودة للمتجر', admin_signout: 'تسجيل الخروج',
  admin_total_orders: 'إجمالي الطلبات', admin_revenue: 'الإيرادات', admin_customers_label: 'العملاء',
  admin_pending: 'قيد المراجعة',
  status_new: 'طلب جديد', status_review: 'قيد المراجعة', status_confirmed: 'مؤكد',
  status_quote: 'تم إرسال العرض', status_payment: 'في انتظار الدفع',
  status_dispatch: 'جاهز للتوصيل', status_delivered: 'تم التوصيل', status_cancelled: 'ملغي',
  brands_title: 'علاماتنا التجارية', brands_sub: 'علامات عناية السيارات العالمية',
  brands_browse: 'تصفح المنتجات ←',
}

export const translations = { en, ar }
export type TranslationKey = keyof typeof en

// Convert dotted camelCase keys like 'auth.signIn' → 'auth_sign_in' → try 'auth_signin'
function normalizeKey(key: string): string {
  if (!key.includes('.')) return key
  const [prefix, rest] = key.split('.', 2)
  const snake = rest.replace(/([A-Z])/g, '_$1').toLowerCase()
  return `${prefix}_${snake}`
}

export function t(lang: Lang, key: string): string {
  const k = key as TranslationKey
  const nk = normalizeKey(key) as TranslationKey
  return (
    translations[lang][k] ??
    translations[lang][nk] ??
    translations.en[k] ??
    translations.en[nk] ??
    key
  )
}
