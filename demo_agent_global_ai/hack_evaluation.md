# AI Travel Agent Hackathon Evaluation

## 1. Overall Score

| Criterion | Maximum | Awarded | Percentage |
|---|---:|---:|---:|
| Problem Statement Alignment | 100 | 10 | 10% |
| Code Quality | 100 | 70 | 70% |
| Innovation | 100 | 25 | 25% |
| Security | 100 | 62 | 62% |
| Grounding & Evals | 50 | 5 | 10% |
| **Total** | **450** | **172** | **38.22%** |

## 2. Executive Summary

The submitted project is a modular, general-purpose LangGraph chat demo with a calculator and UTC clock. It is not an AI travel agent: there is no travel-specific intent or constraint model, destination discovery, transport or lodging data, itinerary builder, budget feasibility check, personalization, or travel-plan replanning. The existing graph can call tools and retain messages through SQLite checkpointing, but those foundations alone do not satisfy the challenge outcomes.

The strongest reusable work is the AST-based calculator, clear separation between graph, tools, configuration, and persistence, and a small offline test suite. The largest risks are unsupported travel answers (there are no travel data sources), lack of end-to-end travel evaluations, no explicit prompt-injection boundaries, and no application-level limit on repeated tool cycles.

**Judging principle:** Scores reward demonstrated travel-agent outcomes, not framework complexity. The challenge statement supplied for this evaluation is the ground truth. The earlier report scored a different, generic demo problem and its scores do not apply here.

## 3. Criteria

### 3.1 Problem Statement Alignment - 10/100

**Assessment:** The implementation demonstrates a generic tool-calling agent, but does not implement the requested travel-planning workflow.

**Evidence:**
- The system prompt names only a calculator and UTC time tool in [app/prompts/agent.py](app/prompts/agent.py).
- The tool registry exposes only `calculate` and `get_current_time` in [app/tools/registry.py](app/tools/registry.py).
- [app/main.py](app/main.py) accepts free-form chat input and prints the last model response; it has no travel-plan input, itinerary format, or re-planning interaction.
- The configured LLM and LangGraph flow provide a usable generic agent shell in [app/llm/factory.py](app/llm/factory.py) and [app/graph/builder.py](app/graph/builder.py).

**Strengths:** A user can converse with a tool-calling agent, and the graph has a tool loop and persistent thread configuration.

**Gaps:** No structured extraction of origin, dates/duration, party size, budget, interests, pace, or constraints. No destination or itinerary recommendations, travel inventory, source-grounded costs, practical budget breakdown, personalization, or adaptation when requirements change.

**Priority:** Build an end-to-end travel request-to-itinerary flow that carries hard constraints and preferences through planning and re-planning. Do not present invented prices or availability as verified.

### 3.2 Code Quality - 70/100

**Assessment:** The general demo has a readable modular layout and a narrow set of focused tests. Its current quality does not compensate for the missing product workflow, and important scaffolding is unused.

**Evidence:**
- Settings are centralized with Pydantic in [app/config/settings.py](app/config/settings.py); the LLM factory is isolated in [app/llm/factory.py](app/llm/factory.py).
- Graph nodes, routing, state, and tool registration are separated across [app/graph/nodes.py](app/graph/nodes.py), [app/graph/builder.py](app/graph/builder.py), [app/graph/state.py](app/graph/state.py), and [app/tools/registry.py](app/tools/registry.py).
- [tests/test_graph.py](tests/test_graph.py) checks routing and compilation; [tests/test_tools.py](tests/test_tools.py) covers calculator behavior, rejection cases, and time output.
- `user_id`, `session_id`, and `metadata` are declared in state, and an `InMemoryStore` is constructed and passed to the graph, but no node reads or writes that store.
- `fastapi` and `uvicorn` are listed in [requirements.txt](requirements.txt), while the documented entry point is a CLI and the inspected project contains no API implementation.

**Strengths:** Components are easy to locate, settings and tool creation are centralized, and the calculator has explicit error handling.

**Gaps:** No travel-domain contracts or workflow tests, unused state/store, dependencies without an implemented server use case, and no automated test results could be confirmed in this environment.

### 3.3 Innovation - 25/100

**Assessment:** There are a couple of useful implementation choices in the demo, but no distinctive travel-planning capability or outcome is present.

**Evidence:**
- [app/tools/common.py](app/tools/common.py) uses a restricted AST evaluator rather than Python `eval()`.
- [evals/models/groq_eval_model.py](evals/models/groq_eval_model.py) adapts Groq for DeepEval and retries rate-limit errors.
- The orchestration in [app/graph/builder.py](app/graph/builder.py) is a standard single-agent/tool cycle; the tools do not supply travel information.

**Strengths:** Safe arithmetic is a useful custom tool, and the custom judge adapter addresses a concrete evaluation integration need.

**Gaps:** No evidence-backed itinerary optimization, preference learning, constraint trade-offs, travel-specific adaptation, or other user-visible travel innovation. More agents or framework components would not address the core gap without verified recommendations.

### 3.4 Security - 62/100

**Assessment:** The calculator has good execution boundaries, but conversational and agent-runtime safeguards are incomplete. Travel-specific data-source risks cannot be assessed because no travel integrations exist.

**Evidence:**
- The calculator uses an allowlist of AST node/operator types and rejects unsupported expressions; tests include an import/system-call attempt and an excessive exponent in [tests/test_tools.py](tests/test_tools.py).
- `.env` is excluded by [.gitignore](.gitignore), and reviewed code obtains the Groq key from settings rather than embedding a credential.
- [app/graph/nodes.py](app/graph/nodes.py) forwards the conversation directly alongside the system prompt without an explicit untrusted-input boundary.
- [app/graph/builder.py](app/graph/builder.py) routes any tool call back to the agent and does not define an application-specific tool-cycle ceiling.
- [app/memory/checkpointer.py](app/memory/checkpointer.py) uses one SQLite connection with `check_same_thread=False`; SQLite remains a potential contention point under concurrent use.

**Strengths:** The calculator is substantially safer than unrestricted code evaluation, and local environment secrets are ignored by Git.

**Gaps:** No explicit prompt-injection handling, bounded tool-call budget, or travel-source validation policy. Security posture for external content, booking actions, and personal travel data is not demonstrated.

**Priority:** Treat user text and any future retrieved travel content as untrusted; constrain tool permissions and execution budgets, and require confirmation before consequential booking or purchase actions.

### 3.5 Grounding & Evals - 5/50

**Assessment:** There is evaluation infrastructure, but it does not measure grounded travel recommendations or any of the challenge's central behaviors.

**Evidence:**
- [evals/datasets/basic_cases.json](evals/datasets/basic_cases.json) contains two calculator cases and two generic question-answer relevancy cases; none concerns travel.
- [evals/deterministic/test_calculator.py](evals/deterministic/test_calculator.py) invokes the calculator directly, not the agent's travel-planning trajectory.
- [evals/llm_based/test_relevancy.py](evals/llm_based/test_relevancy.py) measures answer relevancy on generic questions. It does not check source accuracy, constraint satisfaction, tool choice, budget arithmetic, itinerary practicality, personalization, or adaptation.
- The available tools provide arithmetic and current UTC time only; no authoritative travel source is queried or cited.

**Strengths:** A deterministic test harness and a Groq-backed LLM judge adapter exist.

**Gaps:** No travel dataset, citations/provenance, freshness or availability checks, travel trajectory tests, or measures for safety and replanning. The judge metric alone cannot establish factual correctness.

**Priority:** Add deterministic travel scenarios with mocked, attributable source data; assert every hard constraint and budget total, tool usage, response provenance, and changed-plan behavior. Add live-source checks only where credentials and stable test conditions are available.

## 4. Cross-Cutting Findings

- **Capability mismatch:** The submitted product is a generic calculator/time agent, not a travel agent. This is the dominant challenge outcome and scoring gap.
- **Grounding:** No source-backed destination, schedule, fare, lodging, or activity data is available. A fluent itinerary from the current model would not be evidence of practical or current recommendations.
- **Replanning:** Conversation checkpointing preserves thread messages, but no travel plan schema or explicit constraint update/revalidation workflow exists.
- **Testability:** Existing unit tests are useful for the implemented demo tools, but they provide no coverage of the challenge's required behavior.
- **Deployment:** README describes local setup and CLI use; the presence of FastAPI dependencies is not evidence of a deployed API.

## 5. Critical Gaps and Risks

| Finding | Severity | Status | Evidence | Impact |
|---|---|---|---|---|
| No travel-planning features or travel tools | High | Confirmed | System prompt and registry expose only calculator/time tools | Cannot meet the requested travel planning outcomes |
| Travel facts, prices, and availability have no source grounding | High | Confirmed | No travel retrieval/API integration; eval dataset has no travel cases | Recommendations may be fabricated, stale, or infeasible |
| No constraint, personalization, or re-planning evaluation | High | Confirmed | Existing cases cover arithmetic and generic relevancy only | Core quality and adaptation cannot be demonstrated |
| No explicit untrusted-input boundary or application tool-cycle cap | Medium | Confirmed in inspected graph/prompt path | Prompt forwards messages; routing has no custom ceiling | Prompt injection and excessive tool usage are insufficiently controlled |
| Inactive state/store fields and unused web dependencies | Low | Confirmed | State/store unused by nodes; FastAPI/Uvicorn have no implementation | Misleading scaffolding and unnecessary maintenance/dependency surface |

## 6. Verification and Limitations

- Static inspection covered the README, requirements, CLI, graph/state/nodes, prompt, tools, memory, settings, unit tests, and evaluation code/data.
- Attempted `pytest tests evals/deterministic -q`; PowerShell could not find `pytest` on PATH.
- Attempted `python -m pytest tests evals/deterministic -q` with the available Python 3.14 interpreter; `pytest` is not installed. Therefore, no tests are reported as passing or failing.
- The LLM-based evaluation was not run: it requires an installed test/evaluation environment and a configured Groq API key, and its current test cases are unrelated to travel regardless.
- The configured hack-eval skill referenced by repository instructions was not present at its stated external path; this assessment follows the repository's visible rubric and the challenge statement supplied by the user.

## 7. Final Verdict

**172/450 (38.22%)** for the AI Travel Agent challenge. The project has a reasonable generic agent foundation and a safely constrained calculator, but it does not currently demonstrate travel intent understanding, practical sourced itineraries, personalization, or re-planning. The next meaningful milestone is a small, end-to-end travel workflow with explicit constraints, attributable data, budget validation, and deterministic trajectory evaluations.
