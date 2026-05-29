const ScoreRing = ({ score }) => {
  const value = Math.min(100, Math.max(0, Number(score) || 0));
  const color =
    value >= 80 ? "text-emerald-600" : value >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="flex flex-col items-center py-4">
      <div
        className={`text-5xl font-bold tabular-nums ${color}`}
        aria-label={`Score ${value} out of 100`}
      >
        {value}
      </div>
      <p className="mt-1 text-sm text-slate-500">out of 100</p>
    </div>
  );
};

const TagList = ({ title, items, variant = "default" }) => {
  if (!items?.length) return null;
  const styles =
    variant === "missing"
      ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
      : variant === "matched"
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <div className="mt-4">
      <h4 className="mb-2 text-xs font-semibold tracking-wide uppercase text-slate-500">
        {title}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className={`px-2.5 py-1 text-xs font-medium rounded-lg ${styles}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const BulletList = ({ title, items }) => {
  if (!items?.length) return null;
  return (
    <div className="mt-4">
      <h4 className="mb-2 text-xs font-semibold tracking-wide uppercase text-slate-500">
        {title}
      </h4>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-brand-500 shrink-0">•</span>
            <span>{typeof item === "string" ? item : item.question || item.answerTip || JSON.stringify(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AIResultDisplay = ({ toolId, payload }) => {
  if (!payload) return null;

  if (toolId === "cover" && payload.coverLetter) {
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
        {payload.coverLetter}
      </div>
    );
  }

  const data = payload?.result ?? payload?.summary ?? payload?.fixed ?? payload;

  if (toolId === "score" && (data.overallScore != null || data.categories)) {
    return (
      <div>
        <ScoreRing score={data.overallScore} />
        {data.categories?.map((cat, i) => (
          <div key={i} className="p-3 mt-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {cat.name}
              </span>
              <span className="text-sm font-bold text-brand-600">{cat.score}/100</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{cat.feedback}</p>
          </div>
        ))}
        <BulletList title="Top improvements" items={data.topImprovements} />
      </div>
    );
  }

  if (toolId === "ats" && (data.atsScore != null || data.matchedKeywords)) {
    return (
      <div>
        <ScoreRing score={data.atsScore} />
        <p className="mb-2 text-sm font-medium text-center text-slate-600">ATS compatibility</p>
        <TagList title="Matched keywords" items={data.matchedKeywords} variant="matched" />
        <TagList title="Missing keywords" items={data.missingKeywords} variant="missing" />
        <BulletList title="Format issues" items={data.formatIssues} />
        <BulletList title="Recommendations" items={data.recommendations} />
      </div>
    );
  }

  if (toolId === "match" && data.matchScore != null) {
    return (
      <div>
        <ScoreRing score={data.matchScore} />
        <p className="mb-2 text-sm font-medium text-center text-slate-600">Job match</p>
        <BulletList title="Strengths" items={data.strengths} />
        <BulletList title="Gaps to address" items={data.gaps} />
        <BulletList title="Tailoring tips" items={data.tailoringTips} />
      </div>
    );
  }

  if (toolId === "keywords") {
    return (
      <div className="space-y-3 text-sm">
        {data.optimizedSummary && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-500">Optimized summary</h4>
            <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
              {data.optimizedSummary}
            </p>
          </div>
        )}
        <BulletList title="Suggested bullets" items={data.suggestedBullets} />
        <TagList title="Keywords to add" items={data.keywordsToAdd} />
      </div>
    );
  }

  if (toolId === "interview") {
    return (
      <div>
        {data.likelyQuestions?.map((q, i) => (
          <div key={i} className="p-3 mt-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{q.question}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{q.answerTip}</p>
          </div>
        ))}
        <BulletList title="Stories to prepare" items={data.behavioralStories} />
        <BulletList title="Questions for the employer" items={data.questionsToAskEmployer} />
      </div>
    );
  }

  if (typeof data === "string") {
    return (
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
        {data}
      </p>
    );
  }

  return (
    <p className="text-sm text-slate-500">
      Results received. Try refreshing or running the tool again.
    </p>
  );
};

export default AIResultDisplay;
