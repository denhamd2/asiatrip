export interface BaggageAllowance {
  airline: string
  checked: string
  carryOn: string
}

export interface TripDay {
  date: string
  location: string
  flights: string
  accommodation: string
  cost: string
  notes: string
  itinerary: string
  baggage?: BaggageAllowance[]
}
