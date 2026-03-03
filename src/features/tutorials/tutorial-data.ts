export interface TutorialStep {
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly hint?: string;
}

export interface Tutorial {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: "beginner" | "intermediate" | "advanced";
  readonly estimatedMinutes: number;
  readonly steps: readonly TutorialStep[];
}

export const TUTORIALS: readonly Tutorial[] = [
  {
    id: "hello-marty",
    title: "Hello Marty!",
    description:
      "Meet your virtual robot and learn the basics. You will make Marty get ready and take first steps.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    steps: [
      {
        title: "Say Hello",
        description:
          "Every program starts by importing Marty and creating a connection. In Mini Marty, we use a virtual connection — no physical robot needed!",
        code: `from martypy import Marty

# Create a virtual Marty
my_marty = Marty("virtual")

# Make Marty get ready
await my_marty.get_ready()
print("Marty is ready!")`,
        hint: 'The Marty("virtual") part creates a simulated robot that you can see in the 3D viewer.',
      },
      {
        title: "First Steps",
        description:
          "Now let's make Marty walk! The walk() command takes a number of steps as an argument.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# Walk 3 steps forward
await my_marty.walk(3)
print("Marty walked 3 steps!")`,
        hint: "Try changing the number inside walk() to make Marty walk more or fewer steps.",
      },
      {
        title: "Stand Straight",
        description:
          "After walking, let's make Marty stand up straight. This is a good way to reset the robot's position.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()
await my_marty.walk(2)
await my_marty.stand_straight()
print("All done!")`,
      },
    ],
  },
  {
    id: "dance-moves",
    title: "Dance Moves",
    description:
      "Make Marty dance, wiggle, and celebrate! Learn how to chain multiple movement commands together.",
    difficulty: "beginner",
    estimatedMinutes: 15,
    steps: [
      {
        title: "Let's Dance!",
        description:
          "Marty loves to dance! The dance() command makes Marty perform a fun dance routine.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()
await my_marty.dance()
print("What a dance move!")`,
      },
      {
        title: "Wiggle and Celebrate",
        description:
          "Chain commands together to create a dance routine! Each command runs after the previous one finishes.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()
await my_marty.wiggle()
await my_marty.dance()
await my_marty.celebrate()
print("Party time!")`,
        hint: "Commands with 'await' run one after another. Marty finishes each action before starting the next.",
      },
      {
        title: "Kick and Slide",
        description:
          "Marty can kick and slide! These commands take a direction parameter — left or right.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()
await my_marty.kick("left")
await my_marty.kick("right")
await my_marty.slide("left")
await my_marty.slide("right")
await my_marty.celebrate()`,
        hint: "Try changing \"left\" to \"right\" to see the difference!",
      },
    ],
  },
  {
    id: "sensing-the-world",
    title: "Sensing the World",
    description:
      "Learn about Marty's sensors — check if feet are on the ground, measure distances, and read accelerometer data.",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    steps: [
      {
        title: "Foot Sensors",
        description:
          "Marty has sensors on each foot that detect whether the foot is touching the ground.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

left_on_ground = my_marty.foot_on_ground("left")
right_on_ground = my_marty.foot_on_ground("right")

print(f"Left foot on ground: {left_on_ground}")
print(f"Right foot on ground: {right_on_ground}")`,
        hint: "In the virtual world, both feet start on the ground (True). Sensors update based on Marty's pose.",
      },
      {
        title: "Distance Sensor",
        description:
          "Marty has a distance sensor that measures how far objects are in front of it, in centimetres.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
distance = my_marty.get_distance_sensor()
print(f"Distance to nearest object: {distance} cm")

# Make a decision based on distance
if distance > 50:
    print("Path is clear!")
    await my_marty.walk(2)
else:
    print("Object detected! Turning...")`,
      },
      {
        title: "Accelerometer",
        description:
          "The accelerometer tells you how Marty is tilted. It measures gravity on three axes: x, y, and z.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
accel = my_marty.get_accelerometer()
print(f"X: {accel['x']:.1f}")
print(f"Y: {accel['y']:.1f}")
print(f"Z: {accel['z']:.1f}")

# Y is about -9.8 when standing upright (gravity!)
if accel['y'] < -5:
    print("Marty is standing upright!")`,
      },
    ],
  },
  {
    id: "loops-and-control",
    title: "Loops & Control Flow",
    description:
      "Use Python loops and conditionals to make Marty repeat actions and make decisions.",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    steps: [
      {
        title: "Repeat with for loops",
        description:
          "Use a for loop to make Marty repeat an action multiple times.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# Walk forward 3 times, celebrating each time
for i in range(3):
    print(f"Walk number {i + 1}")
    await my_marty.walk(2)

await my_marty.celebrate()
print("Finished all walks!")`,
        hint: "range(3) creates the numbers 0, 1, 2 — so the loop runs 3 times.",
      },
      {
        title: "If-Else Decisions",
        description:
          "Use if-else statements to make Marty react to sensor readings.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

distance = my_marty.get_distance_sensor()

if distance > 50:
    print("Far away - walking forward!")
    await my_marty.walk(3)
elif distance > 20:
    print("Getting close - walking slowly")
    await my_marty.walk(1)
else:
    print("Too close! Kicking!")
    await my_marty.kick("right")`,
      },
      {
        title: "Functions — Reuse Your Code",
        description:
          "Write your own functions to create reusable movement patterns.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

async def happy_dance():
    """Make Marty do a happy dance routine!"""
    await my_marty.wiggle()
    await my_marty.dance()
    await my_marty.celebrate()
    print("That was fun!")

async def greeting():
    """Marty greets by walking and celebrating."""
    await my_marty.walk(2)
    await my_marty.kick("left")
    await my_marty.kick("right")

# Call our custom functions
await greeting()
await happy_dance()`,
        hint: "Functions let you name a group of commands. You can then call them by name whenever you want!",
      },
    ],
  },
  {
    id: "python-power",
    title: "Python Power",
    description:
      "Advanced Python techniques: variables, lists, and creating your own dance choreography.",
    difficulty: "advanced",
    estimatedMinutes: 25,
    steps: [
      {
        title: "Variables and Lists",
        description:
          "Store movement sequences in a list and play them back.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# Define a choreography as a list of moves
moves = ["walk", "kick", "wiggle", "dance", "celebrate"]

for move in moves:
    print(f"Performing: {move}")
    # Use getattr to call the method by name
    method = getattr(my_marty, move)
    if move == "walk":
        await method(2)
    elif move == "kick":
        await method("right")
    else:
        await method()

print("Choreography complete!")`,
        hint: "getattr() lets you call a method using its name as a string — very powerful!",
      },
      {
        title: "Eyes and Arms Control",
        description:
          "Control Marty's eye expressions and arm positions for more expressive programs.",
        code: `from martypy import Marty

my_marty = Marty("virtual")
await my_marty.get_ready()

# Cycle through eye expressions
expressions = ["normal", "wide", "angry", "excited", "squint"]

for expr in expressions:
    print(f"Eyes: {expr}")
    await my_marty.eyes(expr)

# Wave with arms
print("Waving!")
await my_marty.arms(-45, 45)
await my_marty.arms(45, -45)
await my_marty.arms(0, 0)

await my_marty.celebrate()`,
      },
      {
        title: "Put It All Together",
        description:
          "Create a full robot performance using everything you have learned!",
        code: `from martypy import Marty

my_marty = Marty("virtual")

async def intro():
    await my_marty.get_ready()
    await my_marty.eyes("excited")
    print("Welcome to the Marty Show!")

async def act_one():
    print("Act 1: The Walk")
    for i in range(2):
        await my_marty.walk(2)
        await my_marty.lean("left")
        await my_marty.lean("right")

async def act_two():
    print("Act 2: The Dance")
    await my_marty.eyes("wide")
    await my_marty.dance()
    await my_marty.circle_dance()

async def finale():
    print("Finale!")
    await my_marty.wiggle()
    await my_marty.celebrate()
    await my_marty.eyes("excited")
    print("Thank you! \\U0001f389")

# Run the show
await intro()
await act_one()
await act_two()
await finale()`,
      },
    ],
  },
];

export function getTutorialById(id: string): Tutorial | undefined {
  return TUTORIALS.find((t) => t.id === id);
}
