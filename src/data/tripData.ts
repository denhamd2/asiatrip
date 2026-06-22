import type { TripDay } from '../types'
import { getLocationMeta } from '../utils/locations'

export const defaultTripData: TripDay[] = [
  {
    date: 'Tue, June 30',
    location: 'Transit',
    flights:
      'Flight from Dublin to Singapore (via Doha)\nFlight QR20: DUB → DOH (08:15). QR948: DOH → SIN (02:35-15:45).\nQatar Airways\nDoha layover: Oryx Airport Hotel',
    accommodation: 'Oryx Airport Hotel',
    cost: '€4,245.25',
    notes:
      'Flight Details: Qatar Airways Economy (25kg baggage). 07:05h leg followed by 08:10h leg.\nExtra leg room for 2nd leg.\nFlights €3,832.88. Doha layover: Booked and paid for on Booking.com (€412.37).',
    baggage: [
      {
        airline: 'Qatar Airways (Economy)',
        checked: '25kg per person (1-2 bags within 25kg total)',
        carryOn: '7kg (1 piece, max 50x37x25cm) + 1 personal item',
      },
    ],
    itinerary:
      '06:00 AM: Fast Track T1 & Phoenix Lounge Dublin Airport - booked & paid for\n\n08:15 AM: Flight QR20 DUB → DOH\n\nDoha layover: Oryx Airport Hotel — hotel stay in terminal for long layover.\n\n02:35 AM: Flight QR948 DOH → SIN (arr. 15:45)\n\n15:45 PM: Land Changi T1.\n\n16:30-17:30 PM: Immigration/bags/customs. See Jewel Changi Airport\n\n17:30-18:30 PM: MRT (Changi Airport → Chinatown/Clarke Quay, ~1h SGD2-4pp) or Grab (~20-30min SGD25-35 family).',
  },
  {
    date: 'Wed, July 1',
    location: 'Singapore',
    flights: 'Arrive SIN 15:45. Local Grab/MRT to Bugis.',
    accommodation: 'Furama City Centre, 60 Eu Tong Sen Street, Singapore 059804',
    cost: '€261.88',
    notes: 'Booked and paid',
    itinerary:
      '18:30 PM+: Check-in Furama (pool if open till 10 PM, unwind).\n\n19-21 PM: Maxwell Food Centre hawker dinner nearby (~SGD20pp; chicken rice/oyster omelette).\n\nEvening: Relax, light Chinatown night walk',
  },
  {
    date: 'Thu, July 2',
    location: 'Singapore',
    flights: 'Grab to Marina Bay Sands',
    accommodation: 'Marina Bay Sands',
    cost: '€1,131.01',
    notes: 'Booked, not yet paid.',
    itinerary:
      '8-9 AM: Furama breakfast.\n\n9:30-11 AM: MRT/Grab to MBS (~10min SGD5-10), SkyPark Observation Deck first (open 9:30AM; 30-45min, SGD32/adult; 360° views). Confirm keycard access.\n\n11 AM-Noon: Concierge bag storage.\n\n12-1 PM: Rasapura Masters B2 lunch (Alis Grill pizza, burgers SGD40-60 total).\n\n1-3 PM: Shoppes mall stroll to Merlion Park/promenade (20min walk).\n\n3 PM: MBS check-in (pool unlocks).\n\n3-5 PM: Infinity Pool lounging\n\n5-6 PM: Pool dips/jacuzzi.\n\n6-7:30 PM: Lau Pa Sat hawker dinner (~SGD25-35pp; satay/seafood).\n\n7:45 PM: Watch the "Garden Rhapsody" light and sound show at Gardens by the Bay — Supertree Grove (~10-15 min).\n\n8:45 PM: Watch the repeat show from our room.',
  },
  {
    date: 'Fri, July 3',
    location: 'Singapore',
    flights: 'Check out 11:00; Move to Furama Hotel. Local transit within Sentosa/Harbourfront.',
    accommodation: 'Furama City Centre, 60 Eu Tong Sen Street, Singapore 059804',
    cost: '€809.54',
    notes: 'Booked and paid for on credit card',
    itinerary:
      '11 AM: MBS checkout, bag storage; walk to Gardens by the Bay (6 min).\n\n11 AM-2:30 PM: Gardens by the Bay (spend most of the day here) — Cloud Forest/Flower Dome (Jurassic combo SGD48/adult), OCBC Skyway (SGD14), outdoor gardens & Supertrees photos (free), Satay by the Bay lunch (SGD15pp).\n\n3:00 PM: Check-in at Furama, settle.\n\n3:30-5 PM: Chinatown (Peranakan shophouses, Ann Siang Hill, Pagoda St temples/markets).\n\n5:30-7 PM: Lau Pa Sat hawker dinner (SGD25-35).\n\nEvening: MRT to Brewerkz (craft beers), Haji Lane (vintage shopping).',
  },
  {
    date: 'Sat, July 4',
    location: 'Singapore',
    flights: '',
    accommodation: 'Furama City Centre, 60 Eu Tong Sen Street, Singapore 059804',
    cost: '€213.86',
    notes: 'Booked and paid Universal tickets for on Klook',
    itinerary:
      'Universal Studios Singapore\n\n7:30-8 AM: Furama breakfast.\n\n8-9:30 AM: MRT HarbourFront, cable car Sky Pass (SGD35/adult) to USS.\n\n9:30 AM-4 PM: Rides (Sci-Fi/Transformers/Mummy; Jurassic Rapids/Puss/WaterWorld lunch SGD15; Far Far Away/Minions/Hollywood).\n\n4-6 PM: Harry Potter on Sentosa — Harry Potter: Visions of Magic at Resorts World Sentosa (short walk from USS).\n\n6-7 PM: Sentosa Express/bus to Palawan Beach (SGD1, rope bridge/sand relax).\n\n7-8 PM: MRT/Grab back Furama (30 min), dinner/pool.',
  },
  {
    date: 'Sun, July 5',
    location: 'Singapore',
    flights: '',
    accommodation: 'Furama City Centre, 60 Eu Tong Sen Street, Singapore 059804',
    cost: '',
    notes: '',
    itinerary:
      '8-9:30 AM: Furama breakfast, MRT to Little India.\n\n9:30-11 AM: Little India highlights—Tekka Centre (spices, sweets SGD5-10), Sri Veeramakaliamman Temple (statues/photos, free), Serangoon Rd murals/shops.\n\n11:00 AM: Raffles Long Bar right at opening to beat the queue (walk-in only, no reservations; Sun 11am-10:30pm last seating). Birthplace of the Singapore Sling (SGD35)—toss your peanut shells on the floor! Avoid the 4-7 PM rush.\n\n12:30 PM: Lunch at Lau Pa Sat (SGD40 crayfish).\n\n2-4:30 PM: Fort Canning Park (Tree Tunnel photos, Jubilee playground, Spice Garden; skip Battle Box if tired).\n\nEvening: Back to Furama, dinner/pool; optional Clarke Quay riverside stroll.',
  },
  {
    date: 'Mon, July 6',
    location: 'Koh Samui',
    flights:
      'Flight from Singapore to Koh Samui\nFlight PG968: 17.20-18.15 on Bangkok Airways\nPrivate Minibus Transfer from airport',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '€3,233.24',
    notes:
      'Flight €641.57. 4 cabin bags: 23 x 36 x 50 cm · Max weight 7 kg. 4 checked bags: Max weight 20 kg. 4 seats selected: 18D, 18A, 18C, 18B.\nTransfer: Booked and paid for return journey on Hoppa (€23.67). Ref G2561395.\nStay: Booked and paid for on credit card (€2,568.00).',
    baggage: [
      {
        airline: 'Bangkok Airways (Economy)',
        checked: '20kg per person (4 checked bags booked)',
        carryOn: '7kg per person, 1 piece (4 cabin bags booked)',
      },
    ],
    itinerary:
      '8-9:30 AM: Furama breakfast, pack up.\n\n11:00 AM: Check out of Furama (checkout time is 11 AM); store bags at reception if needed.\n\n11:30 AM-1:30 PM: Last Chinatown wander / lunch nearby.\n\n1:30 PM: MRT/train to Changi Airport (Chinatown → Tanah Merah change → Changi, ~1h; SGD2-4pp). Allow buffer for bags.\n\n2:30-3:45 PM: Explore Jewel Changi Airport (HSBC Rain Vortex waterfall, Shiseido Forest Valley).\n\n3:45 PM: Check in for PG968 (17:20 departure).\n\n17:20: Flight PG968 SIN → USM (Bangkok Airways).\n\n18:15: Land Koh Samui. Airport meet and greet; private minibus to Nora Buri (Hoppa ref G2561395).\n\n19:00+: Check-in/pool; dinner Barge (€26 family).\n\nHappy hour 16:00-19:00 (cocktails €4-7, beers €2-3).\n\nOptional Village intro.',
  },
  {
    date: 'Tue, July 7',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '',
    notes: '',
    itinerary:
      'Fisherman\'s Village + Overlap Stone (Timed Schedule)\n08:00-09:00: Nora Buri breakfast.\n\n09:30-11:30: Overlap Stone hike (Lamai; 15min Grab from Nora ~300 THB / €8 family).\nEntry 100-200 THB / €3-€5 PP Stone 1 (photo slot/drink); Stone 2 +50-200 THB / €1-€5; 1hr moderate trail (shoes/water).- €20 family; early low crowds.\n\n15:00: Fisherman\'s Village (~10min Grab) - stroll around\n\n17:00: : Coco Tam\'s fire show  - Fire show is 7:15pm, get there at 5pm\n\nMarket shops (Sophie/Ava).\n\nLucky beer (€6-€10 pints, happy hour).',
  },
  {
    date: 'Wed, July 8',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '€90.33',
    notes: 'Booked elephant experience & paid for on Klook. \n\nBooked the Jungle Club for 6pm.',
    itinerary:
      'Samui Elephant Home Feeding Experience\nMorning Session(11:00-12:00)\nIncludes round-trip transfers to and from the hotel \n\nAfternoon pool recovery.\n\n18:00 - Dinner at The Jungle Club - booked',
  },
  {
    date: 'Thu, July 9',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '€177.84',
    notes: 'Booked & paid for on Klook',
    itinerary:
      'Pig Island Tour\n08:00: Pickup included - Koh Samui Island Hopping & Relaxing Tour: Coral and Pig Island – Full Day(Small Group Tour with Entrance Fees and Hotel Pickup)\n15:00: Return to hotel\n\n\n15:00-17:00: Pool relax.',
  },
  {
    date: 'Fri, July 10',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '',
    notes: '',
    itinerary: 'Free day',
  },
  {
    date: 'Sat, July 11',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '',
    notes: '',
    itinerary:
      'Chill Day at hotel & Lamai beach\n\n16:00-19:00: Pool happy hour (€4 cocktails).',
  },
  {
    date: 'Sun, July 12',
    location: 'Bangkok',
    flights:
      'Private minibus transfer from hotel to airport\nFlight from Koh Samui to Bangkok (BKK airport)\nFlight PG106: 08:45am-10:00am\nBangkok Airways\nPrivate minibus transfer from airport to hotel.',
    accommodation: 'The Berkeley Hotel Pratunam, 559 Ratchathewi, Pratunam, Bangkok, Thailand, 1040',
    cost: '€1,012.13',
    notes:
      'Flight €483.00. 4 cabin bags: 23 x 36 x 50 cm · Max weight 7 kg. 4 checked bags: Max weight 20 kg. 4 seats selected: 23A, 23B, 23C, 23D.\nHotel transfer to airport: Hoppa ref G2561395.\nAirport transfer to hotel: Hoppa ref G2561422 (€48.70).\nHotel €440.43 — booked, not yet paid. Family Bunk Bed Room. Breakfast included.\nBubble Forest Cafe dinner: Klook €40.00 (300 THB food/drink vouchers each).',
    baggage: [
      {
        airline: 'Bangkok Airways (Economy)',
        checked: '20kg per person (4 checked bags booked)',
        carryOn: '7kg per person, 1 piece',
      },
    ],
    itinerary:
      '05:32 AM: Pickup from Nora Buri; private minibus to Koh Samui airport (Hoppa ref G2561395).\n\n08:45-10:00 AM: Flight PG106 USM → BKK (Bangkok Airways).\n\n10:00 AM: Land Bangkok. Airport pickup; private minibus to hotel (Hoppa ref G2561422).\n\n11:30 AM: Check in (early check-in likely available), freshen up\n\n1:00 PM: Lunch at hotel or nearby (Pratunam has excellent street food)\n\n3:00 PM: Pratunam Market exploration (literally steps from your hotel!) Browse vintage clothes, fake designer items (belts, jerseys 300-800 THB / €8.22-€21.92), and general shopping. Negotiate prices by offering 50-65% of asking price. Bring cash for best prices.\n\nNote: use the OneSiam discount card (downloaded for free at https://mail.google.com/mail/u/0/#inbox/FMfcgzQgLXxjSVXTsgQFSKcLlBCnJzlb) to get 25% off Grab, and discounts on shopping and food.\n\n6:00 PM: Bubble Forest Cafe — booking (not using set menu).',
  },
  {
    date: 'Mon, July 13',
    location: 'Bangkok',
    flights: '',
    accommodation: 'The Berkeley Hotel Pratunam, 559 Ratchathewi, Pratunam, Bangkok, Thailand, 1040',
    cost: '',
    notes: '',
    itinerary:
      '9:00 AM: Hotel breakfast\n\n10:00 AM: Pop Mart at ICONSIAM (7th floor) World\'s largest Pop Mart Global Landmark Store—perfect for collectible shopping! Standard blind boxes 300-800 THB (€8.22-€21.92); premium/limited edition 800-2,000 THB (€21.92-€54.79). Expect 1-2 hour waits; arrive early. Address: 299 Charoen Nakhon Rd. Grab from hotel ~20-30 min (100-150 THB / €2.74-€4.11).\n\n1:00 PM: ICONSIAM has extensive dining (Thai, international options)\n\n3:00 PM: Sephora shopping - Central World or ICONSIAM Browsing makeup and skincare. Pricing: Standard beauty products 1,000-1,500 THB (€27.40-€41.10); premium skincare 1,500-3,000 THB (€41.10-€82.19). Sephora in Bangkok typically 30-50% more expensive than US prices. CentralWorld is Bangkok\'s premier shopping mall (~15 min Grab from ICONSIAM, 100-150 THB / €2.74-€4.11).\n\n5:15 PM: Grab to King Power Mahanakhon (~10 min from CentralWorld, 80-120 THB / €2.19-€3.29)\n\n5:30-7:15 PM: Mahanakhon SkyWalk for sunset — rooftop observation deck and glass floor (King Power Mahanakhon, 114 Narathiwas Rd). Arrive before ~6:30 PM sunset. Tickets ~880-1,080 THB/adult (~€24-€30); book ahead if possible.\n\n7:30 PM: Dinner near Silom/Sathorn or Grab back to Pratunam (~15-20 min)',
  },
  {
    date: 'Tue, July 14',
    location: 'Bangkok',
    flights: '',
    accommodation: 'The Berkeley Hotel Pratunam, 559 Ratchathewi, Pratunam, Bangkok, Thailand, 1040',
    cost: '',
    notes:
      'Anne: Wat Pho massage at 8 AM opening (register first — minimal wait vs 60–120 min at midday). Cash only. Tue = weekday, good for short queues.',
    itinerary:
      '6:45 AM: Quick breakfast at hotel (or grab-and-go — hotel restaurant may open later).\n\n7:00 AM: Grab to Wat Pho (~15–20 min from Pratunam).\n\n8:00 AM: Arrive Wat Pho at opening (temple & massage pavilion open 8:00 AM). Anne registers at the Wat Pho Thai Traditional Medical & Massage School pavilion immediately — before touring. Tip from TripAdvisor & travel forums: register first, get a numbered ticket, then explore while waiting if needed; at opening on a weekday (Tue) wait is often minimal or zero.\n\n8:15 AM - 9:15 AM: Anne — 1-hour traditional Thai massage (~520 THB / ~€14; 30 min 340 THB). Cash only. Wear loose modest clothing. Avoid 11 AM–2 PM peak queue (60–120+ min waits reported on TripAdvisor).\n\n9:15 AM - 10:30 AM: Wat Pho & Reclining Buddha (Temple of the Reclining Buddha). Admission ~300 THB. Early morning = quieter halls and better photos before tour groups arrive ~10 AM.\n\n10:45 AM: Walk to Grand Palace complex (~5 min).\n\n11:00 AM: Grand Palace & Wat Phra Kaew (Temple of the Emerald Buddha). Open until 3:30 PM; admission 500 THB. Dress modestly.\n\n12:30 PM: Lunch near Grand Palace area.\n\n2:00 PM: Grab back to hotel to rest (~15 min).\n\n4:00 PM onwards: Relax at hotel, pool, light dinner or evening stroll.\n\n8:30 PM: Early dinner or rest for next day.',
  },
  {
    date: 'Wed, July 15',
    location: 'Bangkok → Da Nang',
    flights:
      'Private transfer in minivan from hotel to airport\nFlight from Bangkok to Da Nang\nFlight EK370 - 20:10-21:50\nEmirates\nPrivate transfer in minivan from airport to hotel',
    accommodation: 'Peninsula Hotel Da Nang',
    cost: '€813.03',
    notes:
      'Flight €208.62 — used airmiles towards this fare (saving €47). 4 cabin bags: 55 x 38 x 22cm · Max weight 7kg. 4 checked bags: Max weight 25kg. Choose seats for free 48 hours before the flight.\nHotel transfer to airport: Hoppa ref G2561422 (return transfer).\nAirport transfer to hotel: Hoppa ref G2561431 (€12.27).\nPeninsula Hotel €592.14 — booked, not yet paid. 2 rooms, breakfast included.',
    baggage: [
      {
        airline: 'Emirates (Economy)',
        checked: '25kg per person (4 checked bags booked)',
        carryOn: '7kg per person, 1 piece (55 x 38 x 22cm) - 4 cabin bags booked',
      },
    ],
    itinerary:
      '8:00 AM: Hotel breakfast\n\n9:00 AM: MBK Center (Mahboonkrong) - the famous fake goods mall Find fake jerseys (200-800 THB / €5.48-€21.92 after haggling), designer clothes, and high-quality replica bags (2,000-4,600 THB / €54.79-€126.03). Haggling strategy: Start at 65% of asking price. Floors 1-3 focus on clothing, shoes, bags. Takes 1.5-2 hours to explore. MBK is centrally located, ~15 min Grab from hotel (100-150 THB / €2.74-€4.11).\n\n11:00 AM: Quick last-minute shopping at Terminal 21 (Pop Mart or favorites) or return to hotel. Easy MRT access (~5 min from hotel, 15-20 THB / €0.41-€0.55).\n\n12:30 PM: Early lunch near hotel or airport area\n\n2:00 PM: Pack, check out\n\n4:35 PM: Pickup from hotel — private minivan to airport (Hoppa ref G2561422).\n\n8:10 PM: Flight EK370 depart Bangkok for Da Nang.\n\n9:50 PM: Land Da Nang. Airport pickup; private minivan to hotel (Hoppa ref G2561431).\n\n12:30 AM onwards: Check in Peninsula Hotel Da Nang, rest',
  },
  {
    date: 'Thu, July 16',
    location: 'Da Nang',
    flights: 'Hotel Night 2',
    accommodation: 'Peninsula Hotel Da Nang',
    cost: '',
    notes: 'Golden Bridge',
    itinerary:
      '7:00 AM: Hotel breakfast\n\n10:45 AM: Grab to My Khe Beach (~15 min, ~150,000 VND / €6)\n\n11:00 AM - 12:30 PM: My Khe Beach – One of the world\'s most beautiful beaches with soft white sand and calm waters. Walk along the shoreline.\n\n12:30 PM: Lunch at beachside restaurant\n\n2:00 PM: Lady Buddha (Linh Ung Pagoda at Son Tra Peninsula) Perched on hillside 67 meters above ground with commanding sea views and city panoramas. Spiritual and photogenic location. ~45 min drive from beach. ~250,000 VND entry (~€10). This is one of Ken Abroad\'s recommended must-see spots for photography.\n\n4:00 PM: Return to Da Nang city center (~20 min)\n\n4:30 PM - 5:15 PM: Marble Mountains & Am Phu Cave Five limestone mountains symbolizing five elements (Earth, Water, Fire, Metal, Wood). Explore the cave system with Buddhist sculptures depicting heaven/hell scenes, complemented by light and sound effects. ~20-30 min cave tour (less strenuous than climbing full mountains). ~100,000 VND (~€4).\n\n5:30 PM - 6:30 PM: Local Market Exploration (Han Market or Con Market) Ken Abroad recommends experiencing authentic Da Nang beyond major tourist attractions. Browse local produce, street food, souvenirs. Immerse in Vietnamese daily life. Free entry.\n\n6:30 PM - 7:00 PM: Street Food & Vietnamese Egg Coffee – Grab street snacks at local cafes; visit local coffee shops (Vietnamese egg coffee ~40,000 VND / €1.60).\n\n7:00 PM - 7:45 PM: Riverfront Walk – Stroll Da Nang\'s riverside promenade, watch sunset over Han River. Free. ~45 min.\n\n8:00 PM: Return to hotel, rest/pool time\n\n8:30 PM: Dinner at Peninsula Hotel restaurant or explore local dining district',
  },
  {
    date: 'Fri, July 17',
    location: 'Da Nang',
    flights:
      'Private car transfer from hotel to Sun World Ba Na Hills with Minh Vu Travel\nHotel Night 3',
    accommodation: 'Peninsula Hotel Da Nang',
    cost: '€13.19',
    notes:
      'Booked and paid for through Minh Vu Travel.\nActivities: \nSolar Castle (Pop Mart Flagship at Ba Na Hills) 3:00–4:30 PM; \nGolden Bridge photography before tour crowds.',
    itinerary:
      '7:00 AM pickup booked from the hotel in a 6/7-seater MPV, to beat the crowds for the cable car and get good photos of the Golden Bridge without too many people.\n\n7:15 AM: Early breakfast at hotel (get to Golden Bridge before tour crowds arrive)\n\n9:00 AM: Arrive Sun World Ba Na Hills - Cable Car ascent Take the Hoi An (05) ground station cable car—CNN-ranked among 10 most impressive cable-car systems in the world. 360-degree mountain views; on clear days see Da Nang and the sea. Full-day ticket includes all attractions. ~500,000 VND (~€20) adults; children discounts available.\n\n10:00 AM: Golden Bridge: Early morning (you\'ll be here by 10 AM—before peak crowds 11 AM-3 PM). Perfect for Instagram/memory shots. Spend 30-45 min for photos and exploration.\n\n11:00 AM: Explore Middle Level attractions while crowds build downstairs:\nFlower Gardens – Picturesque botanical gardens, great for photo ops\nLinh Ung Pagoda – Golden Buddhist pagoda with cultural significance\nWine Cellar – Unique underground attraction\n\n1:00 PM: Lunch at Ba Na Hills Restaurant (Buffet included with ticket)\n\n2:00 PM: Fantasy Park (included with Ba Na Hills ticket) Perfect for younger visitors:\nDinosaur Park – Interactive museum with dinosaurs\nRoller Coaster – Alpine Coaster ride (thrilling but not extreme)\nArcade games – 90+ free games\nJurassic Park – Adventure zone\nWax Museum – 40+ celebrity wax statues\n\n3:00-4:30 PM: Solar Castle (Pop Mart Flagship at Ba Na Hills) — world\'s largest Pop Mart store. Standard blind boxes ~150,000-400,000 VND (€6-€16); premium/limited editions ~400,000-1,000,000 VND (€16-€40). Allow 1.5-2 hours for proper browsing.\n\n4:30 PM: Explore French Village at Morin Station – European-style architecture, charming photo spots\n\n5:30 PM: Cable car descent back to ground level (spectacular sunset views possible)\n\n6:30 PM: Return to Da Nang via taxi (~50 min, ~800,000 VND / €32)\n\n7:30 PM: Quick dinner at hotel or nearby restaurant (~30 min)\n\n8:30 PM onwards: EARLY REST – Retire to hotel to rest before Dragon Bridge evening show. Critical rest period after 12-hour day.\n\n9:00 PM - 9:45 PM: Dragon Bridge Fire & Water Show Walk/Grab to Dragon Bridge (Cầu Rồng) located in Da Nang city center (~10 min from most locations). The iconic bridge breathes fire and sprays water during evening shows (typically 9 PM and 10 PM nightly). Spectacular nighttime photography opportunity with bridge illuminated. Free to view from bridge/riverbank. The fire breathing is most dramatic and best framed from the north side of the bridge.\n\n10:00 PM: Return to hotel, rest',
  },
  {
    date: 'Sat, July 18',
    location: 'Hoi An',
    flights: '45-min private transfer from Da Nang to Hoi An with Minh Vu Travel',
    accommodation: 'Little Hoi An. A Boutique Hotel & Spa',
    cost: '€437.43',
    notes:
      'Transfer booked and paid for 16-seater van (Minh Vu Travel, €17.29).\nHotel booked and paid with Revolut Stays (€420.14).\nDavid: Suit fitting at La Vang Golden Leaf Tailor Shop (441 Cua Dai St — Grab ~5 min from hotel; ask for Autumn).',
    itinerary:
      '7:30 AM: Hotel breakfast at Peninsula Da Nang, check out & store bags if needed.\n\n8:00 AM: Grab to My Khe Beach (~15 min).\n\n8:30 AM - 10:30 AM: My Khe Beach — morning swim and walk along the shoreline before heading to Hoi An.\n\n10:45 AM: Grab back to hotel, collect bags.\n\n12:00 PM: Pickup from Da Nang hotel — private transfer to Hoi An (~45 min, Minh Vu Travel).\n\n1:00 PM: Arrive Little Hoi An. A Boutique Hotel & Spa, check in, freshen up\n\n2:00 PM: Lunch at hotel or nearby\n\n3:00 PM - 4:30 PM: La Vang Golden Leaf Tailor Shop (441 Cua Dai St, near Cua Dai Beach — Grab ~5 min) — David\'s suit consultation, fabric selection & measurements with Autumn. Allow 2–3 days for 2 fittings; 24–48 hr turnaround typical (est. €110–€220 for quality wool 2-piece; 3-piece ~€140–€280).\n\n5:00 PM: Hoi An Ancient Town exploration. Stroll through: Japanese Covered Bridge, yellow buildings, local markets, shophouses.\n\n6:00 PM: Sunset photography walk along the riverside.\n\n7:30 PM: Dinner at hotel or local restaurant',
  },
  {
    date: 'Sun, July 19',
    location: 'Hoi An',
    flights: 'Hotel Night 2',
    accommodation: 'Little Hoi An. A Boutique Hotel & Spa',
    cost: '',
    notes: 'Hoi An Ancient Town',
    itinerary:
      '6:00 AM: Sunrise Photography Tour (early departure for best light) Hire professional guide (~€40-60 family) or go independently. Early morning (6:00-7:30 AM) offers soft light without crowds.\nPhotograph golden fishing nets – iconic Hoi An riverside feature\nLocal morning market – vibrant atmosphere, friendly vendors, Vietnamese breakfast\nRiverside charm – fishermen with nets, traditional boats\n\n8:30 AM: Vietnamese breakfast & aromatic coffee at market cafe (~50,000 VND / €2)\n\n9:30 AM: Return to hotel, rest/shower\n\n10:30 AM - 11:30 AM: La Vang Golden Leaf Tailor Shop — David\'s first suit fitting (alterations from yesterday\'s measurements).\n\n12:00 PM: Hoi An Ancient Town (Full Exploration) UNESCO World Heritage Site dating to 15th century. Perfect photography day in daylight.\nJapanese Bridge – architectural marvel with views\nAssembly Halls – historic gathering places with intricate details\nOld Houses – 18th-century merchant homes showcasing period architecture\nIncense Hall – Buddhist temple with massive incense coils creating spiral patterns (photograph from above for best composition)\nHidden corners – small alleyways with colorful doorways, lanterns\nHoi An Market – local produce, seafood, textiles\n\n12:30 PM: Lunch at local restaurant – Cao lau (Hoi An specialty noodle dish, ~80,000 VND / €3.20) or White Rose dumplings (~100,000 VND / €4)\n\n2:00 PM: Continue Ancient Town exploration or visit specialty shops:\nFabric & Lantern Shops – browse textile options for tailoring projects\nArt galleries – local artwork, prints\nCoffee shops – experience traditional Vietnamese egg coffee (~40,000 VND / €1.60)\n\n4:00 PM: Return to hotel, rest/pool time\n\n6:30 PM: Blue Hour Photography Walk (sunset to twilight, ~30-45 min before full darkness) This is the magical "lantern light" hour. \nNote: Evening (7-9 PM) becomes extremely crowded with tourists during full moon festival, but less so on regular days.\n\n7:30 PM: Dinner at riverside restaurant for evening ambiance',
  },
  {
    date: 'Mon, July 20',
    location: 'Hoi An',
    flights: 'Hotel Night 3',
    accommodation: 'Little Hoi An. A Boutique Hotel & Spa',
    cost: '',
    notes: 'David: La Vang Golden Leaf final fitting & suit pickup.\nCam Thanh basket boat tour; lantern photography at blue hour in the Ancient Town.',
    itinerary:
      '8:00 AM: Hotel breakfast\n\n9:00 AM - 10:00 AM: La Vang Golden Leaf Tailor Shop — David\'s second (final) suit fitting & pickup.\n\n12:00 PM: Lunch at local restaurant near tailoring shop\n\n2:00 PM - 5:00 PM: Cam Thanh Basket Boat Tour\n\nTransfer from hotel to Cam Thanh Fishing Village (~15 min drive, included in tour)\n\nTour Highlights:\nWelcome at local fisherman\'s family house; learn about their daily life\nBamboo Basket Boat ride through Cam Thanh River & Bay Mau Coconut Forest\nNavigate small canals of mangrove forest & coconut palms\nLearn traditional fishing techniques – watching fishermen, trying to cast nets\nPaddling experience – try rowing the basket boat yourself\nBasket boat race – competitive paddling fun\nCatch fish/crabs – use simple traditional tools\nWelcome drink at fisherman\'s house (~free coconut drink)\nLunch – local food included (~12:00 PM or after tour)\nCost: ~€12-18 per person family rate; GetYourGuide/Klook offers discounts\n\n5:30 PM: Return to hotel, freshen up\n\n7:00 PM: Early dinner or rest\n\n8:00 PM: Evening – LANTERN PHOTOGRAPHY AT ANCIENT TOWN\n\nReturn to hotel by 9:00 PM, pack for Tuesday departure',
  },
  {
    date: 'Tue, July 21',
    location: 'Hanoi',
    flights:
      'Private minivan transfer to airport\nFlight from Da Nang to Hanoi\nPrivate minivan transfer from airport',
    accommodation: 'Peridot Grand Luxury Boutique Hotel',
    cost: '€545.22',
    notes:
      'Hotel transfer to airport: Hoppa ref G2561557 (€15.90). 7:50 AM pickup from hotel.\nFlight €275.00 — booked and paid. 11:35-13:00, Terminal 1.\nAirport transfer to hotel: Hoppa ref G2561839 (€16.82). 1 PM pickup from airport.\nPeridot Grand €237.50 — booked and paid on Revolut Stays. Breakfast included.\nAnne: head spa at NonLa Healing Spa (book Combo 2 online).',
    baggage: [
      {
        airline: 'Vietnam Airlines (DAD → HAN)',
        checked: '23kg per person (4 checked bags booked)',
        carryOn: '10kg per person (4 hand bags booked)',
      },
    ],
    itinerary:
      '7:50 AM: Pickup from Hoi An hotel — private minivan to Da Nang airport (Hoppa ref G2561557).\n\n11:35 AM-1:00 PM: Flight DAD → HAN (Vietnam Airlines, Terminal 1). 4× 10kg hand luggage; 4× 23kg checked luggage.\n\n1:00 PM: Land Hanoi. Airport pickup; private minivan to hotel (Hoppa ref G2561839).\n\n2:30 PM: Check in Peridot Grand Luxury Boutique Hotel, freshen up.\n\n3:30 PM - 5:30 PM: Anne — NonLa Healing Spa (21 Thuoc Bac, Old Quarter — ~8 min walk from hotel). Combo 2 head spa: relaxing herbal hair wash, avocado hair mask & neck/shoulder/nape massage (~90 min, 650,000 VND / ~€24). Japanese-style scalp treatment; book at nonlahealingspa.com or WhatsApp +84 98 992 6189. Open 10 AM–10 PM.\n\n6:00 PM: Light dinner near hotel or short Old Quarter stroll.\n\nEarly night — Halong Bay cruise transfer tomorrow.',
  },
  {
    date: 'Wed, July 22',
    location: 'Halong Bay',
    flights: 'Transfer from Hanoi to Halong Bay (to be booked)',
    accommodation: 'Azura Cruise Halong Bay',
    cost: '€1,197.00',
    notes: 'Azura Cruise 3D2N Lan Ha Bay. Cruise booked and paid — includes all meals, not drinks. Transfers to be booked.',
    itinerary:
      'Morning: Transfer from Peridot Grand, 33 Duong Thanh to Tuan Chau Marina (~3 hr / ~170 km). Transfers to be booked — aim for Lot 38 / Waiting Lounge 038, Tuan Chau International Marina by 11:30–11:45 AM.\n11:30 AM: Arrive Tuan Chau Wharf; speedboat tender to Azura Cruise.\n12:30–12:45 PM: Check-in — welcome drink, cold towel, safety briefing, cabin keys.\n1:00 PM: Lunch in onboard restaurant (included — Vietnamese–Western fusion buffet/set menu; fresh seafood) while cruising Halong Bay into Lan Ha Bay.\n2:30–4:30 PM: Ao Ech Lagoon (Frog Pond) — choose swimming in open sea or floating pool, panoramic deck pool, or kayaking in calm lagoon (all included; life vests provided).\n5:30–6:30 PM: Sunset party on sundeck — complimentary hot tea, jacuzzi, sunbathing & photos. Happy Hour at bar: buy 2 drinks, get 1 free (drinks not included in fare).\n6:15 PM: Vietnamese cooking class with ship chef (included).\n7:15 PM: Dinner in restaurant (included — multi-course Asian–European fusion; vegetarian options on request).\n8:45 PM: Evening free time — karaoke, live music, night squid fishing (included), open-air bar (drinks paid), onboard spa/sauna (paid — book with Cruise Manager), movie, or relax in cabin.\nOvernight anchored on Lan Ha Bay. Free: Wi-Fi, gym, panoramic pool.',
  },
  {
    date: 'Thu, July 23',
    location: 'Ha Long Bay',
    flights: 'Cruise Night 2',
    accommodation: 'Azura Cruise Halong Bay',
    cost: '',
    notes: 'Meals included today: breakfast buffet + lunch + dinner. Drinks not included. Bring cash & comfortable shoes for Viet Hai cycling; swimwear for Ba Trai Dao.',
    itinerary:
      '6:30 AM: Sunrise Tai Chi on sundeck (included — great for photography) or gym session (free, panoramic views).\n7:00 AM: Breakfast buffet in restaurant (included — sandwiches, pastries, eggs, ham, sausage, fruit, coffee/tea).\n8:15 AM: Tender boat to Cat Ba Island.\n9:45 AM–12:00 PM: Viet Hai Village (Cat Ba National Park) — cycle or electric cart ~4 km into the valley village; rice fields, buffalos, local school, meet villagers & traditional crafts (included; optional fish-foot massage at natural pond — own expense).\n12:00–1:00 PM: Lunch onboard (included).\n1:30–3:30 PM: Ba Trai Dao (Three Peaches) Beach area — kayak, swim & sunbathe on secluded beach (included; weather permitting).\n3:30 PM: Return to main cruise; relax on sundeck.\n5:30–6:30 PM: Mini cooking class, Happy Hour & jacuzzi (buy 2 drinks, get 1 free at bar).\n7:15 PM: Dinner in restaurant (included).\n8:45 PM: Evening — karaoke, squid fishing, bar (drinks paid), spa (paid), or stargazing on deck.\nOvernight on Lan Ha Bay.',
  },
  {
    date: 'Fri, July 24',
    location: 'Hanoi',
    flights: 'Transfer from Halong Bay to Hanoi (to be booked)',
    accommodation: 'Proverb Hotel',
    cost: '€402.47',
    notes: 'Booked and paid for. Includes breakfast at Proverb. Transfers to be booked.',
    itinerary:
      '6:30 AM: Tai Chi on sundeck or sunrise photography from top deck / gym.\n7:00–7:30 AM: Light breakfast in restaurant (included).\n7:30–8:30 AM: Dark & Bright Cave (Sang Toi Cave) — kayak on your own or bamboo boat with local rower (included).\n9:30 AM: Check out of cabin; settle any drink/spa bills.\n9:30–9:45 AM: Brunch in restaurant while Azura sails back to Tuan Chau Marina (included).\n10:30–10:45 AM: Tender speedboat from Azura to Tuan Chau pier.\n11:15 AM: Disembark — arrive Lot 38 / Waiting Lounge 038, Tuan Chau International Marina, Tuan Chau Island. Tour guide assists with luggage.\n11:45 AM–12:00 PM: Transfer to Hanoi — to be booked (~2.5–3 hrs to Proverb Hotel, 21 Bat Su St, Hoan Kiem).\n12:00–3:00 PM: Drive to Hanoi via expressway (~170 km).\n3:00–4:00 PM: Arrive Proverb Hotel; check in when room ready (official check-in often from 2 PM). Freshen up.\n\n5:00 PM: Old Quarter Walking Tour (self-guided or hire guide ~€15-20) Explore:\n\nNarrow alleyways – 36 Streets of Hanoi, each traditionally dedicated to one trade\n\nSt Joseph\'s Cathedral – Iconic Gothic cathedral (exterior photography)\n\nVietnamese Women\'s Museum – Cultural insight (if time permits; may save for tomorrow)\n\nStreet food tasting – Grab local snacks (pho, banh mi, spring rolls) ~50,000-100,000 VND (~€2-4)\n\n6:30 PM: Hoan Kiem Lake sunset walk Beautiful lakeside park with locals exercising, feeding turtles. Perfect photography light during golden hour. Free entry. ~30-45 min stroll.\n\n7:30 PM: Dinner – Traditional Vietnamese restaurant in Old Quarter (~150,000-200,000 VND / €6-8 per person)\n\n8:30 PM: Return to hotel, rest',
  },
  {
    date: 'Sat, July 25',
    location: 'Hanoi',
    flights: 'Hotel Night 2',
    accommodation: 'Proverb Hotel',
    cost: '',
    notes: '',
    itinerary:
      'Train Street, Water Puppets & Culture):\n\n6:30 AM: Early Breakfast at hotel (6:30-7 AM optimal)\n\n7:30 AM - 9:00 AM: Hanoi Train Street Photography Located at 224 Lê Duẩn in the Old Quarter (near many hotels) - Train timing: Trains typically pass around 3:00 PM and 7:00 PM, but morning visiting offers fewer crowds and can capture residents opening shops, sweeping streets, local morning life.\n\n9:30 AM: Vietnamese Egg Coffee & Pastry Breakfast Visit legendary café (Giang Café or similar ~40,000 VND / €1.60). Vietnamese egg coffee is a signature experience.\n\n10:30 AM - 12:00 PM: Temple of Literature Vietnam\'s first university (founded 1070). - What to see: Beautiful courtyards, ancient pagodas, stone turtle statues (symbolize longevity), scholarly atmosphere - Admission: ~30,000 VND (~€1.20). Note: Less crowded in morning before peak tourist hours\n\n12:30 PM: Lunch – Local pho or specialty noodle dish (~80,000-120,000 VND / €3.20-4.80 per person)\n\n2:00 PM - 3:00 PM: Rest at hotel or optional Hoa Lo Prison (Hanoi Hilton) Museum - Historical war site, sobering but educational - Admission ~30,000 VND (~€1.20)\n\n3:30 PM: Tran Quoc Pagoda Vietnam\'s oldest pagoda (built 545 AD), lakeside setting on Truc Bach Lake. - Admission: Free Travel: ~15 min from Old Quarter by Grab (~50,000 VND / €2)\n\n4:00 PM - 5:00 PM: Truc Bach Lake Walk & Photography Gorgeous lakeside area, locals exercising, specialty coffee shops, swan boat rides available (~50,000 VND / €2 per person). Visit oldest ice cream shop in Hanoi nearby. Perfect photo spot with golden hour light.\n\n5:30 PM: Return to Old Quarter\n\n6:00 PM - 6:30 PM: Rest at hotel, freshen up\n\n6:30 PM - 7:15 PM: Pre-show Dinner near Thang Long Water Puppet Theatre\n\n7:30 PM - 8:15 PM (or alternative show time): Thang Long Water Puppet Theatre\n\nLocation: Beside Hoan Kiem Lake in Old Quarter (57B Dinh Tien Hoang Street)\n\nWhat to expect: Traditional Vietnamese art form. Wooden puppets controlled via bamboo canes perform stories of local legends, folk tales, Vietnamese myths on water stage. Live traditional music accompanies performances. Fireworks & special effects. 50-minute show. - Ticket price: ~100,000-150,000 VND per person (~€4-6); audio guides available (~10,000 VND / €0.40 extra)\nShow times: Multiple performances daily (typically 2:30 PM, 4:00 PM, 5:30 PM, 7:00 PM). Evening shows are most popular.\n\n8:30 PM: Post-show Dinner – Return to Old Quarter for late dinner or dessert. Visit Trang Tien ice cream shop (famous Hanoi ice cream ~20,000 VND / €0.80)\n\n9:30 PM: Return to hotel, rest',
  },
  {
    date: 'Sun, July 26',
    location: 'Hanoi',
    flights: 'Hotel Night 3',
    accommodation: 'Proverb Hotel',
    cost: '',
    notes: '',
    itinerary:
      '8:00 AM: Hotel breakfast\n\n9:00 AM - 11:00 AM: Hoan Kiem Lake Extended Visit Perfect golden morning light. Full lake exploration with options:\nNgoc Son Temple – Small temple on tiny island (accessible via red bridge); serene, photogenic\nTurtle Tower – Historic structure in middle of lake; photograph from lakeside\nCafé stops – Waterfront cafés for Vietnamese coffee (~30,000 VND / €1.20)\n\n11:00 AM - 12:30 PM: Hanoi Shopping & Browsing\nOld Quarter markets – Local crafts, silk scarves, lanterns, souvenirs\nMaison Marou (famous chocolate shop) – Browse, grab coffee/pastry\nStreet art galleries – Local art shops\n\n12:30 PM: Lunch – Try Michelin-recommended restaurant or casual local eatery (~150,000-250,000 VND / €6-10 per person)\n\n2:00 PM - 4:30 PM: Extended Truc Bach Lake Afternoon & Photography Session\nReturn to Truc Bach Lake for afternoon light (different from morning; more dramatic shadows and reflections)\nExtended swan boat rides – ~1 hour paddling; allow plenty of time for photography from water\nWaterside café time – Sit, observe, photograph: fishermen casting nets, water vendors, traditional boats\n\n4:30 PM - 5:30 PM: Return to hotel, rest & freshen up\n\n5:30 PM: Final Evening Walk – Different Old Quarter Area – Catch sunset light on yellow buildings and alleyways. \n\n7:00 PM: Farewell Dinner – Upscale Vietnamese restaurant or hotel dining\n\n8:30 PM: Return to hotel, pack for Monday departure',
  },
  {
    date: 'Mon, July 27',
    location: 'Departure',
    flights: 'VN162: DAD → HAN. QR977: Depart HAN (19:30)\nQatar Airways',
    accommodation: 'flight',
    cost: '',
    notes: 'Extra leg room for 2nd leg.',
    baggage: [
      {
        airline: 'Vietnam Airlines (DAD → HAN)',
        checked: '23kg per person',
        carryOn: '10kg per person',
      },
      {
        airline: 'Qatar Airways (HAN → DOH, Economy)',
        checked: '25kg per person (1-2 bags within 25kg total)',
        carryOn: '7kg (1 piece, max 50x37x25cm) + 1 personal item',
      },
    ],
    itinerary:
      '',
  },
  {
    date: 'Tue, July 28',
    location: 'Dublin',
    flights: 'QR19: DOH → DUB (01:15 - 06:45)\nQatar Airways',
    accommodation: 'Home',
    cost: '',
    notes: 'Flight Details: Arrive in Dublin Terminal 1 early morning.',
    baggage: [
      {
        airline: 'Qatar Airways (Economy)',
        checked: '25kg per person (1-2 bags within 25kg total)',
        carryOn: '7kg (1 piece, max 50x37x25cm) + 1 personal item',
      },
    ],
    itinerary:
      '',
  },

]

export const DESTINATION_ORDER = [
  'Singapore',
  'Koh Samui',
  'Bangkok',
  'Da Nang',
  'Hoi An',
  'Hanoi',
  'Halong Bay',
  'Ha Long Bay',
] as const

export function getLocationTheme(location: string) {
  const normalized = location.split('→')[0].trim()

  const themes: Record<string, { accent: string; badge: string; dot: string; ring: string }> = {
    Singapore: {
      accent: 'from-sky-500 to-blue-600',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      dot: 'bg-sky-500',
      ring: 'ring-sky-100',
    },
    'Koh Samui': {
      accent: 'from-teal-500 to-emerald-600',
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      dot: 'bg-teal-500',
      ring: 'ring-teal-100',
    },
    Bangkok: {
      accent: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-100 text-amber-900 border-amber-200',
      dot: 'bg-amber-500',
      ring: 'ring-amber-100',
    },
    'Bangkok → Da Nang': {
      accent: 'from-violet-500 to-purple-600',
      badge: 'bg-violet-100 text-violet-800 border-violet-200',
      dot: 'bg-violet-500',
      ring: 'ring-violet-100',
    },
    'Da Nang': {
      accent: 'from-indigo-500 to-violet-600',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      dot: 'bg-indigo-500',
      ring: 'ring-indigo-100',
    },
    'Hoi An': {
      accent: 'from-yellow-500 to-amber-600',
      badge: 'bg-yellow-100 text-yellow-900 border-yellow-200',
      dot: 'bg-yellow-500',
      ring: 'ring-yellow-100',
    },
    Hanoi: {
      accent: 'from-rose-500 to-red-600',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      ring: 'ring-rose-100',
    },
    'Halong Bay': {
      accent: 'from-cyan-500 to-blue-600',
      badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      dot: 'bg-cyan-500',
      ring: 'ring-cyan-100',
    },
    'Ha Long Bay': {
      accent: 'from-cyan-500 to-blue-600',
      badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      dot: 'bg-cyan-500',
      ring: 'ring-cyan-100',
    },
    Transit: {
      accent: 'from-slate-500 to-slate-600',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      ring: 'ring-slate-100',
    },
    'Hamad International Airport, Doha': {
      accent: 'from-purple-700 to-fuchsia-800',
      badge: 'bg-purple-100 text-purple-900 border-purple-200',
      dot: 'bg-purple-700',
      ring: 'ring-purple-100',
    },
    Doha: {
      accent: 'from-purple-700 to-fuchsia-800',
      badge: 'bg-purple-100 text-purple-900 border-purple-200',
      dot: 'bg-purple-700',
      ring: 'ring-purple-100',
    },
    Departure: {
      accent: 'from-slate-500 to-slate-600',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      ring: 'ring-slate-100',
    },
    Dublin: {
      accent: 'from-emerald-500 to-green-600',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-100',
    },
  }

  return (
    themes[location] ??
    themes[normalized] ?? {
      accent: 'from-gray-500 to-gray-600',
      badge: 'bg-gray-100 text-gray-700 border-gray-200',
      dot: 'bg-gray-400',
      ring: 'ring-gray-100',
    }
  )
}

export function parseCostValue(cost: string): number {
  if (!cost) return 0
  const match = cost.replace(/,/g, '').match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

const DESTINATION_CITY_LABELS: Record<string, string> = {
  'Ha Long': 'Halong Bay',
}

function destinationKey(location: string): string | null {
  const loc = location.split('→')[0].trim()
  if (!loc || ['Transit', 'Departure', 'Dublin'].includes(loc)) return null

  const meta = getLocationMeta(loc)
  if (meta.country && meta.city !== 'In transit') {
    return `${meta.city}|${meta.country}`
  }
  return loc
}

function destinationLabel(location: string): string {
  const loc = location.split('→')[0].trim()
  const meta = getLocationMeta(loc)
  if (meta.city && DESTINATION_CITY_LABELS[meta.city]) {
    return DESTINATION_CITY_LABELS[meta.city]
  }
  return loc
}

/** True when the flights field describes air travel, not hotel/transfer line items. */
function isFlightActivity(flights: string): boolean {
  const text = flights.trim()
  if (!text) return false
  if (/^(Hotel Night|Cruise Night)/i.test(text)) return false
  if (/^(Grab to|Check out|Private (transfer|car)|Transfer from)/i.test(text)) return false
  if (/^(Arrive|Local Grab)/i.test(text)) return true
  return /Airways|Airlines|→|\b[A-Z]{2}\d{2,}\b|\b(DUB|DOH|SIN|BKK|DAD|HAN|USM)\b/.test(text)
}

export function countUniqueDates(data: TripDay[]): number {
  return new Set(data.map((day) => day.date).filter(Boolean)).size
}

export function getTripDateRange(data: TripDay[]): { start: string; end: string } | null {
  const dates = data.map((day) => day.date).filter(Boolean)
  if (dates.length === 0) return null
  return { start: dates[0], end: dates[dates.length - 1] }
}

export function getUniqueDestinations(data: TripDay[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const day of data) {
    const loc = day.location.split('→')[0].trim()
    if (!loc) continue
    const key = destinationKey(loc)
    if (!key || seen.has(key)) continue
    seen.add(key)
    result.push(destinationLabel(loc))
  }
  return result
}

export function getTripStats(data: TripDay[]) {
  const totalCost = data.reduce((sum, d) => sum + parseCostValue(d.cost), 0)
  const flightDates = new Set(
    data.filter((day) => isFlightActivity(day.flights || '')).map((day) => day.date),
  )
  const destinations = getUniqueDestinations(data)

  return {
    totalDays: countUniqueDates(data),
    destinations: destinations.length,
    flightDays: flightDates.size,
    totalCost,
    itineraryItems: data.length,
  }
}
