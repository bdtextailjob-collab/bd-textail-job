import { useState } from 'react'

// =====================================================
// বাংলাদেশের বিভাগ ও জেলা ডেটা
// =====================================================
const divisions = {
  'ঢাকা': ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল', 'কিশোরগঞ্জ', 'মানিকগঞ্জ', 'মুন্সিগঞ্জ', 'নরসিংদী', 'ফরিদপুর', 'গোপালগঞ্জ', 'মাদারীপুর', 'রাজবাড়ী', 'শরীয়তপুর'],
  'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার', 'কুমিল্লা', 'ব্রাহ্মণবাড়িয়া', 'চাঁদপুর', 'ফেনী', 'লক্ষ্মীপুর', 'নোয়াখালী', 'বান্দরবান', 'খাগড়াছড়ি', 'রাঙ্গামাটি'],
  'রাজশাহী': ['রাজশাহী', 'বগুড়া', 'পাবনা', 'সিরাজগঞ্জ', 'নাটোর', 'নওগাঁ', 'চাঁপাইনবাবগঞ্জ', 'জয়পুরহাট'],
  'খুলনা': ['খুলনা', 'বাগেরহাট', 'সাতক্ষীরা', 'যশোর', 'ঝিনাইদহ', 'মাগুরা', 'নড়াইল', 'কুষ্টিয়া', 'চুয়াডাঙ্গা', 'মেহেরপুর'],
  'বরিশাল': ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'],
  'সিলেট': ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],
  'রংপুর': ['রংপুর', 'দিনাজপুর', 'ঠাকুরগাঁও', 'পঞ্চগড়', 'নীলফামারী', 'লালমনিরহাট', 'কুড়িগ্রাম', 'গাইবান্ধা'],
  'ময়মনসিংহ': ['ময়মনসিংহ', 'জামালপুর', 'নেত্রকোণা', 'শেরপুর']
}

// =====================================================
// জেলা অনুযায়ী থানা ডেটা
// =====================================================
const thanasByDistrict = {
  'ঢাকা': ['ধানমন্ডি', 'মোহাম্মদপুর', 'মিরপুর', 'উত্তরা', 'গুলশান', 'বনানী', 'তেজগাঁও', 'রামপুরা', 'মুগদা', 'যাত্রাবাড়ী', 'ডেমরা', 'কদমতলী', 'শ্যামপুর', 'লালবাগ', 'কোতোয়ালি', 'সূত্রাপুর', 'পল্টন', 'নিউমার্কেট', 'ধামরাই', 'সাভার', 'দোহার', 'নবাবগঞ্জ', 'কেরানীগঞ্জ'],
  'গাজীপুর': ['গাজীপুর সদর', 'টঙ্গী', 'কালিয়াকৈর', 'কাপাসিয়া', 'শ্রীপুর', 'কালীগঞ্জ'],
  'নারায়ণগঞ্জ': ['নারায়ণগঞ্জ সদর', 'বন্দর', 'আড়াইহাজার', 'সোনারগাঁও', 'রূপগঞ্জ', 'ফতুল্লা', 'সিদ্ধিরগঞ্জ'],
  'টাঙ্গাইল': ['টাঙ্গাইল সদর', 'সখীপুর', 'বাসাইল', 'মধুপুর', 'ঘাটাইল', 'কালিহাতী', 'নাগরপুর', 'মির্জাপুর', 'গোপালপুর', 'ভূঞাপুর', 'দেলদুয়ার', 'ধনবাড়ী'],
  'কিশোরগঞ্জ': ['কিশোরগঞ্জ সদর', 'ভৈরব', 'বাজিতপুর', 'কটিয়াদী', 'করিমগঞ্জ', 'তাড়াইল', 'হোসেনপুর', 'পাকুন্দিয়া', 'কুলিয়ারচর', 'ইটনা', 'মিঠামইন', 'অষ্টগ্রাম', 'নিকলী'],
  'মানিকগঞ্জ': ['মানিকগঞ্জ সদর', 'সাটুরিয়া', 'শিবালয়', 'ঘিওর', 'দৌলতপুর', 'সিংগাইর', 'হরিরামপুর'],
  'মুন্সিগঞ্জ': ['মুন্সিগঞ্জ সদর', 'শ্রীনগর', 'সিরাজদিখান', 'লৌহজং', 'গজারিয়া', 'টংগীবাড়ী'],
  'নরসিংদী': ['নরসিংদী সদর', 'পলাশ', 'শিবপুর', 'রায়পুরা', 'মনোহরদী', 'বেলাবো'],
  'ফরিদপুর': ['ফরিদপুর সদর', 'বোয়ালমারী', 'আলফাডাঙ্গা', 'মধুখালী', 'ভাঙ্গা', 'নগরকান্দা', 'চরভদ্রাসন', 'সদরপুর', 'সালথা'],
  'গোপালগঞ্জ': ['গোপালগঞ্জ সদর', 'টুঙ্গিপাড়া', 'কাশিয়ানী', 'কোটালীপাড়া', 'মুকসুদপুর'],
  'মাদারীপুর': ['মাদারীপুর সদর', 'শিবচর', 'কালকিনি', 'রাজৈর', 'ডাসার'],
  'রাজবাড়ী': ['রাজবাড়ী সদর', 'গোয়ালন্দ', 'পাংশা', 'বালিয়াকান্দি', 'কালুখালী'],
  'শরীয়তপুর': ['শরীয়তপুর সদর', 'নড়িয়া', 'জাজিরা', 'ভেদরগঞ্জ', 'ডামুড্যা', 'গোসাইরহাট'],

  'চট্টগ্রাম': ['কোতোয়ালি', 'পাহাড়তলী', 'ডবলমুরিং', 'হালিশহর', 'বন্দর', 'পতেঙ্গা', 'চান্দগাঁও', 'পাঁচলাইশ', 'বায়েজিদ', 'খুলশী', 'আকবরশাহ', 'সীতাকুণ্ড', 'মীরসরাই', 'সন্দ্বীপ', 'হাটহাজারী', 'রাউজান', 'রাঙ্গুনিয়া', 'পটিয়া', 'আনোয়ারা', 'বোয়ালখালী', 'চন্দনাইশ', 'লোহাগাড়া', 'সাতকানিয়া', 'বাঁশখালী', 'ফটিকছড়ি'],
  'কক্সবাজার': ['কক্সবাজার সদর', 'চকরিয়া', 'টেকনাফ', 'উখিয়া', 'রামু', 'মহেশখালী', 'কুতুবদিয়া', 'পেকুয়া'],
  'কুমিল্লা': ['কুমিল্লা সদর', 'দেবিদ্বার', 'বরুড়া', 'ব্রাহ্মণপাড়া', 'চান্দিনা', 'চৌদ্দগ্রাম', 'দাউদকান্দি', 'হোমনা', 'লাকসাম', 'মনোহরগঞ্জ', 'মেঘনা', 'মুরাদনগর', 'নাঙ্গলকোট', 'তিতাস', 'বুড়িচং', 'লালমাই'],
  'ব্রাহ্মণবাড়িয়া': ['ব্রাহ্মণবাড়িয়া সদর', 'আশুগঞ্জ', 'নাসিরনগর', 'নবীনগর', 'বাঞ্ছারামপুর', 'সরাইল', 'কসবা', 'আখাউড়া', 'বিজয়নগর'],
  'চাঁদপুর': ['চাঁদপুর সদর', 'হাজীগঞ্জ', 'ফরিদগঞ্জ', 'কচুয়া', 'শাহরাস্তি', 'মতলব উত্তর', 'মতলব দক্ষিণ', 'হাইমচর'],
  'ফেনী': ['ফেনী সদর', 'ছাগলনাইয়া', 'দাগনভূঞা', 'সোনাগাজী', 'পরশুরাম', 'ফুলগাজী'],
  'লক্ষ্মীপুর': ['লক্ষ্মীপুর সদর', 'রায়পুর', 'রামগঞ্জ', 'রামগতি', 'কমলনগর'],
  'নোয়াখালী': ['নোয়াখালী সদর', 'বেগমগঞ্জ', 'চাটখিল', 'কোম্পানীগঞ্জ', 'সেনবাগ', 'সোনাইমুড়ী', 'হাতিয়া', 'সুবর্ণচর', 'কবিরহাট'],
  'বান্দরবান': ['বান্দরবান সদর', 'আলীকদম', 'নাইক্ষ্যংছড়ি', 'রুমা', 'রোয়াংছড়ি', 'লামা', 'থানচি'],
  'খাগড়াছড়ি': ['খাগড়াছড়ি সদর', 'দীঘিনালা', 'পানছড়ি', 'লক্ষ্মীছড়ি', 'মহালছড়ি', 'মানিকছড়ি', 'মাটিরাঙ্গা', 'রামগড়', 'গুইমারা'],
  'রাঙ্গামাটি': ['রাঙ্গামাটি সদর', 'কাপ্তাই', 'কাউখালী', 'বাঘাইছড়ি', 'বরকল', 'লংগদু', 'রাজস্থলী', 'জুরাছড়ি', 'নানিয়ারচর', 'বিলাইছড়ি'],

  'রাজশাহী': ['বোয়ালিয়া', 'রাজপাড়া', 'মতিহার', 'শাহমখদুম', 'পবা', 'গোদাগাড়ী', 'তানোর', 'মোহনপুর', 'বাগমারা', 'দুর্গাপুর', 'পুঠিয়া', 'চারঘাট', 'বাঘা'],
  'বগুড়া': ['বগুড়া সদর', 'শেরপুর', 'ধুনট', 'গাবতলী', 'কাহালু', 'নন্দীগ্রাম', 'সারিয়াকান্দি', 'শাজাহানপুর', 'শিবগঞ্জ', 'সোনাতলা', 'দুপচাঁচিয়া', 'আদমদীঘি'],
  'পাবনা': ['পাবনা সদর', 'ঈশ্বরদী', 'ভাঙ্গুড়া', 'চাটমোহর', 'ফরিদপুর', 'সাঁথিয়া', 'সুজানগর', 'আটঘরিয়া', 'বেড়া'],
  'সিরাজগঞ্জ': ['সিরাজগঞ্জ সদর', 'বেলকুচি', 'চৌহালী', 'কামারখন্দ', 'কাজীপুর', 'রায়গঞ্জ', 'শাহজাদপুর', 'তাড়াশ', 'উল্লাপাড়া'],
  'নাটোর': ['নাটোর সদর', 'বাগাতিপাড়া', 'বড়াইগ্রাম', 'গুরুদাসপুর', 'লালপুর', 'সিংড়া', 'নলডাঙ্গা'],
  'নওগাঁ': ['নওগাঁ সদর', 'আত্রাই', 'বদলগাছী', 'ধামইরহাট', 'মান্দা', 'মহাদেবপুর', 'নিয়ামতপুর', 'পত্নীতলা', 'পোরশা', 'রাণীনগর', 'সাপাহার'],
  'চাঁপাইনবাবগঞ্জ': ['চাঁপাইনবাবগঞ্জ সদর', 'শিবগঞ্জ', 'গোমস্তাপুর', 'নাচোল', 'ভোলাহাট'],
  'জয়পুরহাট': ['জয়পুরহাট সদর', 'আক্কেলপুর', 'কালাই', 'ক্ষেতলাল', 'পাঁচবিবি'],

  'খুলনা': ['খালিশপুর', 'সোনাডাঙ্গা', 'দৌলতপুর', 'খানজাহান আলী', 'লবণচরা', 'বটিয়াঘাটা', 'দাকোপ', 'ডুমুরিয়া', 'দিঘলিয়া', 'কয়রা', 'পাইকগাছা', 'ফুলতলা', 'রূপসা', 'তেরখাদা'],
  'বাগেরহাট': ['বাগেরহাট সদর', 'মোংলা', 'মোড়েলগঞ্জ', 'শরণখোলা', 'রামপাল', 'ফকিরহাট', 'চিতলমারী', 'কচুয়া', 'মোল্লাহাট'],
  'সাতক্ষীরা': ['সাতক্ষীরা সদর', 'আশাশুনি', 'দেবহাটা', 'কালীগঞ্জ', 'কলারোয়া', 'শ্যামনগর', 'তালা'],
  'যশোর': ['যশোর সদর', 'অভয়নগর', 'বাঘারপাড়া', 'চৌগাছা', 'ঝিকরগাছা', 'কেশবপুর', 'মণিরামপুর', 'শার্শা'],
  'ঝিনাইদহ': ['ঝিনাইদহ সদর', 'কালীগঞ্জ', 'কোটচাঁদপুর', 'মহেশপুর', 'শৈলকুপা', 'হরিণাকুণ্ডু'],
  'মাগুরা': ['মাগুরা সদর', 'শ্রীপুর', 'শালিখা', 'মোহাম্মদপুর'],
  'নড়াইল': ['নড়াইল সদর', 'লোহাগড়া', 'কালিয়া'],
  'কুষ্টিয়া': ['কুষ্টিয়া সদর', 'কুমারখালী', 'খোকসা', 'মিরপুর', 'ভেড়ামারা', 'দৌলতপুর'],
  'চুয়াডাঙ্গা': ['চুয়াডাঙ্গা সদর', 'আলমডাঙ্গা', 'দামুড়হুদা', 'জীবননগর'],
  'মেহেরপুর': ['মেহেরপুর সদর', 'গাংনী', 'মুজিবনগর'],

  'বরিশাল': ['বরিশাল সদর', 'বাকেরগঞ্জ', 'বানারীপাড়া', 'গৌরনদী', 'হিজলা', 'মেহেন্দিগঞ্জ', 'মুলাদী', 'উজিরপুর', 'আগৈলঝাড়া', 'গলাচিপা'],
  'পটুয়াখালী': ['পটুয়াখালী সদর', 'বাউফল', 'দশমিনা', 'গলাচিপা', 'কলাপাড়া', 'মির্জাগঞ্জ', 'রাঙ্গাবালী', 'দুমকি'],
  'ভোলা': ['ভোলা সদর', 'বোরহানউদ্দিন', 'চরফ্যাশন', 'দৌলতখান', 'লালমোহন', 'মনপুরা', 'তজুমদ্দিন'],
  'পিরোজপুর': ['পিরোজপুর সদর', 'ভান্ডারিয়া', 'কাউখালী', 'মঠবাড়িয়া', 'নাজিরপুর', 'নেছারাবাদ', 'ইন্দুরকানী'],
  'বরগুনা': ['বরগুনা সদর', 'আমতলী', 'বামনা', 'বেতাগী', 'পাথরঘাটা', 'তালতলী'],
  'ঝালকাঠি': ['ঝালকাঠি সদর', 'কাঠালিয়া', 'নলছিটি', 'রাজাপুর'],

  'সিলেট': ['সিলেট সদর', 'বিয়ানীবাজার', 'বিশ্বনাথ', 'বালাগঞ্জ', 'কোম্পানীগঞ্জ', 'ফেঞ্চুগঞ্জ', 'গোলাপগঞ্জ', 'গোয়াইনঘাট', 'জৈন্তাপুর', 'কানাইঘাট', 'জকিগঞ্জ', 'দক্ষিণ সুরমা', 'ওসমানীনগর'],
  'মৌলভীবাজার': ['মৌলভীবাজার সদর', 'বড়লেখা', 'কমলগঞ্জ', 'কুলাউড়া', 'রাজনগর', 'শ্রীমঙ্গল', 'জুড়ী'],
  'হবিগঞ্জ': ['হবিগঞ্জ সদর', 'আজমিরীগঞ্জ', 'বানিয়াচং', 'বাহুবল', 'চুনারুঘাট', 'লাখাই', 'মাধবপুর', 'নবীগঞ্জ', 'শায়েস্তাগঞ্জ'],
  'সুনামগঞ্জ': ['সুনামগঞ্জ সদর', 'বিশ্বম্ভরপুর', 'ছাতক', 'দিরাই', 'ধর্মপাশা', 'দোয়ারাবাজার', 'জগন্নাথপুর', 'জামালগঞ্জ', 'শাল্লা', 'তাহিরপুর', 'মধ্যনগর'],

  'রংপুর': ['রংপুর সদর', 'বদরগঞ্জ', 'গঙ্গাচড়া', 'কাউনিয়া', 'মিঠাপুকুর', 'পীরগঞ্জ', 'পীরগাছা', 'তারাগঞ্জ'],
  'দিনাজপুর': ['দিনাজপুর সদর', 'বিরামপুর', 'বীরগঞ্জ', 'বোচাগঞ্জ', 'চিরিরবন্দর', 'ফুলবাড়ী', 'ঘোড়াঘাট', 'হাকিমপুর', 'কাহারোল', 'খানসামা', 'নবাবগঞ্জ', 'পার্বতীপুর', 'বিরল'],
  'ঠাকুরগাঁও': ['ঠাকুরগাঁও সদর', 'বালিয়াডাঙ্গী', 'হরিপুর', 'পীরগঞ্জ', 'রাণীশংকৈল'],
  'পঞ্চগড়': ['পঞ্চগড় সদর', 'আটোয়ারী', 'বোদা', 'দেবীগঞ্জ', 'তেঁতুলিয়া'],
  'নীলফামারী': ['নীলফামারী সদর', 'ডোমার', 'ডিমলা', 'জলঢাকা', 'কিশোরগঞ্জ', 'সৈয়দপুর'],
  'লালমনিরহাট': ['লালমনিরহাট সদর', 'আদিতমারী', 'কালীগঞ্জ', 'হাতীবান্ধা', 'পাটগ্রাম'],
  'কুড়িগ্রাম': ['কুড়িগ্রাম সদর', 'উলিপুর', 'চিলমারী', 'ফুলবাড়ী', 'নাগেশ্বরী', 'ভুরুঙ্গামারী', 'রাজারহাট', 'রৌমারী', 'চর রাজিবপুর'],
  'গাইবান্ধা': ['গাইবান্ধা সদর', 'গোবিন্দগঞ্জ', 'পলাশবাড়ী', 'সাদুল্লাপুর', 'সাঘাটা', 'ফুলছড়ি', 'সুন্দরগঞ্জ'],

  'ময়মনসিংহ': ['ময়মনসিংহ সদর', 'ত্রিশাল', 'ভালুকা', 'মুক্তাগাছা', 'ফুলবাড়িয়া', 'গফরগাঁও', 'ঈশ্বরগঞ্জ', 'নান্দাইল', 'তারাকান্দা', 'ধোবাউড়া', 'ফুলপুর', 'হালুয়াঘাট', 'গৌরীপুর'],
  'জামালপুর': ['জামালপুর সদর', 'মেলান্দহ', 'ইসলামপুর', 'দেওয়ানগঞ্জ', 'সরিষাবাড়ী', 'মাদারগঞ্জ', 'বকশীগঞ্জ'],
  'নেত্রকোণা': ['নেত্রকোণা সদর', 'আটপাড়া', 'বারহাট্টা', 'দুর্গাপুর', 'কলমাকান্দা', 'কেন্দুয়া', 'মদন', 'মোহনগঞ্জ', 'পূর্বধলা', 'খালিয়াজুরী'],
  'শেরপুর': ['শেরপুর সদর', 'নালিতাবাড়ী', 'নকলা', 'শ্রীবরদী', 'ঝিনাইগাতী']
}

// =====================================================
// শিক্ষাগত যোগ্যতার তালিকা (ক্রম অনুযায়ী)
// =====================================================
const educationLevels = [
  'PSC',
  'JSC',
  'SSC',
  'HSC',
  'ডিপ্লোমা',
  'স্নাতক (Graduation)',
  'স্নাতকোত্তর (Masters)',
  'শিক্ষাগত যোগ্যতা নাই'
]

// =====================================================
// পাশের সালের তালিকা (১৯৮০ - ২০৫০)
// =====================================================
const passingYears = []
for (let year = 1980; year <= 2050; year++) {
  passingYears.push(year)
}

// =====================================================
// মূল কম্পোনেন্ট
// =====================================================
function UserRegisterForm({ onClose }) {
  // বর্তমান ধাপ (1, 2, 3, 4)
  const [currentStep, setCurrentStep] = useState(1)

  // ---------- Step 1 ডেটা ----------
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    division: '',
    district: '',
    thana: '',
    village: ''
  })

  // ---------- Step 2 ডেটা ----------
  const [education, setEducation] = useState({
    level: '',
    institution: '',
    passingYear: ''
  })

  // ---------- Step 2 ছবি (সর্বোচ্চ ৩টি) ----------
  const [certificates, setCertificates] = useState([])  // { file, preview } এর array

  // থানা সার্চের জন্য
  const [thanaSearch, setThanaSearch] = useState('')
  const [showThanaDropdown, setShowThanaDropdown] = useState(false)

  // এরর বার্তা
  const [errors, setErrors] = useState({})

  // ---------- Step 1: ইনপুট পরিবর্তন ----------
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    if (field === 'division') {
      setFormData((prev) => ({ ...prev, division: value, district: '', thana: '' }))
    }
    if (field === 'district') {
      setFormData((prev) => ({ ...prev, district: value, thana: '' }))
      setThanaSearch('')
    }
  }

  // ---------- Step 1: উপলব্ধ জেলা ও থানা ----------
  const availableDistricts = formData.division ? divisions[formData.division] || [] : []
  const availableThanas = formData.district ? thanasByDistrict[formData.district] || [] : []

  const filteredThanas = thanaSearch.trim()
    ? availableThanas.filter((t) => t.includes(thanaSearch.trim()))
    : availableThanas

  const handleSelectThana = (thana) => {
    setFormData((prev) => ({ ...prev, thana }))
    setThanaSearch(thana)
    setShowThanaDropdown(false)
    if (errors.thana) setErrors((prev) => ({ ...prev, thana: '' }))
  }

  // ---------- Step 2: শিক্ষাগত যোগ্যতা ----------
  const handleEducationChange = (field, value) => {
    setEducation((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    // যদি "শিক্ষাগত যোগ্যতা নাই" সিলেক্ট করে → ছবি সব মুছে দাও
    if (field === 'level' && value === 'শিক্ষাগত যোগ্যতা নাই') {
      setCertificates([])
    }
  }

  // ---------- Step 2: ছবি আপলোড ----------
  const handleAddCertificate = (file) => {
    if (!file) return

    // ফাইল টাইপ যাচাই
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('শুধু JPG, PNG অথবা PDF ফাইল আপলোড করতে পারবেন।')
      return
    }

    // ফাইল সাইজ যাচাই (সর্বোচ্চ ৫ MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ফাইলের সাইজ সর্বোচ্চ ৫ MB হতে পারবে।')
      return
    }

    // সর্বোচ্চ ৩টি ছবি
    if (certificates.length >= 3) {
      alert('সর্বোচ্চ ৩টি সার্টিফিকেট আপলোড করা যাবে।')
      return
    }

    // প্রিভিউ URL তৈরি
    const reader = new FileReader()
    reader.onloadend = () => {
      setCertificates((prev) => [
        ...prev,
        { file, preview: reader.result, name: file.name }
      ])
      if (errors.certificates) {
        setErrors((prev) => ({ ...prev, certificates: '' }))
      }
    }
    reader.readAsDataURL(file)
  }

  // ---------- Step 2: ছবি মুছে ফেলা ----------
  const handleRemoveCertificate = (index) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index))
  }

  // ---------- Step 1 → Step 2 ----------
  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'আপনার নাম লিখুন'
    if (!formData.fatherName.trim()) newErrors.fatherName = 'বাবার নাম লিখুন'
    if (!formData.motherName.trim()) newErrors.motherName = 'মায়ের নাম লিখুন'
    if (!formData.division) newErrors.division = 'বিভাগ নির্বাচন করুন'
    if (!formData.district) newErrors.district = 'জেলা নির্বাচন করুন'
    if (!formData.thana) newErrors.thana = 'থানা নির্বাচন করুন'
    if (!formData.village.trim()) newErrors.village = 'গ্রামের নাম লিখুন'
    return newErrors
  }

  const handleNextFromStep1 = () => {
    const newErrors = validateStep1()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstError = Object.keys(newErrors)[0]
      const el = document.getElementById(`field-${firstError}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setErrors({})
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- Step 2 → Step 1 ----------
  const handleBackFromStep2 = () => {
    setErrors({})
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- Step 2 → Step 3 ----------
  const handleNextFromStep2 = () => {
    const newErrors = {}

    // শিক্ষাগত যোগ্যতা বাধ্যতামূলক
    if (!education.level) {
      newErrors.level = 'শিক্ষাগত যোগ্যতা নির্বাচন করুন'
    }

    // যদি "শিক্ষাগত যোগ্যতা নাই" না হয় → বাকি সব বাধ্যতামূলক
    if (education.level && education.level !== 'শিক্ষাগত যোগ্যতা নাই') {
      if (!education.institution.trim()) {
        newErrors.institution = 'প্রতিষ্ঠানের নাম লিখুন'
      }
      if (!education.passingYear) {
        newErrors.passingYear = 'পাশের সাল নির্বাচন করুন'
      }
      if (certificates.length === 0) {
        newErrors.certificates = 'শিক্ষাগত যোগ্যতার সার্টিফিকেট আপলোড করুন'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstError = Object.keys(newErrors)[0]
      const el = document.getElementById(`field-${firstError}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // সব ঠিক — Step 3-এ যাওয়ার জন্য
    alert('Step 2 সম্পন্ন! Step 3 পরের সাব-স্টেপে যুক্ত হবে।')
    // setCurrentStep(3)  ← পরের ধাপে চালু করব
  }

  // =====================================================
  // রেন্ডার
  // =====================================================
  return (
    <div style={styles.wrapper}>
      {/* ---------- হেডার ---------- */}
      <div style={styles.header}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="বন্ধ">
          ✕
        </button>
        <div style={styles.headerContent}>
          <h2 style={styles.headerTitle}>নতুন অ্যাকাউন্ট</h2>
          <p style={styles.headerSubtitle}>সাধারণ ইউজার রেজিস্ট্রেশন</p>
        </div>
      </div>

      {/* ---------- প্রগ্রেস বার ---------- */}
      <div style={styles.progressWrapper}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: currentStep === 1 ? '25%' : '50%'
            }}
          ></div>
        </div>
        <p style={styles.progressText}>
          {currentStep === 1 && 'ধাপ ১ / ৪ — ব্যক্তিগত তথ্য'}
          {currentStep === 2 && 'ধাপ ২ / ৪ — শিক্ষাগত যোগ্যতা'}
        </p>
      </div>

      {/* ================================================= */}
      {/* Step 1: ব্যক্তিগত তথ্য */}
      {/* ================================================= */}
      {currentStep === 1 && (
        <div style={styles.body}>
          {/* নাম */}
          <div style={styles.field} id="field-name">
            <label style={styles.label}>
              আপনার নাম <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              placeholder="যেমন: মোহাম্মদ রফিকুল ইসলাম"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          {/* বাবার নাম */}
          <div style={styles.field} id="field-fatherName">
            <label style={styles.label}>
              বাবার নাম <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              style={{ ...styles.input, ...(errors.fatherName ? styles.inputError : {}) }}
              placeholder="বাবার পূর্ণ নাম লিখুন"
              value={formData.fatherName}
              onChange={(e) => handleChange('fatherName', e.target.value)}
            />
            {errors.fatherName && <p style={styles.errorText}>{errors.fatherName}</p>}
          </div>

          {/* মায়ের নাম */}
          <div style={styles.field} id="field-motherName">
            <label style={styles.label}>
              মায়ের নাম <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              style={{ ...styles.input, ...(errors.motherName ? styles.inputError : {}) }}
              placeholder="মায়ের পূর্ণ নাম লিখুন"
              value={formData.motherName}
              onChange={(e) => handleChange('motherName', e.target.value)}
            />
            {errors.motherName && <p style={styles.errorText}>{errors.motherName}</p>}
          </div>

          {/* বিভাগ */}
          <div style={styles.field} id="field-division">
            <label style={styles.label}>
              বিভাগ <span style={styles.required}>*</span>
            </label>
            <select
              style={{ ...styles.input, ...styles.select, ...(errors.division ? styles.inputError : {}) }}
              value={formData.division}
              onChange={(e) => handleChange('division', e.target.value)}
            >
              <option value="">— বিভাগ নির্বাচন করুন —</option>
              {Object.keys(divisions).map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
            {errors.division && <p style={styles.errorText}>{errors.division}</p>}
          </div>

          {/* জেলা */}
          <div style={styles.field} id="field-district">
            <label style={styles.label}>
              জেলা <span style={styles.required}>*</span>
            </label>
            <select
              style={{
                ...styles.input,
                ...styles.select,
                ...(errors.district ? styles.inputError : {}),
                ...(availableDistricts.length === 0 ? styles.inputDisabled : {})
              }}
              value={formData.district}
              disabled={availableDistricts.length === 0}
              onChange={(e) => handleChange('district', e.target.value)}
            >
              <option value="">
                {availableDistricts.length === 0 ? 'প্রথমে বিভাগ নির্বাচন করুন' : '— জেলা নির্বাচন করুন —'}
              </option>
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
            {errors.district && <p style={styles.errorText}>{errors.district}</p>}
          </div>

          {/* থানা */}
          <div style={styles.field} id="field-thana">
            <label style={styles.label}>
              থানা <span style={styles.required}>*</span>
            </label>
            <div style={styles.thanaWrapper}>
              <input
                type="text"
                style={{
                  ...styles.input,
                  ...(errors.thana ? styles.inputError : {}),
                  ...(availableThanas.length === 0 ? styles.inputDisabled : {})
                }}
                placeholder={
                  availableThanas.length === 0
                    ? 'প্রথমে জেলা নির্বাচন করুন'
                    : 'থানার নাম লিখুন বা সার্চ করুন...'
                }
                value={thanaSearch}
                disabled={availableThanas.length === 0}
                onChange={(e) => {
                  setThanaSearch(e.target.value)
                  setShowThanaDropdown(true)
                  if (formData.thana && e.target.value !== formData.thana) {
                    setFormData((prev) => ({ ...prev, thana: '' }))
                  }
                }}
                onFocus={() => availableThanas.length > 0 && setShowThanaDropdown(true)}
              />
              {showThanaDropdown && availableThanas.length > 0 && (
                <div style={styles.thanaDropdown}>
                  {filteredThanas.length === 0 ? (
                    <p style={styles.noResult}>কোনো থানা পাওয়া যায়নি</p>
                  ) : (
                    filteredThanas.map((thana) => (
                      <button
                        key={thana}
                        type="button"
                        style={{
                          ...styles.thanaOption,
                          ...(formData.thana === thana ? styles.thanaOptionActive : {})
                        }}
                        onClick={() => handleSelectThana(thana)}
                      >
                        {thana}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {errors.thana && <p style={styles.errorText}>{errors.thana}</p>}
          </div>

          {/* গ্রাম */}
          <div style={styles.field} id="field-village">
            <label style={styles.label}>
              গ্রাম / এলাকা <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              style={{ ...styles.input, ...(errors.village ? styles.inputError : {}) }}
              placeholder="যেমন: মধ্যপাড়া গ্রাম"
              value={formData.village}
              onChange={(e) => handleChange('village', e.target.value)}
            />
            {errors.village && <p style={styles.errorText}>{errors.village}</p>}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* Step 2: শিক্ষাগত যোগ্যতা */}
      {/* ================================================= */}
      {currentStep === 2 && (
        <div style={styles.body}>
          {/* শিক্ষাগত যোগ্যতা */}
          <div style={styles.field} id="field-level">
            <label style={styles.label}>
              শিক্ষাগত যোগ্যতা <span style={styles.required}>*</span>
            </label>
            <select
              style={{ ...styles.input, ...styles.select, ...(errors.level ? styles.inputError : {}) }}
              value={education.level}
              onChange={(e) => handleEducationChange('level', e.target.value)}
            >
              <option value="">— শিক্ষাগত যোগ্যতা নির্বাচন করুন —</option>
              {educationLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.level && <p style={styles.errorText}>{errors.level}</p>}
          </div>

          {/* শিক্ষাগত যোগ্যতা নাই হলে তথ্য বার্তা */}
          {education.level === 'শিক্ষাগত যোগ্যতা নাই' && (
            <div style={styles.infoBox}>
              <p style={styles.infoBoxText}>
                💡 আপনি "শিক্ষাগত যোগ্যতা নাই" নির্বাচন করেছেন। তাই সার্টিফিকেট তথ্য এবং ছবি আপলোড ছাড়াই পরবর্তী ধাপে যেতে পারবেন।
              </p>
            </div>
          )}

          {/* প্রতিষ্ঠানের নাম — শুধু "নাই" না হলে দেখাবে */}
          {education.level && education.level !== 'শিক্ষাগত যোগ্যতা নাই' && (
            <>
              <div style={styles.field} id="field-institution">
                <label style={styles.label}>
                  প্রতিষ্ঠানের নাম <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  style={{ ...styles.input, ...(errors.institution ? styles.inputError : {}) }}
                  placeholder="যেমন: ঢাকা পলিটেকনিক ইনস্টিটিউট"
                  value={education.institution}
                  onChange={(e) => handleEducationChange('institution', e.target.value)}
                />
                {errors.institution && <p style={styles.errorText}>{errors.institution}</p>}
              </div>

              {/* পাশের সাল */}
              <div style={styles.field} id="field-passingYear">
                <label style={styles.label}>
                  পাশের সাল <span style={styles.required}>*</span>
                </label>
                <select
                  style={{ ...styles.input, ...styles.select, ...(errors.passingYear ? styles.inputError : {}) }}
                  value={education.passingYear}
                  onChange={(e) => handleEducationChange('passingYear', e.target.value)}
                >
                  <option value="">— পাশের সাল নির্বাচন করুন —</option>
                  {passingYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.passingYear && <p style={styles.errorText}>{errors.passingYear}</p>}
              </div>

              {/* সার্টিফিকেট ছবি আপলোড */}
              <div style={styles.field} id="field-certificates">
                <label style={styles.label}>
                  শিক্ষাগত সার্টিফিকেট <span style={styles.required}>*</span>
                </label>
                <p style={styles.helperText}>
                  JPG, PNG অথবা PDF — সর্বোচ্চ ৩টি, প্রতিটি ৫ MB পর্যন্ত
                </p>

                {/* আপলোড করা ছবির প্রিভিউ */}
                {certificates.length > 0 && (
                  <div style={styles.previewGrid}>
                    {certificates.map((cert, index) => (
                      <div key={index} style={styles.previewItem}>
                        {cert.file.type === 'application/pdf' ? (
                          <div style={styles.pdfPreview}>
                            <span style={styles.pdfIcon}>📄</span>
                            <span style={styles.pdfName}>{cert.name}</span>
                          </div>
                        ) : (
                          <img
                            src={cert.preview}
                            alt={`সার্টিফিকেট ${index + 1}`}
                            style={styles.previewImage}
                          />
                        )}
                        <button
                          type="button"
                          style={styles.removeBtn}
                          onClick={() => handleRemoveCertificate(index)}
                          aria-label="মুছুন"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* + আইকন দিয়ে আপলোড বাটন */}
                {certificates.length < 3 && (
                  <label style={styles.addBtn}>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      style={styles.fileInputHidden}
                      onChange={(e) => {
                        handleAddCertificate(e.target.files[0])
                        e.target.value = ''  // একই ফাইল আবার সিলেক্টের অনুমতি
                      }}
                    />
                    <span style={styles.addIcon}>+</span>
                    <span style={styles.addText}>
                      {certificates.length === 0
                        ? 'সার্টিফিকেট আপলোড করুন'
                        : `আরও আপলোড করুন (${certificates.length}/৩)`}
                    </span>
                  </label>
                )}

                {errors.certificates && <p style={styles.errorText}>{errors.certificates}</p>}
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------- নিচের বাটন ---------- */}
      <div style={styles.footer}>
        {currentStep === 1 && (
          <button style={styles.btnNext} onClick={handleNextFromStep1}>
            পরবর্তী ধাপ →
          </button>
        )}

        {currentStep === 2 && (
          <div style={styles.footerRow}>
            <button style={styles.btnBack} onClick={handleBackFromStep2}>
              ← পূর্ববর্তী
            </button>
            <button style={styles.btnNextHalf} onClick={handleNextFromStep2}>
              পরবর্তী ধাপ →
            </button>
          </div>
        )}
      </div>

      {/* ---------- কীফ্রেম ---------- */}
      <style>{`
        @keyframes formFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// =====================================================
// স্টাইল (একই ফাইলে)
// =====================================================
const styles = {
  wrapper: {
    minHeight: '100vh',
    width: '100%',
    background: '#f5f7fa',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    animation: 'formFadeIn 0.4s ease-out',
  },

  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)',
    color: '#ffffff',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 2px 10px rgba(10, 31, 68, 0.20)',
  },

  closeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2,
    fontFamily: "'Hind Siliguri', sans-serif",
  },

  headerSubtitle: {
    fontSize: '11.5px',
    color: '#e6c267',
    margin: 0,
    marginTop: '2px',
    fontFamily: "'Hind Siliguri', sans-serif",
  },

  progressWrapper: {
    background: '#ffffff',
    padding: '14px 16px 12px',
    borderBottom: '1px solid #e2e6ee',
  },

  progressBar: {
    width: '100%',
    height: '6px',
    background: '#e2e6ee',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '8px',
  },

  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #d4a537, #e6c267)',
    borderRadius: '6px',
    transition: 'width 0.4s ease',
  },

  progressText: {
    fontSize: '12px',
    color: '#5a6472',
    margin: 0,
    textAlign: 'center',
    fontFamily: "'Hind Siliguri', sans-serif",
    fontWeight: 500,
  },

  body: {
    flex: 1,
    maxWidth: '480px',
    width: '100%',
    margin: '0 auto',
    padding: '20px 16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  label: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#0a1f44',
    fontFamily: "'Hind Siliguri', sans-serif",
  },

  required: {
    color: '#d93636',
    fontWeight: 700,
  },

  helperText: {
    fontSize: '11.5px',
    color: '#5a6472',
    margin: 0,
    marginBottom: '4px',
    fontFamily: "'Hind Siliguri', sans-serif",
  },

  input: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '12px',
    border: '1.5px solid #e2e6ee',
    background: '#ffffff',
    fontSize: '14.5px',
    color: '#1a1a1a',
    fontFamily: "'Hind Siliguri', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },

  inputError: {
    borderColor: '#d93636',
    background: '#fff5f5',
  },

  inputDisabled: {
    background: '#f0f2f6',
    color: '#8a92a2',
    cursor: 'not-allowed',
  },

  select: {
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a1f44' stroke-width='3'><polyline points='6 9 12 15 18 9'/></svg>\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
  },

  errorText: {
    fontSize: '12px',
    color: '#d93636',
    margin: 0,
    marginTop: '2px',
    fontFamily: "'Hind Siliguri', sans-serif",
    fontWeight: 500,
  },

  infoBox: {
    background: 'rgba(212, 165, 55, 0.10)',
    borderLeft: '4px solid #d4a537',
    borderRadius: '8px',
    padding: '12px 14px',
  },

  infoBoxText: {
    fontSize: '13px',
    color: '#0a1f44',
    margin: 0,
    lineHeight: 1.6,
    fontFamily: "'Hind Siliguri', sans-serif",
    fontWeight: 500,
  },

  thanaWrapper: {
    position: 'relative',
  },

  thanaDropdown: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    maxHeight: '220px',
    overflowY: 'auto',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(10, 31, 68, 0.15)',
    border: '1px solid #e2e6ee',
    zIndex: 100,
    padding: '6px',
    animation: 'dropdownIn 0.2s ease-out',
  },

  thanaOption: {
    width: '100%',
    padding: '11px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    textAlign: 'left',
    fontSize: '14px',
    color: '#1a1a1a',
    fontFamily: "'Hind Siliguri', sans-serif",
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },

  thanaOptionActive: {
    background: 'rgba(212, 165, 55, 0.15)',
    color: '#0a1f44',
    fontWeight: 600,
  },

  noResult: {
    fontSize: '13px',
    color: '#8a92a2',
    textAlign: 'center',
    padding: '14px',
    margin: 0,
    fontFamily: "'Hind Siliguri', sans-serif",
  },

  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
    gap: '10px',
    marginBottom: '12px',
  },

  previewItem: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#f0f2f6',
    border: '1.5px solid #e2e6ee',
  },

  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  pdfPreview: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    background: '#fff5e6',
    gap: '4px',
  },

  pdfIcon: {
    fontSize: '24px',
  },

  pdfName: {
    fontSize: '9px',
    color: '#5a6472',
    textAlign: 'center',
    wordBreak: 'break-all',
    fontFamily: "'Hind Siliguri', sans-serif",
    lineHeight: 1.2,
  },

  removeBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'rgba(217, 54, 54, 0.95)',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
  },

  addBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    padding: '22px 16px',
    borderRadius: '12px',
    border: '2px dashed #d4a537',
    background: 'rgba(212, 165, 55, 0.06)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  fileInputHidden: {
    display: 'none',
  },

  addIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0a1f44, #16346b)',
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(10,31,68,0.20)',
  },

  addText: {
    fontSize: '13px',
    color: '#0a1f44',
    fontWeight: 600,
    fontFamily: "'Hind Siliguri', sans-serif",
  },

  footer: {
    position: 'sticky',
    bottom: 0,
    background: '#ffffff',
    padding: '14px 16px',
    borderTop: '1px solid #e2e6ee',
    boxShadow: '0 -4px 14px rgba(10, 31, 68, 0.06)',
  },

  footerRow: {
    display: 'flex',
    gap: '10px',
    maxWidth: '480px',
    margin: '0 auto',
  },

  btnNext: {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    display: 'block',
    padding: '15px 20px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0a1f44, #16346b)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(10, 31, 68, 0.25)',
    letterSpacing: '0.3px',
  },

  btnNextHalf: {
    flex: 1,
    padding: '15px 20px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0a1f44, #16346b)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(10, 31, 68, 0.25)',
    letterSpacing: '0.3px',
  },

  btnBack: {
    flex: 1,
    padding: '15px 20px',
    borderRadius: '12px',
    background: '#ffffff',
    color: '#0a1f44',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: '2px solid #0a1f44',
    cursor: 'pointer',
    letterSpacing: '0.3px',
  },
}

export default UserRegisterForm
