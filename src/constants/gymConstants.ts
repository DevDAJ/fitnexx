export const GYM_STORAGE_KEY = "fitnexx-gym-v1";

export type EquipmentCategory =
  | "strength"
  | "cardio"
  | "bodyweight"
  | "flexibility"
  | "other";

export type Equipment = {
  id: string;
  name: string;
  category: EquipmentCategory;
};

export type GymState = {
  equipmentCatalog: Equipment[];
  myEquipmentIds: string[];
  exerciseEquipment: Record<string, string[]>;
};

export const SEEDED_EQUIPMENT: Equipment[] = [
  // Strength
  { id: "eq-barbell", name: "Barbell", category: "strength" },
  { id: "eq-dumbbells", name: "Dumbbells", category: "strength" },
  { id: "eq-ez-bar", name: "EZ Bar", category: "strength" },
  { id: "eq-kettlebell", name: "Kettlebell", category: "strength" },
  { id: "eq-cable-machine", name: "Cable Machine", category: "strength" },
  { id: "eq-smith-machine", name: "Smith Machine", category: "strength" },
  { id: "eq-power-rack", name: "Power Rack", category: "strength" },
  { id: "eq-flat-bench", name: "Flat Bench", category: "strength" },
  { id: "eq-incline-bench", name: "Incline Bench", category: "strength" },
  { id: "eq-decline-bench", name: "Decline Bench", category: "strength" },
  { id: "eq-plates", name: "Weight Plates", category: "strength" },
  { id: "eq-leg-press", name: "Leg Press Machine", category: "strength" },
  { id: "eq-lat-pulldown", name: "Lat Pulldown Machine", category: "strength" },
  { id: "eq-pulley", name: "High-Low Pulley", category: "strength" },
  { id: "eq-preacher-bench", name: "Preacher Curl Bench", category: "strength" },
  { id: "eq-pec-deck", name: "Pec Deck Machine", category: "strength" },

  // Cardio
  { id: "eq-treadmill", name: "Treadmill", category: "cardio" },
  { id: "eq-exercise-bike", name: "Exercise Bike", category: "cardio" },
  { id: "eq-rowing-machine", name: "Rowing Machine", category: "cardio" },
  { id: "eq-elliptical", name: "Elliptical", category: "cardio" },
  { id: "eq-stair-climber", name: "Stair Climber", category: "cardio" },
  { id: "eq-jump-rope", name: "Jump Rope", category: "cardio" },

  // Bodyweight
  { id: "eq-pullup-bar", name: "Pull-up Bar", category: "bodyweight" },
  { id: "eq-dip-bars", name: "Dip Bars", category: "bodyweight" },
  { id: "eq-ab-wheel", name: "Ab Wheel", category: "bodyweight" },
  { id: "eq-yoga-mat", name: "Yoga Mat", category: "bodyweight" },
  { id: "eq-resistance-bands", name: "Resistance Bands", category: "bodyweight" },
  { id: "eq-trx", name: "TRX Suspension Trainer", category: "bodyweight" },
  { id: "eq-parallette", name: "Parallette Bars", category: "bodyweight" },
  { id: "eq-gymnastic-rings", name: "Gymnastic Rings", category: "bodyweight" },

  // Flexibility / Recovery
  { id: "eq-foam-roller", name: "Foam Roller", category: "flexibility" },
  { id: "eq-stretch-straps", name: "Stretch Straps", category: "flexibility" },
  { id: "eq-massage-gun", name: "Massage Gun", category: "flexibility" },
  { id: "eq-lacrosse-ball", name: "Lacrosse Ball", category: "flexibility" },
  { id: "eq-yoga-blocks", name: "Yoga Blocks", category: "flexibility" },
];

export function seededGymState(): GymState {
  return {
    equipmentCatalog: SEEDED_EQUIPMENT,
    myEquipmentIds: [],
    exerciseEquipment: {},
  };
}
