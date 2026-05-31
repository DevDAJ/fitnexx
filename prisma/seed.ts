import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString =
  process.env.FITNEXX_PRISMA_DATABASE_URL ?? process.env.FITNEXX_POSTGRES_URL;

if (!connectionString) {
  throw new Error("Missing FITNEXX_PRISMA_DATABASE_URL or FITNEXX_POSTGRES_URL");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const muscleGroups = [
  { id: "mg-chest", name: "Chest" },
  { id: "mg-back", name: "Back" },
  { id: "mg-legs", name: "Legs" },
  { id: "mg-shoulders", name: "Shoulders" },
  { id: "mg-arms", name: "Arms" },
  { id: "mg-core", name: "Core" },
];

type ExerciseSeed = {
  id: string;
  name: string;
  muscleGroupName: string;
  requiredEquipmentIds: string[];
};

const exercises: ExerciseSeed[] = [
  // ── Chest ──
  { id: "ex-bench-press", name: "Bench Press", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-barbell", "eq-flat-bench"] },
  { id: "ex-incline-bench", name: "Incline Bench Press", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-barbell", "eq-incline-bench"] },
  { id: "ex-decline-bench", name: "Decline Bench Press", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-barbell", "eq-decline-bench"] },
  { id: "ex-dumbbell-bench", name: "Dumbbell Bench Press", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-dumbbells", "eq-flat-bench"] },
  { id: "ex-incline-dumbbell", name: "Incline Dumbbell Press", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-dumbbells", "eq-incline-bench"] },
  { id: "ex-dumbbell-fly", name: "Dumbbell Fly", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-dumbbells", "eq-flat-bench"] },
  { id: "ex-cable-fly", name: "Cable Fly", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-cable-machine"] },
  { id: "ex-push-up", name: "Push-up", muscleGroupName: "Chest", requiredEquipmentIds: [] },
  { id: "ex-pec-deck", name: "Pec Deck Fly", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-pec-deck"] },
  { id: "ex-dip-chest", name: "Chest Dip", muscleGroupName: "Chest", requiredEquipmentIds: ["eq-dip-bars"] },

  // ── Back ──
  { id: "ex-barbell-row", name: "Barbell Row", muscleGroupName: "Back", requiredEquipmentIds: ["eq-barbell"] },
  { id: "ex-dumbbell-row", name: "Dumbbell Row", muscleGroupName: "Back", requiredEquipmentIds: ["eq-dumbbells", "eq-flat-bench"] },
  { id: "ex-pull-up", name: "Pull-up", muscleGroupName: "Back", requiredEquipmentIds: ["eq-pullup-bar"] },
  { id: "ex-lat-pulldown", name: "Lat Pulldown", muscleGroupName: "Back", requiredEquipmentIds: ["eq-lat-pulldown"] },
  { id: "ex-seated-cable-row", name: "Seated Cable Row", muscleGroupName: "Back", requiredEquipmentIds: ["eq-cable-machine"] },
  { id: "ex-t-bar-row", name: "T-Bar Row", muscleGroupName: "Back", requiredEquipmentIds: ["eq-barbell"] },
  { id: "ex-deadlift", name: "Deadlift", muscleGroupName: "Back", requiredEquipmentIds: ["eq-barbell", "eq-plates"] },
  { id: "ex-straight-arm-pulldown", name: "Straight Arm Pulldown", muscleGroupName: "Back", requiredEquipmentIds: ["eq-cable-machine"] },
  { id: "ex-inverted-row", name: "Inverted Row", muscleGroupName: "Back", requiredEquipmentIds: ["eq-pullup-bar"] },

  // ── Legs ──
  { id: "ex-back-squat", name: "Back Squat", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-barbell", "eq-power-rack"] },
  { id: "ex-front-squat", name: "Front Squat", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-barbell", "eq-power-rack"] },
  { id: "ex-romanian-deadlift", name: "Romanian Deadlift", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-barbell"] },
  { id: "ex-leg-press", name: "Leg Press", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-leg-press"] },
  { id: "ex-leg-extension", name: "Leg Extension", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-leg-press"] },
  { id: "ex-leg-curl", name: "Leg Curl", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-leg-press"] },
  { id: "ex-goblet-squat", name: "Goblet Squat", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-kettlebell"] },
  { id: "ex-lunges", name: "Lunges", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-bulgarian-split", name: "Bulgarian Split Squat", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-dumbbells", "eq-flat-bench"] },
  { id: "ex-calf-raise", name: "Calf Raise", muscleGroupName: "Legs", requiredEquipmentIds: [] },
  { id: "ex-hack-squat", name: "Hack Squat", muscleGroupName: "Legs", requiredEquipmentIds: ["eq-leg-press"] },
  { id: "ex-glute-bridge", name: "Glute Bridge", muscleGroupName: "Legs", requiredEquipmentIds: [] },

  // ── Shoulders ──
  { id: "ex-overhead-press", name: "Overhead Press", muscleGroupName: "Shoulders", requiredEquipmentIds: ["eq-barbell"] },
  { id: "ex-dumbbell-ohp", name: "Dumbbell Overhead Press", muscleGroupName: "Shoulders", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-lateral-raise", name: "Lateral Raise", muscleGroupName: "Shoulders", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-front-raise", name: "Front Raise", muscleGroupName: "Shoulders", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-rear-delt-fly", name: "Rear Delt Fly", muscleGroupName: "Shoulders", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-upright-row", name: "Upright Row", muscleGroupName: "Shoulders", requiredEquipmentIds: ["eq-barbell"] },
  { id: "ex-arnold-press", name: "Arnold Press", muscleGroupName: "Shoulders", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-face-pull-shoulders", name: "Face Pull", muscleGroupName: "Shoulders", requiredEquipmentIds: ["eq-cable-machine"] },

  // ── Arms ──
  { id: "ex-bicep-curl", name: "Bicep Curl", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-hammer-curl", name: "Hammer Curl", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-ez-bar-curl", name: "EZ Bar Curl", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-ez-bar"] },
  { id: "ex-preacher-curl", name: "Preacher Curl", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-dumbbells", "eq-preacher-bench"] },
  { id: "ex-cable-curl", name: "Cable Curl", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-cable-machine"] },
  { id: "ex-tricep-pushdown", name: "Tricep Pushdown", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-cable-machine"] },
  { id: "ex-skull-crusher", name: "Skull Crusher", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-ez-bar", "eq-flat-bench"] },
  { id: "ex-overhead-tricep", name: "Overhead Tricep Extension", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-dumbbells"] },
  { id: "ex-close-grip-bench", name: "Close-Grip Bench Press", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-barbell", "eq-flat-bench"] },
  { id: "ex-dip-tricep", name: "Tricep Dip", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-dip-bars"] },
  { id: "ex-concentration-curl", name: "Concentration Curl", muscleGroupName: "Arms", requiredEquipmentIds: ["eq-dumbbells"] },

  // ── Core ──
  { id: "ex-crunch", name: "Crunch", muscleGroupName: "Core", requiredEquipmentIds: [] },
  { id: "ex-plank", name: "Plank", muscleGroupName: "Core", requiredEquipmentIds: [] },
  { id: "ex-ab-wheel-rollout", name: "Ab Wheel Rollout", muscleGroupName: "Core", requiredEquipmentIds: ["eq-ab-wheel"] },
  { id: "ex-hanging-leg-raise", name: "Hanging Leg Raise", muscleGroupName: "Core", requiredEquipmentIds: ["eq-pullup-bar"] },
  { id: "ex-russian-twist", name: "Russian Twist", muscleGroupName: "Core", requiredEquipmentIds: [] },
  { id: "ex-cable-crunch", name: "Cable Crunch", muscleGroupName: "Core", requiredEquipmentIds: ["eq-cable-machine"] },
  { id: "ex-weighted-plank", name: "Weighted Plank", muscleGroupName: "Core", requiredEquipmentIds: ["eq-plates"] },
  { id: "ex-pallof-press", name: "Pallof Press", muscleGroupName: "Core", requiredEquipmentIds: ["eq-cable-machine"] },
  { id: "ex-sit-up", name: "Sit-up", muscleGroupName: "Core", requiredEquipmentIds: [] },
  { id: "ex-bicycle-crunch", name: "Bicycle Crunch", muscleGroupName: "Core", requiredEquipmentIds: [] },

  // ── Cardio ──
  { id: "ex-treadmill-run", name: "Treadmill Run", muscleGroupName: "Core", requiredEquipmentIds: ["eq-treadmill"] },
  { id: "ex-stationary-bike", name: "Stationary Bike", muscleGroupName: "Core", requiredEquipmentIds: ["eq-exercise-bike"] },
  { id: "ex-rowing-machine", name: "Rowing Machine", muscleGroupName: "Core", requiredEquipmentIds: ["eq-rowing-machine"] },
  { id: "ex-elliptical", name: "Elliptical", muscleGroupName: "Core", requiredEquipmentIds: ["eq-elliptical"] },
  { id: "ex-stair-climber", name: "Stair Climber", muscleGroupName: "Core", requiredEquipmentIds: ["eq-stair-climber"] },
  { id: "ex-jump-rope", name: "Jump Rope", muscleGroupName: "Core", requiredEquipmentIds: ["eq-jump-rope"] },
];

const equipments = [
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
  { id: "eq-treadmill", name: "Treadmill", category: "cardio" },
  { id: "eq-exercise-bike", name: "Exercise Bike", category: "cardio" },
  { id: "eq-rowing-machine", name: "Rowing Machine", category: "cardio" },
  { id: "eq-elliptical", name: "Elliptical", category: "cardio" },
  { id: "eq-stair-climber", name: "Stair Climber", category: "cardio" },
  { id: "eq-jump-rope", name: "Jump Rope", category: "cardio" },
  { id: "eq-pullup-bar", name: "Pull-up Bar", category: "bodyweight" },
  { id: "eq-dip-bars", name: "Dip Bars", category: "bodyweight" },
  { id: "eq-ab-wheel", name: "Ab Wheel", category: "bodyweight" },
  { id: "eq-yoga-mat", name: "Yoga Mat", category: "bodyweight" },
  { id: "eq-resistance-bands", name: "Resistance Bands", category: "bodyweight" },
  { id: "eq-trx", name: "TRX Suspension Trainer", category: "bodyweight" },
  { id: "eq-parallette", name: "Parallette Bars", category: "bodyweight" },
  { id: "eq-gymnastic-rings", name: "Gymnastic Rings", category: "bodyweight" },
  { id: "eq-foam-roller", name: "Foam Roller", category: "flexibility" },
  { id: "eq-stretch-straps", name: "Stretch Straps", category: "flexibility" },
  { id: "eq-massage-gun", name: "Massage Gun", category: "flexibility" },
  { id: "eq-lacrosse-ball", name: "Lacrosse Ball", category: "flexibility" },
  { id: "eq-yoga-blocks", name: "Yoga Blocks", category: "flexibility" },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.exercise.deleteMany();
  await prisma.equipment.deleteMany();

  console.log("Seeding equipment...");
  await prisma.equipment.createMany({ data: equipments });

  console.log("Seeding exercises...");
  await prisma.exercise.createMany({ data: exercises });

  console.log(`Seeded ${equipments.length} equipment items`);
  console.log(`Seeded ${exercises.length} exercises`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
