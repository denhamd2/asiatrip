import type { TripDay } from '../types'

export const defaultTripData: TripDay[] = [
  {
    date: 'Tue, June 30',
    location: 'Transit',
    flights: 'Flight QR20: DUB → DOH (08:15). QR948: DOH → SIN (02:35-15:45). Qatar Airways',
    accommodation: 'Flight',
    cost: '€3,832.88',
    notes: 'Flight Details: Qatar Airways Economy (25kg baggage). 07:05h leg followed by 08:10h leg. Flight was changed (hence the later arrival time) - standard leg room on the 2nd leg (no extra leg room).',
    baggage: [
      {
        airline: 'Qatar Airways (Economy)',
        checked: '25kg per person (1-2 bags within 25kg total)',
        carryOn: '7kg (1 piece, max 50x37x25cm) + 1 personal item',
      },
    ],
    itinerary:
      '06:00 AM: Fast Track T1 & Phoenix Lounge Dublin Airport - booked & paid for\n15:45 PM: Land Changi T1.\n16:30-17:30 PM: Immigration/bags/customs.\n17:30-18:30 PM: MRT (Changi Airport → Chinatown/Clarke Quay, ~1h SGD2-4pp) or Grab (~20-30min SGD25-35 family).\nLook up express pass for immigration',
  },
  {
    date: 'Wed, July 1',
    location: 'Singapore',
    flights: 'Arrive SIN 15:45. Local Grab/MRT to Bugis.',
    accommodation: 'Furama City Centre, 60 Eu Tong Sen Street, Singapore 059804',
    cost: '€261.88',
    notes: 'Booked and paid',
    itinerary:
      '18:30 PM+: Check-in Furama (pool if open till 10 PM, unwind).\n19-21 PM: Maxwell Food Centre hawker dinner nearby (~SGD20pp; chicken rice/oyster omelette).\nEvening: Relax, light Chinatown night walk',
  },
  {
    date: 'Thu, July 2',
    location: 'Singapore',
    flights: 'Grab to Marina Bay Sands',
    accommodation: 'Marina Bay Sands',
    cost: '€1,131.01',
    notes: 'Booked, not yet paid.',
    itinerary:
      '8-9 AM: Furama breakfast.\n9:00 AM: Leave Furama, Grab to Marina Bay Sands (~10 min).\n9:30-10:30 AM: Drop luggage & do preliminary check-in to get temporary keycard (unlocks pool & SkyPark Observation Deck access).\n10:30-11:30 AM: SkyPark Observation Deck (360° views; 30-45 min).\n1:00 PM: Lunch at Rasapura Masters / The Shoppes (B2 food hall).\n2:00 PM: Browse The Shoppes mall.\n2:45 PM: Back at check-in desk to collect room keys (early in case of queue).\n3:00 PM: Drop bags in room, freshen up.\n4:00 PM: Walk down to Merlion Park / promenade for photos (~20 min walk each way).\n6:30 PM: Head back to MBS for sunset.\n7:13 PM: Sunset from the Infinity Pool (sunset is ~7:13 PM that day).\n8:00 PM+: Dinner after sunset.\n9:00 PM: Spectra Light & Water Show (9 PM show; viewable from room/promenade).',
  },
  {
    date: 'Fri, July 3',
    location: 'Singapore',
    flights: 'Check out 11:00; Move to Furama Hotel. Local transit within Sentosa/Harbourfront.',
    accommodation: 'Furama City Centre, 60 Eu Tong Sen Street, Singapore 059804',
    cost: '€809.54',
    notes: 'Booked and paid for on credit card',
    itinerary:
      '11 AM: MBS checkout, bag storage; walk to Gardens by the Bay (6 min).\n11 AM-2:30 PM: Gardens by the Bay (spend most of the day here) - Cloud Forest/Flower Dome (Jurassic combo SGD48/adult), OCBC Skyway (SGD14), outdoor gardens & Supertrees photos (free), Satay by the Bay lunch (SGD15pp).\n3:00 PM: Check-in at Furama, settle.\n3:30-5 PM: Chinatown (Peranakan shophouses, Ann Siang Hill, Pagoda St temples/markets).\n5:30-7 PM: Lau Pa Sat hawker dinner (SGD25-35).\nEvening: MRT to Brewerkz (craft beers), Haji Lane (vintage shopping).',
  },
  {
    date: 'Sat, July 4',
    location: 'Singapore',
    flights: '',
    accommodation: 'Furama City Centre, 60 Eu Tong Sen Street, Singapore 059804',
    cost: '€213.86',
    notes: 'Activity: Universal Studios. Booked and paid Universal tickets for on Klook',
    itinerary:
      '7:30-8 AM: Furama breakfast.\n8-9:30 AM: MRT HarbourFront, cable car Sky Pass (SGD35/adult) to USS (Universal Studios Singapore opening hours: 10am-8pm).\n10 AM-3 PM: Rides (Sci-Fi/Transformers/Mummy; Jurassic Rapids/Puss/WaterWorld lunch SGD15; Far Far Away/Minions/Hollywood).\n3-4:30 PM: Harry Potter: Visions of Magic at Resorts World Sentosa (WEAVE, Level B1, right next to USS; immersive interactive experience, ~60 min; last entry 8pm).\n4:30-7 PM: Sentosa Express/bus to Palawan Beach (SGD1, rope bridge/sand relax).\n7-8 PM: MRT/Grab back Furama (30 min), dinner/pool.',
  },
  {
    date: 'Sun, July 5',
    location: 'Singapore',
    flights: '',
    accommodation: 'Furama City Centre, 60 Eu Tong Sen Street, Singapore 059804',
    cost: '',
    notes: '',
    itinerary:
      '8-9:30 AM: Furama breakfast, MRT to Little India.\n9:30-11 AM: Little India highlights—Tekka Centre (spices, sweets SGD5-10), Sri Veeramakaliamman Temple (statues/photos, free), Serangoon Rd murals/shops.\n11:00 AM: Raffles Long Bar right at opening to beat the queue (walk-in only, no reservations; Sun 11am-10:30pm last seating). Birthplace of the Singapore Sling (SGD35)—toss your peanut shells on the floor! Avoid the 4-7 PM rush.\n12:30 PM: Lunch at Lau Pa Sat (SGD40 crayfish).\n2-4:30 PM: Fort Canning Park (Tree Tunnel photos, Jubilee playground, Spice Garden; skip Battle Box if tired).\nEvening: Back to Furama, dinner/pool; optional Clarke Quay riverside stroll.',
  },
  {
    date: 'Mon, July 6',
    location: 'Koh Samui',
    flights: 'Flight PG968: 17.20-18.15 on Bangkok Airways',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '€3,209.57',
    notes: 'Flight: 4 cabin bags & 4 checked bags. Hotel booked and paid.',
    baggage: [
      {
        airline: 'Bangkok Airways (Economy)',
        checked: '20kg per person (4 checked bags booked)',
        carryOn: '7kg per person, 1 piece (4 cabin bags booked)',
      },
    ],
    itinerary:
      '8-9:30 AM: Furama breakfast, pack up.\n11:00 AM: Check out of Furama (checkout time is 11 AM); store bags at reception if needed.\n11:30 AM-1:30 PM: Last Chinatown wander / lunch nearby.\n1:30 PM: MRT/train to Changi Airport (Chinatown → Tanah Merah change → Changi, ~1h; SGD2-4pp). Allow buffer for bags.\n2:30-3:45 PM: Explore Jewel Changi Airport (HSBC Rain Vortex waterfall, Shiseido Forest Valley) - moved here from arrival day as you\'ll be far less tired now.\n3:45 PM: Check in for PG968 (17:20 departure).\n17:20-18:15: Flight PG968 to Koh Samui (Bangkok Airways).\n18:30-19:00 PM: Grab to hotel (~€13 family).\n19:00 PM+: Check-in/pool; dinner Barge (€26 family).\nHappy hour 16:00-19:00 (cocktails €4-7, beers €2-3).\nOptional Village intro.',
  },
  {
    date: 'Tue, July 7',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '',
    notes: "Activity: Fisherman's Village + Overlap Stone",
    itinerary:
      "08:00-09:00 AM: Nora Buri breakfast.\n09:30-11:30 AM: Overlap Stone hike (Lamai; 15min Grab from Nora ~300 THB / €8 family). Entry 100-200 THB PP, early low crowds.\n15:00 PM: Fisherman's Village (~10min Grab) - stroll around\n17:00 PM: Coco Tam's fire show - Fire show is 7:15pm, get there at 5pm. Market shops. Lucky beer (€6-€10 pints, happy hour).",
  },
  {
    date: 'Wed, July 8',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '€90.33',
    notes: 'Samui Elephant Home Feeding Experience. Booked & paid on Klook.',
    itinerary:
      '11:00-12:00 PM: Samui Elephant Home Feeding Experience. Includes round-trip transfers to and from the hotel.\nAfternoon: pool recovery.\n18:00 PM: Dinner at The Jungle Club - booked',
  },
  {
    date: 'Thu, July 9',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '€177.84',
    notes: 'Pig Island Tour. Booked & paid for on Klook',
    itinerary:
      '08:00 AM: Pickup included - Koh Samui Island Hopping & Relaxing Tour: Coral and Pig Island – Full Day.\n15:00 PM: Return to hotel.\n15:00-17:00 PM: Pool relax.',
  },
  {
    date: 'Fri, July 10',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '',
    notes: 'Koh Tao/Nang Yuan Tour',
    itinerary:
      '07:30-17:00 PM: GetYourGuide speedboat (snorkel/turtles/viewpoint) - €190 family incl. lunch/snorkel gear.\n17:30 PM+: Nora dinner; Lobby Bar specials: cocktails ~200 THB / €5.\nEvening: Pack for flight.',
  },
  {
    date: 'Sat, July 11',
    location: 'Koh Samui',
    flights: '',
    accommodation: 'Nora Buri - 2x pool villas with hilltop view. Breakfast included.',
    cost: '',
    notes: '',
    itinerary:
      'Day: Chill Day at hotel & Lamai beach.\n16:00-19:00 PM: Pool happy hour (€4 cocktails).',
  },
  {
    date: 'Sun, July 12',
    location: 'Bangkok',
    flights: 'Flight PG106: 08:45am-10:00am. Bangkok Airways',
    accommodation: 'The Berkeley Hotel Pratunam, 559 Ratchathewi, Bangkok',
    cost: '€963.43',
    notes: 'Flights: 4 bags. Hotel: Booked, not yet paid. Dinner: Bubble Forest Cafe (Booked via klook, 300 THB vouchers).',
    baggage: [
      {
        airline: 'Bangkok Airways (Economy)',
        checked: '20kg per person (4 checked bags booked)',
        carryOn: '7kg per person, 1 piece',
      },
    ],
    itinerary:
      '6:00-6:30 AM: Quick breakfast / grab-and-go from Nora Buri.\n6:30 AM: Grab from Nora Buri to Koh Samui Airport (USM), departing by 6:30 AM (~20-30 min, ~300-400 THB / €8-10 family). Pre-book the Grab the night before as island cars can be scarce early morning.\n7:15 AM: Arrive Samui Airport, check in & bag drop for PG106 (aim to be there ~90 min before the 08:45 departure).\n08:45-10:00 AM: Flight PG106 to Bangkok (Bangkok Airways).\n10:00 AM: Grab to hotel (~30-45 min, 150-200 THB / €4.11-€5.48)\n11:30 AM: Check in (early check-in likely available), freshen up\n1:00 PM: Lunch at hotel or nearby (Pratunam has excellent street food)\n3:00 PM: Pratunam Market exploration (literally steps from your hotel!) Browse vintage clothes, fake designer items, and general shopping. Negotiate prices. Use OneSiam discount card for 25% off Grab.\n18:00 PM: Dinner at Bubble Forest Cafe (Not using set menu).',
  },
  {
    date: 'Mon, July 13',
    location: 'Bangkok',
    flights: '',
    accommodation: 'The Berkeley Hotel Pratunam',
    cost: '',
    notes: '',
    itinerary:
      "9:00 AM: Hotel breakfast\n10:00 AM: Pop Mart at ICONSIAM (7th floor) World's largest Pop Mart Global Landmark Store. Standard blind boxes 300-800 THB; premium 800-2,000 THB. Expect 1-2 hour waits; arrive early.\n1:00 PM: ICONSIAM has extensive dining (Thai, international options)\n3:00 PM: Sephora shopping - Central World or ICONSIAM. CentralWorld is Bangkok's premier shopping mall.\n5:00 PM: BTS to King Power Mahanakhon (Chong Nonsi station, ~20-30 min from Pratunam) - head over early to beat the queue and lifts.\n5:45 PM: Mahanakhon SkyVerse - immersive digital art & multimedia experience on the way up to the deck. Then the 74th-floor indoor observation deck plus the 78th-floor open-air rooftop & Glass Tray (open daily ~10am-midnight). Settle in before sunset for the best light.\n6:49 PM: Sunset from the SkyWalk (sunset is ~6:49 PM that day); stay on for dusk and the city lights.\n8:00 PM: BTS back towards the hotel.\n8:30 PM: Dinner (consider upscale dining near hotel or casual Thai)",
  },
  {
    date: 'Tue, July 14',
    location: 'Bangkok',
    flights: '',
    accommodation: 'The Berkeley Hotel Pratunam',
    cost: '',
    notes: 'Anne: Wat Pho massage at 8 AM opening (register first — minimal wait vs 60–120 min at midday). Cash only. Tue = weekday, good for short queues.',
    itinerary:
      '6:45 AM: Quick breakfast at hotel (or grab-and-go — hotel restaurant may open later).\n7:00 AM: Grab to Wat Pho (~15–20 min from Pratunam).\n8:00 AM: Arrive Wat Pho at opening (temple & massage pavilion open 8:00 AM). Anne registers at the Wat Pho Thai Traditional Medical & Massage School pavilion immediately — before touring. Tip from TripAdvisor & travel forums: register first, get a numbered ticket, then explore while waiting if needed; at opening on a weekday (Tue) wait is often minimal or zero.\n8:15 AM - 9:15 AM: Anne — 1-hour traditional Thai massage (~520 THB / ~€14; 30 min 340 THB). Cash only. Wear loose modest clothing. Avoid 11 AM–2 PM peak queue (60–120+ min waits reported on TripAdvisor).\n9:15 AM - 10:30 AM: Wat Pho & Reclining Buddha (Temple of the Reclining Buddha). Admission ~300 THB. Early morning = quieter halls and better photos before tour groups arrive ~10 AM.\n10:45 AM: Walk to Grand Palace complex (~5 min).\n11:00 AM: Grand Palace & Wat Phra Kaew (Temple of the Emerald Buddha). Open until 3:30 PM; admission 500 THB. Dress modestly.\n12:30 PM: Lunch near Grand Palace area.\n2:00 PM: Grab back to hotel to rest (~15 min).\n4:00 PM onwards: Relax at hotel, pool, light dinner or evening stroll.\n8:30 PM: Early dinner or rest for next day.',
  },
  {
    date: 'Wed, July 15',
    location: 'Bangkok → Da Nang',
    flights: 'Flight EK370 - 20:10-21:50. Emirates',
    accommodation: 'Peninsula Hotel Da Nang',
    cost: '€800.76',
    notes: 'Flights: Used airmiles towards this fare. Choose seats for free 48 hours before the flight. Hotel: Booked, but not yet paid. 2 rooms, breakfast included',
    baggage: [
      {
        airline: 'Emirates (Economy)',
        checked: '25kg per person (4 checked bags booked)',
        carryOn: '7kg per person, 1 piece (55 x 38 x 22cm) - 4 cabin bags booked',
      },
    ],
    itinerary:
      '8:00 AM: Hotel breakfast, pack up.\n9:00 AM: Check out of The Berkeley (checkout is 9 AM); store bags with the hotel for the day.\n9:30 AM: MBK Center (Mahboonkrong) - the famous fake goods mall. Takes 1.5-2 hours to explore.\n11:00 AM: Quick last-minute shopping at Terminal 21 or return to hotel. Easy MRT access.\n12:30 PM: Early lunch near hotel or airport area\n2:00 PM: Collect stored bags from the hotel.\n3:30 PM: Grab to Suvarnabhumi Airport (~45 min, 300-400 THB)\n8:10 PM: Depart for Da Nang\n12:30 AM onwards: Check in Peninsula Hotel Da Nang, rest',
  },
  {
    date: 'Thu, July 16',
    location: 'Da Nang',
    flights: '',
    accommodation: 'Peninsula Hotel Da Nang',
    cost: '',
    notes: '',
    itinerary:
      "7:30 AM: Hotel breakfast.\n8:30 AM: Grab to Lady Buddha (Linh Ung Pagoda, Son Tra Peninsula) — 67m white statue with panoramic bay views (~20 min from hotel).\n9:00 AM - 10:30 AM: Lady Buddha & pagoda grounds.\n11:00 AM: Lunch near Son Tra or back towards the city.\n12:15 PM: Grab to Marble Mountains (~25 min).\n12:45 PM - 2:15 PM: Marble Mountains & Am Phu Cave — explore the cave system with Buddhist sculptures (~20-30 min cave tour).\n2:45 PM: Grab back to Da Nang city centre.\n4:00 PM: Dragon Bridge — walk the iconic bridge as the LED lights start to come on (no fire/water show tonight — that runs Fri-Sun at 9 PM).\n4:30 PM: Love Bridge (Cau Tinh Yeu) — colourful heart locks bridge, short walk from Dragon Bridge along the Han River.\n5:00 PM: Han Market — browse local produce, street food, and souvenirs.\n5:30 PM - 6:30 PM: Han River promenade walk — sunset is ~6:38 PM; watch the light change over the river and bridges.\n7:00 PM: Dinner nearby or back at Peninsula Hotel.",
  },
  {
    date: 'Fri, July 17',
    location: 'Da Nang',
    flights: '',
    accommodation: 'Peninsula Hotel Da Nang',
    cost: '',
    notes: 'Activities: Golden Bridge photography; Solar Castle (Pop Mart flagship at Ba Na Hills).',
    itinerary:
      "7:15 AM: Early breakfast at hotel (get to Golden Bridge before tour crowds arrive)\n8:00 AM: Depart for Ba Na Hills/Sun World via private car/taxi (~40-50 min from Da Nang, ~800,000 VND).\n9:00 AM: Arrive Sun World Ba Na Hills - Cable Car ascent (Hoi An 05 ground station).\n10:00 AM: Golden Bridge: Early morning before peak crowds. Perfect for Instagram/memory shots. Spend 30-45 min.\n11:00 AM: Explore Middle Level attractions: Flower Gardens, Linh Ung Pagoda, Wine Cellar.\n1:00 PM: Lunch at Ba Na Hills Restaurant (Buffet included with ticket)\n2:00 PM: Fantasy Park (included with Ba Na Hills ticket). Dinosaur Park, Roller Coaster, Arcade games, Wax Museum.\n3:00 PM - 4:30 PM: Solar Castle (Pop Mart Flagship at Ba Na Hills). World's largest Pop Mart store. Allow 1.5-2 hours.\n4:30 PM: Explore French Village at Morin Station\n5:30 PM: Cable car descent back to ground level\n6:30 PM: Return to Da Nang via taxi\n7:15 PM: Quick dinner at hotel or nearby restaurant.\n8:15 PM: Walk/Grab to Dragon Bridge, aiming to arrive by ~8:30 PM to secure a good viewing spot near the dragon's head (it gets very crowded and the bridge closes to traffic shortly before the show).\n9:00 PM - 9:15 PM: Dragon Bridge Fire & Water Show (runs Fri-Sun at 9 PM sharp; today is Friday). Iconic bridge breathes fire then sprays water (~15 min).\n9:30 PM: Return to hotel, rest",
  },
  {
    date: 'Sat, July 18',
    location: 'Hoi An',
    flights: '45-min taxi transfer from Da Nang to Hoi An',
    accommodation: 'Little Hoi An. A Boutique Hotel & Spa',
    cost: '€420.14',
    notes: 'David: Suit fitting at La Vang Golden Leaf Tailor Shop (441 Cua Dai St — Grab ~5 min from hotel; ask for Autumn).',
    itinerary:
      '7:30 AM: Hotel breakfast at Peninsula Da Nang, check out & store bags if needed.\n8:00 AM: Grab to My Khe Beach (~15 min).\n8:30 AM - 10:30 AM: My Khe Beach — morning swim and walk along the shoreline before heading to Hoi An.\n10:45 AM: Grab back to hotel, collect bags.\n12:00 PM: Depart Da Nang via 45-min taxi transfer to Hoi An (~200,000 VND / €8)\n1:00 PM: Arrive Little Hoi An. A Boutique Hotel & Spa, check in, freshen up\n2:00 PM: Lunch at hotel or nearby\n3:00 PM - 4:30 PM: La Vang Golden Leaf Tailor Shop (441 Cua Dai St, near Cua Dai Beach — Grab ~5 min) — David\'s suit consultation, fabric selection & measurements with Autumn. Allow 2–3 days for 2 fittings; 24–48 hr turnaround typical (est. €110–€220 / $120–$240 for quality wool 2-piece; 3-piece ~€140–€280).\n5:00 PM: Hoi An Ancient Town exploration. Stroll through: Japanese Covered Bridge, yellow buildings, local markets, shophouses.\n6:00 PM: Sunset photography walk along the riverside.\n7:30 PM: Dinner at hotel or local restaurant',
  },
  {
    date: 'Sun, July 19',
    location: 'Hoi An',
    flights: '',
    accommodation: 'Little Hoi An. A Boutique Hotel & Spa',
    cost: '',
    notes: '',
    itinerary:
      "6:00 AM: Sunrise Photography Tour (early departure for best light). Photograph golden fishing nets, local morning market, riverside charm.\n8:30 AM: Vietnamese breakfast & aromatic coffee at market cafe (~50,000 VND / €2)\n9:30 AM: Return to hotel, rest/shower\n10:30 AM - 11:30 AM: La Vang Golden Leaf Tailor Shop — David's first suit fitting (alterations from yesterday's measurements).\n12:00 PM: Hoi An Ancient Town (Full Exploration). UNESCO World Heritage Site. Japanese Bridge, Assembly Halls, Old Houses, Incense Hall, Hidden corners, Hoi An Market.\n12:30 PM: Lunch at local restaurant – Cao lau or White Rose dumplings\n2:00 PM: Continue Ancient Town exploration or visit specialty shops: Fabric & Lantern Shops, Art galleries, Coffee shops.\n4:00 PM: Return to hotel, rest/pool time\n6:30 PM: Blue Hour Photography Walk (sunset to twilight). Magical 'lantern light' hour.\n7:30 PM: Dinner at riverside restaurant for evening ambiance",
  },
  {
    date: 'Mon, July 20',
    location: 'Hoi An',
    flights: '',
    accommodation: 'Little Hoi An. A Boutique Hotel & Spa',
    cost: '',
    notes: 'David: La Vang Golden Leaf final fitting & suit pickup. Cam Thanh basket boat; lantern photography.',
    itinerary:
      '8:00 AM: Hotel breakfast\n9:00 AM - 10:00 AM: La Vang Golden Leaf Tailor Shop — David\'s second (final) suit fitting & pickup.\n10:30 AM - 12:00 PM: Cam Thanh Basket Boat Tour. Transfer from hotel. Bamboo Basket Boat ride through Cam Thanh River & Bay Mau Coconut Forest.\n12:00 PM: Lunch at local restaurant near Cua Dai / tailoring shop\n2:00 PM - 5:00 PM: Pool / rest at hotel or optional return to Ancient Town.\n5:30 PM: Return to hotel, freshen up\n7:00 PM: Early dinner or rest\n8:00 PM: Evening – LANTERN PHOTOGRAPHY AT ANCIENT TOWN\n9:00 PM: Return to hotel, pack for Tuesday departure',
  },
  {
    date: 'Tue, July 21',
    location: 'Hanoi',
    flights: 'Flight from Da Nang to Hanoi. 11:35-13:00. Terminal 1. 4x 10kg hand luggage, 4x 23kg checked.',
    accommodation: 'Peridot Grand Luxury Boutique Hotel',
    cost: '€512.50',
    notes: 'Flights & Hotel Booked and paid. Breakfast included. Anne: head spa at NonLa Healing Spa (book Combo 2 online).',
    baggage: [
      {
        airline: 'Vietnam Airlines (DAD → HAN)',
        checked: '23kg per person (4 checked bags booked)',
        carryOn: '10kg per person (4 hand bags booked)',
      },
    ],
    itinerary:
      '7:00 AM: Check out Little Hoi An, taxi to Da Nang Airport (~45 min, ~400,000 VND / €15).\n9:00 AM: Arrive Da Nang Airport, check in for VN flight (aim ~90 min before 11:35 departure).\n11:35 AM - 1:00 PM: Flight from Da Nang to Hanoi (Terminal 1).\n1:30 PM: Grab to Peridot Grand Luxury Boutique Hotel, 33 Duong Thanh (~40 min from Noi Bai).\n2:30 PM: Check in, freshen up.\n3:30 PM - 5:30 PM: Anne — NonLa Healing Spa (21 Thuoc Bac, Old Quarter — ~8 min walk from hotel). Combo 2 head spa: relaxing herbal hair wash, avocado hair mask & neck/shoulder/nape massage (~90 min, 650,000 VND / ~€24). Japanese-style scalp treatment; book at nonlahealingspa.com or WhatsApp +84 98 992 6189. Open 10 AM–10 PM.\n6:00 PM: Light dinner near hotel or short Old Quarter stroll.\nEarly night — Halong Bay cruise transfer tomorrow.',
  },
  {
    date: 'Wed, July 22',
    location: 'Halong Bay',
    flights: 'Transfer from Hanoi to Halong Bay (arrange separately — not listed in cruise booking notes)',
    accommodation: 'Azura Cruise Halong Bay',
    cost: '€1,197.00',
    notes: 'Azura Cruise 3D2N Lan Ha Bay. Booked & paid — includes all meals, not drinks. Hanoi→marina transfer NOT confirmed in your notes; meet at Tuan Chau by ~11:30 AM or book car/limousine.',
    itinerary:
      'Morning: Transfer from Peridot Grand, 33 Duong Thanh to Tuan Chau Marina (~3 hr / ~170 km). Not included in your booking notes — options: private car/limousine (~$65 USD / ~€60 one way, ~3 hrs) or ask Azura to add shuttle pick-up. If self-driving: aim for Lot 38 / Waiting Lounge 038, Tuan Chau International Marina by 11:30–11:45 AM.\n11:30 AM: Arrive Tuan Chau Wharf; speedboat tender to Azura Cruise.\n12:30–12:45 PM: Check-in — welcome drink, cold towel, safety briefing, cabin keys.\n1:00 PM: Lunch in onboard restaurant (included — Vietnamese–Western fusion buffet/set menu; fresh seafood) while cruising Halong Bay into Lan Ha Bay.\n2:30–4:30 PM: Ao Ech Lagoon (Frog Pond) — choose swimming in open sea or floating pool, panoramic deck pool, or kayaking in calm lagoon (all included; life vests provided).\n5:30–6:30 PM: Sunset party on sundeck — complimentary hot tea, jacuzzi, sunbathing & photos. Happy Hour at bar: buy 2 drinks, get 1 free (drinks not included in fare).\n6:15 PM: Vietnamese cooking class with ship chef (included).\n7:15 PM: Dinner in restaurant (included — multi-course Asian–European fusion; vegetarian options on request).\n8:45 PM: Evening free time — karaoke, live music, night squid fishing (included), open-air bar (drinks paid), onboard spa/sauna (paid — book with Cruise Manager), movie, or relax in cabin.\nOvernight anchored on Lan Ha Bay. Free: Wi-Fi, gym, panoramic pool.',
  },
  {
    date: 'Thu, July 23',
    location: 'Ha Long Bay',
    flights: '',
    accommodation: 'Azura Cruise Halong Bay',
    cost: '',
    notes: 'Meals included today: breakfast buffet + lunch + dinner. Drinks not included. Bring cash & comfortable shoes for Viet Hai cycling; swimwear for Ba Trai Dao.',
    itinerary:
      '6:30 AM: Sunrise Tai Chi on sundeck (included — great for photography) or gym session (free, panoramic views).\n7:00 AM: Breakfast buffet in restaurant (included — sandwiches, pastries, eggs, ham, sausage, fruit, coffee/tea).\n8:15 AM: Tender boat to Cat Ba Island.\n9:45 AM–12:00 PM: Viet Hai Village (Cat Ba National Park) — cycle or electric cart ~4 km into the valley village; rice fields, buffalos, local school, meet villagers & traditional crafts (included; optional fish-foot massage at natural pond — own expense).\n12:00–1:00 PM: Lunch onboard (included).\n1:30–3:30 PM: Ba Trai Dao (Three Peaches) Beach area — kayak, swim & sunbathe on secluded beach (included; weather permitting).\n3:30 PM: Return to main cruise; relax on sundeck.\n5:30–6:30 PM: Mini cooking class, Happy Hour & jacuzzi (buy 2 drinks, get 1 free at bar).\n7:15 PM: Dinner in restaurant (included).\n8:45 PM: Evening — karaoke, squid fishing, bar (drinks paid), spa (paid), or stargazing on deck.\nOvernight on Lan Ha Bay.',
  },
  {
    date: 'Fri, July 24',
    location: 'Hanoi',
    flights: 'Transfer from Halong Bay to Hanoi (arrange separately — not listed in cruise booking notes)',
    accommodation: 'Proverb Hotel',
    cost: '€402.47',
    notes: 'Booked and paid for. Includes breakfast at Proverb. Final cruise morning then transfer to Hanoi — return shuttle not confirmed in your notes; private car ~$65 / ~€60 to Proverb Hotel, 21 Bat Su St.',
    itinerary:
      '6:30 AM: Tai Chi on sundeck or sunrise photography from top deck / gym.\n7:00–7:30 AM: Light breakfast in restaurant (included).\n7:30–8:30 AM: Dark & Bright Cave (Sang Toi Cave) — kayak on your own or bamboo boat with local rower (included).\n9:30 AM: Check out of cabin; settle any drink/spa bills.\n9:30–9:45 AM: Brunch in restaurant while Azura sails back to Tuan Chau Marina (included).\n10:30–10:45 AM: Tender speedboat from Azura to Tuan Chau pier.\n11:15 AM: Disembark — arrive Lot 38 / Waiting Lounge 038, Tuan Chau International Marina, Tuan Chau Island. Tour guide assists with luggage.\n11:45 AM–12:00 PM: Arrange return transfer to Hanoi (not in your booking notes — book private car/limousine with cruise staff at disembarkation, or pre-book; ~2.5–3 hrs to Old Quarter).\n12:00–3:00 PM: Drive to Hanoi via expressway (~170 km). Drop-off Proverb Hotel, 21 Bat Su Street, Hoan Kiem (~3:00 PM if departing marina ~12:00 PM).\n3:00–4:00 PM: Arrive Proverb Hotel; check in when room ready (official check-in often from 2 PM). Freshen up.\n5:00 PM: Old Quarter Walking Tour (self-guided or hire guide). Explore: Narrow alleyways – 36 Streets of Hanoi. St Joseph\'s Cathedral. Street food tasting.\n6:30 PM: Hoan Kiem Lake sunset walk. Perfect photography light during golden hour.\n7:30 PM: Dinner – Traditional Vietnamese restaurant in Old Quarter.\n8:30 PM: Return to hotel, rest',
  },
  {
    date: 'Sat, July 25',
    location: 'Hanoi',
    flights: '',
    accommodation: 'Proverb Hotel',
    cost: '',
    notes: 'Train Street, Water Puppets & Culture',
    itinerary:
      "6:30 AM: Early Breakfast at hotel\n7:30 AM - 9:00 AM: Hanoi Train Street Photography Located at 224 Lê Duẩn in the Old Quarter. Morning visiting offers fewer crowds.\n9:30 AM: Vietnamese Egg Coffee & Pastry Breakfast.\n10:30 AM - 12:00 PM: Temple of Literature Vietnam's first university.\n12:30 PM: Lunch – Local pho or specialty noodle dish.\n2:00 PM - 3:00 PM: Rest at hotel or optional Hoa Lo Prison (Hanoi Hilton) Museum.\n3:30 PM: Tran Quoc Pagoda Vietnam's oldest pagoda, lakeside setting on Truc Bach Lake.\n4:00 PM - 5:00 PM: Truc Bach Lake Walk & Photography.\n5:30 PM: Return to Old Quarter\n6:00 PM - 6:30 PM: Rest at hotel, freshen up\n6:30 PM - 7:15 PM: Pre-show Dinner near Thang Long Water Puppet Theatre\n7:30 PM - 8:15 PM: Thang Long Water Puppet Theatre. Traditional Vietnamese art form on water stage.\n8:30 PM: Post-show Dinner – Return to Old Quarter.\n9:30 PM: Return to hotel, rest",
  },
  {
    date: 'Sun, July 26',
    location: 'Hanoi',
    flights: '',
    accommodation: 'Proverb Hotel',
    cost: '',
    notes: '',
    itinerary:
      '8:00 AM: Hotel breakfast\n9:00 AM - 11:00 AM: Hoan Kiem Lake Extended Visit Perfect golden morning light. Ngoc Son Temple, Turtle Tower, Café stops.\n11:00 AM - 12:30 PM: Hanoi Shopping & Browsing. Old Quarter markets, Maison Marou, Street art galleries.\n12:30 PM: Lunch – Try Michelin-recommended restaurant or casual local eatery.\n2:00 PM - 4:30 PM: Extended Truc Bach Lake Afternoon & Photography Session.\n4:30 PM - 5:30 PM: Return to hotel, rest & freshen up\n5:30 PM: Final Evening Walk – Catch sunset light on yellow buildings and alleyways.\n7:00 PM: Farewell Dinner – Upscale Vietnamese restaurant or hotel dining\n8:30 PM: Return to hotel, pack for Monday departure',
  },
  {
    date: 'Mon, July 27',
    location: 'Departure',
    flights: 'VN162: DAD → HAN. QR977: Depart HAN (19:30). Qatar Airways',
    accommodation: 'Flight',
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
    itinerary: '',
  },
  {
    date: 'Tue, July 28',
    location: 'Dublin',
    flights: 'QR19: DOH → DUB (01:15 - 06:45). Qatar Airways',
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
    itinerary: '',
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

export function getUniqueDestinations(data: TripDay[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const day of data) {
    const loc = day.location.split('→')[0].trim()
    if (loc && !['Transit', 'Departure', 'Dublin'].includes(loc) && !seen.has(loc)) {
      seen.add(loc)
      result.push(loc)
    }
  }
  return result
}

export function getTripStats(data: TripDay[]) {
  const totalCost = data.reduce((sum, d) => sum + parseCostValue(d.cost), 0)
  const flightDays = data.filter((d) => d.flights).length
  const destinations = getUniqueDestinations(data)

  return {
    totalDays: data.length,
    destinations: destinations.length,
    flightDays,
    totalCost,
  }
}
