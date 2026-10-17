import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'

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
// শিক্ষাগত যোগ্যতার তালিকা
// =====================================================
const educationLevels = [
  'PSC', 'JSC', 'SSC', 'HSC', 'ডিপ্লোমা',
  'স্নাতক (Graduation)', 'স্নাতকোত্তর (Masters)',
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
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 ডেটা
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    division: '',
    district: '',
    thana: '',
    village: ''
  })

  // নিজের ছবি
  const [profileImage, setProfileImage] = useState(null)

  // Step 2 ডেটা
  const [education, setEducation] = useState({
    level: '',
    institution: '',
    passingYear: ''
  })
  const [certificates, setCertificates] = useState([])

  // Step 3 ডেটা
  const [contact, setContact] = useState({
    mobile: '',
    email: ''
  })
  const [idType, setIdType] = useState('')
  const [idImage, setIdImage] = useState(null)

  // Step 4 ডেটা (OTP)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpTimer, setOtpTimer] = useState(0)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  const [generatedOtp, setGeneratedOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [sendError, setSendError] = useState('')

  // থানা সার্চ
  const [thanaSearch, setThanaSearch] = useState('')
  const [showThanaDropdown, setShowThanaDropdown] = useState(false)

  const [errors, setErrors] = useState({})

  // ---------- নিজের ছবি হ্যান্ডলার ----------
  const handleAddProfileImage = (file) => {
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      alert('শুধু JPG অথবা PNG ফাইল আপলোড করতে পারবেন।')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ৫ MB হতে পারবে।')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage({ file, preview: reader.result, name: file.name })
      if (errors.profileImage) setErrors((prev) => ({ ...prev, profileImage: '' }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveProfileImage = () => {
    setProfileImage(null)
  }

  // ---------- ৬ সংখ্যার র্যান্ডম OTP তৈরি ----------
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // ---------- EmailJS দিয়ে OTP পাঠানো ----------
  const sendOtpEmail = async (otpCode, email, name) => {
    setSendingOtp(true)
    setSendError('')

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS সেটিংস পাওয়া যায়নি। Environment Variables ঠিকভাবে সেট করা হয়নি।')
      }

      const templateParams = {
        to_email: email,
        user_name: name || 'ব্যবহারকারী',
        otp_code: otpCode
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      setSendingOtp(false)
      return true
    } catch (err) {
      console.error('EmailJS Error:', err)
      setSendingOtp(false)
      setSendError(err?.text || err?.message || 'ইমেইল পাঠাতে সমস্যা হয়েছে।')
      return false
    }
  }

  // ---------- OTP টাইমার ----------
  useEffect(() => {
    if (otpTimer <= 0) {
      if (resendDisabled) setResendDisabled(false)
      return
    }
    const timer = setTimeout(() => {
      setOtpTimer((prev) => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [otpTimer, resendDisabled])

  // ---------- Step 1 হ্যান্ডলার ----------
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (field === 'division') {
      setFormData((prev) => ({ ...prev, division: value, district: '', thana: '' }))
    }
    if (field === 'district') {
      setFormData((prev) => ({ ...prev, district: value, thana: '' }))
      setThanaSearch('')
    }
  }

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

  // ---------- Step 2 হ্যান্ডলার ----------
  const handleEducationChange = (field, value) => {
    setEducation((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (field === 'level' && value === 'শিক্ষাগত যোগ্যতা নাই') {
      setCertificates([])
    }
  }

  const handleAddCertificate = (file) => {
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('শুধু JPG, PNG অথবা PDF ফাইল আপলোড করতে পারবেন।')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('ফাইলের সাইজ সর্বোচ্চ ৫ MB হতে পারবে।')
      return
    }
    if (certificates.length >= 3) {
      alert('সর্বোচ্চ ৩টি সার্টিফিকেট আপলোড করা যাবে।')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setCertificates((prev) => [...prev, { file, preview: reader.result, name: file.name }])
      if (errors.certificates) setErrors((prev) => ({ ...prev, certificates: '' }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveCertificate = (index) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index))
  }

  // ---------- Step 3 হ্যান্ডলার ----------
  const handleContactChange = (field, value) => {
    if (field === 'mobile') {
      value = value.replace(/\D/g, '').slice(0, 11)
    }
    setContact((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleIdTypeChange = (type) => {
    setIdType(type)
    setIdImage(null)
    if (errors.idImage) setErrors((prev) => ({ ...prev, idImage: '' }))
    if (errors.idType) setErrors((prev) => ({ ...prev, idType: '' }))
  }

  const handleAddIdImage = (file) => {
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('শুধু JPG, PNG অথবা PDF ফাইল আপলোড করতে পারবেন।')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('ফাইলের সাইজ সর্বোচ্চ ৫ MB হতে পারবে।')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setIdImage({ file, preview: reader.result, name: file.name })
      if (errors.idImage) setErrors((prev) => ({ ...prev, idImage: '' }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveIdImage = () => {
    setIdImage(null)
  }

  // ---------- Step 1 → Step 2 ----------
  const handleNextFromStep1 = () => {
    const newErrors = {}
    if (!profileImage) newErrors.profileImage = 'আপনার নিজের ছবি আপলোড করুন'
    if (!formData.name.trim()) newErrors.name = 'আপনার নাম লিখুন'
    if (!formData.fatherName.trim()) newErrors.fatherName = 'বাবার নাম লিখুন'
    if (!formData.motherName.trim()) newErrors.motherName = 'মায়ের নাম লিখুন'
    if (!formData.division) newErrors.division = 'বিভাগ নির্বাচন করুন'
    if (!formData.district) newErrors.district = 'জেলা নির্বাচন করুন'
    if (!formData.thana) newErrors.thana = 'থানা নির্বাচন করুন'
    if (!formData.village.trim()) newErrors.village = 'গ্রামের নাম লিখুন'

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
    if (!education.level) newErrors.level = 'শিক্ষাগত যোগ্যতা নির্বাচন করুন'
    if (education.level && education.level !== 'শিক্ষাগত যোগ্যতা নাই') {
      if (!education.institution.trim()) newErrors.institution = 'প্রতিষ্ঠানের নাম লিখুন'
      if (!education.passingYear) newErrors.passingYear = 'পাশের সাল নির্বাচন করুন'
      if (certificates.length === 0) newErrors.certificates = 'শিক্ষাগত যোগ্যতার সার্টিফিকেট আপলোড করুন'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstError = Object.keys(newErrors)[0]
      const el = document.getElementById(`field-${firstError}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setErrors({})
    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- Step 3 → Step 2 ----------
  const handleBackFromStep3 = () => {
    setErrors({})
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- Step 3 → Step 4 (OTP স্ক্রিন) ----------
  const goToStep4 = async () => {
    setErrors({})
    setSendError('')

    const newOtp = generateOtp()
    setGeneratedOtp(newOtp)

    setCurrentStep(4)
    setOtp(['', '', '', '', '', ''])
    setOtpVerified(false)
    setOtpTimer(60)
    setResendDisabled(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    await sendOtpEmail(newOtp, contact.email, formData.name)
  }

  // ---------- Step 3 কনফার্ম ----------
  const handleConfirmFromStep3 = () => {
    const newErrors = {}

    if (!idType) {
      newErrors.idType = 'NID অথবা জন্মনিবন্ধন যেকোনো একটি নির্বাচন করুন'
    } else if (!idImage) {
      newErrors.idImage = idType === 'nid'
        ? 'NID কার্ডের ছবি আপলোড করুন'
        : 'জন্মনিবন্ধনের ছবি আপলোড করুন'
    }

    if (!contact.mobile.trim()) {
      newErrors.mobile = 'মোবাইল নাম্বার দিন'
    } else if (!/^01[3-9]\d{8}$/.test(contact.mobile)) {
      newErrors.mobile = 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 01712345678)'
    }

    if (!contact.email.trim()) {
      newErrors.email = 'জিমেইল এড্রেস দিন'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = 'সঠিক ইমেইল এড্রেস দিন'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstError = Object.keys(newErrors)[0]
      const el = document.getElementById(`field-${firstError}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setErrors({})
    goToStep4()
  }

  // ---------- Step 4 → Step 3 ----------
  const handleBackFromStep4 = () => {
    setErrors({})
    setCurrentStep(3)
    setOtpTimer(0)
    setResendDisabled(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- OTP ইনপুট ----------
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }))
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // ---------- রিসেন্ড ----------
  const handleResendOtp = async () => {
    if (resendDisabled) return

    const newOtp = generateOtp()
    setGeneratedOtp(newOtp)

    setOtp(['', '', '', '', '', ''])
    setOtpTimer(60)
    setResendDisabled(true)
    setOtpVerified(false)
    setSendError('')

    await sendOtpEmail(newOtp, contact.email, formData.name)
  }

  // ---------- OTP ভেরিফাই ----------
  const handleVerifyOtp = () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setErrors({ otp: 'সম্পূর্ণ ৬ সংখ্যার কোড দিন' })
      return
    }
    if (code !== generatedOtp) {
      setErrors({ otp: 'ভুল কোড! আবার চেষ্টা করুন।' })
      return
    }
    setErrors({})
    setOtpVerified(true)
  }

  // =====================================================
  // রেন্ডার
  // =====================================================
  return (
    <div style={styles.wrapper}>
      {/* হেডার */}
      <div style={styles.header}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="বন্ধ">✕</button>
        <div style={styles.headerContent}>
          <h2 style={styles.headerTitle}>নতুন অ্যাকাউন্ট</h2>
          <p style={styles.headerSubtitle}>সাধারণ ইউজার রেজিস্ট্রেশন</p>
        </div>
      </div>

      {/* প্রগ্রেস বার */}
      <div style={styles.progressWrapper}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width:
                currentStep === 1 ? '25%'
                : currentStep === 2 ? '50%'
                : currentStep === 3 ? '75%'
                : '100%'
            }}
          ></div>
        </div>
        <p style={styles.progressText}>
          {currentStep === 1 && 'ধাপ ১ / ৪ — ব্যক্তিগত তথ্য'}
          {currentStep === 2 && 'ধাপ ২ / ৪ — শিক্ষাগত যোগ্যতা'}
          {currentStep === 3 && 'ধাপ ৩ / ৪ — পরিচয়পত্র ও যোগাযোগ'}
          {currentStep === 4 && 'ধাপ ৪ / ৪ — ইমেইল ভেরিফিকেশন'}
        </p>
      </div>

      {/* ================================================= */}
      {/* Step 1: ব্যক্তিগত তথ্য */}
      {/* ================================================= */}
      {currentStep === 1 && (
        <div style={styles.body}>
          {/* নিজের ছবি */}
          <div style={styles.field} id="field-profileImage">
            <label style={styles.label}>
              আপনার নিজের ছবি <span style={styles.required}>*</span>
            </label>
            <p style={styles.helperText}>JPG অথবা PNG — সর্বোচ্চ ৫ MB</p>

            <div style={styles.profileImageWrapper}>
              {profileImage ? (
                <div style={styles.profileImageContainer}>
                  <img
                    src={profileImage.preview}
                    alt="আপনার ছবি"
                    style={styles.profileImagePreview}
                  />
                  <button
                    type="button"
                    style={styles.profileImageRemoveBtn}
                    onClick={handleRemoveProfileImage}
                    aria-label="ছবি মুছুন"
                  >✕</button>
                </div>
              ) : (
                <label style={styles.profileImageAddBtn}>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    style={styles.fileInputHidden}
                    onChange={(e) => {
                      handleAddProfileImage(e.target.files[0])
                      e.target.value = ''
                    }}
                  />
                  <span style={styles.profileImageIcon}>+</span>
                  <span style={styles.profileImageText}>ছবি আপলোড করুন</span>
                </label>
              )}
            </div>
            {errors.profileImage && <p style={styles.errorText}>{errors.profileImage}</p>}
          </div>

          <div style={styles.field} id="field-name">
            <label style={styles.label}>আপনার নাম <span style={styles.required}>*</span></label>
            <input
              type="text"
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              placeholder="যেমন: মোহাম্মদ রফিকুল ইসলাম"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          <div style={styles.field} id="field-fatherName">
            <label style={styles.label}>বাবার নাম <span style={styles.required}>*</span></label>
            <input
              type="text"
              style={{ ...styles.input, ...(errors.fatherName ? styles.inputError : {}) }}
              placeholder="বাবার পূর্ণ নাম লিখুন"
              value={formData.fatherName}
              onChange={(e) => handleChange('fatherName', e.target.value)}
            />
            {errors.fatherName && <p style={styles.errorText}>{errors.fatherName}</p>}
          </div>

          <div style={styles.field} id="field-motherName">
            <label style={styles.label}>মায়ের নাম <span style={styles.required}>*</span></label>
            <input
              type="text"
              style={{ ...styles.input, ...(errors.motherName ? styles.inputError : {}) }}
              placeholder="মায়ের পূর্ণ নাম লিখুন"
              value={formData.motherName}
              onChange={(e) => handleChange('motherName', e.target.value)}
            />
            {errors.motherName && <p style={styles.errorText}>{errors.motherName}</p>}
          </div>

          <div style={styles.field} id="field-division">
            <label style={styles.label}>বিভাগ <span style={styles.required}>*</span></label>
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

          <div style={styles.field} id="field-district">
            <label style={styles.label}>জেলা <span style={styles.required}>*</span></label>
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

          <div style={styles.field} id="field-thana">
            <label style={styles.label}>থানা <span style={styles.required}>*</span></label>
            <div style={styles.thanaWrapper}>
              <input
                type="text"
                style={{
                  ...styles.input,
                  ...(errors.thana ? styles.inputError : {}),
                  ...(availableThanas.length === 0 ? styles.inputDisabled : {})
                }}
                placeholder={availableThanas.length === 0 ? 'প্রথমে জেলা নির্বাচন করুন' : 'থানার নাম লিখুন বা সার্চ করুন...'}
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

          <div style={styles.field} id="field-village">
            <label style={styles.label}>গ্রাম / এলাকা <span style={styles.required}>*</span></label>
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
          <div style={styles.field} id="field-level">
            <label style={styles.label}>শিক্ষাগত যোগ্যতা <span style={styles.required}>*</span></label>
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

          {education.level === 'শিক্ষাগত যোগ্যতা নাই' && (
            <div style={styles.infoBox}>
              <p style={styles.infoBoxText}>
                💡 আপনি "শিক্ষাগত যোগ্যতা নাই" নির্বাচন করেছেন। তাই সার্টিফিকেট তথ্য এবং ছবি আপলোড ছাড়াই পরবর্তী ধাপে যেতে পারবেন।
              </p>
            </div>
          )}

          {education.level && education.level !== 'শিক্ষাগত যোগ্যতা নাই' && (
            <>
              <div style={styles.field} id="field-institution">
                <label style={styles.label}>প্রতিষ্ঠানের নাম <span style={styles.required}>*</span></label>
                <input
                  type="text"
                  style={{ ...styles.input, ...(errors.institution ? styles.inputError : {}) }}
                  placeholder="যেমন: ঢাকা পলিটেকনিক ইনস্টিটিউট"
                  value={education.institution}
                  onChange={(e) => handleEducationChange('institution', e.target.value)}
                />
                {errors.institution && <p style={styles.errorText}>{errors.institution}</p>}
              </div>

              <div style={styles.field} id="field-passingYear">
                <label style={styles.label}>পাশের সাল <span style={styles.required}>*</span></label>
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

              <div style={styles.field} id="field-certificates">
                <label style={styles.label}>শিক্ষাগত সার্টিফিকেট <span style={styles.required}>*</span></label>
                <p style={styles.helperText}>JPG, PNG অথবা PDF — সর্বোচ্চ ৩টি, প্রতিটি ৫ MB পর্যন্ত</p>

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
                          <img src={cert.preview} alt={`সার্টিফিকেট ${index + 1}`} style={styles.previewImage} />
                        )}
                        <button
                          type="button"
                          style={styles.removeBtn}
                          onClick={() => handleRemoveCertificate(index)}
                          aria-label="মুছুন"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {certificates.length < 3 && (
                  <label style={styles.addBtn}>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      style={styles.fileInputHidden}
                      onChange={(e) => {
                        handleAddCertificate(e.target.files[0])
                        e.target.value = ''
                      }}
                    />
                    <span style={styles.addIcon}>+</span>
                    <span style={styles.addText}>
                      {certificates.length === 0 ? 'সার্টিফিকেট আপলোড করুন' : `আরও আপলোড করুন (${certificates.length}/৩)`}
                    </span>
                  </label>
                )}

                {errors.certificates && <p style={styles.errorText}>{errors.certificates}</p>}
              </div>
            </>
          )}
        </div>
      )}

      {/* ================================================= */}
      {/* Step 3: পরিচয়পত্র ও যোগাযোগ */}
      {/* ================================================= */}
      {currentStep === 3 && (
        <div style={styles.body}>
          <div style={styles.field} id="field-idType">
            <label style={styles.label}>পরিচয়পত্র <span style={styles.required}>*</span></label>
            <p style={styles.helperText}>NID কার্ড অথবা জন্মনিবন্ধন — যেকোনো একটি নির্বাচন করুন</p>

            <div style={styles.idTypeRow}>
              <button
                type="button"
                style={{ ...styles.idTypeBtn, ...(idType === 'nid' ? styles.idTypeBtnActive : {}) }}
                onClick={() => handleIdTypeChange('nid')}
              >
                <span style={styles.idTypeIcon}>🪪</span>
                <span style={styles.idTypeLabel}>NID কার্ড</span>
              </button>

              <button
                type="button"
                style={{ ...styles.idTypeBtn, ...(idType === 'birth' ? styles.idTypeBtnActive : {}) }}
                onClick={() => handleIdTypeChange('birth')}
              >
                <span style={styles.idTypeIcon}>📜</span>
                <span style={styles.idTypeLabel}>জন্মনিবন্ধন</span>
              </button>
            </div>
            {errors.idType && <p style={styles.errorText}>{errors.idType}</p>}
          </div>

          {idType && (
            <div style={styles.field} id="field-idImage">
              <label style={styles.label}>
                {idType === 'nid' ? 'NID কার্ডের ছবি' : 'জন্মনিবন্ধনের ছবি'}{' '}
                <span style={styles.required}>*</span>
              </label>
              <p style={styles.helperText}>JPG, PNG অথবা PDF — সর্বোচ্চ ৫ MB</p>

              {idImage ? (
                <div style={styles.singlePreviewWrapper}>
                  {idImage.file.type === 'application/pdf' ? (
                    <div style={styles.pdfPreviewLarge}>
                      <span style={styles.pdfIconLarge}>📄</span>
                      <span style={styles.pdfNameLarge}>{idImage.name}</span>
                    </div>
                  ) : (
                    <img src={idImage.preview} alt="পরিচয়পত্র" style={styles.singlePreviewImage} />
                  )}
                  <button
                    type="button"
                    style={styles.removeBtnLarge}
                    onClick={handleRemoveIdImage}
                    aria-label="মুছুন"
                  >✕</button>
                </div>
              ) : (
                <label style={styles.addBtn}>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    style={styles.fileInputHidden}
                    onChange={(e) => {
                      handleAddIdImage(e.target.files[0])
                      e.target.value = ''
                    }}
                  />
                  <span style={styles.addIcon}>+</span>
                  <span style={styles.addText}>
                    {idType === 'nid' ? 'NID কার্ড আপলোড করুন' : 'জন্মনিবন্ধন আপলোড করুন'}
                  </span>
                </label>
              )}

              {errors.idImage && <p style={styles.errorText}>{errors.idImage}</p>}
            </div>
          )}

          <div style={styles.field} id="field-mobile">
            <label style={styles.label}>মোবাইল নাম্বার <span style={styles.required}>*</span></label>
            <input
              type="tel"
              inputMode="numeric"
              style={{ ...styles.input, ...(errors.mobile ? styles.inputError : {}) }}
              placeholder="যেমন: 01712345678"
              value={contact.mobile}
              onChange={(e) => handleContactChange('mobile', e.target.value)}
            />
            <p style={styles.helperText}>আপনার একটি সচল মোবাইল নাম্বার দিন (১১ ডিজিট)</p>
            {errors.mobile && <p style={styles.errorText}>{errors.mobile}</p>}
          </div>

          <div style={styles.field} id="field-email">
            <label style={styles.label}>জিমেইল এড্রেস <span style={styles.required}>*</span></label>
            <input
              type="email"
              inputMode="email"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              placeholder="যেমন: example@gmail.com"
              value={contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
            />
            <p style={styles.helperText}>আপনার একটি সচল জিমেইল দিন (এখানেই ভেরিফিকেশন কোড পাঠানো হবে)</p>
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* Step 4: OTP ভেরিফিকেশন */}
      {/* ================================================= */}
      {currentStep === 4 && (
        <div style={styles.body}>
          <div style={styles.otpSuccessIcon}>
            <span style={styles.otpSuccessIconText}>✉️</span>
          </div>

          <div style={styles.otpMessageBox}>
            <h3 style={styles.otpMessageTitle}>আপনার জিমেইলে কোড পাঠানো হয়েছে</h3>
            <p style={styles.otpMessageText}>
              আমরা <strong style={styles.otpMessageEmail}>{contact.email}</strong> ঠিকানায় ৬ সংখ্যার একটি ভেরিফিকেশন কোড পাঠিয়েছি।
            </p>

            {sendingOtp && (
              <p style={styles.otpMessageHint}>⏳ ইমেইল পাঠানো হচ্ছে...</p>
            )}
            {!sendingOtp && sendError && (
              <p style={styles.otpMessageError}>⚠️ {sendError}</p>
            )}
            {!sendingOtp && !sendError && (
              <p style={styles.otpMessageHint}>
                ✓ জিমেইল চেক করে কোডটি লিখুন। স্প্যাম ফোল্ডারেও দেখুন।
              </p>
            )}
          </div>

          <div style={styles.field} id="field-otp">
            <label style={styles.label}>ভেরিফিকেশন কোড লিখুন <span style={styles.required}>*</span></label>
            <div style={styles.otpRow}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  style={{
                    ...styles.otpInput,
                    ...(errors.otp ? styles.otpInputError : {}),
                    ...(digit ? styles.otpInputFilled : {})
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={otpVerified}
                />
              ))}
            </div>
            {errors.otp && <p style={styles.errorText}>{errors.otp}</p>}
          </div>

          <div style={styles.otpTimerRow}>
            {!resendDisabled ? (
              <button
                type="button"
                style={styles.resendBtn}
                onClick={handleResendOtp}
                disabled={sendingOtp}
              >
                🔄 কোড পুনরায় পাঠান
              </button>
            ) : (
              <p style={styles.otpTimerText}>
                পুনরায় পাঠাতে অপেক্ষা করুন: <strong>{otpTimer} সেকেন্ড</strong>
              </p>
            )}
          </div>

          {otpVerified && (
            <div style={styles.verifiedBox}>
              <div style={styles.verifiedIcon}>✓</div>
              <div>
                <p style={styles.verifiedTitle}>সফলভাবে ভেরিফিকেশন সম্পন্ন!</p>
                <p style={styles.verifiedText}>
                  আপনার অ্যাকাউন্ট তৈরি প্রায় সম্পন্ন। পরের ধাপে আমরা Supabase-এ তথ্য সংরক্ষণ করব।
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------- নিচের বাটন ---------- */}
      <div style={styles.footer}>
        {currentStep === 1 && (
          <button style={styles.btnNext} onClick={handleNextFromStep1}>পরবর্তী ধাপ →</button>
        )}

        {currentStep === 2 && (
          <div style={styles.footerRow}>
            <button style={styles.btnBack} onClick={handleBackFromStep2}>← পূর্ববর্তী</button>
            <button style={styles.btnNextHalf} onClick={handleNextFromStep2}>পরবর্তী ধাপ →</button>
          </div>
        )}

        {currentStep === 3 && (
          <div style={styles.footerRow}>
            <button style={styles.btnBack} onClick={handleBackFromStep3}>← পূর্ববর্তী</button>
            <button style={styles.btnConfirm} onClick={handleConfirmFromStep3}>কনফার্ম করুন</button>
          </div>
        )}

        {currentStep === 4 && (
          <div style={styles.footerRow}>
            {!otpVerified && (
              <>
                <button style={styles.btnBack} onClick={handleBackFromStep4}>← পূর্ববর্তী</button>
                <button style={styles.btnConfirm} onClick={handleVerifyOtp}>ভেরিফাই করুন</button>
              </>
            )}
            {otpVerified && (
              <button
                style={styles.btnNext}
                onClick={() => alert('অ্যাকাউন্ট সংরক্ষণ পরের ধাপে যুক্ত হবে (Supabase)।')}
              >
                অ্যাকাউন্ট তৈরি সম্পন্ন করুন →
              </button>
            )}
          </div>
        )}
      </div>

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
    position: 'sticky', top: 0, zIndex: 50,
    background: 'linear-gradient(135deg, #0a1f44 0%, #16346b 100%)',
    color: '#ffffff', padding: '14px 16px',
    display: 'flex', alignItems: 'center', gap: '12px',
    boxShadow: '0 2px 10px rgba(10, 31, 68, 0.20)',
  },
  closeBtn: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)', color: '#ffffff',
    fontSize: '16px', fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
  },
  headerContent: { flex: 1 },
  headerTitle: {
    fontSize: '16px', fontWeight: 700, color: '#ffffff',
    margin: 0, lineHeight: 1.2, fontFamily: "'Hind Siliguri', sans-serif",
  },
  headerSubtitle: {
    fontSize: '11.5px', color: '#e6c267', margin: 0, marginTop: '2px',
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  progressWrapper: {
    background: '#ffffff', padding: '14px 16px 12px',
    borderBottom: '1px solid #e2e6ee',
  },
  progressBar: {
    width: '100%', height: '6px', background: '#e2e6ee',
    borderRadius: '6px', overflow: 'hidden', marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #d4a537, #e6c267)',
    borderRadius: '6px', transition: 'width 0.4s ease',
  },
  progressText: {
    fontSize: '12px', color: '#5a6472', margin: 0, textAlign: 'center',
    fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 500,
  },
  body: {
    flex: 1, maxWidth: '480px', width: '100%',
    margin: '0 auto', padding: '20px 16px 24px',
    display: 'flex', flexDirection: 'column', gap: '18px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '13.5px', fontWeight: 600, color: '#0a1f44',
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  required: { color: '#d93636', fontWeight: 700 },
  helperText: {
    fontSize: '11.5px', color: '#5a6472', margin: 0, marginBottom: '4px',
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  input: {
    width: '100%', padding: '13px 14px', borderRadius: '12px',
    border: '1.5px solid #e2e6ee', background: '#ffffff',
    fontSize: '14.5px', color: '#1a1a1a',
    fontFamily: "'Hind Siliguri', sans-serif", outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  inputError: { borderColor: '#d93636', background: '#fff5f5' },
  inputDisabled: {
    background: '#f0f2f6', color: '#8a92a2', cursor: 'not-allowed',
  },
  select: {
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a1f44' stroke-width='3'><polyline points='6 9 12 15 18 9'/></svg>\")",
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
    paddingRight: '36px',
  },
  errorText: {
    fontSize: '12px', color: '#d93636', margin: 0, marginTop: '2px',
    fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 500,
  },
  infoBox: {
    background: 'rgba(212, 165, 55, 0.10)',
    borderLeft: '4px solid #d4a537',
    borderRadius: '8px', padding: '12px 14px',
  },
  infoBoxText: {
    fontSize: '13px', color: '#0a1f44', margin: 0, lineHeight: 1.6,
    fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 500,
  },

  // ---------- নিজের ছবি স্টাইল ----------
  profileImageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '6px',
    marginBottom: '4px',
  },
  profileImageContainer: {
    position: 'relative',
    width: '130px',
    height: '130px',
  },
  profileImagePreview: {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #d4a537',
    boxShadow: '0 6px 18px rgba(212, 165, 55, 0.35)',
    display: 'block',
  },
  profileImageRemoveBtn: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(217, 54, 54, 0.95)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid #ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.30)',
  },
  profileImageAddBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    border: '3px dashed #d4a537',
    background: 'rgba(212, 165, 55, 0.06)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  profileImageIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0a1f44, #16346b)',
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(10,31,68,0.20)',
  },
  profileImageText: {
    fontSize: '11px',
    color: '#0a1f44',
    fontWeight: 600,
    fontFamily: "'Hind Siliguri', sans-serif",
    textAlign: 'center',
    padding: '0 6px',
  },

  thanaWrapper: { position: 'relative' },
  thanaDropdown: {
    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
    maxHeight: '220px', overflowY: 'auto', background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(10, 31, 68, 0.15)',
    border: '1px solid #e2e6ee', zIndex: 100, padding: '6px',
    animation: 'dropdownIn 0.2s ease-out',
  },
  thanaOption: {
    width: '100%', padding: '11px 12px', background: 'transparent',
    border: 'none', borderRadius: '8px', textAlign: 'left',
    fontSize: '14px', color: '#1a1a1a',
    fontFamily: "'Hind Siliguri', sans-serif",
    cursor: 'pointer', transition: 'background 0.15s ease',
  },
  thanaOptionActive: {
    background: 'rgba(212, 165, 55, 0.15)', color: '#0a1f44', fontWeight: 600,
  },
  noResult: {
    fontSize: '13px', color: '#8a92a2', textAlign: 'center',
    padding: '14px', margin: 0, fontFamily: "'Hind Siliguri', sans-serif",
  },
  previewGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
    gap: '10px', marginBottom: '12px',
  },
  previewItem: {
    position: 'relative', width: '100%', aspectRatio: '1 / 1',
    borderRadius: '12px', overflow: 'hidden',
    background: '#f0f2f6', border: '1.5px solid #e2e6ee',
  },
  previewImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  pdfPreview: {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '6px', background: '#fff5e6', gap: '4px',
  },
  pdfIcon: { fontSize: '24px' },
  pdfName: {
    fontSize: '9px', color: '#5a6472', textAlign: 'center',
    wordBreak: 'break-all', fontFamily: "'Hind Siliguri', sans-serif",
    lineHeight: 1.2,
  },
  singlePreviewWrapper: {
    position: 'relative', width: '100%', maxWidth: '260px',
    aspectRatio: '16 / 10', borderRadius: '12px',
    overflow: 'hidden', background: '#f0f2f6',
    border: '1.5px solid #e2e6ee',
  },
  singlePreviewImage: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },
  pdfPreviewLarge: {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#fff5e6', gap: '8px', padding: '10px',
  },
  pdfIconLarge: { fontSize: '36px' },
  pdfNameLarge: {
    fontSize: '11px', color: '#5a6472', textAlign: 'center',
    wordBreak: 'break-all', fontFamily: "'Hind Siliguri', sans-serif",
  },
  removeBtn: {
    position: 'absolute', top: '4px', right: '4px',
    width: '22px', height: '22px', borderRadius: '50%',
    background: 'rgba(217, 54, 54, 0.95)', color: '#ffffff',
    fontSize: '11px', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', border: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
  },
  removeBtnLarge: {
    position: 'absolute', top: '8px', right: '8px',
    width: '28px', height: '28px', borderRadius: '50%',
    background: 'rgba(217, 54, 54, 0.95)', color: '#ffffff',
    fontSize: '13px', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.30)',
  },
  addBtn: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '6px', width: '100%', padding: '22px 16px',
    borderRadius: '12px', border: '2px dashed #d4a537',
    background: 'rgba(212, 165, 55, 0.06)',
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  fileInputHidden: { display: 'none' },
  addIcon: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #0a1f44, #16346b)',
    color: '#ffffff', fontSize: '22px', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(10,31,68,0.20)',
  },
  addText: {
    fontSize: '13px', color: '#0a1f44', fontWeight: 600,
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  idTypeRow: {
    display: 'flex', gap: '10px', marginTop: '4px',
  },
  idTypeBtn: {
    flex: 1, padding: '14px 10px', borderRadius: '12px',
    border: '2px solid #e2e6ee', background: '#ffffff',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '6px', cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  idTypeBtnActive: {
    borderColor: '#d4a537',
    background: 'rgba(212, 165, 55, 0.08)',
    boxShadow: '0 4px 12px rgba(212, 165, 55, 0.20)',
  },
  idTypeIcon: { fontSize: '24px' },
  idTypeLabel: {
    fontSize: '13px', fontWeight: 600, color: '#0a1f44',
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  otpSuccessIcon: {
    width: '90px', height: '90px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4a537, #e6c267)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '8px auto 4px',
    boxShadow: '0 8px 24px rgba(212, 165, 55, 0.35)',
  },
  otpSuccessIconText: { fontSize: '42px' },
  otpMessageBox: {
    background: '#ffffff', borderRadius: '16px',
    padding: '20px 18px', textAlign: 'center',
    boxShadow: '0 4px 14px rgba(10, 31, 68, 0.08)',
    borderTop: '4px solid #d4a537',
  },
  otpMessageTitle: {
    fontSize: '16px', fontWeight: 700, color: '#0a1f44',
    margin: 0, marginBottom: '10px', lineHeight: 1.4,
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  otpMessageText: {
    fontSize: '13.5px', color: '#3a4152',
    margin: 0, marginBottom: '10px', lineHeight: 1.7,
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  otpMessageEmail: {
    color: '#0a1f44', fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
    wordBreak: 'break-all',
  },
  otpMessageHint: {
    fontSize: '12px', color: '#8a6a1f',
    background: 'rgba(212, 165, 55, 0.12)',
    padding: '8px 10px', borderRadius: '8px',
    margin: 0, lineHeight: 1.5,
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  otpMessageError: {
    fontSize: '12px', color: '#b3261e',
    background: 'rgba(217, 54, 54, 0.10)',
    padding: '8px 10px', borderRadius: '8px',
    margin: 0, lineHeight: 1.5,
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  otpRow: {
    display: 'flex', gap: '8px', justifyContent: 'space-between',
    marginTop: '6px',
  },
  otpInput: {
    flex: 1, minWidth: 0,
    aspectRatio: '1 / 1',
    maxWidth: '60px',
    textAlign: 'center',
    fontSize: '22px', fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
    color: '#0a1f44',
    borderRadius: '12px',
    border: '2px solid #e2e6ee',
    background: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
    padding: 0,
  },
  otpInputError: {
    borderColor: '#d93636', background: '#fff5f5',
  },
  otpInputFilled: {
    borderColor: '#d4a537',
    background: 'rgba(212, 165, 55, 0.08)',
    boxShadow: '0 4px 12px rgba(212, 165, 55, 0.20)',
  },
  otpTimerRow: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', marginTop: '4px',
  },
  otpTimerText: {
    fontSize: '12.5px', color: '#5a6472',
    margin: 0, fontFamily: "'Hind Siliguri', sans-serif",
    textAlign: 'center',
  },
  resendBtn: {
    padding: '10px 18px', borderRadius: '10px',
    background: 'rgba(212, 165, 55, 0.10)',
    color: '#0a1f44',
    fontSize: '13px', fontWeight: 600,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: '1.5px solid #d4a537',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  verifiedBox: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    background: 'rgba(30, 157, 90, 0.10)',
    border: '1.5px solid rgba(30, 157, 90, 0.35)',
    borderRadius: '14px',
    padding: '16px',
    marginTop: '8px',
  },
  verifiedIcon: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#1e9d5a', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', fontWeight: 700, flexShrink: 0,
  },
  verifiedTitle: {
    fontSize: '14px', fontWeight: 700, color: '#1e9d5a',
    margin: 0, marginBottom: '4px',
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  verifiedText: {
    fontSize: '12.5px', color: '#3a4152',
    margin: 0, lineHeight: 1.6,
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  footer: {
    position: 'sticky', bottom: 0, background: '#ffffff',
    padding: '14px 16px', borderTop: '1px solid #e2e6ee',
    boxShadow: '0 -4px 14px rgba(10, 31, 68, 0.06)',
  },
  footerRow: {
    display: 'flex', gap: '10px',
    maxWidth: '480px', margin: '0 auto',
  },
  btnNext: {
    width: '100%', maxWidth: '480px', margin: '0 auto',
    display: 'block', padding: '15px 20px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0a1f44, #16346b)',
    color: '#ffffff', fontSize: '16px', fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: 'none', cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(10, 31, 68, 0.25)',
    letterSpacing: '0.3px',
  },
  btnNextHalf: {
    flex: 1, padding: '15px 20px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #0a1f44, #16346b)',
    color: '#ffffff', fontSize: '15px', fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: 'none', cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(10, 31, 68, 0.25)',
    letterSpacing: '0.3px',
  },
  btnConfirm: {
    flex: 1, padding: '15px 20px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #d4a537, #e6c267)',
    color: '#0a1f44', fontSize: '15px', fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: 'none', cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(212, 165, 55, 0.35)',
    letterSpacing: '0.3px',
  },
  btnBack: {
    flex: 1, padding: '15px 20px', borderRadius: '12px',
    background: '#ffffff', color: '#0a1f44',
    fontSize: '15px', fontWeight: 700,
    fontFamily: "'Hind Siliguri', sans-serif",
    border: '2px solid #0a1f44', cursor: 'pointer',
    letterSpacing: '0.3px',
  },
}

export default UserRegisterForm
