/**
 * briganceActivities.js
 * BRIGANCE® Readiness Activities — Combined Master Data File
 *
 * Source: BRIGANCE® Readiness Activities © 2024 Hawker Brownlow Publishing (CA11854)
 * Compiled by: Little Grove Child, Adolescent & Family Health
 * Internal clinical use only — for CHDC App suite (GitHub Pages)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ACTIVITY COUNT BY BATCH
 * ─────────────────────────────────────────────────────────────────────────────
 *  Batch 1 — Gross Motor                    53  (grossMotorActivities.js)
 *  Batch 2 — Language & Fine Motor          55  (languageAndFineMotorActivities.js)
 *  Batch 3 — Literacy                       99  (literacyActivities.js)
 *  Batch 4 — Numeracy                      139  (numeracyActivities.js)
 *  Batch 5 — Social-Emotional & Self-Help   90  (socialEmotionalAndSelfHelpActivities.js)
 *  TOTAL                                   436
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * KNOWN ISSUES — RESOLVE BEFORE WIRING ROUTING
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  1. F-5 MERGE REQUIRED
 *     printsPersonalData appears in TWO batches:
 *       - Batch 2 (languageAndFineMotorActivities.js): domain key "colours"
 *         has iedIII ["D-9", "F-5"] — the F-5 reference here is to COLOURS
 *         (Identifies/names colours), NOT Prints Personal Data.
 *         *** IMPORTANT: On re-review, F-5 in Batch 2 is the COLOURS domain
 *         (D-9/F-5 = identifies and sorts colours). The Prints Personal Data
 *         activities in Batch 2 appear under domain key "colours" only because
 *         of how that original file was structured — verify against IED III. ***
 *       - Batch 3 (literacyActivities.js): domain key "printsPersonalData"
 *         (prefix PD-, 9 activities)
 *     ACTION: Verify F-5 mapping in IED III record form. If colours and prints
 *     personal data ARE distinct items, ensure routing table uses separate keys.
 *
 *  2. G-1 DISAMBIGUATION REQUIRED
 *     G-1 appears in TWO batches with DIFFERENT content:
 *       - Batch 2 domain "fineMotorManipulation": iedIII includes "G-1"
 *         (context: holding/manipulating objects — fine motor)
 *       - Batch 4 domain "numberConcepts": iiedItem "G-1"
 *         (context: number concepts — mathematics)
 *     These are different IED III items. Verify codes before routing.
 *     In this file they are kept as separate domain keys:
 *       domains.fineMotorManipulation  (Batch 2 G-1)
 *       domains.numberConcepts         (Batch 4 G-1)
 *
 *  3. conceptsOfTime ROUTING
 *     Maps to Science: Scientific Knowledge in BRIGANCE, NOT Mathematics.
 *     Domain key: domains.conceptsOfTime
 *     If app routes by BRIGANCE subject area, handle separately from
 *     numeracy/maths domains.
 *
 *  4. personalDataResponse vs printsPersonalData
 *     These are DISTINCT domains:
 *       domains.personalDataResponse   — VERBAL response (Batch 5, prefix PD2-)
 *       domains.printsPersonalData     — WRITTEN output  (Batch 3, prefix PD-)
 *     Both are kept with separate keys. Do NOT merge.
 *
 *  5. ALL IED III ITEM CODES IN BATCHES 3, 4, 5 ARE INFERRED
 *     Verify against the IED III record form before wiring routing logic.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DOMAIN KEY INDEX (44 domains)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  GROSS MOTOR (Batch 1)
 *    standing              A-4, B-1       10 activities
 *    walking               B-2, B-8       10 activities
 *    running               B-4            12 activities
 *    jumpingHopping        B-5, B-6       13 activities
 *    ballSkills            B-7, B-9, B-10  8 activities
 *
 *  LANGUAGE & FINE MOTOR (Batch 2)
 *    bodyParts             D-8, F-21      15 activities
 *    colours               D-9, F-5       13 activities   ← see F-5 note above
 *    fineMotorManipulation C-1, C-2, G-1  14 activities   ← see G-1 note above
 *    cutsWithScissors      C-6            13 activities
 *
 *  LITERACY (Batch 3)
 *    bookKnowledge         A-1 (inferred) 11 activities
 *    preHandwriting        F-1 (inferred)  7 activities
 *    copiesForms           F-2 (inferred) 14 activities
 *    visualDiscrimination  E-1 (inferred) 20 activities
 *    printAwareness        E-2 (inferred)  3 activities
 *    readsLetters          E-3 (inferred) 10 activities
 *    printsLetters         F-3 (inferred) 10 activities
 *    printsPersonalData    F-5 (inferred)  9 activities   ← see F-5 note above
 *    phonologicalAwareness E-5 (inferred) 15 activities
 *
 *  NUMERACY (Batch 4)
 *    numberConcepts        G-1 (inferred) 16 activities   ← see G-1 note above
 *    counting              G-2 (inferred) 12 activities
 *    readsNumerals         G-3 (inferred) 10 activities
 *    numeralComprehension  G-4 (inferred) 14 activities
 *    numeralsInSequence    G-5 (inferred) 12 activities
 *    joinsSets             G-6 (inferred)  5 activities
 *    quantitativeConcepts  H-1 (inferred) 35 activities
 *    shapeConcepts         H-2 (inferred)  8 activities
 *    directionalConcepts   H-3 (inferred) 21 activities
 *    conceptsOfTime        I-1 (inferred)  6 activities   ← Science domain
 *
 *  SOCIAL-EMOTIONAL & SELF-HELP (Batch 5)
 *    generalSocialEmotional  INFERRED      3 activities
 *    playSkills               INFERRED      5 activities
 *    initiativeEngagement     INFERRED      2 activities
 *    selfRegulation           INFERRED     10 activities
 *    personalDataResponse     INFERRED     15 activities
 *    selfHelpSkills           INFERRED     12 activities
 */


// =============================================================================
// ROUTING TABLE
// Maps IED III assessment item codes to domain keys in briganceActivities.domains
// Update this table once IED III codes are verified against the record form.
// =============================================================================

const briganceRouter = {

  // ─────────────────────────────────────────────────────────────────────────
  // PHYSICAL DEVELOPMENT: GROSS MOTOR
  // ─────────────────────────────────────────────────────────────────────────
  "A-4":  "standing",          // Pre-ambulatory: Standing Position Skills
  "B-1":  "standing",          // Gross-Motor: Standing
  "B-2":  "walking",           // Gross-Motor: Walking
  "B-8":  "walking",           // Gross-Motor: Balancing on a Beam
  "B-4":  "running",           // Gross-Motor: Running, Skipping and Galloping
  "B-5":  "jumpingHopping",    // Gross-Motor: Jumping
  "B-6":  "jumpingHopping",    // Gross-Motor: Hopping
  "B-7":  "ballSkills",        // Gross-Motor: Kicking
  "B-9":  "ballSkills",        // Gross-Motor: Catching
  "B-10": "ballSkills",        // Gross-Motor: Rolling and Throwing

  // ─────────────────────────────────────────────────────────────────────────
  // PHYSICAL DEVELOPMENT: FINE MOTOR
  // ─────────────────────────────────────────────────────────────────────────
  "C-1":  "fineMotorManipulation",  // General Eye/Finger/Hand Manipulative Skills
  "C-2":  "fineMotorManipulation",  // Builds Tower with Blocks
  "C-5":  "copiesForms",            // Copies Forms (was incorrectly F-2)
  "C-6":  "cutsWithScissors",       // Cuts with Scissors

  // ─────────────────────────────────────────────────────────────────────────
  // LANGUAGE DEVELOPMENT
  // ─────────────────────────────────────────────────────────────────────────
  "D-5":  "personalDataResponse",   // Knows Personal Information (verbal)
  "D-8":  "bodyParts",              // Identifies Parts of the Body
  "D-9":  "colours",                // Identifies Colours
  "D-10": "directionalConcepts",    // Understands Directional/Positional Concepts (was H-3)

  // ─────────────────────────────────────────────────────────────────────────
  // ACADEMIC/COGNITIVE: LITERACY
  // ─────────────────────────────────────────────────────────────────────────
  "E-1":  "bookKnowledge",          // Responds to and Experience with Books
  "E-5":  "visualDiscrimination",   // Visual Discrimination ✓ (confirmed correct)
  "E-8a": "readsLetters",           // Matches Uppercase Letters
  "E-8b": "readsLetters",           // Identifies Uppercase Letters
  "E-9a": "readsLetters",           // Matches Lowercase Letters
  "E-9b": "readsLetters",           // Identifies Lowercase Letters
  "E-10": "printsLetters",          // Prints Uppercase Letters in Sequence (was F-3)
  "E-11": "printsLetters",          // Prints Lowercase Letters in Sequence
  "E-14": "printsPersonalData",     // Prints Personal Information (was F-5)
  "E-3":  "phonologicalAwareness",  // Blends Word Parts into One Word
  "E-4":  "phonologicalAwareness",  // Identifies Blended Word Parts as Words
  "E-15": "phonologicalAwareness",  // Identifies Rhymes
  "E-16": "phonologicalAwareness",  // Identifies Beginning Sounds
  "E-19": "phonologicalAwareness",  // Deletes Word Parts and Phonemes in Words

  // Pre-handwriting: C-3 (Early Handwriting Skills) and/or E-27 (Quality of Printing)
  // The Batch 3 "preHandwriting" domain activities span both — route both codes here
  "C-3":  "preHandwriting",         // Early Handwriting Skills (was incorrectly F-1)
  "E-27": "preHandwriting",         // Quality of Printing

  // Print awareness: closest match is E-1 (already mapped to bookKnowledge)
  // E-2 = Identifies Common Signs — a reasonable secondary mapping
  "E-2":  "printAwareness",         // Identifies Common Signs

  // ─────────────────────────────────────────────────────────────────────────
  // ACADEMIC/COGNITIVE: MATHEMATICS AND SCIENCE
  // ─────────────────────────────────────────────────────────────────────────
  "F-1":  "numberConcepts",         // Understands Number Concepts (was G-1)
  "F-2":  "counting",               // Counts by Rote (was G-2)
  "F-3":  "quantitativeConcepts",   // Compares Different Amounts (was H-1)
  "F-4":  "shapeConcepts",          // Identifies Shapes (was H-2)
  "F-5":  "colours",                // Sorts Objects by Size, Colour, Shape
                                    // ← NOTE: secondary mapping; primary colour item is D-9
                                    // F-5 activities should be in a "sortingClassification"
                                    // domain ideally — for now routed to colours as closest
  "F-6":  "numberConcepts",         // Recognises Quantities (secondary number concept)
  "F-7":  "numeralComprehension",   // Matches Quantities with Numerals (was G-4)
  "F-9":  "readsNumerals",          // Reads Numerals (was G-3)
  "F-11": "numeralsInSequence",     // Writes Numerals in Sequence (was G-5)
  "F-15": "joinsSets",              // Determines Total of Two Sets (was G-6)
  "F-19": "conceptsOfTime",         // Understands Time and Reads a Clock (was I-1)

  // ─────────────────────────────────────────────────────────────────────────
  // DAILY LIVING: SELF-HELP
  // ─────────────────────────────────────────────────────────────────────────
  "G-2":  "selfHelpSkills",   // Undressing
  "G-3":  "selfHelpSkills",   // Dressing
  "G-4":  "selfHelpSkills",   // Unfastening
  "G-5":  "selfHelpSkills",   // Fastening
  "G-6":  "selfHelpSkills",   // Toileting
  "G-7":  "selfHelpSkills",   // Bathing
  "G-8":  "selfHelpSkills",   // Grooming

  // ─────────────────────────────────────────────────────────────────────────
  // SOCIAL AND EMOTIONAL DEVELOPMENT
  // ─────────────────────────────────────────────────────────────────────────
  "H-1":  "generalSocialEmotional",  // Relationships with Adults (was J-1_INFERRED)
  "H-2":  "playSkills",              // Play and Relationships with Peers (was J-2_INFERRED)
  "H-3":  "initiativeEngagement",    // Motivation and Self-Confidence (was J-3_INFERRED)
  "H-4":  "selfRegulation",          // Prosocial Skills and Behaviours (was J-4_INFERRED)

};

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN METADATA INDEX
// Maps domain keys to their verified IED III codes and labels
// ─────────────────────────────────────────────────────────────────────────────

const briganceDomainIndex = [
  // GROSS MOTOR
  { key: "standing",             iedIII: ["A-4","B-1"],              label: "Standing and Balance",                       section: "Physical Development: Gross-Motor Skills" },
  { key: "walking",              iedIII: ["B-2","B-8"],              label: "Walking and Balance Beam",                   section: "Physical Development: Gross-Motor Skills" },
  { key: "running",              iedIII: ["B-4"],                    label: "Running, Skipping and Galloping",            section: "Physical Development: Gross-Motor Skills" },
  { key: "jumpingHopping",       iedIII: ["B-5","B-6"],              label: "Jumping and Hopping",                        section: "Physical Development: Gross-Motor Skills" },
  { key: "ballSkills",           iedIII: ["B-7","B-9","B-10"],       label: "Ball Skills",                                section: "Physical Development: Gross-Motor Skills" },
  // FINE MOTOR
  { key: "fineMotorManipulation",iedIII: ["C-1","C-2"],              label: "Holding and Manipulating Objects",           section: "Physical Development: Fine-Motor Skills" },
  { key: "copiesForms",          iedIII: ["C-5"],                    label: "Copies Forms",                               section: "Physical Development: Fine-Motor Skills" },
  { key: "cutsWithScissors",     iedIII: ["C-6"],                    label: "Cuts with Scissors",                         section: "Physical Development: Fine-Motor Skills" },
  { key: "preHandwriting",       iedIII: ["C-3","E-27"],             label: "Pre-handwriting / Quality of Printing",      section: "Physical Development: Fine-Motor Skills / Literacy" },
  // LANGUAGE
  { key: "bodyParts",            iedIII: ["D-8"],                    label: "Identifies Parts of the Body",               section: "Language Development" },
  { key: "colours",              iedIII: ["D-9","F-5"],              label: "Identifies and Sorts Colours",               section: "Language Development / Mathematics" },
  { key: "directionalConcepts",  iedIII: ["D-10"],                   label: "Directional and Positional Concepts",        section: "Language Development" },
  { key: "personalDataResponse", iedIII: ["D-5"],                    label: "Knows Personal Information (verbal)",        section: "Language Development" },
  // LITERACY
  { key: "bookKnowledge",        iedIII: ["E-1"],                    label: "Response to and Experience with Books",      section: "Academic/Cognitive: Literacy" },
  { key: "printAwareness",       iedIII: ["E-2"],                    label: "Identifies Common Signs / Print Awareness",  section: "Academic/Cognitive: Literacy" },
  { key: "visualDiscrimination", iedIII: ["E-5"],                    label: "Visual Discrimination",                      section: "Academic/Cognitive: Literacy" },
  { key: "readsLetters",         iedIII: ["E-8a","E-8b","E-9a","E-9b"], label: "Matches and Identifies Letters",          section: "Academic/Cognitive: Literacy" },
  { key: "printsLetters",        iedIII: ["E-10","E-11"],            label: "Prints Letters in Sequence",                 section: "Academic/Cognitive: Literacy" },
  { key: "printsPersonalData",   iedIII: ["E-14"],                   label: "Prints Personal Information",                section: "Academic/Cognitive: Literacy" },
  { key: "phonologicalAwareness",iedIII: ["E-3","E-4","E-15","E-16","E-19"], label: "Phonological Awareness",             section: "Academic/Cognitive: Literacy" },
  // MATHEMATICS
  { key: "numberConcepts",       iedIII: ["F-1","F-6"],              label: "Number Concepts",                            section: "Academic/Cognitive: Mathematics and Science" },
  { key: "counting",             iedIII: ["F-2"],                    label: "Counts by Rote",                             section: "Academic/Cognitive: Mathematics and Science" },
  { key: "quantitativeConcepts", iedIII: ["F-3"],                    label: "Compares Different Amounts",                 section: "Academic/Cognitive: Mathematics and Science" },
  { key: "shapeConcepts",        iedIII: ["F-4"],                    label: "Identifies Shapes",                          section: "Academic/Cognitive: Mathematics and Science" },
  { key: "numeralComprehension", iedIII: ["F-7"],                    label: "Matches Quantities with Numerals",           section: "Academic/Cognitive: Mathematics and Science" },
  { key: "readsNumerals",        iedIII: ["F-9"],                    label: "Reads Numerals",                             section: "Academic/Cognitive: Mathematics and Science" },
  { key: "numeralsInSequence",   iedIII: ["F-11"],                   label: "Writes Numerals in Sequence",               section: "Academic/Cognitive: Mathematics and Science" },
  { key: "joinsSets",            iedIII: ["F-15"],                   label: "Determines Total of Two Sets",               section: "Academic/Cognitive: Mathematics and Science" },
  { key: "conceptsOfTime",       iedIII: ["F-19"],                   label: "Understands Time and Reads a Clock",         section: "Academic/Cognitive: Mathematics and Science" },
  // SELF-HELP
  { key: "selfHelpSkills",       iedIII: ["G-2","G-3","G-4","G-5","G-6","G-7","G-8"], label: "Self-Help Skills", section: "Daily Living" },
  // SOCIAL-EMOTIONAL
  { key: "generalSocialEmotional",iedIII: ["H-1"],                   label: "Relationships with Adults",                  section: "Social and Emotional Development" },
  { key: "playSkills",            iedIII: ["H-2"],                   label: "Play and Relationships with Peers",          section: "Social and Emotional Development" },
  { key: "initiativeEngagement",  iedIII: ["H-3"],                   label: "Motivation and Self-Confidence",             section: "Social and Emotional Development" },
  { key: "selfRegulation",        iedIII: ["H-4"],                   label: "Prosocial Skills and Behaviours",            section: "Social and Emotional Development" },
];

// =============================================================================
// BRIGANCE ACTIVITIES — COMBINED DOMAINS
// =============================================================================

const briganceActivities = {

  meta: {
    totalActivities: 393,
    batches: 5,
    lastUpdated: "2025",
    version: "1.0",
    notes: [
      "IED III codes verified June 2025 against physical correlation chart (pp.431-436).",
      "Router corrected — all previously inferred codes have been replaced with verified codes.",
      "See briganceRouter for full domain index with verified IED III codes."
    ]
  },

  domains: {

    // ─────────────────────────────────────────────────────────
    // BATCH 1 — GROSS MOTOR
    // Source: grossMotorActivities.js | 53 activities
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────
  // B-1 / A-4 : STANDING & BALANCE
  // ─────────────────────────────────────────────
  standing: {
    iedIII: ["A-4", "B-1"],
    domain: "Physical Health and Development: Gross-Motor Skills",
    developmentalSequence: {
      "1-0": ["Stands on one foot with one hand held (each side)"],
      "2-0": ["Stands on tiptoes briefly", "Stands on one foot briefly"],
      "3-0": ["Stands on either foot briefly", "Stands on one foot for 1 second", "Stands on one foot for 5 seconds (each side)"],
      "4-0": ["Stands on one foot for 10 seconds"],
      "5-0": ["Stands on other foot for 10 seconds"],
      "6-0": ["Stands on one foot briefly with eyes closed (each side)"]
    },
    activities: [
      {
        id: "standing_1",
        title: "Roll and Stand Up",
        audience: ["educator"],
        materials: ["Padded mat or carpeted area"],
        description: "Children lie on their backs, roll sideways the length of the mat, roll back the other way, then stand up. Progress to forward rolls (somersaults): squat, hands shoulder-width apart, chin tucked, push off to roll forward and land on feet.",
        rationale: "Builds core strength and body awareness needed for balance."
      },
      {
        id: "standing_2",
        title: "Rock 'n' Roll",
        audience: ["educator"],
        materials: ["Padded mat or carpeted area"],
        description: "Children sit on the mat, hug their knees, rock backward onto their shoulders and forward again several times, then roll forward and stand up.",
        rationale: "Develops vestibular awareness and prepares body for controlled standing."
      },
      {
        id: "standing_3",
        title: "Beanbag Bend",
        audience: ["both"],
        materials: ["One beanbag or similar small object per child"],
        description: "Place a beanbag on the floor in front of the child. Ask them to bend at the knees, pick up the beanbag, and stand back up. Repeat bending at the waist as a variation.",
        rationale: "Practises controlled lowering and rising — foundational standing balance."
      },
      {
        id: "standing_4",
        title: "Simon Says Balance",
        audience: ["both"],
        materials: ["None"],
        description: "Child lifts one leg and balances with arms out. Play Simon Says with movement commands (wave to a friend, flap like a bird) while holding balance on one foot. Repeat on the other foot.",
        rationale: "Challenges single-leg balance with distraction — key for functional balance skills."
      },
      {
        id: "standing_5",
        title: "Lift and Point",
        audience: ["both"],
        materials: ["None"],
        description: "Child stands with arms out to the side, lifts one knee until the thigh is parallel to the ground, points toes down on the raised foot, and holds for 5 seconds. Repeat on the other side. Progress to doing this with eyes closed.",
        rationale: "Develops hip flexor control and single-leg balance."
      },
      {
        id: "standing_6",
        title: "Stork Stand",
        audience: ["both"],
        materials: ["None"],
        description: "Child shifts weight onto one foot, lifts the other, and places the sole of the lifted foot against the calf of the standing leg. Hold for 5 seconds. Swap legs. Once comfortable, try with eyes closed.",
        rationale: "Classic single-leg balance task directly aligned to developmental standing milestones."
      },
      {
        id: "standing_7",
        title: "Stand Like a Statue",
        audience: ["both"],
        materials: ["None"],
        description: "Children try out action poses (a ballerina curtsey, a cricket player mid-swing, a karate kick). On a signal, they freeze and hold their pose for 5 seconds. Take turns choosing poses for others to copy.",
        rationale: "Builds postural control and body awareness in a playful, imaginative way."
      },
      {
        id: "standing_8",
        title: "Freeze Dance",
        audience: ["both"],
        materials: ["Music player and lively music"],
        description: "Children dance or move freely to music. When the music stops, they freeze and hold their position. Vary the intervals. Progress to freezing with eyes closed.",
        rationale: "Develops dynamic to static balance transitions — fun and engaging for all ages."
      },
      {
        id: "standing_9",
        title: "Balance Beam — Flat",
        audience: ["educator"],
        materials: ["Non-raised balance beam", "Beanbags"],
        description: "Place beam flat on the floor. Children progress through: feet together, heel-to-toe, one foot, other foot, eyes closed, and balancing with a beanbag on their head or passing it hand to hand while standing.",
        rationale: "Provides a structured progression for standing balance on a reduced surface."
      },
      {
        id: "standing_10",
        title: "Balance Beam — Raised",
        audience: ["educator"],
        materials: ["Balance beam raised 10–15 cm", "Beanbags"],
        description: "Children walk and stand on a raised beam with support, progressing to independent standing and eventually standing with hands on hips or head. Safety mats required.",
        rationale: "Increases balance challenge with height — use only when flat beam skills are established."
      }
    ]
  },

  // ─────────────────────────────────────────────
  // B-2 / B-8 : WALKING & BALANCE BEAM
  // ─────────────────────────────────────────────
  walking: {
    iedIII: ["B-2", "B-8"],
    domain: "Physical Health and Development: Gross-Motor Skills",
    developmentalSequence: {
      "1-0": ["Walks well, rarely falls", "Walks sideways 2 steps", "Walks erect with arm swing", "Walks backward 2–4 steps"],
      "1-6": ["Walks balance beam with both hands held"],
      "2-0": ["Walks backward 2m", "Walks on tiptoes 3–4 steps", "Walks on a straight line"],
      "3-0": ["Walks heel-to-toe 3–5 steps forward", "Walks forward on balance beam with one hand held"],
      "4-0": ["Walks heel-to-toe 2m on a line", "Walks balance beam with hands at sides"],
      "5-0": ["Walks backward toe-to-heel 4 steps", "Walks balance beam heel-to-toe"],
      "6-0": ["Walks backward toe-to-heel 2m", "Walks balance beam backward heel-to-toe"]
    },
    activities: [
      {
        id: "walking_1",
        title: "Walk This Way",
        audience: ["both"],
        materials: ["None"],
        description: "Invite children to pretend to walk in different ways: silently, through deep snow, up a steep hill, in water to their knees, on a tightrope, like they are marching in a parade. Talk about how their body changes with each type of walking.",
        rationale: "Encourages body awareness and weight-shift control across varied walking challenges."
      },
      {
        id: "walking_2",
        title: "Animal Walks",
        audience: ["both"],
        materials: ["None"],
        description: "Children imitate animal walks: Bear walk (all fours, same-side limbs together), Elephant walk (bent at waist, clasped hands as trunk), Gorilla walk (bent knees, loose arms), Rooster walk (hands under armpits, chest high), Inchworm (hands to floor, walk feet forward), Seal slide (on belly, walk on hands dragging feet).",
        rationale: "Animal walks develop strength, coordination and bilateral movement patterns in a fun, motivating way."
      },
      {
        id: "walking_3",
        title: "Ankle Walk",
        audience: ["both"],
        materials: ["None"],
        description: "Child bends over, grasps their ankles, and walks forward without letting go. Variation: walk sideways or backward.",
        rationale: "Builds body coordination and spatial awareness of lower limb position."
      },
      {
        id: "walking_4",
        title: "Walk the Line",
        audience: ["educator"],
        materials: ["Masking tape"],
        description: "Use masking tape to make a pattern (figure-eight, diamond, flower). Children walk the pattern on tiptoes, heel-to-toe, and backward.",
        rationale: "Structured walking path targets heel-to-toe walking and directional control."
      },
      {
        id: "walking_5",
        title: "Walking Rope Shapes",
        audience: ["both"],
        materials: ["One skipping rope per child"],
        description: "Child lays rope in a straight line and walks along it, backward beside it, and straddles it walking forward and backward. Then forms rope into a circle and walks around outside, inside, and straddles it.",
        rationale: "Rope provides a tactile and visual guide for line-walking and directional walking tasks."
      },
      {
        id: "walking_6",
        title: "Spinning",
        audience: ["educator"],
        materials: ["None"],
        description: "Shift weight to the ball of one foot and use the other foot to spin. Arms held out for balance. Progress to spinning faster, higher heel, opposite direction, other foot, and with hands overhead or on hips. Limit if dizziness occurs.",
        rationale: "Develops dynamic balance and vestibular processing."
      },
      {
        id: "walking_7",
        title: "Obstacle Course Walk",
        audience: ["educator"],
        materials: ["Boxes, ropes, cones, mats, blocks, bowling pins"],
        description: "Build an obstacle course. Children walk through it normally, then on tiptoes, then marching. Give special directions at each station (e.g., dance around the cones, tiptoe between the bowling pins).",
        rationale: "Obstacle courses build walking coordination across varied terrain and movement demands."
      },
      {
        id: "walking_8",
        title: "Chalk Ladder Walk",
        audience: ["educator"],
        materials: ["Chalk"],
        description: "Draw a ladder (8–10 rungs) on the playground. Children progress through: walking forward/backward placing feet between rungs, on the rungs, one foot each side, and finally animal walks through the ladder.",
        rationale: "Ladder activities develop foot placement accuracy and directional walking control."
      },
      {
        id: "walking_9",
        title: "Balance Beam — Flat (Walking)",
        audience: ["educator"],
        materials: ["Non-raised balance beam", "Beanbags or books"],
        description: "Place beam flat, broad side down. Children progress through: walking with hands held, standing still, walking with arms out, walking with hands on hips/head, balancing an object on head, turning mid-beam, dominant foot leading, and walking backward toe-to-heel.",
        rationale: "Walking beam progressions directly target the B-8 balance beam assessment sequence."
      },
      {
        id: "walking_10",
        title: "Balance Beam — Raised (Walking)",
        audience: ["educator"],
        materials: ["Balance beam raised 10cm", "Beanbags or books", "Safety mats"],
        description: "Raise beam 10cm with end supports. Children walk with hands held, then independently, forward and backward with arms for balance then hands on hips/waist/head. Progress to picking up an object mid-beam, walking sideways, and balancing beanbags on the backs of hands.",
        rationale: "Raised beam walking challenges full balance and coordination at the appropriate developmental level."
      }
    ]
  },

  // ─────────────────────────────────────────────
  // B-4 : RUNNING, SKIPPING & GALLOPING
  // ─────────────────────────────────────────────
  running: {
    iedIII: ["B-4"],
    domain: "Physical Health and Development: Gross-Motor Skills",
    developmentalSequence: {
      "1-0": ["Hurried walk (no flight phase)", "Runs stiffly with some falling"],
      "2-0": ["Runs well, rarely falling", "Runs well, stops and starts with ease"],
      "3-0": ["Runs leaning forward on balls of feet", "Skips on one foot"],
      "4-0": ["Gallops (inefficiently)", "Runs 45m in 15 seconds"],
      "5-0": ["Runs with efficient mature pattern", "Runs 45m in 12 seconds", "Skips alternating feet"],
      "6-0": ["Gallops skilfully", "Runs and kicks a rolled ball"]
    },
    activities: [
      {
        id: "running_1",
        title: "Free Run",
        audience: ["educator"],
        materials: ["None — large open space needed"],
        description: "Children run freely, practising stopping and starting on command. Call 'Stop' and 'Go' with intervals of about 2 minutes. Encourage safe spacing between children.",
        rationale: "Builds running fluency, stopping control, and spatial awareness."
      },
      {
        id: "running_2",
        title: "Kite Tails",
        audience: ["both"],
        materials: ["One long ribbon or streamer per child"],
        description: "Each child holds a ribbon and runs with it flowing behind them like a kite tail — swooping, turning, spinning. Once confident with running, extend to skipping or galloping with the kite tail.",
        rationale: "Motivating visual feedback encourages sustained running with varied movement patterns."
      },
      {
        id: "running_3",
        title: "Duck, Duck, Goose",
        audience: ["educator"],
        materials: ["None"],
        description: "Children sit in a circle. One child (the tapper) walks around tapping heads and saying 'Duck'. When they say 'Goose', that child chases the tapper back to the empty space. Encourages running with direction change and quick starting.",
        rationale: "Classic game for running speed, reactive starts, and directional change."
      },
      {
        id: "running_4",
        title: "Possum in the Tree",
        audience: ["educator"],
        materials: ["None"],
        description: "Pairs form 'trees' by facing each other and joining hands into an arch. 'Possums' stand inside each tree. On signal, possums run to a new tree. Only one possum per tree. Child without a tree swaps roles with a tree child.",
        rationale: "Develops running with purpose, spatial navigation, and quick decision-making."
      },
      {
        id: "running_5",
        title: "Chasey",
        audience: ["both"],
        materials: ["Open area with two safety zones 6–12m apart"],
        description: "One or two children are chasers standing between two safety zones. Other players try to run between zones without being tagged. Tagged players become chasers.",
        rationale: "Fundamental running game developing speed, direction change, and awareness of others."
      },
      {
        id: "running_6",
        title: "Farmyard Freeze and Run",
        audience: ["educator"],
        materials: ["None — open outdoor space"],
        description: "One child is the farmer at one end. Other children are farm animals at the other end (~12m). Farmer calls an animal and command. Animals move forward; farmer turns and counts to 10, then shouts 'Stop!' Anyone still moving returns to the start. First to reach the farmer wins.",
        rationale: "Combines running control with body awareness and listening skills."
      },
      {
        id: "running_7",
        title: "Running Relays",
        audience: ["educator"],
        materials: ["Cones or markers", "One beanbag per team"],
        description: "Teams run to a marker, loop around it, and return to pass a beanbag to the next team member. Encourage cheering for teammates.",
        rationale: "Relay format builds running endurance and turn-taking."
      },
      {
        id: "running_8",
        title: "Renegade Relays (Obstacle Course)",
        audience: ["educator"],
        materials: ["Beanbags, hula hoops, cups, cones, boxes"],
        description: "Set up an obstacle course for relay races. Variations: run like a propeller plane (swinging arms in arcs), imitate an animal, carry a cup of water, balance a potato in a bowl, or roll a hula hoop.",
        rationale: "Obstacle relay develops complex running coordination, body control, and object manipulation."
      },
      {
        id: "running_9",
        title: "Follow the Footprints (Skipping)",
        audience: ["educator"],
        materials: ["Coloured contact paper — 2 colours", "Scissors"],
        description: "Cut right footprints in one colour and left footprints in another. Stick to the floor in a skipping pattern (right, right, left, left repeating). Children follow the pattern: step-hop on right, step-hop on left. Model the pattern saying the rhythm aloud.",
        rationale: "Visual-kinaesthetic teaching strategy for skipping rhythm — especially useful for children who struggle with the step-hop pattern."
      },
      {
        id: "running_10",
        title: "Free Skipping",
        audience: ["both"],
        materials: ["None"],
        description: "Invite children to skip freely without correcting form. Observe who needs support and model the step-hop rhythm. Use 'The Farmer in the Dell' rhythm: sing and clap, then add stepping and hopping.",
        rationale: "Free practice with embedded rhythm cues supports natural skill acquisition for skipping."
      },
      {
        id: "running_11",
        title: "Gallop Away!",
        audience: ["both"],
        materials: ["Music player", "Music with a galloping rhythm"],
        description: "Play music with a galloping beat. Children gallop in rhythm — one foot always forward, then closing with the other foot. Start with dominant foot leading, then try the other foot. Model for children who need extra support.",
        rationale: "Music cues support the long-short rhythm of galloping, which precedes skipping developmentally."
      },
      {
        id: "running_12",
        title: "Drover Says (Galloping)",
        audience: ["educator"],
        materials: ["None — open space"],
        description: "One child is the Drover at one end. Others are 'horses' at the other end (~12m). Drover calls a child by name to gallop toward them. Child must ask 'Drover, may I?' and receive permission before moving. Drover calls 'Halt' to stop them. First to reach the Drover becomes the next Drover.",
        rationale: "Builds galloping practice within a listening and turn-taking game structure."
      }
    ]
  },

  // ─────────────────────────────────────────────
  // B-5 / B-6 : JUMPING AND HOPPING
  // ─────────────────────────────────────────────
  jumpingHopping: {
    iedIII: ["B-5", "B-6"],
    domain: "Physical Health and Development: Gross-Motor Skills",
    developmentalSequence: {
      "1-0": ["Attempts jump with hand held", "Attempts jump — feet don't fully leave floor"],
      "2-0": ["Jumps off floor with both feet", "Jumps over small object", "Hops once on preferred foot with hand held", "Broad jumps 5cm"],
      "2-6": ["Broad jumps 5cm", "Jumps 4 times consecutively"],
      "3-0": ["Broad jumps over 5cm object/string", "Broad jumps 25cm", "Hops on preferred foot 1–5 hops", "Hops on other foot 1–2 hops"],
      "4-0": ["Hops on other foot 3–5 hops", "Jumps forward 10 times", "Jumps backward once"],
      "5-0": ["Jumps rope 3 consecutive jumps", "Jumps backward 2 consecutive jumps", "Hops 3m on preferred foot", "Hops 3m on other foot", "Hops 15m on preferred foot"],
      "6-0": ["Jumps rope 10 consecutive jumps", "Jumps backward 5+ times"]
    },
    activities: [
      {
        id: "jumping_1",
        title: "Leaf Pile Jumping",
        audience: ["both"],
        materials: ["Raked leaf piles (autumn)", "Open level area"],
        description: "Rake leaves into several large piles. Children line up and take turns jumping into the pile, landing on their feet. Ensure piles are large enough to cushion landing and the area is clear of sticks.",
        rationale: "Motivating, low-risk jumping experience — ideal for children who are hesitant about jumping."
      },
      {
        id: "jumping_2",
        title: "Tightrope Jumping",
        audience: ["both"],
        materials: ["Chalk"],
        description: "Draw a chalk line on the ground. Children start at one end and jump forward along the line, pretending to be on a tightrope. Encourage using arms to balance on landing.",
        rationale: "Forward jumping with a visual guide builds confidence and directional jump control."
      },
      {
        id: "jumping_3",
        title: "You Jump In!",
        audience: ["educator"],
        materials: ["None"],
        description: "Children stand in a circle. Say a rhyme and call each child's name. When they hear their name, they jump into the circle. Repeat with a second rhyme where they jump backward out of the circle when their name is called.",
        rationale: "Name-call jumping game targets both forward and backward jumping in a language-rich context."
      },
      {
        id: "jumping_4",
        title: "Jumping Jacks",
        audience: ["both"],
        materials: ["None"],
        description: "Demonstrate jumping jacks (feet apart/together while clapping overhead then dropping arms). Start with just the arm movement without jumping, then add the jump. Progress to: jumping and bringing both knees up, hands on hips while jumping, or kicking feet behind while jumping.",
        rationale: "Jumping jacks build bilateral coordination and jumping rhythm."
      },
      {
        id: "jumping_5",
        title: "Busy Bee",
        audience: ["educator"],
        materials: ["None"],
        description: "Children pair up in a circle. One child (the Bee) stands in the middle and calls jump instructions (jump with your partner, jump with your back to your partner, jump and clap hands). When the Bee calls 'Busy Bee!', everyone swaps partners — the Bee tries to steal a spot.",
        rationale: "Social jumping game that adds listening and partner work to the jumping skill."
      },
      {
        id: "jumping_6",
        title: "Beanbag Jump",
        audience: ["both"],
        materials: ["One beanbag per child"],
        description: "Children try: placing a beanbag between their feet and jumping without dropping it; jumping and grabbing the beanbag while airborne; placing the beanbag between their knees and jumping without dropping it.",
        rationale: "Object manipulation during jumping increases difficulty and trunk stability demand."
      },
      {
        id: "jumping_7",
        title: "Meet the Snake",
        audience: ["both"],
        materials: ["Long skipping rope laid flat on the floor"],
        description: "Place a rope flat on the floor as a pretend snake. Children jump back and forth over it while chanting a simple rhyme. The snake can be moved to create a wavy path as skills improve.",
        rationale: "Stationary lateral jumping over an object — a key milestone in the jumping sequence."
      },
      {
        id: "jumping_8",
        title: "Jumping Rope",
        audience: ["educator"],
        materials: ["3m skipping rope"],
        description: "Two adults swing the rope (or tie one end to a fixed point). Begin with rope on the ground for children to jump over. Progress to gentle swinging. When comfortable, children chant rhymes while jumping. Children also take turns as the rope turner.",
        rationale: "Rope jumping targets consecutive jumping with rhythm — a late preschool/early school-age milestone."
      },
      {
        id: "jumping_9",
        title: "Hopping on Down the Line",
        audience: ["both"],
        materials: ["Chalk"],
        description: "Draw a chalk line. Children hop along it on their dominant foot, then swap to the other foot. Progress to: hopping backward, hopping left or right of the line, hopping over the line, and alternating feet. Progress to curves, circles, and figure-eights.",
        rationale: "Structured hopping path builds from basic single hops to sustained, directional hopping."
      },
      {
        id: "jumping_10",
        title: "Bunny Rabbit Romp",
        audience: ["both"],
        materials: ["Chalk or masking tape"],
        description: "Mark two parallel lines ~3m apart. Children pretend to be rabbits and hop from one line to the other. Less advanced: hop on the spot along a single line. More advanced: hop along shapes (triangle, diamond, square).",
        rationale: "Distance hopping on a clear visual path — targets the 3m hopping milestone."
      },
      {
        id: "jumping_11",
        title: "Icky, Icky Puddle Hop",
        audience: ["both"],
        materials: ["Chalk"],
        description: "Draw a chalk 'puddle' on the ground. Children pretend it's full of sticky slime and take turns hopping over it. Draw progressively larger puddles as skill improves.",
        rationale: "Jumping over an obstacle with increasing challenge — maps directly to broad jump milestones."
      },
      {
        id: "jumping_12",
        title: "Colour Hop",
        audience: ["educator"],
        materials: ["None — level smooth surface"],
        description: "Children stand facing the educator. Call out a colour and an action: 'If you are wearing red, hop on one foot.' 'If wearing blue, take three hops forward.' 'If wearing orange, take four hops backward.' Include all colours worn by children so everyone participates.",
        rationale: "Colour-coded hop commands build colour recognition alongside hopping direction and quantity."
      },
      {
        id: "jumping_13",
        title: "Hopscotch",
        audience: ["both"],
        materials: ["Chalk", "Small tossable object (block, flat stone, beanbag)"],
        description: "Draw a hopscotch grid. Children take turns tossing their object into the first square, then hop the full board avoiding that square. Progress through the numbers. Rules: no stepping on lines, must toss object accurately, retrieve object on the way back.",
        rationale: "Hopscotch integrates hopping, balance, object control, and sequencing — a rich multi-skill activity."
      }
    ]
  },

  // ─────────────────────────────────────────────
  // B-7 / B-9 / B-10 : BALL SKILLS
  // ─────────────────────────────────────────────
  ballSkills: {
    iedIII: ["B-7", "B-9", "B-10"],
    domain: "Physical Health and Development: Gross-Motor Skills",
    developmentalSequence: {
      "1-0": ["Rolls a ball back and forth while seated", "Hurls a tennis ball"],
      "1-6": ["Rolls ball by pushing foot, maintains balance"],
      "2-0": ["Kicks with lower leg swing (little arm movement)", "Walks up and kicks a stationary ball", "Throws with both hands overhead"],
      "3-0": ["Kicks with definite leg swing and arm opposition", "Catches bounced ball by hugging to body", "Catches with hands and chest", "Catches thrown ball by scooping under it", "Catches bounced ball with both hands", "Throws overhead with both hands"],
      "4-0": ["Coordinated kick with follow-through", "Catches thrown ball with hands and chest", "Catches thrown ball with both hands and arms extended", "Throws tennis ball 3m", "Throws from back of head with body rotation (feet stationary)", "Bounces ball 2+ times with both hands"],
      "5-0": ["2+ steps then kicks", "Catches bounced tennis ball with both hands", "Throws with body rotation and forward step", "Throws tennis ball 6m", "Bounces ball 2m with one hand and catches with both", "Bounces tennis ball once and catches"],
      "6-0": ["Runs and kicks a rolled ball", "Catches thrown tennis ball with both hands then one hand", "Throws with mature form (weight shift, arm rotation, follow-through)", "Dominant hand bounces tennis ball, taps it 2+ times, catches"]
    },
    activities: [
      {
        id: "ball_1",
        title: "Busy Hands and Feet",
        audience: ["educator"],
        materials: ["One soft rubber ball per child", "Optional music"],
        description: "Children hold their ball and practise: kicking one foot up to touch it, rolling ball back and forth between feet, rolling ball around both feet while standing still, holding ball high/low/left/right to music, and 'drawing' shapes in the air using the ball.",
        rationale: "Introductory ball handling that builds foot-eye and hand-eye coordination simultaneously."
      },
      {
        id: "ball_2",
        title: "Boot It and Blast Off!",
        audience: ["educator"],
        materials: ["One ball per child"],
        description: "Children line up side by side, each with a ball in front of them. On 'Boot it!', everyone kicks their ball as far as they can. On 'Blast off!', they run after any ball and return to line. Variations: drop kick, alternate feet, personalised balls.",
        rationale: "Group kicking game that develops kick power and running in a high-engagement format."
      },
      {
        id: "ball_3",
        title: "Colour Catch",
        audience: ["educator"],
        materials: ["One playground ball"],
        description: "One child is the caller; each other child is assigned a colour. The caller throws the ball high and calls a colour — that child runs forward to catch it. Everyone else runs away until the catcher calls 'Stop'. The catcher then rolls the ball toward the nearest child, who becomes the next caller.",
        rationale: "Catching under pressure with a running and listening component — develops anticipatory catching."
      },
      {
        id: "ball_4",
        title: "Knock 'Em Down (Throwing)",
        audience: ["educator"],
        materials: ["Tennis balls", "Stackable items — empty cans, cones, or lightweight blocks"],
        description: "Create stacks at one end of the playing area. Teams line up about 10m away and take turns throwing tennis balls to knock them over. After throwing, child restacks and collects balls for the next player. Variation: kick playground balls instead.",
        rationale: "Throwing or kicking with a target develops aim, force control, and throwing mechanics."
      },
      {
        id: "ball_5",
        title: "Push It, Partner!",
        audience: ["both"],
        materials: ["One ball per pair"],
        description: "Pairs face each other 0.5–1m apart. One child pushes the ball along the ground with their hand to their partner. Partner catches and sends it back. Progress to: opposite hand, pushing through legs, and pushing backward through legs.",
        rationale: "Partner ball play develops rolling, receiving, and hand-eye coordination at close range."
      },
      {
        id: "ball_6",
        title: "Wonder Ball",
        audience: ["educator"],
        materials: ["Small playground ball or tennis ball"],
        description: "Children sit or stand in a circle and pass the ball around while chanting a rhyme. Whoever holds the ball on the final word 'past' runs around the outside of the circle and back to their place, then begins passing again.",
        rationale: "Ball passing game develops grip, transfer, and anticipation within a rhythmic social context."
      },
      {
        id: "ball_7",
        title: "Ball and Hoop Relay",
        audience: ["educator"],
        materials: ["One ball per team", "3–7 hula hoops per team laid in lines"],
        description: "Teams line up behind their row of hoops. First child runs to each hoop in turn, bouncing and catching the ball inside each one, then runs back to pass to the next teammate. First team to complete the circuit wins. Increase hoop difficulty as skills improve.",
        rationale: "Bounce-and-catch relay targets controlled bouncing with both hands — a key 4-year-old milestone."
      },
      {
        id: "ball_8",
        title: "Stop That Ball!",
        audience: ["educator"],
        materials: ["Several rubber playground balls"],
        description: "Children hold hands in a circle with feet wide, touching the feet of the children beside them. Hands go on knees. The educator stands in the middle and tries to roll the ball between each child's feet. Children use their hands to stop the ball. Child who misses retrieves it and tosses it back.",
        rationale: "Ball stopping game develops foot-eye coordination and lateral tracking in a social format."
      }
    ]
  },

    // ─────────────────────────────────────────────────────────
    // BATCH 2 — LANGUAGE & FINE MOTOR
    // Source: languageAndFineMotorActivities.js | 55 activities
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────
  // D-8 / F-21 : BODY PARTS
  // ─────────────────────────────────────────────
  bodyParts: {
    iedIII: ["D-8", "F-21"],
    domain: "Language Development: Vocabulary",
    teachingNotes: [
      "Teach receptively first (child touches/points to body part when named) before expecting expressive labelling.",
      "Use your own body as the model — touch your own body part as you name it, then invite the child to mirror.",
      "Be sensitive to personal space. Avoid touching the child's body to demonstrate.",
      "Teach a few body parts at a time to avoid overwhelm.",
      "Accept family terminology (e.g. 'tummy') while introducing clinical/standard terms.",
      "Flag for follow-up: persistent confusion of blue/yellow or red/green may indicate colour blindness (refer optometrist). Articulation errors alone do not indicate lack of knowledge — credit the concept."
    ],
    developmentalSequence: {
      "Points to body parts when named": {
        "1-6": ["eyes", "nose", "mouth", "hair"],
        "2-0": ["feet", "ears", "tongue", "head", "legs", "arms", "fingers", "teeth", "thumbs", "toes", "neck", "stomach"],
        "3-0": ["chest", "back", "knees", "chin", "fingernails"],
        "4-0": ["heels", "ankles", "jaw"],
        "5-0": ["shoulders", "elbows", "hips", "wrists", "waist"],
        "6-0": []
      },
      "Names body parts when pointed to": {
        "2-0": ["eyes", "nose", "mouth", "hair"],
        "2-6": ["feet", "ears", "tongue", "head", "legs", "arms", "fingers", "teeth", "thumbs", "toes", "neck", "stomach"],
        "3-6": ["chest", "back", "knees", "chin", "fingernails"],
        "4-6": ["heels", "ankles", "jaw"],
        "5-6": ["shoulders", "elbows", "hips", "wrists", "waist"],
        "6-6": []
      }
    },
    activities: [
      {
        id: "body_1",
        title: "Meet Your Nose, Meet Your Toes",
        audience: ["both"],
        materials: ["None"],
        description: "Point to a body part on your own body, name it, and invite the child to point to the same part on themselves and say the name. Work through a small set of body parts at a time, observing who needs additional support.",
        rationale: "Foundational receptive-to-expressive teaching sequence for body part identification."
      },
      {
        id: "body_2",
        title: "If You're Happy and You Know It (Body Parts version)",
        audience: ["both"],
        materials: ["None"],
        description: "Sing 'If You're Happy and You Know It' and substitute body part actions for each verse: touch your ears, blink your eyes, bend your knees, wiggle your fingers. Change the body part each verse. Invite children to lead once familiar.",
        rationale: "Song and movement format embeds body part names in a joyful, repetitive, language-rich context."
      },
      {
        id: "body_3",
        title: "Hokey Pokey",
        audience: ["both"],
        materials: ["None"],
        description: "Sing the Hokey Pokey and call out different body parts for each verse: arm, leg, head, tummy, feet. Invite children to lead a verse and choose the next body part.",
        rationale: "Classic whole-body movement song reinforcing body part identification in a motivating group format."
      },
      {
        id: "body_4",
        title: "Head and Shoulders (Extended)",
        audience: ["both"],
        materials: ["None"],
        description: "Sing Head and Shoulders, Knees and Toes, touching each body part as named. Extend by substituting other body parts (mouth, elbows, ankles). Progress to silently dropping one word at a time and just performing the action.",
        rationale: "Sequential body part naming with motor action — the progressive word-drop version builds auditory memory and body schema simultaneously."
      },
      {
        id: "body_5",
        title: "Is It a Body Part?",
        audience: ["both"],
        materials: ["None"],
        description: "Say a series of words — some body parts, some not (arm, truck, elbow, flower, finger, car, wrist). Children touch that body part if the word is a body part, stay still if it is not. Progress to inviting children to lead.",
        rationale: "Categorisation task that checks receptive vocabulary and listening attention simultaneously."
      },
      {
        id: "body_6",
        title: "How Does It Move?",
        audience: ["both"],
        materials: ["None"],
        description: "Stand in a circle and ask movement questions: 'What body parts help us walk? Show me!' 'What can blink? Show me!' 'What can wiggle?' Then shift to sentence completion: 'These are my hands and they want to [clap].'",
        rationale: "Connects body part names to function — builds conceptual body awareness beyond simple labelling."
      },
      {
        id: "body_7",
        title: "Keep the Ball in the Air",
        audience: ["both"],
        materials: ["One soft foam ball per child"],
        description: "Demonstrate keeping a foam ball in the air using different body parts: hand, elbow, wrist, knee, foot. Children experiment, then follow directions: 'Hit the ball with your knee.' Give new directions for each turn.",
        rationale: "Functional body part identification through active play — excellent for kinaesthetic learners."
      },
      {
        id: "body_8",
        title: "Simon Says (Body Parts)",
        audience: ["both"],
        materials: ["None"],
        description: "Play Simon Says using body part commands: 'Simon says, nod your head', 'Simon says, wiggle your fingers', 'Bend your knees' (no action required). Progress to two-body-part commands: 'Simon says, put your hand on your head.'",
        rationale: "Listening comprehension + body part identification in a familiar game structure. The listening inhibition component adds an executive function layer."
      },
      {
        id: "body_9",
        title: "Body Parts of a Doll",
        audience: ["both"],
        materials: ["Dolls representing diverse ethnicities — one per child and one for the educator"],
        description: "Point to each body part on your doll as you name it. Children point to the same part on their own doll and then on their own body. Progress to asking 'What is this?' as you point to a body part on your doll.",
        rationale: "Doll-mediated learning offers a useful intermediate step between self-identification and picture-based tasks."
      },
      {
        id: "body_10",
        title: "Parts Make Parts",
        audience: ["both"],
        materials: ["None"],
        description: "Explain that some body parts are made of smaller parts. Ask: 'What smaller parts make up the hand?' Prompt children to name fingers, thumb, knuckles, nails, wrist. Work through arm, foot, leg, and head in the same way.",
        rationale: "Builds hierarchical body schema — important for later directional and positional concept learning."
      },
      {
        id: "body_11",
        title: "That's a Big Me! (Body Tracing)",
        audience: ["educator"],
        materials: ["Roll of paper (butcher paper or newsprint)", "Textas", "Crayons", "Decorative supplies (wool, buttons, felt, pipe cleaners)", "Glue sticks"],
        description: "One at a time, have each child lie on a large sheet of paper. Trace around the body from head to toe, naming body parts as you go. Children decorate their outlines with facial features, hair, and clothing, then cut them out (with help). Hang on the wall, feet touching the floor. Children point to and name each body part on their outline, then find the same part on their own body.",
        rationale: "Life-size body tracing is a rich integrative task for body schema, fine motor, and expressive language. Sensitivity to personal space is essential — trace gently and narrate as you go."
      },
      {
        id: "body_12",
        title: "What Comes Next? (Drawing a Person)",
        audience: ["both"],
        materials: ["Drawing paper", "Texta"],
        description: "Tell children you are going to draw a person together and it's their job to tell you what to draw next. Start at the top and ask 'What body part should I draw first?' As each part is suggested, have the child point to that part on themselves. If children are stuck, have them look at each other to see what's missing.",
        rationale: "Expressive body part naming embedded in a collaborative drawing task — reveals sequencing and body schema knowledge."
      },
      {
        id: "body_13",
        title: "Finger Plays — My Hands Upon My Head",
        audience: ["both"],
        materials: ["None"],
        description: "Teach simple finger plays that name body parts. Say each line slowly with actions, then repeat with children joining in. Example: 'My hands upon my head I place / On my shoulders, on my face / On my knees and at my side / Then behind me they will hide.' Follow with 'Here Are My Ears' (ears, nose, fingers, toes, eyes, mouth, tongue, chin, cheeks, hands, feet).",
        rationale: "Finger plays provide rhythmic, multi-modal body part learning suited to all developmental levels."
      },
      {
        id: "body_14",
        title: "My Hands — Tactile Guessing Game",
        audience: ["both"],
        materials: ["Cloth bag", "Objects with different textures and shapes (rocks, feather, sponge, ball, chalk, towelling)"],
        description: "Children close their eyes, reach into the bag, pick one object, and describe what they feel before guessing what it is. Encourages hand and finger use with a sensory exploration focus.",
        rationale: "Tactile discrimination through hands — builds awareness of touch, texture, and the function of hands and fingers."
      },
      {
        id: "body_15",
        title: "Riddle Time — Body Part Rhymes",
        audience: ["both"],
        materials: ["None"],
        description: "Share rhyming riddles where children guess the body part: 'I use it to smell. It rhymes with rose. I have only one. It's called a ___.' (nose). Continue with mouth/south, eyes/ties, ears/clears, hands/bands. Invite children to make up their own riddles.",
        rationale: "Rhyme-based body part naming integrates phonological awareness with vocabulary knowledge."
      }
    ]
  },

  // ─────────────────────────────────────────────
  // D-9 / F-5 : COLOURS
  // ─────────────────────────────────────────────
  colours: {
    iedIII: ["D-9", "F-5"],
    domain: "Language Development: Vocabulary",
    teachingNotes: [
      "Teach receptively first: match, then point, then name.",
      "Introduce one colour at a time; add new colours only when the current one is consistent.",
      "If a child consistently confuses blue/yellow or red/green when matching, refer for colour blindness assessment (optometrist/ophthalmologist).",
      "Credit colour knowledge even if articulation is imprecise (e.g. 'wed' for red).",
      "Use transitions to reinforce colour names throughout the day."
    ],
    developmentalSequence: {
      "Matches colours": {
        "2-0": ["red", "blue", "orange", "purple", "white"],
        "2-6": ["green", "yellow", "pink"],
        "3-0": ["brown", "black", "grey"],
        "4-0": []
      },
      "Points to colours when named": {
        "3-0": ["red", "blue", "orange", "purple", "white"],
        "3-6": ["green", "yellow", "pink"],
        "4-0": ["brown", "black", "grey"],
        "5-0": []
      },
      "Names colours when pointed to": {
        "3-6": ["red", "blue", "orange", "purple", "white"],
        "4-0": ["green", "yellow", "pink"],
        "4-6": ["brown", "black", "grey"],
        "5-6": []
      }
    },
    activities: [
      {
        id: "colour_1",
        title: "Colour Day",
        audience: ["educator"],
        materials: ["Items in the target colour — clothing, snacks, art materials, display objects", "Coloured wool, stickers"],
        description: "Dedicate one day per week to a single colour for 11 weeks. The day before, send home a paper circle of that colour. On the day, wear that colour, provide a snack of that colour, use that colour in art activities, and display objects of that colour for children to name. Tie a piece of wool of that colour around each child's wrist as a reminder.",
        rationale: "Intensive, embedded colour exposure across all senses and contexts. Highly effective for colour consolidation."
      },
      {
        id: "colour_2",
        title: "Colour Match",
        audience: ["both"],
        materials: ["Blocks — at least 2 of each colour (or cut paper flowers in matching pairs)"],
        description: "Hold up one block. Ask the child to find another block of the same colour. Match them together as you name the colour. Start with two colours, add one at a time as the child becomes consistent.",
        rationale: "Receptive colour matching — the foundational first step in the colour teaching sequence."
      },
      {
        id: "colour_3",
        title: "Colour Shape Sort",
        audience: ["both"],
        materials: ["Shapes cut from coloured project paper (stars, circles, squares, hearts in each target colour)"],
        description: "Shuffle mixed coloured shapes. Demonstrate sorting by colour while naming each. Have children sort the shapes into colour groups, naming the colour as they place each one. Introduce new colours one at a time.",
        rationale: "Combines colour recognition with sorting — aligns to both D-9 and F-5 (sorts objects by colour)."
      },
      {
        id: "colour_4",
        title: "Our Colour Chart",
        audience: ["educator"],
        materials: ["Poster paper", "Old magazines and catalogues", "Scissors", "Glue sticks"],
        description: "Create a chart for each colour with columns: Clothing, Food, Nature, Signs, Books. Children cut out pictures of things in that colour from magazines and glue them into the correct column. Discuss each picture and what colour it is.",
        rationale: "Connects colour recognition to real-world categories — builds semantic colour knowledge beyond simple naming."
      },
      {
        id: "colour_5",
        title: "Scrapbook of Colours",
        audience: ["educator"],
        materials: ["Stapled white paper booklets (one page per colour)", "Colour swatches or paper samples glued to each page", "Magazines", "Scissors", "Glue sticks"],
        description: "Give each child a personal colour scrapbook. One page at a time, children find pictures in magazines that match the colour sample on that page and glue them in. After completing each page, discuss the pictures and help children write the colour name.",
        rationale: "Personal colour reference book — excellent for consolidating colour names over time and sharing with families."
      },
      {
        id: "colour_6",
        title: "Colour Chains",
        audience: ["educator"],
        materials: ["Strips of coloured project paper", "Glue sticks"],
        description: "Show children how to make a paper chain loop. Hold up a coloured strip and have children select the matching colour from their pile. They glue their strip into a loop to match yours, building the chain one link at a time across all target colours. Extension: make patterned chains (red, blue, red, blue) and ask 'What colour comes next?'",
        rationale: "Colour matching with a fine motor and sequencing extension — also introduces pattern concepts."
      },
      {
        id: "colour_7",
        title: "Colours of the Rainbow",
        audience: ["both"],
        materials: ["White drawing paper", "Crayons or chalk in rainbow colours", "Picture of a rainbow"],
        description: "Display a rainbow image. Name the colours in order from inside to outside: purple, blue, green, yellow, orange, red. Children echo each name and arrange their crayons in the same order. Draw a rainbow together, one arc per colour. Name each colour again when complete.",
        rationale: "Sequential colour naming across all target colours in a visually engaging, culturally familiar format."
      },
      {
        id: "colour_8",
        title: "Still-Life Painting",
        audience: ["educator"],
        materials: ["Paints in a variety of colours", "White paper", "Paintbrushes", "Fruit, vegetables, or flowers in solid colours"],
        description: "Display a collection of same-coloured objects (a bowl of red apples, yellow tulips). Children paint what they see. Talk with each child about their painting using colour names. Progress to displays with multiple colours.",
        rationale: "Colour naming embedded in art observation — builds descriptive colour vocabulary in context."
      },
      {
        id: "colour_9",
        title: "Who Is Wearing Blue?",
        audience: ["educator"],
        materials: ["None"],
        description: "Children sit in a circle. Ask questions about clothing: 'Who is wearing a red shirt and black shoes?' Children respond in full sentences: 'I'm wearing a red shirt and black shoes.' Extend to detailed descriptions with two or more colours. Use at transition times (e.g. 'Children wearing white shoes may go outside').",
        rationale: "Incidental colour naming integrated into the daily routine — builds both receptive and expressive colour vocabulary."
      },
      {
        id: "colour_10",
        title: "I Spy (Colours)",
        audience: ["both"],
        materials: ["None"],
        description: "Give a colour clue: 'I spy, with my little eye, something that is yellow.' If a child names something yellow but not the target object, praise the colour identification and give an additional clue. The child who guesses correctly becomes the next leader.",
        rationale: "Colour naming in a familiar game context — adds visual scanning and descriptive language to colour recognition."
      },
      {
        id: "colour_11",
        title: "Can You Guess What I'm Thinking?",
        audience: ["both"],
        materials: ["None"],
        description: "Think of an object and give clues, including a colour clue: 'I'm thinking of something that is usually red and grows on trees.' Add further clues if needed. Each child takes a turn thinking of an object and giving clues.",
        rationale: "Colour naming with category and descriptive clues — builds inferencing and expressive colour vocabulary."
      },
      {
        id: "colour_12",
        title: "Change a Colour! (Colour Mixing)",
        audience: ["educator"],
        materials: ["Food colouring (red, blue, yellow)", "6 clear jars", "Water", "Red, blue, yellow paints", "Paintbrushes", "White drawing paper", "Smocks"],
        description: "Fill three jars with water and add primary colours. Place three empty jars alongside. Mix yellow and blue to make green, yellow and red to make orange, blue and red to make purple. Children observe and name each new colour. Invite them to paint with the new colours and experiment mixing on paper.",
        rationale: "Colour creation through mixing — extends colour knowledge to secondary colours and builds vocabulary for colour change."
      },
      {
        id: "colour_13",
        title: "Shades of Colour",
        audience: ["educator"],
        materials: ["Colour swatches in basic colours and their shades (from a paint or fabric shop)"],
        description: "Once children know basic colours, introduce shades. Display basic colours alongside pale, light, bright, and dark versions. Have children match shades to the base colour. Use the terms 'pale', 'light', 'bright', 'dark' throughout the activity and in daily conversation.",
        rationale: "Extends colour vocabulary beyond basic naming to qualitative descriptors — appropriate for children who have mastered the 11 basic colours."
      }
    ]
  },

  // ─────────────────────────────────────────────
  // C-1 / C-2 / G-1 / G-4 : HOLDING & MANIPULATING OBJECTS
  // ─────────────────────────────────────────────
  fineMotorManipulation: {
    iedIII: ["C-1", "C-2", "G-1", "G-4"],
    domain: "Physical Health and Development: Fine-Motor Skills",
    teachingNotes: [
      "Refer for assessment if: small muscles of fingers and thumb appear rigid; child clutches pencil in palm; child holds pencil more than 2.5cm above the point; child uses more than two fingers to grasp pencil; difficulty touching each fingertip to thumb of same hand.",
      "Tactile sensitivities are common — do not force contact with materials. Offer alternatives.",
      "Progress from two-dimensional (flat surface drawing) to three-dimensional (collage, clay) as skills develop.",
      "Vision problems (astigmatism, acuity, farsightedness) can impair fine motor development — refer if suspected."
    ],
    developmentalSequence: {
      "1-3": ["Attempts to scribble — strokes not controlled, may go off paper"],
      "2-0": ["Scribbles with crayon, rarely loses contact with paper", "Holds pencil/crayon with fingers (not fisted)", "Uses one hand consistently"],
      "3-0": ["Draws recognisable picture meaningful to child"],
      "4-0": ["Draws, names and describes recognisable pictures", "Traces easier uppercase letters (H, A, T)"],
      "5-0": ["Copies easier uppercase letters", "Copies first name", "Prints first name", "Colours within lines", "Grasps pencil correctly — adult grasp between thumb and fingers"],
      "6-0": ["Traces more difficult lowercase letters", "Copies more difficult lowercase letters"]
    },
    activities: [
      {
        id: "fm_manip_1",
        title: "Where Is Thumbkin? (Finger Song)",
        audience: ["both"],
        materials: ["None"],
        description: "Teach the finger song 'Where Is Thumbkin?' — starting with hands behind the back, bringing out each finger in turn to 'greet' the same finger on the other hand, then sending them 'away'. Name each finger: Thumbkin, Pointer, Tall Man, Ring Man, Pinky.",
        rationale: "Finger isolation and naming — directly targets the individual finger control needed for pencil grip and manipulation."
      },
      {
        id: "fm_manip_2",
        title: "Play Dough Time",
        audience: ["both"],
        materials: ["Play dough (homemade or purchased)", "Rolling pins", "Biscuit cutters", "Craft sticks", "Plastic pizza cutters"],
        description: "Give each child a tennis ball-sized portion of play dough. Encourage squeezing, flattening, rolling, pinching, twisting, and stretching. Introduce tools for rolling and cutting shapes. For homemade dough: mix 1.5 cups flour, 0.5 cup salt, 1 tbsp cream of tartar, 3 tbsp oil, 1.5 cups water; cook over low heat until thick; cool before use.",
        rationale: "Play dough is the single most effective fine motor strengthening activity for young children — develops grip strength, bilateral coordination, and hand muscle endurance."
      },
      {
        id: "fm_manip_3",
        title: "Finger Painting — People",
        audience: ["educator"],
        materials: ["Finger paint", "Glossy finger-paint paper or smooth table surface", "Drawing paper", "Smocks"],
        description: "Children finger paint directly on the table or paper, using palms to spread paint, then fingers to make lines, shapes, and designs. Encourage practice drawing people in the paint. When finished, press drawing paper onto the painting and lift to create a print.",
        rationale: "Finger painting builds tactile awareness and hand/finger control through free exploration — the monoprint extension adds a fun outcome."
      },
      {
        id: "fm_manip_4",
        title: "Drawing to Music",
        audience: ["both"],
        materials: ["Crayons or textas", "White paper", "Music player", "Varied music styles (classical, jazz, rock, reggae)"],
        description: "Children draw freely while listening to one style of music. Flip the paper and draw again to a different style. Discuss how the drawings differ: colours chosen, types of lines, energy of marks. Ask: 'How did the music make you feel?'",
        rationale: "Connects emotional response to mark-making — encourages expressive use of drawing tools with varied pressure, direction, and line type."
      },
      {
        id: "fm_manip_5",
        title: "Block Building",
        audience: ["both"],
        materials: ["Unit blocks of various sizes"],
        description: "Invite a small group to build freely with blocks. Observe how children grip, stack, and balance blocks. Encourage them to describe what they built. Discuss why blocks topple and how to balance them more stably.",
        rationale: "Block play develops grip strength, spatial reasoning, and bilateral hand coordination. Also assesses emerging tower-building skills (C-2)."
      },
      {
        id: "fm_manip_6",
        title: "Photo Puzzle",
        audience: ["educator"],
        materials: ["Laminated photo of each child mounted on project paper", "Scissors (adult prep)", "Small envelopes or boxes"],
        description: "Laminate a photo of each child, glue to project paper, cut into 6-8 puzzle pieces, and label the back with the child's name. Children practise assembling their own puzzle, then swap with a friend. Builds pincer grip and spatial problem-solving.",
        rationale: "Personalised puzzle with appropriate piece count for age (6-8 for 4-year-olds) — develops fine motor manipulation in a highly motivating task."
      },
      {
        id: "fm_manip_7",
        title: "Sponge Printing",
        audience: ["both"],
        materials: ["Sponges cut into shapes", "Tempera paint in pie pans", "Paper", "Smocks"],
        description: "Children dip shaped sponges into paint and press them onto paper to make prints. Rotate the paint pans so children use multiple colours. Encourage intentional design-making.",
        rationale: "Gripping and pressing a sponge builds hand strength and wrist stability while introducing print concepts."
      },
      {
        id: "fm_manip_8",
        title: "People in Motion (Drawing)",
        audience: ["both"],
        materials: ["Drawing paper", "Large crayons or textas"],
        description: "Talk about the different ways people move (walking, dancing, jumping, hopping, swimming). Have children act out movements, then draw a picture of themselves doing something they enjoy. Ask them to name the body parts in motion in their picture.",
        rationale: "Drawing the moving body connects body schema, fine motor control, and representational drawing — date and file for developmental comparison."
      },
      {
        id: "fm_manip_9",
        title: "Eyedropper Painting",
        audience: ["educator"],
        materials: ["Eyedroppers", "Muffin tins", "Food colouring in water (multiple colours)", "Paper towels", "Project paper"],
        description: "Children use eyedroppers to pick up coloured water and release drops onto paper towels. Encourage mixing colours by placing drops of two colours together. Create designs with the coloured drops.",
        rationale: "Eyedropper use is a highly targeted pincer grip activity requiring squeeze-release control — excellent for children needing grip strengthening."
      },
      {
        id: "fm_manip_10",
        title: "Let's String a Necklace",
        audience: ["both"],
        materials: ["Shoelaces with knotted ends", "Large wooden beads", "Dried coloured pasta (optional)"],
        description: "Give each child a shoelace with a knot at one end and a container of large wooden beads. Demonstrate stringing beads onto the lace. Progress to smaller beads or dyed pasta for children with more advanced fine motor skills.",
        rationale: "Bead stringing directly develops the pincer grip and bilateral hand coordination needed for pencil use and fastening clothing."
      },
      {
        id: "fm_manip_11",
        title: "Hammer in the Foam",
        audience: ["educator"],
        materials: ["Pieces of foam", "Children's lightweight hammers", "Golf tees", "Safety goggles"],
        description: "Assign an adult to each child. Give children safety goggles. Place foam pieces and golf tees on the table. Demonstrate holding the hammer and hammering a tee into the foam. Children take turns. Introduce a child's handsaw or drill with direct supervision as skills develop.",
        rationale: "Tool use requires grip strength, wrist rotation, and precise hand control — among the most demanding fine motor activities appropriate for this age group."
      },
      {
        id: "fm_manip_12",
        title: "Sculpt a Person (Clay)",
        audience: ["educator"],
        materials: ["Water-based clay", "Rolling pins", "Sticks, cork, buttons for facial features", "Paint and paintbrushes"],
        description: "Allow children time to explore clay freely before creating. Demonstrate how to smooth, flatten, and shape clay. Each child makes a clay person. Rolling pins flatten the clay; sticks or buttons make faces. Paint when dry. Note: early figures may be flat with limbs from the head — this is developmentally typical.",
        rationale: "Clay work builds the highest level of hand strength and bilateral coordination in this domain. Three-dimensional figure construction also assesses emerging body schema."
      },
      {
        id: "fm_manip_13",
        title: "Build a Person (Magazine Collage)",
        audience: ["educator"],
        materials: ["Magazines", "Safety scissors", "Unlined paper", "Crayons", "Glue sticks"],
        description: "In pairs, children search magazines for different body parts — a head from one picture, legs from another. Partners take turns selecting and placing parts on paper until they have built a full person from head to toe, then glue the pieces down.",
        rationale: "Integrates fine motor scissor skills, body part knowledge, and collaborative interaction — rich multi-domain activity."
      },
      {
        id: "fm_manip_14",
        title: "Collage People",
        audience: ["educator"],
        materials: ["Cardboard or drawing paper (30x40cm)", "Collage materials: fabric scraps, wool, buttons, pipe cleaners, tissue paper, seeds, feathers", "Safety scissors", "Glue sticks"],
        description: "Show a completed collage person as a model. Explain that a collage uses different materials glued together. Children select, cut, tear, arrange, and glue materials to create their own collage person — using buttons for eyes, wool for hair, fabric for clothing and so on.",
        rationale: "Multi-material collage is the most complex fine motor creation task in this domain — integrates planning, grip control, and scissor skills."
      }
    ]
  },

  // ─────────────────────────────────────────────
  // C-6 : CUTS WITH SCISSORS
  // ─────────────────────────────────────────────
  cutsWithScissors: {
    iedIII: ["C-6"],
    domain: "Physical Health and Development: Fine-Motor Skills",
    teachingNotes: [
      "Always provide both left- and right-handed scissors. Also have loop scissors (spring-open) available for children with reduced grip strength.",
      "Teach scissors safety first: carry closed with tip down, handles toward the other person when passing.",
      "When a child first cuts paper, hold the paper for them so they can focus solely on the cutting motion.",
      "Teach 'thumbs up' as the cutting position cue.",
      "Teach the child to turn the paper, not the scissors, when changing direction.",
      "Refer for assessment if: child cannot open and close scissors by age 2.5; consistent one-hand dominance not yet established; scissor use remains extremely laboured at age 4+."
    ],
    developmentalSequence: {
      "Prerequisite (2-0)": ["Places scissors on fingers and holds correctly", "Opens and closes scissors", "Snips or makes small cuts in paper", "Holds paper for cutting"],
      "3-0": ["Cuts a piece of paper 12.5cm square in two"],
      "4-0": ["Cuts a 12.5cm line within 12mm limits", "Cuts a triangle with 5cm sides within 12mm limits", "Moves paper while cutting", "Cuts a 12.5cm circle within 12mm limits", "Cuts a 12.5cm circle within 6mm limits"],
      "5-0": ["Cuts a 12.5cm curving line within 6mm limits"],
      "6-0": ["Cuts out items such as paper dolls or animal pictures"]
    },
    activities: [
      {
        id: "scissors_1",
        title: "Tong Pick-Up (Pre-scissor)",
        audience: ["both"],
        materials: ["Small tongs (one per child)", "Pom-poms, cotton balls, or similar small objects", "Small containers"],
        description: "Children practise opening and closing tongs, then use them to pick up small objects one at a time and place them in a container. This builds the pinch and squeeze motion needed for scissor use.",
        rationale: "Tong use directly mimics the open-close motion of scissors without the safety complexity — an essential prerequisite activity."
      },
      {
        id: "scissors_2",
        title: "Let's Cut Paper (Straight Lines)",
        audience: ["educator"],
        materials: ["Scissors (one per child)", "Easy-to-cut paper (project paper or greeting card weight — not flimsy or very stiff)"],
        description: "Use prepared cutting sheets with dashed lines and scissors symbols marking where to start. Demonstrate cutting from the scissors symbol along the dashed line to cut the page in two. Children cut their page in half, then each half in half again. Remind: 'Thumbs up!'",
        rationale: "Straight line cutting is the first formal scissors skill — uses marked start points to reduce ambiguity."
      },
      {
        id: "scissors_3",
        title: "Cut Between the Lines (Within 12mm)",
        audience: ["educator"],
        materials: ["Scissors (one per child)", "Prepared sheets with dashed lines between solid boundary lines"],
        description: "Demonstrate cutting along a dashed line that runs between two solid lines. Children cut along each dashed line, keeping within the solid boundary lines. Encourage staying on the dashed line as closely as possible.",
        rationale: "Introduces accuracy targets — 12mm tolerance is appropriate for 4-year-old level cutting skill."
      },
      {
        id: "scissors_4",
        title: "Cut Triangles",
        audience: ["educator"],
        materials: ["Scissors (one per child)", "Prepared sheets with triangle outlines"],
        description: "Demonstrate cutting around a triangle, noting that when cutting angles it helps to cut slightly past the corner and then reposition the scissors at the start of the next line. Children cut out all triangles on the page.",
        rationale: "Angle cutting requires direction change — more complex than straight lines and maps to the 4-year-old milestone."
      },
      {
        id: "scissors_5",
        title: "Cut Circles (12mm then 6mm)",
        audience: ["educator"],
        materials: ["Scissors (one per child)", "Prepared sheets with circle outlines"],
        description: "Demonstrate cutting around a circle, reminding children to turn the paper (not the scissors) as they go. Start with 12mm tolerance circles, progress to 6mm once the child is consistent. Children cut out both circles on each sheet.",
        rationale: "Circular cutting requires continuous paper rotation — significantly more demanding than straight or angled cuts."
      },
      {
        id: "scissors_6",
        title: "Cut Curving Lines",
        audience: ["educator"],
        materials: ["Scissors (one per child)", "Prepared sheets with S-curve lines"],
        description: "Demonstrate cutting along a curving line, reminding children to turn the paper as they cut. Children cut all three curving lines on the page. Encourage smooth, continuous cutting rather than snipping.",
        rationale: "Curving line cutting is a 5-year milestone — requires coordinated paper rotation while maintaining cutting direction."
      },
      {
        id: "scissors_7",
        title: "Confetti Collage",
        audience: ["both"],
        materials: ["Scissors (one per child)", "Coloured paper scraps (project paper, wrapping paper, tissue paper)", "White paper", "Glue sticks"],
        description: "Explain that confetti is small pieces of brightly coloured paper. Children snip paper scraps into confetti-sized pieces, then glue their confetti onto white paper, overlapping pieces to fill the page with colour.",
        rationale: "Snipping into small pieces is excellent practice for early cutting — no accuracy target required, making it accessible and motivating for all skill levels."
      },
      {
        id: "scissors_8",
        title: "Bookmarks",
        audience: ["both"],
        materials: ["Pre-drawn rectangle outlines on coloured paper (thick black lines)", "Scissors", "Crayons or textas"],
        description: "Explain what a bookmark is for. Children cut out their rectangle by following the black lines, then decorate with their own drawings. Laminate for durability if possible. Take home as a practical, useful item.",
        rationale: "Rectangle cutting is a motivating real-world task — the clearly outlined shape supports accurate cutting and the take-home element engages families."
      },
      {
        id: "scissors_9",
        title: "Paper Plate Spirals",
        audience: ["educator"],
        materials: ["Lightweight paper plates with spirals drawn in texta (one per child)", "Scissors", "Hole punch", "String"],
        description: "Demonstrate cutting along the spiral, showing how to rotate the plate as you cut. Children cut their own spiral. Punch a hole at the top and hang spirals in the classroom. The rotating paper plate is an extended curving cut that develops into a 3D hanging sculpture.",
        rationale: "Spiral cutting is an advanced continuous curve task — the visual outcome is highly motivating and the hanging result creates classroom celebration of the skill."
      },
      {
        id: "scissors_10",
        title: "Cut a Picture (Figure)",
        audience: ["educator"],
        materials: ["Prepared sheets with a figure outlined in dashed lines", "Scissors"],
        description: "Demonstrate cutting around the outside of a picture, following the dashed outline. Children cut out their figure. Extension: once children can cut clearly outlined pictures, invite them to find and cut pictures from magazines and catalogues.",
        rationale: "Cutting an irregular figure outline maps directly to the 6-year-old milestone (cuts out paper dolls/animal pictures) and integrates direction change, curves, and angles."
      },
      {
        id: "scissors_11",
        title: "Colourful Caterpillar",
        audience: ["educator"],
        materials: ["Pre-drawn circles on coloured project paper (thick black outlines)", "Scissors", "Long white paper", "Glue sticks", "Crayons"],
        description: "Show a completed caterpillar made of overlapping circles. Children cut out circles from the coloured sheets and glue them in a long row to form the caterpillar's body. Add face details with crayons.",
        rationale: "Circle cutting (a 4-year milestone) embedded in a craft project — the creative output is highly motivating and the overlapping circles develop gluing and spatial arrangement skills."
      },
      {
        id: "scissors_12",
        title: "Crafty Boat",
        audience: ["educator"],
        materials: ["Pre-drawn triangles and rectangles on coloured project paper", "Blue project paper", "Craft sticks", "Scissors", "Glue sticks"],
        description: "Show a completed paper boat: triangle sail, rectangle hull, craft stick mast. Children cut out their shapes, then assemble and glue them onto blue paper to make their boat. Discuss which shape is the triangle and which is the rectangle.",
        rationale: "Integrates triangle and rectangle cutting with shape identification and constructive play."
      },
      {
        id: "scissors_13",
        title: "Friendship Heart Collage",
        audience: ["educator"],
        materials: ["Scissors", "Magazines and catalogues", "Giant heart cut from craft paper", "Glue sticks"],
        description: "Display a large heart on the floor. Children sit around it and cut pictures from magazines of things they would like to share with friends — food, toys, books. Glue pictures onto the shared heart to create a group collage.",
        rationale: "Cutting from magazines (irregular shapes, varied paper weights) is a more advanced skill. The cooperative group output adds social and language value."
      }
    ]
  },

    // ─────────────────────────────────────────────────────────
    // BATCH 3 — LITERACY
    // Source: literacyActivities.js | 99 activities
    // IED III codes inferred — verify before routing
    // ─────────────────────────────────────────────────────────

    // ──────────────────────────────────────────────────────────
  // BOOK KNOWLEDGE: Response to and Experience with Books
  // IED III item: A-1 (inferred) | Domain: Literacy – Book Knowledge
  // Developmental span: 1-6 yrs to 7-0 yrs
  // ──────────────────────────────────────────────────────────
  bookKnowledge: {
    itemCode: "A-1",
    domainLabel: "Book Knowledge: Response to and Experience with Books",
    ageRange: "18 months – 7 years",
    clinicalNote: "Children who have been read to regularly demonstrate stronger language skills, reading motivation, and understanding of the reading process. Flag limited book experience for family literacy support referral. Australian Premier's Reading Challenge lists are a useful resource for book selection.",
    activities: [
      {
        id: "BK-01",
        title: "Let's Get Ready to Read!",
        audience: "both",
        materials: ["A favourite picture book"],
        groupSize: "Individual or small group",
        summary: "Introduce book-handling skills: front/back cover, title, author, illustrator, page turning front-to-back. Read aloud with expression; prompt story retelling after reading.",
        parentVersion: "Pick up a favourite book together. Show your child the front cover and read the title aloud. Point to who wrote it (author) and who drew the pictures (illustrator). Open the book slowly, saying 'this is the first page' and 'this is where the story ends' when you reach the last page. Read it aloud using a fun, expressive voice. Afterwards, ask: 'What happened in the story?'",
        educatorVersion: "Gather children in a circle. Hold the book so all can see the cover. Introduce title, author, and illustrator. Model front-to-back page turning. Read aloud with expression. Facilitate brief story retelling: 'What happened? Who was in it? What happened at the end?'"
      },
      {
        id: "BK-02",
        title: "Repeat After Me! (Repetitive Text Books)",
        audience: "both",
        materials: ["A picture book with repetitive verse or phrase"],
        groupSize: "Individual or small group",
        summary: "Three-reading sequence: first for listening, second for questioning (What happened here? What next?), third for children to chime in with repetitive phrases. Builds comprehension and oral language.",
        parentVersion: "Choose a book your child loves — one with a repeating phrase works best. Read it three times over a few days. The first time, just enjoy it together. The second time, stop and ask 'What happened here?' or 'What do you think comes next?' The third time, pause before the repeating part and let your child say it with you.",
        educatorVersion: "Plan three readings across 2–3 days. First: read for enjoyment with expression. Second: pause for comprehension questions — 'What happened? What next? What did the character do?' Third: invite children to chime in on repetitive phrases as you track the print. Suggested titles: The Gingerbread Man, I Went Walking, Chicka Chicka Boom Boom, Time for Bed."
      },
      {
        id: "BK-03",
        title: "Tell Me a Story (Wordless Picture Books)",
        audience: "educator",
        materials: ["A wordless picture book with bold colourful illustrations"],
        groupSize: "Individual or small group",
        summary: "Three-reading sequence with wordless books. Educator models storytelling from pictures; children describe illustrations; children take turns as storytellers. Builds narrative language without decoding demands.",
        parentVersion: "Find a wordless picture book (pictures only, no words). Look through it together. Make up a story from the pictures — give the characters names! Then go through again and ask your child 'What do you see here? What's happening?' On the third look, let your child be the storyteller while you turn the pages.",
        educatorVersion: "Reading 1: educator tells a story from the pictures, pointing as they go. Reading 2: children describe each page in detail — use questions to draw out characters, actions, and feelings. Reading 3: children take turns telling the story as you turn pages. Extension: write down the story children compose; help them make it into a class book."
      },
      {
        id: "BK-04",
        title: "Read and Retell (with Felt Board Characters)",
        audience: "educator",
        materials: ["Narrative picture book", "Photocopied characters on felt", "Felt board", "Box for characters"],
        groupSize: "Individual, small group, or class",
        summary: "Three-reading sequence followed by felt board retelling. Children manipulate felt characters to dramatise story. Builds comprehension, vocabulary, and narrative sequencing.",
        parentVersion: "After reading a favourite book, make simple paper cut-outs of the main characters. Read the story again and lay out each character as they appear. Then ask your child to use the cut-outs to retell the story in their own words.",
        educatorVersion: "Prepare felt-backed characters in advance. Reading 1: read aloud with vocabulary support. Reading 2: comprehension questions on character actions and feelings; connect to children's experiences. Response: introduce characters on felt board; children dramatise and retell story using new vocabulary."
      },
      {
        id: "BK-05",
        title: "Read and Make a Collage",
        audience: "both",
        materials: ["Narrative picture book using collage illustrations (e.g. Eric Carle)", "Project paper", "Coloured tissue paper", "Wallpaper samples", "Glue sticks", "Scissors"],
        groupSize: "Individual, small group, or class",
        summary: "Two-reading sequence focused on how illustrations are created with layered paper. Children create their own collage inspired by the book. Links visual art to book engagement.",
        parentVersion: "Choose a book with interesting pictures — Eric Carle books work well because the pictures are made from torn and cut coloured paper stuck together (collage). Look closely at the pictures together: 'How did the artist make this? Can you see pieces of paper?' Then let your child make their own collage picture using torn paper, old magazines, or tissue paper and glue.",
        educatorVersion: "Reading 1: focus on vocabulary and story events. Reading 2: examine how illustrations were created — note layers, cut vs torn edges. Response: demonstrate collage technique; children create collages inspired by book pages. Suggested: The Very Hungry Caterpillar, The Tiny Seed."
      },
      {
        id: "BK-06",
        title: "Read and Create a Watercolour Illustration",
        audience: "both",
        materials: ["Narrative picture book with watercolour illustrations", "Drawing paper", "Watercolours", "Paintbrushes (various sizes)", "Small sponges", "Water containers", "Smocks"],
        groupSize: "Individual, small group, or class",
        summary: "Children examine how watercolour illustrations are made and create their own. Supports visual analysis, vocabulary development, and book engagement through art response.",
        parentVersion: "Read a book with painted pictures (watercolour illustrations look soft and blended). Look closely at the art together — notice the brushstrokes, the soft colours, whether it looks like a sponge was used. Then give your child some watercolour paints and let them make their own picture from the story.",
        educatorVersion: "Read for enjoyment with vocabulary support. Second reading: focus on retelling sequence (first, next, last). Response: examine illustration technique — brushstroke style, sponge effects, layering. Children create their own watercolour illustrations. Suggested: 'More More More Said the Baby', Swimmy, A Chair for My Mother."
      },
      {
        id: "BK-07",
        title: "Read and Make a Picture Book (Photographs)",
        audience: "both",
        materials: ["Informational picture book with photographs", "Photos from home or cut from magazines", "Drawing paper", "Glue sticks", "Scissors"],
        groupSize: "Individual, small group, or class",
        summary: "Children read an informational book illustrated with photos, then create their own picture story using personal photos. Builds understanding of non-fiction text features.",
        parentVersion: "Ask your child to bring some family photos (or use printouts). Read an informational book with real photos together. Talk about what a caption is (the words under a photo that explain it). Then help your child arrange their own photos to make a little picture story and write a caption for each one. You can help them write the words.",
        educatorVersion: "Pre-read request for family photos. Read informational book; highlight text features (Table of Contents, captions, bold words, diagrams). Response: children create photo picture books, selecting images for each page. Small groups can create topic posters. Suggested authors: Gail Gibbons, Tana Hoban, Eric Carle."
      },
      {
        id: "BK-08",
        title: "Share a Fun Informational Book",
        audience: "both",
        materials: ["Informational picture book on a topic children are studying", "Objects or pictures related to the book topic"],
        groupSize: "Individual, small group, or class",
        summary: "Introduces non-fiction reading conventions. Educator previews topic vocabulary with real objects, reads in segments with comprehension support, and prompts children to ask questions about the topic.",
        parentVersion: "Find a non-fiction book about something your child loves — dinosaurs, animals, space, machines. Before reading, gather a few related objects to look at and talk about. As you read, stop and explain any tricky words. After reading, ask: 'What did you learn? What do you still wonder about?'",
        educatorVersion: "Select 5–8 key vocabulary words. Display related objects or pictures before reading. Read in sections across multiple days; point out text features. Pause to explain vocabulary in context. Encourage children to ask questions and use new words in discussion. Extend with additional books on the same topic."
      },
      {
        id: "BK-09",
        title: "We're a Part of the Story! (Stick Puppets)",
        audience: "both",
        materials: ["Predictable or narrative picture book", "Photocopied characters", "Craft sticks", "Glue", "Scissors", "Box for puppets"],
        groupSize: "Individual, small group, or class",
        summary: "Children make stick puppets of story characters and raise them when their character is mentioned during rereading. Then use puppets to retell or create original stories.",
        parentVersion: "After reading a favourite book, help your child make simple puppets of the characters — draw them, cut them out, and tape them to a stick. Then read the story again. Every time your child's character is mentioned, they hold up the puppet. Afterwards, let them use the puppets to retell the story or make up a new adventure.",
        educatorVersion: "Prepare stick puppets in advance. Read with expression; use think-alouds to model predictions. Post-reading 'why' questions to prompt inference. Give each child a puppet; reread — children raise puppets at character mentions. Response: children dramatise and retell story; extend to creating original stories."
      },
      {
        id: "BK-10",
        title: "Every Puppet Tells a Story (Sock/Bag Puppets)",
        audience: "both",
        materials: ["Narrative picture book with several characters", "Socks or small paper bags", "Buttons", "Felt scraps", "Wool", "Glue", "Textas", "Puppet stage (box, draped chair, or doorway curtain)"],
        groupSize: "Small group or class",
        summary: "Children make sock or paper-bag puppets of story characters, then use them to dramatise and retell the story. Deeper engagement than stick puppets; supports vocabulary use in context.",
        parentVersion: "Read a story together that has a few characters. Help your child make puppets from socks or paper bags — add button eyes, wool hair, drawn-on features. Then put on a puppet show together, retelling the story or making up what happens next.",
        educatorVersion: "Model puppet-making; children create character puppets. Read story aloud with expression; model inference with think-alouds. Post-reading 'why' questions for character motivation. Response: children dramatise story and retell using new vocabulary; extend to creating a story sequel."
      },
      {
        id: "BK-11",
        title: "An Excursion to the Library",
        audience: "educator",
        materials: ["None (pre-arranged with children's librarian)"],
        groupSize: "Class",
        summary: "Organised library visit. Children experience the library environment, sign up for library cards, learn borrowing procedures, and hear about programs. Builds community connections to literacy.",
        parentVersion: "Visit your local library together. Let your child choose books they want. Help them get their own library card if they don't have one. Ask the librarian about story time sessions — many SA libraries run free children's programs. Encourage your child to borrow books to read at home each week.",
        educatorVersion: "Pre-arrange with children's librarian. Prepare children: library rules, inside voices, borrowing procedures, book care. At the library: show children's section, audio materials, special events. Ask librarian to introduce programs (story times, summer reading). Suggested companion books: Check It Out! by Gail Gibbons."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // EARLY WRITING: Pre-handwriting
  // IED III item: F-1 (inferred) | Domain: Literacy – Early Writing
  // Developmental span: preschool stage; precedes formal letter writing
  // ──────────────────────────────────────────────────────────
  preHandwriting: {
    itemCode: "F-1",
    domainLabel: "Early Writing: Pre-handwriting",
    ageRange: "Preschool (prior to formal letter formation)",
    clinicalNote: "Early writing progresses from scribbling → mock letters → letter strings → grouped letters with spaces → labelled drawings → name writing → invented spelling → sentences. Flag children still at mark-making stage beyond 4 years for fine-motor and developmental review. Writing develops sense of self and communication.",
    activities: [
      {
        id: "PH-01",
        title: "Let's Pretend (Dramatic Play Writing)",
        audience: "educator",
        materials: ["Clipboards", "Blank forms", "Textas and crayons", "Toy telephone", "Dramatic play props (e.g. doctor's office)"],
        groupSize: "Individual or small group",
        summary: "Children engage in dramatic play scenarios that naturally incorporate writing for different purposes: signing in, writing prescriptions, taking notes, making lists. Educator models purposeful writing within the play context.",
        parentVersion: "Set up a pretend game at home — doctor's surgery, restaurant, or shop. While playing, show your child how adults write things: a shopping list, a prescription, a sign. Give your child paper and crayons and encourage them to write too. Even scribbles count — ask them to 'read' what they wrote to you.",
        educatorVersion: "Set up doctor's surgery or other dramatic play area with clipboards, blank forms, and writing tools. Participate in play and model writing for different purposes: signing in, filling out forms, writing prescriptions. Focus on purposeful writing. Rotate play scenario (restaurant, hardware store, market) to vary writing contexts."
      },
      {
        id: "PH-02",
        title: "Pictures About Families",
        audience: "both",
        materials: ["Paper", "Textas, crayons, or pencils", "A storybook about families (e.g. Whistle for Willie)"],
        groupSize: "Individual or small group",
        summary: "After reading a family-themed book, children draw their family and write names with support. Builds connection between drawing, identity, and early writing. Educator scribes on request.",
        parentVersion: "Read a book about families together. Then ask your child to draw your family. Ask questions to help them add details ('Does Nanna wear glasses? What colour is your dog?'). Encourage them to try writing names under each person — even just the first letter is great. You can write the names lightly and let them trace over yours.",
        educatorVersion: "Read a family storybook; discuss family members. Invite children to draw their family or an imaginary family. Prompt details with questions. Ask children to name and label people in their drawing. Offer to write names if child is not comfortable; encourage attempts at any level. Note: culturally responsive — accept diverse family structures."
      },
      {
        id: "PH-03",
        title: "Set Up a Writing Centre",
        audience: "educator",
        materials: ["Varied paper types (white, project paper, sticky notes, cards)", "Blank books", "Textas, crayons, pencils", "Scissors", "Glue", "Masking tape", "Classroom letterbox"],
        groupSize: "Individual or small group",
        summary: "A permanent writing centre provides ongoing access to writing tools and materials. Signs, labels, and a letterbox establish authentic writing purposes. Educator takes dictation and models writing conventions.",
        parentVersion: "Set up a little 'writing spot' at home — a small table or corner with paper, crayons, textas, and some sticky notes. Leave it accessible so your child can write whenever they like. Put a small box nearby as a 'letterbox' — they can write you notes and post them! You can write notes back.",
        educatorVersion: "Establish a permanent writing centre with varied materials. Create signs and storage labels for the centre itself. Allow children to draw and write freely. Take dictation for stories; model conventions (left-to-right, spaces between words, return sweep). Refer to children's writing in other curriculum contexts."
      },
      {
        id: "PH-04",
        title: "My Journal",
        audience: "both",
        materials: ["Blank books (stapled paper)", "Textas, crayons, or pencils"],
        groupSize: "Individual or small group",
        summary: "Children maintain a personal journal, writing and drawing freely several times per week. Builds habits of writing for multiple purposes. Educator models journal writing and observes developmental progression over time.",
        parentVersion: "Give your child a blank notebook to be their very own journal. Let them write and draw in it however they like — pictures, scribbles, letters, words. Write in your own notebook at the same time to model journaling. Ask them to tell you about what they've written. Keep the journal so you can look back and see how much they've grown.",
        educatorVersion: "Provide each child with a personal blank book. Encourage writing 3–5 times per week. Children may: practise letter writing, draw and write about stories read, record observations, write personal stories. Use journals for developmental observation across the year. Model journal writing; do not correct invented spelling in journals — note and address patterns separately."
      },
      {
        id: "PH-05",
        title: "Our Plant Book",
        audience: "educator",
        materials: ["Flower seeds", "Planting pots", "Camera", "Project paper", "Textas"],
        groupSize: "Individual or small group",
        summary: "Children grow plants and record observations through drawing and writing over time. Builds scientific writing, observational language, and understanding of non-fiction texts. Final product is a class book about plant growth.",
        parentVersion: "Plant some seeds together in a pot or garden bed. Every few days, look at how the plant is changing and ask your child to draw a picture of it. Encourage them to write a sentence (or dictate one to you) about what they notice: 'It got taller!' 'A leaf grew!' Collect the pages into a little book about your plant's growth.",
        educatorVersion: "Set up science centre with plants. Children co-create a watering schedule. Every few days, children draw and write (or dictate) observations about plant growth. Compile into a class book. Photograph growth stages. Model scientific writing conventions. Final book goes in classroom library."
      },
      {
        id: "PH-06",
        title: "Story Word Cards",
        audience: "both",
        materials: ["Favourite storybook", "2–3 sets of word cards with picture clues (6 words)", "Drawing paper", "Textas and pencils"],
        groupSize: "Individual or small group",
        summary: "After reading and discussing a book, children draw a picture and write a caption in response. Word cards with picture clues support writing attempts. Builds book comprehension and early writing for authentic purpose.",
        parentVersion: "After reading a book together, ask your child to draw a picture about their favourite part or character. Help them write a sentence or caption about their picture. You can write 4–5 key words from the story on little cards as a helpful reference. Encourage any writing attempt — sounding it out, copying, or dictating to you all count.",
        educatorVersion: "Reread a familiar book; prompt discussion about characters' thoughts, feelings, and motivations. Ask children to draw and write a caption in response. Provide word cards (with picture clues) for 6 key words. Circulate and comment on work. Observe writing level: mark-making, letter strings, invented spelling, or conventional. Note clinical patterns for follow-up."
      },
      {
        id: "PH-07",
        title: "A Watch Me Grow Book",
        audience: "both",
        materials: ["Informational book (e.g. Watch Me Grow: Puppy)", "Writing paper", "Textas, crayons, or pencils", "Camera and printed photos"],
        groupSize: "Individual or small group",
        summary: "Children create a personal 'Watch Me Grow' book using baby/current photos with captions. Educator models writing conventions while scribing dictated text. Builds personal narrative, identity, and understanding of informational book structure.",
        parentVersion: "Find a baby photo of your child and a recent photo. Make a little book together — each page has a photo and a caption. Your child can dictate what to write ('I am three days old! I am five years old now!'). Write exactly what they say and let them see you writing. Then let them read it back to you.",
        educatorVersion: "Request family photos ahead of time. Introduce an informational 'growing up' book; discuss captions. Each child creates a personal book with photos and captions. Scribe dictated captions exactly — model left-to-right, spaces between words, punctuation aloud. Children 'read' captions back after scribing. Place in classroom library."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // EARLY WRITING: Copies Forms
  // IED III item: F-2 (inferred) | Domain: Literacy – Early Writing
  // Developmental span: 3-0 yrs (vertical/horizontal/circle) to 7-0 yrs (diamond)
  // ──────────────────────────────────────────────────────────
  copiesForms: {
    itemCode: "F-2",
    domainLabel: "Early Writing: Copies Forms",
    ageRange: "3–7 years (developmental sequence: line → circle → cross → X → square → rectangle → triangle → diamond)",
    clinicalNote: "Visual-motor skill is prerequisite for reading and writing. Developmental sequence: vertical line and horizontal line (3y), circle (3-4y), cross/plus and X (4y), square (4y), rectangle (5y), triangle (5y), diamond (6y). Flag significant delays for OT referral — assess fine-motor coordination indicators (rigid fingers, palmar grasp, pencil held >2.5cm from point, difficulty with fingertip-thumb touch). Poor eye-hand coordination is a separate concern. Vision referral if suspected.",
    activities: [
      {
        id: "CF-01",
        title: "Trace Circles (with Diminishing Clues)",
        audience: "both",
        materials: ["Tracing worksheet (circles with dot start and directional arrow)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Circle",
        developmentalAge: "3–4 years",
        summary: "Children trace circles starting at a dot, moving counterclockwise as indicated by arrows. Prompts are gradually reduced across the worksheet. Verbal direction: 'Start here and go up.'",
        parentVersion: "Draw a large circle on paper with a small dot to show where to start. Show your child how to start at the dot and draw around in a circle. Encourage them to say 'up and around' as they trace. Let them trace your circle with their finger first, then with a crayon. Counterclockwise (starting at the top-right, going left and down) is the correct direction.",
        educatorVersion: "Demonstrate tracing counterclockwise from the 2 o'clock position. Use the worksheet with dot and arrow. Verbalise direction: 'Start here and go up.' Ensure correct direction before child works independently. Progress: trace → copy in blank spaces → draw from memory (flip page over). Acceptable form: nearly round, complete closure not required."
      },
      {
        id: "CF-02",
        title: "Trace Circles, Then Draw Own",
        audience: "both",
        materials: ["Worksheet with circles plus blank spaces (first two with dot/arrow)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Circle",
        developmentalAge: "3–4 years",
        summary: "After tracing practise, children copy circles into blank spaces (with dot/arrow prompts in first two spaces), then draw from memory with page turned over.",
        parentVersion: "Once your child can trace a circle, draw one yourself and ask them to copy it next to yours. When they can do that easily, ask them to turn the page over and try drawing a circle from memory. Praise any attempt — the goal is a mostly round shape, not a perfect circle.",
        educatorVersion: "Transition from tracing to independent copying. First two blank spaces have dot and arrow prompts. Final task: draw from memory (flip page over). Progress to copy on unlined paper in various sizes before moving to plus signs."
      },
      {
        id: "CF-03",
        title: "Trace Plus Signs (with Diminishing Clues)",
        audience: "both",
        materials: ["Worksheet with plus signs (dots and directional arrows)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Plus sign (+)",
        developmentalAge: "4 years",
        summary: "Children trace plus signs: start at top dot, trace down; start at side dot, trace across. Establishes vertical-then-horizontal pattern used in most letter formation.",
        parentVersion: "Draw a large plus sign with a dot at the top and one at the side. Show your child: 'Start at the top and go down, then start at the side and go across.' Let them trace yours first with a finger, then a crayon. Say the directions out loud together as you go.",
        educatorVersion: "Demonstrate two-stroke process: top to bottom (vertical), then left to right (horizontal). Verbalise: 'Start here and go down' then 'Start here and go across.' These directions underpin most letter formation. Acceptable form: angles between 75–105 degrees. Worksheet clues reduce progressively."
      },
      {
        id: "CF-04",
        title: "Trace Plus Signs, Then Draw Own",
        audience: "both",
        materials: ["Worksheet with plus signs plus blank spaces (first two with prompts)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Plus sign (+)",
        developmentalAge: "4 years",
        summary: "Transition from tracing to copying and independent drawing of plus signs. Final step is drawing from memory.",
        parentVersion: "Ask your child to copy a plus sign you've drawn. When they're ready, ask them to draw one from memory. Keep it relaxed — two lines crossing in the middle is the goal.",
        educatorVersion: "Worksheet: first two blank spaces have dot and arrow prompts; subsequent spaces are blank. Final step: flip page and draw from memory. Ensure form resembles + more than X (no diagonal axis)."
      },
      {
        id: "CF-05",
        title: "Trace X Signs (with Diminishing Clues)",
        audience: "both",
        materials: ["Worksheet with X signs (dots at upper-left and upper-right with directional arrows)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "X sign",
        developmentalAge: "4 years",
        summary: "Children trace X signs using two diagonal strokes: upper-left to lower-right, then upper-right to lower-left. Verbalise: 'Start here and go down and across to the opposite corner.'",
        parentVersion: "Draw a large X with a dot at the top-left and one at the top-right. Show your child: start at one top corner and go diagonally to the opposite bottom corner, then start at the other top corner and cross over. Say it out loud: 'Down and across.'",
        educatorVersion: "Two-stroke process: upper-left to lower-right, then upper-right to lower-left. Verbalise both strokes. Acceptable form: lines intersect near centre (not at ends); no vertical or horizontal axis; equal lengths. Worksheet clues diminish progressively."
      },
      {
        id: "CF-06",
        title: "Trace X Signs, Then Draw Own",
        audience: "both",
        materials: ["Worksheet with X signs plus blank spaces (first two with prompts)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "X sign",
        developmentalAge: "4 years",
        summary: "Transition from tracing to copying X signs and drawing from memory. Builds diagonal line control needed for later letter formation.",
        parentVersion: "Ask your child to copy an X you've drawn. When confident, flip the paper over and ask them to draw one from memory. Two crossing diagonal lines meeting near the middle is the target.",
        educatorVersion: "After tracing practice, transition to blank-space copying then memory drawing. Final step: flip page, draw from memory. Flag if child cannot produce diagonal strokes — may indicate need for additional fine-motor activities."
      },
      {
        id: "CF-07",
        title: "Trace Squares (with Diminishing Clues)",
        audience: "both",
        materials: ["Worksheet with squares (dot at upper-left corner)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Square",
        developmentalAge: "4 years",
        summary: "Children trace squares beginning at the upper-left corner dot. Worksheet clues reduce progressively. Builds understanding of equal-sided closed shapes with right-angle corners.",
        parentVersion: "Draw a large square with a dot at the top-left corner. Show your child to start at the dot and draw: down, across the bottom, up, and back across the top to close it. Remind them: 'The corners should be like the corner of a window — not round.'",
        educatorVersion: "Demonstrate starting at upper-left corner dot. Model verbal directions: down, across, up, across. Acceptable form: corners must not be rounded or form 'ears'; lines should not be curved. Point out real square objects (CD case). Worksheet clues diminish progressively."
      },
      {
        id: "CF-08",
        title: "Trace Squares, Then Draw Own",
        audience: "both",
        materials: ["Worksheet with squares plus blank spaces", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Square",
        developmentalAge: "4 years",
        summary: "Transition from tracing to copying squares and drawing from memory. Consolidates equal-side control and right-angle corners.",
        parentVersion: "Ask your child to copy a square you've drawn, then have them draw one from memory. Look for four straight sides and corners that are not rounded. Praise all attempts.",
        educatorVersion: "Copy → memory drawing sequence. Acceptable form: straight lines, non-rounded corners. If corners consistently rounded, return to tracing stage and reinforce direction verbalisation."
      },
      {
        id: "CF-09",
        title: "Trace Rectangles (with Diminishing Clues)",
        audience: "both",
        materials: ["Worksheet with rectangles (dot at upper-left corner)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Rectangle",
        developmentalAge: "5 years",
        summary: "Children trace rectangles starting at the upper-left corner dot. Builds on square-drawing skill; distinguishes rectangle from square (unequal length/width).",
        parentVersion: "Draw a rectangle (like a door shape — taller than it is wide). Show your child to start at the top-left corner and trace all the way around. Talk about how it's like a square but two sides are longer.",
        educatorVersion: "Demonstrate starting at upper-left dot. Acceptable form: corners not rounded, lines straight, length and width must differ (cannot resemble a square). Worksheet clues diminish. Real-world examples: brick, shoebox, book, refrigerator."
      },
      {
        id: "CF-10",
        title: "Trace Rectangles, Then Draw Own",
        audience: "both",
        materials: ["Worksheet with rectangles plus blank spaces", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Rectangle",
        developmentalAge: "5 years",
        summary: "Transition from tracing to copying rectangles and drawing from memory.",
        parentVersion: "Ask your child to copy a rectangle, then draw one from memory. Check that it looks different from a square — one pair of sides should be clearly longer.",
        educatorVersion: "Copying → memory drawing. Clarify distinction from square (different length/width). If child consistently draws squares, emphasise proportion with verbal cues: 'Make these sides longer.'"
      },
      {
        id: "CF-11",
        title: "Trace Triangles (with Diminishing Clues)",
        audience: "both",
        materials: ["Worksheet with triangles (with directional arrows)", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Triangle",
        developmentalAge: "5 years",
        summary: "Children trace triangles following directional arrows. Three-sided closed shape with angled corners. Real-world examples: pine tree, piece of pie.",
        parentVersion: "Draw a large triangle and show your child how to trace around it. Talk about the three corners and three straight sides. Point out triangles in the world: a slice of pizza, a pine tree, the roof of a house.",
        educatorVersion: "Demonstrate two-stroke pattern (varies by style). Acceptable form: corners not rounded or forming 'ears'; lines not curved. Worksheet clues diminish. Point out environmental triangles."
      },
      {
        id: "CF-12",
        title: "Trace Triangles, Then Draw Own",
        audience: "both",
        materials: ["Worksheet with triangles plus blank spaces", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Triangle",
        developmentalAge: "5 years",
        summary: "Transition from tracing to copying triangles and drawing from memory.",
        parentVersion: "Ask your child to copy a triangle you've drawn, then draw one from memory. Look for three straight sides and three pointy (not rounded) corners.",
        educatorVersion: "Copying → memory drawing. Acceptable form: straight sides, non-rounded corners. Common difficulty: children produce circles or lopsided forms — return to air-tracing and verbalised direction."
      },
      {
        id: "CF-13",
        title: "Trace Diamonds (with Diminishing Clues)",
        audience: "both",
        materials: ["Worksheet with diamonds", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Diamond",
        developmentalAge: "6 years",
        summary: "Children trace diamond shapes. Most complex form in the sequence, requiring four angled lines and four corners without rounding. Real-world examples: playing card suits, floor tile patterns.",
        parentVersion: "Show your child a diamond shape (like on a pack of cards). Trace it together and talk about the four pointy corners. Ask them to trace your diamond drawing first, then try copying it.",
        educatorVersion: "Demonstrate tracing. Acceptable form: corners not rounded or forming 'ears'; lines not curved. A diamond that develops 'ears' (slightly overlapping corners) is a common error — return to tracing with verbalised direction. Environmental examples: playing cards, floor tiles."
      },
      {
        id: "CF-14",
        title: "Trace Diamonds, Then Draw Own",
        audience: "both",
        materials: ["Worksheet with diamonds plus blank spaces", "Pencil"],
        groupSize: "Individual or small group",
        targetShape: "Diamond",
        developmentalAge: "6 years",
        summary: "Transition from tracing to copying diamonds and drawing from memory. Completing the full Copies Forms developmental sequence.",
        parentVersion: "Ask your child to copy a diamond, then draw one from memory. This is one of the trickier shapes to draw — four straight sides all going at a diagonal, with four pointy corners. Celebrate the attempt.",
        educatorVersion: "Copying → memory drawing. Completion of the Copies Forms sequence (circle → diamond). If diamond is not yet achievable, consolidate triangles before returning. Flag persistent difficulty at age 6+ for visual-motor and fine-motor review."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // PRINT AWARENESS: Visual Discrimination
  // IED III item: E-1 (inferred) | Domain: Literacy – Print Awareness
  // Developmental span: 5-3 (forms) to 7-0 (words)
  // ──────────────────────────────────────────────────────────
  visualDiscrimination: {
    itemCode: "E-1",
    domainLabel: "Print Awareness: Visual Discrimination",
    ageRange: "5 years 3 months – 7 years",
    clinicalNote: "Visual discrimination (recognising similarities and differences between forms, letters, and words) is prerequisite to reading. Sequence: forms very different → forms somewhat different → same size → same direction → uppercase letters very different → somewhat different → lowercase letters very different → somewhat different → words very different → different initial letter → different medial letter → different final letter. Flag for vision review (astigmatism, acuity, farsightedness, nearsightedness) if persistent difficulty. Also consider spatial awareness and attention.",
    activities: [
      {
        id: "VD-01",
        title: "Does It Match? (Shape Outline Matching)",
        audience: "educator",
        materials: ["Heavy white cardboard with traced object outlines", "Assortment of objects (rubber band, washer, key, jar lid)", "Box or container"],
        groupSize: "Individual",
        targetLevel: "Forms (concrete objects)",
        summary: "Child takes objects from a box and matches them to their outlines on cardboard. Introduces visual discrimination with concrete materials before progressing to printed symbols.",
        parentVersion: "Trace around a few household objects (keys, cups, toy cars) onto a piece of card. Put the objects in a bag. Ask your child to take one out and find where it matches on the card. Swap objects as your child gets better at it.",
        educatorVersion: "Preparation: trace objects onto cardboard. Child matches each object to its outline. If child has difficulty with rubber band (shape changes), provide support. Start with 2–3 objects; increase to 4+ as skill improves. Build vocabulary: same, different, alike, match."
      },
      {
        id: "VD-02",
        title: "Mix and Look (Find the Different Object)",
        audience: "educator",
        materials: ["3 identical objects + 1 very different object (e.g. 3 yellow crayons + 1 stapler)", "Then: 3 rulers + 1 block"],
        groupSize: "Individual or small group",
        targetLevel: "Forms (very different)",
        summary: "Row of 4 objects: 3 identical, 1 very different. Child identifies the different item and explains how it differs. Begin with very different items; progress to more similar sets.",
        parentVersion: "Put four things in a row — three the same, one different (e.g. three spoons and one fork, or three red blocks and one blue one). Ask your child: 'Which one is different? How is it different?' Let them handle the items.",
        educatorVersion: "Start with obviously different objects. Prompt children to explain the difference. Let children mix up and present their own sets. Progress to increasingly similar items as skill develops. Build vocabulary: same, different, alike."
      },
      {
        id: "VD-03",
        title: "Shoe Mix-Up",
        audience: "both",
        materials: ["Two similar pairs of children's shoes (or mittens, boots)"],
        groupSize: "Small group",
        targetLevel: "Forms (concrete objects)",
        summary: "Two similar pairs of shoes mixed together; child points to the one that is different from the others and explains why. Extends to mittens, boots, and other clothing.",
        parentVersion: "Try this: put three matching shoes in a row with one different shoe. Ask your child to close their eyes while you arrange them, then open their eyes and find which one doesn't match. Let them explain why it's different. You can do this with socks, gloves, or shoes.",
        educatorVersion: "Two children remove similar shoes; arrange 3 matching + 1 different. Ask child to identify and explain the difference. Extend to other articles of clothing. Useful for understanding that 'different' can mean: colour, size, direction, style."
      },
      {
        id: "VD-04",
        title: "If It's Different and You Know It (Clapping Game)",
        audience: "both",
        materials: ["Sets of objects: 3 identical + 1 very different per set"],
        groupSize: "Individual, small group, or class",
        targetLevel: "Forms (very different)",
        summary: "Educator points slowly along a row of objects; children clap once when the different one is indicated. Builds rapid visual discrimination response and group engagement.",
        parentVersion: "Set up a row of objects (three the same, one different). Point to each one slowly and tell your child: 'Clap when I point to the different one!' This makes it a game and builds quick visual recognition.",
        educatorVersion: "Point slowly along the row. Children clap when you reach the different item. Let each child take a turn arranging a new set for the group. Increase difficulty by reducing the visual difference between items over time."
      },
      {
        id: "VD-05",
        title: "Size It Up! (Match Objects by Size)",
        audience: "both",
        materials: ["Collection of identical objects in 3 different sizes (beads, toy cars, plastic dishes, leaves)"],
        groupSize: "Individual",
        targetLevel: "Forms (different in size)",
        summary: "Child matches objects by size from a mixed collection. Demonstrates that 'different' can mean size, not just category. Build size vocabulary: small, medium, large.",
        parentVersion: "Collect a few objects that come in different sizes — buttons, blocks, toy cars. Mix them up and ask your child to sort them into groups by size. Name the sizes together: small, medium, large.",
        educatorVersion: "Demonstrate matching by size (large with large). Present mixed set; child sorts by size. If child has difficulty, allow handling of all items. Use vocabulary: small, medium, large, biggest, smallest. Progress to printed size discrimination (worksheet activity)."
      },
      {
        id: "VD-06",
        title: "Meet Your Match (Picture Card Pairs)",
        audience: "both",
        materials: ["Two identical sets of picture cards"],
        groupSize: "Class (even number of children)",
        targetLevel: "Forms (picture level)",
        summary: "Each child receives one picture card and must find the classmate holding the matching card. Builds active visual discrimination and social engagement.",
        parentVersion: "Make simple pairs of matching picture cards (draw the same animal or object on two cards each). Shuffle all cards and give your child one. Ask them to find its match from the remaining pile. Make it harder by using more similar pictures as skill improves.",
        educatorVersion: "Give one card to each child. Children find the classmate with the matching card and stand together holding cards up. Collect, shuffle, and repeat. Variation: use uppercase letter cards, lowercase letter cards, or mixed case pairs."
      },
      {
        id: "VD-07",
        title: "Go Fish (Picture Card Version)",
        audience: "both",
        materials: ["Pack of Go Fish cards or 4 identical sets of picture cards"],
        groupSize: "Small group",
        targetLevel: "Forms (picture level)",
        summary: "Traditional Go Fish played with picture cards to collect matching pairs. Builds visual discrimination, turn-taking, and descriptive language when asking for cards.",
        parentVersion: "Play Go Fish using picture cards. Shuffle and deal 4 cards each. Take turns asking: 'Do you have a red car?' or 'Do you have a dog?' If yes, the other player gives you the card. If not, they say 'Go fish!' and you pick from the pile. First to pair all cards wins.",
        educatorVersion: "Standard Go Fish rules with picture cards. Emphasise visual comparison when children check if cards match. At end of game, children count their pairs. For extension, use letter cards (uppercase only, lowercase only, or mixed case matching)."
      },
      {
        id: "VD-08",
        title: "Wilma the Wallaby (Shape Sorting)",
        audience: "educator",
        materials: ["Large cardboard wallaby with 4 pockets", "Box of shape cards (circles, squares, triangles, rectangles)"],
        groupSize: "Individual",
        targetLevel: "Forms (shapes)",
        summary: "Child sorts shape cards into matching pockets on a wallaby display. Builds shape recognition and discrimination. Australian animal context is culturally relevant.",
        parentVersion: "Make a simple shape sorter — draw four boxes and label each with a different shape (circle, square, triangle, rectangle). Cut out matching shapes from card. Ask your child to sort each shape card into the right box. Name each shape together.",
        educatorVersion: "Mark each pocket with a shape. Demonstrate matching a shape card to its pocket. Child sorts remaining cards. Build vocabulary: circle, square, triangle, rectangle. Extend to more shapes as discrimination improves."
      },
      {
        id: "VD-09",
        title: "Forms — Very Different (Worksheet)",
        audience: "educator",
        materials: ["Reproducible worksheet (4 items per row: 3 same + 1 very different)", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Forms (printed — very different)",
        summary: "Child indicates which of 4 printed pictures in each row is different from the other three. Items are clearly distinct (e.g. 3 pumpkins + 1 sock). Bridges concrete discrimination to printed symbols.",
        parentVersion: "Print a simple worksheet with rows of pictures where one is different. Ask your child to point to or circle the one that doesn't belong in each row. Start with very obviously different pictures.",
        educatorVersion: "Use printed worksheet after establishing concrete discrimination. Items are very different in this level. Prompt child to explain their choice. Begin to build print vocabulary: 'Which one is different? How is it different from the others?'"
      },
      {
        id: "VD-10",
        title: "Forms — Somewhat Different (Worksheet)",
        audience: "educator",
        materials: ["Reproducible worksheet (4 items per row: 3 same + 1 somewhat different)", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Forms (printed — somewhat different)",
        summary: "Progression from very different to somewhat different forms. Items are more visually similar (e.g. 3 rocking chairs + 1 regular chair, or 3 collies + 1 small fluffy dog). Increases discrimination demand.",
        parentVersion: "Use a worksheet where pictures in each row look quite similar but one is different. This is harder! Ask your child to look carefully and find the one that doesn't quite fit. Let them handle real objects to compare if they struggle.",
        educatorVersion: "Use after mastery of 'very different' worksheet. If child has difficulty, adjust by returning to concrete objects that are somewhat different. Build language for explaining differences: size, direction, number of parts, orientation."
      },
      {
        id: "VD-11",
        title: "Forms — Different in Size (Worksheet)",
        audience: "educator",
        materials: ["Reproducible worksheet (4 items per row: 3 same size + 1 different size)", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Forms (printed — different in size)",
        summary: "Items are identical in shape but differ in size. Child must attend to size, not shape, as the discriminating feature.",
        parentVersion: "Find a worksheet where the pictures look the same shape but one is a different size. Ask your child: 'Which one is a different size from the others?' This helps them look carefully at details.",
        educatorVersion: "Prepare or use standard worksheet. Concrete precursor: 3 large sheets + 1 small sheet of paper. Abstract: worksheet with same-shape items at different sizes. Build vocabulary: smaller, larger, bigger, tinier."
      },
      {
        id: "VD-12",
        title: "Forms — Different in Direction (Worksheet)",
        audience: "educator",
        materials: ["Reproducible worksheet (4 items per row: 3 facing same direction + 1 reversed)", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Forms (printed — different direction)",
        summary: "Items are identical but one faces a different direction. Builds spatial orientation awareness, which directly underpins letter discrimination (b/d, p/q).",
        parentVersion: "Try this with mugs or cups at home: line up four cups, three with handles facing right and one facing left. Ask your child which cup is 'different'. Then show them a worksheet where one picture is facing the opposite way.",
        educatorVersion: "Concrete precursor: 4 identical mugs, 3 handles one direction + 1 reversed. This directly prepares children for letter reversals (b/d, p/q). Build vocabulary: direction, facing, same way, different way. Flag persistent difficulty in reversals for spatial awareness assessment."
      },
      {
        id: "VD-13",
        title: "Uppercase Letters — Very Different",
        audience: "educator",
        materials: ["Magnetic letters, letter cards, or stencils", "Worksheet (4 letters per row: 3 same + 1 very different)", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Uppercase letters (very different, e.g. C C N C)",
        summary: "Child identifies which of 4 uppercase letters in a row is different. Letters are very distinct (e.g. C vs N). Allows tracing with finger if difficulty arises.",
        parentVersion: "Write three of the same letter and one clearly different letter in a row (e.g. T T T F or C C N C). Ask your child to point to the one that's different. Let them trace each letter with their finger if it helps.",
        educatorVersion: "Arrange 3 identical letters + 1 very different letter. Ask child to identify the different one. Allow finger-tracing to help discrimination. Use magnetic letters for manipulation. Worksheet for additional practice. Begin here before progressing to 'somewhat different.'"
      },
      {
        id: "VD-14",
        title: "Uppercase Letters — Somewhat Different",
        audience: "educator",
        materials: ["Magnetic letters, letter cards, or stencils", "Worksheet (4 letters per row: 3 same + 1 somewhat different)", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Uppercase letters (somewhat different, e.g. M N M M)",
        summary: "Child identifies which of 4 uppercase letters is different, with letters that are visually similar (e.g. M vs N, B vs P, I vs Y). More demanding visual analysis required.",
        parentVersion: "Write four letters where three are the same and one is similar but different (e.g. M M N M). Ask your child which one is the odd one out. Let them look carefully and trace with their finger. Talk about what makes the different one different.",
        educatorVersion: "Use letters that look similar but have distinct features (M/N, B/P, I/Y, Q/O). Allow finger-tracing. Give each letter a 'personality' to aid discrimination (e.g. 'N is like M but it only has one diagonal'). Worksheet for additional practice."
      },
      {
        id: "VD-15",
        title: "Lowercase Letters — Very Different",
        audience: "educator",
        materials: ["Magnetic letters, letter cards, or stencils", "Worksheet (4 lowercase letters per row: 3 same + 1 very different)", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Lowercase letters (very different, e.g. t o t t)",
        summary: "Child identifies which of 4 lowercase letters in a row is different. Letters are clearly distinct (e.g. t vs o). Introduces lowercase letter visual discrimination.",
        parentVersion: "Write three of the same lowercase letter and one very different letter (e.g. a a a m). Ask your child which one doesn't belong. Lowercase letters are trickier than uppercase — take it slowly and let them trace with their finger.",
        educatorVersion: "Introduce lowercase discrimination after uppercase is established. Start with clearly distinct pairs. Allow finger-tracing. Worksheet for additional practice. Note: lowercase letters are more visually similar than uppercase and are more likely to be confused by children."
      },
      {
        id: "VD-16",
        title: "Lowercase Letters — Somewhat Different",
        audience: "educator",
        materials: ["Magnetic letters, letter cards, or stencils", "Worksheet (4 lowercase letters per row: 3 same + 1 somewhat different)", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Lowercase letters (somewhat different, e.g. d d b d)",
        summary: "Child identifies which of 4 visually similar lowercase letters is different. Includes classic reversals: b/d, p/q, n/m, h/n. Clinical importance for early literacy screening.",
        parentVersion: "This is the trickiest level — some letters look almost the same but face different directions. Try: b b d b. Ask your child which one is different. The 'bed' trick can help: write the word 'bed' with a pillow drawn over the b and d to show which way each one faces.",
        educatorVersion: "Highest clinical importance in this sequence. b/d, p/q confusion is developmentally common up to ~6–7 years. Use the 'bed' visual mnemonic. Persistent confusion beyond 7 years or in the context of reading difficulty warrants literacy screening review. Allow finger-tracing of magnetic letters."
      },
      {
        id: "VD-17",
        title: "Words — Very Different",
        audience: "educator",
        materials: ["Word cards (e.g. it go go go)", "Worksheet", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Words (very different, e.g. it vs go)",
        summary: "Child identifies which of 4 word cards is different when words are clearly distinct in letter shape. Encourages finger-tracing of individual letters to compare.",
        parentVersion: "Write three copies of a short word and one very different word (e.g. go go it go). Ask your child to point to the one that's different. They don't need to read the words yet — just look at the shapes of the letters.",
        educatorVersion: "Introduce word-level discrimination after letter discrimination is established. Encourage children to trace each letter and compare. The goal is visual pattern matching, not reading. Present words as visual configurations of letters."
      },
      {
        id: "VD-18",
        title: "Words — Different Initial Letters",
        audience: "educator",
        materials: ["Word cards (e.g. hat hat bat hat)", "Worksheet", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Words (different initial letter)",
        summary: "Child identifies the word with a different first letter. Directly supports early phonological awareness by focusing visual attention on word beginnings.",
        parentVersion: "Write three copies of a short word and one word that only changes its first letter (e.g. hat hat bat hat). Ask your child to look very carefully at the beginning of each word and find the different one.",
        educatorVersion: "Link to phonological awareness: 'These words all start with the same letter except one.' Encourage left-to-right scanning. This level bridges visual discrimination into early decoding."
      },
      {
        id: "VD-19",
        title: "Words — Different Medial Letters",
        audience: "educator",
        materials: ["Word cards (e.g. pet pat pet pet)", "Worksheet", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Words (different middle letter)",
        summary: "Child identifies the word with a different middle letter. Requires close attention to the middle of the word — a more demanding visual discrimination task.",
        parentVersion: "Write three copies of a word and change just the middle letter in one (e.g. pet pet pat pet). Ask your child to look really carefully at the middle letter of each word to find the different one. This is tricky!",
        educatorVersion: "Children must attend to medial position. Encourage tracing across each word. This level is more difficult than initial letter changes. Link to later vowel discrimination in decoding."
      },
      {
        id: "VD-20",
        title: "Words — Different Final Letters",
        audience: "educator",
        materials: ["Word cards (e.g. sit sit sit sip)", "Worksheet", "Pencil"],
        groupSize: "Individual or small group",
        targetLevel: "Words (different final letter)",
        summary: "Child identifies the word with a different final letter. Requires scanning to the end of the word — bridges to phonological awareness of final sounds and rime.",
        parentVersion: "Write three copies of a word and change just the last letter in one (e.g. sit sit sip sit). Ask your child to look at the last letter of each word — 'Which word ends differently?'",
        educatorVersion: "Children must sustain visual attention to word end. Link to phonological awareness: 'The word that looks different also sounds different at the end.' Final sequence step — completes the visual discrimination programme from concrete forms to word-level analysis."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // PRINT AWARENESS: Print Awareness and Concepts
  // IED III item: E-2 (inferred) | Domain: Literacy – Print Awareness
  // Developmental span: preschool to early school age
  // ──────────────────────────────────────────────────────────
  printAwareness: {
    itemCode: "E-2",
    domainLabel: "Print Awareness: Print Awareness and Concepts",
    ageRange: "Preschool – early school age",
    clinicalNote: "Print awareness is a foundational literacy predictor. Developmental sequence: awareness of print in environment → interest in different forms of print → book orientation → title pointing → page turning → top-to-bottom and left-to-right tracking → spoken-written word association → understanding that letters form words with spaces between them. Flag children with no print awareness by age 4 for family literacy support discussion.",
    activities: [
      {
        id: "PAC-01",
        title: "What Does This Say? (Print Walk)",
        audience: "both",
        materials: ["Various print materials: books, posters, catalogues, recipes, menus, newspapers, magazines, shopping lists, maps, labels, signs"],
        groupSize: "Individual, small group, or class",
        summary: "Walk through the classroom (or home) identifying and reading environmental print. Develops understanding that print carries a message and serves different functions.",
        parentVersion: "Take a 'print walk' around your home. Look for all the words you can find: cereal boxes, signs on the street, receipts, labels on jars, books, magazines. Point to each one and read it: 'That says STOP. This says milk.' Ask your child: 'What do you think this says?' Help them notice that letters and words are everywhere.",
        educatorVersion: "Display diverse literacy materials including culturally reflective materials. Walk the room identifying print. Read signs, labels, and bulletin board text aloud. Point to words as you read them. Goal: develop understanding that print has function and carries meaning. Spontaneously refer to print throughout the day: 'Your name is on the turns list — here it is!'"
      },
      {
        id: "PAC-02",
        title: "Let's Read Together! (Shared Reading with Tracking)",
        audience: "both",
        materials: ["A favourite book"],
        groupSize: "Individual",
        summary: "Model reading behaviours: tracking print top-to-bottom and left-to-right, holding book right-side-up, identifying front/back covers, pointing to title. Child turns pages on cue.",
        parentVersion: "When reading to your child, let them hold the book and turn the pages. Before you start, point to the front cover and read the title. As you read, use your finger to show your child that you're reading the words — going left to right, then moving to the next line down. When the page ends, let your child turn to the next one.",
        educatorVersion: "Model all print behaviours explicitly: book orientation, front/back covers, title pointing, left-to-right and top-to-bottom tracking, page turning, return sweep. After reading, invite children to 'pretend read' to a doll or stuffed animal — observe reading behaviours used. Note which print concepts are established for each child."
      },
      {
        id: "PAC-03",
        title: "Write It Down, Then Read It! (Modelled Writing in Play)",
        audience: "both",
        materials: ["Writing materials in dramatic play area"],
        groupSize: "Individual",
        summary: "Educator participates in children's dramatic play and models purposeful writing (signs, menus, notes, stories) with explicit attention to conventions: left-to-right, spaces between words, return sweep, punctuation. Reads back what was written while tracking print.",
        parentVersion: "When your child is playing, join in and write things together — a menu for your pretend restaurant, a shopping list, a note to a toy. As you write, talk about what you're doing: 'I'm starting on this side and writing this way. I leave a space between each word.' Read it back and point to each word as you say it.",
        educatorVersion: "Participate in dramatic play to model authentic writing purposes. Model conventions while narrating: 'I start at the top left, I move from left to right, I leave a space between words, at the end I make a full stop.' Read written text back while tracking with finger left-to-right. Give written product to children to incorporate into play."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // ALPHABET KNOWLEDGE: Reads Uppercase and Lowercase Letters
  // IED III item: E-3/E-4 (inferred) | Domain: Literacy – Alphabet Knowledge
  // Developmental span: 5-9 to 6-3
  // ──────────────────────────────────────────────────────────
  readsLetters: {
    itemCode: "E-3",
    domainLabel: "Alphabet Knowledge: Reads Uppercase and Lowercase Letters",
    ageRange: "5 years 9 months – 6 years 3 months",
    clinicalNote: "Alphabet knowledge (letter names and letter-sound associations) is a strong predictor of later literacy achievement (US National Early Literacy Panel). Teaching sequence: receptive (match identical letters) → receptive (point to named letter) → expressive (name the letter). Teach uppercase first (more distinct from each other); introduce lowercase after uppercase mastered. Flag vision problems (astigmatism, poor acuity, farsightedness, nearsightedness) and articulation difficulties separately from letter knowledge deficits. Note: b/d confusion is developmentally common; use 'bed' mnemonic.",
    activities: [
      {
        id: "RL-01",
        title: "Magnetic Match",
        audience: "educator",
        materials: ["Two sets of uppercase or lowercase magnetic letters", "Magnetic board"],
        groupSize: "Individual or small group",
        summary: "4–5 letters placed vertically on left side of board; same letters randomly placed on right. Educator names a letter and child finds its match on the right side. Extension: match uppercase to lowercase counterparts.",
        parentVersion: "Use fridge magnets or letter tiles. Put some letters in a line on one side and mix the same letters up on the other side. Name a letter: 'Can you find the B?' and let your child match it. When they're ready, try matching uppercase (big) letters to lowercase (small) letters.",
        educatorVersion: "Line 4–5 letters on left; randomly place matching letters on right. Point to a letter, say its name, ask child to find match on right. Extension: uppercase left, lowercase right — child matches pairs. Encourage handling of magnetic letters to reinforce shape. Begin with letters in children's names."
      },
      {
        id: "RL-02",
        title: "Hungry Mice (Uppercase/Lowercase Matching)",
        audience: "educator",
        materials: ["26 cardboard mice (uppercase letters)", "26 cardboard cheese wedges (lowercase letters)", "Texta"],
        groupSize: "Individual or small group",
        summary: "Playful matching game: uppercase letters on mice, lowercase on cheese wedges. Child matches each mouse to its corresponding cheese. Reinforces letter-case pairing in an engaging format.",
        parentVersion: "Draw simple mouse and cheese shapes on card — write one uppercase letter on each mouse and the matching lowercase letter on each cheese piece. Mix them up and ask your child to match each mouse with its cheese. Start with the letters in your child's name.",
        educatorVersion: "Prepare uppercase mice and lowercase cheese in advance. Child matches all 26 pairs. To simplify: start with 5–6 letters. To extend: include both cases randomly and have child sort into matched pairs. Builds understanding that each letter has two forms."
      },
      {
        id: "RL-03",
        title: "Match and Snap (Clothes Peg Box)",
        audience: "educator",
        materials: ["Shoebox", "26 wooden clothes pegs", "Texta"],
        groupSize: "Individual",
        summary: "Uppercase alphabet printed along top of open box; matching letters written on clothes pegs. Child attaches pegs above corresponding letters. Fine-motor and letter recognition combined.",
        parentVersion: "Write letters along the edge of a box lid. Write matching letters on clothes pegs. Let your child clip each peg next to its matching letter. Start with a few letters at a time. A good rainy-day activity that builds letter recognition and finger strength at the same time.",
        educatorVersion: "Preparation: print uppercase alphabet 2cm below rim of open box (split across sides if needed); print matching uppercase on pegs. Demonstrate attaching 3 pegs above matching letters. Child matches remaining pegs. Extension: lowercase on box, uppercase on pegs (or vice versa). Combines fine-motor and letter knowledge."
      },
      {
        id: "RL-04",
        title: "Can You Find a Match? (Memory Game)",
        audience: "both",
        materials: ["Two identical sets of lowercase or uppercase letter cards (playing-card size)"],
        groupSize: "Small group",
        summary: "Traditional memory/concentration game using letter cards. Children select two cards, name both letters, keep matching pairs. Builds letter naming fluency and visual memory.",
        parentVersion: "Make two matching sets of letter cards (or use purchased alphabet cards). Shuffle and place face-down. Take turns flipping two cards — name each letter as you flip it. If they match, keep the pair. If not, flip them back. The player with the most pairs wins.",
        educatorVersion: "Standard memory game format with letter naming requirement — children must name letters as they flip. This builds expressive letter knowledge under mild cognitive load. Extension: match uppercase to lowercase across two different sets."
      },
      {
        id: "RL-05",
        title: "Letter Walk (Footprint Floor Path)",
        audience: "educator",
        materials: ["Footprint cut-outs from paper", "Texta", "Tape"],
        groupSize: "Individual or small group",
        summary: "Paper footprints with individual letters arranged in a walking pattern on the floor. Children walk the path, reading each letter aloud before stepping on it. Active and kinaesthetic letter practice.",
        parentVersion: "Write one letter on each piece of paper and lay them in a path on the floor. Ask your child to read the letter on each piece before they step on it. You can change the letters each time you play.",
        educatorVersion: "Arrange footprints in a winding path. Demonstrate: look at the letter, say its name, step on the footprint. Children take turns. Can be arranged as alphabetical sequence or random mix. Reuse path with different letters or all letters at different times."
      },
      {
        id: "RL-06",
        title: "Grab Bag",
        audience: "both",
        materials: ["Uppercase and lowercase letter cards", "Paper bag"],
        groupSize: "Small group",
        summary: "Letter cards (uppercase and lowercase mixed) placed in a paper bag. Each child draws a card without looking and names the letter. After all cards drawn, children match uppercase to lowercase pairs on a table.",
        parentVersion: "Put some letter cards in a bag. Your child reaches in without looking, pulls out a card, and names the letter. Do it a few times. Then spread the cards out and see if they can match each uppercase letter to its lowercase partner.",
        educatorVersion: "Mix uppercase and lowercase cards in bag. Each child draws and names their card before handing to the next child. After all drawn, spread all cards on a table — children work together to match uppercase to lowercase pairs. Builds both naming fluency and case-matching."
      },
      {
        id: "RL-07",
        title: "Alphabet Hopscotch",
        audience: "both",
        materials: ["Large sheet of paper or poster paper", "Texta (or chalk outdoors)"],
        groupSize: "Individual or small group",
        summary: "Hopscotch diagram with letters in each section. Children hop onto a letter and say its name. Can be ordered or random. Outdoor variation with chalk. Active, movement-based letter naming.",
        parentVersion: "Draw a hopscotch grid on paper (or use chalk outside). Write a letter in each square — mix them up, don't put them in order. Your child hops on each square and says the letter name. Jump and learn!",
        educatorVersion: "Draw hopscotch on large paper or playground chalk. Print letters in squares — random order is fine and more challenging. Demonstrate: hop, say the letter name. Children take turns. Change which letters are included across sessions to ensure full alphabet coverage."
      },
      {
        id: "RL-08",
        title: "Musical Letters",
        audience: "educator",
        materials: ["Letter cards (one per child)", "Music player"],
        groupSize: "Small group or class",
        summary: "Musical chairs format: children pass letter cards around a circle while music plays. When music stops, each child names the letter they are holding. Builds fluency under playful time pressure.",
        parentVersion: "Give your child a letter card and put on some music. When the music plays, pass the card back and forth between you. When the music stops, whoever is holding the card names the letter. Switch cards and keep going.",
        educatorVersion: "Each child holds a letter card. Music starts — children pass cards around the circle. Music stops — go around and each child names the letter they are holding. Continue until each child has read several letters. Ensures exposure to all letters, not just familiar ones."
      },
      {
        id: "RL-09",
        title: "Go Fish (Letter Version)",
        audience: "both",
        materials: ["Four identical sets of letter cards (playing-card size)"],
        groupSize: "Small group",
        summary: "Go Fish played with letter cards. Children must name the letter to ask for it ('Do you have any Ps?'). Goal is to collect sets of four matching letter cards.",
        parentVersion: "Play Go Fish but with letter cards. Deal 5 cards each. To ask for a card, your child must say the letter name: 'Do you have any Bs?' If you don't, they draw from the pile ('Go fish!'). First to collect sets of four matching letters wins.",
        educatorVersion: "Standard Go Fish rules; children request cards by letter name. Collecting four of a kind requires sustained engagement with letter naming. At end of game, children count their sets. Builds expressive letter knowledge through repeated naming in a motivating context."
      },
      {
        id: "RL-10",
        title: "Letter Riddles",
        audience: "both",
        materials: ["Set of uppercase letter cards (A–M first session; N–Z second session)"],
        groupSize: "Individual, small group, or class",
        summary: "Educator gives clues about a letter ('I am thinking of the letter that is first in David's name') and children find and hold up the correct card. Builds receptive letter identification through meaningful contexts.",
        parentVersion: "Lay some letter cards out on the table. Give your child a clue: 'I'm thinking of the letter that starts your name' or 'I'm thinking of the letter that looks like a circle.' Let them find and hold up the right card. Then swap and let them give you a clue.",
        educatorVersion: "Clues can reference: children's names, letter shapes, sounds, positions in familiar words. Children must identify the letter and name it. Use A–M in one session, N–Z in another. Extension: repeat with lowercase letter cards. Builds both receptive identification and expressive naming."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // EARLY WRITING: Prints Uppercase and Lowercase Letters in Sequence
  // IED III item: F-3/F-4 (inferred) | Domain: Literacy – Early Writing
  // Developmental span: 5-6 (uppercase A–Z) to 6-6 (lowercase a–z)
  // ──────────────────────────────────────────────────────────
  printsLetters: {
    itemCode: "F-3",
    domainLabel: "Early Writing: Prints Uppercase and Lowercase Letters in Sequence",
    ageRange: "5 years 6 months (UC) – 6 years 6 months (LC)",
    clinicalNote: "Teaching sequence: tracing → copying → printing from memory. Teach uppercase first (more visually distinct). Determine hand dominance early (note switching between hands as a flag). Check pencil grasp: thumb and index finger, not palmar grasp, not >2cm from point. Directional terms (up, down, left, right) must be understood before letter formation. Flag significant difficulty for OT referral. Letter reversals are common until ~7 years. Zaner-Bloser and D'Nealian are the two handwriting styles referenced; check which is used in your educational jurisdiction.",
    activities: [
      {
        id: "PL-01",
        title: "Dough Letters",
        audience: "both",
        materials: ["Play dough", "Letter models for reference"],
        groupSize: "Individual, small group, or class",
        summary: "Children roll play dough into 'snakes' and shape them into letters. Educator names letters as formed and connects to sounds and names. Tactile and multisensory approach builds letter formation before fine-motor demand of pencil use.",
        parentVersion: "Make or buy some play dough. Roll it into thin snakes and shape them into the letters of your child's name. Name each letter as you make it. Take turns — you make a letter and ask your child to copy you. Then let them make their own. Talk about the shapes you're making.",
        educatorVersion: "Children roll dough into snakes; demonstrate forming letter shapes. Name letters as formed; connect to sounds and children's names: 'That's a B — the first sound in Ben's name.' Talk through formation direction using up/down/left/right. This is pre-pencil practice that builds letter shape memory through large-muscle movement."
      },
      {
        id: "PL-02",
        title: "Sandy Letters (Tactile Letter Cards)",
        audience: "both",
        materials: ["52 cardboard squares (12cm x 12cm)", "Glue", "Sand or salt"],
        groupSize: "Individual",
        summary: "Glue-and-sand letter cards for uppercase and lowercase alphabet. Child traces each letter with finger, receiving tactile feedback. Educator verbalises direction using up/down/left/right terms.",
        parentVersion: "Make tactile letter cards: write a letter on card with glue, sprinkle sand or salt over it, and let it dry. Give your child the cards and let them trace the shape of each letter with their finger. Say the direction out loud as they trace: 'Down, then across.'",
        educatorVersion: "Preparation: glue-and-sand each of 52 letters (26 uppercase + 26 lowercase). Child traces with finger while educator verbalises direction. 'Extension: have children choose the letters in their name and arrange them in order. Tactile input supports spatial memory for letter formation."
      },
      {
        id: "PL-03",
        title: "Print in Sand",
        audience: "both",
        materials: ["Shallow box lid (shoebox or chocolate box)", "Sand", "Letter models"],
        groupSize: "Individual or small group",
        summary: "Children print letters in a sand-filled shallow box, then shake to erase. Low-stakes practice that allows correction without frustration. Uses same principles as sandy letter cards but in a writing (output) mode.",
        parentVersion: "Put a thin layer of sand in a shallow box lid. Show your child how to write letters in the sand with their finger. When they're done, shake the box to erase and try the next letter. Less pressure than paper — mistakes just disappear!",
        educatorVersion: "Fill box lids 0.5–1cm deep with sand. Provide letter models. Child prints, then erases by shaking. Verbalise stroke direction. Good for children who are anxious about making mistakes. Progress from gross motor (finger) to pencil on paper once letter shapes are reliably formed."
      },
      {
        id: "PL-04",
        title: "Letters Out of Sequence",
        audience: "both",
        materials: ["Set of alphabet cards (uppercase or lowercase)"],
        groupSize: "Individual, small group, or class",
        summary: "A sequence of 5 alphabet cards is displayed with 1–2 letters out of order. Child identifies and corrects the sequence. Builds knowledge of alphabetical order and letter names simultaneously.",
        parentVersion: "Lay out five letter cards in order but put one or two in the wrong place (e.g. E G H I F). Ask your child: 'Are these in the right order?' Let them rearrange to fix it. Use the alphabet chart on the wall as a reference if they need it.",
        educatorVersion: "Place 5 letters in board tray with 1–2 out of order. Child identifies and rearranges. If child has difficulty, refer them to alphabet tape/border in the classroom. Variation: magnetic letters, alphabet blocks. Extension: increase to more letters or more errors."
      },
      {
        id: "PL-05",
        title: "Alphabet Cards (Sequence Sorting)",
        audience: "both",
        materials: ["Full set of alphabet cards per child (uppercase or lowercase)"],
        groupSize: "Individual, small group, or class",
        summary: "Children arrange all alphabet cards in correct sequence in the chalk tray or on a table. After sequencing, point to each letter and say its name. Extension: spell first and last name using the cards.",
        parentVersion: "Give your child a full set of alphabet cards (or write letters on pieces of card). Mix them up and ask them to put them in order from A to Z. Once they're done, point to each one and say the letter name together.",
        educatorVersion: "Children arrange full alphabet in sequence. After sequencing, children point to each letter and say its name. Extension: 'Now use your letter cards to write your first name and last name.' Connects alphabet sequence knowledge to personal and functional writing."
      },
      {
        id: "PL-06",
        title: "Which Letter Are You? (Human Alphabet)",
        audience: "educator",
        materials: ["26 sheets of coloured project paper", "Texta (uppercase on one side, lowercase on reverse)", "Camera (optional)"],
        groupSize: "Class",
        summary: "Each child holds a letter card and works with classmates to arrange themselves in alphabetical sequence. Active, collaborative letter-ordering experience. Optional class photo for alphabet poster.",
        parentVersion: "Write letters on cards or pieces of paper. Give your child a few letters and see if they can arrange themselves (or arrange the cards) in alphabetical order. Sing the alphabet song together as you check the order.",
        educatorVersion: "Print uppercase on one side of each card, lowercase on reverse. Give one card to each child (or pair for larger classes). Children collaborate to arrange themselves in alphabetical sequence. Photograph for class alphabet poster. Builds both letter knowledge and collaborative problem-solving."
      },
      {
        id: "PL-07",
        title: "Missing Letters (Board Activity)",
        audience: "educator",
        materials: ["Board", "Chalk", "Board eraser"],
        groupSize: "Individual, small group, or class",
        summary: "Educator writes the alphabet on the board with several letters replaced by blank lines. Children take turns printing the missing letter and saying its name. Peer support: 'If you can't remember, ask the group — what letter is missing?'",
        parentVersion: "Write the alphabet on paper with some letters replaced by a blank line (e.g. A B C _ E _ G). Ask your child to write in the missing letters. They can sing the alphabet song or look at an alphabet chart if they need help.",
        educatorVersion: "Write alphabet with 2–5 letters missing (blank lines). Child comes to board and prints missing letter(s) with name. Provide stroke description support if needed: 'Pull down straight. Slide right. Slide right.' Whole group can help if child is stuck. Variation: individual worksheets."
      },
      {
        id: "PL-08",
        title: "Finger Paint Letters",
        audience: "both",
        materials: ["Finger paints", "Glossy finger-paint paper", "Smock"],
        groupSize: "Individual, small group, or class",
        summary: "Children copy the uppercase alphabet from the board using finger paint. Combines large-surface practice (intermediate step between air-tracing and lined paper) with sensory engagement. Variation with lowercase when ready.",
        parentVersion: "Set up finger paints and paper. Write the alphabet on a big piece of card for your child to look at. Let them copy the letters using their finger and paint. This is a messy but brilliant way to practise — the large movements help build letter memory. Smock or old clothes recommended!",
        educatorVersion: "Print alphabet on board for reference. Children copy alphabet in sequence on finger-paint paper. Once reliable, ask children to print letters without looking at the board (from memory). Variation: lowercase when uppercase is consolidated. This is a developmental bridge between gross-motor and fine-motor letter writing."
      },
      {
        id: "PL-09",
        title: "Let's Print Uppercase Letters A–Z (Tracing Worksheet)",
        audience: "educator",
        materials: ["D'Nealian (page 132) or Zaner-Bloser (page 133) uppercase tracing worksheet", "Pencil"],
        groupSize: "Individual or small group",
        summary: "Structured uppercase letter tracing with directional arrows and numbered stroke sequences. Educator demonstrates facing the children. Progress: trace → copy → print from memory.",
        parentVersion: "Find an uppercase letter tracing sheet (many free ones are available to print online). Show your child the arrows and numbers that show how to make each letter. Demonstrate one letter facing them, then let them trace it several times. Focus on correct direction, not neatness.",
        educatorVersion: "Demonstrate facing children (so they see the letter in the correct orientation). Explain numbered arrows: stroke order and direction. Children trace; educator checks direction is correct and verbalises. After tracing reliably: copy to blank lines on the same sheet. After copying reliably: print from memory on primary lined paper. Select Zaner-Bloser or D'Nealian to match jurisdiction standard."
      },
      {
        id: "PL-10",
        title: "Let's Print Lowercase Letters a–z (Tracing Worksheet)",
        audience: "educator",
        materials: ["D'Nealian (page 134) or Zaner-Bloser (page 135) lowercase tracing worksheet", "Pencil"],
        groupSize: "Individual or small group",
        summary: "Structured lowercase letter tracing with directional arrows. Introduce after uppercase is established. Note: two forms of 'a' and 'g' exist (book form vs letter form) — clarify which form matches classroom alphabet chart.",
        parentVersion: "Once your child knows the uppercase letters, start on lowercase. Find a lowercase tracing worksheet. Remember that some letters look different in books and in handwriting (like 'a' and 'g') — just use whichever your child's school prefers.",
        educatorVersion: "Introduce lowercase only after uppercase is reliably established. Note two forms of 'a' and 'g' — ensure the form taught matches the classroom alphabet chart and the children's books they read. Same progression as uppercase: trace → copy → memory. Pay close attention to b/d and p/q which are common confusions."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // EARLY WRITING: Prints Personal Data
  // IED III item: F-5 | Domain: Literacy – Early Writing
  // Developmental span: 5-3 to 7-0
  // NOTE: F-5 is already included in languageAndFineMotorActivities.js (Batch 2)
  // This entry provides the additional activities from this PDF batch
  // that were not captured in the earlier batch.
  // ──────────────────────────────────────────────────────────
  printsPersonalData: {
    itemCode: "F-5",
    domainLabel: "Early Writing: Prints Personal Data",
    ageRange: "5 years 3 months (first name initial) – 7 years (address)",
    clinicalNote: "NOTE: F-5 activities from Batch 2 (languageAndFineMotorActivities.js) should be merged with these. Prerequisite sequence: verbalise personal data → visual discrimination → reads UC/LC letters → prints UC/LC letters → then prints personal data. Developmental sequence: first letter of first name (5-3) → nickname → first name → last name → age → telephone number → middle name → address (7-0). Weak fine-motor skills will affect letter formation — refer to fine-motor activities. If child writes only in uppercase, teach transition to mixed case (uppercase at beginning of name, lowercase for the rest). Flag children who cannot print first name by school entry for fine-motor and developmental review.",
    activities: [
      {
        id: "PD-01",
        title: "Sandy Cards (Name Tracing)",
        audience: "both",
        materials: ["Project paper (8 x 20cm per child)", "White school glue or glue stick", "Sand"],
        groupSize: "Individual, small group, or class",
        summary: "Each child's name is written on card with glue, then sand is sprinkled over it and dried. Child traces the raised sand letters with their finger. Extension: make cards for address and phone number.",
        parentVersion: "Write your child's name on a piece of card using glue (squeezing it out in letter shapes). Sprinkle sand over it and let it dry. When dry, give it to your child to trace each letter with their finger. They can feel the shape of the letters as they trace.",
        educatorVersion: "Preparation: glue-write each child's name on project paper; apply sand; dry. Give children their card right-side-up. Child traces each letter. Extension: once name is mastered, make sand cards for address and telephone number. Tactile input reinforces letter shape memory — useful for children who struggle with visual-only instruction."
      },
      {
        id: "PD-02",
        title: "Arrange the Letters (Name Building)",
        audience: "both",
        materials: ["Many small pieces of project paper (4x4cm)", "3 pieces project paper (8x22cm) per child", "Texta", "Envelope per child"],
        groupSize: "Individual, small group, or class",
        summary: "Each letter of the child's name, address, and phone number printed on individual small cards. Child arranges letter cards to form their name, using a model card for reference. Cards stored in personal envelope.",
        parentVersion: "Write each letter of your child's name on a separate small piece of card. Write their whole name on a bigger card as a model. Mix up the letter cards and ask your child to arrange them to spell their name, using the model card to check. Once they've got it, try their surname.",
        educatorVersion: "Prepare individual letter cards for each child's name (and eventually address and phone number). Provide name model card. Child uses letter cards to form their name, using the model as reference. Store cards in a labelled envelope for repeated use. Progress to address and phone number when name is secure."
      },
      {
        id: "PD-03",
        title: "Type Personal Data",
        audience: "both",
        materials: ["Computer or tablet", "Printer (optional)", "Child's name, address, and phone number cards as models"],
        groupSize: "Individual",
        summary: "Child types their name using a keyboard, using their name card as a model. Extension to address and phone number. Note: ensure font style matches the letter forms children are learning (two forms of 'a' and 'g' exist).",
        parentVersion: "Let your child type their name on a phone, tablet, or computer. Give them their name written on a card to copy from. Start with just their first name. When they've got that, add their last name, then try their phone number. Print it out if you can so they can match it to their card.",
        educatorVersion: "Set up computer centre with name cards. Ensure the font used matches the letter forms children are learning (not all fonts match — two forms of 'a' and 'g' exist). Child types name using card as model. Print output so child can compare to model card. Progress to address and phone number."
      },
      {
        id: "PD-04",
        title: "Twisted Letters and Numbers (Pipe Cleaners)",
        audience: "both",
        materials: ["Pipe cleaners", "Name card, address card, and phone number card for each child"],
        groupSize: "Individual, small group, or class",
        summary: "Children twist pipe cleaners to form the letters of their name. Builds three-dimensional understanding of letter shapes in a tactile, multisensory format.",
        parentVersion: "Give your child some pipe cleaners and their name written on a card. Show them how to bend and twist the pipe cleaners into letter shapes. It takes some patience, but it's a great way to really understand the shape of each letter.",
        educatorVersion: "Demonstrate twisting and combining pipe cleaners to form letter shapes. Children form letters in their name; then extend to address and phone number numerals. Three-dimensional manipulation reinforces letter shape and construction. Useful alternative for children who struggle with pencil-based tasks."
      },
      {
        id: "PD-05",
        title: "Dough Data (Name in Play Dough)",
        audience: "both",
        materials: ["Play dough", "Name card, address card, and phone number card per child"],
        groupSize: "Individual, small group, or class",
        summary: "Children roll play dough into snakes and shape into letters of their name, then match to name card model. Then extend to address and phone number.",
        parentVersion: "Roll play dough into thin snakes and help your child shape each letter of their name. Use their name written on a card as a model. Match each dough letter to the letter on the card. Then squash and start again with a new letter. Fun and tactile!",
        educatorVersion: "Children roll dough snakes and form letters of their name, matching to model card. Extend to address and phone number. Clean up between letter sets. Builds letter-shape memory through manipulation without pencil-grasp demands."
      },
      {
        id: "PD-06",
        title: "Sandy Writing (Sand Tray and Finger Paint)",
        audience: "both",
        materials: ["Shallow box or shoebox lid", "Sand", "Finger paint", "Finger-paint paper"],
        groupSize: "Individual or small group",
        summary: "Child watches educator write their name slowly in sand, then copies in the sand. Erase by shaking. Variation: finger paint spread on paper, write name with index finger, spread paint to erase and repeat.",
        parentVersion: "Pour some sand in a shallow lid or tray. Slowly write your child's name in the sand, letter by letter, saying each letter as you write. Shake to erase and have your child try. Alternatively, spread finger paint on paper and let your child write their name in the paint with their finger — spread it out to erase and start again.",
        educatorVersion: "Write name slowly in sand; child watches, then copies. Educator writes letter by letter; child copies each. Erase by shaking. Finger paint variation: spread paint on finger-paint paper; child writes name with index finger; spread to erase; repeat. Low-stakes, self-correcting format."
      },
      {
        id: "PD-07",
        title: "Write It on the Dotted Line (Dot-to-Trace Name)",
        audience: "both",
        materials: ["Primary writing paper with child's name written in dots", "Pencil"],
        groupSize: "Individual, small group, or class",
        summary: "Child's name is written in dotted (dashed) outline on primary writing paper. Child traces each letter, then copies their name on the bottom of the page.",
        parentVersion: "Write your child's name in dotted lines (dashes) on a piece of lined paper. Ask your child to trace over each letter with a pencil, then try to copy their name on the line below without the dots. This is one step before writing from memory.",
        educatorVersion: "Preparation: write each child's name in dotted (dashed) letters on primary writing paper. Child traces, then copies on the line below. This bridges between tracing and independent writing. Final step: ask child to write name from memory on a blank line."
      },
      {
        id: "PD-08",
        title: "Ring the Bell! (Telephone Number Writing)",
        audience: "educator",
        materials: ["Project paper", "Texta", "String or ribbon spirals", "Bulletin board", "Bell", "Each child's telephone number card"],
        groupSize: "Small group or class",
        summary: "Children write their phone number on a paper telephone receiver, using their number card as a model. When complete, they ring the bell and their receiver is pinned to the display board connected to the phone base. Celebratory milestone marker.",
        parentVersion: "Help your child learn their home or parent's mobile number. Write the number on a card as a model. Let your child copy it onto another piece of paper. When they can write it correctly, make a small celebration — ring a bell, give a high five. Knowing their phone number is an important safety skill.",
        educatorVersion: "Create paper telephone base for bulletin board; individual receivers for each child. Child writes phone number on receiver using number card as model. Celebratory bell ring when complete; pin receiver to bulletin board. Phone number knowledge is a safety skill — flag families to support this at home."
      },
      {
        id: "PD-09",
        title: "Print Your Home Address (Paper House)",
        audience: "both",
        materials: ["Project paper (house shape cut-out)", "Texta for preparation", "Primary pencil", "Each child's address card"],
        groupSize: "Individual, small group, or class",
        summary: "Educator prepares a paper-house cut-out for each child. Child prints their home address on the house using their address card as a model. Houses displayed on classroom bulletin board.",
        parentVersion: "Make a house shape from paper. Help your child write their home address on the house, using their address written on a card as a model. Display it somewhere in their room to practise reading it. Knowing their address is an important safety skill.",
        educatorVersion: "Prepare paper-house cut-outs in advance. Child prints address on house using address card as model. Display on bulletin board. Address writing is a community safety skill — embed discussion about why we need to know our address. Flag to families to reinforce at home."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // PHONOLOGICAL AWARENESS
  // IED III item: E-5 to E-8 range (inferred) | Domain: Literacy – Phonological Awareness
  // Developmental span: 48–60 months onset; develops to 7+ years
  // ──────────────────────────────────────────────────────────
  phonologicalAwareness: {
    itemCode: "E-5",
    domainLabel: "Phonological Awareness: Phonological Awareness Skills",
    ageRange: "4–7 years (initial development 48–60 months)",
    clinicalNote: "Phonological awareness — the ability to detect, manipulate, or analyse spoken language independent of meaning — is a consistent and strong predictor of later literacy achievement (US National Early Literacy Panel Report). Developmental sequence: rhyme detection with picture support → oral rhyme production → clap words in a sentence → clap syllables in a name → identify syllable count → compound word blending (oral) → two-syllable word blending (oral) → compound word segmentation → initial sound identification → final sound identification → onset-rime blending → onset deletion → onset addition → onset substitution → phoneme segmentation. Activities below align to this sequence. Persistent phonological awareness difficulties despite targeted teaching warrant speech-language pathology referral.",
    activities: [
      {
        id: "PA-01",
        title: "It's Rhyme Time! (Nursery Rhyme Rhyme Detection)",
        audience: "both",
        materials: ["Favourite nursery rhymes (no materials required)"],
        groupSize: "Individual or small group",
        developmentalTarget: "Fills-in rhyming words; detects rhyme",
        summary: "Recite familiar rhymes slowly. Point out rhyming word pairs. Pause before the second rhyming word in a pair and encourage children to chime in. Discuss other words that rhyme with the pair.",
        parentVersion: "Recite nursery rhymes with your child, going slowly. When you reach a rhyming word, pause and see if they can fill it in: 'Teddy bear, touch the...' [pause] and let them say 'ground!' Ask: 'What other words rhyme with ground? Round! Found! Sound!' This builds a key reading skill called rhyming.",
        educatorVersion: "Recite I'm a Little Teapot or Teddy Bear rhyme slowly. Point out rhyming pairs (stout/spout; shoe/do). Pause before second rhyming word — children chime in. Ask for other words that rhyme with the pair. Identify rhyming pairs in finger plays: 'What word sounds like shoe: one or two?'"
      },
      {
        id: "PA-02",
        title: "Which One Rhymes? (Picture Card Rhyme Sets)",
        audience: "both",
        materials: ["Six sets of 3 picture cards: 2 rhyming words + 1 non-rhyming (e.g. cat/hat/boy; duck/truck/mop)", "Cardboard", "Laminate if possible"],
        groupSize: "Individual or small group",
        developmentalTarget: "Detects rhyme with picture support",
        summary: "Display a set of 3 picture cards. Point to each and name it. Ask which two rhyme. Provide additional support by holding up the two rhyming cards and asking if the third word matches their ending sounds.",
        parentVersion: "Make simple picture cards with three pictures: two that rhyme and one that doesn't (e.g. a cat, a hat, and a boy). Lay them out and ask your child: 'Which two words rhyme — which two sound the same at the end?' Cat and hat rhyme. Boy doesn't. If they find it tricky, say all three words really slowly and listen for the ending sounds together.",
        educatorVersion: "Prepare 6 sets of 3 picture cards (2 rhyming + 1 non-rhyming). Display one set; name each picture. 'Does cat sound like hat or boy?' Reduce to 2 cards if child needs support: hold up cat and hat, then introduce boy and ask if it matches their ending sounds. Progress through all 6 sets. Use Australian-familiar words where possible."
      },
      {
        id: "PA-03",
        title: "It's Time to Clap Your Name! (Syllable Clapping)",
        audience: "both",
        materials: ["Children's name cards"],
        groupSize: "Small group or class",
        developmentalTarget: "Can clap words in a sentence; can clap syllables in a name",
        summary: "Children sit in a circle. Educator introduces syllable concept using name cards. Clap each syllable of a name together: Lee (1 clap), Ju-lie (2 claps), Stu-art (2 claps). Progress from 1-syllable to multi-syllable names.",
        parentVersion: "Clap your child's name with them, one clap per syllable: 'Jas-mine' = 2 claps. 'Oli-ver' = 3 claps. 'Jack' = 1 clap. Try with family members' names, favourite characters, animal names, food names. Clapping words teaches your child that words are made of parts — an important early literacy skill.",
        educatorVersion: "Use name cards. Demonstrate single-syllable name (1 clap) through to multi-syllable names. Hold up name card as you say and clap. Children clap with you. Begin with 1–2 syllable names; progress to longer names. Variation: invite children to find objects in the room to name and clap. Variation: use characters' names from a current class book."
      },
      {
        id: "PA-04",
        title: "How Many Parts? (Animal Syllable Counting)",
        audience: "both",
        materials: ["Picture cards of animals with varied syllable counts (bird, cat, dolphin, koala, dinosaur, camel, horse, dog, grasshopper, kangaroo, hippopotamus, giraffe)"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Can identify how many syllables in familiar words",
        summary: "Display animal pictures. Educator models naming each animal and clapping syllables. Children clap and count syllables in each animal name. Includes multi-syllable Australian animals (kangaroo, koala).",
        parentVersion: "Look at pictures of animals together. Say the animal's name out loud and clap one time for each syllable: 'bird' = 1 clap; 'dol-phin' = 2 claps; 'kan-ga-roo' = 3 claps; 'hip-po-pot-a-mus' = 5 claps! Count how many claps each name gets.",
        educatorVersion: "Display animal pictures on board. Point to each; children name the animal. Model clapping syllables (bird = 1; kan-ga-roo = 3). Children clap and count. Include Australian animals: koala (3), kangaroo (3), grasshopper (3), hippopotamus (5). Variation: children find objects in the room to name and clap."
      },
      {
        id: "PA-05",
        title: "Put Them Together and What Do You Get? (Compound Word Blending)",
        audience: "both",
        materials: ["None (or picture cards of compound words as extension)", "Compound word picture display (e.g. underarm, raincoat, snowman, hairbrush, fireplace, seagull)"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Orally puts together two familiar words to make a compound word",
        summary: "Educator says two separate words; children blend them into a compound word. Extension: children identify component words within a compound word ('What words do you hear in barefoot?') and delete one component ('What word would you get if you said barefoot without bare?').",
        parentVersion: "Play a word puzzle game: 'I'm thinking of two words — foot and ball. What do you get when you say them together?' (football!) Try: rain + bow, gum + nut, letter + box, back + pack. When your child gets confident, try harder: 'I'm thinking of the word barefoot — what two words do you hear inside it?'",
        educatorVersion: "Say two words with emphasis on each. 'What word do you get when you say foot and ball together?' Australian-familiar compound words: gumnut, letterbox, backpack, barefoot, fireworks, seagull, raincoat. Display compound word picture board. Extension: segmentation — 'What words do you hear in barefoot?' Deletion: 'What word if you say barefoot without bare?'"
      },
      {
        id: "PA-06",
        title: "Name That Snack! (Two-Syllable Word Blending)",
        audience: "both",
        materials: ["Picture cards of 2-syllable foods: biscuit, pizza, carrots, apples, crackers, yoghurt"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Orally puts together the two syllables of familiar two-syllable words",
        summary: "Picture cards of 2-syllable foods displayed. Educator says syllables separately; children blend into the word. Extension with 3-syllable foods (spaghetti, hamburger).",
        parentVersion: "Point to food pictures and say each part slowly: 'What word do you get when I say bis... cuit?' (biscuit!) Try with other foods your family eats. When they're confident, try three-part words: 'spa... ghe... tti!' This is called syllable blending and it's an important reading skill.",
        educatorVersion: "Display food picture cards. Educator says syllables: 'bis-cuit' — children say the word. 'car-rot' — children respond. Australian-familiar foods where possible. Extension: three-syllable foods — spa-ghet-ti (3 syllables), ham-bur-ger (3 syllables). Using food context is motivating and concrete."
      },
      {
        id: "PA-07",
        title: "What Sound Is the Same? (Initial Sound Identification)",
        audience: "both",
        materials: ["No materials required"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Identifies the initial sounds common in a few words",
        summary: "Educator says 3 words beginning with the same sound; children identify the common beginning sound. Then a new word is offered and children judge whether it begins the same way. Progress through multiple initial consonants.",
        parentVersion: "Say three words that start with the same sound: 'ball, button, bacon — what sound do they all start with?' Then ask: 'Does bell start like ball, button, bacon?' Play this as a car game or at mealtimes. Try different sounds: /m/, /t/, /s/, /d/.",
        educatorVersion: "Model with /b/: 'ball, button, bacon all begin with /b/.' Then: 'Does bell begin like ball, button, bacon? Yes — it starts with /b/.' Move through /m/ (mop, muffin, moon), /t/ (toes, tent, tub), /s/ (sand, soap, sun). Variation: include one word with a different sound — 'ring, rock, nest: which one doesn't start with /r/?'"
      },
      {
        id: "PA-08",
        title: "Thumbs Up, Thumbs Down (Initial Sound Matching)",
        audience: "both",
        materials: ["No materials required"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Identifies the initial sounds common in a few words",
        summary: "Educator says two words: children put thumbs up if both start with the same sound, thumbs down if different. Visual response makes assessment easy. Variation: three-word groups.",
        parentVersion: "Call out two words. If they start with the same sound, your child puts thumbs up. If different sounds, thumbs down. 'Sun and sock — thumbs up or down?' (Up — both start with /s/!) 'Dog and button?' (Down — /d/ and /b/ are different.) Great game for car trips.",
        educatorVersion: "Say word pairs. Children respond with thumbs up (same initial sound) or thumbs down (different). Observe which children are not responding correctly — provide additional targeted practice. Extension: three-word groups (ring/rake/row; seal/six/sad). Clinical note: track children who consistently miss initial sounds — flag for phonological awareness monitoring."
      },
      {
        id: "PA-09",
        title: "Sing a Song of B's (Initial Sound Song)",
        audience: "both",
        materials: ["No materials required"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Identifies the initial sounds common in a few words",
        summary: "Sing a modified 'Twinkle Twinkle Little Star' with words starting with /b/. Children listen for words starting with the same sound, then supply words beginning with /b/. New verses created for /m/ and other sounds.",
        parentVersion: "Sing this to the tune of Twinkle Twinkle Little Star: 'What sound starts these words you know: bread, biscuit, bounce and bow, beach and baby, big and bell? What sound starts each, can you tell? They all start with /b/, you see — name a word that starts with b!' Then make up verses for other sounds your child knows.",
        educatorVersion: "Sing song through once. Second time: listen for words starting with the same sound. Ask children to identify the sound (lines 2–3 in each verse: /b/ in verse 1). Third time: children chime in with rhyming words (know/bow; bell/tell). Create new verses for /m/ (mother, man, map, mow, moss, mushroom, milk, May). Builds sound identification in a musical context."
      },
      {
        id: "PA-10",
        title: "Name That Word! (Onset-Rime Blending)",
        audience: "both",
        materials: ["No materials required (extension: picture cards for I Spy)"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Orally blends the onset and rime of words",
        summary: "Educator says onset and rime separately (c...at, m...ouse). Children blend into the complete word. Extension: I Spy game using segmented sounds ('I spy a m-op').",
        parentVersion: "Say a word in two parts and ask your child to put them together: 'What word is b...and?' (band!) 'f...ish?' (fish!) 'h...at?' (hat!) This is called onset and rime — it's a step toward sounding out words when reading. When your child is good at it, play I Spy: 'I spy a m-op' and they point to and say the word.",
        educatorVersion: "Model blending: 'c...at, cat.' Then: 'Now you try — b...and.' Word list: b...and, f...ish, h...at, k...ite, f...arm, n...est, p...est. Extension: I Spy with picture cards ('I spy a m-op — point to it and say the whole word'). Onset-rime blending is a key intermediate step between syllable and phoneme work."
      },
      {
        id: "PA-11",
        title: "Put Sounds Together (Phoneme Blending Clue Game)",
        audience: "both",
        materials: ["No materials required (extension: classroom objects or picture clues)"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Can blend phonemes to say words (phoneme blending)",
        summary: "Educator gives I-am-thinking-of clues with sounds segmented at phoneme level. Children blend individual sounds and identify the word. Extension: use classroom objects ('I spy something that goes cluck cluck cluck — /h/-/e/-/n/'). ",
        parentVersion: "Play 'I am thinking of...' with sounds separated out: 'I am thinking of something you wear on your head. It has the sounds /h/ /a/ /t/. What is it?' Let your child say the sounds fast to blend them: 'hat!' When they're confident, try with picture cards or objects around the house.",
        educatorVersion: "Model: 'I am thinking of something I can wear on my head — /h/ /a/ /t/ — what is it?' Children say sounds with you, then say them fast to produce the word. Word examples: /h/-/a/-/t/ hat; /s/-/u/-/n/ sun; /p/-/o/-/t/ pot; /h/-/e/-/n/ hen. Use classroom objects as context clues where possible."
      },
      {
        id: "PA-12",
        title: "Break It Down! (Phoneme Segmentation)",
        audience: "both",
        materials: ["No materials required (children tap out sounds)"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Can segment the sounds in words",
        summary: "Children segment spoken CVC words into individual phonemes, tapping once per sound. Model: '/k/ /a/ /t/, cat — three sounds.' Practise with short vowel CVC words: map, ten, sip, hot, rug.",
        parentVersion: "Say a short word and ask your child to tap their finger for each sound: 'cat' = tap, tap, tap (/k/ /a/ /t/). 'How many sounds does cat have?' (Three.) Try: map, ten, sip, hot, rug. This is a really important skill for learning to spell and read.",
        educatorVersion: "Model: '/k/ /a/ /t/, cat. What sounds do you hear in cat?' Children say each sound and tap it out simultaneously. 'How many sounds?' (3.) Practise with CVC words using short vowels: map, ten, sip, hot, rug. Tap for each sound. Clinical note: phoneme segmentation is one of the strongest predictors of early reading success — monitor carefully and refer for SLP assessment if persistent difficulty."
      },
      {
        id: "PA-13",
        title: "Sound Addition (Phoneme Addition)",
        audience: "both",
        materials: ["No materials required"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Can add the onset to a spoken word",
        summary: "Children add a consonant sound to the beginning of a vowel-initial word to make a new word. Model: '/a/ /t/, at. What do you have if you add /m/ to the beginning of at? /m/ /a/ /t/ — mat!' Practise with words: at, an, in, it, on.",
        parentVersion: "Tell your child: 'I'm going to say a word and add a sound to the front of it. /a/ /t/ is at. What do you get if I put /m/ at the front? /m/ /a/ /t/ — mat!' Try adding different sounds to the front of: at, an, in, it, on. What do you get when you put /s/ in front of at? (Sat!)",
        educatorVersion: "Model: 'Listen to the sounds in at: /a/ /t/. What word do you have if you add /m/ to the beginning of at? /m/ /a/ /t/ — mat!' Practise word families: at → bat/cat/fat/hat/mat/pat/sat/rat; an → ban/can/fan/man/pan/ran/tan; in → bin/fin/pin/sin/tin/win; it → bit/fit/hit/kit/pit/sit; on → bon/con/don/son/ton."
      },
      {
        id: "PA-14",
        title: "Delete a Sound (Phoneme Deletion)",
        audience: "both",
        materials: ["No materials required"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Can delete the onset from a spoken word",
        summary: "Children identify what word remains when the initial phoneme is deleted. Model: 'What is pin without the /p/? — in!' Practise: bat without /b/ = at; part without /p/ = art; fall without /f/ = all.",
        parentVersion: "Ask your child: 'What is the word bat without the /b/ sound?' (At!) 'What is pin without the /p/?' (In!) This helps children understand that words are made of sounds that can be taken apart — a key reading skill. Try: fall without /f/ (all), part without /p/ (art).",
        educatorVersion: "Model: 'Listen to the sounds in pin: /p/ /i/ /n/. What is pin without the /p/? — in!' Practise: bat without /b/ → at; part without /p/ → art; fall without /f/ → all. Phoneme deletion is a more advanced skill — ensure phoneme blending is well established first. This level indicates strong phonological awareness."
      },
      {
        id: "PA-15",
        title: "Substitute a Letter to Change a Word (Phoneme Substitution)",
        audience: "both",
        materials: ["Picture cards (optional, to illustrate word pairs)"],
        groupSize: "Individual, small group, or class",
        developmentalTarget: "Can change the onset of a word to make a new word",
        summary: "Children substitute the initial phoneme of a CVC word to make a new word. Model: 'mop — change /m/ to /h/ → hop.' Practise with CVC phonogram families: map/tap; pet/set; big/wig; hop/top; bug/rug.",
        parentVersion: "Show your child a picture of a mop. 'Say the sounds with me: /m/ /o/ /p/. What word do we have if we change /m/ to /h/? /h/ /o/ /p/ — hop!' Try more: change the first sound in map to /t/ (tap!), change the first sound in big to /w/ (wig!). This is like a word magic trick.",
        educatorVersion: "Show mop picture. 'Say the sounds: /m/ /o/ /p/. What word if we change /m/ to /h/? /h/ /o/ /p/ — hop!' Phonogram family pairs: map/tap; pet/set; big/wig; hop/top; bug/rug. Phoneme substitution is the most advanced level of this sequence — requires secure phoneme blending, segmentation, and deletion. Consider SLP referral if earlier levels are not yet established."
      }
    ]
  },

    // ─────────────────────────────────────────────────────────
    // BATCH 4 — NUMERACY
    // Source: numeracyActivities.js | 139 activities
    // IED III codes inferred — verify before routing
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────────
  // NUMBER CONCEPTS
  // IED III item: G-1 (inferred) | ID prefix: NC
  // Objective: Demonstrate number concepts to 10; count objects; join sets
  // ─────────────────────────────────────────────────────────────────────────
  numberConcepts: {
    iiedItem: "G-1",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Numbers and Operations",
    clinicalNote: "Difficulty with rational counting (as distinct from rote) may indicate limited one-to-one correspondence, which is foundational to all number operations. Note whether errors are systematic (e.g., always skipping a number, double-counting) or inconsistent. Children who master rote counting but struggle with rational counting may benefit from concrete, tactile experiences before pictorial or symbolic tasks. Refer if persistent difficulty with one-to-one correspondence beyond expected developmental range.",
    activities: [
      {
        id: "NC-01",
        title: "A Dozen Eggs",
        audience: "educator",
        educatorVersion: "Place an egg carton and 12 plastic eggs on a table. Ask the child to place one egg in each compartment. Discuss: 'How many eggs in each compartment? Any left over? Did you have one egg for each space?' Connect explicitly: 'Just as you put one egg in each compartment, we say one number for each object when we count.' Works individually or in small groups.",
        parentVersion: "Use a real egg carton and 12 small objects from around the house (bottle caps, blocks, grapes). Ask your child to put one object in each compartment. Talk about whether they had enough — one for each space. Explain that counting works the same way: one number for each object.",
      },
      {
        id: "NC-02",
        title: "Going on a Picnic",
        audience: "educator",
        educatorVersion: "Set up a pretend picnic with paper plates, cups, napkins and spoons — one set per child. Take turns passing out items, asking each time: 'Do we have enough? Any extras? Is the number the same as the number of children?' Have children count items and children to compare. Builds one-to-one correspondence through a meaningful social context.",
        parentVersion: "At mealtimes, let your child help set the table. Ask them to give one plate, one cup, and one spoon to each person. Talk about whether they have the right number: 'Do we have enough forks? Did everyone get one?' This builds the understanding that counting means one number for each object.",
      },
      {
        id: "NC-03",
        title: "Let's Count!",
        audience: "both",
        educatorVersion: "Display a set of objects (books, shells, blocks). Have the child count them, touching each one. Rearrange the objects and ask the child to count again — reinforcing that quantity is conserved regardless of arrangement. If the child double-counts or skips, have them touch and push each object aside as they count.",
        parentVersion: "Gather a small collection of objects at home — toys, fruit, socks. Ask your child to count them by touching each one. Then rearrange them and ask your child to count again. Help them see that the number stays the same even when the objects are in a different order.",
      },
      {
        id: "NC-04",
        title: "Beans in a Cup",
        audience: "educator",
        educatorVersion: "Give each child a set of small objects (beans, buttons, pegs) and a container. Demonstrate dropping each object in while counting aloud. Then pour out and recount in a pile. Reinforce that the number does not change whether objects are in a cup or spread out — this is conservation of number.",
        parentVersion: "Give your child some small objects (e.g., dried pasta, buttons) and a cup. Have them drop one object in at a time while counting aloud. Then tip them out and count again. Ask: 'Is it the same number? Did the amount change?' This helps your child understand that counting gives the same answer no matter how the objects are arranged.",
      },
      {
        id: "NC-05",
        title: "Stepping Stones",
        audience: "educator",
        educatorVersion: "Cut out paper 'stepping stones' and arrange them in a path. Children take turns walking from stone to stone, counting aloud as they step. Change the number of stones for each child. A physical, whole-body activity that reinforces counting aloud while touching/stepping each object.",
        parentVersion: "Make a path of paper squares or cushions on the floor. Ask your child to step on each one and count aloud as they go. Change the number of 'stepping stones' and count again. You can do the same outside with chalk circles on the footpath.",
      },
      {
        id: "NC-06",
        title: "How Many Do You See?",
        audience: "educator",
        educatorVersion: "Have children walk around the classroom counting objects they touch: 'How many round tables? How many chairs in the reading circle?' Ask them to state the total after counting. Introduce zero by asking questions like 'How many two-headed elephants are in our room?' — making zero concrete and amusing.",
        parentVersion: "Walk around your home and count things together. 'How many chairs at our table? How many windows in the kitchen? How many dogs in our house?' After counting, ask: 'How many all together?' You can also introduce zero by asking silly questions like 'How many elephants are in the lounge room?'",
      },
      {
        id: "NC-07",
        title: "Counting Taps",
        audience: "educator",
        educatorVersion: "Tap a drum a set number of times while children count aloud with eyes closed. Then have children take turns tapping while others count. Extend by having a child knock on the door from outside while the group counts. Develops auditory counting — counting without visual anchors.",
        parentVersion: "Clap your hands or tap a table a few times and ask your child to count the taps. Then swap — your child taps and you count. Try varying the rhythm to make it more challenging. This helps your child count things they hear, not just things they see.",
      },
      {
        id: "NC-08",
        title: "May I Have Some?",
        audience: "educator",
        educatorVersion: "Give each child a set of objects. Ask for a specific number: 'May I have nine buttons?' Child counts silently, then hands over the requested quantity. Teacher counts to verify. If incorrect, child recounts by touching and saying each number aloud. Develops ability to count out a specified quantity from a larger set.",
        parentVersion: "Give your child a small pile of objects (e.g., pasta pieces, toy blocks). Ask for a specific number: 'Can I have four?' Your child counts out that many and gives them to you. Count together to check. This helps your child connect the spoken number to the actual quantity.",
      },
      {
        id: "NC-09",
        title: "Pass the Basket",
        audience: "educator",
        educatorVersion: "Children sit in a circle with a basket of small objects. Each child is asked to take out a specific number of objects and pass them to the next child, who counts to verify. Builds both counting-out and counting-verification skills in a cooperative format.",
        parentVersion: "Put some small objects in a container. Ask your child to take out a specific number and count them aloud. Then you count them together to check. Swap roles — you take out some and your child counts them.",
      },
      {
        id: "NC-10",
        title: "Count, Match and Drop",
        audience: "educator",
        educatorVersion: "Prepare 10 boxes (lids marked 0–9) and 50 picture cards showing quantities 0–9. Child picks up a card, counts the objects shown, and drops it into the matching numbered box. Independently reinforces both quantity recognition and numeral association. Check accuracy by opening boxes together.",
        parentVersion: "Make simple cards at home with different numbers of drawn dots (1–9). Write a number on separate cards. Ask your child to match each dot card to its number card. This helps your child connect 'how many' with the number symbol.",
      },
      {
        id: "NC-11",
        title: "Beanbag Sets",
        audience: "educator",
        educatorVersion: "Place two hula hoops on the floor. Put two beanbags in one hoop, one in the other. Ask children to count all beanbags consecutively across both hoops. Remind them not to restart at 1 when moving to the second hoop. Introduce joining sets, the precursor to addition.",
        parentVersion: "Put some small toys in two separate bowls or areas. Ask your child to count all of them together without starting over when they move to the second bowl. This is an important step — counting across two groups to find the total.",
      },
      {
        id: "NC-12",
        title: "Beads on a String",
        audience: "educator",
        educatorVersion: "Give each child two strings of beads. Child counts the beads on the first string (sliding each bead as they count), then continues counting consecutively onto the second string to find the total. Explicitly models that the second set begins at the next number in sequence — not at 1.",
        parentVersion: "Thread some pasta or beads on two separate pieces of string. Ask your child to count all the beads across both strings without starting over. Say: 'You counted 4 on the first string — now keep going from 5 on the second string.'",
      },
      {
        id: "NC-13",
        title: "Roll the Number Cubes",
        audience: "educator",
        educatorVersion: "Children roll two dice, then count the dots on both cubes consecutively. Model: 'This cube has 2 dots and this one has 4 — one, two... three, four, five, six.' Each child has several turns. Once confident, introduce simple board games using dice to practise consecutive counting in a motivating context.",
        parentVersion: "Roll two dice and ask your child to count all the dots together by starting with the first die and continuing onto the second without starting over. This is the beginning of addition! Once they are confident, try playing a simple board game together.",
      },
      {
        id: "NC-14",
        title: "Fish in Fish Bowls",
        audience: "educator",
        educatorVersion: "Draw two fish bowls on the board. Draw fish in each bowl. Ask a child to count the fish across both bowls consecutively. Add or remove fish between turns to vary the total. A visual representation of joining sets using a familiar, engaging context.",
        parentVersion: "Draw two simple bowls on paper and draw fish in each. Ask your child to count all the fish across both bowls by starting in the first bowl and continuing into the second. Change the number of fish and count again.",
      },
      {
        id: "NC-15",
        title: "Dominoes",
        audience: "educator",
        educatorVersion: "Spread dominoes on the floor. Teach children to name each domino by its dot quantities (e.g., 'two-three'). Have children count dots on both ends consecutively. Begin with dominoes showing quantities to 6, progressing to 12 as skills develop. Variations: sort by quantity, match like ends, find the domino you name.",
        parentVersion: "Use a set of dominoes at home. Show your child how each domino has dots on two ends. Count all the dots together — start on one end and keep going to the other. Ask: 'How many dots all together?' This is joining sets, which leads to addition.",
      },
      {
        id: "NC-16",
        title: "Counting at Play",
        audience: "educator",
        educatorVersion: "During free play, observe naturally occurring counting: children comparing quantities ('I have more trucks'), counting fingers or footsteps, claiming 'two friends' in the block area. Join children's play opportunistically to extend counting language and skills in an authentic context. No materials required.",
        parentVersion: "During everyday play, count things naturally with your child. Count steps climbing the stairs, count toys being packed away, count bites of food. The more counting happens in real-life situations, the more naturally it becomes part of how your child thinks about the world.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COUNTING
  // IED III item: G-2 (inferred) | ID prefix: CO
  // Objective: Count (rote) to 5, 10, 20, 30... 100
  // ─────────────────────────────────────────────────────────────────────────
  counting: {
    iiedItem: "G-2",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Numbers and Operations",
    clinicalNote: "Distinguish rote counting (reciting number names in sequence) from rational counting (assigning numbers to objects). Rote counting is typically mastered before rational counting. Articulation errors on number names (e.g., 'seben' for seven) should be noted but not conflated with counting skill — refer to speech pathology if articulation errors persist beyond expected developmental range. Difficulty with auditory memory may affect rote sequence learning; note if the child also struggles with multi-step verbal directions or alphabet recall.",
    activities: [
      {
        id: "CO-01",
        title: "Ten Little Elephants",
        audience: "both",
        educatorVersion: "Teach children the counting verse 'Ten Little Elephants' (to the tune of 'Ten Little Indians'). As children sing, have them march around the room moving like elephants — lumbering and swinging a trunk. Vary by substituting other animals and their movements. Song + movement reinforces counting sequence to 10 in a memorable, multi-sensory way.",
        parentVersion: "Sing counting songs with your child at home. 'One little, two little, three little elephants...' is a fun one to try. March around the room together pretending to be elephants as you count. Silly songs with movement help the number sequence stick.",
      },
      {
        id: "CO-02",
        title: "Listen and Count",
        audience: "educator",
        educatorVersion: "Record children counting to a target number. Play the recording back and have children count along with themselves. Make the tape available during free choice so children can practise independently. Hearing their own voice counting builds auditory memory for the sequence.",
        parentVersion: "Record your child counting on a phone. Play it back and count along together. Children often love hearing their own voice — it can turn counting practice into a fun game.",
      },
      {
        id: "CO-03",
        title: "Clap Your Hands",
        audience: "both",
        educatorVersion: "Model counting with claps: clap once saying 'One,' again saying 'Two.' Continue to a target number, then repeat with children joining in. Invite individuals to lead. The rhythmic physical anchor supports sequence retention and makes counting active.",
        parentVersion: "Clap your hands together with your child while counting: one clap = one number. Count to 5, then 10, then further. Let your child lead — you follow their rhythm. Clapping keeps counting energetic and fun.",
      },
      {
        id: "CO-04",
        title: "Bouncing Ball",
        audience: "both",
        educatorVersion: "Bounce a ball to a steady rhythm while counting aloud. Have children count with you. Invite children to take turns bouncing while the class counts. Variation: use a drum beat instead of a ball. Rhythmic counting to a beat is one of the most effective supports for memorising the number sequence.",
        parentVersion: "Bounce a ball and count the bounces together. Let your child bounce while you count, then swap. You can do the same with jumping on the spot, clapping, or tapping a table. The rhythm helps the number sequence become automatic.",
      },
      {
        id: "CO-05",
        title: "Counting Parade",
        audience: "educator",
        educatorVersion: "March around the room counting consecutively with each step. Tell children to march to a specific number (e.g., 'Let's march to fifteen'). Children take turns choosing the target number and leading the parade. Movement + counting makes the number sequence embodied and social.",
        parentVersion: "March around the house together counting your steps out loud. Set a target: 'Let's march to ten!' Let your child choose the number to march to. March inside, outside, up the hall — wherever is fun.",
      },
      {
        id: "CO-06",
        title: "Number Chasey",
        audience: "educator",
        educatorVersion: "Children walk in a circle counting aloud with each step. One child sits in the centre with a secret number. When children reach that number, the centre child tries to tag classmates who run for safety zones. Combines sequential counting with an exciting physical game — motivation is high. Vary by hopping, skipping or marching.",
        parentVersion: "Take turns whispering a number to your child. Walk around the room counting steps together — when you reach the secret number, your child runs and you try to tag them (or play in reverse). A simple active game that makes counting to a target meaningful.",
      },
      {
        id: "CO-07",
        title: "Circle Game",
        audience: "educator",
        educatorVersion: "Children sit in a circle. Each child says the next number in the sequence. If a child cannot recall the next number, say it for them and have them repeat it before continuing. Variation: each child must repeat all numbers said before them and add one more. Peer counting in a social context builds confidence.",
        parentVersion: "Sit facing your child. Take turns saying the next number: you say 'one,' they say 'two,' you say 'three,' and so on. If they get stuck, say the number for them and let them carry on. Keep it light and encouraging.",
      },
      {
        id: "CO-08",
        title: "Catch and Count",
        audience: "educator",
        educatorVersion: "Children stand in a circle and pass or toss a ball around. Each time a child catches the ball, they say the next number in the sequence. Continue until a target number is reached. If a child cannot recall the next number, prompt them and continue. Builds collaborative counting.",
        parentVersion: "Toss a soft ball back and forth with your child, counting each catch. You catch and say 'one,' they catch and say 'two,' and so on. Count to 10, then try for 20. It's good practice and great fun.",
      },
      {
        id: "CO-09",
        title: "Continue Counting",
        audience: "educator",
        educatorVersion: "Walk around the room counting aloud. Periodically stop and tap a child to say the next number. Continue until every child has been tapped. Keeps all children alert and listening to the number sequence — they never know when it will be their turn.",
        parentVersion: "Count aloud with your child and then stop unexpectedly — your child has to say the next number. Swap roles: your child counts and stops, you say the next number. This 'fill in the next number' game builds sequence knowledge.",
      },
      {
        id: "CO-10",
        title: "Counting Relay",
        audience: "educator",
        educatorVersion: "One child begins counting; you stop them after a few numbers and another child continues from that point. Continue until children reach 100. Develops understanding that the count is continuous — any child can pick up where another left off — and that numbers do not restart.",
        parentVersion: "Take turns counting in relay with your child. You start: 'One, two, three...' then stop. Your child continues from where you left off. See how far you can count together. Over time, work toward 100.",
      },
      {
        id: "CO-11",
        title: "Numbers That Come Before and After",
        audience: "both",
        educatorVersion: "Once children can count to a target number, ask sequence questions: 'What number comes before eight?' 'What comes after five?' Does not require materials. Develops flexible number sense — understanding ordinality and relative position in the counting sequence.",
        parentVersion: "Quiz your child with 'before and after' number questions: 'What comes before 7?' 'What number is after 12?' Start with small numbers and work up. This helps your child understand that numbers form a continuous sequence, not just a list to recite.",
      },
      {
        id: "CO-12",
        title: "Counting by Twos, Fives and Tens",
        audience: "educator",
        educatorVersion: "Once children can count to 100, teach skip counting. For twos: count to 100 whispering odd numbers and saying even numbers loudly, then omit the odd numbers. Teach fives and tens in the same progression. Skip counting is a bridge to multiplication and to reading analogue clocks.",
        parentVersion: "Once your child can count to 100, try skip counting: count by twos (2, 4, 6, 8...), then by fives (5, 10, 15...), then by tens (10, 20, 30...). Say the in-between numbers quietly and the skip-count numbers loudly. You can also do this while hopping.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // READS NUMERALS
  // IED III item: G-3 (inferred) | ID prefix: RN
  // Objective: Read numerals to 5, 10, 20, 30... 100
  // ─────────────────────────────────────────────────────────────────────────
  readsNumerals: {
    iiedItem: "G-3",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Numbers and Operations",
    clinicalNote: "Reading numerals is a symbolic skill — it requires recognising the printed symbol and attaching a verbal label. Teach at the receptive level first (matching like numerals) before expressive level (naming a numeral). Difficulty distinguishing visually similar numerals (e.g., 6/9, 3/8, 1/7) may reflect visual perceptual difficulties rather than a numeracy deficit. If a child reverses numerals when reading (not just writing), note and refer for vision or perceptual assessment if persistent. Integrate numeral reading with quantity tasks so symbols acquire meaning.",
    activities: [
      {
        id: "RN-01",
        title: "Give a Dog a Bone",
        audience: "educator",
        educatorVersion: "Create cards in the shapes of dogs (0–9) and matching bones (0–9). Children match each dog to its corresponding bone numeral. Begin by demonstrating one match. Variations: use worms/apples, mice/cheese. A playful matching activity that builds receptive numeral recognition at the matching level.",
        parentVersion: "Write numbers 0–9 on pieces of paper or card, then make a second matching set. Mix them up and ask your child to match the pairs. Any fun theme works — match the number on a 'fish' card to the same number on a 'fishbowl' card, for example.",
      },
      {
        id: "RN-02",
        title: "Numeral Laundry",
        audience: "educator",
        educatorVersion: "Make clothing-shaped cards (1–20) and write matching numerals on 20 pegs. Children hang each 'garment' on the clothesline by matching the numeral on the peg to the numeral on the card. A hands-on, fine-motor activity that embeds numeral matching in a practical, familiar context.",
        parentVersion: "Write numbers 1–10 on small cards and matching numbers on sticky notes. Mix them up on a table and ask your child to match pairs. You can clip matching pairs together using a peg when they find a match — just like laundry on a clothesline.",
      },
      {
        id: "RN-03",
        title: "Magnetic Numeral Match",
        audience: "educator",
        educatorVersion: "Place two sets of magnetic numerals 0–9 on opposite sides of a magnetic board. Point to one numeral, say its name, and ask the child to find the matching numeral on the other side. Build toward the child naming the numeral independently as pairs are moved to the centre. Develops receptive then expressive numeral identification.",
        parentVersion: "Write numbers 0–9 on two sets of cards. Spread one set in front of your child and hold the other set. Hold up a card and ask your child to find the matching number from their set. Once they can match reliably, ask them to say the name of the numeral as they match it.",
      },
      {
        id: "RN-04",
        title: "Numeral Fun",
        audience: "educator",
        educatorVersion: "Give each child a numeral card from a set matching yours. When you hold up a numeral, the child with the matching card holds theirs up. Shuffle and repeat. A whole-class activity that gives every child repeated practice reading numerals quickly and with engagement.",
        parentVersion: "Write a set of numbers on cards — one set for you and one for your child. Hold up one of your cards and ask your child to find the matching card from their set and hold it up. When they can match easily, ask them to say the number name too.",
      },
      {
        id: "RN-05",
        title: "Numeral Match",
        audience: "educator",
        educatorVersion: "Give each child a set of 10 numeral cards. Hold up a card; children find the matching card from their set and show it. Once this is reliable, increase difficulty: say the number name without showing the card, and children hold up the numeral. Progresses from matching to identification from name alone.",
        parentVersion: "Make two sets of number cards 0–9. Hold up a number and ask your child to find the same number in their set. Once that is easy, say the number out loud without showing the card, and ask your child to find and show it.",
      },
      {
        id: "RN-06",
        title: "Are They the Same?",
        audience: "educator",
        educatorVersion: "Shuffle two identical sets of numeral cards and place face down. Children take turns flipping two cards; if they match, the child says the name and keeps the pair. If not, cards are replaced face down. A memory-style game that builds numeral recognition through repeated exposure and recall.",
        parentVersion: "Make a memory-style game with two sets of number cards. Place them face down on the table. Take turns flipping two cards — if they match, say the number name and keep the pair. If not, turn them back over. The person with the most pairs at the end wins.",
      },
      {
        id: "RN-07",
        title: "Animals for Sale",
        audience: "educator",
        educatorVersion: "Attach numeral cards to stuffed animals displayed on a table. Children 'buy' an animal by correctly naming the numeral on it. Children who name the numeral correctly keep the animal for the day. A playful, low-stakes context for expressive numeral identification with built-in positive reinforcement.",
        parentVersion: "Place toys around the room, each with a number label. Your child 'buys' a toy by correctly reading the number on it. They keep the toy until you play again. A fun way to practise reading number symbols without it feeling like a test.",
      },
      {
        id: "RN-08",
        title: "Musical Numerals",
        audience: "educator",
        educatorVersion: "Children sit in a circle, each holding a numeral card. Music plays while cards are passed around the circle. When the music stops, each child names the numeral they are holding. Continue until each child has read several different numerals. Combines auditory, social and visual elements.",
        parentVersion: "Give your child a number card and start some music. While the music plays, pass the card back and forth. When the music stops, whoever is holding the card says the number. Swap cards for the next round.",
      },
      {
        id: "RN-09",
        title: "Numeral Grab Bag",
        audience: "educator",
        educatorVersion: "Place numeral cards in a paper bag. Children reach in without looking, pull out a card, and name the numeral. If correct, they keep the card. At the end, children count how many cards they have collected. Adds an element of suspense and builds expressive numeral identification.",
        parentVersion: "Put number cards in a bag. Let your child reach in without looking, pull out a card, and say the number. If they say it correctly, they keep it. Count how many they collect. It is a simple game but children find the lucky-dip element very exciting.",
      },
      {
        id: "RN-10",
        title: "Go Fish",
        audience: "educator",
        educatorVersion: "Use four identical sets of numeral cards. Deal 5 each; remainder forms a draw pile. Children take turns asking for cards by number name: 'Do you have a seven?' If yes, the card is given; if no, 'Go fish.' First to collect sets of four matching cards wins. Builds expressive numeral reading in a game children know and love.",
        parentVersion: "Play 'Go Fish' using number cards instead of a standard deck. Ask for cards by number name: 'Do you have a three?' If your child doesn't have it, they say 'Go fish' and you draw from the pile. Collecting sets of matching numbers is the goal. A great card game for numeral recognition.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NUMERAL COMPREHENSION
  // IED III item: G-4 (inferred) | ID prefix: NC2
  // Objective: Match correct quantity of objects with printed numeral 1–10
  // NOTE: ID prefix NC2 used to avoid collision with numberConcepts (NC-)
  // ─────────────────────────────────────────────────────────────────────────
  numeralComprehension: {
    iiedItem: "G-4",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Numbers and Operations",
    clinicalNote: "Numeral comprehension requires integrating two previously learned skills: counting objects (see Number Concepts) and reading numerals (see Reads Numerals). A child who can count to 10 and read numerals to 10 but cannot match quantity to symbol may need explicit bridging instruction using concrete objects before pictorial tasks. Introducing too many numerals simultaneously is a common barrier — ensure mastery of each before adding the next. Suspected vision problems (acuity, astigmatism) should be referred if a child appears to misread numerals consistently.",
    activities: [
      {
        id: "NC2-01",
        title: "Count and Match the Numeral",
        audience: "educator",
        educatorVersion: "Arrange 11 paper plates on a table with quantities 0–10 of small objects on each. Show children numeral cards 0–10. Count the objects on each plate, say the number aloud, and place the matching numeral card above the plate. Remove cards, rearrange plates, and have children repeat the matching process in turn.",
        parentVersion: "Put different numbers of small objects (e.g., pasta pieces, buttons) on plates or in bowls — from 0 to 10. Write numbers on cards. Ask your child to count the objects on each plate and find the matching number card to place next to it. Check together.",
      },
      {
        id: "NC2-02",
        title: "Read the Numeral, Then Show How Many",
        audience: "educator",
        educatorVersion: "Each child receives a numeral card (0–10) and access to a shared collection of at least 55 small objects. Each child shows their numeral, says its name, and counts out the matching number of objects from the collection. Children then display their numeral and object quantity together.",
        parentVersion: "Write numbers 0–10 on separate cards. Shuffle them and give your child one card at a time. Ask them to say the number, then count out that many small objects from a pile. Once they can do this reliably with all numbers to 10, they understand what each numeral means.",
      },
      {
        id: "NC2-03",
        title: "Show Me!",
        audience: "educator",
        educatorVersion: "Hold up a large numeral card (0–10). Children respond by holding up the matching number of fingers. For the numeral 0, children show no fingers. A quick, no-materials-needed formative assessment that can be done as a warm-up or transition activity.",
        parentVersion: "Hold up a number card and ask your child to hold up that many fingers. Start with small numbers (1–5) and work up to 10. When you show 0, they hold up no fingers. A quick and simple check that your child knows what each number means.",
      },
      {
        id: "NC2-04",
        title: "Stand Up and Be Counted",
        audience: "educator",
        educatorVersion: "Hold up a numeral card, then walk around the circle tapping that many children on the head. Those tapped stand up. Children count the standing children to verify the number was correct. A child then becomes the tapper, using the same process. Combines numeral reading with quantity demonstration.",
        parentVersion: "Hold up a number card and tap your child on the head that many times. They count the taps. Then swap: your child holds a card and taps you. Count together to check the number is right. A fun, interactive way to check numeral comprehension.",
      },
      {
        id: "NC2-05",
        title: "Grocery Shopping",
        audience: "educator",
        educatorVersion: "Write numerals 0–10 on paper bags. Set up empty food containers on a shelf. Children 'shop,' reading the numeral on their bag and filling it with that many items. After shopping, children empty their bags and count their items for the group. Practical, motivating context for numeral-to-quantity matching.",
        parentVersion: "Write a number on a paper bag. Set out some safe household items (small boxes, tins). Ask your child to 'shop' and put that many items in their bag. After, take them out and count together. Children enjoy the role-play element and it makes the activity feel purposeful.",
      },
      {
        id: "NC2-06",
        title: "Number Bounce",
        audience: "educator",
        educatorVersion: "Hold up a numeral card. The child with the ball reads the numeral and bounces the ball that many times while classmates count silently to verify. Variation: all children clap the number shown on the card. Kinesthetic and auditory reinforcement of quantity-numeral connection.",
        parentVersion: "Hold up a number card. Your child reads the number and bounces a ball (or claps hands) that many times. You count silently and check. Swap roles. A physical and engaging way to practise connecting the numeral symbol to its quantity.",
      },
      {
        id: "NC2-07",
        title: "Take a Spin",
        audience: "educator",
        educatorVersion: "Child spins a spinner (0–10). Reads the numeral the spinner lands on, then performs an action that many times (e.g., hop on one foot 5 times if the spinner shows 5). Variation: roll a numeral cube. Reinforces the idea that the numeral is not just a name — it represents a real quantity of actions.",
        parentVersion: "Write numbers on a simple spinner (or use a dice). Your child spins or rolls, reads the number, and does that many of an action — hops, claps, jumps. Number = action count. A playful, active way to make numerals mean something.",
      },
      {
        id: "NC2-08",
        title: "Pin the Cans",
        audience: "educator",
        educatorVersion: "Label 11 clean cans with numerals 0–10. Children read the numeral on each can, then clip the corresponding number of clothes pegs to the can. After completing all cans, arrange them in numerical sequence. Integrates numeral reading, quantity matching, and ordinality.",
        parentVersion: "Write numbers on plastic cups or containers. Give your child a pile of pegs (or paper clips, stickers). Ask them to clip or stick the right number onto each container. Then put the containers in order from 0 to 10.",
      },
      {
        id: "NC2-09",
        title: "Fill It Up",
        audience: "educator",
        educatorVersion: "Write numerals 0–10 in the compartments of an egg carton. Give the child a collection of small objects. Child reads each numeral and places exactly that many objects into the matching compartment. Correctly completing all compartments will use exactly 55 objects — a built-in self-check.",
        parentVersion: "Write numbers 0–10 in the sections of an egg carton. Give your child a small bowl of objects (seeds, dried pasta). Ask them to read the number in each section and put exactly that many objects in. If they use all 55 objects, all sections are correct!",
      },
      {
        id: "NC2-10",
        title: "Goldfish in Fish Bowls",
        audience: "educator",
        educatorVersion: "Prepare 11 fish bowl cutouts (numerals 0–10) and 55 goldfish cutouts in an envelope. Child reads the numeral on each bowl and places the matching number of goldfish on it. Laminate for durability. Variation: use jars and pine cones, or trees and apples.",
        parentVersion: "Draw fish bowls with numbers 0–10, and cut out small fish shapes. Ask your child to read the number on each bowl and place that many fish on it. A colouring and counting activity children often enjoy doing at the table.",
      },
      {
        id: "NC2-11",
        title: "Match the Footprints",
        audience: "educator",
        educatorVersion: "Prepare left footprints (numerals 0–10) and right footprints (dot quantities 0–10). Children match each numeral footprint to the footprint with the correct number of dots. Completed pairs can be placed on the floor for children to walk over, reading numerals aloud: 'Left 8, right 8...'",
        parentVersion: "Draw 'left foot' shapes with numbers 0–10 written on them and 'right foot' shapes with dots representing those quantities. Ask your child to match each number foot to the foot with the right number of dots. Then lay them on the floor and walk over them saying the numbers.",
      },
      {
        id: "NC2-12",
        title: "Stamp Prints",
        audience: "educator",
        educatorVersion: "Each child folds a sheet of paper into 10 sections, stamps numerals 0–9 in each section, then uses small objects with ink to make the matching number of prints in each section. A creative, process-based activity integrating numeral writing and quantity representation.",
        parentVersion: "Fold a piece of paper into sections. Write or stamp a number in each section (0–9). Ask your child to draw or stamp that many shapes in each section. Display finished pages — every section should have the number of marks matching its numeral.",
      },
      {
        id: "NC2-13",
        title: "The Silly Green Monster",
        audience: "educator",
        educatorVersion: "A card matching game (like Old Maid) using numeral cards 0–10 and quantity picture cards 0–10, plus one 'silly green monster' wild card. Children make and discard matched pairs (numeral + quantity). The child left holding the monster card at the end is playfully 'out.' Reinforces numeral-quantity pairing in a social, motivating game.",
        parentVersion: "Make numeral cards (0–10) and picture cards showing matching quantities. Add one 'silly' joker card. Deal the cards out and take turns drawing from each other's hands to make matching pairs. The person left holding the joker loses — but make it silly and fun, not stressful.",
      },
      {
        id: "NC2-14",
        title: "Can You Find a Match?",
        audience: "educator",
        educatorVersion: "A memory/concentration game: 11 numeral cards (0–10) and 11 quantity picture cards placed face down. Children turn over two cards aiming to match a numeral with its corresponding quantity. Successful matches are kept; non-matches are returned face down. Reinforces numeral-quantity connection through memory and strategy.",
        parentVersion: "Make 11 number cards and 11 dot-quantity cards (0–10). Place them all face down. Take turns flipping two cards — if a numeral card matches a dot card with the same quantity, keep the pair. If not, turn them face down again. The player with the most pairs wins.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NUMERALS IN SEQUENCE
  // IED III item: G-5 (inferred) | ID prefix: NS
  // Objective: Write numerals in sequence from memory to 3, 5, 10... 100
  // ─────────────────────────────────────────────────────────────────────────
  numeralsInSequence: {
    iiedItem: "G-5",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Numbers and Operations",
    clinicalNote: "Writing numerals in sequence requires fine-motor coordination, visual-motor integration, memory for numeral form, and knowledge of the counting sequence. Distinguish errors of formation (poorly formed but correctly sequenced), reversal (correctly identified but written mirrored — common and typically resolves with development), sequence omission (number skipped), and sequence errors (wrong order). Reversal of numerals is developmentally typical in early writing; persistent reversals after age 7 or in multiple numeral types may warrant referral for visual-perceptual assessment. Poor pencil grip or grip pressure should prompt fine-motor review. Always begin with large-muscle tracing before pencil-on-paper tasks.",
    activities: [
      {
        id: "NS-01",
        title: "Sandy Numerals",
        audience: "educator",
        educatorVersion: "Glue sand onto cardboard squares to form raised numerals 0–9. Children trace each numeral with their finger, talking through the strokes using directional language: up, down, right, left. Extension: children trace their address or phone number digits. Tactile tracing reinforces correct stroke direction before pencil use.",
        parentVersion: "Help your child make 'sandy numbers' at home: write numbers in glue on card and sprinkle sand or salt on top. Once dry, your child traces each number with their finger. Talk about the direction: 'Start at the top, go around...' Feeling the shape of a number helps children write it correctly.",
      },
      {
        id: "NS-02",
        title: "Write in Sand",
        audience: "educator",
        educatorVersion: "Fill shallow boxes with sand. Give each child a model numeral and have them write it in the sand. They show their numeral, then shake the box to erase and try the next one. Extension: write a child's phone number in sand for them to copy. Sand writing is forgiving and encourages free practice without fear of mistakes.",
        parentVersion: "Fill a shallow tray with sand, salt or kinetic sand. Ask your child to write numbers in it with their finger. Show them the number first, then let them try. Shake the tray to erase and start again. No paper, no pencil pressure — just practice.",
      },
      {
        id: "NS-03",
        title: "Numerals Out of Sequence",
        audience: "educator",
        educatorVersion: "Place a sequence of numeral cards in the chalk tray in order. Then rearrange so one or two are out of place. Ask children to identify which numerals are wrong and come to the board to fix the sequence. Variation: use magnetic numbers. A deliberate error-detection activity that strengthens sequential number knowledge.",
        parentVersion: "Write numbers in a row on paper or cards and deliberately put one or two out of order. Ask your child to spot which numbers are wrong and fix them. This 'spot the mistake' format is often more engaging than just writing a sequence from scratch.",
      },
      {
        id: "NS-04",
        title: "Numeral Cards in Order",
        audience: "educator",
        educatorVersion: "Give each child a set of numeral cards appropriate to their level. Children arrange the cards in correct sequence on a table, then point to each one and say its name. Extension: children draw dots or shapes to show the quantity of each numeral. Builds ordinality and reinforces form recognition.",
        parentVersion: "Give your child a set of number cards (start with 0–10) and ask them to put them in order from smallest to biggest. Once they can do that reliably, give them more cards to extend the sequence. Ask them to read each number as they place it.",
      },
      {
        id: "NS-05",
        title: "Which Numeral Are You?",
        audience: "educator",
        educatorVersion: "Write one numeral per sheet of card. Hole punch the top corners and thread wool to make wearable signs. Each child wears a numeral and the group works together to arrange themselves in numerical sequence. Take a group photo and use it to create a classroom poster. A social, collaborative activity that makes sequencing physical and memorable.",
        parentVersion: "Write numbers on separate pieces of paper. Give your child several to hold and ask them to put themselves (and you!) in number order — or arrange the papers in a line on the floor from smallest to biggest. Try timing it for a fun challenge.",
      },
      {
        id: "NS-06",
        title: "Finger Paint Numerals",
        audience: "educator",
        educatorVersion: "Write a sequence of numerals on the board as a model. Children copy the sequence in finger paints on glossy paper. Once confident, children finger paint the sequence from memory without looking at the model. Finger painting allows large-muscle numeral formation before fine pencil work.",
        parentVersion: "Use finger paints (or even tomato sauce on a plate) to practise writing numbers. Work through the sequence together. The messiness makes it fun, and the large-muscle movement helps the form of each numeral become automatic.",
      },
      {
        id: "NS-07",
        title: "Missing Numerals",
        audience: "educator",
        educatorVersion: "Write a sequence of numerals on the board with some left out, replaced by blank lines. Children identify and write in the missing numerals. Vary the difficulty by leaving out consecutive numbers or numbers in unexpected positions. When complete, children read the full sequence aloud.",
        parentVersion: "Write a sequence of numbers with some left out: 1, 2, __, 4, 5, __, 7. Ask your child to fill in the missing numbers. Start with gaps of one missing number and work toward leaving out two or three in a row. Reading the completed sequence aloud reinforces the result.",
      },
      {
        id: "NS-08",
        title: "I Am Thinking of...",
        audience: "educator",
        educatorVersion: "Display a numeral chart. Give children clues about a mystery numeral using 'before' and 'after' language: 'It comes after 4 but before 10.' Children refer to the chart and guess. Invite children to give clues while others guess. Develops flexible sequential thinking and number language.",
        parentVersion: "Give clues for a mystery number: 'It comes after 6 but before 9. What is it?' Your child points to or says the answer. Then let your child make up a clue for you to guess. Use a number chart on the wall if needed to help them think about 'before' and 'after.'",
      },
      {
        id: "NS-09",
        title: "What's the Numeral?",
        audience: "educator",
        educatorVersion: "A child stands at the front with a secret numeral card pinned to their back. They ask yes/no or range questions to identify their numeral ('Does it come before 10?'). Peers can refer to a displayed numeral chart. Give a range as a starting hint. Builds strategic thinking about number sequence and positional language.",
        parentVersion: "Tape a number card to your child's back (they cannot see it). They ask you yes/no questions to figure out what number it is: 'Is it more than 5? Less than 8?' Give a starting hint: 'It is between 20 and 30.' Swap roles for extra fun.",
      },
      {
        id: "NS-10",
        title: "Let's Write Numerals 0–9",
        audience: "educator",
        educatorVersion: "Using a structured handwriting page with directional arrows, have children trace each numeral following the arrow direction. Verbalise direction as they trace: 'Start at the top, curve around to the left...' Move from tracing to copying on blank lines, then from memory. Choose a consistent numeral formation style aligned to your school's adopted approach.",
        parentVersion: "Use a simple handwriting worksheet or lined paper to practise writing numbers 0–9. Start by tracing over a model with arrows showing the direction. Talk through how to form each number: 'Start at the top...' Once they can trace well, ask them to copy from a model, and later write from memory.",
      },
      {
        id: "NS-11",
        title: "Let's Write Numerals 1–50",
        audience: "educator",
        educatorVersion: "Using a structured handwriting page, children trace numerals 1–50. Emphasise that two-digit numbers use two digits: 1 is written first for 10–19, 2 for 20–29, and so on. Both horizontal and vertical numeral arrangements should be practised, as children encounter both in school materials.",
        parentVersion: "Once your child can write numbers 0–9 from memory, work toward 1–50. Start by tracing a model, then copying, then writing from memory. Remind them: 'For 10–19, you always start with a 1. For 20–29, you always start with a 2.'",
      },
      {
        id: "NS-12",
        title: "Let's Write Numerals 1–100",
        audience: "educator",
        educatorVersion: "Extend to 1–100 using a structured handwriting page. Children trace, copy from a numeral chart, then write from memory in both horizontal and vertical formats. Referring to a displayed numeral chart for formation support is encouraged — the goal is accurate sequence and form, not unsupported memorisation.",
        parentVersion: "Work toward writing 1–100. Keep a number chart on the wall for your child to reference when they get stuck on how to write a number. The goal is learning the pattern: each decade starts with the same digit (30s all start with 3). Celebrate reaching 100 together.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // JOINS SETS
  // IED III item: G-6 (inferred) | ID prefix: JS
  // Objective: Demonstrate addition by joining two sets
  // ─────────────────────────────────────────────────────────────────────────
  joinsSets: {
    iiedItem: "G-6",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Numbers and Operations",
    clinicalNote: "Joining sets is the conceptual precursor to formal addition. Children who can count consecutively across two groups are developing this skill. Difficulty should prompt a check of Number Concepts — specifically whether the child can count consecutively (not restarting at 1 for the second set). Begin with joining a set of 1 to another set before increasing to larger combinations. Concrete objects are essential before pictorial or symbolic representations. This skill typically consolidates in the 4–5 year age range for small quantities.",
    activities: [
      {
        id: "JS-01",
        title: "Now There Are Two!",
        audience: "educator",
        educatorVersion: "Teach the finger play 'Now There Are Two' (1 birdie plays peek-a-boo, 1 more joins her — now there are 2). Use paper cutouts to demonstrate joining sets one at a time. Have children count consecutively across sets. Pause before the rhyming numeral so children can supply it. Begin with joining sets of 1 and progress to joining sets of 2.",
        parentVersion: "Make up silly joining stories with your child using toys or fingers: '2 teddies are sitting here — 1 more comes along. How many are there now? Let's count them all together.' Count starting from the first group and keep going into the second without starting over from 1.",
      },
      {
        id: "JS-02",
        title: "How Many All Together?",
        audience: "educator",
        educatorVersion: "Place 5 raisins on two plates in different combinations (e.g., 2 and 3). Children count each plate, then count all raisins consecutively: '1... 2... 3... 4... 5.' Ask: 'How many all together?' Eat the raisins, then repeat with cereal or crackers in a different combination. Always begin with small set sizes (to 5), then extend to 10.",
        parentVersion: "At snack time, put a few pieces of food on two small plates. Ask your child: 'How many on this plate? How many on that plate? How many all together?' Count across both plates without starting over. Eating the result makes it a very popular activity!",
      },
      {
        id: "JS-03",
        title: "Let's Grow a Garden!",
        audience: "educator",
        educatorVersion: "Give each child a card (their 'garden') and 10 counters ('flowers'). Direct children to place 2 flowers, then 2 more. Count all together: '1, 2, 3, 4 — how many flowers all together?' Continue with different combinations to 5, then extend to 10. The garden metaphor grounds the abstract concept of joining in a concrete image.",
        parentVersion: "Draw a 'garden' on paper. Use small objects as 'flowers.' Place 3 flowers in the garden, then add 2 more. Count all the flowers together: '1, 2, 3, 4, 5.' This is the beginning of addition — your child is joining groups to find a total.",
      },
      {
        id: "JS-04",
        title: "Spin, Count and Join!",
        audience: "educator",
        educatorVersion: "Pairs of children share a spinner (1–5). Child A spins and places that many counters on their plate; Child B spins and does the same. Pairs count all counters consecutively and state the total. Repeat multiple times. Each child uses a different colour counter to keep sets visible.",
        parentVersion: "Roll a die with your child. Each of you rolls once and places that many objects on your own 'plate.' Then count all the objects together from both plates. Write down the total. Roll again and see if you get a different total. This is beginning addition!",
      },
      {
        id: "JS-05",
        title: "Roll, Count and Join!",
        audience: "educator",
        educatorVersion: "Each child in a pair rolls their own number cube and places that many counters (in their colour) on the table. Both sets are then counted consecutively to find the total. Multiple rounds allow children to experience many different combinations. Variation: both children roll and one child counts all counters aloud for both.",
        parentVersion: "Each person rolls a die and puts that many objects on the table. Count all the objects together. Write down the two numbers and the total. Try it several times and see what different combinations you can make. You can even draw a simple addition: 3 + 4 = 7.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // QUANTITATIVE CONCEPTS
  // IED III item: H-1 (inferred) | ID prefix: QC
  // Objective: Understand quantitative concepts from big/little through most/least
  // ─────────────────────────────────────────────────────────────────────────
  quantitativeConcepts: {
    iiedItem: "H-1",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Geometry and Spatial Sense",
    clinicalNote: "Quantitative vocabulary is relational, not fixed — 'big' depends entirely on what it is compared to. Children may master the receptive level (pointing to the bigger object) before the expressive level (saying 'big' and 'little' correctly). Teach one contrasting pair at a time with concrete, highly differentiated examples before moving to more subtle comparisons. Children who consistently confuse quantitative pairs may have auditory discrimination difficulties (e.g., in/end, left/lift) — note if similar confusion occurs with other minimally contrasting word pairs. Concepts from this domain are directly relevant to following classroom instructions, and delays here can affect academic participation broadly.",
    activities: [
      {
        id: "QC-01",
        title: "Match the Buttons (big/little)",
        audience: "educator",
        educatorVersion: "Display big and little buttons (or blocks, rods). Hold up a big button: 'This button is big.' Hold up a little one: 'This button is little.' Children take turns matching items to one of the two shown, stating whether each is big or little after matching. Use sets that are clearly differentiated in size.",
        parentVersion: "Find some objects around home that come in different sizes — two cups, two spoons, two books. Show your child a big one and a little one. Ask them to find more big things and more little things. Ask: 'Is this one big or little?' Use the words naturally in conversation.",
      },
      {
        id: "QC-02",
        title: "Big Box, Little Box (big/little)",
        audience: "educator",
        educatorVersion: "Provide a big box and a little box. Sort pairs of objects by size into the appropriate box. Narrate as you sort: 'This spool is big — into the big box.' Prompt children to describe each object before sorting. If a child sorts incorrectly, ask them to compare the object to the box: 'Is the spool the same size as the box — big or little?'",
        parentVersion: "Find two containers of very different sizes. Collect pairs of objects (big and little versions of the same thing — big block and little block). Take turns sorting: put big things in the big container and little things in the little one. Ask your child to say 'big' or 'little' for each object.",
      },
      {
        id: "QC-03",
        title: "Stringing Necklaces (big/little)",
        audience: "both",
        educatorVersion: "Give children big and little beads and big and little macaroni with string. Children string items in any pattern they like, then touch each bead or piece of macaroni and say whether it is big or little. Builds fine-motor skill alongside concept vocabulary in a creative activity.",
        parentVersion: "String big and little pasta shapes or beads on a piece of wool or string. As your child makes their necklace, ask them to say whether each piece is big or little when they thread it. The result is a pattern necklace and a vocabulary lesson in one.",
      },
      {
        id: "QC-04",
        title: "Our World Mural (big/little)",
        audience: "educator",
        educatorVersion: "Tape a large sheet of paper to the wall at children's eye level. Brainstorm big and little things in the children's world. Children draw pictures of big and little things on the mural and help label them: 'a BIG police car.' Keep the mural up for the duration of the quantitative concepts unit and add other concept pairs as they are taught.",
        parentVersion: "Draw a picture together of things in your world — some big, some little. Label them together: 'a big bus,' 'a little ant.' Display it somewhere your child can look at it and add to it. Talk about new big and little things you notice when you are out.",
      },
      {
        id: "QC-05",
        title: "One More, Please (one/one more)",
        audience: "educator",
        educatorVersion: "Give each child one raisin. 'How many raisins do you have? One.' Ask: 'Would you like one more?' Give one more. 'Do you have one more raisin now? How many all together?' Repeat throughout snack time with different foods. Encourage use of 'one more' in dramatic play.",
        parentVersion: "At snack time, give your child one piece of fruit or cracker. Say: 'You have one. Would you like one more?' Give one more and ask: 'Now how many? Can you have one more?' This builds the concept of 'one more' as a step toward addition.",
      },
      {
        id: "QC-06",
        title: "One More in the Circle (one/one more)",
        audience: "educator",
        educatorVersion: "One child stands in the centre of a circle. Children ask: 'How many children in the centre? One.' The centre child invites one more to join. All children skip in a circle holding hands. A new child then moves to the centre. The repeated ritual of 'one more' joining embeds the concept in a social, joyful context.",
        parentVersion: "Stand apart from your child. Say: 'How many people are standing here? One.' Walk over and join them: 'Now how many? Two — one more joined!' Do this with stuffed animals or family members. Repeat the phrase 'one more joined' each time.",
      },
      {
        id: "QC-07",
        title: "Fill the Heart (full/empty)",
        audience: "educator",
        educatorVersion: "Use masking tape to outline a large heart on the floor. Children stand outside the heart. When you say 'full,' they run inside. When you say 'empty,' they run out. Children take turns directing classmates. Physically experiencing full and empty with their own bodies makes these abstract terms concrete and memorable.",
        parentVersion: "Draw a large circle on the floor with tape or chalk. When you say 'full,' your child jumps in; when you say 'empty,' they jump out. Take turns being the caller. Talk about what the circle looks like when it is full (people inside) versus empty.",
      },
      {
        id: "QC-08",
        title: "Snack Time (full/empty)",
        audience: "educator",
        educatorVersion: "At the start of snack time, hold up a full juice box. At the end, show the empty one. Children show items from their own snack that are full (before eating) and empty (after). The experiential, daily-life connection makes full and empty immediately meaningful.",
        parentVersion: "At mealtimes, draw attention to full and empty. 'Your cup is full! Now drink some... now it is less full. Now it is empty!' Let your child pour water between containers to explore these words. Full and empty are best understood through experience.",
      },
      {
        id: "QC-09",
        title: "Heavy or Light? (heavy/light)",
        audience: "educator",
        educatorVersion: "Fill 6 plastic eggs with sand (heavy) and 6 with paper (light). Children sort eggs into two groups. Then with eyes closed, children hold one egg at a time and identify it as heavy or light. The contrast between sand and paper should be strong enough to make the distinction clear through feel alone.",
        parentVersion: "Fill two containers with very different things — one with sand or dirt, one with cotton wool or paper. Let your child hold each and feel the difference. Say the words 'heavy' and 'light' clearly. Then ask: 'Which one is heavy? Which one is light?' Try with other household objects.",
      },
      {
        id: "QC-10",
        title: "Hanger Scale (heavy/light)",
        audience: "educator",
        educatorVersion: "Suspend a wire coat hanger so it can move freely. Attach contrasting objects to each end. Children observe which side dips lower (heavier). Remove and let children choose new objects to test, predicting heavy/light before attaching. An informal introduction to the concept of a balance scale.",
        parentVersion: "Hang a coat hanger from a doorknob or hold it by one finger. Tie a heavy object (e.g., a full drink bottle) on one end and a light object (a feather or paper) on the other. Watch which side goes down. Ask: 'Which side went down? Which object is heavier?' Try different pairs of objects.",
      },
      {
        id: "QC-11",
        title: "Stretch and Bend (tall/short)",
        audience: "both",
        educatorVersion: "Children stand in a circle. Stretch arms overhead: 'Stretch up to the sky and become tall, tall, tall!' Bend to the ground: 'Bend down to the ground and become short, short, short!' Repeat with emphasis on the vocabulary. A quick, no-materials activity ideal for transition times or brain breaks.",
        parentVersion: "Play 'tall and short' together — stretch up high and say 'tall!' then crouch down small and say 'short!' Let your child call out 'tall' or 'short' while you both move. Great to do in the park or whenever you need a movement break.",
      },
      {
        id: "QC-12",
        title: "I'm Tall, I'm Small! (tall/short)",
        audience: "both",
        educatorVersion: "Teach the rhyme 'When I stretch, I'm really tall / as tall as tall can be / When I bend, I'm really short / as short as short can be.' Children join in saying the second line in each verse. Movement and rhyme together create strong encoding of the paired concepts.",
        parentVersion: "Learn this rhyme with your child: 'When I stretch, I'm really tall — as tall as tall can be! When I bend, I'm really short — as short as short can be!' Act out the movements together. Rhymes with movement are one of the best ways for children to remember new words.",
      },
      {
        id: "QC-13",
        title: "Build It Tall (tall/short)",
        audience: "educator",
        educatorVersion: "Set out building blocks in an open area. Construct a tall building and a short building, narrating as you build. Children construct their own tall and short buildings and discuss them. Prompt: 'Is your building tall or short? Which is taller — yours or Sam's?' Builds concept vocabulary naturally within play.",
        parentVersion: "Build towers together using blocks, books, or cardboard boxes. Make one tall tower and one short one. Ask: 'Which is tall? Which is short? Can you build an even taller one?' Talk about the buildings as you build.",
      },
      {
        id: "QC-14",
        title: "Drum Roll Boogie (fast/slow)",
        audience: "educator",
        educatorVersion: "Beat a drum fast and slow, explaining the difference in pace. Children move to the beat: fast beat = jogging in place; slow beat = moving like feet stuck in mud. Alternate speeds multiple times. Verbalise the tempo as you change: 'I'm slowing down... now fast again!' Embeds concept vocabulary in physical experience.",
        parentVersion: "Tap a table or a pot as a drum. Beat fast — your child moves quickly. Beat slow — your child moves slowly. Talk about the difference: 'Now I'm going fast! Now slow...' This is a fun, energetic way to understand fast and slow as contrasting concepts.",
      },
      {
        id: "QC-15",
        title: "Guess the Animal (fast/slow)",
        audience: "educator",
        educatorVersion: "Show pictures of animals and discuss whether they move fast or slow. Children imitate movements — slow as a turtle, fast as a galloping horse. Say riddles: 'It creeps along, it's slow as can be — it's smaller than me!' (a worm). Children guess and imitate. Extends concept to the natural world.",
        parentVersion: "Play 'fast or slow animal' — name an animal and ask your child: 'Does a turtle go fast or slow? Does a cheetah go fast or slow?' Then pretend to move like each animal. Imagining how different creatures move is a rich way to experience these contrasting concepts.",
      },
      {
        id: "QC-16",
        title: "Pop, Pop, Pop! (fast/slow)",
        audience: "educator",
        educatorVersion: "Microwave a bag of popcorn while children listen. Narrate the pace of popping sounds as they change: 'These pops are slow... now fast... very fast... slowing down again.' Connect to full/empty when the bag is done. A sensory experience that brings fast/slow to life through sound, smell, and taste.",
        parentVersion: "Listen together to popcorn popping on the stove or in the microwave. Talk about the sounds: 'The pops are slow at first... now they are getting fast! Now they are slowing down again.' Eating the result together makes this a memorable lesson about fast and slow.",
      },
      {
        id: "QC-17",
        title: "Fun with None (all/none)",
        audience: "educator",
        educatorVersion: "Place clear containers on a table. Fill one with objects ('This has all the beads'), leave others empty ('This has none'). Fill several containers with different objects, leaving some empty. Children respond to: 'Point to the one with all the rice.' 'Point to the one with none.' Extend: use all/none language during snack setup and cleanup.",
        parentVersion: "Use clear containers (cups, jars). Fill some with small objects and leave others empty. Ask: 'Which jar has all the buttons? Which one has none?' Empty and refill together. Use these words throughout the day: 'All the toys are packed away! There are none on the floor!'",
      },
      {
        id: "QC-18",
        title: "The Long and Short of It (long/short)",
        audience: "educator",
        educatorVersion: "Display a long box and a short box. Sort pairs of objects (wool, spaghetti, pencils, shoelaces) into the correct box. Occasionally sort an object into the wrong box and invite children to clap once and correct the error. Deliberate error-making by the teacher increases engagement and critical thinking.",
        parentVersion: "Find pairs of things that are long and short — long and short pencils, long and short pieces of ribbon. Sort them into a long pile and a short pile. Ask your child to tell you where each object goes. 'Is this pencil long or short?' Use the words naturally.",
      },
      {
        id: "QC-19",
        title: "Long and Short Snacks (long/short)",
        audience: "educator",
        educatorVersion: "Serve snack foods cut to different lengths: long and short carrot sticks, breadsticks. Children identify long and short options and use the language when requesting: 'May I have a long carrot stick with cream cheese?' Embedding concept vocabulary into real choices gives it authentic communicative function.",
        parentVersion: "At snack time, cut food into long and short pieces — carrot sticks, celery, or bread. Ask your child to tell you what they want using the words: 'I would like a long carrot please.' This small change makes snack time a language lesson.",
      },
      {
        id: "QC-20",
        title: "Play Ball! (large/small)",
        audience: "educator",
        educatorVersion: "Bring out balls of many sizes: basketball, soccer ball, tennis ball, ping pong ball. Show each one, state whether it is large or small, and pass it around the circle. Children say 'large' or 'small' as they hold each ball. After exploring, arrange all balls from smallest to largest in the centre of the circle.",
        parentVersion: "Gather balls or round objects of different sizes from around home. Name each one as large or small. Pass them around and ask your child to say 'large' or 'small.' Then put them in order from smallest to largest. Go outside and throw or roll them to compare how they move.",
      },
      {
        id: "QC-21",
        title: "What's in the Box? (large/small)",
        audience: "educator",
        educatorVersion: "Fill a box with large and small objects. Cut a hand-sized hole in one end. Children reach in without looking, feel the object, identify it as large or small, and guess what it is before drawing it out. Extend to other concept pairs: heavy/light items; long/short items. Kinesthetic exploration engages children who are less responsive to visual-only activities.",
        parentVersion: "Put large and small objects in a bag or pillowcase. Your child reaches in without looking, feels the object, and says whether it is large or small before pulling it out. Then they try to guess what the object is. A favourite activity children often request to play again.",
      },
      {
        id: "QC-22",
        title: "Fill the Water Buckets (deep/shallow)",
        audience: "educator",
        educatorVersion: "Fill two buckets to different water levels — one shallow, one deep. Children put one arm in the shallow water and the other in the deep water simultaneously. Point out that the water in the deep bucket comes up high on the arm; the shallow bucket barely covers the wrist. All children take a turn.",
        parentVersion: "Fill two containers with water — one with a little (shallow), one with a lot (deep). Ask your child to put their hands in each. Talk about how the water feels different: 'In this one the water is deep — it comes up high. In this one it is shallow — just a little water.' Towel off together!",
      },
      {
        id: "QC-23",
        title: "Can You Dig It? (deep/shallow)",
        audience: "educator",
        educatorVersion: "In a sandpit or sand-filled box, children dig deep and shallow holes and measure their depth using a ruler or stick. Compare depths: 'Which stick shows the deep hole? Which the shallow hole?' Work in pairs, alternating who digs deep and who digs shallow. Hands-on exploration brings a spatial, abstract concept to life.",
        parentVersion: "In a sandpit or a bucket of sand, dig a deep hole and a shallow hole with your child. Use a stick or ruler to measure how deep each is. Ask: 'Which hole is deep? Which is shallow?' Let your child dig both kinds and compare them.",
      },
      {
        id: "QC-24",
        title: "Plant Seeds (deep/shallow)",
        audience: "educator",
        educatorVersion: "Plant bean or pea seeds in clear containers near the edge so roots are visible. Explain that seeds go in shallow holes near the top, but roots grow deep into the soil. Observe and record root growth over days. Children describe: 'The roots are growing deeper.' Connects deep/shallow to science through a living, observable process.",
        parentVersion: "Plant some seeds in a clear cup near the edge so you can watch the roots grow. Talk about how you plant seeds in a shallow hole near the surface, but the roots grow deeper and deeper. Watch together each day and describe what you see: 'The roots are getting deeper!'",
      },
      {
        id: "QC-25",
        title: "A Tasty Lesson (thick/thin)",
        audience: "educator",
        educatorVersion: "Cut a loaf of unsliced bread into thick and thin slices. Show both: 'This slice is thin. This slice is thick.' Each child requests a thin or thick slice with either a thin or thick layer of spread. A sensory, participatory experience where the vocabulary choices have real consequences children can see and taste.",
        parentVersion: "At home, talk about thick and thin versions of things you use: a thick vs thin slice of bread, a thick vs thin layer of spread. Let your child choose and describe: 'I want a thick slice please.' Being able to use the word to get what you want is a powerful motivator.",
      },
      {
        id: "QC-26",
        title: "Create a Collage (thick/thin)",
        audience: "educator",
        educatorVersion: "Collect thick items (rope, sponge, corrugated cardboard, tongue depressors) and thin items (tissue paper, thread, toothpicks, thin ribbon). Children touch each type, then create a collage using both, gluing them to project paper. Present finished collages to the group, identifying the thick and thin items used.",
        parentVersion: "Collect things from around the house that are thick and thin. Thick: rope, a sponge, a stack of cards. Thin: thread, a sheet of paper, a toothpick. Glue them onto card to make a collage. Ask your child to point to the thick and thin items in their artwork.",
      },
      {
        id: "QC-27",
        title: "Through Thick and Thin (thick/thin)",
        audience: "educator",
        educatorVersion: "Children draw with the side of a peeled crayon (thick lines) and the point of a regular crayon (thin lines). They create two pictures — one thick-lined, one thin-lined. Display thick-line pictures decorated with thick crepe paper; thin-line pictures decorated with thin ribbon. Art-integrated concept reinforcement.",
        parentVersion: "Draw with the side of a crayon for thick lines and the tip for thin lines. Talk about the difference: 'These lines are thick — they take up a lot of space. These are thin — they are tiny.' Ask your child to make a picture using only thick lines, then one with only thin lines.",
      },
      {
        id: "QC-28",
        title: "Nibble the Noodles (wide/narrow)",
        audience: "educator",
        educatorVersion: "Cook wide noodles (lasagne) and narrow noodles (spaghetti). Show children both types and name them: 'This is wide. This is narrow.' Children choose what they would like to eat, using the vocabulary. A food-based activity with strong sensory and social engagement.",
        parentVersion: "Show your child two kinds of pasta — wide (e.g., lasagne) and narrow (e.g., spaghetti or vermicelli). Name each: 'This pasta is wide. This one is narrow — it is thin and small.' Cook both and let your child choose which they prefer by naming it.",
      },
      {
        id: "QC-29",
        title: "Make a Paper Chain (wide/narrow)",
        audience: "educator",
        educatorVersion: "Provide narrow strips (1 cm × 15 cm) and wide strips (5 cm × 15 cm). Children make a paper chain alternating narrow and wide loops. Name each strip as it is added: 'This loop is narrow. Now this one is wide.' The resulting chain visually shows the pattern of alternating widths.",
        parentVersion: "Cut paper into wide and narrow strips. Show your child how to glue the ends of a strip together to make a loop. Thread the next strip through and glue it too. Alternate wide and narrow strips to make a chain. Talk about which loops are wide and which are narrow as you go.",
      },
      {
        id: "QC-30",
        title: "Can You Guess: More or Less? (more/less)",
        audience: "educator",
        educatorVersion: "Give each child two cups. Pour a small amount into one and nearly fill the other. Identify: 'This cup has more juice. This one has less.' Children identify more and less, drink from the 'more' cup (leaving some), and compare again. The dynamic change — more becoming less as they drink — demonstrates relativity.",
        parentVersion: "Pour juice or water into two cups — a lot in one, a little in the other. Ask: 'Which cup has more? Which has less?' Let your child drink from the fuller cup. Ask again: 'Which has more now?' This teaches that more and less are relative and can change.",
      },
      {
        id: "QC-31",
        title: "Snacking with Raisins (many/few)",
        audience: "educator",
        educatorVersion: "Show a plate with 2–3 raisins: 'This plate has a few raisins.' Show a plate with 10–15: 'There are many raisins on this plate.' Children request their snack quantity using the vocabulary: 'I would like a few raisins' or 'I would like many.' Extend by using few/many throughout the day in varied contexts.",
        parentVersion: "At snack time, put a few pieces of food on one plate (2–3) and many on another (10+). Ask your child: 'This plate has a few and this one has many — which would you like?' Use 'few' and 'many' throughout the day: 'A few birds on the fence... many cars on the road.'",
      },
      {
        id: "QC-32",
        title: "The Elephant and the Ant (huge/tiny)",
        audience: "educator",
        educatorVersion: "Children work in pairs, taking turns pretending to be a huge elephant (lumbering, swinging a trunk) and a tiny ant (crawling). While moving, children describe what they might see from each perspective: huge = tall trees, mountains; tiny = a blade of grass, a grain of sand. Dramatic play makes perspective-taking visceral.",
        parentVersion: "Pretend to be a huge elephant together — lumber around, swing your trunk. Then pretend to be tiny ants — crawl along the floor. Talk about what you would see: 'If I were an elephant, that tree would be huge! If I were an ant, that crumb would be huge!' Fun, imaginative, and conceptually rich.",
      },
      {
        id: "QC-33",
        title: "Paint Huge and Paint Tiny (huge/tiny)",
        audience: "educator",
        educatorVersion: "On large paper, children paint a huge shape. On small paper, they paint a tiny shape. Help children label their drawings. Display them. The physical constraint of the paper size (large vs small) helps children calibrate the concept of huge and tiny relative to context.",
        parentVersion: "Give your child a big sheet of paper to paint something huge, then a small piece of paper to paint something tiny. Talk about the difference: 'Your shape is huge — it fills the whole page! This tiny shape is very small.' Display them side by side.",
      },
      {
        id: "QC-34",
        title: "Show Me the Most Sand (most/least)",
        audience: "educator",
        educatorVersion: "Fill three same-sized containers with different amounts of sand. Show the least: 'This has the least sand.' Show the most: 'This has the most sand.' Mix order and ask children to identify most and least. In pairs, children fill three containers with progressively more sand. Use measuring cups to make amounts precise.",
        parentVersion: "Use three identical cups or jars and fill them with different amounts of water, rice, or sand. Ask your child: 'Which has the most? Which has the least? Which is in the middle?' Pour them back and fill again differently. Take turns pointing to the most and least.",
      },
      {
        id: "QC-35",
        title: "Redder Than Red (most/least)",
        audience: "educator",
        educatorVersion: "Select three children's paintings that share a single colour (e.g., red) used in varying amounts. Ask which has the most red and which has the least. Rearrange the paintings and ask a child to order them from most to least. Develops ordinal comparison language and transfers the concept from quantity to colour intensity.",
        parentVersion: "Look at books or your child's drawings together and find pictures that use a lot of one colour and a little of the same colour. Ask: 'Which picture has the most blue? Which has the least?' This extends most/least beyond physical objects into visual representation.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SHAPE CONCEPTS
  // IED III item: H-2 (inferred) | ID prefix: SC
  // Objective: Recognise, name and compare geometric shapes; identify characteristics
  // ─────────────────────────────────────────────────────────────────────────
  shapeConcepts: {
    iiedItem: "H-2",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Geometry and Spatial Sense",
    clinicalNote: "Shape knowledge develops through exploration, not memorisation — children need opportunities to handle, draw, sort and identify shapes across many contexts before reliable naming is expected. The ability to distinguish letter shapes (reading readiness) relies on the same visual-spatial skills as shape recognition. Difficulty distinguishing shapes visually may reflect broader visual-perceptual difficulties; note if the child also confuses similarly shaped letters (e.g., b/d, p/q, m/w) or has difficulty completing inset puzzles. Activities should be open-ended to accommodate children at different developmental levels using the same materials.",
    activities: [
      {
        id: "SC-01",
        title: "It's Puzzle Time!",
        audience: "educator",
        educatorVersion: "Provide a variety of puzzles (shape puzzles, floor puzzles, knob puzzles, picture puzzles). Children choose and work on puzzles independently or with peers. Join children during their work and prompt discussion of shape, colour, and position: 'What colour piece goes next to this one? That piece looks like the shape of the moon.' Support children in finding corner and edge pieces.",
        parentVersion: "Work on puzzles together at home — start with simple shape sorters or wooden puzzles with knob pieces. As you fit pieces together, talk about their shapes: 'This piece is round. This one has a corner.' Talk about where pieces go: 'This piece goes in the corner.'",
      },
      {
        id: "SC-02",
        title: "Finger Plays",
        audience: "both",
        educatorVersion: "Teach shape finger plays: 'Lines and Shapes,' 'Circle, Triangle and Square,' and 'What Am I Drawing?' Post the poems in the classroom. Do each play slowly, having children echo and then join in fully. Pause before rhyming words for children to supply. Drawing shapes in the air develops spatial understanding and fine-motor skill simultaneously.",
        parentVersion: "Teach your child to draw shapes in the air with their finger while naming them: a circle (round and round), a triangle (three lines meeting at points), a square (four equal lines). Make up simple rhymes about the shapes or sing about them. Air drawing is good practice before pencil work.",
      },
      {
        id: "SC-03",
        title: "Shapes in Play Dough",
        audience: "educator",
        educatorVersion: "Provide play dough and shaped biscuit cutters (circles, squares, rectangles, triangles, diamonds). Children explore the dough freely, then cut out shapes and sort them. As they cut and sort, talk about shape characteristics: 'A square has four sides that are all the same length.' As confidence grows, invite children to form shapes without cutters.",
        parentVersion: "Use play dough at home and cut out shapes with biscuit cutters or mould them by hand. Talk about each shape: 'How many sides does this triangle have? How many corners?' Let your child lead the exploration — making shapes by hand develops spatial awareness.",
      },
      {
        id: "SC-04",
        title: "Paper Plate Faces",
        audience: "educator",
        educatorVersion: "Pre-draw facial features on paper plates using geometric shapes: circles for eyes, triangle for nose, rectangle for mouth. Prepare matching cut-out shapes. Children match shapes from a shared pile to the outlines on their plate face and glue them in place. Extension: children create their own paper plate face using shapes, then describe it.",
        parentVersion: "Draw a face together on a paper plate using shapes — circle eyes, triangle nose, rectangle mouth. Cut out separate shapes and let your child glue them onto a second plate to make their own face. Ask: 'What shape are the eyes? What shape did you use for the nose?'",
      },
      {
        id: "SC-05",
        title: "What's in the Bag?",
        audience: "educator",
        educatorVersion: "Put differently shaped blocks (circle, square, rectangle, triangle, diamond) in a bag. Name the shapes and describe their attributes: 'A square has four sides all the same size.' Pass blocks for children to feel. Then children take turns reaching in, naming the shape they think they have before removing it. Continue with different combinations in the bag.",
        parentVersion: "Put differently shaped objects in a bag or pillowcase. Ask your child to reach in, feel an object, and guess its shape before pulling it out. Ask: 'Does it have corners? Is it smooth all the way around?' Talking about shape features helps your child identify shapes by touch.",
      },
      {
        id: "SC-06",
        title: "Let's Go on a Shape Hunt!",
        audience: "educator",
        educatorVersion: "Tape 6 of each shape (circle, triangle, square, rectangle, diamond) around the classroom. Assign each child a shape to find. Children hunt for 6 of their assigned shape in different locations. When found, children sit down. Play again with different shape assignments. Reinforces shape recognition in three-dimensional environmental contexts.",
        parentVersion: "Go on a shape hunt around your home or neighbourhood. Choose one shape each: 'I am hunting for circles, you are hunting for squares.' Find as many as possible and compare your lists. You can also look at a picture book and identify all the shapes you can see on each page.",
      },
      {
        id: "SC-07",
        title: "Circle Collage",
        audience: "educator",
        educatorVersion: "Provide circular items (pom-poms, plastic milk tops, coins, buttons, beads, paper circles cut from various materials — project paper, sandpaper, foil, newspaper). Children glue circular items onto a circular piece of project paper. Extension: repeat with squares, rectangles, triangles, and diamonds using appropriate shaped-cutout bases.",
        parentVersion: "Collect round objects from around the house — bottle tops, coins, stickers, circles cut from paper. Glue them onto a large paper circle to make a circle collage. Talk about what makes each item circular: 'It has no corners — it's round all the way.' Display the finished artwork.",
      },
      {
        id: "SC-08",
        title: "Chalk Drawings",
        audience: "both",
        educatorVersion: "On a footpath or large surface, children draw shapes in chalk. Verbalise the movement as you demonstrate: 'Start at the two o'clock position and go up and around until you close the circle.' Children imitate, then verbalise the movements themselves. After drawing, children 'erase' with damp sponges and try another shape. Encourage children to decorate their shapes creatively.",
        parentVersion: "Take chalk outside and draw shapes on the footpath or driveway. Talk about how to draw each one: 'For a triangle, draw three lines that meet at the corners.' Let your child decorate their shapes — turn a circle into a sun, a square into a house. Wash them away with water when done.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DIRECTIONAL AND POSITIONAL CONCEPTS
  // IED III item: H-3 (inferred) | ID prefix: DP
  // Objective: Understand directional/positional concepts from close/open to right/left of others
  // ─────────────────────────────────────────────────────────────────────────
  directionalConcepts: {
    iiedItem: "H-3",
    iiedItemNote: "Inferred — verify against IED III record form",
    domain: "Mathematics: Geometry and Spatial Sense",
    clinicalNote: "Directional and positional concept delays can significantly affect classroom participation — children who do not reliably understand 'top of the page,' 'line up behind,' or 'write on the left side' will struggle to follow basic classroom instructions. Teach receptive level first (responding to instructions) before expressive level (generating language). Right and left are the most challenging pair and should not be taught simultaneously; teach 'right' thoroughly before introducing 'left.' Children with difficulty here should be observed for wider spatial processing difficulties. Note if confusion extends to letter orientation (b/d, p/q) or if the child also has difficulty with body awareness tasks.",
    activities: [
      {
        id: "DP-01",
        title: "Open, Close Them",
        audience: "both",
        educatorVersion: "Teach the finger play 'Open, Close Them' with hand motions: opening and closing fists, clapping, putting hands in lap, creeping fingers up to chin. Use to reinforce open/close and in/out, up/down, front/back, behind/in front of. Slow down the actions so all children can follow. Repeat, inviting children to anticipate each motion.",
        parentVersion: "Learn 'Open, Close Them' together: open your hands wide, then make fists, over and over. Add the rest of the song when ready. It is a classic fingerplay that teaches the concept of open and closed through feel and action — much more memorable than words alone.",
      },
      {
        id: "DP-02",
        title: "Shake, Shimmy and Wiggle",
        audience: "educator",
        educatorVersion: "Children explore moving body parts in different directions. After free exploration, give whole-group directional instructions: 'Kick your leg forward, then backward.' 'Move your arm up, now down.' Reuse this activity to teach each concept pair (in/out, front/back, behind/in front of, up/down, low/high, forward/backward, right/left). Note: avoid having children face each other when teaching right and left — this creates mirror confusion.",
        parentVersion: "Play 'follow the leader' with directions: 'Reach your arms forward! Now backward! Now up high! Now down low!' Take turns being the leader. Giving directions to a parent makes children think hard about which direction is which — a powerful learning tool.",
      },
      {
        id: "DP-03",
        title: "Hokey Pokey",
        audience: "both",
        educatorVersion: "Teach 'Hokey Pokey,' progressing through: one arm, other arm, both arms, one leg, other leg, both legs, whole body. Children first watch, then join in. A classic movement activity that embeds positional language (in/out) and later right/left in a joyful, social context children know and love.",
        parentVersion: "Sing the Hokey Pokey together at home: 'You put one arm in, you take one arm out...' The song embeds 'in' and 'out' — and later you can sing the version with 'right hand' and 'left hand' to build that vocabulary. Dancing together makes it even more fun.",
      },
      {
        id: "DP-04",
        title: "Beanbag Boogie",
        audience: "educator",
        educatorVersion: "Give each child a beanbag. Follow progressively complex directional instructions: 'Hold the beanbag in front of you... above your head... behind your head... on your right wrist... as low as possible with your left hand.' Begin with single-step instructions and increase complexity. When demonstrating right/left, turn your back to children to avoid mirror confusion.",
        parentVersion: "Use a soft toy or beanbag and give your child movement instructions: 'Hold it in front of you... now behind you... now above your head... now at your left side.' Start simple and build in complexity. Can also be done while lying on the floor: 'Put it above your head... now to your right side.'",
      },
      {
        id: "DP-05",
        title: "Move to the Music",
        audience: "educator",
        educatorVersion: "Set up a row of chairs (one per child). When music plays, children walk in a specified direction in relation to the chairs. When music stops, children find a chair to sit on (all chairs remain — this is not musical chairs). Change the instruction each round: 'Walk behind the chairs... in front of the chairs... away from the chairs.' All children participate throughout.",
        parentVersion: "Put a row of chairs in a line at home. When music plays, your child walks in the direction you name: 'Walk in front of the chairs! Walk behind them! Walk toward them! Walk away from them!' Stop the music randomly and let your child sit down. Keep all chairs — this is not competitive.",
      },
      {
        id: "DP-06",
        title: "Tunnel Bugs",
        audience: "educator",
        educatorVersion: "Set up a crawling tunnel or open-ended appliance box as a 'playhouse.' Children take turns crawling in and out. Describe their location as they move: 'I can't see Mei — she is IN the playhouse!' 'I see Jack backing OUT!' Once in/out is mastered, introduce other concept pairs using the same equipment. Ask: 'Where are you?' and prompt 'I'm in the playhouse!'",
        parentVersion: "Make a simple tunnel from a cardboard box with both ends open. Take turns crawling through. Say where your child is: 'You're inside the tunnel now! Now you're outside!' Ask: 'Where are you?' and help them answer: 'I'm inside!' This is active learning of in and out.",
      },
      {
        id: "DP-07",
        title: "Hula Hoops",
        audience: "educator",
        educatorVersion: "Each child lays their hoop on the floor. With music playing, give movement directions: walk into the hoop, walk out, toward, away from, forward in, backward out, to the centre. Repeat with jumping instead of walking. Hop on right foot, repeat; hop on left foot, repeat. Progresses from gross-motor directional concepts to right/left in a fun, active format.",
        parentVersion: "Use a hula hoop (or draw a circle on the floor with tape). Give directions: 'Jump into the circle! Jump out! Walk toward it! Walk away!' When your child is ready, try: 'Hop on your right foot into the circle. Hop on your left foot out.' Active, spatial, and language-rich.",
      },
      {
        id: "DP-08",
        title: "Looking High, Looking Low",
        audience: "educator",
        educatorVersion: "Take a walk inside or outside the school. Point out objects that are high and objects that are low. On return, list observations on a large sheet of paper — high items written at the top of the paper, low items at the bottom. The spatial arrangement of the list reinforces the concepts.",
        parentVersion: "Take a walk and look for things that are high up and things that are low down. When you get home, make a list or draw them: high things at the top of the paper, low things at the bottom. 'What did we see that was high? What was low?' Natural environments offer rich examples.",
      },
      {
        id: "DP-09",
        title: "Where Is the Toy?",
        audience: "educator",
        educatorVersion: "Children play with a container (e.g., shoebox) and small toys. Narrate children's actions as they place toys: 'in the box, under the box, on top of the box.' Ask both receptive ('Can you put the dog behind the box?') and expressive ('Where is the dog?') questions. Encourage full-sentence responses. Naturally extends to in/out, over/under, behind/in front of, centre/corner.",
        parentVersion: "Use a shoebox and some small toys. Ask your child to put a toy 'in the box,' 'under the box,' 'on top of the box,' 'behind the box.' Ask: 'Where is the toy?' and help them describe: 'It is inside the box.' A simple activity that builds a lot of important language.",
      },
      {
        id: "DP-10",
        title: "Toys on the Shelves",
        audience: "educator",
        educatorVersion: "Use a two-shelf bookcase (or improvise with two stacked shoeboxes). Place toys on shelves and name positions: top or bottom. Children follow instructions: 'Put the stuffed turtle on the bottom shelf.' Extend to: 'Put the block in the centre of the top shelf.' 'Put the car at the back of the bottom shelf.' Transfer to right/left of self when children are ready.",
        parentVersion: "Use a bookshelf or create two 'shelves' from boxes. Place toys in positions and ask your child to describe where each one is: 'Is the bear on the top shelf or the bottom shelf?' Then give instructions: 'Put the car on the bottom shelf.' Extend to 'in the middle' or 'at the back.'",
      },
      {
        id: "DP-11",
        title: "Build a Snack! (above/below, centre/corner)",
        audience: "educator",
        educatorVersion: "Children build cracker sandwiches, narrating as they build: 'I'm putting the cheese on top of the cracker.' 'I put banana in the centre of my cracker.' 'Paul nibbled the corner of his cheese.' Edible activities with directional language embedded in real choices make the vocabulary immediately meaningful.",
        parentVersion: "Build a cracker snack together and talk about positions as you build: 'I'm putting the cheese on top of the cracker. Now I'll put some apple in the centre. I nibbled the corner of mine!' Any building activity with food gives you natural opportunities to practise position words.",
      },
      {
        id: "DP-12",
        title: "Float or Sink? (top/bottom, in/out)",
        audience: "educator",
        educatorVersion: "Children test objects in a water table or large bowl: predict, then test whether each floats on top or sinks to the bottom. Describe results: 'The pine cone floated on top. The rock sank to the bottom.' Leave the water table available for continued independent exploration. Integrates science inquiry with positional language.",
        parentVersion: "Fill a large bowl with water. Gather some objects from around the house. Ask your child: 'Will this float on top or sink to the bottom?' Test each one and talk about the results: 'The cork floated! The spoon sank to the bottom.' A science experiment that builds positional language.",
      },
      {
        id: "DP-13",
        title: "Building Blocks",
        audience: "educator",
        educatorVersion: "Children sit beside you (same perspective) and each have their own identical set of blocks. Build a simple structure, describing each placement: 'I am putting the red block behind the green block. The yellow block goes on top.' Children then build from your instructions: 'Put a blue block to the right of the yellow block.' Comment on placements; give specific directional instructions.",
        parentVersion: "Build with blocks together and describe what you're doing: 'I'm putting the red block behind the blue one.' 'Put the small block on top of the big one.' Then let your child give you instructions. Building with positional language helps these words become precise and purposeful.",
      },
      {
        id: "DP-14",
        title: "Going on a Bear Hunt",
        audience: "both",
        educatorVersion: "Tell a story incorporating directional and positional language with actions: walking, climbing over a fallen tree (too high to go over, too low to go under — walk around), opening and closing a gate, walking up a hill, looking right, left, below. Children act out the story as you narrate. Can be extended or adapted to cover any target concept pair.",
        parentVersion: "Tell the 'Going on a Bear Hunt' story together with actions. Walk in place, mime climbing, duck through a tunnel, look left and right. The story incorporates over, under, in, out, forward, backward, high, low, right, and left. Acting out a narrative is one of the richest ways to learn positional language.",
      },
      {
        id: "DP-15",
        title: "I Spy",
        audience: "both",
        educatorVersion: "Describe an object's location using positional language: 'I spy, with my little eye, something on top of the bookshelf.' If a child guesses an object in the wrong position, confirm they looked in the right direction. The child who guesses correctly becomes the next leader. Extends to all positional concept pairs across sessions.",
        parentVersion: "Play 'I Spy' at home using positional clues: 'I spy something behind the cushion... something under the table... something on top of the fridge.' Ask your child to give clues too. This is a natural, enjoyable way to use positional language for real communication.",
      },
      {
        id: "DP-16",
        title: "An Album of Positions",
        audience: "educator",
        educatorVersion: "Photograph children demonstrating various positional concepts: on top of the climbing frame, in front of the school, behind the teacher's desk. Children dictate captions: 'James goes down the slide.' Place photos in a class album for the book area. Photographs of themselves using the language make the concepts personally meaningful.",
        parentVersion: "Take photos of your child in different positions: on top of a chair, behind a tree, under the table, in the tunnel at the playground. Print or view them together and describe: 'You are behind the tree in this one.' A personalised photo book is a favourite activity children return to repeatedly.",
      },
      {
        id: "DP-17",
        title: "Flannel Board",
        audience: "educator",
        educatorVersion: "Place felt cutouts on a flannel board describing positions: 'I'm putting the star on the board... now the heart below the star.' Then give children their own cutouts and specific instructions: 'Linda, place a circle in the middle. Will, place a square to the right of Linda's circle.' Finally, lay the flannel board flat and repeat on the horizontal plane — a critical transfer step.",
        parentVersion: "Use felt shapes on a felt board (or paper shapes on a cushion). Place shapes and describe where they are: 'I'm putting the star in the centre.' Ask your child to follow instructions: 'Put the heart below the star. Put the circle to the right of the heart.' Then lay the board flat and try again.",
      },
      {
        id: "DP-18",
        title: "Peg-Boards",
        audience: "educator",
        educatorVersion: "With the pegboard flat on a table, place pegs while naming positions: 'I'm putting this peg in the centre... this one above it.' Children then follow positional instructions to place their own pegs. The horizontal orientation is important — children must transfer vertical-plane positional concepts to a flat surface, which is how they will apply these skills in writing tasks.",
        parentVersion: "Use a peg board or make a grid on cardboard with a grid of dots. Push pegs or draw dots in specified positions: 'Put one in the centre... one above it... one in the corner.' Talk about each placement. The flat surface is the same orientation as paper, which transfers directly to writing tasks.",
      },
      {
        id: "DP-19",
        title: "Board Game",
        audience: "educator",
        educatorVersion: "Play a board game that uses directional language: forward, backward, up, down, centre. As children play, ask questions: 'Whose piece is in front of the green one?' Prompt children to use positional language as they move: 'I moved forward three spaces.' Games provide authentic, purposeful contexts for using position words.",
        parentVersion: "Play a simple board game together and use directional language as you go: 'Move forward three spaces... go back two... your piece is behind mine now.' Any game involving movement on a board naturally generates positional language. Snakes and Ladders is ideal — up the ladder, down the snake.",
      },
      {
        id: "DP-20",
        title: "Left, Right, Left, Right!",
        audience: "educator",
        educatorVersion: "Prepare left-foot (blue) and right-foot (red) cutouts in an alternating floor pattern. Tie matching coloured ribbons on children's feet. Children follow the pattern, saying 'right' and 'left' as they step on each footprint. Using a different colour for each foot is a proven scaffold for children learning right/left. Gradually reduce the ribbon as mastery grows.",
        parentVersion: "Make left and right footprints on paper — different colours for each foot. Put them in an alternating pattern on the floor. Your child steps on each, saying 'right' and 'left.' You can tie a piece of ribbon on their right hand or foot as a memory aid until they can reliably tell the difference.",
      },
      {
        id: "DP-21",
        title: "Post Office",
        audience: "educator",
        educatorVersion: "Set up a dramatic play post office with envelopes, stamps, letterboxes, a scale, and a mailbag. Join children's play and embed positional language naturally: 'Julie is putting a stamp on the corner of the envelope.' 'Mark put the letter into the mail slot on the front of the letterbox.' Dramatic play provides authentic, self-motivated practice in a context rich with positional language.",
        parentVersion: "Set up a home post office with your child: envelopes, stickers as stamps, a box as the letterbox. Play together: 'Put the stamp in the top-right corner of the envelope.' 'Drop the letter in the front of the letterbox.' Encouraging your child to run the post office means they give directions — even more powerful.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CONCEPTS OF TIME AND READING A CLOCK
  // IED III item: I-1 (inferred — Science domain in BRIGANCE) | ID prefix: CT
  // Objective: Understand time concepts; explore clock reading to the hour
  // DOMAIN NOTE: This section maps to Science: Scientific Knowledge in BRIGANCE,
  // not Mathematics. Handle routing separately if app filters by domain.
  // ─────────────────────────────────────────────────────────────────────────
  conceptsOfTime: {
    iiedItem: "I-1",
    iiedItemNote: "Inferred — this domain is Science: Scientific Knowledge in BRIGANCE, not Mathematics. Verify IED III item code and consider separate routing in the app. May not be assessed as part of the standard CHDC mathematics screening.",
    domain: "Science: Scientific Knowledge",
    clinicalNote: "Time is an abstract concept that develops through personal, meaningful experience — abstract clock reading without anchoring to real events is developmentally inappropriate for most preschool-age children. Focus initially on sequencing daily events using before/after/first/next/last language. Yesterday/today/tomorrow concepts typically consolidate around age 4–5. Reading a clock to the hour is typically a school-readiness to early school-age skill. Difficulty with time sequencing may reflect difficulties with narrative sequencing more broadly — note if the child also has difficulty retelling stories in order or following multi-step instructions.",
    activities: [
      {
        id: "CT-01",
        title: "Times of the Day",
        audience: "both",
        educatorVersion: "Create a three-column chart: Morning, Afternoon, Night. Discuss what children do in each time period, prompting sequence language: 'What is the first thing you do when you wake up? After you get dressed, what do you do next?' Record children's responses in each column. Use first, next, last, before, and after consistently as anchor words throughout the discussion.",
        parentVersion: "Talk about your day together using 'morning,' 'afternoon,' and 'night.' 'What do we do in the morning before school? What happens in the afternoon? What do we do at night?' Use the words first, next, and last when you describe the sequence. Repeating this conversation regularly helps your child understand how time flows through a day.",
      },
      {
        id: "CT-02",
        title: "Our Classroom Schedule",
        audience: "educator",
        educatorVersion: "Make large illustrated schedule cards for each classroom activity. With children, discuss what happens before and after each activity. Place cards on a bulletin board in daily order. Before each transition, point to the board and invite children to name what comes next. A visual schedule is a powerful routine-management tool as well as a time-concept learning resource.",
        parentVersion: "Make simple picture cards of your daily routine at home: wake up, breakfast, get dressed, go to preschool, and so on. Place them in order on the fridge or a noticeboard. Each morning, go through the day together. Ask: 'What comes after breakfast? What do we do before lunch?' This builds time sequencing through familiar, predictable routines.",
      },
      {
        id: "CT-03",
        title: "Yesterday, Today and Tomorrow",
        audience: "educator",
        educatorVersion: "During circle time, discuss: what special things happened yesterday? What is on today's schedule? What is planned for tomorrow? Use a visible classroom calendar and schedule as anchors. The language of yesterday/today/tomorrow is abstract for young children and requires daily, consistent use to consolidate — not a one-off lesson.",
        parentVersion: "Talk about yesterday, today, and tomorrow as part of your daily conversation. 'Yesterday we went to the park. Today we are going to preschool. Tomorrow is Saturday — we can stay home.' These conversations need to happen regularly before the words become genuinely meaningful. A calendar on the wall can help make time visible.",
      },
      {
        id: "CT-04",
        title: "Our Classroom Timeline",
        audience: "educator",
        educatorVersion: "Hang a clothesline in the classroom. Children draw pictures of significant shared events (first day of school, an excursion, a celebration). Add dates or months where possible. Order the pictures chronologically on the clothesline by asking: 'Did this happen before or after that?' A class timeline makes time concrete and visible in a way that daily conversation alone cannot achieve.",
        parentVersion: "Make a simple family timeline together: draw or print photos of events from the past year and put them in order on a piece of string or a line of paper. Talk about what happened first, next, and last. This makes the flow of time visible and personal for your child.",
      },
      {
        id: "CT-05",
        title: "It's Time to Tell the Time!",
        audience: "educator",
        educatorVersion: "Use a teaching clock to introduce clock features. Point to each numeral; children read it aloud. Focus first on the little (hour) hand, showing how it points to each hour as you move it around. Explain that the little hand helps you tell what hour it is. If children are ready, introduce the big (minute) hand as a separate concept. Do not rush to clock reading — conceptual understanding of time must precede this symbolic skill.",
        parentVersion: "Show your child a clock (real or toy). Point to the numbers and read them together. Show how the hands move around. Explain: 'The short hand tells us what hour it is.' When the short hand points to 7, it is 7 o'clock — time to wake up!' Connect clock positions to real moments in your child's day.",
      },
      {
        id: "CT-06",
        title: "This Is the Way We Tell the Time",
        audience: "both",
        educatorVersion: "Discuss activities and their associated times: 'At 9:00 school starts. At 12:00 we have lunch. At 8:00 we go to bed.' Show each time on a teaching clock. Teach the song to the tune of 'Here We Go Round the Mulberry Bush': 'At 9 o'clock, we come to school...' Make up additional verses tied to the children's own day. The song bridges personal time experiences with clock reading.",
        parentVersion: "Sing a simple time song to the tune of 'Here We Go Round the Mulberry Bush': 'At 7 o'clock, we wake up, wake up, wake up — at 7 o'clock, we wake up, we wake up each day!' Make up verses for your family's routine. Then show your child what the clock looks like at each time you sing about.",
      },
    ],
  },

    // ─────────────────────────────────────────────────────────
    // BATCH 5 — SOCIAL-EMOTIONAL & SELF-HELP
    // Source: socialEmotionalAndSelfHelpActivities.js | 90 activities
    // IED III codes inferred — verify before routing
    // ─────────────────────────────────────────────────────────

  generalSocialEmotional: {
  iiedItem: "INFERRED — verify against IED III record form",
  domain: "Social and Emotional Development: Social Relationships",
  clinicalNote:
    "Strong social-emotional skills underpin school readiness across multiple domains. Skill acquisition follows a broad developmental sequence (parallel play ~2.5y → cooperative play with peers ~5–6y) but individual variation is significant. Flag persistent difficulties with turn-taking, cooperative play, or peer relationships for further social-emotional assessment. Cultural considerations apply to expected expression of emotion and social norms.",
  activities: [
    {
      id: "SE-01",
      title: "Simon Says",
      targetSkill: "Following directions; impulse control; listening",
      ageRange: "3–6 years",
      audience: "educator",
      materials: "None",
      groupSize: "Small group or class",
      educatorVersion:
        "Have children stand in a circle. Give 'Simon Says' commands while performing the action for children to imitate (e.g. 'Simon says, put your hands on your hips'). Introduce commands without 'Simon Says' and ask children to freeze — not follow. Mix the two types progressively. Children who move when they shouldn't be asked to sit. Play until one child remains standing. Supports rule-following, listening, and inhibitory control.",
      parentVersion:
        "Play Simon Says at home with your child. Say 'Simon says, jump on one foot' and do the action together. Then try a command without 'Simon says' and see if your child can freeze. Take turns being Simon. Great for waiting, listening, and self-control.",
    },
    {
      id: "SE-02",
      title: "Duck, Duck, Goose",
      targetSkill: "Turn-taking; cooperative group play; waiting",
      ageRange: "3–6 years",
      audience: "both",
      materials: "None — large play area required",
      groupSize: "Small group or class",
      educatorVersion:
        "Have children sit cross-legged in a circle. Choose a tapper who walks around tapping each child's head and saying 'Duck'. When the tapper says 'Goose', that child chases the tapper back to the empty space. As the game progresses, encourage tappers to select children who haven't had a turn. Supports peer engagement, gross motor skills, and cooperative group rules.",
      parentVersion:
        "Play Duck, Duck, Goose with family or a small group of children. Sit in a circle and take turns being the 'tapper'. This builds turn-taking, running skills, and the ability to follow a simple group game with rules.",
    },
    {
      id: "SE-03",
      title: "It's Time to Cook! (Dramatic Play)",
      targetSkill: "Cooperative play; role-taking; communication with peers",
      ageRange: "2.5–5 years",
      audience: "educator",
      materials:
        "Child-sized kitchen appliances (stove, fridge, sink); pots, pans, cups, bowls, plates, wooden spoons, cutlery; aprons, dishcloths, napkins, tablecloths; small table and chairs; shopping list; simple recipe",
      groupSize: "Small group",
      educatorVersion:
        "Set up a kitchen area in the dramatic play space. Encourage children to act out family mealtime activities using props. Prompt role decisions (cook, dishwasher, etc.) and use open-ended questions to extend play: 'What are you cooking for dinner tonight?' Facilitates cooperative play, language, role negotiation, and social understanding of family life.",
      parentVersion:
        "Set up a pretend kitchen at home using safe kitchen items (plastic bowls, wooden spoons, empty containers). Invite your child to 'cook' a meal and take on roles. Join in and ask questions: 'What are we having for dinner? Can I help wash up?' This builds imagination, cooperation, and conversation skills.",
    },
  ],
},

  playSkills: {
  iiedItem: "INFERRED — verify against IED III record form",
  domain: "Social and Emotional Development: Cooperation",
  clinicalNote:
    "Play is a primary vehicle for social skill acquisition in early childhood. Progression from parallel play to cooperative play with rules typically spans 2.5–6 years. Persistent difficulties with pretend play (especially lack of symbolic or socio-dramatic play by age 3) may warrant ASD screening. Turn-taking difficulties beyond age 4 without adult support may indicate self-regulation difficulties worth exploring. Play schemas also offer important clinical observation opportunities.",
  activities: [
    {
      id: "PS-01",
      title: "Let's Take Turns",
      targetSkill: "Turn-taking; listening; peer communication",
      ageRange: "3–5 years",
      audience: "educator",
      materials: "Wool ball or beanbag; CD/audio player and music",
      groupSize: "Small group or class",
      educatorVersion:
        "Have children sit cross-legged in a circle. Play music and have children pass a beanbag around the circle. When the music stops, the child holding the beanbag shares something (e.g. favourite toy or food). When music restarts, the child extends legs to signal they have had a turn. Continue until everyone has shared. Extension: invite children to suggest other share topics (pets, games). Builds structured turn-taking and peer communication.",
      parentVersion:
        "At home, pass an object (like a stuffed toy) around the family while music plays. When the music stops, whoever holds it shares something — a favourite food, animal, or memory. This is a gentle, fun way for your child to practise waiting and listening.",
    },
    {
      id: "PS-02",
      title: "Puppet Show",
      targetSkill: "Cooperative play; creative storytelling; peer negotiation",
      ageRange: "4–6 years",
      audience: "educator",
      materials:
        "Hand, finger, stick, or child-made puppets; puppet stage (large appliance box, towel over chair back, or blanket over card table)",
      groupSize: "Small group or class",
      educatorVersion:
        "Have each child make and name a puppet, then take turns introducing it to the class. Divide into groups of 2–3 and have each group create a story and perform a puppet show, gathering props as needed. Prompt imagination with questions ('What will your puppet do next?'). Optionally extend to a musical puppet show. Builds collaborative storytelling, expressive language, perspective-taking, and creative play.",
      parentVersion:
        "Make simple puppets at home using socks, paper bags, or craft sticks. Let your child name their puppet and make up a story. Take turns being the audience and the performer. Ask questions to extend the story: 'Oh no, what happens next?' This builds imagination, language, and confidence in self-expression.",
    },
    {
      id: "PS-03",
      title: "My Turn, Your Turn (Block Tower)",
      targetSkill: "Turn-taking in play; cooperative construction; verbal cuing",
      ageRange: "3–5 years",
      audience: "both",
      materials: "Building blocks",
      groupSize: "Small group (pairs)",
      educatorVersion:
        "Divide children into pairs with a shared bucket of blocks. Model turn-taking explicitly: place a block and say 'My turn', then point to a partner and say 'Your turn'. Have pairs build towers using this structure. Generalise the prompt to playground equipment and other games throughout the day. Reinforces explicit, language-anchored turn-taking before children can manage it independently.",
      parentVersion:
        "Sit with your child and take turns adding blocks to a tower. Use clear language: 'My turn' then 'Your turn'. Keep it playful — can you make it really tall before it topples? This helps your child practise waiting and sharing in a structured, enjoyable way.",
    },
    {
      id: "PS-04",
      title: "The Matching Game",
      targetSkill: "Turn-taking with rules; memory; peer interaction",
      ageRange: "4–6 years",
      audience: "both",
      materials: "Pairs of matching picture cards (shuffled, face down)",
      groupSize: "Small group",
      educatorVersion:
        "Lay shuffled card pairs face down. Explain the object: pick two cards per turn — if they match, keep them; if not, turn them back over. Remind children of the rules ('one turn at a time', 'only two cards'). Model the game before children play independently. Builds rule-governed turn-taking, working memory, and the ability to delay gratification while waiting.",
      parentVersion:
        "Play a matching card game at home using pairs of picture cards or make your own with stickers on index cards. Take turns flipping two cards to find a pair. This builds your child's memory, patience, and ability to follow rules in a game.",
    },
    {
      id: "PS-05",
      title: "Shoe Shop (Dramatic Play)",
      targetSkill: "Role play; cooperative peer interaction; functional language",
      ageRange: "4–6 years",
      audience: "educator",
      materials:
        "Empty shoeboxes; old shoes in various sizes; shoe horns; measuring tape; toy cash register; tissue paper; paper bags; mirror",
      groupSize: "Small group",
      educatorVersion:
        "Set up a dramatic play shoe shop. Assign children roles as salespeople and customers. Prompt customer behaviour (trying on shoes, looking in mirror) and salesperson behaviour (measuring feet, boxing shoes, running the register). Scaffold with questions: 'What colour shoes do you want?' 'What size do you wear?' Supports cooperative play, functional language, numeracy concepts, and social role understanding.",
      parentVersion:
        "Set up a pretend shoe shop at home using boxes and old shoes. Take turns being the shopkeeper and the customer. Use questions like 'What size do you need?' and 'How much do these cost?' This builds imaginative play, vocabulary, and turn-taking.",
    },
  ],
},

  initiativeEngagement: {
  iiedItem: "INFERRED — verify against IED III record form",
  domain: "Social and Emotional Development: Approaches to Learning",
  clinicalNote:
    "Initiative, curiosity, and sustained engagement are key school readiness indicators. Typical sustained attention for structured tasks increases from ~5 min at age 3 to ~20 min in a small group by age 6. Significant difficulties maintaining engagement at age-expected levels (with or without distractibility, impulsivity) may warrant ADHD screening. Engagement profile also interacts with sensory processing, language, and anxiety considerations.",
  activities: [
    {
      id: "IE-01",
      title: "Rebuilding the Farm",
      targetSkill:
        "Sustained engagement; problem-solving; collaborative construction",
      ageRange: "3–6 years",
      audience: "educator",
      materials: "LEGO/DUPLO or wooden/plastic blocks; plastic or wooden animal figures",
      groupSize: "Individual or small group",
      educatorVersion:
        "Frame the task as a mission: the farm was destroyed in a storm and animals have escaped — children must help rebuild it. Encourage children to form a plan and allocate building roles. Prompt features: gates, stalls, feeding troughs. Use scaffolding questions: 'How many blocks will you need to fix that fence?' or 'The horse might jump over that — what could you do?' Observe problem-solving approaches and peer negotiation. Sustains engagement through narrative motivation.",
      parentVersion:
        "Tell your child that a pretend farm has been knocked over in a storm — can they help rebuild it? Use blocks, boxes, or toy animals you have at home. Ask questions: 'Where will the animals sleep? How can we make sure they can't escape?' This builds imagination, persistence, and problem-solving.",
    },
    {
      id: "IE-02",
      title: "Classroom Pets (Aquarium Care)",
      targetSkill:
        "Sustained curiosity; routine responsibility; scientific observation",
      ageRange: "3–6 years",
      audience: "educator",
      materials:
        "Small aquarium; hardy fish (compatible varieties); aquarium accessories (pebbles, artificial plants, net); fish food; related books",
      groupSize: "Individual, small group, or class",
      educatorVersion:
        "Set up a classroom aquarium after consulting a pet shop about compatible fish varieties. Display related books near the tank. Discuss fish types, care needs, and daily feeding quantities. Create a feeding schedule and rotate the responsibility of feeding across children. Use the aquarium as an ongoing observation and science conversation point. Builds sustained interest, routine responsibility, scientific vocabulary, and a sense of care for living things.",
      parentVersion:
        "If you have a pet at home, involve your child in simple care tasks: filling a water bowl, placing food in a feeder, or helping clean a cage under supervision. If you don't have a pet, books about animals and visits to pet shops or zoos serve a similar purpose. Regular, small responsibilities build your child's initiative and sense of competence.",
    },
  ],
},

  selfRegulation: {
  iiedItem: "INFERRED — verify against IED III record form",
  domain: "Social and Emotional Development: Self-Regulation",
  clinicalNote:
    "Self-regulation underpins academic and social school readiness. Typical developmental trajectory includes: turn-taking with adult assistance (~3y), beginning emotional word use (~3–4y), waiting for a turn with a strategy (~4y), attempting peer conflict resolution before seeking adult help (~5–6y). Significant difficulties at school entry — particularly with transitions, impulse control, or emotional dysregulation — may reflect trauma, ADHD, ASD, anxiety, or developmental language disorder. Environmental scaffolding (visual timetables, predictable routines, co-regulation) supports development. Flag persistent dysregulation for further assessment.",
  activities: [
    {
      id: "SR-01",
      title: "Attention, Please! (Nonverbal Transition Signals)",
      targetSkill:
        "Responding to transition signals; attention focus; co-regulation",
      ageRange: "3–6 years",
      audience: "educator",
      materials: "None (or light switch accessible to educator)",
      groupSize: "Small group or class",
      educatorVersion:
        "Use consistent nonverbal signals rather than raising your voice to transition children: turn the lights off briefly, raise your hand, or begin a familiar finger play or song with motions (e.g. 'Incy Wincy Spider'). Use eye contact to invite children to join in. Establish one or two consistent signals so children can predict and respond. This reduces transition dysregulation and builds attentional co-regulation without reliance on verbal commands. The predictability itself is a regulatory scaffold.",
      parentVersion:
        "Instead of calling out across the room, create a gentle signal your child knows means 'time to switch activities' — for example, flickering the light, playing a short song, or using a wind-up timer. Warn your child '5 minutes until pack-up time'. Predictable signals make transitions easier for children who find change hard.",
    },
    {
      id: "SR-02",
      title: "Zip Up Your Bubble!",
      targetSkill:
        "Body awareness; impulse control; transitioning to calm; personal space",
      ageRange: "3–6 years",
      audience: "educator",
      materials: "None",
      groupSize: "Small group or class",
      educatorVersion:
        "Have children stand in a circle with space between them. Use imaginative embodied language: ask children to step into their 'pretend bubble', then mime carefully zipping it from toes to head as you say 'Grab the zipper by your toes and zip up your bubble all the way to the top of your head.' Once 'zipped', transition to the next activity. This somatic, playful strategy supports body containment and attentional refocusing at transitions. Particularly useful before circle time or group instruction.",
      parentVersion:
        "Before a situation where your child needs to keep their hands to themselves (a shopping trip, a quiet car journey), try a 'bubble' game. Ask your child to step into their pretend bubble and mime zipping it up from their toes to their head. This fun, imaginative strategy helps children contain their impulses and focus.",
    },
    {
      id: "SR-03",
      title: "Pass Around the Microphone",
      targetSkill:
        "Turn-taking with waiting; active listening; self-expression in a group",
      ageRange: "3–6 years",
      audience: "educator",
      materials:
        "Pretend microphone (toilet roll covered with foil; ball of foil taped to top)",
      groupSize: "Small group or class",
      educatorVersion:
        "Pass a pretend microphone around a circle. Each child says what they will do during choice time when they hold it. Children who are waiting are cued to look at the speaker and practise being a 'good listener'. This structures a waiting experience with a clear, fair endpoint for each child. The object externalises the turn ('if you're not holding the mic, you're listening'), reducing verbal reminders and supporting self-monitoring.",
      parentVersion:
        "Make a pretend microphone from a cardboard roll and foil. Pass it around at family dinner or during a car trip — whoever holds the mic shares one thing about their day. Everyone else listens without interrupting. This builds your child's ability to wait, listen, and express themselves.",
    },
    {
      id: "SR-04",
      title: "Waiting My Turn (Egg Timer)",
      targetSkill:
        "Delay of gratification; turn management; self-directed waiting",
      ageRange: "3–6 years",
      audience: "educator",
      materials: "Egg timer or visual clock; optional 'turns list'",
      groupSize: "Small group or class",
      educatorVersion:
        "When a centre is full, place an egg timer near the waiting child and encourage them to go to another available centre rather than waiting idly. Optionally set up a visible 'turns list' where children write or place their name. Variation: for multiple waiting children, play a song — when the song ends, children swap places. This externalises the waiting experience, gives children a self-management strategy, and reduces conflict at popular centres.",
      parentVersion:
        "When your child needs to wait (for a turn on a device, for a sibling to finish), use a small timer. Say 'When the timer goes off, it's your turn.' Encourage them to do something else while they wait. Visible timers help children understand that waiting has an end, making it much more manageable.",
    },
    {
      id: "SR-05",
      title: "Let's Help Out! (Classroom Jobs)",
      targetSkill:
        "Following routines; responsibility; empathy; initiative in tasks",
      ageRange: "3–6 years",
      audience: "educator",
      materials: "Poster paper and markers; job chart with pictures",
      groupSize: "Small group or class",
      educatorVersion:
        "Create a weekly jobs chart with pictures of each role (e.g. water plants, clean up book area, feed fish, set table for snack). Assign or invite volunteer for each job weekly. Demonstrate each job at the start of the week and discuss why it matters and why we rotate. Jobs build routine responsibility, executive function (task initiation and completion), sense of belonging, and empathy ('I'm taking care of our classroom').",
      parentVersion:
        "Give your child a simple, regular household job suited to their age: putting napkins on the table, feeding a pet, or emptying a small bin. Rotate jobs occasionally and talk about why the job matters. Predictable responsibility builds self-confidence and a sense of belonging in the family.",
    },
    {
      id: "SR-06",
      title: "Let's Show We Care (Get Well Cards)",
      targetSkill:
        "Empathy; prosocial behaviour; written/drawn emotional expression",
      ageRange: "4–6 years",
      audience: "educator",
      materials:
        "Project paper; stickers, ribbons, glitter, and other decorative materials; crayons and markers; glue",
      groupSize: "Small group or class",
      educatorVersion:
        "Set up a 'We Care' centre. Initiate a discussion about a classmate or family member who is unwell. Invite children to make get well cards, with support to write or dictate messages and sign their names. Display or send cards. Builds empathy in action, connects emotional understanding to a concrete prosocial response, and gives children a meaningful purpose for early writing.",
      parentVersion:
        "When someone your child knows is unwell or going through a hard time, invite your child to make them a card or draw a picture. Help them think about how that person might be feeling and what kind words they could say. Small acts of caring build empathy and emotional understanding.",
    },
    {
      id: "SR-07",
      title: "Circle Time Feelings (Heart Pass)",
      targetSkill:
        "Emotional vocabulary; feelings identification; emotional security in group",
      ageRange: "3–6 years",
      audience: "educator",
      materials: "Large paper heart (laminated for durability)",
      groupSize: "Small group or class",
      educatorVersion:
        "Sit children in a circle. Hold the heart and model sharing a feeling with context: 'I feel happy today — it's my son's birthday.' Pass the heart and invite each child to share a feeling. Whoever holds the heart then asks 'How do you feel today?' and passes it on. If a child shares sadness or anger, give them space to talk if comfortable and help explore solutions. If a child declines, normalise it: 'That's okay. Maybe next time.' Builds emotional vocabulary, validation, and safe group expression.",
      parentVersion:
        "At the end of each day, try a feelings check-in at home. Use a special object (a smooth stone, a teddy bear) and take turns saying how you're feeling. Model your own feelings honestly. This builds your child's emotional vocabulary and sense of safety in talking about feelings.",
    },
    {
      id: "SR-08",
      title: "Use Your Words! (Puppet Conflict Resolution)",
      targetSkill:
        "Conflict resolution language; emotional regulation; perspective-taking",
      ageRange: "4–6 years",
      audience: "educator",
      materials: "Puppets (at least 2)",
      groupSize: "Pairs, small group, or class",
      educatorVersion:
        "Present a conflict scenario (e.g. 'What would you do if someone pushed you to get on a swing?'). Prompt children to brainstorm self-regulation strategies before reacting: counting to five, deep breaths, seeking adult help. Use puppets to enact the conflict and resolution, modelling language: 'I don't like being pushed. It makes me mad. Please don't do it again.' Then 'Let's take turns.' Invite children to suggest other endings. Builds conflict resolution language, emotional self-regulation strategies, and perspective-taking — all key social competencies for school entry.",
      parentVersion:
        "Use two soft toys or puppets to act out a common conflict (e.g. both wanting the same toy). Model through the puppets what they could say: 'I had it first' / 'Can we share?' / 'Let's take turns.' Invite your child to help the puppets solve the problem. This is a safe, playful way to build conflict resolution language.",
    },
    {
      id: "SR-09",
      title: "Draw It, Then Talk About It",
      targetSkill:
        "Emotional expression through art; reflective language; conflict processing",
      ageRange: "4–6 years",
      audience: "educator",
      materials: "Project paper; markers and crayons",
      groupSize: "Individual or small group",
      educatorVersion:
        "When a classroom conflict arises, provide the child with paper and crayons and invite them to draw what happened. Use the drawing as a conversation scaffold: 'You look angry here. What happened? What did you do? What could you do if it happens again?' Offer specific language templates for future use: 'Please don't take my ball — I was playing with it.' If comfortable, invite sharing with the class and discussion of resolution strategies. Drawing externalises internal experience and reduces the affective charge enough to allow reflective conversation.",
      parentVersion:
        "When your child is upset after a conflict, try offering paper and crayons before talking it through. Invite them to draw what happened. Then sit beside them and ask gently: 'What's happening in your picture? How did you feel? What could you try next time?' Drawing first helps many children feel less flooded and more able to reflect.",
    },
    {
      id: "SR-10",
      title: "It's Time for a Story (Conflict and Feelings Books)",
      targetSkill:
        "Emotional vocabulary through literature; narrative reasoning; conflict understanding",
      ageRange: "3–6 years",
      audience: "both",
      materials:
        "Books addressing feelings and conflict resolution (see BRIGANCE Read-to-Me book list, p. 317 — e.g. Peter's Chair by Ezra Jack Keats; Noisy Nora by Rosemary Wells)",
      groupSize: "Individual, small group, or class",
      educatorVersion:
        "When emotional intensity is high in the classroom, gather children and read a book that mirrors the situation or feeling. Read once for story, then re-read asking children to narrate each page, identify feelings, describe the problem, and explore how it was resolved. Connect characters' experiences to children's own. Books provide narrative distance that makes emotional content approachable and build emotional literacy through repeated exposure to feelings vocabulary in context.",
      parentVersion:
        "Reading books about feelings and social situations is one of the most powerful ways to build your child's emotional vocabulary. After reading, ask: 'How do you think that character felt? What did they do? What would you do?' Look for books where characters face challenges and work them out — these give children language and ideas for their own difficulties.",
    },
  ],
},

  personalDataResponse: {
  iiedItem: "INFERRED — verify against IED III record form",
  domain:
    "Social and Emotional Development: Knowledge of Self, Families and Communities",
  clinicalNote:
    "Verbal personal data is a safety-critical skill as well as an identity milestone. Typical developmental sequence: first name (~2.5y), last name, gender, age (~3y), town/address (~4y), birthday/caregiver names (~5y), phone number/complete address (~6–7y). EAL/D children may need additional time and contextual support. Articulation difficulties affecting personal information production (particularly sounds not mastered until age 6–7: L, R, V, Z, Cl, Sh) should be noted and families supported to seek SLP assessment if broader articulation concerns exist. Note: this domain covers verbal response only — written personal data is in F-5 (Prints Personal Data).",
  activities: [
    {
      id: "PD2-01",
      title: "What's My Name? (Attendance Game)",
      targetSkill: "First name, last name, middle name recall",
      ageRange: "2.5–5 years",
      audience: "educator",
      materials: "None",
      groupSize: "Small group or class",
      educatorVersion:
        "Take attendance as a structured name-learning activity. For a child who knows their first but not last name, say their full name when calling roll. Over successive weeks: Week 1 — call last name, child responds with first. Week 2 — call first name, child responds with last. Then add middle name once first and last are secure. This graduated approach teaches full name in a meaningful, repeated context without performance pressure.",
      parentVersion:
        "Practise your child's full name during everyday moments. When you call them for dinner, use their full name. Play 'What's your full name?' as a game — then swap: 'Now you say my full name!' Once first and last are solid, introduce middle name. Knowing their full name is an important safety skill.",
    },
    {
      id: "PD2-02",
      title: "Bounce and Name",
      targetSkill: "Full name recall; responsive listening",
      ageRange: "3–5 years",
      audience: "educator",
      materials: "Playground ball",
      groupSize: "Small group or class",
      educatorVersion:
        "Have children stand in a circle. Call a child's first name and bounce the ball to them. The child catches the ball and states their first and last name, then calls a classmate's first name and bounces the ball to them. Continue until all children have had a turn. Add middle names when ready. The physical action supports engagement and the bouncing rhythm provides a memory scaffold.",
      parentVersion:
        "Bounce a ball back and forth with your child. Each time you catch it, say your first name; each time they catch it, say theirs. Then try first and last names together. Make it faster and funnier as they get confident. Movement helps children remember.",
    },
    {
      id: "PD2-03",
      title: "Let's Jump In! (Birth Month Chant)",
      targetSkill: "Birth month recall; months of the year",
      ageRange: "4–6 years",
      audience: "educator",
      materials: "None",
      groupSize: "Small group or class",
      educatorVersion:
        "Have children stand in a circle. Go around and confirm each child's birth month, modelling if needed. Use the chant: 'Strawberry Shortcake, Huckleberry Finn / When you hear your birth month, you jump in!' Then recite the months of the year. Children jump in when they hear their month. Repeat with jumping out. Once comfortable, have children clap each month as they recite. Embeds birth month knowledge within a joyful, kinesthetic whole-group experience.",
      parentVersion:
        "Teach your child their birth month by making it part of a song or chant. Say the months of the year together and clap when you reach their special month. Talk about what happens in that month — the weather, any family celebrations — to help the month feel meaningful and memorable.",
    },
    {
      id: "PD2-04",
      title: "When's Your Birthday? (Calendar Activity)",
      targetSkill: "Birthday (day and month) recall; calendar concepts",
      ageRange: "4–6 years",
      audience: "educator",
      materials: "Large calendar; marker",
      groupSize: "Small group or class",
      educatorVersion:
        "Separate calendar pages and display on the wall. Ask each child their birthday, circle the date, and write the child's name. If a child is unsure, provide the date and have them repeat it. Acknowledge birthdays with a class song or handmade gift. On a child's birthday, have the class recite a birthday rhyme. The visual calendar embedding makes birthdays concrete and repeatedly revisited across the year.",
      parentVersion:
        "Display a calendar at home and circle your child's birthday with them. Talk about how many months/sleeps away it is. On their birthday, celebrate that this is their special date. Gradually introduce the day, month, and eventually the year — 'You were born on the 14th of March, 2020.'",
    },
    {
      id: "PD2-05",
      title: "How Old Are You? (Birthday Crown)",
      targetSkill: "Age and birth date recall",
      ageRange: "3–6 years",
      audience: "educator",
      materials:
        "Project paper; glue sticks; markers; stickers or decorative items; scissors; snack items",
      groupSize: "Small group or class",
      educatorVersion:
        "On a child's birthday, make a crown or badge with their date of birth (including year) and current age. Announce that their age has changed. Have the birthday child wear the crown. Reinforce the new age by counting out snack items matching their age. This creates a meaningful, celebratory context for learning age and birth date, and embeds the year of birth in a concrete and socially memorable moment.",
      parentVersion:
        "When your child's birthday arrives, make a simple crown or badge with their age and birthdate on it. Count out birthday candles together, count their age on fingers, and talk about what being this age means. Children learn their age best when it is tied to a meaningful, joyful experience.",
    },
    {
      id: "PD2-06",
      title: "My Little Town (Map Activity)",
      targetSkill: "Town/suburb name recall; community geography",
      ageRange: "4–6 years",
      audience: "educator",
      materials:
        "Printed maps of children's towns; project paper; markers, crayons, or coloured pencils; scissors; glue; bulletin board; tacks",
      groupSize: "Small group or class",
      educatorVersion:
        "Download and display a map of the local area on a bulletin board. Have children make small paper houses labelled with their names. Attach each house to its location on the map. If children live in different towns, display multiple maps. Discuss what makes up a town (school, shops, park, hospital). Builds geographic self-knowledge, print awareness (name labels), and community concepts.",
      parentVersion:
        "Walk or drive around your neighbourhood with your child and name the street you live on and the suburb or town. Point out landmarks: 'This is our street, this is the park near our house.' Familiarity with the name of your town and street is an important safety skill.",
    },
    {
      id: "PD2-07",
      title: "Our Town (Block Building)",
      targetSkill: "Community knowledge; spatial reasoning; collaborative play",
      ageRange: "4–6 years",
      audience: "educator",
      materials:
        "Toy building sets; small blocks; project paper; markers, crayons; scissors",
      groupSize: "Small group or class",
      educatorVersion:
        "Invite children to collaboratively build a model of their town using toy building sets and blocks. As they build, name and talk about each place: school, hospital, bank, post office, park. Add a block house for each child labelled with their name. When complete, have children describe places they go in their town. Supports community knowledge, collaborative play, spatial reasoning, and vocabulary.",
      parentVersion:
        "Build a pretend neighbourhood at home using blocks, boxes, and toy figures. Name each building after real places in your area. This is a playful way to build your child's understanding of their community and help them learn suburb/town concepts.",
    },
    {
      id: "PD2-08",
      title: "Pass the House (Street Address)",
      targetSkill: "Street address recall",
      ageRange: "4–6 years",
      audience: "educator",
      materials: "Paper or toy house; tape/CD player; music",
      groupSize: "Small group or class",
      educatorVersion:
        "Children sit in a circle and pass a paper or toy house while music plays. When the music stops, the child holding the house states their street address. If a child doesn't know, model the address and have them echo it. Continue until all children have had a turn. The music/object structure externalises the expectation and creates a low-pressure, repeated practice context for address recall.",
      parentVersion:
        "Practise your home address with your child regularly. Say it together as a chant or song. Play a game where they pretend to be a 'lost' child telling a helper where they live. Keep practising until it's automatic — knowing their address is a critical safety skill.",
    },
    {
      id: "PD2-09",
      title: "Who Lives Here? (Address Doors Bulletin Board)",
      targetSkill: "Street name and number recognition and recall",
      ageRange: "4–6 years",
      audience: "educator",
      materials:
        "Project paper; markers, crayons; glue; scissors; bulletin board; tacks; cut-out number sets",
      groupSize: "Small group or class",
      educatorVersion:
        "Create a bulletin board with door-shaped cards — each door has a child's address on the outside and their name inside. Point to a door and read the address aloud: 'Who lives here?' The child recognises their address, opens the door to confirm their name, then glues their cut-out street numbers to the outside of their door. This activity builds address recognition via interactive print-based play and supports name-address association.",
      parentVersion:
        "Make a pretend 'door' at home with your child's house number and street name on it. Stick it to a cardboard box or draw it on paper. Have your child practice reading their address off the 'door'. Seeing their address in print helps them memorise it.",
    },
    {
      id: "PD2-10",
      title: "Let Me Introduce You (Family Photo Display)",
      targetSkill: "Family member names; identity; language",
      ageRange: "3–6 years",
      audience: "educator",
      materials:
        "Family photographs (requested from home); labels or paper; glue; markers; scissors",
      groupSize: "Small group or class",
      educatorVersion:
        "Ask families to send in photos a few days in advance; have magazines or class photos as backup. Invite children to talk about their photos, name each family member, and tell something about them. Have children dictate captions ('This is my sister Ellie'). Display on a bulletin board with captions. Builds family vocabulary, identity, sentence structure, and the understanding that print carries personal meaning. Sensitive to diverse family structures.",
      parentVersion:
        "Look at family photos together with your child and name each person. Ask: 'Who is this? What do they like to do? What do you love about them?' Make a simple family photo book together. This builds your child's vocabulary, identity, and the ability to talk about the important people in their life.",
    },
    {
      id: "PD2-11",
      title: "Phone Home (Telephone Number Practice)",
      targetSkill: "Telephone number recall including area code",
      ageRange: "5–7 years",
      audience: "both",
      materials:
        "Out-of-service mobile phone or cordless phone; tape/CD player; music",
      groupSize: "Small group or class",
      educatorVersion:
        "Children sit in a circle passing a phone while music plays. When the music stops, the child holding the phone says their phone number and presses the digits to 'call' home. Prompt children who forget — say the number and have them echo it. Ensure children learn their area code as part of the number. Continue until all children have had a turn. Teaching note: break the number into manageable chunks (first part/second part, then full number).",
      parentVersion:
        "Teach your child your mobile number in chunks — first the area code, then three digits, then the last four. Practise daily in the car or at dinner. Let them 'dial' your number on an old phone. Knowing a parent's phone number by heart is a key safety skill, especially if your child is ever lost.",
    },
    {
      id: "PD2-12",
      title: "Ring the Bell (Phone Number Bulletin Board)",
      targetSkill: "Telephone number recall; numeral recognition",
      ageRange: "5–7 years",
      audience: "educator",
      materials:
        "Project paper; markers; string or ribbon; bulletin board; tacks; sets of plastic numerals; a bell",
      groupSize: "Small group or class",
      educatorVersion:
        "Create a telephone bulletin board: make a large phone base in the centre; cut one receiver per child with their name and phone number (including area code) written on it. Connect receivers to the base with string. Give each child plastic numerals and ask them to assemble their family's phone number (referencing their receiver if needed). When a child knows their number independently, they ring the bell to celebrate. The bell provides positive reinforcement for mastery.",
      parentVersion:
        "Write your phone number on a card for your child to carry in their bag and practise from. Use plastic fridge magnets or written cards to practise putting the numbers in order. Celebrate when they can say it independently — make it feel like a big deal because it is!",
    },
    {
      id: "PD2-13",
      title: "Help Me Find My Way Home (Role Play)",
      targetSkill:
        "Name, age, address, and telephone number recall; emergency preparedness",
      ageRange: "4–6 years",
      audience: "both",
      materials: "None (or puppets as variation)",
      groupSize: "Small group or class",
      educatorVersion:
        "Show children images of police officers and discuss their role in helping lost children. Explain that an officer might ask: name, age, address, phone number, caregiver's name. Divide into pairs: one child is the officer, one is the 'lost' child. After the exchange, have children switch roles. Extension: arrange a visit from a local police officer. Variation: use puppets. Builds personal data recall in a safety-relevant, meaningful scenario and demystifies helpful authority figures.",
      parentVersion:
        "Role-play 'I'm lost' scenarios with your child. You be the kind helper who asks: 'What's your name? How old are you? Where do you live? What is your mum/dad's phone number?' Take turns. Talk about who children can ask for help if lost — a police officer, a parent with children, a shop worker. Frame helpers as safe and kind.",
    },
    {
      id: "PD2-14",
      title: "Reporting a Fire (Emergency Number Practice)",
      targetSkill: "Emergency contact knowledge; address recall under pressure",
      ageRange: "5–7 years",
      audience: "both",
      materials:
        "Two disconnected telephones (mobile phones, toy phones, or cordless phones)",
      groupSize: "Small group or class",
      educatorVersion:
        "Give pairs a label showing '000'. Have children practise pressing the numerals. Assign roles: one child is the 000 operator, one reports a fire. Discuss what the operator asks: name, address, what the problem is, whether anyone is hurt. Have children enact the scenario, then swap. Remind children not to call 000 on a real phone unless there is a real emergency. Extension: arrange a visit from a local firefighter. Teaches emergency number, address recall, and calm information provision under a simulated high-stakes scenario.",
      parentVersion:
        "Teach your child that 000 is Australia's emergency number (police, fire, ambulance). Practise saying it. Role-play a fire scenario: 'If there was a fire and you needed to call 000, what would you say?' Help them practise saying their name and address clearly. Remind them this number is only for real emergencies.",
    },
    {
      id: "PD2-15",
      title: "Star of the Week",
      targetSkill:
        "Personal data sharing; self-knowledge; identity; expressive language",
      ageRange: "4–6 years",
      audience: "educator",
      materials:
        "Roll of newsprint or wrapping paper; project paper; markers, crayons, coloured pencils; large flip chart; tape",
      groupSize: "Individual (rotating across class)",
      educatorVersion:
        "Schedule each child as 'Star of the Week' across the year. Days before their week, send a note home asking the child to bring favourite items (toy, photos, food to share). On their first day as Star: trace the child's outline on large paper; have them decorate it with pictures of favourite things; have classmates interview the star ('Do you have pets? What is their name?'). Record responses on the outline and display. Builds personal identity, expressive language, confidence, peer interest in one another, and multiple personal data skills in a rich, celebratory context.",
      parentVersion:
        "Create your own 'Star of the Week' at home for each child in your family. Let them decorate a poster about themselves — their name, age, birthday, favourite things, family. Display it on the fridge. This builds identity, pride, and personal data knowledge in a warm, family-centred way.",
    },
  ],
},

  selfHelpSkills: {
  iiedItem: "INFERRED — verify against IED III record form",
  domain: "Physical Health and Development: Health Status and Practices",
  clinicalNote:
    "Self-help skills acquisition is closely dependent on fine-motor development, opportunity, and family practice patterns. Typical sequence: undressing before dressing; large fasteners before small; front fasteners before back. Key milestones: undresses independently ~3y; dresses with minimal supervision ~4y; manages all front fasteners ~5y; ties shoelaces ~6y. Significantly delayed self-care skills relative to the developmental sequence (particularly when combined with fine-motor concerns) may indicate DCD, low muscle tone, sensory processing difficulties, or limited opportunity. The backward-chaining approach is an evidence-supported instructional strategy for skill acquisition in this domain. Note: privacy and bodily autonomy must be explicitly respected during all dressing-related activities.",
  activities: [
    {
      id: "SH-01",
      title: "It's Time to Put My Jacket On! (Flip Method)",
      targetSkill: "Putting on outerwear independently",
      ageRange: "3–5 years",
      audience: "both",
      materials: "A coat or jacket per child; clean, smooth floor surface",
      groupSize: "Individual, small group, or class",
      educatorVersion:
        "Have each child lay their jacket flat on the floor, front side up, with sleeves out to the sides. Have the child open the jacket, then lie on their back on top of it with their neck at the collar. Arms go into sleeves one at a time. Child sits up — the jacket is on. Congratulate and celebrate. This 'flip method' is highly effective for children who struggle with overhead or behind-the-back manipulation — it removes the motor complexity of having to position the jacket from behind.",
      parentVersion:
        "Teach your child the 'magic jacket trick': lay the jacket on the floor front-up, neck away from your child. Your child stands at the collar end, bends, puts both arms into the sleeves, then flips it over their head. Most children love this trick and find it much easier than the traditional method. Practise at home before school mornings.",
    },
    {
      id: "SH-02",
      title: "It's Time to Get Dressed! (Partner Relay)",
      targetSkill: "Dressing and undressing; cooperation; sequencing",
      ageRange: "4–6 years",
      audience: "educator",
      materials:
        "Several sets of oversized clothing (pants, shirt, coat) large enough for children to pull over their own clothes",
      groupSize: "Small group or class (pairs)",
      educatorVersion:
        "Divide into pairs. Partner A helps Partner B dress and undress in oversized clothing using verbal cues. Switch roles. Then run a relay race: pairs race to their team's clothing pile, dress one partner as fast as possible, undress again, return clothes to pile, and tag the next pair. Builds dressing sequencing, cooperative communication, motor planning, and a playful, low-pressure context for practising clothing skills.",
      parentVersion:
        "Make dressing practice fun by setting a timer: 'How fast can you put on your jumper?' or play a 'dress-up relay' at home where you put on a big jumper and then take it off and pass it to the next player. Turning dressing practice into a game removes the frustration and makes it enjoyable.",
    },
    {
      id: "SH-03",
      title: "Button Me Up!",
      targetSkill: "Buttoning (front, large buttons)",
      ageRange: "3–5 years",
      audience: "educator",
      materials: "Oversized shirts with large front buttons (one per pair)",
      groupSize: "Small group or class (pairs)",
      educatorVersion:
        "Have children form pairs. Designate one child as the 'wearer' (wears the shirt backwards, buttons facing outward at the back) and the other as the 'buttoner' (stands behind and buttons the shirt). Swap roles. Extension: use this whenever children need to put on art smocks. Buttoning another person's garment is motorically easier than self-buttoning and builds the finger dexterity and conceptual understanding needed before the child buttons on themselves. Start with large buttons and large buttonholes.",
      parentVersion:
        "Let your child practise buttoning on a large-button shirt or cardigan. Teach them to hold the button with thumb and index finger, hold the buttonhole open with the other hand, and slide the button through sideways. Start with large buttons and celebrate every success — even uneven buttons are a real achievement. Keep practice short and positive.",
    },
    {
      id: "SH-04",
      title: "Zip It! (Snack Bags)",
      targetSkill: "Zipping (one-piece zipper); fine motor coordination",
      ageRange: "3–5 years",
      audience: "both",
      materials:
        "Sandwich-size zip-lock storage bags (one per child); healthy snack items",
      groupSize: "Small group or class",
      educatorVersion:
        "Give each child a pre-zipped bag and a small snack. Have them unzip the bag, place their snack inside, and zip it closed. At snack time, they unzip the bag and enjoy. This is an excellent entry-level zipper activity because zip-lock bags have no teeth alignment issue — they illustrate the sealing principle before moving to clothing zippers. Builds finger pinch strength, hand coordination, and functional independence.",
      parentVersion:
        "Let your child zip and unzip their own lunch bags at home before expecting them to manage jacket zippers. Give them a small bag with a snack inside and ask them to 'keep it safe' by zipping it up. This builds the muscle and coordination needed for clothing zippers.",
    },
    {
      id: "SH-05",
      title: "Which Foot Goes Where? (Foot Tracing)",
      targetSkill: "Putting shoes on the correct feet; spatial orientation",
      ageRange: "3–5 years",
      audience: "both",
      materials:
        "Project paper; pencils; scissors; markers",
      groupSize: "Individual, small group, or class",
      educatorVersion:
        "Help children trace around their shoes and then their bare feet. Have them cut out each tracing and match foot tracings to shoe tracings, then to their own bare feet. Invite them to decorate paper shoes and draw laces. Follow-up: place stickers or dots on the facing (inner) sides of the child's shoes to provide an ongoing visual cue — the stickers should line up when shoes are on the correct feet. Addresses the underlying spatial concept (the arch and toe alignment) rather than just providing a rule.",
      parentVersion:
        "Help your child trace their feet on two pieces of paper and cut them out. Place the paper feet on the floor and have your child match their real feet to the tracings. Talk about which shoe is for which foot. You can also put a small sticker on the inside edge of each shoe — when the stickers face each other, the shoes are on the right feet!",
    },
    {
      id: "SH-06",
      title: "Shoe Scramble",
      targetSkill: "Left/right shoe discrimination; shoe placement",
      ageRange: "3–5 years",
      audience: "both",
      materials: "Child's own shoes",
      groupSize: "Individual",
      educatorVersion:
        "Have the child remove their shoes. Mix them up out of sight and place them in front of the child. Challenge them to identify which shoe goes on which foot, then put them on. If on the wrong feet, prompt reflection: 'How do your feet feel? Stand up and look down — how can you tell they might be on the wrong feet?' This teaches discrimination through proprioceptive feedback rather than a rule to memorise.",
      parentVersion:
        "Once a week, hide your child's shoes behind your back, then put them on the floor mixed up. Can they figure out which goes on which foot without help? If they get it wrong, ask 'Does that feel comfortable?' and see if they can self-correct. Praise the attempt regardless of the outcome.",
    },
    {
      id: "SH-07",
      title: "Sort the Shoes!",
      targetSkill: "Left/right discrimination; sorting; matching",
      ageRange: "4–6 years",
      audience: "both",
      materials: "Four or five pairs of old shoes (mixed up)",
      groupSize: "Individual or small group",
      educatorVersion:
        "Mix up 4–5 pairs of old shoes and have children sort all right-foot shoes into one pile and left-foot shoes into another, then find and match each pair. This activity builds the spatial discrimination needed to reliably place shoes on the correct feet, and can be done as a game or centre activity without performance pressure.",
      parentVersion:
        "Put several pairs of old shoes in a pile and ask your child to sort them into left-foot shoes and right-foot shoes, then find the matching pairs. Make it a game: 'Beat the clock!' This builds the left/right discrimination children need before consistently getting their own shoes on the right feet.",
    },
    {
      id: "SH-08",
      title: "This Is the Way We Brush Our Teeth! (Self-Care Song)",
      targetSkill: "Self-care routines; body awareness; sequencing",
      ageRange: "3–5 years",
      audience: "both",
      materials: "None",
      groupSize: "Individual, small group, or class",
      educatorVersion:
        "Brainstorm with children all the things they do to care for themselves (brush teeth, wash hands, brush hair, put on clothes, make a snack). Sing each one to the tune of 'Here We Go Round the Mulberry Bush' ('This is the way we brush our teeth…'). Invite a volunteer to lead the class in acting out each verse. Extend: use the song to signal transitions ('This is the way we pick up toys…'). Embeds self-care vocabulary and routine sequencing in a motivating, kinesthetic format.",
      parentVersion:
        "Sing self-care tasks to the tune of 'Here We Go Round the Mulberry Bush' during your morning or bedtime routine: 'This is the way we brush our teeth, brush our teeth, brush our teeth…' Acting it out together makes routines more engaging and helps your child learn the sequence. Add your own family's steps.",
    },
    {
      id: "SH-09",
      title: "I Spy Something to Clean Up!",
      targetSkill: "Pack-up routines; independence; environmental awareness",
      ageRange: "3–6 years",
      audience: "educator",
      materials: "None",
      groupSize: "Individual, small group, or class",
      educatorVersion:
        "Before cleaning up, have children sit in a circle. Give I Spy clues for items that need to be put away: 'I spy something to pick up that is round and blue.' Children look around, raise their hand, name the object, and return it to its place. Continue until the room is tidy. Extension: invite volunteers to be the 'teacher' and lead the I Spy game. This transforms clean-up from a chore into an engaging observational game, building environmental awareness, listening, and pack-up independence.",
      parentVersion:
        "Turn clean-up time into an 'I Spy' game: 'I spy something that belongs in the toy box that is yellow and soft.' Your child finds and puts away the item. Taking turns giving clues keeps it fun. Children are far more willing to pack up when it feels like a game rather than a chore.",
    },
    {
      id: "SH-10",
      title: "Can You Help Me? (Asking for Help)",
      targetSkill:
        "Help-seeking; self-advocacy; cooperation; problem identification",
      ageRange: "3–6 years",
      audience: "both",
      materials: "None",
      groupSize: "Pairs, small group, or class",
      educatorVersion:
        "Brainstorm with children times they have needed help at home or school. Act out a task (e.g. trying to tie shoelaces) and have children guess the action, then discuss whether it is hard. Ask 'What can you do when you can't do it yourself?' Prompt: ask a friend, then a teacher. Divide into pairs: each child identifies something they find difficult and practises asking their partner: 'Can you help me zip up my jacket?' Partners practise the skill together. Builds help-seeking language, which is a foundational self-advocacy skill for school.",
      parentVersion:
        "Teach your child it is okay and smart to ask for help. Practise the words: 'Can you please help me?' or 'I'm not sure how to do this — can you show me?' When they are stuck and frustrated, prompt them to use these words before jumping in to help them. The skill of asking for help is as important as the self-help skill itself.",
    },
    {
      id: "SH-11",
      title: "Time for Snacks! (Pouring, Spooning, Forking)",
      targetSkill: "Utensil use; fine motor; independence at meals",
      ageRange: "3–5 years",
      audience: "educator",
      materials:
        "Plastic spoons, forks, paper cups and plates; yoghurt or fruit snacks; banana or strawberry slices; juice in a lightweight jug",
      groupSize: "Individual, small group, or class",
      educatorVersion:
        "Three graduated activities: (1) Children take turns pouring a small amount of juice from a lightweight jug into their own cup — drink without a straw. (2) Give each child a spoon and yoghurt or fruit snack; model grip and have them copy. (3) Give each child a fork and banana slices; model grip and have them copy. These sequential activities build functional utensil skills, hand strength, and mealtime independence in a supportive, low-stakes snack context.",
      parentVersion:
        "Involve your child in preparing and serving their own snacks. Let them pour their own drink from a small jug, scoop their own yoghurt, and use a fork for soft fruit. These everyday tasks build the fine motor skills and independence they need for school mealtimes. Expect spills — they are part of learning.",
    },
    {
      id: "SH-12",
      title: "Show Me, Tell Me! (Safety Rules Role Play)",
      targetSkill: "Safety rule knowledge; civic understanding; self-care",
      ageRange: "4–6 years",
      audience: "both",
      materials: "None",
      groupSize: "Individual, small group, or class",
      educatorVersion:
        "Invite children to sit in a circle and brainstorm safety rules from home, school, and the community. One volunteer thinks of a rule to act out (e.g. looking both ways before crossing the road; putting on a seatbelt; lining up for a fire drill). The class guesses the rule and discusses why it matters. Continue with other volunteers. This activity builds health literacy, safety awareness, and civic understanding in an active, peer-learning format.",
      parentVersion:
        "Ask your child to show you a safety rule they know — how to cross the road, what to do in a fire drill, how to wear a seatbelt. Praise them for knowing it and talk about why the rule keeps them safe. Occasionally introduce a new safety rule and practise it together. Children who understand the 'why' follow rules more reliably.",
    },
  ],
}

  }

};

// =============================================================================
// EXPORT
// =============================================================================

// Node.js / CommonJS
if (typeof module !== "undefined" && module.exports) {
  module.exports = { briganceActivities, briganceRouter, briganceDomainIndex };
}

// Browser global (GitHub Pages)
if (typeof window !== "undefined") {
  window.briganceActivities = briganceActivities;
  window.briganceRouter = briganceRouter;
  window.briganceDomainIndex = briganceDomainIndex;
}
