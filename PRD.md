# Planning Guide

A study companion app that transforms learning materials into interactive flashcards and quizzes, helping students efficiently prepare for exams through AI-powered content generation.

**Experience Qualities**: 
1. **Focused** - Clean, distraction-free interface that keeps students engaged with their study materials
2. **Intuitive** - Seamless flow from upload to study with clear progress indicators and immediate feedback
3. **Encouraging** - Positive reinforcement through micro-interactions and satisfying progress visualization

**Complexity Level**: Light Application (multiple features with basic state)
The app handles file uploads, content parsing, AI generation, and interactive study modes with session-based temporary state management.

## Essential Features

### User Identification
- **Functionality**: Simple name-based entry to personalize the experience
- **Purpose**: Creates a welcoming, personalized study session without authentication friction
- **Trigger**: Landing on the app for the first time in a session
- **Progression**: View welcome screen → Enter name → Access main dashboard
- **Success criteria**: Name is captured and displayed throughout the session

### Content Upload
- **Functionality**: Accept TXT, PDF, DOCX files or public webpage URLs
- **Purpose**: Flexible input methods for various study material formats
- **Trigger**: User clicks upload button or paste URL option from dashboard
- **Progression**: Click upload → Select file/paste URL → Show upload progress → Parse content → Confirm success
- **Success criteria**: Content is successfully extracted and ready for AI processing

### Flashcard Generation
- **Functionality**: AI creates question-answer pairs from uploaded content
- **Purpose**: Active recall practice to strengthen memory retention
- **Trigger**: Automatic after content parsing completes
- **Progression**: Content parsed → AI generates flashcards → Display card deck → User flips cards → Navigate through deck
- **Success criteria**: Minimum 5-10 flashcards generated with clear Q&A format

### Quiz Generation
- **Functionality**: AI creates multiple-choice questions with correct answers
- **Purpose**: Self-assessment to identify knowledge gaps
- **Trigger**: User switches to quiz mode after content is processed
- **Progression**: Select quiz mode → Display question → User selects answer → Show immediate feedback → Display score
- **Success criteria**: Minimum 5-10 questions generated with 3-4 options each, score tracking

## Edge Case Handling
- **Empty/Invalid Files**: Display friendly error message suggesting valid content formats
- **URL Parsing Failures**: Show tooltip reminder about public URLs and offer file upload alternative
- **Insufficient Content**: Notify user if material is too short to generate meaningful study content (< 100 words)
- **AI Generation Errors**: Graceful fallback with retry option and clear error messaging
- **Session Expiry**: Gentle warning that refreshing will lose current study materials

## Design Direction
The design should feel academic yet modern - like a premium study tool that combines the focus of a traditional library with the efficiency of digital learning. Minimal interface with purposeful use of color to highlight progress and interactive elements, creating a calm, focused study environment.

## Color Selection
Complementary palette with educational warmth

- **Primary Color**: Deep Indigo `oklch(0.35 0.15 265)` - Communicates focus, learning, and academic seriousness
- **Secondary Colors**: Soft Slate `oklch(0.65 0.02 250)` for supporting UI elements, conveying calm and neutrality
- **Accent Color**: Energetic Amber `oklch(0.75 0.15 70)` for success states, correct answers, and CTAs - adds warmth and motivation
- **Foreground/Background Pairings**:
  - Background (Warm White `oklch(0.98 0.01 90)`): Deep charcoal text `oklch(0.25 0.02 265)` - Ratio 13.2:1 ✓
  - Card (Pure White `oklch(1 0 0)`): Deep charcoal text `oklch(0.25 0.02 265)` - Ratio 14.1:1 ✓
  - Primary (Deep Indigo `oklch(0.35 0.15 265)`): White text `oklch(1 0 0)` - Ratio 8.7:1 ✓
  - Secondary (Soft Slate `oklch(0.65 0.02 250)`): Deep charcoal `oklch(0.25 0.02 265)` - Ratio 4.8:1 ✓
  - Accent (Energetic Amber `oklch(0.75 0.15 70)`): Deep charcoal `oklch(0.25 0.02 265)` - Ratio 5.1:1 ✓
  - Muted (Light Gray `oklch(0.92 0.01 250)`): Muted text `oklch(0.50 0.02 265)` - Ratio 6.2:1 ✓

## Font Selection
Typography should feel scholarly and highly readable for extended study sessions, using Inter for its excellent screen legibility and professional academic feel.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Inter SemiBold/24px/normal letter-spacing
  - H3 (Card Questions): Inter Medium/20px/normal letter-spacing
  - Body (Answers, Content): Inter Regular/16px/relaxed line-height (1.6)
  - Small (Hints, Metadata): Inter Regular/14px/normal letter-spacing
  - Button Text: Inter Medium/16px/slight letter-spacing (0.01em)

## Animations
Animations should reinforce the learning flow - card flips that mimic physical flashcards, smooth transitions between questions, and celebratory micro-interactions for correct answers that provide dopamine hits without distraction.

- **Purposeful Meaning**: Card flip animations create physical metaphor for active recall; progress bars fill with satisfying easing; success states pulse gently to celebrate achievement
- **Hierarchy of Movement**: 
  1. Flashcard flips (most important interaction)
  2. Question transitions in quiz mode
  3. Answer feedback animations
  4. Upload progress indicators
  5. Subtle hover states on interactive elements

## Component Selection
- **Components**: 
  - Card (flashcard display, quiz questions) with elevated shadow
  - Button (primary actions, navigation) with solid fills for primary, outline for secondary
  - Input (name entry, URL paste) with focus states and validation feedback
  - Progress (upload status, quiz completion) with smooth filling animation
  - Dialog (file upload modal) with backdrop blur
  - Tabs (switch between flashcards/quiz modes) with underline indicator
  - Badge (question counter, score display) with subtle background
  - Separator (content sections) for visual breathing room
  - Alert (error states, helpful tips) with appropriate severity colors
  
- **Customizations**: 
  - FlashCard component with 3D flip animation using framer-motion
  - QuizOption component with selectable states and correctness feedback
  - FileUploader component with drag-drop zone and file type indicators
  
- **States**: 
  - Buttons: Default solid primary, hover with slight scale, active with deeper press, disabled with reduced opacity
  - Inputs: Default with subtle border, focus with primary ring and border color change, error with destructive border
  - Cards: Default elevated, hover with increased shadow, flipped with backface visibility
  
- **Icon Selection**: 
  - Upload: UploadSimple for file upload action
  - Link: Link for URL paste option
  - Cards: Cards for flashcard mode
  - Question: Question for quiz mode
  - Check/X: Check/X for answer feedback
  - ArrowLeft/Right: Navigation between cards
  - Play: CaretRight for starting quiz
  
- **Spacing**: 
  - Container padding: p-6 (24px) on mobile, p-8 (32px) on desktop
  - Card spacing: gap-6 between elements
  - Section spacing: space-y-8 for major sections
  - Button groups: gap-3
  
- **Mobile**: 
  - Stack upload options vertically on mobile
  - Single column layout for cards with swipe gestures
  - Fixed bottom navigation for quiz controls
  - Reduced font sizes (H1: 24px, H2: 20px, Body: 15px)
  - Touch-friendly targets minimum 44px height
