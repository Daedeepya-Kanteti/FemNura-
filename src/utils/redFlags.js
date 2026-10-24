// FemNura Clinical Red Flag Detection Engine
// Identifies life-threatening or emergency symptoms requiring urgent medical evaluation

export const RED_FLAG_CRITERIA = [
  {
    id: "unilateral_pelvic_pain",
    title: "Severe One-Sided / Unilateral Pelvic Pain",
    concern: "Risk of ovarian torsion or ruptured cyst. Requires immediate clinical ultrasound.",
    matches: (text) => {
      const t = text.toLowerCase();
      if (t.includes("ovarian torsion") || t.includes("twisted ovary")) return true;
      const isUnilateral = t.includes("one-sided") || t.includes("one sided") || t.includes("unilateral") || t.includes("sharp right") || t.includes("sharp left");
      const isPelvic = t.includes("pelvic") || t.includes("ovary") || t.includes("lower belly") || t.includes("lower abdomen") || t.includes("cramp");
      return isUnilateral && isPelvic;
    },
  },
  {
    id: "heavy_hemorrhage",
    title: "Severe Heavy Menstrual Hemorrhage",
    concern: "Risk of acute blood loss and hypovolemia. Soaking a pad in under an hour is a medical red flag.",
    matches: (text) => {
      const t = text.toLowerCase();
      if (t.includes("hemorrhage") || t.includes("soaking through pad") || t.includes("pad in under an hour") || t.includes("pad an hour") || t.includes("soaking a pad")) {
        return true;
      }
      return (t.includes("bleeding") || t.includes("flow") || t.includes("period")) && (t.includes("soaking") || t.includes("hourly") || t.includes("every hour") || t.includes("flooding"));
    },
  },
  {
    id: "ectopic_pregnancy_bleeding",
    title: "Pregnancy Bleeding or Suspected Ectopic Pregnancy",
    concern: "Risk of ruptured ectopic pregnancy or acute obstetric complication. Emergency evaluation required.",
    matches: (text) => {
      const t = text.toLowerCase();
      if (t.includes("ectopic") || t.includes("shoulder tip pain") || t.includes("pregnancy bleeding") || t.includes("pregnant bleeding")) {
        return true;
      }
      const isPregnant = t.includes("pregnant") || t.includes("pregnancy") || t.includes("positive test");
      const hasPainOrBleed = t.includes("bleeding") || t.includes("spotting") || t.includes("severe pain") || t.includes("cramps");
      return isPregnant && hasPainOrBleed;
    },
  },
  {
    id: "fainting_syncope",
    title: "Fainting or Loss of Consciousness (Syncope)",
    concern: "Loss of consciousness combined with pelvic or abdominal pain can indicate internal hemorrhage or circulatory collapse.",
    matches: (text) => {
      const t = text.toLowerCase();
      return (
        t.includes("fainted") ||
        t.includes("fainting") ||
        t.includes("passed out") ||
        t.includes("blacked out") ||
        t.includes("syncope") ||
        t.includes("loss of consciousness")
      );
    },
  },
  {
    id: "fever_pelvic_pid",
    title: "High Fever with Acute Pelvic Pain / Severe PID",
    concern: "Potential severe Pelvic Inflammatory Disease (PID) or tubo-ovarian abscess requiring immediate IV antibiotics.",
    matches: (text) => {
      const t = text.toLowerCase();
      if (t.includes("pelvic inflammatory") || t.includes("severe pid") || t.includes("cervical motion tenderness")) {
        return true;
      }
      const hasFever = t.includes("fever") || t.includes("chills") || t.includes("shivering") || t.includes("high temp");
      const hasPelvic = t.includes("pelvic") || t.includes("discharge") || t.includes("lower abdomen") || t.includes("uterus");
      return hasFever && hasPelvic;
    },
  },
  {
    id: "thromboembolism_dvt_pe",
    title: "Suspected Deep Vein Thrombosis (DVT) or Pulmonary Distress",
    concern: "Risk of venous thromboembolism. Sudden chest pain, breathlessness, or hot unilateral calf swelling requires urgent ER triage.",
    matches: (text) => {
      const t = text.toLowerCase();
      if (t.includes("dvt") || t.includes("pulmonary embolism") || t.includes("blood clot in leg") || t.includes("coughing blood")) {
        return true;
      }
      const isClotSign = t.includes("calf swelling") || (t.includes("calf") && (t.includes("swollen") || t.includes("hot") || t.includes("red")));
      const isSevereBreathing = t.includes("sudden chest pain") || (t.includes("severe breathlessness") && t.includes("sudden"));
      return isClotSign || isSevereBreathing;
    },
  },
];

/**
 * Scans one or more text inputs (or an array of symptoms/notes) for clinical emergency red flags.
 * Returns the first matched red flag object, or null.
 */
export function detectRedFlags(...inputs) {
  const combinedText = inputs
    .filter((inp) => Boolean(inp))
    .map((inp) => (typeof inp === "string" ? inp : JSON.stringify(inp)))
    .join(" ");

  if (!combinedText.trim()) return null;

  for (const criterion of RED_FLAG_CRITERIA) {
    if (criterion.matches(combinedText)) {
      return {
        id: criterion.id,
        title: criterion.title,
        concern: criterion.concern,
        detectedIn: combinedText.slice(0, 80),
      };
    }
  }

  return null;
}
