// Unified-System-Activation-Kernel.ts
// Deterministic activation kernel for Beast System 3.0.
// Performs readiness checks, initializes engines, and transitions
// the system into sovereign‑safe active state.

import {
  UnifiedSystemRegistry,
  EngineDeclaration,
  PhaseId
} from "./Unified-System-Registry-Core";

import { DependencyGraph } from "./Unified-System-Registry-DependencyGraph";
import { ExecutionLifecycleRegistry } from "./Unified-System-Registry-ExecutionLifecycle";
import { GovernanceRegistry } from "./Unified-System-Registry-GovernanceMap";
import { StructuralRegistry } from "./Unified-System-Registry-StructuralMap";
import { SystemCohesionValidator } from "./Unified-System-Cohesion-Validator";
import { TemporalCausalityEngine } from "./Unified-Temporal-Causality-Engine";
import { ResonanceEquilibriumEngine } from "./Unified-Resonance-Equilibrium-Engine";

export interface ActivationResult {
  phase: PhaseId;
  engineId: string;
  activated: boolean;
}

export class ActivationKernel {
  constructor(
    private readonly registry: UnifiedSystemRegistry,
    private readonly dependencies: DependencyGraph,
    private readonly lifecycle: ExecutionLifecycleRegistry,
    private readonly governance: GovernanceRegistry,
    private readonly structural: StructuralRegistry,
    private readonly temporal: TemporalCausalityEngine,
    private readonly resonance: ResonanceEquilibriumEngine
  ) {}

  activate(): ReadonlyArray<ActivationResult> {
    const validator = new SystemCohesionValidator(
      this.registry,
      this.dependencies,
      this.lifecycle,
      this.governance,
      this.structural
    );

    validator.assert();

    const lifecycleMap = this.lifecycle.buildLifecycleMap();
    const results: ActivationResult[] = [];

    for (const phase of Object.keys(lifecycleMap) as PhaseId[]) {
      const engines = lifecycleMap[phase];

      for (const engine of engines) {
        this.assertDependencies(engine);

        // Temporal causality check
        this.temporal.record(engine, phase);

        // Resonance equilibrium update
        this.resonance.propagate(
          "MOTIF.ACTIVATION",
          0.2,
          1.0
        );
        this.resonance.assertEquilibrium();

        results.push({
          phase,
          engineId: engine.id,
          activated: true
        });
      }
    }

    return results;
  }

  private assertDependencies(engine: EngineDeclaration): void {
    const deps = this.dependencies.dependenciesOf(engine.id);

    for (const dep of deps) {
      const exists = this.registry.listEngines().some(e => e.id === dep);
      if (!exists) {
        throw new Error(
          `Activation violation: engine '${engine.id}' depends on missing engine '${dep}'.`
        );
      }
    }
  }
}

// Example usage
export function createActivationKernel(
  reg: UnifiedSystemRegistry,
  dep: DependencyGraph,
  life: ExecutionLifecycleRegistry,
  gov: GovernanceRegistry,
  struct: StructuralRegistry,
  temporal: TemporalCausalityEngine,
  resonance: ResonanceEquilibriumEngine
) {
  const kernel = new ActivationKernel(
    reg,
    dep,
    life,
    gov,
    struct,
    temporal,
    resonance
  );

  return kernel.activate();
}
