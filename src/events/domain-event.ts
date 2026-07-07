/**
 * Domain Event Type Definitions
 *
 * Domain events represent significant occurrences in the system that other
 * parts of the application may need to react to. Services emit events as
 * part of their ServiceResult, and event handlers process them asynchronously.
 *
 * Event Taxonomy:
 * - DomainEvent: Tenant-scoped events with required organizationId
 * - SystemEvent: Non-tenant-scoped events (infrastructure, system-level)
 */

// ============================================================================
// BASE INTERFACES
// ============================================================================

/**
 * Base properties shared by all events
 */
interface BaseEvent {
  /** Event type identifier (e.g., 'author.created', 'post.published') */
  type: string;
  /** When the event occurred */
  occurredAt: Date;
  /** Optional correlation ID for tracing related events */
  correlationId?: string;
}

/**
 * Domain event interface for tenant-scoped events
 *
 * All domain events MUST include organizationId to ensure tenant isolation
 * during event dispatch, retry, and dead letter handling.
 */
export interface DomainEvent extends BaseEvent {
  /** Organization/tenant ID this event belongs to (RFC 4122 UUID) */
  organizationId: string;
}

/**
 * Alias for DomainEvent for semantic clarity
 *
 * BaseDomainEvent is the same as DomainEvent - use whichever is more
 * descriptive in context.
 */
export type BaseDomainEvent = DomainEvent;

/**
 * System event interface for non-tenant-scoped events
 *
 * System events are for infrastructure or system-level events that
 * are not scoped to a specific tenant/organization.
 */
export interface SystemEvent extends BaseEvent {
  /** Optional flag to explicitly mark as system event */
  isSystemEvent?: true;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if an event is a tenant-scoped DomainEvent
 *
 * @param event - The event to check
 * @returns true if event has organizationId property
 *
 * @example
 * ```typescript
 * if (isDomainEvent(event)) {
 *   // TypeScript knows event.organizationId exists
 *   console.log(event.organizationId);
 * }
 * ```
 */
export const isDomainEvent = (event: DomainEvent | SystemEvent): event is DomainEvent =>
  'organizationId' in event && typeof event.organizationId === 'string';

// ============================================================================
// EVENT HANDLER & DISPATCHER
// ============================================================================

/**
 * Event handler interface
 *
 * Handlers declare which event types they handle and provide
 * a handle method to process those events.
 */
export interface EventHandler<T extends DomainEvent | SystemEvent = DomainEvent> {
  /** Unique name for this handler (used for idempotency tracking) */
  handlerName: string;
  /** Event types this handler processes */
  handles: string[];
  /** Process the event */
  handle: (event: T) => Promise<void>;
}

/**
 * Event dispatcher port interface
 *
 * Dispatches domain events to registered handlers.
 */
export interface EventDispatcherPort {
  /** Dispatch a single event to all relevant handlers */
  dispatch: (event: DomainEvent) => Promise<void>;
  /** Dispatch multiple events */
  dispatchAll: (events: DomainEvent[]) => Promise<void[]>;
}
