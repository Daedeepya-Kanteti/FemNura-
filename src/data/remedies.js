/**
 * FemNura Evidence-Based Remedy & Comfort Knowledgebase
 * 
 * Sources & Clinical Guidelines referenced:
 * - American College of Obstetricians and Gynecologists (ACOG) Clinical Practice Guidelines
 * - Cleveland Clinic Women's Health & Wellness Evidence Summaries
 * - Mayo Clinic Primary Care & Home Therapeutics
 * - NHS Evidence Summaries on Menstrual Health and Symptom Self-Care
 * - National Center for Complementary and Integrative Health (NCCIH)
 */

export const SYMPTOM_REMEDIES = {
  cramps: {
    title: "Menstrual Cramps (Dysmenorrhea) Relief",
    category: "Physical Comfort",
    clinicalRationale:
      "Uterine cramping is caused by prostaglandins triggering myometrial contractions and transient ischemia. Continuous heat therapy and antispasmodic compounds relax smooth muscle tone.",
    evidenceSource: "ACOG Clinical Practice Guideline No. 345 & Cochrane Review on Heat for Dysmenorrhea",
    immediateAction: [
      "Apply a heating pad or hot water bottle (approx 40°C / 104°F) across the lower abdomen or sacrum for 15-20 minutes. Clinical trials indicate continuous heat is as effective as oral ibuprofen for primary cramps.",
      "Lie in Child's Pose (Balasana) with knees apart and abdomen resting forward to gently lengthen pelvic floor musculature and reduce lumbosacral tension.",
      "Perform gentle circular lower-abdominal effleurage (clockwise massage with light pressure) using diluted lavender or clary sage oil.",
    ],
    nutritionHerbal: [
      "Sip warm chamomile or fresh ginger tea (gingerols block cyclooxygenase enzymes similar to mild NSAIDs).",
      "Consume magnesium-rich foods (pumpkin seeds, dark leafy greens, or dark chocolate >70%) to support neuromuscular relaxation.",
      "Stay well-hydrated with warm water; dehydration exacerbates pelvic vasoconstriction and muscle cramping.",
    ],
    whenToSeekCare:
      "Seek medical evaluation if cramping is accompanied by high fever, sudden unmanageable pain, foul-smelling vaginal discharge, or pain that progressively worsens year after year (potential indicator of endometriosis or fibroids).",
  },

  fatigue: {
    title: "Fatigue & Low Energy Recovery Protocol",
    category: "Energy & Vitality",
    clinicalRationale:
      "Fatigue in women frequently reflects hormonal fluctuations, subclinical dehydration, iron stores depletion (low ferritin), or cortisol dysregulation.",
    evidenceSource: "Mayo Clinic Clinical Review on Unexplained Female Fatigue & Harvard Health Publishing",
    immediateAction: [
      "Take a 15-to-20 minute Non-Sleep Deep Rest (NSDR) or Yoga Nidra session. Avoid deep naps over 30 minutes to prevent sleep inertia and circadian disruption.",
      "Step outside for 5-10 minutes of direct natural sunlight into your visual field to stimulate cortisol awakening and dopamine synthesis.",
      "Perform gentle neck rolls and shoulder shrugs followed by 5 deep diaphragmatic breaths to oxygenate tissues.",
    ],
    nutritionHerbal: [
      "Drink a large glass (300-500ml) of room-temperature water with a pinch of unrefined sea salt or electrolytes; mild dehydration mimics acute exhaustion.",
      "Pair complex carbohydrates with protein (e.g., a handful of walnuts with an apple, or hummus with seeded crackers) to eliminate reactive hypoglycemia spikes.",
      "If fatigue persists across cycles, ask your physician to evaluate serum ferritin, vitamin D3, and TSH (thyroid panel).",
    ],
    whenToSeekCare:
      "Consult a doctor promptly if fatigue is accompanied by unexplained weight loss, heart palpitations, shortness of breath on mild exertion, or swollen lymph nodes.",
  },

  headache: {
    title: "Tension & Hormonal Headache Soothing Protocol",
    category: "Neurological & Vascular",
    clinicalRationale:
      "Tension headaches involve pericranial muscle contraction, while menstrual/hormonal headaches stem from estrogen withdrawal modulating trigeminovascular pain pathways.",
    evidenceSource: "American Headache Society Guidelines & Cleveland Clinic Neurological Institute",
    immediateAction: [
      "Rest in a quiet, darkened room for 15 minutes. Blue light from screens significantly amplifies trigeminal photophobia.",
      "Apply a cold gel pack across your forehead or temples, paired with a warm compress on the back of your neck to balance cranial blood flow.",
      "Acupressure: Apply firm, circular pressure on the LI4 (Hegu) acupressure point on the web between your thumb and index finger for 2-3 minutes per hand.",
    ],
    nutritionHerbal: [
      "Slowly hydrate with 400ml of cool water or electrolyte infusion; dehydration is the primary non-hormonal trigger of tension headaches.",
      "A small cup of warm green tea or diluted peppermint infusion can ease cephalic vasoconstriction.",
      "Dab a drop of diluted peppermint essential oil onto the temples and occiput (avoid contact with eyes).",
    ],
    whenToSeekCare:
      "Seek emergency care if you experience a sudden 'thunderclap' headache, headache with stiff neck and high fever, visual aura lasting over 60 minutes, speech difficulty, or motor weakness.",
  },

  bloating: {
    title: "Abdominal Bloating & Gas Relief",
    category: "Gastrointestinal Comfort",
    clinicalRationale:
      "Elevated progesterone during the luteal phase slows gastrointestinal transit time, leading to delayed gastric emptying, fluid retention, and trapped intestinal gas.",
    evidenceSource: "American College of Gastroenterology (ACG) & Monash University FODMAP Clinical Research",
    immediateAction: [
      "Perform the 'Wind-Relieving Pose' (Pawanmuktasana): Lie on your back and hug both knees to your chest for 1-2 minutes, rocking side-to-side to facilitate gas clearance.",
      "Take a gentle, slow-paced 10-15 minute walk. Mild upright ambulation stimulates peristaltic contractions without abdominal strain.",
      "Loosen constrictive waistbands or tight clothing around the epigastrium and lower abdomen.",
    ],
    nutritionHerbal: [
      "Brew fresh peppermint or crushed fennel seed tea; menthol and anethole act as natural carminatives that relax intestinal smooth muscles.",
      "Avoid carbonated beverages, chewing gum, and artificial sweeteners (sorbitol, mannitol) that produce osmotic gas.",
      "Temporarily prioritize cooked, easily digestible foods (squash, basmati rice, steamed carrots) over raw cruciferous vegetables.",
    ],
    whenToSeekCare:
      "Consult your doctor if bloating is continuous, accompanied by severe abdominal tenderness, persistent vomiting, unintended weight loss, or changes in bowel habits lasting >2 weeks.",
  },

  nausea: {
    title: "Nausea & Gastric Distress Calming",
    category: "Digestive & Autonomic",
    clinicalRationale:
      "Gastric dysrhythmia and vestibular/vagal sensitivity can be modulated via thermoregulation, gastric mucosal soothing, and central antiemetic gingerol pathways.",
    evidenceSource: "ACOG Practice Bulletin on Nausea in Women & Cochrane Reviews on Zingiberaceae",
    immediateAction: [
      "Press the P6 (Neiguan) acupressure point: Place three fingers below your wrist crease between the two central tendons and apply firm pressure for 2 minutes while breathing slowly.",
      "Sit upright or recline at a 45-degree angle. Lying completely flat allows gastric juices to irritate the gastroesophageal junction.",
      "Breathe cool, fresh air by opening a window or inhaling the scent of fresh cut lemon peel.",
    ],
    nutritionHerbal: [
      "Sip warm or iced ginger tea made from steeped fresh ginger root (shown to accelerate gastric emptying and attenuate nausea receptors).",
      "Nibble on dry, neutral crackers or dry toast to absorb excess gastric acids without stimulating digestive bile.",
      "Avoid rich, oily, spicy, or strongly scented foods for the next 4-6 hours.",
    ],
    whenToSeekCare:
      "Seek immediate medical attention if unable to retain fluids for over 12 hours, signs of dehydration occur (very dark urine, dizziness upon standing), or vomit contains blood or coffee-ground material.",
  },

  "back pain": {
    title: "Lumbar & Lower Back Ache Relief",
    category: "Musculoskeletal",
    clinicalRationale:
      "Lumbar aches during periods or long work hours reflect referred pain via the presacral nerve plexus, combined with prolonged static posture.",
    evidenceSource: "American College of Physicians Clinical Practice Guideline for Low Back Pain",
    immediateAction: [
      "Apply gentle localized heat (heating pad or warm towel) to the lower back for 15-20 minutes to relieve paraspinal muscle spasms.",
      "Cat-Cow Stretch: Move onto all fours on a padded mat. Inhale, gently dropping the belly (Cow); exhale, arching the spine upwards (Cat). Repeat 8-10 slow cycles.",
      "If sleeping or resting, place a pillow between your knees (if on your side) or under your knees (if on your back) to decompress the lumbar spine.",
    ],
    nutritionHerbal: [
      "Turmeric and ginger warm golden milk (with black pepper for piperine absorption) provides natural anti-inflammatory polyphenols.",
      "Avoid heavy lifting or prolonged sitting without taking a 60-second spinal elongation break every 45 minutes.",
    ],
    whenToSeekCare:
      "Contact a doctor immediately if back pain radiates down both legs, causes numbness or tingling in the groin/saddle area, or is accompanied by sudden bladder or bowel incontinence.",
  },

  "breast tenderness": {
    title: "Hormonal Breast Tenderness (Mastalgia) Soothing",
    category: "Endocrine & Tissue Care",
    clinicalRationale:
      "Cyclic mastalgia is driven by progesterone and estrogen stimulating ductal proliferation, water retention, and micro-edema in breast tissue during the luteal phase.",
    evidenceSource: "ACOG Guidelines on Benign Breast Conditions & Cleveland Clinic",
    immediateAction: [
      "Switch immediately to a supportive, seamless, non-underwire cotton bra or gentle sports crop top to minimize motion and Cooper's ligament strain.",
      "Apply a cool gel pack or room-temperature compress wrapped in a towel for 10-15 minutes across the chest wall.",
      "Avoid high-impact jumping or intense upper-body resistance training until tissue inflammation subsides.",
    ],
    nutritionHerbal: [
      "Significantly cut back on caffeine and high-sodium foods for 48 hours; methylxanthines in coffee can aggravate benign breast cyst tenderness in sensitive individuals.",
      "Incorporate 1-2 tablespoons of freshly ground flaxseed into meals (rich in lignans that gently modulate circulating estrogen balance).",
    ],
    whenToSeekCare:
      "Consult a doctor if you detect a new discrete lump, skin dimpling, nipple inversion, or spontaneous bloody or clear nipple discharge.",
  },

  insomnia: {
    title: "Restorative Sleep & Insomnia Reset",
    category: "Circadian & Neuro-rest",
    clinicalRationale:
      "Sleep disruptions during hormone shifts stem from reduced GABAergic activity, nighttime body temperature fluctuations, or elevated evening sympathetic tone.",
    evidenceSource: "National Sleep Foundation & American Academy of Sleep Medicine",
    immediateAction: [
      "Practice 4-7-8 Parasympathetic Breathing: Inhale through the nose for 4 seconds, hold for 7 seconds, exhale slowly through the mouth for 8 seconds. Repeat 4 cycles to stimulate the vagus nerve.",
      "Keep bedroom temperature cool (around 18-19°C / 65-67°F) to support natural nocturnal thermoregulation drop.",
      "If awake for more than 20 minutes, leave the bed. Sit in dim light with a physical book until drowsiness returns.",
    ],
    nutritionHerbal: [
      "Sip warm passionflower, lemon balm, or chamomile tea 45 minutes before sleep.",
      "Incorporate a small handful of raw almonds or pumpkin seeds (rich in magnesium glycinate and tryptophan).",
      "Avoid screens, bright overhead lights, and caffeine after 2:00 PM.",
    ],
    whenToSeekCare:
      "Consult a healthcare professional if chronic insomnia lasts longer than 3 weeks and severely impacts daytime cognitive function, mood, or driving safety.",
  },

  dizziness: {
    title: "Lightheadedness & Dizziness Stabilization",
    category: "Hemodynamic Support",
    clinicalRationale:
      "Lightheadedness in reproductive-aged women is commonly linked to orthostatic hypotension, transient hypoglycemia, or low ferritin levels.",
    evidenceSource: "Cleveland Clinic Orthostatic Hypotension Reviews & Mayo Clinic Guidelines",
    immediateAction: [
      "Sit or lie down immediately with your feet elevated on pillows above heart level to restore cerebral venous return.",
      "Do not stand up rapidly. When rising, sit on the edge of the bed or chair for 60 seconds first to allow vascular autoregulation.",
      "Take slow, steady breaths through your nose to avoid hyperventilation-induced cerebral vasoconstriction.",
    ],
    nutritionHerbal: [
      "Drink 300-400ml of room-temperature water with a pinch of salt or electrolyte powder.",
      "Have a small balanced snack with fast and slow carbs (such as a banana with peanut butter).",
    ],
    whenToSeekCare:
      "Seek emergency medical evaluation if dizziness is accompanied by chest tightness, fainting (syncope), speech slurring, facial drooping, or double vision.",
  },

  "joint pain": {
    title: "Joint & Muscular Ache Protocol",
    category: "Musculoskeletal & Systemic",
    clinicalRationale:
      "Estrogen fluctuation modulates synovial fluid viscosity and pain threshold. Relaxin and prostaglandin synthesis can also cause temporary ligament laxity.",
    evidenceSource: "Arthritis Foundation & Harvard Medical School Musculoskeletal Health",
    immediateAction: [
      "Take a warm Epsom salt (magnesium sulfate) bath or warm shower for 15 minutes to ease periarticular stiffness.",
      "Engage in non-weight-bearing gentle mobility (gentle ankle circles, wrist flexions, seated hip openers).",
      "Apply cold packs for acute joint heat/swelling, or warm packs for chronic muscle stiffness.",
    ],
    nutritionHerbal: [
      "Incorporate omega-3 fatty acids (flaxseeds, chia seeds, walnuts) to reduce systemic inflammatory cytokines.",
      "Sip warm ginger-turmeric tea sweetened with a small drop of honey.",
    ],
    whenToSeekCare:
      "See a physician if any joint is visibly hot to the touch, red, swollen, or if you develop a morning joint stiffness lasting longer than 45 minutes.",
  },

  "skin changes": {
    title: "Hormonal Skin & Blemish Soothing",
    category: "Dermatological & Barrier Health",
    clinicalRationale:
      "Luteal phase androgen relative excess stimulates sebaceous gland hyper-secretion and follicular hyperkeratinization.",
    evidenceSource: "American Academy of Dermatology (AAD) Clinical Guidelines on Adult Female Acne",
    immediateAction: [
      "Do not pick, squeeze, or apply aggressive scrubbing to inflamed pores. This increases post-inflammatory erythema and deep dermal scarring.",
      "Apply a cool, clean compress with diluted green tea (epigallocatechin gallate has topical anti-androgenic and soothing properties).",
      "Use a minimalist, fragrance-free, gentle ceramide cleanser and non-comedogenic hydration.",
    ],
    nutritionHerbal: [
      "Drink spearmint tea: Clinical trials demonstrate 2 cups daily helps reduce mild androgen-driven breakouts.",
      "Reduce high-glycemic-index processed sugars and cow's milk dairy for 5-7 days to calm insulin-like growth factor 1 (IGF-1) sebum spikes.",
    ],
    whenToSeekCare:
      "Consult a dermatologist if you experience deep, painful cystic nodules, sudden onset of widespread rash, or facial swelling.",
  },

  "low appetite": {
    title: "Gentle Nourishment & Appetite Restoring",
    category: "Nutritional & Metabolic",
    clinicalRationale:
      "Stress-induced sympathetic dominance or hormonal nausea suppresses ghrelin signaling, causing temporary appetite blunting.",
    evidenceSource: "Academy of Nutrition and Dietetics Clinical Recommendations",
    immediateAction: [
      "Do not force large heavy meals. Switch to 'nutrient-dense micro-meals' every 2-3 hours.",
      "Drink a warm, soothing bone broth or mineral-rich vegetable miso soup to stimulate salivary and digestive enzymes.",
      "Take a 5-minute pre-meal mindfulness breathing break to activate parasympathetic digestive tone.",
    ],
    nutritionHerbal: [
      "Sip warm ginger or peppermint water with a squeeze of fresh lemon 15 minutes before attempting small solid food intake.",
      "Choose smooth, easily swallowable foods: avocado smoothie, banana-oat porridge, or creamy lentil soup.",
    ],
    whenToSeekCare:
      "Consult a doctor if appetite loss lasts over a week, causes unintentional weight loss, or is accompanied by difficulty swallowing or persistent fever.",
  },
};

export const MOOD_REMEDIES = {
  Low: {
    title: "Low Energy & Down Mood Comfort Protocol",
    clinicalRationale:
      "Low mood during cycle shifts often reflects sudden estrogen or progesterone drops affecting central serotonin and endorphin availability.",
    evidenceSource: "American Psychological Association & Harvard Health Women's Mental Health",
    immediateAction: [
      "Micro-Behavioral Activation: Choose one tiny, 2-minute manageable action (e.g., wash your face with warm water, open the curtains, or change into fresh clothing). Small completions stimulate subtle dopamine release.",
      "Step into natural daylight for 10 minutes. Natural photons stimulate retinal ganglion cells, boosting serotonin synthesis.",
      "Practice self-compassion: Remind yourself that hormonal drops create biological mood fluctuations that are temporary and not personal failures.",
    ],
    nutritionHerbal: [
      "Enjoy a warm cup of cacao or dark chocolate (>70%), rich in theobromine and magnesium for gentle neurological lift.",
      "Sip holy basil (Tulsi) or lemon balm tea to gently soothe cortisol receptors.",
    ],
    whenToSeekCare:
      "If feelings of persistent despair, hopelessness, or thoughts of self-harm occur, reach out immediately to your doctor or emergency mental health crisis services (Call/Text 988 or local emergency services).",
  },

  Irritable: {
    title: "Irritability & Emotional Tension Decompression",
    clinicalRationale:
      "Luteal phase allopregnanolone drops trigger temporary amygdala hyper-reactivity and reduced prefrontal inhibition.",
    evidenceSource: "Cleveland Clinic Behavioral Health & North American Menopause Society",
    immediateAction: [
      "Sensory Decompression (Sensory Fast): Step into a quiet, dim room. Turn off notifications and close your eyes for 5 minutes.",
      "Physiological Sigh: Inhale deeply through your nose, take a second quick sip of air at the top, then release a long, slow sigh out through your mouth. Repeat 3 times to immediately lower heart rate.",
      "Splash cold water on your face to trigger the mammalian dive reflex and down-regulate sympathetic arousal.",
    ],
    nutritionHerbal: [
      "Drink a glass of cold water with a squeeze of fresh lime.",
      "Avoid quick sugary snacks and caffeine; stimulant spikes heighten emotional volatility during sensitive cycle windows.",
    ],
    whenToSeekCare:
      "If irritability causes uncontrollable rage, relationship disruption, or severe premenstrual dysphoric disorder (PMDD) symptoms, consult your gynecologist or psychiatrist.",
  },

  Neutral: {
    title: "Apathetic or Neutral Mood Alignment",
    clinicalRationale:
      "Neutral or numb phases often signify mental fatigue or cognitive overload rather than emotional pathology.",
    evidenceSource: "Mayo Clinic Wellness & Mind-Body Medicine Guidelines",
    immediateAction: [
      "Take a 10-minute mindful sensory walk without headphones, noticing 3 things you can see, hear, and physically feel.",
      "Engage in light physical stretching or dancing to your favorite song for 3 minutes to activate somatic awareness.",
    ],
    nutritionHerbal: [
      "Hydrate with cold water or a refreshing green tea with mint.",
      "Eat a handful of antioxidant-rich blueberries or walnuts.",
    ],
    whenToSeekCare:
      "If emotional numbness or inability to feel pleasure (anhedonia) persists uninterrupted for more than two consecutive weeks, seek a clinical mental health consultation.",
  },

  Joyful: {
    title: "Joyful & Energized Phase Maximizer",
    clinicalRationale:
      "Estrogen and testosterone peaks (frequently mid-follicular and ovulatory phases) enhance neuroplasticity, sociability, and metabolic efficiency.",
    evidenceSource: "ACOG Women's Health & Endocrine Society Clinical Reviews",
    immediateAction: [
      "Channel this natural surge into challenging projects, creative hobbies, or meaningful social connections.",
      "Write a short 3-line gratitude note to anchor this emotional milestone in your memory.",
      "Engage in strength, cardio, or athletic activities your body loves.",
    ],
    nutritionHerbal: [
      "Fuel this phase with wholesome proteins, vibrant vegetables, and plenty of clean hydration.",
    ],
    whenToSeekCare:
      "Enjoy this positive phase! Continue gentle daily tracking to recognize when these positive windows recur in your natural cycle.",
  },

  Calm: {
    title: "Calm & Grounded Maintenance",
    clinicalRationale:
      "Balanced parasympathetic tone and stable hormone levels support optimal immune response and restorative cellular repair.",
    evidenceSource: "Benson-Henry Institute for Mind Body Medicine at Massachusetts General Hospital",
    immediateAction: [
      "Acknowledge and savour this grounded state. Deep breathing while seated comfortably helps reinforce the neurochemical neural pathways of calm.",
      "Engage in quiet reflective reading, journaling, or gentle mobility work.",
    ],
    nutritionHerbal: [
      "Sip warm herbal infusions (rooibos, chamomile, or oat straw tea).",
    ],
    whenToSeekCare:
      "Normal and healthy state. Great time to plan upcoming appointments or organize your medical records.",
  },
};

export const CYCLE_REMEDIES = {
  Menstrual: {
    title: "Menstrual Phase Nourishment & Comfort (Days 1-5)",
    clinicalRationale:
      "Estrogen and progesterone drop to their lowest baseline. The endometrium sheds, which requires replenishment of iron, rest, and pelvic warm comfort.",
    evidenceSource: "ACOG Menstrual Health Guidelines & Harvard Health Nutritional Medicine",
    immediateAction: [
      "Prioritize physical warmth: warm showers, fuzzy socks, and warm packs on the lower abdomen or back.",
      "Scale back high-intensity workouts in favor of restorative yoga, pelvic stretches, and restful sleep.",
    ],
    nutritionHerbal: [
      "Eat iron-replenishing warm foods: lentils, spinach cooked with lemon (vitamin C enhances plant iron absorption), bone broths, and dark chocolate.",
      "Drink red raspberry leaf tea or warm ginger tea to tone uterine smooth muscle.",
      "Limit high-sodium processed foods that worsen cyclic fluid retention.",
    ],
    whenToSeekCare:
      "Consult your doctor if you bleed through a pad or tampon every hour for two or more consecutive hours, pass blood clots larger than a quarter, or feel faint.",
  },

  Follicular: {
    title: "Follicular Phase Energy & Renewal (Days 6-13)",
    clinicalRationale:
      "FSH stimulates follicle maturation; rising estradiol enhances insulin sensitivity, cognitive agility, and muscular energy recovery.",
    evidenceSource: "Endocrine Society Clinical Practice Guidelines",
    immediateAction: [
      "Take advantage of rising energy: optimal time for progressive strength training, learning new skills, and strategic planning.",
      "Prioritize outdoor daylight walks to reinforce strong circadian rhythm.",
    ],
    nutritionHerbal: [
      "Incorporate seed cycling: 1 tbsp raw freshly ground pumpkin and flax seeds daily to support healthy estrogen metabolism.",
      "Focus on fermented foods (kefir, sauerkraut, yogurt) to support the estrobolome (gut bacteria that metabolize estrogen).",
    ],
    whenToSeekCare:
      "Reach out to your gynecologist if your follicular phase is accompanied by irregular spotting or prolonged pelvic discomfort.",
  },

  Ovulation: {
    title: "Ovulation Phase Vitality & Support (Days 14-16)",
    clinicalRationale:
      "Luteinizing Hormone (LH) surge and peak estradiol induce follicle release. Body temperature rises approximately 0.5°F.",
    evidenceSource: "ACOG Clinical Practice Bulletin on Ovulation Tracking",
    immediateAction: [
      "Peak stamina and verbal acuity: great window for high-energy workouts and social or professional presentations.",
      "Be mindful of minor 'Mittelschmerz' (mild one-sided pelvic twinges during egg release) which is normal for 20% of women.",
    ],
    nutritionHerbal: [
      "Stay well-hydrated; cellular turnover and cervical fluid production are at their highest.",
      "Emphasize antioxidant-dense berries, dark leafy greens, and cruciferous vegetables (broccoli, brussels sprouts) containing indole-3-carbinol to assist liver estrogen clearance.",
    ],
    whenToSeekCare:
      "Severe, sharp one-sided abdominal pain that does not subside within a few hours warrants medical evaluation to rule out ovarian cyst rupture or torsion.",
  },

  Luteal: {
    title: "Luteal Phase Serenity & PMS Defense (Days 17-28)",
    clinicalRationale:
      "The corpus luteum secretes progesterone. As progesterone peaks and then falls in late luteal, metabolism increases by 5-10% and serotonin sensitivity shifts.",
    evidenceSource: "Mayo Clinic Women's Health & Royal College of Obstetricians and Gynaecologists",
    immediateAction: [
      "Anticipate lower stamina: switch from high-stress workouts to Pilates, hiking, and bodyweight movements.",
      "Implement strong evening wind-down rituals to prevent luteal phase sleep latency and night sweats.",
    ],
    nutritionHerbal: [
      "Support serotonin synthesis with complex carbohydrates: roasted sweet potatoes, steel-cut oats, and brown rice (avoids blood-sugar crashes).",
      "Seed cycling: Switch to 1 tbsp raw sunflower and sesame seeds daily (provides zinc and selenium for progesterone support).",
      "Cut down on caffeine and alcohol, which heavily aggravate late-luteal anxiety, breast pain, and sleep disruptions.",
    ],
    whenToSeekCare:
      "Consult your doctor if you experience extreme premenstrual depressive episodes, panic attacks, or severe migraines recurring every cycle.",
  },
};

/**
 * Helper to match custom or known symptoms to researched remedies
 */
export function getRemedyForSymptom(symptomName) {
  if (!symptomName) return null;
  const key = symptomName.trim().toLowerCase();

  for (const [k, remedy] of Object.entries(SYMPTOM_REMEDIES)) {
    if (key.includes(k) || k.includes(key)) {
      return remedy;
    }
  }

  // Fallback for custom symptom: Evidence-based general comfort protocol
  return {
    title: `Evidence-Based Care Protocol for "${symptomName}"`,
    category: "General Restorative Protocol",
    clinicalRationale:
      "Unspecified discomfort or acute physical symptoms benefit from parasympathetic rest, systematic hydration, and non-pharmacologic anti-inflammatory care.",
    evidenceSource: "American College of Physicians Clinical Decision Support Guidelines",
    immediateAction: [
      `Take a 10-minute restorative pause in a quiet setting. Rest your body in a comfortable supported posture.`,
      `Apply mild warmth (for muscular tension or cramping) or a cool compress (for throbbing or inflammation).`,
      `Record the onset time, potential triggers, and severity in your FemNura symptom log to discuss with your healthcare provider.`,
    ],
    nutritionHerbal: [
      "Drink 300-500ml of warm water or mild herbal tea (such as chamomile or peppermint).",
      "Eat light, easily digestible, unprocessed foods and avoid stimulants like high caffeine or alcohol.",
    ],
    whenToSeekCare:
      "Seek medical advice if this symptom is severe, unexpected, persistent, or accompanied by red flag symptoms such as fever, shortness of breath, or sharp localized pain.",
  };
}

export function getRemedyForMood(moodName) {
  if (!moodName) return null;
  return MOOD_REMEDIES[moodName] || MOOD_REMEDIES.Neutral;
}

export function getRemedyForCycle(phaseName) {
  if (!phaseName) return null;
  return CYCLE_REMEDIES[phaseName] || CYCLE_REMEDIES.Luteal;
}
