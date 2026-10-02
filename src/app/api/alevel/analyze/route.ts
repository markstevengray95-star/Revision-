import { NextRequest, NextResponse } from 'next/server';
import { generateWithGeminiFallback } from '@/modules/alevel/lib/geminiModel';
import { SchemaType, ResponseSchema } from '@google/generative-ai';
import { offlineMark } from '@/modules/alevel/lib/offlineMarker';

const responseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    marksAwarded: { type: SchemaType.INTEGER },
    totalMarks: { type: SchemaType.INTEGER },
    commandWordCheck: {
      type: SchemaType.OBJECT,
      properties: {
        commandWord: { type: SchemaType.STRING },
        satisfied: { type: SchemaType.BOOLEAN },
        examinerNotes: { type: SchemaType.STRING },
      },
      required: ['commandWord', 'satisfied', 'examinerNotes'],
    },
    keywordAnalysis: {
      type: SchemaType.OBJECT,
      properties: {
        presentKeywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        missingKeywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        laymanTermsUsed: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      },
      required: ['presentKeywords', 'missingKeywords', 'laymanTermsUsed'],
    },
    markingLedger: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          schemePoint: { type: SchemaType.STRING },
          awarded: { type: SchemaType.BOOLEAN },
          studentEvidence: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING },
        },
        required: ['schemePoint', 'awarded', 'studentEvidence', 'reason'],
      },
    },
    creditedPoints: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          mark: { type: SchemaType.STRING },
          studentEvidence: { type: SchemaType.STRING },
        },
        required: ['mark', 'studentEvidence'],
      },
    },
    lostMarksAnalysis: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          reason: { type: SchemaType.STRING },
          improvementSuggestion: { type: SchemaType.STRING },
        },
        required: ['reason', 'improvementSuggestion'],
      },
    },
    lorRubric: {
      type: SchemaType.OBJECT,
      properties: {
        levelAwarded: { type: SchemaType.INTEGER, description: 'Level 1-3 or 0' },
        levelDescription: { type: SchemaType.STRING },
        justification: { type: SchemaType.STRING },
      },
    },
    sigFigUnitAudit: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          issue: { type: SchemaType.STRING },
          suggestion: { type: SchemaType.STRING },
        },
      },
    },
    misconceptions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    inDepthAnalysis: {
      type: SchemaType.OBJECT,
      properties: {
        physicsPrinciples: { type: SchemaType.STRING },
        stepByStepReasoning: { type: SchemaType.STRING },
        structureAndClarity: { type: SchemaType.STRING },
      },
      required: ['physicsPrinciples', 'stepByStepReasoning', 'structureAndClarity'],
    },
    officialMarkScheme: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    modelAnswer: { type: SchemaType.STRING },
    examinerConfidence: { type: SchemaType.INTEGER, description: '0-100 confidence based on evidence completeness' },
    confidenceReason: { type: SchemaType.STRING },
    reviewRecommended: { type: SchemaType.BOOLEAN },
  },
  required: [
    'marksAwarded',
    'totalMarks',
    'commandWordCheck',
    'keywordAnalysis',
    'markingLedger',
    'creditedPoints',
    'lostMarksAnalysis',
    'inDepthAnalysis',
    'officialMarkScheme',
    'modelAnswer',
    'examinerConfidence', 'confidenceReason', 'reviewRecommended',
  ],
};

const SYSTEM_PROMPT = (strictness: string) => `You are a senior AQA A-Level Physics examiner. Mark one student answer using the supplied question, command word, maximum marks and mark scheme.

EXAMINER WORKFLOW (follow in order):
1. Read the whole student answer before deciding any marks.
2. Break the supplied mark scheme into individual creditable points. Never award more marks than those points allow.
3. For each point, search for explicit student evidence and record it before assigning the total.
4. Check contradictions: if the student later clearly contradicts a credited physics statement, do not credit the contradicted statement unless the correct answer is unambiguous elsewhere.
5. For calculations, independently recompute from the student's stated values where possible and distinguish method, substitution, accuracy, unit and explanation marks.
6. For extended responses, apply level descriptors holistically; do not convert a level-of-response question into keyword counting.
7. Only after this evidence audit, total the marks.

MARKING PRIORITY (highest to lowest):
1. The supplied mark scheme is the source of truth for credit. Do not invent extra marks or require wording that the scheme does not require.
2. Credit scientifically equivalent wording when the physics meaning is correct. Do NOT penalise a student merely because they say "voltage" instead of "potential difference" unless the distinction changes the physics meaning in this question.
3. Credit a correct alternative method when it reaches a valid result and does not contradict the mark scheme.
4. Apply standard AQA conventions for linked marks: a later accuracy mark can be earned from a clearly correct method even if an earlier numerical step contains an arithmetic slip, unless the scheme explicitly makes that mark dependent on a correct previous result.
5. Ignore harmless spelling, grammar and notation slips when the intended physics is unambiguous.
6. Penalise contradictions, impossible physics, missing units where the mark scheme explicitly requires them, and incorrect substitutions.

CALCULATION RULES:
- Identify the student's equation, substitutions, intermediate values and final answer.
- Distinguish method marks from accuracy marks.
- Use the student's working, not just the final number.
- Check units and powers of ten.
- Do not award a mark twice for the same piece of evidence.
- Accept sensible rounding unless the scheme specifies a required precision.
- If the student's answer is dimensionally or physically impossible, explain why and do not award an accuracy mark.
- Follow-through: if a student makes one early arithmetic slip but uses their value consistently in a valid method, preserve eligible subsequent method/follow-through credit.

EXPLANATION RULES:
- For B1 points, identify the exact scientifically correct statement that earns the mark.
- For linked explanation chains, only award each point when the causal link is actually present.
- For 6-mark level-of-response questions, judge scientific accuracy, breadth, logical links and quality of explanation rather than simple keyword counting.

${strictness} strictness means rigorous evidence-based marking, not hostile marking. Never guess what the student intended when the wording is materially ambiguous.

FAIRNESS RULES:
- Do not over-credit keyword lists without a correct physical relationship.
- Do not under-credit concise answers that contain all required physics.
- Accept equivalent symbols, standard rearrangements and valid alternative routes.
- Do not penalise significant figures unless the question or scheme requires a specific precision.
- Treat units separately: missing units should not erase a correct method unless that mark specifically depends on units.

CONSISTENCY RULES:
- Build markingLedger before deciding the total.
- markingLedger must contain one row for each supplied mark-scheme line, in the same order.
- For ordinary point-based questions, each one-mark scheme line is either awarded or not awarded; do not invent half marks.
- A scheme point may only be awarded when studentEvidence contains explicit evidence from the student's response.
- Use exactly the same decision threshold for equivalent wording every time: if the physics meaning satisfies the scheme, credit it; if a required relationship/condition is absent, do not.
- Do not let presentation quality, answer length, confidence, grammar or irrelevant extra writing alter the score unless the mark scheme explicitly depends on it.
- For calculations, preserve eligible method/follow-through marks consistently even after an arithmetic error.
- For level-of-response questions, markingLedger records which descriptors/evidence are met, but the holistic level determines the final mark.

OUTPUT RULES:
- marksAwarded MUST be an integer from 0 to maxMarks.
- totalMarks MUST equal maxMarks.
- creditedPoints must cite the student's exact evidence or a faithful short excerpt.
- lostMarksAnalysis should only list marks genuinely unavailable under the supplied scheme.
- keywordAnalysis is diagnostic only and must NEVER determine the mark by itself.
- officialMarkScheme must reproduce the supplied scheme points in concise form.
- modelAnswer must answer the question correctly at the level expected for the mark total.
TWO-PASS FINAL REVIEW:
PASS 1 — Evidence audit: create a private point-by-point ledger of scheme point, student evidence, credit decision and reason.
PASS 2 — Examiner review: reread the whole answer and ledger, check the total for double counting, missed equivalent answers, contradictions, follow-through and level-of-response fairness. Correct the total if needed.
CONFIDENCE: Return examinerConfidence from 0-100. High confidence requires clear evidence and an unambiguous scheme. Lower confidence when handwriting/images are unclear, wording is genuinely ambiguous, a calculation has incomplete working, alternative valid interpretations exist, or an extended response sits between levels. Set reviewRecommended true when confidence is below 70 or the answer is materially ambiguous.
- Return only valid JSON matching the schema.`;

function buildContents(body: any) {
  const {
    studentAnswer,
    studentInlineData,
    questionPrompt,
    questionInlineData,
    commandWord,
    maxMarks,
    markScheme,
    markSchemeInlineData,
    modelAnswer,
  } = body;

  const contents: any[] = [{ text: SYSTEM_PROMPT(body.strictness || 'standard') }];

  if (questionPrompt) contents.push({ text: `Question Prompt: ${questionPrompt}` });
  if (questionInlineData) {
    contents.push({ text: 'Question Image:' });
    contents.push({ inlineData: questionInlineData });
  }

  contents.push({
    text: `Command Word: ${commandWord || 'None specified'}\nMaximum Marks: ${Number.isFinite(Number(maxMarks)) ? Number(maxMarks) : 0}`,
  });

  if (markScheme) {
    const normalized = Array.isArray(markScheme) ? markScheme : [String(markScheme)];
    contents.push({ text: `AUTHORITATIVE MARK SCHEME:\n${normalized.map((m: string, i: number) => `${i + 1}. ${m}`).join('\n')}` });
  }
  if (markSchemeInlineData) {
    contents.push({ text: 'Authoritative Mark Scheme Image:' });
    contents.push({ inlineData: markSchemeInlineData });
  }

  if (modelAnswer) contents.push({ text: `Reference Model Answer (use only as a secondary check; the mark scheme takes precedence): ${modelAnswer}` });

  if (studentAnswer) contents.push({ text: `STUDENT ANSWER:\n${studentAnswer}` });
  if (studentInlineData) {
    contents.push({ text: 'Student Answer Image:' });
    contents.push({ inlineData: studentInlineData });
  }

  return contents;
}

function sanitizeJson(text: string) {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) return cleaned.slice(firstBrace, lastBrace + 1);
  return cleaned;
}

function normalizedScheme(body: any): string[] {
  if (!body?.markScheme) return [] as string[];
  return (Array.isArray(body.markScheme) ? body.markScheme : [String(body.markScheme)])
    .map((item: unknown) => String(item).trim())
    .filter(Boolean);
}

function isLevelOfResponse(body: any) {
  return normalizedScheme(body).some(point => /\[L\d/i.test(point));
}

function sanitizeLedger(value: unknown, scheme: string[]) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, scheme.length).map((item: any, index: number) => ({
    schemePoint: scheme[index] || String(item?.schemePoint || ''),
    awarded: Boolean(item?.awarded),
    studentEvidence: String(item?.studentEvidence || '').trim().slice(0, 800),
    reason: String(item?.reason || '').trim().slice(0, 800),
  }));
}

function ledgerSignature(result: any) {
  return Array.isArray(result?.markingLedger)
    ? result.markingLedger.map((row: any) => Boolean(row?.awarded) ? '1' : '0').join('')
    : '';
}

function ledgerDisagreementCount(a: any, b: any) {
  const first = Array.isArray(a?.markingLedger) ? a.markingLedger : [];
  const second = Array.isArray(b?.markingLedger) ? b.markingLedger : [];
  const length = Math.max(first.length, second.length);
  let disagreements = 0;
  for (let index = 0; index < length; index += 1) {
    if (Boolean(first[index]?.awarded) !== Boolean(second[index]?.awarded)) disagreements += 1;
  }
  return disagreements;
}

function applyObjectiveOfflineCredits(result: any, offlineReference: any, body: any, maxMarks: number) {
  if (!offlineReference || offlineReference.reviewRecommended || isLevelOfResponse(body)) {
    return { result, restored: 0 };
  }

  const scheme = normalizedScheme(body);
  const onlineLedger = sanitizeLedger(result?.markingLedger, scheme);
  const offlineLedger = sanitizeLedger(offlineReference?.markingLedger, scheme);
  const types: string[] = Array.isArray(offlineReference?.offlineDiagnostics?.pointTypes)
    ? offlineReference.offlineDiagnostics.pointTypes
    : [];
  const confidences: number[] = Array.isArray(offlineReference?.offlineDiagnostics?.pointConfidences)
    ? offlineReference.offlineDiagnostics.pointConfidences.map((value: unknown) => Number(value) || 0)
    : [];

  if (!onlineLedger.length || onlineLedger.length !== offlineLedger.length) return { result, restored: 0 };

  let restored = 0;
  const merged = onlineLedger.map((row, index) => {
    const offlineRow = offlineLedger[index];
    const objective = types[index] === 'A' || types[index] === 'C';
    const highConfidence = confidences[index] >= 92;
    const onlineHasConflict = /contradict|crossed|invalid|wrong context|ambiguous/i.test(String(row.reason || ''));

    if (!row.awarded && offlineRow?.awarded && objective && highConfidence && !onlineHasConflict) {
      restored += 1;
      return {
        ...offlineRow,
        reason: `High-confidence deterministic ${types[index] === 'A' ? 'accuracy' : 'method'} evidence restored this mark after AI cross-check.`,
      };
    }
    return row;
  });

  if (!restored) return { result, restored: 0 };
  return {
    result: reconcileResult({ ...result, markingLedger: merged }, body, maxMarks),
    restored,
  };
}

function reconcileResult(data: any, body: any, maxMarks: number) {
  const safeMax = Math.max(0, Math.trunc(Number(maxMarks) || 0));
  const scheme = normalizedScheme(body);
  const ledger = sanitizeLedger(data?.markingLedger, scheme);
  const ledgerCanSetScore = !isLevelOfResponse(body) && scheme.length === safeMax && ledger.length === scheme.length;
  const unsupportedEvidenceCount = ledgerCanSetScore
    ? ledger.filter(row => row.awarded && !row.studentEvidence.trim()).length
    : 0;
  const verifiedLedger = ledgerCanSetScore
    ? ledger.map(row => row.awarded && !row.studentEvidence.trim()
        ? {
            ...row,
            awarded: false,
            reason: row.reason || 'Credit removed because no specific student evidence was supplied for this marking point.',
          }
        : row)
    : ledger;
  const modelMark = Math.max(0, Math.min(safeMax, Math.trunc(Number(data?.marksAwarded) || 0)));
  const ledgerMark = ledgerCanSetScore ? verifiedLedger.reduce((sum, row) => sum + (row.awarded ? 1 : 0), 0) : modelMark;
  const creditedPoints = ledgerCanSetScore
    ? verifiedLedger.filter(row => row.awarded).map(row => ({ mark: row.schemePoint, studentEvidence: row.studentEvidence }))
    : (Array.isArray(data?.creditedPoints) ? data.creditedPoints : []);
  const deniedRows = ledgerCanSetScore ? verifiedLedger.filter(row => !row.awarded) : [];
  const suppliedLostMarks = Array.isArray(data?.lostMarksAnalysis) ? data.lostMarksAnalysis : [];
  const lostMarksAnalysis = ledgerCanSetScore
    ? deniedRows.map((row, index) => {
        const supplied = suppliedLostMarks[index];
        return {
          reason: row.reason || String(supplied?.reason || `No credit for: ${row.schemePoint}`),
          improvementSuggestion: String(
            supplied?.improvementSuggestion ||
            `Add clear evidence that satisfies this marking point: ${row.schemePoint}`,
          ),
        };
      })
    : suppliedLostMarks;

  return {
    ...data,
    marksAwarded: ledgerMark,
    totalMarks: safeMax,
    markingLedger: verifiedLedger,
    creditedPoints,
    lostMarksAnalysis,
    evidenceAudit: {
      unsupportedAwardedPointsRemoved: unsupportedEvidenceCount,
    },
    officialMarkScheme: scheme.length ? scheme : (Array.isArray(data?.officialMarkScheme) ? data.officialMarkScheme : []),
    reviewRecommended: Boolean(data?.reviewRecommended || unsupportedEvidenceCount > 0),
  };
}

export async function POST(req: NextRequest) {
  let body: any;
  let numericMaxMarks = 0;
  try {
    body = await req.json();
    const {
      studentAnswer,
      studentInlineData,
      questionPrompt,
      questionInlineData,
      maxMarks,
      provider = 'online',
      apiKey = '',
    } = body;

    if ((!studentAnswer && !studentInlineData) || (!questionPrompt && !questionInlineData)) {
      return NextResponse.json({ error: 'Missing required fields (need prompt and student answer)' }, { status: 400 });
    }

    numericMaxMarks = Math.max(0, Math.trunc(Number(maxMarks) || 0));
    const requestContents = buildContents(body);
    const offlineReference = studentAnswer
      ? reconcileResult(offlineMark(body), body, numericMaxMarks)
      : null;
    let responseText = '';

    if (provider === 'offline') {
      // Deterministic fallback: works in Vercel/browser deployments without Ollama or an API key.
      return NextResponse.json(reconcileResult(offlineMark(body), body, numericMaxMarks));
    } else {
      const activeKey = apiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        const result = reconcileResult(offlineMark(body), body, numericMaxMarks);
        return NextResponse.json({ ...result, fallbackUsed: true, fallbackReason: 'No AI API key configured; offline examiner used automatically.' });
      }

      const generate = async (contents: unknown) => (await generateWithGeminiFallback({
        apiKey: activeKey,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0,
          topK: 1,
          topP: 0.01,
        },
        contents,
      })).result;

      const result = await generate(requestContents);
      responseText = result.response.text();
    }

    try {
      const parsed = JSON.parse(sanitizeJson(responseText));
      const primary = reconcileResult(parsed, body, numericMaxMarks);

      if (provider === 'offline') {
        return NextResponse.json(primary);
      }

      const activeKey = apiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) return NextResponse.json(primary);

      try {
        const moderationPrompt = {
          text: `MODERATION PASS — independently re-mark the same student answer against the same authoritative mark scheme.
Do not simply agree with the first examiner. Recheck every scheme point from the original evidence.
Use the same equivalence threshold, follow-through rules, unit rules and level-of-response rules every time.
The first examiner returned:
${JSON.stringify(primary)}

DETERMINISTIC OFFLINE CROSS-CHECK (secondary evidence only; never treat it as authoritative):
${offlineReference ? JSON.stringify({
  marksAwarded: offlineReference.marksAwarded,
  examinerConfidence: offlineReference.examinerConfidence,
  reviewRecommended: offlineReference.reviewRecommended,
  markingLedger: offlineReference.markingLedger,
  sigFigUnitAudit: offlineReference.sigFigUnitAudit,
}) : 'Not available for this response.'}

Return a complete fresh result using the required JSON schema. If the first mark is unsupported, correct it. If it is supported, reproduce it. markingLedger must again contain one row per supplied mark-scheme line in the same order.`,
        };

        const moderatedResult = await generateWithGeminiFallback({
          apiKey: activeKey,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0,
            topK: 1,
            topP: 0.01,
          },
          contents: [...requestContents, moderationPrompt],
        });

        const moderatedParsed = JSON.parse(sanitizeJson(moderatedResult.result.response.text()));
        const moderated = reconcileResult(moderatedParsed, body, numericMaxMarks);
        const markChanged = primary.marksAwarded !== moderated.marksAwarded;
        const ledgerChanged = ledgerSignature(primary) !== ledgerSignature(moderated);
        const disagreementCount = ledgerDisagreementCount(primary, moderated);
        const offlineConfidence = Math.trunc(Number(offlineReference?.examinerConfidence) || 0);
        const offlineReliable = Boolean(
          offlineReference
          && offlineConfidence >= 82
          && !offlineReference.reviewRecommended
          && !isLevelOfResponse(body),
        );
        const offlineMarkDiff = offlineReference ? Math.abs(Number(offlineReference.marksAwarded) - moderated.marksAwarded) : 0;
        const offlineLedgerChanged = offlineReliable
          && ledgerSignature(offlineReference) !== ledgerSignature(moderated);
        const calibrationDisagreement = Boolean(offlineReliable && (offlineMarkDiff >= 1 || offlineLedgerChanged));
        let finalResult = moderated;
        let adjudicated = false;

        if (markChanged || ledgerChanged || calibrationDisagreement) {
          const adjudicationPrompt = {
            text: `FINAL ADJUDICATION — two independent examiners disagreed about this response.

EXAMINER 1:
${JSON.stringify(primary)}

EXAMINER 2:
${JSON.stringify(moderated)}

DETERMINISTIC OFFLINE CROSS-CHECK:
${offlineReference ? JSON.stringify({
  marksAwarded: offlineReference.marksAwarded,
  examinerConfidence: offlineReference.examinerConfidence,
  reviewRecommended: offlineReference.reviewRecommended,
  markingLedger: offlineReference.markingLedger,
  sigFigUnitAudit: offlineReference.sigFigUnitAudit,
}) : 'Not available.'}

Resolve ONLY the disputed marking points by returning one complete final result.
- Re-read the original student evidence and authoritative mark scheme yourself.
- Do not average marks and do not choose an examiner by majority or confidence.
- For each disputed scheme point, decide whether the exact required physics is explicitly present or a valid equivalent is present.
- Apply method/follow-through, dependency, units and contradiction rules exactly as stated in the original instructions.
- For non-disputed points, preserve the decision unless you identify a clear marking error.
- For level-of-response questions, make a fresh holistic judgement using the supplied descriptors.
- markingLedger must contain one row per supplied mark-scheme line in original order.
- Return only the required JSON schema.`,
          };

          const adjudicatedResult = await generateWithGeminiFallback({
            apiKey: activeKey,
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema,
              temperature: 0,
              topK: 1,
              topP: 0.01,
            },
            contents: [...requestContents, adjudicationPrompt],
          });
          const adjudicatedParsed = JSON.parse(sanitizeJson(adjudicatedResult.result.response.text()));
          finalResult = reconcileResult(adjudicatedParsed, body, numericMaxMarks);
          adjudicated = true;
        }

        const objectiveCalibration = applyObjectiveOfflineCredits(finalResult, offlineReference, body, numericMaxMarks);
        finalResult = objectiveCalibration.result;
        const changed = primary.marksAwarded !== finalResult.marksAwarded;
        const finalConfidence = Math.max(
          0,
          Math.min(
            100,
            Math.trunc(Number(finalResult.examinerConfidence ?? moderated.examinerConfidence ?? primary.examinerConfidence ?? 0)),
            adjudicated ? 75 : changed ? 80 : 100,
          ),
        );

        return NextResponse.json({
          ...finalResult,
          examinerConfidence: finalConfidence,
          reviewRecommended: Boolean(finalResult.reviewRecommended || adjudicated || changed),
          markingConsistency: {
            moderated: true,
            adjudicated,
            primaryMark: primary.marksAwarded,
            moderatorMark: moderated.marksAwarded,
            finalMark: finalResult.marksAwarded,
            changed,
            ledgerChanged,
            disagreementCount,
            offlineCalibrationUsed: offlineReliable,
            offlineCalibrationMark: offlineReference?.marksAwarded,
            offlineCalibrationDisagreed: calibrationDisagreement,
            objectiveCreditsRestored: objectiveCalibration.restored,
            deterministicLedgerUsed: !isLevelOfResponse(body) && normalizedScheme(body).length === numericMaxMarks,
          },
        });
      } catch (moderationError) {
        console.error('Moderation pass failed; returning primary examiner result:', moderationError);
        return NextResponse.json({
          ...primary,
          markingConsistency: {
            moderated: false,
            primaryMark: primary.marksAwarded,
            finalMark: primary.marksAwarded,
            changed: false,
            deterministicLedgerUsed: !isLevelOfResponse(body) && normalizedScheme(body).length === numericMaxMarks,
          },
        });
      }
    } catch (parseError) {
      console.error('Failed to parse grading response:', responseText);
      return NextResponse.json({ error: 'The AI generated an invalid grading response. Please try submitting again.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('AI marking failed, automatically using offline fallback:', error);
    if (body) {
      const result = reconcileResult(offlineMark(body), body, numericMaxMarks);
      return NextResponse.json({ ...result, fallbackUsed: true, fallbackReason: 'AI service unavailable; offline marker used automatically.' });
    }
    return NextResponse.json({ error: 'Unable to process marking request.' }, { status: 500 });
  }
}

