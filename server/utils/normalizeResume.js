/** Normalize legacy `comapny` field and experience shape for API responses */
export const normalizeResumeDoc = (resume) => {
  if (!resume) return resume;
  const doc = resume.toObject ? resume.toObject() : { ...resume };

  if (Array.isArray(doc.experience)) {
    doc.experience = doc.experience.map((exp) => ({
      ...exp,
      company: exp.company || exp.comapny || "",
    }));
  }

  return doc;
};

/** Map frontend `company` to schema fields before save */
export const normalizeResumePayload = (payload) => {
  const data = structuredClone(payload);
  if (Array.isArray(data.experience)) {
    data.experience = data.experience.map((exp) => {
      const company = exp.company || exp.comapny || "";
      return { ...exp, company, comapny: company };
    });
  }
  return data;
};
