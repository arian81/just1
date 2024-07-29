import { z } from "zod";

const ReviewSchema = z.object({
  text: z
    .object({
      text: z.string().optional(),
    })
    .optional(),
});

const RegularOpeningHoursSchema = z.object({
  openNow: z.boolean(),
});

const PaymentOptionsSchema = z.object({
  acceptsCreditCards: z.boolean().optional(),
  acceptsDebitCards: z.boolean().optional(),
  acceptsCashOnly: z.boolean().optional(),
  acceptsNfc: z.boolean().optional(),
});

const ParkingOptionsSchema = z.object({
  freeParkingLot: z.boolean().optional(),
  paidParkingLot: z.boolean().optional(),
  freeStreetParking: z.boolean().optional(),
  paidStreetParking: z.boolean().optional(),
  valetParking: z.boolean().optional(),
  freeGarageParking: z.boolean().optional(),
  paidGarageParking: z.boolean().optional(),
});

const AccessibilityOptionsSchema = z.object({
  wheelchairAccessibleParking: z.boolean().optional(),
  wheelchairAccessibleEntrance: z.boolean().optional(),
  wheelchairAccessibleRestroom: z.boolean().optional(),
  wheelchairAccessibleSeating: z.boolean().optional(),
});

const PlaceSchema = z.object({
  id: z.string(),
  types: z.array(z.string()),
  rating: z.number(),
  googleMapsUri: z.string(),
  regularOpeningHours: RegularOpeningHoursSchema.optional(),
  businessStatus: z.string(),
  priceLevel: z.string().optional(),
  displayName: z.object({
    text: z.string(),
  }),
  takeout: z.boolean().optional(),
  dineIn: z.boolean().optional(),
  curbsidePickup: z.boolean().optional(),
  reservable: z.boolean().optional(),
  servesLunch: z.boolean().optional(),
  servesDinner: z.boolean().optional(),
  servesBeer: z.boolean().optional(),
  servesWine: z.boolean().optional(),
  servesBrunch: z.boolean().optional(),
  editorialSummary: z
    .object({
      text: z.string(),
    })
    .optional(),
  reviews: z.array(ReviewSchema).optional(),
  outdoorSeating: z.boolean().optional(),
  liveMusic: z.boolean().optional(),
  menuForChildren: z.boolean().optional(),
  servesCocktails: z.boolean().optional(),
  servesDessert: z.boolean().optional(),
  servesCoffee: z.boolean().optional(),
  allowsDogs: z.boolean().optional(),
  restroom: z.boolean().optional(),
  goodForGroups: z.boolean().optional(),
  goodForWatchingSports: z.boolean().optional(),
  paymentOptions: PaymentOptionsSchema.optional(),
  parkingOptions: ParkingOptionsSchema.optional(),
  accessibilityOptions: AccessibilityOptionsSchema.optional(),
});

const PlaceSchemaLite = z.object({
  id: z.string(),
  types: z.array(z.string()),
  rating: z.number(),
  googleMapsUri: z.string(),
  regularOpeningHours: RegularOpeningHoursSchema.optional(),
  businessStatus: z.string(),
  priceLevel: z.string().optional(),
  displayName: z.object({
    text: z.string(),
  }),
  editorialSummary: z
    .object({
      text: z.string(),
    })
    .optional(),
  reviews: z.array(ReviewSchema).optional(),
});

export const NearbyPlacesSchema = z.object({
  places: z.array(PlaceSchemaLite),
});
