# Planning Guide

A study companion app that transforms learning materials into interactive flashcards and quizzes, helping students efficiently prepare for exams through AI-powered content generation.


The app handles file uploads, content parsing, AI generation, and interactive study modes with session-ba
## Essential Features
### User Identification

**Complexity Level**: Light Application (multiple features with basic state)
The app handles file uploads, content parsing, AI generation, and interactive study modes with session-based temporary state management.

## Essential Features

### User Identification
- **Functionality**: Simple name-based entry to personalize the experience
- **Purpose**: Creates a welcoming, personalized study session without authentication friction
- **Trigger**: Landing on the app for the first time in a session

- **Success criteria**: Name is captured and displayed throughout the session

### Content Upload
- **Functionality**: Accept TXT, PDF, DOCX files or up to 5 public webpage URLs (URL paste is default)
- **Purpose**: Flexible input methods for various study material formats
- **Trigger**: User clicks upload button or paste URL option from dashboard
- **Progression**: Click upload → Select file/paste URL → Show upload progress → Parse content → Truncate if needed → Confirm success
- **Success criteria**: Content is successfully extracted, truncated to fit token limits (~48,000 characters), and ready for AI processing

### Flashcard Generation
- **Functionality**: AI creates question-answer pairs from uploaded content using multi-model fallback (gpt-4o-mini → gpt-4o)
- **Purpose**: Transform study materials into digestible Q&A format for active recall practice
- **Trigger**: Automatic after content parsing completes
- **Progression**: Content parsed → AI generates flashcards (with automatic model fallback if token limits exceeded) → Display card deck → User flips cards → Navigate through deck
- **Success criteria**: Minimum 5-10 flashcards generated with clear Q&A format, graceful handling of token limit errors

### Quiz Generation
- **Functionality**: AI creates multiple-choice questions with correct answers using multi-model fallback
- **Purpose**: Self-assessment to identify knowledge gaps
- **Trigger**: Automatic after content parsing completes
- **Progression**: Select quiz mode → Display question → User selects answer → Show immediate feedback → Display score
- **Success criteria**: Minimum 5-10 questions generated with 3-4 options each, score tracking

## Edge Case Handling
- **Empty/Invalid Files**: Display friendly error message suggesting valid content formats
  - Muted (Light Gray `oklch(0.92 0.01 250)`): Muted text `oklch(0.50 0.02 265)` - Ratio 6.2:1 ✓
- **Insufficient Content**: Notify user if material is too short to generate meaningful study content (< 100 words)
- **AI Generation Errors**: Graceful fallback with retry option and clear error messaging
- **Session Expiry**: Gentle warning that refreshing will lose current study materials

## Design Direction
The design should feel academic yet modern - like a premium study tool that combines the focus of a traditional library with the efficiency of digital learning. Minimal interface with purposeful use of color to highlight progress and interactive elements, creating a calm, focused study environment.


Complementary palette with educational warmth

- **Primary Color**: Deep Indigo `oklch(0.35 0.15 265)` - Communicates focus, learning, and academic seriousness
- **Secondary Colors**: Soft Slate `oklch(0.65 0.02 250)` for supporting UI elements, conveying calm and neutrality
- **Accent Color**: Energetic Amber `oklch(0.75 0.15 70)` for success states, correct answers, and CTAs - adds warmth and motivation
  4. Upload progress indicators
  - Background (Warm White `oklch(0.98 0.01 90)`): Deep charcoal text `oklch(0.25 0.02 265)` - Ratio 13.2:1 ✓
  - Card (Pure White `oklch(1 0 0)`): Deep charcoal text `oklch(0.25 0.02 265)` - Ratio 14.1:1 ✓
  - Primary (Deep Indigo `oklch(0.35 0.15 265)`): White text `oklch(1 0 0)` - Ratio 8.7:1 ✓
  - Secondary (Soft Slate `oklch(0.65 0.02 250)`): Deep charcoal `oklch(0.25 0.02 265)` - Ratio 4.8:1 ✓
  - Accent (Energetic Amber `oklch(0.75 0.15 70)`): Deep charcoal `oklch(0.25 0.02 265)` - Ratio 5.1:1 ✓
  - Dialog (file upload modal) with backdrop blur

  - Separator (co
Typography should feel scholarly and highly readable for extended study sessions, using Inter for its excellent screen legibility and professional academic feel.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Inter SemiBold/24px/normal letter-spacing




























































## Edge Case Handling
- **Empty/Invalid Files**: Display friendly error message suggesting valid content formats
- **Insufficient Content**: Notify user if material is too short to generate meaningful study content (< 100 words)
- **AI Generation Errors**: Graceful fallback with retry option and clear error messaging
- **Token Limit Errors**: Automatic fallback from gpt-4o-mini to gpt-4o when content exceeds model token limits
- **Session Expiry**: Gentle warning that refreshing will lose current study materials

## Design Direction
The design should feel academic yet modern - like a premium study tool that combines the focus of a traditional library with the efficiency of digital learning. Minimal interface with purposeful use of color to highlight progress and interactive elements, creating a calm, focused study environment.


Complementary palette with educational warmth

- **Primary Color**: Deep Indigo `oklch(0.35 0.15 265)` - Communicates focus, learning, and academic seriousness
- **Secondary Colors**: Soft Slate `oklch(0.65 0.02 250)` for supporting UI elements, conveying calm and neutrality
- **Accent Color**: Energetic Amber `oklch(0.75 0.15 70)` for success states, correct answers, and CTAs - adds warmth and motivation
  4. Upload progress indicators
  - Background (Warm White `oklch(0.98 0.01 90)`): Deep charcoal text `oklch(0.25 0.02 265)` - Ratio 13.2:1 ✓
  - Card (Pure White `oklch(1 0 0)`): Deep charcoal text `oklch(0.25 0.02 265)` - Ratio 14.1:1 ✓
  - Primary (Deep Indigo `oklch(0.35 0.15 265)`): White text `oklch(1 0 0)` - Ratio 8.7:1 ✓
  - Secondary (Soft Slate `oklch(0.65 0.02 250)`): Deep charcoal `oklch(0.25 0.02 265)` - Ratio 4.8:1 ✓
  - Accent (Energetic Amber `oklch(0.75 0.15 70)`): Deep charcoal `oklch(0.25 0.02 265)` - Ratio 5.1:1 ✓
  - Dialog (file upload modal) with backdrop blur

  - Separator (co
Typography should feel scholarly and highly readable for extended study sessions, using Inter for its excellent screen legibility and professional academic feel.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Inter SemiBold/24px/normal letter-spacing



























































