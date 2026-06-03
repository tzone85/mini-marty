# Mini Marty — Training Guide

A guide for parents and kids to learn programming together using Mini Marty.

## Getting Started

### Setup (5 minutes)

1. Open your terminal and navigate to the project folder
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open http://localhost:3000 in your browser

### First Look (5 minutes)

When you open Mini Marty, you will see:

- A **header** with navigation links at the top
- A **sidebar** on the left with context-specific options
- The **main area** showing the current page
- A **3D Marty robot** on the home page that you can rotate by clicking and dragging

Explore the navigation: Home, Block Editor, Python Editor, Tutorials, and Challenges.

---

## Learning Path

We recommend following these sessions in order. Each session is designed for 30-45 minutes.

### Session 1: Block Coding (Beginner)

**Goal:** Understand the concept of giving instructions to a robot.

1. Go to the **Block Editor**
2. Open the **Motion** category in the toolbox
3. Drag a "when program starts" block (from Events) to the workspace
4. Connect "get ready" and "walk 2 steps" blocks below it
5. Click **Save** to save your work

**Discussion points:**
- What is a program? (A list of instructions for a computer/robot)
- Why does order matter? (Marty needs to get ready before walking)
- What happens if you change the number of steps?

### Session 2: First Python Program (Beginner)

**Goal:** Write your first Python code and see the virtual robot respond.

1. Go to the **Python Editor**
2. Wait for "Python ready" (green dot) in the top right
3. The starter code is already there — click **Run**
4. Watch Marty move in the 3D viewport on the right!
5. Try the "Hello Marty!" tutorial (Tutorials page)

**Key concepts to explain:**
- `from martypy import Marty` — importing a tool/library
- `Marty("virtual")` — creating an instance of the robot
- `await` — waiting for an action to complete before the next one
- `print()` — showing text output in the console

### Session 3: Movement Commands (Beginner)

**Goal:** Learn all of Marty's movement commands.

1. Go to the **Tutorials** page
2. Work through "Hello Marty!" and "Dance Moves" tutorials
3. Try the "First Walk" and "Dance Party" challenges

**Experiment together:**
- Change `walk(2)` to `walk(5)` — what happens?
- Change `kick("left")` to `kick("right")`
- Chain multiple commands: walk → kick → dance → celebrate

### Session 4: Sensors & Decisions (Intermediate)

**Goal:** Learn about sensors and if-else statements.

1. Work through the "Sensing the World" tutorial
2. Try the "Sensor Check" challenge

**Key concepts:**
- Sensors give robots information about the world
- `if`/`elif`/`else` lets the program make decisions
- The distance sensor measures how far away things are
- The accelerometer detects tilt and gravity

### Session 5: Loops & Functions (Intermediate)

**Goal:** Learn to repeat actions and organise code into functions.

1. Work through "Loops & Control Flow" tutorial
2. Try "Loop Walker" and "Smart Marty" challenges

**Key concepts:**
- `for i in range(5):` — repeat something 5 times
- Functions let you name a group of commands
- `async def my_function():` — defining a reusable function
- Why functions are useful (avoid copy-pasting code)

### Session 6: Advanced Python (Advanced)

**Goal:** Use lists, variables, and advanced patterns.

1. Work through the "Python Power" tutorial
2. Try the advanced challenges: "Robot Choreographer", "Function Factory", "The Marty Show"

**Key concepts:**
- Lists store multiple items: `moves = ["walk", "dance", "kick"]`
- `getattr()` calls methods by name — powerful for dynamic code
- Building a full program with structure (intro, main, finale)

---

## Tips for Parents

### Making it fun
- Let your child experiment freely — there is no way to break anything
- Celebrate small wins: "Look, you made Marty walk!"
- Take turns: you code one command, they code the next
- Challenge each other: "Can you make Marty do 3 different things?"

### When they get stuck
- Use the **hints** in challenges — they reveal one at a time
- Check the **API Reference** on the Tutorials page
- Read error messages together — they often say exactly what went wrong
- Look at tutorial code for similar examples

### Building confidence
- Start with Block Editor if Python feels intimidating
- The "Hello Marty" tutorial is designed to be impossible to fail
- Emphasise that professional programmers Google things and make mistakes constantly
- Save working programs with the Save button so they can show others

### Extending the learning
- Ask "what if" questions: "What if Marty kicked 10 times?"
- Suggest modifications: "Can you add more moves to your dance?"
- Introduce debugging: intentionally break code and fix it together
- Connect to real-world concepts: "Traffic lights use if-else too!"

---

## Troubleshooting

### Python says "loading" for a long time
The Python runtime (Pyodide) is about 10MB and loads from a CDN. On a slow connection, this can take 30-60 seconds. After the first load, it is cached by your browser.

### 3D scene is blank
Make sure your browser supports WebGL. Most modern browsers do. Try Chrome or Firefox if you're having issues.

### Code runs but Marty does not move
Make sure you're using `await` before movement commands:
- Correct: `await my_marty.walk(2)`
- Incorrect: `my_marty.walk(2)` (this sends the command but does not wait for it)

### Block Editor is empty
Blockly requires JavaScript to be enabled. If blocks disappear after saving, try clearing your browser's localStorage for localhost:3000.

---

## Progression Checklist

Use this to track your child's progress:

**Beginner**
- [ ] Explored the 3D Marty on the home page
- [ ] Created a block program in the Block Editor
- [ ] Ran their first Python program
- [ ] Completed "Hello Marty!" tutorial
- [ ] Completed "Dance Moves" tutorial
- [ ] Solved all 3 beginner challenges

**Intermediate**
- [ ] Completed "Sensing the World" tutorial
- [ ] Used an if-else statement
- [ ] Completed "Loops & Control Flow" tutorial
- [ ] Used a for loop
- [ ] Wrote their first function
- [ ] Solved all 3 intermediate challenges

**Advanced**
- [ ] Completed "Python Power" tutorial
- [ ] Used lists and variables
- [ ] Created a multi-function program
- [ ] Solved all 3 advanced challenges
- [ ] Created their own original program from scratch!

---

## Troubleshooting on Windows

Mini Marty runs on Windows 10 / 11 (PowerShell or Windows Terminal). Below are the most common rough edges.

### Line endings

Git on Windows usually converts `\n` to `\r\n`. The repo has not pinned a `.gitattributes` yet, so if your editor or a script trips on the difference, run:

```powershell
git config --global core.autocrlf input
```

This keeps the working tree as `\n` for source files while still letting Windows tools open them.

### Installing on PowerShell

Use PowerShell (not Command Prompt). If `npm install` fails with a script execution policy error:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then close and reopen the terminal and retry.

### WebGL check

The 3D scene needs WebGL. Open `chrome://gpu` in Chrome or `about:support` in Firefox; look for "WebGL: Hardware accelerated". If it says "Software only" or "Disabled":

1. Update your graphics driver.
2. In Chrome, enable `chrome://flags/#ignore-gpu-blocklist` if your GPU is on the blocklist but otherwise healthy.
3. As a last resort, the Block Editor and Python Editor still work without WebGL; only the home-page scene degrades.

### Long paths

If `npm install` errors with `ENAMETOOLONG`, enable long paths:

```powershell
git config --global core.longpaths true
```

And in an admin PowerShell:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### Antivirus slowing `node_modules`

Windows Defender scans every file in `node_modules`, which can multiply install time. Add the project folder to Defender's exclusion list under Settings -> Virus & threat protection -> Exclusions if you control the machine.
