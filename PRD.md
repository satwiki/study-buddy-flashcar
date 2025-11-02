# Planning Guide

A study companion app that transforms learning materials into interactive flashcards and quizzes, helping students efficiently prepare for exams through AI-powered content generation.

**Experience Qualities**:
1. **Focused** - Minimal distractions with clear, purposeful interactions that keep attention on learning
2. **Intelligent** - AI-powered content generation that adapts to different material types and handles errors gracefully
3. **Effortless** - Smooth flow from upload to study with automatic content processing and instant feedback

**Complexity Level**: Light Application (multiple features with basic state)
The app handles file uploads, content parsing, AI generation with JSON validation, and interactive study modes with session-based temporary state management.

## Essential Features

### User Identification
- **Functionality**: Simple name-based entry to personalize the experience
- **Purpose**: Creates a welcoming, personalized study session without authentication friction
- **Trigger**: Landing on the app for the first time in a session
- **Progression**: App loads → Name input field → User enters name → Submit → Welcome screen
- **Success criteria**: Name is captured and displayed throughout the session

### Content Upload
- **Functionality**: Accept TXT, PDF, DOCX files or up to 5 public webpage URLs (URL paste is default)
- **Purpose**: Flexible input methods for various study material formats
- **Trigger**: User clicks upload button or paste URL option from dashboard
- **Progression**: Click upload → Select file/paste URL → Show upload progress → Parse content → Truncate if needed → Confirm success
- **Success criteria**: Content is successfully extracted, truncated to fit token limits (~400,000 characters for gpt-4o-mini), and ready for AI processing

### Flashcard Generation
- **Functionality**: AI creates 25 question-answer pairs from uploaded content using multi-model fallback with JSON validation
- **Purpose**: Transform study materials into digestible Q&A format for active recall practice
- **Trigger**: Automatic after content parsing completes
- **Progression**: Content parsed → AI generates flashcards with structured output → Validate JSON format → Display card deck → User flips cards → Navigate through deck
- **Success criteria**: Exactly 25 flashcards generated with validated JSON structure, automatic model fallback on errors, clear error messages for parsing failures

### Quiz Generation
- **Functionality**: AI creates 25 multiple-choice questions with justifications using multi-model fallback with JSON validation
- **Purpose**: Self-assessment to identify knowledge gaps with explanations for learning
- **Trigger**: Automatic after content parsing completes
- **Progression**: Select quiz mode → Display question → User selects answer → Show immediate feedback with justification → Display score
- **Success criteria**: Exactly 25 questions generated with validated JSON structure, each with 4 options and justification, graceful error handling

## Edge Case Handling
- **Empty/Invalid Files**: Display friendly error message suggesting valid content formats
- **Insufficient Content**: Notify user if material is too short to generate meaningful study content
- **AI Generation Errors**: Graceful fallback with retry option and clear error messaging
- **Token Limit Errors**: Automatic fallback from gpt-4o-mini to gpt-4o when content exceeds model token limits
- **JSON Parsing Errors**: Validate JSON structure before parsing, clean markdown code blocks, provide specific error messages
- **Malformed LLM Output**: Detect and handle improperly formatted responses with validation checks
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
  - H3 (Card Titles): Inter Medium/20px/normal
  - Body (Content): Inter Regular/16px/1.6 line-height
  - Small (Captions): Inter Regular/14px/muted color

## Animations
Animations should feel purposeful and scholarly - subtle transitions that guide focus without distraction, like pages turning in a book.

- **Purposeful Meaning**: Use gentle fades and slides to transition between study modes, card flips for revealing answers
- **Hierarchy of Movement**: 
  1. Loading progress bars for AI generation (most prominent)
  2. Card flip animations for flashcards
  3. Subtle hover states on interactive elements
  4. Gentle fades for mode transitions

## Component Selection
- **Components**: 
  - Card for flashcards, quiz questions, and welcome screen
  - Button for primary actions (Start Study, Next Card, Submit Answer)
  - Progress for AI generation status and quiz score
  - Dialog for file upload modal with backdrop blur
  - Tabs for switching between flashcard and quiz modes
  - Input for name entry and URL paste
  - Separator for content sections
- **Customizations**: 
  - Custom flashcard flip animation using framer-motion
  - Styled file upload zone with drag-and-drop visual feedback
  - Progress indicators with smooth transitions
- **States**: 
  - Buttons: Default, hover (subtle lift + shadow), active (pressed), disabled (muted)
  - Cards: Default, hover (subtle shadow increase), flipped (for flashcards)
  - Inputs: Default, focused (primary ring), error (destructive border), success (accent border)
- **Icon Selection**: 
  - Upload icon for content upload
  - Cards icon for flashcard mode
  - Question icon for quiz mode
  - Check/X icons for correct/incorrect answers
  - Arrow icons for navigation
- **Spacing**: 
  - Container padding: 6 (24px)
  - Section gaps: 8 (32px)
  - Card gaps: 4 (16px)
  - Button padding: 4 horizontally, 2 vertically
- **Mobile**: 
  - Single column layout on mobile
  - Full-width cards with reduced padding
  - Larger touch targets (minimum 44px)
  - Stacked button groups
  - Collapsible sections for quiz history
