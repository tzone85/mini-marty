export interface Challenge {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: "beginner" | "intermediate" | "advanced";
  readonly starterCode: string;
  readonly hints: readonly string[];
  readonly expectedActions: readonly string[];
}

export const CHALLENGES: readonly Challenge[] = [
  // --- Beginner ---
  {
    id: "first-walk",
    title: "First Walk",
    description:
      "Make Marty get ready and walk 4 steps. Don't forget to stand straight at the end!",
    difficulty: "beginner",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")

# TODO: Make Marty get ready
# TODO: Walk 4 steps
# TODO: Stand straight`,
    hints: [
      "Use get_ready() to prepare Marty",
      "walk() takes the number of steps as an argument",
      "Finish with stand_straight()",
    ],
    expectedActions: ["get_ready", "walk", "stand_straight"],
  },
  {
    id: "left-right-kick",
    title: "Left-Right Kick",
    description:
      "Make Marty kick with the left foot, then the right foot, then celebrate!",
    difficulty: "beginner",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# TODO: Kick left
# TODO: Kick right
# TODO: Celebrate!`,
    hints: [
      'kick() takes "left" or "right" as a parameter',
      "Use celebrate() at the end",
    ],
    expectedActions: ["kick", "kick", "celebrate"],
  },
  {
    id: "dance-party",
    title: "Dance Party",
    description:
      "Create a dance routine using at least 3 different dance moves: dance, wiggle, and circle_dance.",
    difficulty: "beginner",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# Create your dance routine below!`,
    hints: [
      "Try dance(), wiggle(), and circle_dance()",
      "End with celebrate() for a grand finish",
    ],
    expectedActions: ["dance", "wiggle", "circle_dance"],
  },

  // --- Intermediate ---
  {
    id: "sensor-check",
    title: "Sensor Check",
    description:
      "Read all of Marty's sensors and print the values: foot sensors, distance, and accelerometer.",
    difficulty: "intermediate",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# TODO: Check if left foot is on the ground and print the result
# TODO: Check if right foot is on the ground and print the result
# TODO: Read the distance sensor and print it
# TODO: Read the accelerometer and print x, y, z values`,
    hints: [
      'Use foot_on_ground("left") and foot_on_ground("right")',
      "get_distance_sensor() returns a number in cm",
      'get_accelerometer() returns a dict with "x", "y", "z" keys',
    ],
    expectedActions: [],
  },
  {
    id: "loop-walker",
    title: "Loop Walker",
    description:
      "Use a for loop to make Marty walk 2 steps, then wiggle, 5 times in a row. Print which iteration you're on each time.",
    difficulty: "intermediate",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# TODO: Use a for loop to repeat 5 times:
#   - Print the current iteration number
#   - Walk 2 steps
#   - Wiggle`,
    hints: [
      "Use range(5) for the loop",
      "Remember to use 'await' with walk() and wiggle()",
      "Use f-strings for printing: f'Round {i+1}'",
    ],
    expectedActions: ["walk", "wiggle"],
  },
  {
    id: "smart-marty",
    title: "Smart Marty",
    description:
      "Write a program that checks the distance sensor. If distance > 50, walk forward. If 20-50, slide left. If < 20, kick!",
    difficulty: "intermediate",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

distance = my_marty.get_distance_sensor()
print(f"Distance: {distance} cm")

# TODO: Use if/elif/else to decide what Marty should do
# > 50: walk(3)
# 20-50: slide("left")
# < 20: kick("right")`,
    hints: [
      "Use if, elif, and else for three conditions",
      "Compare distance with > and <=",
    ],
    expectedActions: [],
  },

  // --- Advanced ---
  {
    id: "choreographer",
    title: "Robot Choreographer",
    description:
      "Define a list of at least 6 moves and use a loop to execute them all. Include a mix of movements, eyes, and arms.",
    difficulty: "advanced",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# TODO: Create a list of move names (strings)
# TODO: Loop through the list and call each move
# Hint: Use getattr(my_marty, move_name) to call methods by string name`,
    hints: [
      "Create a list like: moves = ['walk', 'dance', 'wiggle', ...]",
      "getattr(my_marty, name) returns the method",
      "Some methods need arguments (walk needs steps, kick needs a side)",
    ],
    expectedActions: [],
  },
  {
    id: "custom-functions",
    title: "Function Factory",
    description:
      "Create 3 custom async functions: a greeting routine, a workout routine, and a finale. Call them in sequence.",
    difficulty: "advanced",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")

# TODO: Define async def greeting(): with walk + lean moves
# TODO: Define async def workout(): with kick + slide + wiggle
# TODO: Define async def finale(): with dance + celebrate

# TODO: Call all three functions in order`,
    hints: [
      "Use 'async def' to define each function",
      "Use 'await' when calling both the functions and the Marty commands inside them",
      "Each function should have at least 2-3 Marty commands",
    ],
    expectedActions: [],
  },
  {
    id: "performance",
    title: "The Marty Show",
    description:
      "Create a full 3-act performance with an intro, main acts, and a grand finale. Use variables, loops, functions, eye expressions, and at least 8 different Marty commands.",
    difficulty: "advanced",
    starterCode: `from martypy import Marty

my_marty = Marty("virtual")

# Act 1: Introduction
# Act 2: Main Performance
# Act 3: Grand Finale

# Be creative! Use everything you've learned.`,
    hints: [
      "Plan your performance with a clear structure",
      "Mix movement commands with eye expressions for emotion",
      "Use loops for repeated patterns",
      "End with a big celebrate()!",
    ],
    expectedActions: [],
  },
];

export function getChallengesByDifficulty(
  difficulty: Challenge["difficulty"],
): readonly Challenge[] {
  return CHALLENGES.filter((c) => c.difficulty === difficulty);
}

export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}
